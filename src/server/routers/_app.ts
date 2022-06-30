import { createRouter } from '../context';
import { boardRouter } from './board';
import superjson from "superjson"
import { boardsRouter } from './boards';


export const appRouter = createRouter()
    .transformer(superjson)
    .merge('board.', boardRouter) // prefix user procedures with "user."
    .merge('boards.', boardsRouter)
    ;