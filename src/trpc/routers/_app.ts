// import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';
import { agentsRouter } from '@/modules/agents/server/procedures';
import { meetingRouter } from '@/modules/meetings/server/procedures';


export const appRouter = createTRPCRouter({
  agents: agentsRouter,
  meeting: meetingRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;