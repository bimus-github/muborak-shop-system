import { Saled_Product } from "@/models/types";
import dayjs from "dayjs";

export const groupSaledProductsByDays = (
  products: Saled_Product[],
  days: string[]
) => {
  const groupedSaledProducts: Saled_Product[][] = [];

  (days || []).forEach((day, i) => {
    groupedSaledProducts[i] =
      products?.filter((p) => dayjs(p.date).format("DD.MM.YY") === day) || [];
  });

  return groupedSaledProducts;
};
