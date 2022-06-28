import dayjs from 'dayjs';
import * as React from 'react';
import { useStore } from './store';

interface StopWatchProps {
    countDown?: boolean | undefined;


}

const initTime = Date.now();



/**
 * 
 * Ok so we havea  couple states to think about here:
 * 1. The board is not running and has not been started.
 *    - both start and last change will be null
 *    - time left will be goal time
 *    - isRunning should be false
 * 2. The board is not running and has been started
 *    - both start and last change will not be null, start time may not be same as last change
 *    - time left will be remaining time to recaulcute time to complete
 *    - isRunning should be false
 * 3. The board is running
 *    - last change will be the new "start time of the board"
 *    - time left will be the time left to complete the board starting at last change
 *    - isRunning should be true
 * 
 * 
 * 
 */




export const useStopWatch = (surpassed: number | undefined, startTime: string | undefined | null) => {
    // const [time, setTime] = React.useState(0);
    // const [running, setRunning] = React.useState(false);
    // const [goal, setGoal] = React.useState(1000);
    const timer = React.useRef<NodeJS.Timer>();

    const time = React.useRef(useStore.getState().time)

    const { setTime, setRunning } = useStore(state => ({
        setTime: state.setTime,
        setRunning: state.setRunning,
    }))

    const reset = () => {
        setRunning(false);
        setTime(0);
        clearInterval(timer.current);
    };

    React.useEffect(() => {
        useStore.subscribe(
            state => (time.current = state.time)
        )
    }, [])

    const start = () => {
        let timerStart: number;
        if (initTime > dayjs(startTime).unix() * 1000) {
            timerStart = dayjs(startTime).unix() * 1000 - (surpassed ?? time.current); // if it has started before the page has loaded, we need to subtract the time that has already passed from the start time
        } else {
            timerStart = Date.now() - (surpassed ?? time.current); // if it has started after the page has loaded, we need to subtract the time that has already passed from the current time
        }

        setRunning(true);
        clearInterval(timer.current); // need to clear interval to prevent it from running multiple times
        timer.current = setInterval(() => {
            setTime(Date.now() - timerStart);
        }, 100)

    };

    React.useEffect(() => {
        if (surpassed === undefined) return
        setTime(surpassed);
    }, [surpassed])

    const stop = () => {
        setRunning(false);
        clearInterval(timer.current);
    };

    return { reset, start, stop };
}