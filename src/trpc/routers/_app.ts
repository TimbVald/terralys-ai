// import { z } from 'zod';
import { createTRPCRouter } from '../init';
import { agentsRouter } from '@/modules/agents/server/procedures';
import { meetingRouter } from '@/modules/meetings/server/procedures';
import { premiumRouter } from '@/modules/premium/server/procedure';
import { plantDiseaseDetectionRouter } from '@/modules/plant-disease-detection/server/procedures';
import { dataExplorerRouter } from '@/modules/data-explorer/server/procedures';


export const appRouter = createTRPCRouter({
  agents: agentsRouter,
  meeting: meetingRouter,
  premium: premiumRouter,
  plantDiseaseDetection: plantDiseaseDetectionRouter,
  dataExplorer: dataExplorerRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;