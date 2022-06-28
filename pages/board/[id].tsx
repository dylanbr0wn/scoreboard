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
import { io } from "socket.io-client";
import { Socket } from "socket.io-client";

// const getBoard = async (id: string | undefined) => {
//     let { data, error, status } = await supabaseClient
//         .from("boards")
//         .select(`*, teams(id, name, score, logo)`)
//         .eq("id", id)
//         .order("name", {
//             foreignTable: "teams",
//         })
//         .single();
//     if (error && status !== 406) {
//         throw error;
//     }
//     return zBoard.parse(data);
// };

// export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
//     const { id } = ctx.query;
//     if (typeof id !== "string") return { props: { initBoard: {} } };
//     const data = await getBoard(id);

//     return { props: { initBoard: data } };
// };

const Board: NextPage = (
    {
        // initBoard,
    }
) => {
    const [board, setBoard] = React.useState<z.infer<typeof zBoard>>();
    const { query } = useRouter();
    const socketRef = React.useRef<Socket>();

    const { user } = useUser();

    // React.useEffect(() => {
    //     if (initBoard?.id) {
    //         setBoard(initBoard);
    //     }
    // }, [initBoard]);

    const inputRef = React.useRef(null);

    // connected flag
    const [connected, setConnected] = React.useState<boolean>(false);

    React.useEffect((): any => {
        // connect to socket server
        const socket = io(process.env.BASE_URL ?? "", {
            path: "/api/socketio",
            query: {
                boardId: query.id,
            },
        });

        // log socket connection
        socket.on("connect", () => {
            console.log("SOCKET CONNECTED!", socket.id);

            setConnected(true);
        });

        socket.on("board", (data: any) => {
            setBoard(data);
        });

        socket.on("update-board", (partialBoard) => {
            setBoard((old) => zBoard.parse({ ...old, ...partialBoard }));
        });

        socketRef.current = socket;

        socketRef.current.emit("get-board");
        // socket disconnet onUnmount if exists
        if (socket) return () => socket.disconnect();
    }, []);

    // const handleRecordUpdated = (
    //     record: SupabaseRealtimePayload<z.infer<typeof zBoard>>
    // ) => {
    //     try {
    //         const board = zBoard.parse(record.new);
    //         setBoard((old) => ({ ...old, ...board }));
    //     } catch (e) {
    //         console.log(e);
    //     }
    // };

    // const mySubscription = supabaseClient
    //     .from(`boards:id=eq.${query.id}`)
    //     .on("UPDATE", handleRecordUpdated)
    //     .subscribe();

    // return () => {
    //     mySubscription.unsubscribe();
    // };
    // }, []);

    // React.useEffect(() => {
    //     const handleRecordUpdated = (
    //         record: SupabaseRealtimePayload<z.infer<typeof zTeam>>
    //     ) => {
    //         try {
    //             const team2 = zTeam.parse(record.new);
    //             setTeam2(team2);
    //         } catch (e) {
    //             console.log(e);
    //         }
    //     };

    //     const mySubscription = supabaseClient
    //         .from(`teams:id=eq.${board?.teams?.at(1)?.id}`)
    //         .on("UPDATE", handleRecordUpdated)
    //         .subscribe();

    //     return () => {
    //         mySubscription.unsubscribe();
    //     };
    // }, []);

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
