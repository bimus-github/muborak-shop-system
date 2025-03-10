"use client";
import { Shop } from "@/models/types";
import { dateFormat } from "@/utils/dateFormat";
import { langFormat } from "@/utils/langFormat";
import { multiDigitNumberFormat } from "@/utils/multiDigitNumberFormat";
import { MRT_ColumnDef } from "material-react-table";
import { Dispatch, useMemo } from "react";

interface Props {
  validationErrors?: Record<string, string | undefined>;
  setValidationErrors: Dispatch<Record<string, string | undefined>>;
}

export const useReactColumns = (props: Props) =>
  useMemo<MRT_ColumnDef<Shop>[]>(
    () => [
      {
        accessorKey: "name",
        header: langFormat({ uz: "Nomi", ru: "Название", en: "Name" }),
        enableEditing: true,
        size: 100,
        filterFn: "startsWithNoSpace",
        autoFocus: true,
        muiEditTextFieldProps: {
          type: "text",
          error: !!props.validationErrors?.name,
          helperText: props.validationErrors?.name,
          autoFocus: true,
          onFocus: () => {
            props.setValidationErrors({
              ...props.validationErrors,
              name: undefined,
            });
          },
        },
      },
      {
        accessorKey: "phone",
        header: langFormat({
          uz: "Qo'shimcha",
          ru: "Дополнительные",
          en: "Extra",
        }),
        enableEditing: true,
        size: 100,
        muiEditTextFieldProps: {
          type: "text",
          error: !!props.validationErrors?.phone,
          helperText: props.validationErrors?.phone,
          onFocus: () => {
            props.setValidationErrors({
              ...props.validationErrors,
              phone: undefined,
            });
          },
        },
      },
      {
        accessorKey: "loan_price",
        header: langFormat({
          uz: "Qarzdorlik summasi",
          ru: "Сумма кредита",
          en: "Loan amount",
        }),
        enableEditing: true,
        size: 100,
        Footer(props) {
          const rows = props.table.getFilteredRowModel().rows;
          return (
            <>
              {multiDigitNumberFormat(
                rows?.reduce((sum, row) => sum + row.original.loan_price, 0)
              ) +
                " " +
                langFormat({ uz: "so'm", ru: "сум", en: "so'm" })}
            </>
          );
        },
        Filter: () => null,
        Cell: ({ cell }) =>
          multiDigitNumberFormat(cell.getValue<number>()) +
          " " +
          langFormat({ uz: "so'm", ru: "сум", en: "so'm" }),
      },
      {
        accessorKey: "date",
        accessorFn: (row) => dateFormat(row.date),
        header: langFormat({ uz: "Sana", ru: "Дата", en: "Date" }),
        enableEditing: false,
        enableSorting: false,
        size: 100,
        Edit: () => null,
      },
      {
        enableEditing: false,
        accessorFn: (row) =>
          multiDigitNumberFormat(
            row.products?.reduce(
              (sum, product) => sum + product.cost * product.count,
              0
            ) || 0
          ) +
          " " +
          langFormat({ uz: "so'm", ru: "сум", en: "so'm" }),
        header: langFormat({
          uz: "Jami kelish",
          ru: "Всего покупок",
          en: "Total purchases",
        }),
        Footer(props) {
          const rows = props.table.getFilteredRowModel().rows;
          return (
            <>
              {multiDigitNumberFormat(
                rows.reduce(
                  (sum, row) =>
                    sum +
                    row.original.products?.reduce(
                      (sum, product) => sum + product.cost * product.count,
                      0
                    ),
                  0
                )
              ) +
                " " +
                langFormat({ uz: "so'm", ru: "сум", en: "so'm" })}
            </>
          );
        },
        Filter: () => null,
        Edit: () => null,
      },
      {
        enableEditing: false,
        accessorFn: (row) =>
          multiDigitNumberFormat(
            row.products?.reduce(
              (sum, product) =>
                sum + (product.price - product.cost) * product.count,
              0
            ) || 0
          ) +
          " " +
          langFormat({ uz: "so'm", ru: "сум", en: "so'm" }),
        header: langFormat({ uz: "Foyda", ru: "Прибыль", en: "Profit" }),
        Footer(props) {
          const rows = props.table.getFilteredRowModel().rows;
          return (
            <>
              {multiDigitNumberFormat(
                rows.reduce(
                  (sum, row) =>
                    sum +
                    row.original.products?.reduce(
                      (sum, product) =>
                        sum + (product.price - product.cost) * product.count,
                      0
                    ),
                  0
                )
              ) +
                " " +
                langFormat({ uz: "so'm", ru: "сум", en: "so'm" })}
            </>
          );
        },
        Filter: () => null,
        Edit: () => null,
      },
    ],
    [props]
  );
