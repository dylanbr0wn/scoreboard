import { UseFormRegister } from "react-hook-form";
import { z } from "zod";
import { zBoardForm } from "../pages/[id]/edit";
import { trpc } from "../utils/trpc";
import TeamInput from "./TeamDropzone";

const TeamEdit = ({
  id,
  register,
}: {
  id: string;
  register: UseFormRegister<z.infer<typeof zBoardForm>>;
}) => {
  const { data } = trpc.useQuery(["board.read", { id }], {
    onSuccess: (newData) => {
      // reset({
      //     team1: newData?.board?.teams?.at(0),
      //     team2: newData?.board?.teams?.at(1),
      // });
    },
  });
  return (
    <>
      <div className="flex flex-col flex-grow">
        <h2 className="text-xl font-bold">Team 1</h2>
        <label htmlFor="team1.name">
          <div className="text-gray-500 font-light mb-2">name</div>
          <input
            className="border border-gray-300 rounded-lg bg-gray-100 py-3 px-4 ring-0 outline-none active:bg-gray-200 transition-colors"
            {...register("team1.name")}
          />
        </label>
        <TeamInput boardId={data?.board?.id} team={data?.board?.teams?.at(0)} />
      </div>

      <div className="flex flex-col flex-grow">
        <h2 className="text-xl font-bold">Team 2</h2>
        <label htmlFor="team2.name">
          <div className="text-gray-500 font-light mb-2">name</div>
          <input
            className="border border-gray-300 rounded-lg bg-gray-100 py-3 px-4 ring-0 outline-none active:bg-gray-200 transition-colors"
            {...register("team2.name")}
          />
        </label>
        <TeamInput boardId={data?.board?.id} team={data?.board?.teams?.at(1)} />
      </div>
    </>
  );
};

export default TeamEdit;
