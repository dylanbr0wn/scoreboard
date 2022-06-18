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

const getSessions = async (id: string | undefined) => {
    let { data, error, status } = await supabaseClient
        .from("boards")
        .select(`*, teams(id, name, score, logo)`)
        .eq("id", id)
        .single();
    if (error && status !== 406) {
        throw error;
    }
    return zBoard.parse(data);
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const { id } = ctx.query;
    if (typeof id !== "string") return { props: { sessions: [] } };
    const data = await getSessions(id);

    return { props: { initBoard: data } };
};

const Board: NextPage<{ initBoard: z.infer<typeof zBoard> }> = ({
    initBoard,
}) => {
    const [board, setBoard] = React.useState<z.infer<typeof zBoard>>();
    const [team1, setTeam1] = React.useState<z.infer<typeof zTeam>>();
    const [team2, setTeam2] = React.useState<z.infer<typeof zTeam>>();
    const { query } = useRouter();

    const { user } = useUser();

    React.useEffect(() => {
        if (initBoard?.id) {
            setBoard(initBoard);
            setTeam1(initBoard.teams?.at(0));
            setTeam2(initBoard.teams?.at(1));
        }
    }, [initBoard]);

    React.useEffect(() => {
        const handleRecordUpdated = (
            record: SupabaseRealtimePayload<z.infer<typeof zBoard>>
        ) => {
            try {
                const board = zBoard.parse(record.new);
                setBoard(board);
            } catch (e) {
                console.log(e);
            }
        };

        const mySubscription = supabaseClient
            .from(`boards:id=eq.${query.id}`)
            .on("UPDATE", handleRecordUpdated)
            .subscribe();

        return () => {
            mySubscription.unsubscribe();
        };
    }, []);

    React.useEffect(() => {
        const handleRecordUpdated = (
            record: SupabaseRealtimePayload<z.infer<typeof zTeam>>
        ) => {
            try {
                const team1 = zTeam.parse(record.new);
                setTeam1(team1);
            } catch (e) {
                console.log(e);
            }
        };

        const mySubscription = supabaseClient
            .from(`teams:id=eq.${board?.teams?.at(0)?.id}`)
            .on("UPDATE", handleRecordUpdated)
            .subscribe();

        return () => {
            mySubscription.unsubscribe();
        };
    }, []);
    React.useEffect(() => {
        const handleRecordUpdated = (
            record: SupabaseRealtimePayload<z.infer<typeof zTeam>>
        ) => {
            try {
                const team2 = zTeam.parse(record.new);
                setTeam2(team2);
            } catch (e) {
                console.log(e);
            }
        };

        const mySubscription = supabaseClient
            .from(`teams:id=eq.${board?.teams?.at(1)?.id}`)
            .on("UPDATE", handleRecordUpdated)
            .subscribe();

        return () => {
            mySubscription.unsubscribe();
        };
    }, []);

    if (!board?.isOpen) return <div>Session is closed</div>;

    return (
        <div className="p-0">
            {query?.size === "windowed" && <Header user={user} />}

            <main className="mt-24 max-w-3xl mx-auto">
                <div className="flex">
                    <BoardTeam team={team1} />
                    <CustTimer board={board} />
                    <BoardTeam team={team2} />
                </div>
            </main>
        </div>
    );
};
export default Board;
