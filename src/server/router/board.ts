import { z } from "zod";
import { createRouter } from "./context";
import pusher from "../../utils/pusher";
import { Board, zBoard } from "../../utils/types/types";
import superjson from "superjson";

export const boardRouter = createRouter()
  .query("read", {
    input: z.object({
      id: z.string(),
    }),
    output: z.object({
      board: zBoard,
      isOwner: z.boolean(),
    }),
    async resolve({ input, ctx }) {
      const board = await ctx.prisma.boards.findUniqueOrThrow({
        where: {
          id: input.id,
        },
        include: {
          teams: {
            orderBy: {
              name: "asc",
            },
          },
        },
      });

      if (board?.userId === ctx.token) return { isOwner: true, board };

      return { isOwner: false, board };
    },
  })
  .mutation("update", {
    input: z.object({
      id: z.string(),
      data: zBoard.partial().omit({ teams: true }),
    }),
    output: zBoard,
    resolve: async ({ input, ctx }) => {
      if (!ctx.token) throw new Error("No token found");
      const [board] = await Promise.all([
        ctx.prisma.boards.update({
          where: {
            id: input.id,
          },
          data: input.data,
        }),

        pusher.trigger(
          input.id,
          "board.update",
          superjson.stringify(input.data)
        ),
      ]);

      return board;
    },
  })
  .mutation("create", {
    input: z.object({
      data: zBoard.partial().omit({ teams: true }),
    }),
    output: zBoard,
    resolve: async ({ input, ctx }) => {
      if (!ctx.token) throw new Error("No token found");
      const board = await ctx.prisma.boards.create({
        data: {
          goalTime: 90 * 60 * 1000,
          timeSurpassed: 0,
          ...input.data,
          teams: {
            create: [
              {
                name: "Team 1",
                score: 0,
              },
              {
                name: "Team 2",
                score: 0,
              },
            ],
          },
          userId: ctx.token,
        },

        include: {
          teams: true,
        },
      });

      return board;
    },
  });
