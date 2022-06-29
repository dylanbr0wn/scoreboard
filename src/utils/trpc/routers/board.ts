import * as trpc from '@trpc/server';
import { z } from 'zod';
import * as trpcNext from '@trpc/server/adapters/next';
import { createRouter } from '../context';
import { zTeam } from './team';
import pusher from '../../pusher';

export const zBoard = z.object({
    id: z.string(),
    isOpen: z.boolean(),
    createdAt: z.string().optional(),
    name: z.string(),
    teams: z.array(zTeam).optional(),
    goalTime: z.number().min(0).optional(),
    timeSurpassed: z.number().min(0).optional(),
    isRunning: z.boolean().optional(),
    countDown: z.boolean().optional(),
    initialTimeStateChange: z.string().optional().nullable(),
    lastTimeStateChange: z.string().optional().nullable(),
});

export const boardRouter = createRouter()
    .mutation('create', {
        input: zBoard,
        resolve: async ({ input }) => {
            await pusher.trigger(input.id, "create", input);
            return {
                status: "success",
            }
        },
    })
    .mutation('read', {
        input: zBoard.pick({ id: true }),
        async resolve({ input }) {
            await pusher.trigger(input.id, "read", {});
            return []
        }
    }).mutation('update', {
        input: z.object({
            id: z.string(),
            data: zBoard.partial(),
        }),
        resolve: async ({ input }) => {
            await pusher.trigger(input.id, "update", input.data);
        }
    });

