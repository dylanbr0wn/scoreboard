import { z } from 'zod';

export const zTeam = z.object({
    id: z.string().optional(),
    name: z.string().optional(),
    createdAt: z.string().optional(),
    boardId: z.string().optional(),
    logo: z.string().optional().nullable(),
    score: z.number().min(0).optional(),

})