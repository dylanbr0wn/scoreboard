import { z } from "zod";
import { createRouter } from "./context";
import { Team, zTeam } from "../../utils/types/types";

import superjson from "superjson";
import pusher from "../../utils/pusher";

export const teamRouter = createRouter()
  .query("read", {
    input: z.object({
      id: z.string(),
    }),
    output: zTeam,
    async resolve({ input, ctx }) {
      if (!ctx.token) throw new Error("No token found");

      return await ctx.prisma.teams.findUniqueOrThrow({
        where: {
          id: input.id,
        },
      });
    },
  })
  .mutation("update", {
    input: z.object({
      id: z.string(),
      data: zTeam.partial(),
    }),
    output: zTeam,
    resolve: async ({ input, ctx }) => {
      const { data, id } = input;

      const team = await ctx.prisma.teams.findFirst({
        where: {
          id: id,
          boards: {
            userId: ctx.token,
          },
        },
      });

      if (!team) throw new Error("You are not authorized to update this team");

      const [result] = await Promise.all([
        ctx.prisma.teams.update({
          where: {
            id: team.id,
          },
          data,
        }),
        pusher.trigger(
          input.id,
          "team.update",
          superjson.stringify(input.data)
        ),
      ]);

      return result;
    },
  });
