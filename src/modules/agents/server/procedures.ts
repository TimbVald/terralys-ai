import { db } from "@/db";
import { createTRPCRouter, premiumProcedure, protectedProcedure } from "@/trpc/init";
import { } from "@trpc/client";
import { agents, meeting } from "@/db/schema";
import { agentInsertSchema, agentUpdateSchema } from "../schema";
import { and, count, desc, eq, getTableColumns, ilike } from "drizzle-orm";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "@/constants";

export const agentsRouter = createTRPCRouter({
    getOne: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ input, ctx }) => {
        try {
            const [existingAgent] = await db
            .select({
                ...getTableColumns(agents),
                meetingCount: db.$count(meeting, eq(agents.id, meeting.agentId))
            })
            .from(agents)
            .where(and(eq(agents.id, input.id), eq(agents.userId, ctx.auth.user.id)));

            if (!existingAgent) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Agent not found',
                });
            }

            return existingAgent;
        } catch (error) {
            if (error instanceof TRPCError) {
                throw error;
            }
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'An unknown error occurred',
            });
        }
    }),
    getMany: protectedProcedure.input(z.object({
        page: z.number().default(DEFAULT_PAGE),
        pageSize: z.number().min(MIN_PAGE_SIZE).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
        search: z.string().nullish(),
    })).query(async ({ ctx, input }) => {
        try {
            const { page, pageSize, search } = input;
            const data = await db.select(
                {
                    ...getTableColumns(agents),
                    meetingCount: db.$count(meeting, eq(agents.id, meeting.agentId))
                }
            ).from(
                agents
            ).where(
                and(
                    eq(agents.userId, ctx.auth.user.id),
                    search ? ilike(agents.name, `%${search}%`) : undefined
                )
            )
                .orderBy(desc(agents.createdAt), desc(agents.id))
                .limit(pageSize)
                .offset((page - 1) * pageSize);

            const [total] = await db.select({
                count: count()
            })
                .from(agents)
                .where(
                    and(
                        eq(agents.userId, ctx.auth.user.id),
                        search ? ilike(agents.name, `%${search}%`) : undefined
                    )
                );

            const totalPages = Math.ceil(total.count / pageSize)
            // await new Promise(resolve => setTimeout(resolve, 5000));

            return {
                items: data,
                total: total.count,
                totalPages,
            };
        } catch (error) {
            if (error instanceof TRPCError) {
                throw error;
            }
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'An unknown error occurred',
            });
        }
    }),
    create: premiumProcedure("agents").input(agentInsertSchema).mutation(async ({ input, ctx }) => {
        try {
            const [createdAgent] = await db.insert(agents).values({
                ...input,
                userId: ctx.auth.user.id,
            }).returning();
            return createdAgent;
        } catch (error) {
            if (error instanceof TRPCError) {
                throw error;
            }
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'An unknown error occurred',
            });
        }
    }),
    remove: protectedProcedure.input(z.object({ id: z.string() })).mutation(async ({ input, ctx }) => {
        try {
            const [deletedAgent] = await db.delete(agents).where(and(eq(agents.id, input.id), eq(agents.userId, ctx.auth.user.id))).returning();
            if (!deletedAgent) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Agent not found',
                });
            }
            return deletedAgent;
        } catch (error) {
            if (error instanceof TRPCError) {
                throw error;
            }
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'An unknown error occurred',
            });
        }

    }),
    update: protectedProcedure.input(agentUpdateSchema).mutation(async ({ input, ctx }) => {
        try {
            const [updatedAgent] = await db.update(agents).set(input).where(and(eq(agents.id, input.id), eq(agents.userId, ctx.auth.user.id))).returning();
            if (!updatedAgent) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Agent not found',
                });
            }
            return updatedAgent;
        } catch (error) {
            if (error instanceof TRPCError) {
                throw error;
            }
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'An unknown error occurred',
            });
        }
    }),
})