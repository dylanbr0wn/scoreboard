import { SupabaseRealtimePayload } from "@supabase/supabase-js";
import Image from "next/image";
import z from "zod";
import { zTeam } from "../utils/types";
import * as React from "react";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { useQuery, useQueryClient } from "react-query";

interface BoardTeamProps {
    id: string | undefined;
    abreviation?: string | undefined;
    hideLogo?: boolean | undefined;
}

const getTeam = async (id: string | undefined) => {
    if (!id) return undefined;
    let { data, error, status } = await supabaseClient
        .from("teams")
        .select(`*`)
        .eq("id", id)
        .single();
    if (error && status !== 406) {
        throw error;
    }
    return zTeam.parse(data);
};

const BoardTeam = ({ id, abreviation, hideLogo }: BoardTeamProps) => {
    // const [team, setTeam] = React.useState<z.infer<typeof zTeam>>();

    const { data } = useQuery(["team", id], () => getTeam(id));
    const queryClient = useQueryClient();

    React.useEffect(() => {
        const handleRecordUpdated = (
            record: SupabaseRealtimePayload<z.infer<typeof zTeam>>
        ) => {
            console.log("herererer");
            try {
                const team = zTeam.parse(record.new);
                queryClient.setQueryData(["team", id], team);
            } catch (e) {
                console.log(e);
            }
        };

        const mySubscription = supabaseClient
            .from(`teams:id=eq.${id}`)
            .on("UPDATE", handleRecordUpdated)
            .subscribe();

        return () => {
            mySubscription.unsubscribe();
        };
    }, []);
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
