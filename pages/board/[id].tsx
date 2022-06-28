import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import z from "zod";
import * as React from "react";
import { useRouter } from "next/router";
import { SupabaseRealtimePayload } from "@supabase/supabase-js";
import { supabaseClient, withPageAuth } from "@supabase/auth-helpers-nextjs";
import { zBoard, zTeam } from "../../utils/types";
import Image from "next/image";
import Header from "../../components/header";
import { useUser } from "@supabase/auth-helpers-react";
import BoardTeam from "../../components/boardTeam";
import CustTimer from "../../components/timer";
import Pusher, { Channel } from "pusher-js";

const getBoard = async (id: string | undefined) => {
    await fetch(`/api/board/${id}/read`, {
        method: "POST",
    });
};

const Board: NextPage = () => {
    const [board, setBoard] = React.useState<z.infer<typeof zBoard>>();
    const { query } = useRouter();
    const channelRef = React.useRef<Channel>();

    const { user } = useUser();

    const inputRef = React.useRef(null);

    // connected flag
    const [connected, setConnected] = React.useState<boolean>(false);

    React.useEffect((): any => {
        if (typeof query.id !== "string") return;
        const pusher = new Pusher(
            process.env.NEXT_PUBLIC_PUSHER_APP_KEY ?? "",
            {
                cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER ?? "",
            }
        );
        const channel = pusher.subscribe(query.id);
        setConnected(true);

        channel.bind("create", (data: any) => {
            setBoard(data);
        });

        channel.bind(
            "update",
            (partialBoard: Partial<z.infer<typeof zBoard>>) => {
                setBoard((old) => zBoard.parse({ ...old, ...partialBoard }));
            }
        );

        getBoard(query.id);

        channelRef.current = channel;
        if (channel) return () => channel.disconnect();
    }, [query.id]);

    if (!board?.isOpen) return <div>Session is closed</div>;

    return (
        <div className="p-0">
            {query?.size === "windowed" && <Header user={user} />}

            <main className="mt-24 max-w-3xl mx-auto">
                <div className="flex">
                    <BoardTeam id={board?.teams?.at(0)?.id} />
                    <CustTimer board={board} />
                    <BoardTeam id={board?.teams?.at(1)?.id} />
                </div>
            </main>
        </div>
    );
};
export default Board;
