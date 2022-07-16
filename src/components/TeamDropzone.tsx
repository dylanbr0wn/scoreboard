import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { nanoid } from "nanoid";
import * as React from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import toast, { LoaderIcon } from "react-hot-toast";
import { useQueryClient } from "react-query";
import ErrorBoundary from "./ErrorBoundary";
import { trpc } from "../utils/trpc";
import { Board, Team } from "../utils/types/types";
import { Image, Loader } from "react-feather";

const error = (message: string) => toast.error(message);

const TeamInput = ({
	boardId,
	team,
}: {
	team: Team | undefined;
	boardId: string | undefined;
}) => {
	const [loadingImages, setLoadingImages] = React.useState(false);
	const utils = trpc.useContext();
	const [dragOver, setDragOver] = React.useState(false);

	const mutation = trpc.useMutation(["team.update"], {
		onSuccess: (newData) => {
			console.log(newData);
			utils.refetchQueries(["team.read"]);
		},
	});

	React.useEffect(() => {
		setLoadingImages(false);
	}, [team?.logo]);

	const onDrop = React.useCallback(
		async (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
			if (!boardId) return;

			if (rejectedFiles?.at(0)?.errors[0].code === "file-too-large") {
				error(
					`Oh no, ${rejectedFiles[0].file.name} was not uploaded because the file is larger than 100kb!`
				);
			}
			if (rejectedFiles?.at(0)?.errors[0].code === "too-many-files") {
				error(`Woops! You are only alowed to upload 1 file.`);
			}

			acceptedFiles.forEach(async (file) => {
				setLoadingImages(true);
				const extension = file.name.substring(file.name.lastIndexOf(".") + 1);
				await supabaseClient.storage
					.from("logos")
					.upload(`${boardId}_${team?.id}.${extension}`, file, {
						upsert: true,
					});
				const res = supabaseClient.storage
					.from("logos")
					.getPublicUrl(`${boardId}_${team?.id}.${extension}`);
				await mutation.mutateAsync({
					id: team?.id ?? "",
					data: {
						logo: res.publicURL,
					},
				});
			});
		},
		[team, boardId, mutation]
	);
	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		maxSize: 100000,
		maxFiles: 1,
		onDrop,
		onDragEnter: () => setDragOver(true),
		onDragLeave: () => setDragOver(false),
	});
	const formId = React.useId();
	return (
		<ErrorBoundary>
			<label
				className="flex flex-col  justify-center text-center"
				htmlFor={formId}
			>
				<div className="text-sm text-gray-600 font-light">Logo/Crest</div>
				<div
					className={`cursor-pointer relative w-36 h-36 mx-auto rounded-lg bg-gray-50 hover:bg-gray-100 active:bg-gray-200 transition-all group outline-none ring-0 focus-visible:bg-gray-100 ${
						dragOver ? "ring-2 ring-green-600" : ""
					}`}
					{...getRootProps()}
				>
					{loadingImages ? (
						<div className="w-full h-full absolute top-0 left-0 p-8 rounded-lg opacity-70 bg-gray-300 animate-pulse">
							<Image className="h-full w-full text-gray-500" />
						</div>
					) : team?.logo ? (
						<>
							<div className="w-full h-full absolute top-0 left-0 p-2 rounded-lg  ">
								<img
									src={team?.logo ?? ""}
									alt={`${team.name} logo`}
									className="w-full h-full rounded-lg opacity-100 transition-opacity"
								/>
							</div>

							<div
								className={`relative h-full w-full p-3 group-hover:opacity-100 bg-gray-50/50 rounded-lg transition-opacity ${
									dragOver ? "opacity-100" : "opacity-0"
								}`}
							>
								<input
									{...getInputProps({
										id: formId,
										name: formId,
									})}
								/>
								{isDragActive ? (
									<div className="text-center">
										<p>Drop the files here ...</p>
										<Image className="h-12 w-12  mx-auto mt-5" />
									</div>
								) : (
									<div className="text-center">
										<p>Add files ...</p>
										<Image className="h-12 w-12  mx-auto mt-5" />
									</div>
								)}
							</div>
						</>
					) : (
						<>
							<input
								{...getInputProps({
									id: formId,
									name: formId,
								})}
							/>
							{isDragActive ? (
								<div className="text-center">
									<p>Drop the files here ...</p>
									<Image className="h-12 w-12  mx-auto mt-5" />
								</div>
							) : (
								<div className="text-center">
									<p>Add files ...</p>
									<Image className="h-12 w-12  mx-auto mt-5" />
								</div>
							)}
						</>
					)}
				</div>
			</label>
		</ErrorBoundary>
	);
};
export default TeamInput;
