import { z } from 'zod';
import { createRouter } from '../context';
import pusher from '../../utils/pusher';
import { Board, zBoard } from '../../utils/types';
import { supabaseClient } from '@supabase/auth-helpers-nextjs';



export const boardsRouter = createRouter()
    .query('read', {
        async resolve({ input, ctx }) {

            if (!ctx.token) return [];

            const { data } = await supabaseClient.from<Board>('boards').select("*, teams(*)").eq("userId", ctx.token)

            return data
        }
    })