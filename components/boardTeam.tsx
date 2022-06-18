import Image from "next/image";
import z from "zod";
import { zTeam } from "../utils/types";

interface BoardTeamProps {
    team: z.infer<typeof zTeam> | undefined;
    abreviation?: string | undefined;
    hideLogo?: boolean | undefined;
}

const BoardTeam = ({ team, abreviation, hideLogo }: BoardTeamProps) => {
    return (
        <div className="w-full flex flex-col">
            <div className="mx-auto mb-5  text-center font-bold text-5xl">
                {abreviation ?? team?.name}
            </div>
            {!hideLogo && (
                <div className="mx-auto h-44 w-44">
                    <Image
                        src={team?.logo ?? ""}
                        layout="responsive"
                        height={500}
                        width={500}
                    />
                </div>
            )}

            <div className="mx-auto mt-3 h-44 w-44 text-center text-8xl">
                {team?.score}
            </div>
        </div>
    );
};
export default BoardTeam;
