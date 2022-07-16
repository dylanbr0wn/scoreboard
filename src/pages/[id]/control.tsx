import { GetServerSidePropsContext, NextPage } from "next";
import { useRouter } from "next/router";
import z from "zod";

import Header from "../../components/header";
import * as React from "react";
import { Minus, Pause, Play, Plus, RefreshCcw } from "react-feather";
import TeamControl from "../../components/teamControl";
import dayjs from "dayjs";
import TimeControl from "../../components/timeControl";
import Pusher, { Channel } from "pusher-js";
import { Team, zBoard, zTeam } from "../../utils/types/types";
import { trpc } from "../../utils/trpc";

const Control: NextPage<{ id: string }> = ({ id }) => {
    const [team1, setTeam1] = React.useState<Team>();
    const [team2, setTeam2] = React.useState<Team>();

    const utils = trpc.useContext();

    const router = useRouter();

    const channelRef = React.useRef<Channel>();
    const [connected, setConnected] = React.useState<boolean>();
    const { data } = trpc.useQuery(["board.read", { id }], {
        onSuccess: (data) => {
            if (!data.isOwner) router.replace(`/board/${id}`);
            setTeam1(data?.board?.teams?.at(0));
            setTeam2(data?.board?.teams?.at(1));
        },
    });

    React.useEffect((): any => {
        // connect to socket server
        const pusher = new Pusher(
            process.env.NEXT_PUBLIC_PUSHER_APP_KEY ?? "",
            {
                cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER ?? "",
            }
        );
        const channel = pusher.subscribe(id);
        setConnected(true);

        // update chat on new message dispatched
        channelRef.current = channel;

        // socket disconnet onUnmount if exists
        if (channel) return () => channel.disconnect();
    }, []);

    const mutation = trpc.useMutation(["board.update"], {
        onMutate: async (newData) => {
            if (!data) return;
            utils.cancelQuery(["board.read", { id }]);
            const previousData = utils.getQueryData(["board.read", { id }]);
            utils.setQueryData(["board.read", { id }], {
                isOwner: data?.isOwner,
                board: zBoard.parse({ ...data.board, ...newData.data }),
            });

            return { previousData, newData };
        },

        onError: (err, newData, context) => {
            utils.setQueryData(["board.read", { id }], {
                isOwner: data?.isOwner!,
                board: zBoard.parse({
                    ...context?.previousData,
                    ...context?.newData,
                }),
            });
            console.log(err);
        },
        onSettled: () => {
            utils.invalidateQueries(["board.read", { id }]);
        },
    });

    return (
        <div>
            <Header />
            {data?.isOwner && (
                <div className="max-w-3xl mt-24 mx-auto">
                    <div className="flex w-full justify-between divide-gray-200">
                        <TeamControl teamId={team1?.id} />
                        <div className="flex flex-col px-5">
                            <div className="h-full border-l border-gray-200" />
                        </div>

                        <TeamControl teamId={team2?.id} />
                    </div>
                    <div className="flex mt-8 pt-2 border-t border-gray-200 w-full">
                        <div className="flex flex-col space-y-2 w-full">
                            <div className="text-sm text-gray-600 font-light ">
                                Board
                            </div>
                            <div className="text-3xl font-bold my-auto">
                                {data?.board?.name}
                            </div>
                            <div className="text-sm text-gray-600 pt-10 font-light ">
                                Timer
                            </div>
                            <TimeControl board={data?.board} />
                            <div className="flex pt-4 justify-between w-full">
                                <div className="flex flex-col">
                                    <div className="font-thin text-sm text-gray-500 pb-1">
                                        Timer start/stop
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => {
                                                if (
                                                    data?.board
                                                        ?.initialTimeStateChange ===
                                                    null
                                                ) {
                                                    mutation.mutate({
                                                        id,
                                                        data: {
                                                            isRunning: true,
                                                            initialTimeStateChange:
                                                                new Date(),
                                                            lastTimeStateChange:
                                                                new Date(),
                                                        },
                                                    });
                                                } else {
                                                    mutation.mutate({
                                                        id,
                                                        data: {
                                                            isRunning: true,

                                                            lastTimeStateChange:
                                                                new Date(),
                                                        },
                                                    });
                                                }
                                            }}
                                            disabled={data?.board?.isRunning}
                                            className="px-4 disabled:opacity-50 py-2 bg-teal-200 transition-colors duration-300 flex-grow rounded-lg hover:bg-teal-300 text-teal-900"
                                        >
                                            <Play className="w-8 h-8" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                mutation.mutate({
                                                    id,
                                                    data: {
                                                        isRunning: false,
                                                        lastTimeStateChange:
                                                            new Date(),
                                                        timeSurpassed:
                                                            (data?.board
                                                                ?.timeSurpassed ??
                                                                0) +
                                                                dayjs().diff(
                                                                    data?.board
                                                                        ?.lastTimeStateChange,
                                                                    "ms"
                                                                ) ??
                                                            data?.board
                                                                ?.timeSurpassed,
                                                    },
                                                });
                                                // channelRef.current?.emit(
                                                //     "update-board",
                                                //     {
                                                //         isRunning: false,
                                                //         lastTimeStateChange:
                                                //             dayjs().toISOString(),
                                                //         timeSurpassed:
                                                //             (data?.timeSurpassed ??
                                                //                 0) +
                                                //                 dayjs().diff(
                                                //                     data?.lastTimeStateChange,
                                                //                     "ms"
                                                //                 ) ??
                                                //             data?.timeSurpassed,
                                                //     }
                                                // );
                                            }}
                                            disabled={!data?.board?.isRunning}
                                            className="px-4 py-2  disabled:opacity-50 bg-red-200 transition-colors duration-300 flex-grow rounded-lg hover:bg-red-300 text-red-900"
                                        >
                                            <Pause className="w-8 h-8" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                mutation.mutate({
                                                    id,
                                                    data: {
                                                        isRunning: false,
                                                        lastTimeStateChange:
                                                            new Date(),
                                                        timeSurpassed: 0,
                                                    },
                                                });
                                                // channelRef.current?.emit(
                                                //     "update-board",
                                                //     {
                                                //         isRunning: false,
                                                //         lastTimeStateChange:
                                                //             dayjs().toISOString(),
                                                //         timeSurpassed: 0,
                                                //     }
                                                // );
                                            }}
                                            disabled={
                                                data?.board?.isRunning ||
                                                !(
                                                    (data?.board
                                                        ?.timeSurpassed ?? 0) >
                                                    0
                                                )
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
                                        {data?.board?.initialTimeStateChange
                                            ? dayjs(
                                                  data?.board
                                                      ?.initialTimeStateChange
                                              ).format("DD/MM/YYYY HH:mm:ss")
                                            : "Not yet started"}
                                    </div>
                                </div>
                                <div className="flex flex-col space-y-2 ">
                                    <div className="font-thin text-sm text-gray-500">
                                        Last time update
                                    </div>
                                    <div className="text-xl my-auto">
                                        {data?.board?.lastTimeStateChange
                                            ? dayjs(
                                                  data?.board
                                                      ?.lastTimeStateChange
                                              ).format("DD/MM/YYYY HH:mm:ss")
                                            : "Not yet started"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
const ControlWrapper = () => {
    const { query } = useRouter();
    const { id } = query;

    if (!id || typeof id !== "string") {
        return <div>No ID</div>;
    }

    return <Control id={id} />;
};

export default ControlWrapper;
