import create, { StateCreator } from "zustand";

export interface TimeSlice {
    time: number;
    running: boolean;
    goal: number;
    setTime: (time: number) => void;
    setRunning: (running: boolean) => void;
    setGoal: (goal: number) => void;
}

const createTimeSlice: StateCreator<TimeSlice> = set => ({
    time: 0,
    running: false,
    goal: 1000,
    setTime: (time: number) => set(() => ({ time })),
    setRunning: (running: boolean) => set(() => ({ running })),
    toggleRunning: () => set((state) => ({ running: !state.running })),
    setGoal: (goal: number) => set(() => ({ goal })),
})



export const useStore = create<TimeSlice>()((...a) => ({
    ...createTimeSlice(...a)
}))