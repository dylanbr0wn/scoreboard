import z from "zod"
import { Server as NetServer, Socket } from "net";
import { NextApiResponse } from "next";
import { Server as SocketIOServer } from "socket.io";


export const zTeam = z.object({
    id: z.string().optional(),
    name: z.string().optional(),
    createdAt: z.string().optional(),
    boardId: z.string().optional(),
    logo: z.string().optional().nullable(),
    score: z.number().min(0).optional(),

})
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



export type NextApiResponseServerIO = NextApiResponse & {
    socket: Socket & {
        server: NetServer & {
            io: SocketIOServer;
        };
    };
};
