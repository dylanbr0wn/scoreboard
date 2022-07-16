import { GetServerSidePropsContext, NextPage } from "next";
import { useRouter } from "next/router";

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
import { Save } from "react-feather";
import TeamEdit from "../../components/TeamEdit";

enum Templates {
  Soccer,
}

export const zBoardForm = z.object({
  team1: zTeam,
  team2: zTeam,
});

const Edit = ({ id }: { id: string }) => {
  const [template, setTemplate] = React.useState<Templates>();

  const { data } = trpc.useQuery(["board.read", { id }], {
    onSuccess: (newData) => {
      // reset({
      //     team1: newData?.board?.teams?.at(0),
      //     team2: newData?.board?.teams?.at(1),
      // });
    },
  });

  const onSubmit = (data: z.infer<typeof zBoardForm>) => {
    console.log(data);
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm<z.infer<typeof zBoardForm>>({
    resolver: zodResolver(zBoardForm),
    reValidateMode: "onChange",
    defaultValues: {
      team1: data?.board?.teams?.at(0),
      team2: data?.board?.teams?.at(1),
    },
    mode: "onChange",
  });

  return (
    <div className="p-0">
      <Header />
      <main className="mt-24 max-w-3xl mx-auto px-2">
        <h1 className="text-2xl font-bold">Team Details</h1>
        <button
          onClick={handleSubmit(onSubmit)}
          className="px-4 py-3 flex text-teal-700 bg-teal-100 rounded-lg active:bg-teal-200 duration-300 transition-colors"
        >
          <Save className="h-6 w-6 mr-3" />
          <div>Save Board</div>
        </button>
        <div className="flex w-full py-3 justify-evenly">
          <TeamEdit register={register} id={id} />
        </div>
      </main>
    </div>
  );
};

const ControlWrapper = () => {
  const { query } = useRouter();
  const { id } = query;

  if (!id || typeof id !== "string") {
    return <div>No ID</div>;
  }

  return <Edit id={id} />;
};

export default ControlWrapper;
