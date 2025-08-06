import { db } from "@/db";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "@/trpc/init";
import {  } from "@trpc/client";
import { agents } from "@/db/schema";
import { agentInsertSchema } from "../schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const agentsRouter = createTRPCRouter({
    getOne: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
        try {
            const [existingAgent] = await db.select().from(agents).where(eq(agents.id, input.id));

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

    getMany: protectedProcedure.query(async () => {
        try {
            const data = await db.select().from(agents);

            await new Promise(resolve => setTimeout(resolve, 5000));

            return data;
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
    create: protectedProcedure.input(agentInsertSchema).mutation(async ({ input, ctx }) => {
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
    })
})