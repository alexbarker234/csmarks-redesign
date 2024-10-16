export const randBetween = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};
