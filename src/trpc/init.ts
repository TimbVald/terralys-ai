import { db } from '@/db';
import { agents, meeting } from '@/db/schema';
import { auth } from '@/lib/auth';
import { polarClient } from '@/lib/polar';
import { MAX_FREE_AGENTS, MAX_FREE_MEETINGS } from '@/modules/premium/constants';
import { initTRPC, TRPCError } from '@trpc/server';
import { count, eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { cache } from 'react';

/**
 * Type du contexte tRPC
 */
export type TRPCContext = {
  session: Awaited<ReturnType<typeof auth.api.getSession>> | null;
};

export const createTRPCContext = cache(async (): Promise<TRPCContext> => {
  /**
   * @see: https://trpc.io/docs/server/context
   */
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    return { session };
  } catch (error) {
    return { session: null };
  }
});

// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.context<TRPCContext>().create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  // transformer: superjson,
});
// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;

export const protectedProcedure = baseProcedure.use(async ({ ctx, next }) => {
  try {
    if (!ctx.session) {
      throw new TRPCError({ code: 'UNAUTHORIZED' })
    }
    return next({ ctx: { ...ctx, auth: ctx.session } })
  } catch (error) {
    // Handle database connection errors
    if (error instanceof Error && error.message.includes('Connect Timeout Error')) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Database connection timeout. Please try again.',
        cause: error
      })
    }
    // Re-throw other errors
    throw error
  }
})

export const premiumProcedure = (entity: "meetings" | "agents") => protectedProcedure.use(async ({ ctx, next }) => {
  const customer = await polarClient.customers.getStateExternal({
    externalId: ctx.auth.user.id,
  })

  const [userMeetings] = await db
    .select({
      count: count(meeting.id),
    })
    .from(meeting)
    .where(eq(meeting.userId, ctx.auth.user.id));

  const [userAgents] = await db
    .select({
      count: count(agents.id),
    })
    .from(agents)
    .where(eq(agents.userId, ctx.auth.user.id));

  const isPremium = customer.activeSubscriptions.length > 0;
  const isFreeAgentLimitReached = userAgents.count >= MAX_FREE_AGENTS;
  const isFreeMeetingLimitReached = userMeetings.count >= MAX_FREE_MEETINGS;

  const shouldThrowMeetingError = entity === "meetings" && isFreeMeetingLimitReached && !isPremium;
  const shouldThrowAgentError = entity === "agents" && isFreeAgentLimitReached && !isPremium;

  if (shouldThrowMeetingError) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'You have reached the maximum number of free meetings. Please upgrade to continue.',
    })
  }

  if (shouldThrowAgentError) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'You have reached the maximum number of free agents. Please upgrade to continue.',
    })
  }

  return next({ ctx: { ...ctx, customer } });

})
