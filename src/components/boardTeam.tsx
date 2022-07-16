import { SupabaseRealtimePayload } from "@supabase/supabase-js";
import Image from "next/image";
import z from "zod";
import { Board, Team, zTeam } from "../utils/types/types";
import * as React from "react";
import { useQuery, useQueryClient } from "react-query";
import { trpc } from "../utils/trpc";
import Pusher, { Channel } from "pusher-js";

import superjson from "superjson";
interface BoardTeamProps {
  id: string | undefined;
  abreviation?: string | undefined;
  hideLogo?: boolean | undefined;
}

const BoardTeam = ({ id, abreviation, hideLogo }: BoardTeamProps) => {
  // const [team, setTeam] = React.useState<z.infer<typeof zTeam>>();

  const channelRef = React.useRef<Channel>();
  const utils = trpc.useContext();
  // const [team, setTeam] = React.useState<Team>();

  const { data } = trpc.useQuery(["team.read", { id: id ?? "" }], {
    // onSuccess: (data) => {
    //     setTeam(data);
    // },
  });

  React.useEffect((): any => {
    if (typeof id !== "string") return;
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY ?? "", {
      cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER ?? "",
    });
    const channel = pusher.subscribe(id);

    channel.bind("team.update", (partialBoard: any) => {
      const newTeam = superjson.deserialize<Partial<Team>>(partialBoard);
      utils.setQueryData(["team.read", { id: id ?? "" }], (old) => {
        return zTeam.parse({ ...old, ...newTeam });
      });
      //  setBoard((old) => zBoard.parse({ ...old, ...newBoard }));
    });

    channelRef.current = channel;
    if (channel) return () => channel.disconnect();
  }, [id]);

  return (
    <div className="w-full flex flex-col">
      <div className="mx-auto mb-5  text-center font-bold text-5xl">
        {abreviation ?? data?.name}
      </div>
      {!hideLogo && data?.logo && (
        <div className="mx-auto h-44 w-44">
          <Image
            src={data?.logo ?? ""}
            layout="responsive"
            height={500}
            width={500}
          />
        </div>
      )}

      <div className="mx-auto mt-3 h-44 w-44 text-center text-8xl">
        {data?.score}
      </div>
    </div>
  );
};
export default BoardTeam;
