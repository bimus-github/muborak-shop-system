import { CASH_REASON, Cash } from "@/models/types";
import { dateFormat } from "@/utils/dateFormat";
import { langFormat } from "@/utils/langFormat";
import { multiDigitNumberFormat } from "@/utils/multiDigitNumberFormat";
import { MRT_ColumnDef } from "material-react-table";
import { useMemo } from "react";

interface Props {
  validationErrors?: Record<string, string | undefined>;
  setValidationErrors: (value: Record<string, string | undefined>) => void;
}

export const useColumns = (props: Props) => {
  const { setValidationErrors, validationErrors } = props;
  return useMemo<MRT_ColumnDef<Cash>[]>(
    () => [
      {
        accessorKey: "value",
        header: lang["value"],
        size: 100,
        muiEditTextFieldProps: {
          type: "number",
          error: !!validationErrors?.value,
          helperText: validationErrors?.value,
          autoFocus: true,
          onFocus: () => {
            setValidationErrors({
              ...validationErrors,
              value: undefined,
            });
          },
        },
        Cell: ({ cell }) => (
          <>
            {multiDigitNumberFormat(cell.row.original.value) +
              " " +
              lang["sum"]}
          </>
        ),
        Filter: () => null,
        Footer: ({ table }) => (
          <>
            {multiDigitNumberFormat(
              table
                .getFilteredRowModel()
                .rows.reduce((sum, row) => sum + row.original.value, 0)
            ) +
              " " +
              lang["sum"]}
          </>
        ),
      },
      {
        accessorKey: "reason",
        header: lang["reason"],
        size: 100,
        editVariant: "select",
        filterVariant: "select",
        filterSelectOptions: [
          CASH_REASON.NONE,
          CASH_REASON.PUT,
          CASH_REASON.TAKE,
        ],
        editSelectOptions: [
          CASH_REASON.NONE,
          CASH_REASON.PUT,
          CASH_REASON.TAKE,
        ],
        muiEditTextFieldProps: {
          error: !!validationErrors?.reason,
          helperText: validationErrors?.reason,
          onFocus: () => {
            setValidationErrors({
              ...validationErrors,
              reason: undefined,
            });
          },
        },
      },
      {
        accessorKey: "extraInfo",
        header: lang["extra_info"],
        size: 100,
        muiEditTextFieldProps: {
          type: "text",
          error: !!validationErrors?.extraInfo,
          helperText: validationErrors?.extraInfo,
          onFocus: () => {
            setValidationErrors({
              ...validationErrors,
              extraInfo: undefined,
            });
          },
        },
      },
      {
        accessorKey: "date",
        header: lang["date"],
        size: 100,
        Cell: ({ cell }) => <>{dateFormat(cell.row.original.date)}</>,
        enableEditing: false,
        Edit: () => null,
      },
    ],
    [setValidationErrors, validationErrors]
  );
};

const lang = {
  value: langFormat({ uz: "Summa", ru: "Сумма", en: "Value" }),
  reason: langFormat({ en: "Reason", ru: "Причина", uz: "Sabab" }),
  extra_info: langFormat({
    uz: "Qo'shimcha ma'lumot",
    ru: "Доп. информация",
    en: "Extra info",
  }),
  date: langFormat({ uz: "Sana", ru: "Дата", en: "Date" }),
  sum: langFormat({ uz: "so'm", ru: "сум", en: "so'm" }),
};
