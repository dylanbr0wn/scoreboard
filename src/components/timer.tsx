import { useStopWatch } from "../utils/hooks";
import { zBoard } from "../utils/types/types";
import z from "zod";
import * as React from "react";
import { useStore } from "../utils/store";
import { getTime } from "../utils/utils";

interface TimerProps {
  board: z.infer<typeof zBoard> | undefined;
}

const CustTimer = ({ board }: TimerProps) => {
  const { start, stop } = useStopWatch(
    Number(board?.timeSurpassed),
    board?.lastTimeStateChange
  );

  const { setGoal, time, goal } = useStore((state) => ({
    setGoal: state.setGoal,
    time: state.time,
    goal: state.goal,
  }));

  React.useEffect(() => {
    if (!board?.goalTime) return;
    setGoal(Number(board?.goalTime));
  }, [board?.goalTime]);

  React.useEffect(() => {
    if (!board) return;
    if (board?.isRunning) {
      start();
    }
    if (!board?.isRunning) {
      stop();
    }
  }, [board?.isRunning]);

  return (
    <div className="w-full flex my-auto justify-around">
      <div
        className={`text-7xl font-mono font-semibold transition-colors text-center duration-1000`}
      >
        {getTime(time, goal, board?.countDown) / 60000 < 1 ? (
          <div>
            {(
              "0" +
              Math.floor((getTime(time, goal, board?.countDown) / 1000) % 60)
            ).slice(-2)}
            .
            {(
              "0" +
              (Math.floor(getTime(time, goal, board?.countDown) / 10) % 100)
            ).slice(-2)}
          </div>
        ) : (
          <div>
            {(
              "0" + Math.floor(getTime(time, goal, board?.countDown) / 60000)
            ).slice(-2)}
            :
            {(
              "0" +
              (Math.floor(getTime(time, goal, board?.countDown) / 1000) % 60)
            ).slice(-2)}
          </div>
        )}
      </div>
    </div>
  );
};
export default CustTimer;
