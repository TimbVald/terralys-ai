import z from "zod";


export const meetingInsertSchema = z.object({
    name: z.string().min(3, {message: "Le nom de la réunion est requis"}),
    agentId: z.string().min(5, {message: "L'agent est requis"}),
});

export const meetingUpdateSchema = meetingInsertSchema.extend({
    id: z.string().min(1, {message: "L'identifiant de la réunion est requis"}),
});

