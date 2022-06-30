import { z } from 'zod';
import { createRouter } from '../context';
import pusher from '../../utils/pusher';
import { Board, zBoard } from '../../utils/types';
import { supabaseClient } from '@supabase/auth-helpers-nextjs';



export const boardRouter = createRouter()
    .query('read', {
        input: z.object({
            id: z.string(),
        }),
        async resolve({ input, ctx }) {

            const { data } = await supabaseClient.from<Board>('boards').select("*, teams(*)").order('name', { foreignTable: 'teams' }).match({ id: input.id }).single();

            if (data?.userId === ctx.token) return { isOwner: true, board: data }

            return { isOwner: false, board: data }
        }
    }).mutation('update', {
        input: z.object({
            id: z.string(),
            data: zBoard.partial(),
        }),
        resolve: async ({ input, ctx }) => {
            const { data, error } = await supabaseClient.from<Board>('boards').update(input.data).match({ id: input.id, userId: ctx.token });

            console.log(data, error)

            if (error) return { error };

            await pusher.trigger(input.id, "update", input.data)

            return data


        }
    });

