import { GetServerSidePropsContext, NextPage } from "next";
import { useRouter } from "next/router";
import z from "zod";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { supabaseClient, withPageAuth } from "@supabase/auth-helpers-nextjs";
import { zBoard, zTeam } from "../../utils/types";
import Header from "../../components/header";
import { useUser } from "@supabase/auth-helpers-react";
import * as React from "react";
import { Minus, Pause, Play, Plus, RefreshCcw } from "react-feather";
import TeamControl from "../../components/teamControl";
import dayjs from "dayjs";
import TimeControl from "../../components/timeControl";
import { Socket, io } from "socket.io-client";

const getBoard = async (id: string | undefined) => {
    let { data, error, status } = await supabaseClient
        .from("boards")
        .select(`*, teams(id)`)
        .eq("id", id)
        .order("name", {
            foreignTable: "teams",
        })
        .single();

    if (error && status !== 406) {
        throw error;
    }
    // return data;
    return zBoard.parse(data);
};

export const getServerSideProps = withPageAuth({
    authRequired: true,
    redirectTo: "/login",
    getServerSideProps: async (ctx: GetServerSidePropsContext) => {
        const { id } = ctx.query;
        if (typeof id !== "string") return { props: { initBoard: {} } };

        const data = await getBoard(id);
        return { props: { initBoard: data, id } };
    },
});

const updateBoard = async (
    newValues: Partial<z.infer<typeof zBoard>>,
    id: string | undefined
) => {
    if (!id) throw new Error("no data");
    const {
        data: res,
        error,
        status,
    } = await supabaseClient.from("boards").update(newValues).eq("id", id);

    if (error && status !== 406) {
        throw error;
    }
    if (!res) throw new Error("no res");
    return zBoard.parse(res[0]);
};

