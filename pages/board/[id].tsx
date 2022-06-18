import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import { supabase } from "../../utils";
import z from "zod";
import * as React from "react";
import { useRouter } from "next/router";
import { Session } from "inspector";
import { SupabaseRealtimePayload } from "@supabase/supabase-js";

const session = z.object({
    id: z.string(),
    value: z.number().min(0),
    isOpen: z.boolean(),
    createdAt: z.string().optional(),
});

const getSessions = async (id: string | undefined) => {
    let { data, error, status } = await supabase
        .from("boards")
        .select(`id, value, isOpen`)
        .eq("id", id)
        .single();

    if (error && status !== 406) {
        throw error;
    }
    return session.parse(data);
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const { id } = ctx.query;
    if (typeof id !== "string") return { props: { sessions: [] } };
    const data = await getSessions(id);

    return { props: { initSession: data } };
};

const Board: NextPage<{ initSession: z.infer<typeof session> }> = ({
    initSession,
}) => {
    const [board, setBoard] = React.useState<z.infer<typeof session>>();
    const { query } = useRouter();

    React.useEffect(() => {
        if (initSession?.id) setBoard(initSession);
    }, [initSession]);

    React.useEffect(() => {
        const handleRecordUpdated = (
            record: SupabaseRealtimePayload<z.infer<typeof session>>
        ) => {
            try {
                const board = session.parse(record.new);
                setBoard(board);
            } catch (e) {
                console.log(e);
            }
        };

        const mySubscription = supabase
            .from(`boards:id=eq.${query.id}`)
            .on("UPDATE", handleRecordUpdated)
            .subscribe();

        return () => {
            mySubscription.unsubscribe();
        };
    }, []);

    if (!board?.isOpen) return <div>Session is closed</div>;

    return (
        <div className="h-screen w-screen">
            <div className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]">
                <div className="text-3xl">{board.value}</div>
            </div>
        </div>
    );
};
export default Board;
