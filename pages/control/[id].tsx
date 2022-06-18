import { NextPage } from "next";
import { useRouter } from "next/router";
import z from "zod";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { supabaseClient, withPageAuth } from "@supabase/auth-helpers-nextjs";
import { zBoard } from "../../utils/types";

const getBoard = async (id: string | undefined | string[]) => {
    if (typeof id !== "string") return undefined;
    let { data, error, status } = await supabaseClient
        .from("boards")
        .select(`id, value, isOpen, name`)
        .eq("id", id)
        .single();

    if (error && status !== 406) {
        throw error;
    }
    return zBoard.parse(data);
};

export const getServerSideProps = withPageAuth({
    authRequired: true,
    redirectTo: "/login",
});

const Control: NextPage = () => {
    const { query } = useRouter();

    const { data } = useQuery(["sessions", query.id], () => getBoard(query.id));
    const queryClient = useQueryClient();

    const updateBoard = async (newValue: number) => {
        if (!data) throw new Error("no data");
        const {
            data: res,
            error,
            status,
        } = await supabaseClient
            .from("boards")
            .update({ value: newValue })
            .eq("id", data.id);

        if (error && status !== 406) {
            throw error;
        }
        if (!res) throw new Error("no res");
        return zBoard.parse(res[0]);
    };
    const mutation = useMutation(updateBoard, {
        onSuccess: (data) => {
            queryClient.setQueryData(["sessions", query.id], data);
        },
    });

    return (
        <div className="h-screen w-screen">
            <div className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]">
                <div className="flex space-x-2">
                    <button className="px-4 py-3 bg-cyan-500"> Add</button>
                    <button className="px-4 py-3 bg-pink-600"> Subtract</button>
                </div>
            </div>
        </div>
    );
};
export default Control;
