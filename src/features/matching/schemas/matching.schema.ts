import { z } from 'zod';

export const sendMatchRequestSchema = z.object({
    receiverId: z.string().min(1, "Receiver ID is required"),
    skill: z.string().min(1, "Skill is required"),
});

export type SendMatchRequestInput = z.infer<typeof sendMatchRequestSchema>;
