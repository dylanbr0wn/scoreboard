import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import z from "zod";
import * as React from "react";
import { useRouter } from "next/router";

import Image from "next/image";
import Header from "../../components/header";
import BoardTeam from "../../components/boardTeam";
import CustTimer from "../../components/timer";
import Pusher, { Channel } from "pusher-js";
import superjson from "superjson";

import { Board, zBoard } from "../../utils/types/types";
import { trpc } from "../../utils/trpc";

const Board: NextPage<{ id: string }> = ({ id }) => {
    const [board, setBoard] = React.useState<Board>();
    const { query } = useRouter();
    const channelRef = React.useRef<Channel>();
    const { data } = trpc.useQuery(["board.read", { id }], {
        onSuccess: (data) => {
            if (data.board) setBoard(data?.board);
        },
    });

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

        channel.bind("board.update", (partialBoard: any) => {
            const newBoard =
                superjson.deserialize<Partial<z.infer<typeof zBoard>>>(
                    partialBoard
                );
            setBoard((old) => zBoard.parse({ ...old, ...newBoard }));
        });

        channelRef.current = channel;
        if (channel) return () => channel.disconnect();
    }, [query.id]);

    if (!board?.isOpen) return <div>Session is closed</div>;

    return (
        <div className="p-0">
            {query?.size === "windowed" && <Header />}

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

const BoardWrapper = () => {
    const { query } = useRouter();
    const { id } = query;

    if (!id || typeof id !== "string") {
        return <div>No ID</div>;
    }

    return <Board id={id} />;
};

export default BoardWrapper;
