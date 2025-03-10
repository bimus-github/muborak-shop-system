/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useGetBuyers } from "@/hooks/buyer";
import { SALE_FORM, Saled_Product } from "@/models/types";
import { dateFormat } from "@/utils/dateFormat";
import { langFormat } from "@/utils/langFormat";
import { multiDigitNumberFormat } from "@/utils/multiDigitNumberFormat";
import { MRT_ColumnDef } from "material-react-table";
import { useMemo } from "react";
import {
  FiletrBySaleForm,
  FilterByBuyer,
  FilterByDate,
  ProductNameCell,
  ProfitFooter,
  SaleFormCell,
  TotalFooter,
} from "./Helper";

export const useReactColumns = () => {
  const { data: buyersData } = useGetBuyers();
  return useMemo<MRT_ColumnDef<Saled_Product>[]>(
    () => [
      //   buyer
      {
        accessorKey: "buyerName",
        accessorFn: (row) => {
          const isLocalBuyer = buyersData?.buyers.find(
            (buyer) => buyer.name === row.buyerName
          );

          return isLocalBuyer
            ? isLocalBuyer.name
            : `BOSHQA HARIDORLAR ${row.buyerName}`;
        },
        enableEditing: false,
        size: 100,
        header: langFormat({ uz: "Haridor", ru: "Покупатель", en: "Buyer" }),
        Filter: FilterByBuyer,
        filterFn: "startsWith",
      },
      //   sale form
      {
        accessorKey: "form",
        enableEditing: false,
        filterFn: "arrIncludes",
        accessorFn: (row) =>
          row.form === SALE_FORM.CASH
            ? "Naqd"
            : row.form === SALE_FORM.CARD
            ? "Plastik"
            : "Nasiya",
        Cell: SaleFormCell,
        size: 100,
        header: langFormat({ uz: "Savdo Shakli", ru: "Форма", en: "Form" }),
        Filter: FiletrBySaleForm,
      },
      //   total
      {
        accessorKey: "total",
        accessorFn: (row) =>
          multiDigitNumberFormat(
            row?.quantity *
              row?.saledPrice *
              (1 - Number(row?.discount) / 100) || 0
          ) +
          " " +
          langFormat({ uz: "so'm", ru: "сум", en: "so'm" }),
        header: langFormat({ uz: "Jami", ru: "Итого", en: "Total" }),
        enableEditing: false,
        size: 100,
        Filter: () => null,
        Footer: TotalFooter,
      },
      //   sale quantity
      {
        accessorKey: "quantity",
        enableEditing: false,
        size: 100,
        header: langFormat({ uz: "Soni", ru: "Количество", en: "Quantity" }),
        Filter: () => null,
      },
      //   product_name
      {
        accessorKey: "name",
        header: langFormat({ uz: "Mahsulot", ru: "Продукт", en: "Product" }),
        enableEditing: false,
        size: 100,
        Filter: () => null,
        Cell: ProductNameCell,
      },
      //   barcode
      {
        accessorKey: "barcode",
        header: langFormat({ uz: "Barkod", ru: "Баркод", en: "Barcode" }),
        enableEditing: false,
        size: 100,
      },
      //   cost
      {
        accessorKey: "cost",
        header: langFormat({ uz: "Kelish narxi", ru: "Стоимость", en: "Cost" }),
        enableEditing: false,
        size: 100,
        Filter: () => null,
      },
      //   saled price
      {
        accessorKey: "saledPrice",
        accessorFn: (row) =>
          multiDigitNumberFormat(row?.saledPrice || 0) +
          " " +
          langFormat({ uz: "so'm", ru: "сум", en: "so'm" }),
        header: langFormat({
          uz: "Sotilish narxi(donaga)",
          ru: "Цена продажи(ед.)",
          en: "Price per count",
        }),
        enableEditing: false,
        size: 100,
        Filter: () => null,
      },
      //  date
      {
        accessorKey: "date",
        accessorFn: (row) => dateFormat(row?.date),
        enableEditing: false,
        size: 150,
        header: langFormat({ uz: "Sana", ru: "Дата", en: "Date" }),
        Filter: FilterByDate,
        enableSorting: false,
      },
      // saledDate
      {
        accessorKey: "saledDate",
        accessorFn: (row) =>
          dateFormat(row?.saledDate ? row?.saledDate : row?.date),
        enableEditing: false,
        size: 150,
        header: "Sotilgan sana",
      },
      //   profit
      {
        accessorKey: "profit",
        header: langFormat({ uz: "Foyda", ru: "Прибыль", en: "Profit" }),
        accessorFn: (row) =>
          multiDigitNumberFormat(
            row?.quantity *
              (row?.saledPrice * (1 - Number(row?.discount) / 100) -
                Number(row?.cost)) || 0
          ) +
          " " +
          langFormat({ uz: "so'm", ru: "сум", en: "so'm" }),
        enableEditing: false,
        size: 100,
        Filter: () => null,
        Footer: ProfitFooter,
      },
      //   discount
      {
        accessorKey: "discount",
        header: langFormat({ uz: "Chegirma", ru: "Скидка", en: "Discount" }),
        enableEditing: false,
        size: 100,
        Filter: () => null,
        Edit: () => null,
      },
    ],
    [buyersData?.buyers]
  );
};
