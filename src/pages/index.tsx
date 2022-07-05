import type { GetServerSidePropsContext, NextPage } from "next";
import Head from "next/head";
import Header from "../components/header";
import { useRouter } from "next/router";
import * as React from "react";
import { Transition, Dialog, Popover } from "@headlessui/react";
import { ChevronDown, Maximize, Minimize, Plus, X } from "react-feather";

import dayjs from "dayjs";
import Link from "next/link";
import Modal from "../components/modal";
import CustPopover from "../components/popover";
import { Board, zBoard } from "../utils/types/types";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
    const [selected, setSelected] = React.useState<Board>();
    const [open, setOpen] = React.useState(false);

    const { data, error, isLoading } = trpc.useQuery(["boards.read"], {
        onSuccess: (data) => {
            console.log(data);
        },
    });

    const router = useRouter();

    return (
        <div className="p-0">
            <Header />
            <main className="mt-24 max-w-3xl mx-auto">
                <div className="flex flex-col w-full">
                    <div className="font-extrabold text-3xl my-8">
                        My Boards
                    </div>
                    <div className="flex my-3">
                        <button
                            onClick={() => router.push("/create")}
                            className="px-4 py-3 flex text-teal-700 bg-teal-100 rounded-lg active:bg-teal-200 duration-300 transition-colors"
                        >
                            <Plus className="h-6 w-6 mr-3" />
                            <div>New Board</div>
                        </button>
                    </div>
                    <div className="rounded-lg overflow-hidden w-full">
                        <table className="w-full table-auto text-left border-separate border-spacing-0">
                            <thead className="bg-gray-100  font-bold py-2">
                                <tr className="   px-4 ">
                                    <th className="sticky top-0 z-10 border-b border-gray-300  p-3">
                                        Id
                                    </th>
                                    <th className="sticky top-0 z-10 border-b border-gray-300 p-3">
                                        Is Open
                                    </th>
                                    <th className="sticky top-0 z-10 border-b border-gray-300  p-3">
                                        Is Running
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.map((board) => (
                                    <tr
                                        onClick={() => {
                                            setSelected(board);
                                            setOpen(true);
                                        }}
                                        key={board.id}
                                        className="odd:bg-gray-50 border-b border-gray-200 cursor-pointer last:border-none"
                                    >
                                        <td className="font-medium p-3">
                                            {board.name}
                                        </td>
                                        <td className=" text-black font-thin p-3">
                                            {board.isOpen ? "true" : "false"}
                                        </td>
                                        <td className="text-black font-thin p-3">
                                            {board.isRunning ? "true" : "false"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <Modal open={open} onClose={() => setOpen(false)}>
                    <button
                        onClick={() => setOpen(false)}
                        className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-lg active:bg-gray-200 text-gray-400 hover:text-gray-600 duration-300 transition-colors"
                    >
                        <X className="h-6 w-6 " />
                    </button>
                    <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900"
                    >
                        {selected?.name}
                    </Dialog.Title>

                    <div className="my-2 py-2">
                        <div className="flex flex-col space-y-2">
                            <div className="flex">
                                <div className="mr-4 font-medium">Name:</div>
                                <div className="text-gray-500">
                                    {selected?.name}
                                </div>
                            </div>
                            <div className="flex">
                                <div className="mr-4 font-medium">ID:</div>
                                <div className="text-gray-500">
                                    {selected?.id}
                                </div>
                            </div>
                            <div className="flex">
                                <div className="mr-4 font-medium">Is Live:</div>
                                <div className="text-gray-500">
                                    {selected?.isOpen ? "Yes" : "No"}
                                </div>
                            </div>
                            <div className="flex">
                                <div className="mr-4 font-medium">Is Live:</div>
                                <div className="text-gray-500">
                                    {selected?.isRunning ? "true" : "false"}
                                </div>
                            </div>

                            <div className="flex">
                                <div className="mr-4 font-medium">Created:</div>
                                <div className="text-gray-500">
                                    {dayjs(selected?.createdAt).format(
                                        "MMM D, YYYY, H:mm a"
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="my-2 py-2">
                        <div className="flex space-x-3 justify-end">
                            <CustPopover>
                                <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                                    <div className="relative divide-y divide-gray-200 flex flex-col  bg-white p-3 ">
                                        <div className="pb-2">
                                            <Link
                                                href={`/board/${selected?.id}?size=fullscreen`}
                                            >
                                                <a
                                                    className="flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-violet-100 
                                                    hover:text-violet-800 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50 group"
                                                    target="_blank"
                                                >
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center sm:h-12 sm:w-12">
                                                        <Maximize className="w-full h-full p-2" />
                                                    </div>
                                                    <div className="ml-4">
                                                        <p className="text-sm font-medium text-gray-900 group-hover:text-violet-800">
                                                            Fullscreen
                                                        </p>
                                                        <p className="text-sm text-gray-500 group-hover:text-violet-500">
                                                            Open in fullscreen
                                                            mode with no menu
                                                        </p>
                                                    </div>
                                                </a>
                                            </Link>
                                        </div>
                                        <div className="pt-2">
                                            <Link
                                                href={`/board/${selected?.id}?size=windowed`}
                                            >
                                                <a
                                                    className="flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-violet-100 
                                                    hover:text-violet-800
                                                    focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50 group"
                                                >
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center sm:h-12 sm:w-12">
                                                        <Minimize className="w-full h-full p-2" />
                                                    </div>
                                                    <div className="ml-4">
                                                        <p className="text-sm font-medium text-gray-900 group-hover:text-violet-800">
                                                            Windowed
                                                        </p>
                                                        <p className="text-sm text-gray-500 group-hover:text-violet-500">
                                                            Open with menu
                                                        </p>
                                                    </div>
                                                </a>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </CustPopover>
                            <Link href={`/control/${selected?.id}`}>
                                <a>
                                    <button className="px-4 py-3 bg-cyan-100 rounded-lg active:bg-cyan-200 text-cyan-800 duration-300 transition-colors">
                                        Open Controls
                                    </button>
                                </a>
                            </Link>
                        </div>
                    </div>
                </Modal>
            </main>
        </div>
    );
};

export default Home;
