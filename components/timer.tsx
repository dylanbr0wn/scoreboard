import { useStopWatch } from "../utils/hooks";
import { zBoard } from "../utils/types";
import z from "zod";
import * as React from "react";

interface TimerProps {
    board: z.infer<typeof zBoard> | undefined;
}

const CustTimer = ({ board }: TimerProps) => {
    const { setGoal, time, start, stop } = useStopWatch(board?.countDown);

    React.useEffect(() => {
        if (!board?.goalTime) return;
        setGoal(board?.goalTime);
    }, [board?.goalTime]);

    React.useEffect(() => {
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
                {time / 60000 < 1 ? (
                    <div>
                        {("0" + Math.floor((time / 1000) % 60)).slice(-2)}.
                        {("0" + (Math.floor(time / 10) % 100)).slice(-2)}
                    </div>
                ) : (
                    <div>
                        {("0" + Math.floor(time / 60000)).slice(-2)}:
                        {("0" + (Math.floor(time / 1000) % 60)).slice(-2)}
                    </div>
                )}
            </div>
        </div>
    );
};
export default CustTimer;
