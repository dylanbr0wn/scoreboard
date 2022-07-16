import Header from "../../components/header";
import * as React from "react";
import { Transition } from "@headlessui/react";
import { Board, Team, zTeam } from "../../utils/types/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DropEvent, FileRejection, useDropzone } from "react-dropzone";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { nanoid } from "nanoid";
import TeamInput from "../../components/TeamDropzone";
import { trpc } from "../../utils/trpc";
import { useRouter } from "next/router";

enum Templates {
  Soccer,
}

const zBoardForm = z.object({
  team1: zTeam,
  team2: zTeam,
});

const Create = () => {
  const [template, setTemplate] = React.useState<Templates>();
  const router = useRouter();
  const mutation = trpc.useMutation("board.create", {
    onSuccess: (data) => {
      console.log(data.id);
      router.push(`/${data.id}/edit`);
    },
  });

  return (
    <div className="p-0">
      <Header />
      <main className="mt-24 max-w-3xl mx-auto px-2">
        <h1 className="text-2xl font-bold">Pick a sport...</h1>
        <div className="flex flex-col w-full p-5">
          <div className="flex">
            <button
              onClick={() => {
                mutation.mutate({
                  data: {
                    goalTime: 90 * 60 * 1000,
                    timeSurpassed: 0,
                  },
                });
                setTemplate(Templates.Soccer);
              }}
              title="Soccer"
              className="h-32 w-32 rounded-lg bg-gray-100 transform hover:-translate-y-1 transition-transform text-center flex flex-col p-3"
            >
              <div>Soccer</div>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Create;
