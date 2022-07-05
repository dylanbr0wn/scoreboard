import Header from "../../components/header";
import * as React from "react";
import { Transition } from "@headlessui/react";
import { Team, zTeam } from "../../utils/types/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDropzone } from "react-dropzone";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { nanoid } from "nanoid";

enum Templates {
    Soccer,
}

const zBoardForm = z.object({
    team1: zTeam,
    team2: zTeam,
});

const Create = () => {
    const [template, setTemplate] = React.useState<Templates>();
    const [showTeamForm, setShowTeamForm] = React.useState(false);
    const onDrop = React.useCallback(async (acceptedFiles: File[]) => {
        await supabaseClient.storage
            .from("logos")
            .upload(`${nanoid()}.${acceptedFiles[0].type}`, acceptedFiles[0]);
    }, []);
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        maxFiles: 1,
        maxSize: 100000,
    });

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isDirty, isValid },
    } = useForm<z.infer<typeof zBoardForm>>({
        resolver: zodResolver(zBoardForm),
        reValidateMode: "onChange",
        defaultValues: {
            team1: {
                logo: "",
                name: "",
                score: 0,
                boardId: undefined,
            },
            team2: {
                logo: "",
                name: "",
                score: 0,
                boardId: undefined,
            },
        },
        mode: "onChange",
    });

    return (
        <div className="p-0">
            <Header />
            <main className="mt-24 max-w-3xl mx-auto px-2">
                <Transition
                    show={template === undefined}
                    enter="duration-150 transform transition-all"
                    enterFrom="opacity-0 -translate-y-4"
                    enterTo="opacity-100 -translate-y-0"
                    leave=" duration-300 transform transition-all"
                    leaveFrom="opacity-100 -translate-y-0"
                    leaveTo="opacity-0 -translate-y-4"
                    afterLeave={() => setShowTeamForm(true)}
                >
                    <h1 className="text-2xl font-bold">Pick a sport...</h1>
                    <div className="flex flex-col w-full p-5">
                        <div className="flex">
                            <button
                                onClick={() => {
                                    setTemplate(Templates.Soccer);
                                }}
                                title="Soccer"
                                className="h-32 w-32 rounded-lg bg-gray-100 transform hover:-translate-y-1 transition-transform text-center flex flex-col p-3"
                            >
                                <div>Soccer</div>
                            </button>
                        </div>
                    </div>
                </Transition>
                <Transition
                    show={showTeamForm}
                    enter="duration-150 transform transition-all"
                    enterFrom="opacity-0 translate-y-4"
                    enterTo="opacity-100 translate-y-0"
                    leave=" duration-300 transform transition-all"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-4"
                >
                    <h1 className="text-2xl font-bold">Team Details</h1>
                    <div className="flex w-full py-3 justify-evenly">
                        <div className="flex flex-col flex-grow">
                            <h2 className="text-xl font-bold">Team 1</h2>
                            <label htmlFor="team1.name">
                                <div className="text-gray-500 font-light mb-2">
                                    name
                                </div>
                                <input
                                    className="border border-gray-300 rounded-lg bg-gray-100 py-3 px-4 ring-0 outline-none active:bg-gray-200 transition-colors"
                                    {...register("team1.name")}
                                />
                            </label>

                            <label htmlFor="team1drop">
                                <div className="text-gray-500 font-light mb-2">
                                    Logo
                                </div>
                                <div
                                    className="p-3 cursor-pointer border border-gray-300 border-dashed w-36 h-36 rounded-lg bg-gray-100"
                                    {...getRootProps()}
                                >
                                    <input
                                        {...getInputProps({
                                            id: "team1drop",
                                            name: "team1drop",
                                        })}
                                    />
                                    {isDragActive ? (
                                        <p>Drop the files here ...</p>
                                    ) : (
                                        <p>
                                            Drag 'n' drop some files here, or
                                            click to select files
                                        </p>
                                    )}
                                </div>
                            </label>
                        </div>

                        <div className="flex flex-col flex-grow">
                            <h2 className="text-xl font-bold">Team 2</h2>
                            <label htmlFor="team2.name">
                                <div className="text-gray-500 font-light mb-2">
                                    name
                                </div>
                                <input
                                    className="border border-gray-300 rounded-lg bg-gray-100 py-3 px-4 ring-0 outline-none active:bg-gray-200 transition-colors"
                                    {...register("team2.name")}
                                />
                            </label>
                            <label htmlFor="team1drop">
                                <div className="text-gray-500 font-light mb-2">
                                    Logo
                                </div>
                                <div
                                    className="p-3 cursor-pointer border border-gray-300 border-dashed w-36 h-36 rounded-lg bg-gray-100"
                                    {...getRootProps()}
                                >
                                    <input
                                        {...getInputProps({
                                            id: "team2drop",
                                            name: "team2drop",
                                        })}
                                    />
                                    {isDragActive ? (
                                        <p>Drop the files here ...</p>
                                    ) : (
                                        <p>
                                            Drag 'n' drop some files here, or
                                            click to select files
                                        </p>
                                    )}
                                </div>
                            </label>
                        </div>
                    </div>
                </Transition>
            </main>
        </div>
    );
};

export default Create;
