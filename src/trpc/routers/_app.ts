// import { z } from 'zod';
import { createTRPCRouter } from '../init';
import { agentsRouter } from '@/modules/agents/server/procedures';
import { meetingRouter } from '@/modules/meetings/server/procedures';
import { premiumRouter } from '@/modules/premium/server/procedure';

export const appRouter = createTRPCRouter({
  agents: agentsRouter,
  meeting: meetingRouter,
  premium: premiumRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;