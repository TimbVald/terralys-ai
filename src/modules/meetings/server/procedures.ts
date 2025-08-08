import { db } from "@/db";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { } from "@trpc/client";
import { agents, meeting } from "@/db/schema";
import { and, count, desc, eq, getTableColumns, ilike, sql } from "drizzle-orm";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "@/constants";
import { meetingInsertSchema, meetingUpdateSchema } from "../schema";
import { MeetingStatus } from "../types";

export const meetingRouter = createTRPCRouter({
    getOne: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ input, ctx }) => {
        try {
            const [existingMeeting] = await db
                .select({
                    ...getTableColumns(meeting),
                    agent: agents,
                    duration: sql<number>`EXTRACT(EPOCH FROM (ended_at - started_at))`.as('duration'),
                })
                .from(meeting).innerJoin(
                    agents,
                    eq(meeting.agentId, agents.id)
                ).where(and(eq(meeting.id, input.id), eq(meeting.userId, ctx.auth.user.id)));

            if (!existingMeeting) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Meeting not found',
                });
            }

            return existingMeeting;
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
        agentId: z.string().nullish(),
        status: z.enum([
            MeetingStatus.Upcoming,
            MeetingStatus.Active,
            MeetingStatus.Completed,
            MeetingStatus.Processing,
            MeetingStatus.Cancelled,
        ]).nullish(),
    })).query(async ({ ctx, input }) => {
        try {
            const { page, pageSize, search, status, agentId } = input;
            const data = await db.select(
                {
                    ...getTableColumns(meeting),
                    agent: agents,
                    duration: sql<number>`EXTRACT(EPOCH FROM (ended_at - started_at))`.as('duration'),
                }
            ).from(meeting).innerJoin(
                agents,
                eq(meeting.agentId, agents.id)
            ).where(
                and(
                    eq(meeting.userId, ctx.auth.user.id),
                    search ? ilike(meeting.name, `%${search}%`) : undefined,
                    status ? eq(meeting.status, status) : undefined,
                    agentId ? eq(meeting.agentId, agentId) : undefined,
                )
            )
                .orderBy(desc(meeting.createdAt), desc(meeting.id))
                .limit(pageSize)
                .offset((page - 1) * pageSize);

            const [total] = await db.select({
                count: count()
            })
                .from(meeting)
                .innerJoin(
                    agents,
                    eq(meeting.agentId, agents.id)
                )
                .where(
                    and(
                        eq(meeting.userId, ctx.auth.user.id),
                        search ? ilike(meeting.name, `%${search}%`) : undefined,
                        status ? eq(meeting.status, status) : undefined,
                        agentId ? eq(meeting.agentId, agentId) : undefined,
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

    create: protectedProcedure.input(meetingInsertSchema).mutation(async ({ input, ctx }) => {
        try {
            const [createdMeeting] = await db.insert(meeting).values({
                ...input,
                userId: ctx.auth.user.id,
            }).returning();

            return createdMeeting;

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

    update: protectedProcedure.input(meetingUpdateSchema).mutation(async ({ input, ctx }) => {
        try {
            const [updatedMeeting] = await db.update(meeting).set(input).where(and(eq(meeting.id, input.id), eq(meeting.userId, ctx.auth.user.id))).returning();

            if (!updatedMeeting) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Meeting not found',
                });
            }
            return updatedMeeting;
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
            const [deletedMeeting] = await db.delete(meeting).where(and(eq(meeting.id, input.id), eq(meeting.userId, ctx.auth.user.id))).returning();
            if (!deletedMeeting) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Meeting not found',
                });
            }
            return deletedMeeting;
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