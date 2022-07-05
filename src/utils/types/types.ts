import { z } from 'zod';

export const zTeam = z.object({
    id: z.string().optional(),
    name: z.string().optional(),
    createdAt: z.date().optional(),
    boardId: z.string().optional(),
    logo: z.string().optional().nullable(),
    score: z.number().optional(),

})

export type Team = z.infer<typeof zTeam>;
export const zBoard = z.object({
    id: z.string(),
    isOpen: z.boolean(),
    createdAt: z.date().optional(),
    name: z.string(),
    teams: z.array(zTeam).optional(),
    goalTime: z.number().optional(),
    timeSurpassed: z.number().optional(),
    isRunning: z.boolean().optional(),
    countDown: z.boolean().optional(),
    initialTimeStateChange: z.date().optional().nullable(),
    lastTimeStateChange: z.date().optional().nullable(),
    userId: z.string().optional(),
});
export type Board = z.infer<typeof zBoard>;