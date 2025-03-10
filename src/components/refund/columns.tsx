import { Refund } from "@/models/types";
import { dateFormat } from "@/utils/dateFormat";
import { langFormat } from "@/utils/langFormat";
import { multiDigitNumberFormat } from "@/utils/multiDigitNumberFormat";
import { MRT_ColumnDef } from "material-react-table";
import { useMemo } from "react";

export const useReactCoulmns = () => {
  return useMemo<MRT_ColumnDef<Refund>[]>(
    () => [
      {
        accessorKey: "name",
        header: langFormat({ uz: "Nomi", ru: "Название", en: "Name" }),
        size: 100,
        enableEditing: false,
      },
      {
        accessorKey: "barcode",
        header: langFormat({ uz: "Kod", ru: "Код", en: "Code" }),
        size: 100,
        enableEditing: false,
      },
      {
        accessorKey: "cost",
        header: langFormat({ uz: "Kelish Narxi", ru: "Стоимость", en: "Cost" }),
        size: 100,
        enableEditing: false,
        Filter: () => null,
        Cell: ({ cell }) =>
          multiDigitNumberFormat(cell.getValue<number>()) +
          " " +
          langFormat({ uz: "so'm", ru: "сом", en: "som" }),
      },
      {
        accessorKey: "count",
        header: langFormat({ uz: "Soni", ru: "Количество", en: "Count" }),
        size: 100,
        enableEditing: false,
        Filter: () => null,
      },
      {
        accessorKey: "shopName",
        header: "Magazin",
        size: 100,
        enableEditing: false,
      },
      {
        accessorKey: "date",
        accessorFn: (row) => dateFormat(row.date),
        header: langFormat({ uz: "Sana", ru: "Дата", en: "Date" }),
        size: 100,
        enableEditing: false,
      },
    ],
    []
  );
};
