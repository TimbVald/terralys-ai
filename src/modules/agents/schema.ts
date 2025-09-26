import z from "zod";


export const agentInsertSchema = z.object({
    name: z.string().min(3, {message: "Le nom de l'agent est requis"}),
    instruction: z.string().min(5, {message: "Au moins 5 caractères sont requis pour les instructions"}),
});

export const agentUpdateSchema = agentInsertSchema.extend({
    id: z.string().min(1, {message: "L'identifiant de l'agent est requis"}),
});

