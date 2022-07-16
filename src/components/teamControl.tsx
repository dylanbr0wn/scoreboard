import { zodResolver } from "@hookform/resolvers/zod";
import { Minus, Plus } from "react-feather";
import { SubmitHandler, useForm } from "react-hook-form";
import z from "zod";
import * as React from "react";
import { trpc } from "../utils/trpc";
import TeamInput from "./TeamDropzone";

const zTeamScore = z
  .object({
    score: z.number({ invalid_type_error: "Score must be a number" }).min(0),
    name: z.string(),
  })
  .required();

const TeamControl = ({ teamId }: { teamId: string | undefined }) => {
  const { data, isRefetching } = trpc.useQuery(
    ["team.read", { id: teamId ?? "" }],
    {
      onSuccess: (newData) => {
        console.log("here");
        reset({ score: newData.score, name: newData.name });
      },
      refetchOnWindowFocus: false,
    }
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm<z.infer<typeof zTeamScore>>({
    resolver: zodResolver(zTeamScore),
    reValidateMode: "onChange",
    defaultValues: {
      score: 0,
      name: data?.name ?? "",
    },
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<z.infer<typeof zTeamScore>> = async (
    formData
  ) => {
    await mutation.mutateAsync({
      id: teamId ?? "",
      data: { score: formData.score, name: formData.name },
    });
    reset(
      { score: formData.score },
      {
        keepValues: true,
      }
    );
  };

  // React.useEffect(() => {
  //     if (!team?.score) return;
  //     setValue("score", Number(team.score));
  // }, [team?.score]);

  const utils = trpc.useContext();

  const mutation = trpc.useMutation(["team.update"], {
    onMutate: async (newData) => {
      if (!data) return;
      utils.cancelQuery(["team.read", { id: teamId ?? "" }]);
      const previousData = utils.getQueryData([
        "team.read",
        { id: teamId ?? "" },
      ]);
      utils.setQueryData(["team.read", { id: teamId ?? "" }], {
        ...data,
        ...newData.data,
      });

      return { previousData, newData };
    },

    onError: (err, newData, context) => {
      utils.setQueryData(["team.read", { id: teamId ?? "" }], {
        ...context?.previousData,
        ...context?.newData.data,
      });
      console.log(err);
    },
    onSettled: () => {
      utils.invalidateQueries(["team.read", { id: teamId ?? "" }]);
    },
  });

  return (
    <>
      {data && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-full flex-col space-y-5"
        >
          <div className="flex justify-between">
            <div className="flex flex-col space-y-2 h-full flex-shrink">
              <div className="text-sm text-gray-600 font-light">Team</div>
              <div className=" w-44">
                <input
                  type="text"
                  {...register("name")}
                  className="text-3xl w-full font-bold px-3 py-2 my-4 rounded-lg bg-gray-50 hover:bg-gray-100 active:bg-gray-200 transition-all  outline-none ring-0 focus-visible:bg-gray-100"
                />
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <div className="text-sm text-gray-600 font-light">Score</div>
              <div className="flex space-x-3">
                <div className="text-3xl font-bold my-auto flex-shrink">
                  <input
                    {...register("score", {
                      valueAsNumber: true,
                    })}
                    className={`${
                      errors?.score ? "border-red-500" : ""
                    } w-24 text-center transition-colors hover:bg-gray-100 bg-gray-50 focus-visible:bg-gray-100 active:bg-gray-200 py-2 px-3  rounded-lg ring-0 outline-none`}
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setValue("score", getValues("score") + 1, {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                    }}
                    className="px-2 py-2 bg-teal-200 disabled:opacity-50 transition-all  duration-300 flex-grow rounded-lg hover:bg-teal-300 text-teal-900"
                  >
                    <Plus className="h-6 w-6" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setValue("score", getValues("score") - 1, {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                    }}
                    disabled={getValues("score") < 1}
                    className="px-2 py-2 bg-pink-200 transition-all duration-300 disabled:opacity-50  flex-grow rounded-lg hover:bg-pink-300 text-pink-900"
                  >
                    <Minus className="h-6 w-6" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <TeamInput boardId={data?.boardId} team={data} />
          <div className="h-4 py-auto text-red-500">
            {errors?.score?.message}
          </div>
          <button
            disabled={
              !isDirty || !isValid || isRefetching || mutation.isLoading
            }
            className="px-4 mx-auto py-3 disabled:opacity-50 hover:bg-sky-200  flex text-sky-700 bg-sky-100 rounded-lg active:bg-sky-300 duration-300 transition-all "
            type="submit"
          >
            Update Score
          </button>
        </form>
      )}
    </>
  );
};
export default TeamControl;
