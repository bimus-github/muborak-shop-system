import { dateFormat } from "./dateFormat";

export const getDaysOfRange = (start: string, end: string) => {
  const startDate = new Date(start).valueOf();
  const endDate = new Date(end).valueOf();

  const days = [];

  for (let date = startDate; date <= endDate; date += 86400000) {
    days.push(dateFormat(new Date(date), true));
  }

  return days;
};
