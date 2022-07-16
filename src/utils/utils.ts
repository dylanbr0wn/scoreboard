export const getTime = (
  time: number,
  goal: number,
  countdown?: boolean | undefined
) => {
  if (countdown) {
    return goal - time;
  } else {
    return time;
  }
};