const Control: NextPage<{ initBoard: z.infer<typeof zBoard>; id: string }> = ({
    initBoard,
    id,
}) => {
    const [team1, setTeam1] = React.useState<z.infer<typeof zTeam>>();
    const [team2, setTeam2] = React.useState<z.infer<typeof zTeam>>();

    const socketRef = React.useRef<Socket>();
    const [connected, setConnected] = React.useState<boolean>();
    const { data } = useQuery(["board", id], () => getBoard(id), {
        initialData: initBoard,
        onSuccess: (data) => {
            console.log(data);
            setTeam1(data.teams?.at(0));
            setTeam2(data.teams?.at(1));
        },
    });

    const { user } = useUser();

    React.useEffect((): any => {
        // connect to socket server
        const socket = io(process.env.BASE_URL ?? "", {
            path: "/api/socketio",
            query: {
                boardId: id,
            },
        });

        // log socket connection
        socket.on("connect", () => {
            console.log("SOCKET CONNECTED!", socket.id);
            setConnected(true);
        });

        socket.on("get-board", () => {
            console.log("respond to board request");
            socket.emit("board", data);
        });

        // update chat on new message dispatched
        socketRef.current = socket;

        // socket disconnet onUnmount if exists
        if (socket) return () => socket.disconnect();
    }, []);

    const queryClient = useQueryClient();

    const mutation = useMutation(
        (value: Partial<z.infer<typeof zBoard>>) => updateBoard(value, id),
        {
            onMutate: async (newData) => {
                await queryClient.cancelQueries(["board", id]);
                const previousData = queryClient.getQueryData(["board", id]);

                queryClient.setQueryData(["board", id], {
                    ...data,
                    ...newData,
                });

                return { previousData };
            },
            onError: (err, newData, context) => {
                queryClient.setQueryData(["board", id], context?.previousData);
                console.log(err);
            },
            onSettled: () => {
                queryClient.invalidateQueries(["board", id]);
            },
        }
    );

    return (
        <div>
            <Header user={user} />
            <div className="max-w-3xl mt-24 mx-auto">
                <div className="flex w-full justify-between divide-gray-200">
                    <TeamControl team={team1} />
                    <div className="flex flex-col px-5">
                        <div className="h-full border-l border-gray-200" />
                    </div>

                    <TeamControl team={team2} />
                </div>
                <div className="flex mt-8 pt-2 border-t border-gray-200 w-full">
                    <div className="flex flex-col space-y-2 w-full">
                        <div className="text-sm text-gray-600 font-light ">
                            Board
                        </div>
                        <div className="text-3xl font-bold my-auto">
                            {data?.name}
                        </div>
                        <div className="text-sm text-gray-600 pt-10 font-light ">
                            Timer
                        </div>
                        <TimeControl board={data} />
                        <div className="flex pt-4 justify-between w-full">
                            <div className="flex flex-col">
                                <div className="font-thin text-sm text-gray-500 pb-1">
                                    Timer start/stop
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => {
                                            if (
                                                data?.initialTimeStateChange ===
                                                null
                                            ) {
                                                mutation.mutate({
                                                    isRunning: true,
                                                    initialTimeStateChange:
                                                        dayjs().toISOString(),
                                                    lastTimeStateChange:
                                                        dayjs().toISOString(),
                                                });
                                                socketRef.current?.emit(
                                                    "update-board",
                                                    {
                                                        isRunning: true,
                                                        initialTimeStateChange:
                                                            dayjs().toISOString(),
                                                        lastTimeStateChange:
                                                            dayjs().toISOString(),
                                                    }
                                                );
                                            } else {
                                                mutation.mutate({
                                                    isRunning: true,

                                                    lastTimeStateChange:
                                                        dayjs().toISOString(),
                                                });
                                                socketRef.current?.emit(
                                                    "update-board",
                                                    {
                                                        isRunning: true,
                                                        lastTimeStateChange:
                                                            dayjs().toISOString(),
                                                    }
                                                );
                                            }
                                        }}
                                        disabled={data?.isRunning}
                                        className="px-4 disabled:opacity-50 py-2 bg-teal-200 transition-colors duration-300 flex-grow rounded-lg hover:bg-teal-300 text-teal-900"
                                    >
                                        <Play className="w-8 h-8" />
                                    </button>
                                    <button
                                        onClick={() => {
                                            mutation.mutate({
                                                isRunning: false,
                                                lastTimeStateChange:
                                                    dayjs().toISOString(),
                                                timeSurpassed:
                                                    (data?.timeSurpassed ?? 0) +
                                                        dayjs().diff(
                                                            data?.lastTimeStateChange,
                                                            "ms"
                                                        ) ??
                                                    data?.timeSurpassed,
                                            });
                                            socketRef.current?.emit(
                                                "update-board",
                                                {
                                                    isRunning: false,
                                                    lastTimeStateChange:
                                                        dayjs().toISOString(),
                                                    timeSurpassed:
                                                        (data?.timeSurpassed ??
                                                            0) +
                                                            dayjs().diff(
                                                                data?.lastTimeStateChange,
                                                                "ms"
                                                            ) ??
                                                        data?.timeSurpassed,
                                                }
                                            );
                                        }}
                                        disabled={!data?.isRunning}
                                        className="px-4 py-2  disabled:opacity-50 bg-red-200 transition-colors duration-300 flex-grow rounded-lg hover:bg-red-300 text-red-900"
                                    >
                                        <Pause className="w-8 h-8" />
                                    </button>
                                    <button
                                        onClick={() => {
                                            mutation.mutate({
                                                isRunning: false,
                                                lastTimeStateChange:
                                                    dayjs().toISOString(),
                                                timeSurpassed: 0,
                                            });
                                            socketRef.current?.emit(
                                                "update-board",
                                                {
                                                    isRunning: false,
                                                    lastTimeStateChange:
                                                        dayjs().toISOString(),
                                                    timeSurpassed: 0,
                                                }
                                            );
                                        }}
                                        disabled={
                                            data?.isRunning ||
                                            !((data?.timeSurpassed ?? 0) > 0)
                                        }
                                        className="px-4 py-2 disabled:opacity-50 bg-yellow-200 transition-colors duration-300 flex-grow rounded-lg hover:bg-yellow-300 text-yellow-500-900"
                                    >
                                        <RefreshCcw className="w-8 h-8" />
                                    </button>
                                    <div className="w-full" />
                                </div>
                            </div>
                            <div className="flex flex-col space-y-2 ">
                                <div className="font-thin text-sm text-gray-500">
                                    Game started at
                                </div>
                                <div className="text-xl my-auto">
                                    {data?.initialTimeStateChange
                                        ? dayjs(
                                              data?.initialTimeStateChange
                                          ).format("DD/MM/YYYY HH:mm:ss")
                                        : "Not yet started"}
                                </div>
                            </div>
                            <div className="flex flex-col space-y-2 ">
                                <div className="font-thin text-sm text-gray-500">
                                    Last time update
                                </div>
                                <div className="text-xl my-auto">
                                    {data?.lastTimeStateChange
                                        ? dayjs(
                                              data?.lastTimeStateChange
                                          ).format("DD/MM/YYYY HH:mm:ss")
                                        : "Not yet started"}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Control;
