import * as React from 'react';

interface StopWatchProps {
    countDown?: boolean | undefined;
    

}

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


export const useStopWatch = ( surpassed: number |undefined, countDown?: boolean | undefined,) => {
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
        const timerStart = Date.now() - time
        setRunning(true);
        setTimerStart(timerStart);
        timer.current = setInterval(() => {
                let percent = 0;
                const time = Date.now() - timerStart
                if(time <= goal ){
                    
                    percent = Math.floor(time / goal * 100);
                }if(time > goal){
                    percent = 100;
                }
                setPercent(percent);
                setTime(Date.now() - timerStart);
            }, 10)
        
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