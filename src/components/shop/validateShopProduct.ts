import { Product } from "@/models/types";
import { langFormat } from "@/utils/langFormat";

export const validateRequired = (value: string) => !!value?.length;

export const validateShopProduct = (product: Product) => {
  return {
    name: validateRequired(product.name)
      ? ""
      : langFormat({
          uz: "Ism kiritilishi shart!",
          ru: "Пожалуйста, введите ваше имя",
          en: "Please enter your name",
        }),
    barcode: validateRequired(product.barcode)
      ? ""
      : langFormat({
          uz: "Kod kiritilishi shart!",
          ru: "Пожалуйста, введите ваше имя",
          en: "Please enter your name",
        }),
    price: validateRequired(product.price.toString())
      ? ""
      : langFormat({
          uz: "Narx kiritilishi shart!",
          en: "Please enter price",
          ru: "Пожалуйста, введитe цену",
        }),
    count: validateRequired(product.count.toString())
      ? ""
      : langFormat({
          uz: "Soni kiritilishi shart!",
          en: "Please enter count",
          ru: "Пожалуйста, введите количество",
        }),
    cost: validateRequired(product.cost.toString())
      ? ""
      : langFormat({
          uz: "Kelgan narx kiritilishi shart!",
          en: "Please enter cost",
          ru: "Пожалуйста, введите стоимость",
        }),
  };
};
