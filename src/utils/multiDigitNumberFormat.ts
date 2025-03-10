export const multiDigitNumberFormat = (number: number) => {
  return (number || 0).toLocaleString("ru-RU", {
    maximumFractionDigits: 0,
  });
};
