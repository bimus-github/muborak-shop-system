import { CASH_REASON, Cash } from "@/models/types";
import { langFormat } from "@/utils/langFormat";

export const validateRequired = (value: string) => !!value;
export const validateReason = (value: CASH_REASON) =>
  value !== CASH_REASON.NONE;

export const validateCash = (cash: Cash) => ({
  cash: !validateRequired(cash.value.toString())
    ? langFormat({
        uz: "Narx kiritilishi shart!",
        ru: "Пожалуйста, введите ваше имя",
        en: "Please enter your name",
      })
    : "",
  reason: !validateReason(cash.reason)
    ? langFormat({
        uz: "Izoh kiritilishi shart!",
        ru: "Пожалуйста, введите ваше имя",
        en: "Please enter your name",
      })
    : "",
});
