import { z } from 'zod';
import { createRouter } from './context';
import { Board, zBoard } from '../../utils/types/types';



export const boardsRouter = createRouter()
    .query('read', {
        output: z.array(zBoard),
        async resolve({ ctx }) {

            if (!ctx.token) return [];
            const data = await ctx.prisma.boards.findMany({
                where: {
                    userId: ctx.token
                }
            })
            console.log(data)

            return data
        }
    })