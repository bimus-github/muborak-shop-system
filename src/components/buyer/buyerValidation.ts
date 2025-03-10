import { Buyer } from "@/models/types";
import { langFormat } from "@/utils/langFormat";

export const validateRequired = (value: string) => !!value.length;

export const validateBuyer = (buyer: Buyer) => ({
  name: !validateRequired(buyer.name)
    ? langFormat({
        uz: "Ismni Kiritishingiz Shart",
        ru: "Пожалуйста, введите ваше имя",
        en: "Please enter your name",
      })
    : "",
});
