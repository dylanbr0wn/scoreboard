import { createRouter } from "./context";
import { boardRouter } from "./board";
import superjson from "superjson";
import { boardsRouter } from "./boards";
import { teamRouter } from "./team";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("board.", boardRouter) // prefix user procedures with "user."
  .merge("boards.", boardsRouter)
  .merge("team.", teamRouter);
