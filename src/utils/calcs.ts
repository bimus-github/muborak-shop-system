export const decreaseByPercent = (value: number, percent: number) =>
  value - (value * percent) / 100;

export const increaseByPercent = (value: number, percent: number) =>
  value + (value * percent) / 100;
