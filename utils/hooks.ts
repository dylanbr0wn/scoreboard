import dayjs from 'dayjs';
import * as React from 'react';

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




export const useStopWatch = ( surpassed: number |undefined,startTime:string | undefined | null, countDown?: boolean | undefined) => {
    const [time, setTime] = React.useState(0);
    const [running, setRunning] = React.useState(false);
    const [goal, setGoal] = React.useState(1000);
    const timer = React.useRef<NodeJS.Timer>();
    const [timerStart, setTimerStart] = React.useState(0);

    const [percent, setPercent] = React.useState(0);

    const reset = () => {
        setRunning(false);
        setTime(0);
        
        setPercent(0);
        clearInterval(timer.current);
    };

    const start = () => {
        let timerStart:number;
        if(initTime > dayjs(startTime).unix()*1000 ){
            timerStart = dayjs(startTime).unix()*1000 - (surpassed ?? time);
        }else{
            timerStart = Date.now() - (surpassed ?? time)
        }
        
        setRunning(true);
        setTimerStart(timerStart);
        clearInterval(timer.current);
        timer.current = setInterval(() => {
                setTime(Date.now() - timerStart);
            }, 100)
        
    };

    React.useEffect(() => {
        if(!surpassed) return
        setTime(surpassed );
    },[surpassed])

    const stop = () => {
        setRunning(false);
        clearInterval(timer.current);
    };

    return { time: countDown ? goal - time : time, reset, start, stop, percent,goal,running, setGoal  };
}