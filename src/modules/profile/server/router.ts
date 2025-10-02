import { z } from 'zod';
import { protectedProcedure, createTRPCRouter } from '@/trpc/init';
import { db } from '@/db';
import { user as userTable } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(64),
  image: z.string().url().or(z.literal('')).optional(),
});

export const profileRouter = createTRPCRouter({
  update: protectedProcedure
    .input(updateProfileSchema)
    .mutation(async ({ input, ctx }) => {
      const { name, image } = input;
      const userId = ctx.auth.user.id;
      const [updated] = await db
        .update(userTable)
        .set({
          name,
          image: image ?? null,
          updatedAt: new Date(),
        })
        .where(eq(userTable.id, userId))
        .returning();
      return updated;
    }),
});
