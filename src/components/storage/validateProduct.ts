"use clent";
import { Product } from "@/models/types";
import { langFormat } from "@/utils/langFormat";

export const validateRequired = (value: string) => !!value.length;

export function validateProduct(product: Product) {
  return {
    barcode: !validateRequired(product.barcode)
      ? langFormat({
          uz: "Bar Kod kiritilishi shart!",
          ru: "Пожалуйста, введите ваше имя",
          en: "Please enter your name",
        })
      : "",
    name: !validateRequired(product.name)
      ? langFormat({
          uz: "Ism kiritilishi shart!",
          ru: "Пожалуйста, введите ваше имя",
          en: "Please enter your name",
        })
      : "",
  };
}
