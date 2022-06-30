import { Pause, Play } from "react-feather";
import z from "zod";
import { zBoard } from "../utils/types";
import * as React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const zTimerInputs = z
    .object({
        minutes: z
            .number({ invalid_type_error: "Minutes must be a number" })
            .min(0)
            .max(59)
            .step(1),
        hours: z
            .number({ invalid_type_error: "Hours must be a number" })
            .min(0)
            .max(23)
            .step(1),
        seconds: z
            .number({ invalid_type_error: "Seconds must be a number" })
            .min(0)
            .max(59)
            .step(1),
        millis: z
            .number({ invalid_type_error: "Milliseconds must be a number" })
            .min(0)
            .max(999)
            .step(1),
    })
    .required();

const TimeControl = ({
    board,
}: {
    board: z.infer<typeof zBoard> | undefined | null;
}) => {
    // const [hours, setHours] = React.useState(0);
    // const [minutes, setMinutes] = React.useState(0);
    // const [seconds, setSeconds] = React.useState(0);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isDirty, isValid },
    } = useForm<z.infer<typeof zTimerInputs>>({
        resolver: zodResolver(zTimerInputs),
        reValidateMode: "onChange",
        defaultValues: {
            minutes: 0,
            hours: 0,
            seconds: 0,
            millis: 0,
        },
        mode: "onChange",
    });

    const onSubmit: SubmitHandler<z.infer<typeof zTimerInputs>> = (data) =>
        console.log(data);

    React.useEffect(() => {
        if (!board?.goalTime) return;
        const goalTime = board?.goalTime;
        setValue("hours", Math.floor(goalTime / 3600000));
        setValue("minutes", Math.floor((goalTime % 3600000) / 60000));
        setValue("seconds", (goalTime % 60000) / 1000);
        setValue("millis", goalTime % 1000);
    }, [board?.goalTime]);

    return (
        <div className="">
            {board?.goalTime && (
                <div className="flex flex-col">
                    <form
                        className="flex space-x-3"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <div className="flex flex-col">
                            <div className="font-thin text-sm text-gray-500">
                                Hrs
                            </div>
                            <input
                                type="number"
                                {...register("hours", {
                                    valueAsNumber: true,
                                    disabled: board?.isRunning,
                                })}
                                className={`${
                                    errors?.hours
                                        ? "border-red-500"
                                        : "border-gray-200 focus:border-gray-300"
                                } w-16 text-center transition-colors  bg-gray-50 border hover:bg-gray-100 focus:bg-gray-100 py-2 px-3  rounded-lg ring-0 outline-none`}
                            />
                        </div>
                        <div className="flex flex-col">
                            <div className="font-thin text-sm text-gray-500">
                                Min
                            </div>
                            <input
                                type="number"
                                {...register("minutes", {
                                    valueAsNumber: true,
                                    disabled: board?.isRunning,
                                })}
                                className={`${
                                    errors?.minutes
                                        ? "border-red-500"
                                        : "border-gray-200 focus:border-gray-300"
                                } w-16 text-center transition-colors  bg-gray-50 border hover:bg-gray-100 focus:bg-gray-100 py-2 px-3  rounded-lg ring-0 outline-none`}
                            />
                        </div>
                        <div className="flex flex-col">
                            <div className="font-thin text-sm text-gray-500">
                                Sec
                            </div>
                            <input
                                type="text"
                                {...register("seconds", {
                                    valueAsNumber: true,
                                    disabled: board?.isRunning,
                                })}
                                className={`${
                                    errors?.seconds
                                        ? "border-red-500"
                                        : "border-gray-200 focus:border-gray-300"
                                } w-16 text-center transition-colors  bg-gray-50 border hover:bg-gray-100 focus:bg-gray-100 py-2 px-3  rounded-lg ring-0 outline-none`}
                            />
                        </div>
                        <div className="flex flex-col">
                            <div className="font-thin text-sm text-gray-500">
                                MSec
                            </div>
                            <input
                                type="number"
                                {...register("millis", {
                                    valueAsNumber: true,
                                    disabled: board?.isRunning,
                                })}
                                className={`${
                                    errors?.millis
                                        ? "border-red-500"
                                        : "border-gray-200 focus:border-gray-300"
                                } w-16 text-center transition-colors bg-gray-50 border hover:bg-gray-100 focus:bg-gray-100 py-2 px-3  rounded-lg ring-0 outline-none`}
                            />
                        </div>
                        <div className="mt-auto pl-8">
                            <button
                                disabled={
                                    board?.isRunning || !isDirty || !isValid
                                }
                                className="px-4 py-3 disabled:opacity-50 hover:bg-sky-200  flex text-sky-700 bg-sky-100 rounded-lg active:bg-sky-300 duration-300 transition-colors"
                                type="submit"
                            >
                                Update timer
                            </button>
                        </div>
                    </form>
                    <div className="w-full h-10 text-red-500">
                        <span>{errors?.hours?.message}</span>
                        <span>{errors?.minutes?.message}</span>
                        <span>{errors?.seconds?.message}</span>
                        <span>{errors?.millis?.message}</span>
                    </div>
                </div>
            )}
        </div>
    );
};
export default TimeControl;
