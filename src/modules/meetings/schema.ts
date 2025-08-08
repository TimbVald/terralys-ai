import z from "zod";


export const meetingInsertSchema = z.object({
    name: z.string().min(3, {message: "Required the name of the meeting"}),
    agentId: z.string().min(5, {message: "Agent is Required"}),
});

export const meetingUpdateSchema = meetingInsertSchema.extend({
    id: z.string().min(1, {message: "Required the id of the meeting"}),
});

