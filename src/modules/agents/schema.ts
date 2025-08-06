import z from "zod";


export const agentInsertSchema = z.object({
    name: z.string().min(3, {message: "Required the name of the agent"}),
    instruction: z.string().min(5, {message: "Required at least 5 characters for the instruction"}),
})
