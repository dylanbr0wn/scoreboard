import * as trpc from '@trpc/server';
import { z } from 'zod';
import * as trpcNext from '@trpc/server/adapters/next';
import { createRouter } from './context';
import { boardRouter } from './routers/board';



export const appRouter = createRouter()
    .merge('board.', boardRouter) // prefix user procedures with "user."
    ;