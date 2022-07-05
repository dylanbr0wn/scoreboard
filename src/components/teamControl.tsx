import { zodResolver } from "@hookform/resolvers/zod";
import { Minus, Plus } from "react-feather";
import { SubmitHandler, useForm } from "react-hook-form";
import z from "zod";
import { zTeam } from "../utils/types/types";
import * as React from "react";
import { useQueryClient } from "react-query";
import { trpc } from "../utils/trpc";

const zTeamScore = z
    .object({
        score: z
            .number({ invalid_type_error: "Score must be a number" })
            .min(0),
    })
    .required();

const TeamControl = ({ team }: { team: z.infer<typeof zTeam> | undefined }) => {
    const { data } = trpc.useQuery(["team.read", { id: team?.id ?? "" }]);

    const queryClient = useQueryClient();

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
        },
        mode: "onChange",
    });

    const onSubmit: SubmitHandler<z.infer<typeof zTeamScore>> = async (
        formData
    ) => {
        await mutation.mutateAsync({
            id: team?.id ?? "",
            data: { score: formData.score },
        });
        reset(
            { score: formData.score },
            {
                keepValues: true,
            }
        );
    };

    React.useEffect(() => {
        if (!team?.score) return;
        setValue("score", Number(team.score));
    }, [team?.score]);

    const mutation = trpc.useMutation(["team.update"], {
        onSuccess: (newData) => {
            queryClient.setQueryData(["sessions", team?.id], newData);
        },
    });

    return (
        <>
            {data && (
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex w-full flex-col space-y-5"
                >
                    <div className="flex w-full justify-between">
                        <div className="flex flex-col space-y-2">
                            <div className="text-sm text-gray-600 font-light">
                                Team
                            </div>
                            <div className="flex space-x-3 my-auto h-full">
                                <div className="text-3xl font-bold my-auto">
                                    {data?.name}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col space-y-2">
                            <div className="text-sm text-gray-600 font-light">
                                Score
                            </div>
                            <div className="flex space-x-3">
                                <div className="text-3xl font-bold my-auto flex-shrink">
                                    <input
                                        {...register("score", {
                                            valueAsNumber: true,
                                        })}
                                        className={`${
                                            errors?.score
                                                ? "border-red-500"
                                                : "border-gray-200  focus:border-gray-300"
                                        } w-24 text-center transition-colors hover:bg-gray-100 bg-gray-50 border focus:bg-gray-100 py-2 px-3  rounded-lg ring-0 outline-none`}
                                    />
                                </div>
                                <div className="flex flex-col space-y-2">
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setValue(
                                                "score",
                                                getValues("score") + 1,
                                                {
                                                    shouldValidate: true,
                                                    shouldDirty: true,
                                                }
                                            );
                                        }}
                                        className="px-2 py-2 bg-teal-200 disabled:opacity-50 transition-all  duration-300 flex-grow rounded-lg hover:bg-teal-300 text-teal-900"
                                    >
                                        <Plus className="h-6 w-6" />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setValue(
                                                "score",
                                                getValues("score") - 1,
                                                {
                                                    shouldValidate: true,
                                                    shouldDirty: true,
                                                }
                                            );
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
                    <div className="h-4 py-auto text-red-500">
                        {errors?.score?.message}
                    </div>
                    <button
                        disabled={!isDirty || !isValid}
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
