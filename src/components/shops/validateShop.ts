import { Shop } from "@/models/types";
import { langFormat } from "@/utils/langFormat";

export const validateRequired = (value: string) => !!value.length;

export const validateShop = (shop: Shop) => {
  return {
    name: validateRequired(shop.name)
      ? ""
      : langFormat({
          uz: "Ism kiritilishi shart!",
          ru: "Пожалуйста, введите ваше имя",
          en: "Please enter your name",
        }),
  };
};
