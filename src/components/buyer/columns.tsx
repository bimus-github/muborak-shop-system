"use client";
import { useGetSales } from "@/hooks/sale";
import { Buyer, SALE_FORM, Saled_Product } from "@/models/types";
import { langFormat } from "@/utils/langFormat";
import { multiDigitNumberFormat } from "@/utils/multiDigitNumberFormat";
import { Typography } from "@mui/material";
import {
  MRT_Cell,
  MRT_Column,
  MRT_ColumnDef,
  MRT_Row,
  MRT_TableInstance,
} from "material-react-table";
import { Dispatch, useMemo } from "react";
import search from "search-in-js";

interface Props {
  validationErrors?: Record<string, string | undefined>;
  setValidationErrors: Dispatch<Record<string, string | undefined>>;
}

type CellProps = {
  cell: MRT_Cell<Buyer, unknown>;
  column: MRT_Column<Buyer, unknown>;
  renderedCellValue: React.ReactNode;
  table: MRT_TableInstance<Buyer>;
  row: MRT_Row<Buyer>;
};

const LoanFooter = () => {
  const { data: salesData } = useGetSales();

  return (
    <Typography sx={{ color: "red" }}>
      {multiDigitNumberFormat(
        search<Saled_Product>(
          SALE_FORM.LOAN,
          salesData?.sales || [],
          ["form"],
          "equal"
        ).reduce(
          (sum, sale) =>
            sum + sale.saledPrice * sale.quantity * (1 - sale.discount / 100),
          0
        )
      ) +
        " " +
        lang["sum"]}
    </Typography>
  );
};
const TotaleFooter = () => {
  const { data: salesData } = useGetSales();

  return (
    <Typography sx={{ color: "green" }}>
      {multiDigitNumberFormat(
        ((salesData?.sales as Saled_Product[]) || []).reduce(
          (sum, sale) =>
            sum + sale.saledPrice * sale.quantity * (1 - sale.discount / 100),
          0
        )
      ) +
        " " +
        lang["sum"]}
    </Typography>
  );
};

const LoanCell = (props: CellProps) => {
  return (
    <Typography sx={{ color: "red" }}>
      {multiDigitNumberFormat(
        (props.renderedCellValue?.valueOf() || 0) as number
      ) +
        " " +
        lang["sum"]}
    </Typography>
  );
};

const TotalCell = (props: CellProps) => {
  return (
    <Typography sx={{ color: "green" }}>
      {multiDigitNumberFormat(
        (props.renderedCellValue?.valueOf() || 0) as number
      ) +
        " " +
        lang["sum"]}
    </Typography>
  );
};

export const useReactColumns = ({
  validationErrors,
  setValidationErrors,
}: Props) => {
  const { data: salesData } = useGetSales();
  return useMemo<MRT_ColumnDef<Buyer>[]>(
    () => [
      {
        accessorKey: "name",
        header: lang["name"],
        muiEditTextFieldProps: {
          type: "text",
          error: !!validationErrors?.name,
          helperText: validationErrors?.name,
          onFocus: () => {
            setValidationErrors({
              ...validationErrors,
              name: undefined,
            });
          },
        },
      },
      {
        accessorKey: "info",
        header: lang["extra_info"],
      },
      {
        accessorKey: "messageId",
        header: "Telegram ID",
      },
      {
        accessorKey: "loan",
        header: langFormat({ uz: "Qarz", ru: "Задолженность", en: "Loan" }),
        accessorFn: (row) =>
          search(
            SALE_FORM.LOAN,
            search<Saled_Product>(
              row.name,
              salesData?.sales || [],
              ["buyerName"],
              "equal"
            ),
            ["form"],
            "equal"
          ).reduce(
            (sum, sale) =>
              sum + sale.saledPrice * sale.quantity * (1 - sale.discount / 100),
            0
          ) || 0,
        Cell: LoanCell,
        Footer: LoanFooter,
        Filter: () => null,
        Edit: () => null,
      },
      {
        accessorKey: "total",
        header: lang["total"],
        accessorFn: (row) =>
          search<Saled_Product>(
            row.name,
            salesData?.sales || [],
            ["buyerName"],
            "equal"
          ).reduce(
            (sum, sale) =>
              sum +
              sale.saledPrice * sale.quantity * (1 - (sale.discount || 0)),
            0
          ) || 0,
        Cell: TotalCell,
        Footer: TotaleFooter,
        Filter: () => null,
        Edit: () => null,
      },
    ],
    [salesData, validationErrors, setValidationErrors]
  );
};

const lang = {
  sum: langFormat({ uz: "so'm", ru: "сум", en: "sum" }),
  name: langFormat({ uz: "Ism", ru: "Имя", en: "Name" }),
  extra_info: langFormat({ uz: "Tavsif", ru: "Описание", en: "Description" }),
  total: langFormat({ uz: "Jami", ru: "Всего", en: "Total" }),
};
