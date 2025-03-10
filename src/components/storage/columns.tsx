/* eslint-disable react/jsx-key */
"use clent";

import { Product } from "@/models/types";
import { langFormat } from "@/utils/langFormat";
import { multiDigitNumberFormat } from "@/utils/multiDigitNumberFormat";
import {
  Autocomplete,
  Box,
  Chip,
  Dialog,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { MRT_ColumnDef } from "material-react-table";
import { Dispatch, useMemo, useState } from "react";
import BarcodeModal from "../barcode-modal";
import { ProductInfoDialogContainer } from "../product";
import { Info } from "@mui/icons-material";

interface Props {
  validationErrors?: Record<string, string | undefined>;
  setValidationErrors: Dispatch<Record<string, string | undefined>>;
}

const QrCodeEdit: MRT_ColumnDef<Product>["Edit"] = ({ row }) => {
  const [values, setValues] = useState<string[]>(
    (row?._valuesCache["qrCodes"] || "")
      ?.split(",")
      .filter((val: string) => !!val.trim()) || []
  );
  return (
    <Autocomplete
      multiple
      value={values}
      options={[]}
      freeSolo
      renderTags={(value: string[], getTagProps) => {
        return value.map((val, index) => (
          <Chip {...getTagProps({ index })} key={val} label={val} />
        ));
      }}
      onChange={(_, value) => {
        row._valuesCache["qrCodes"] = value.join(",");
        setValues(value);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={langFormat({ uz: "QrCode", ru: "Код", en: "QrCode" })}
          placeholder={langFormat({ uz: "QrCode", ru: "Код", en: "QrCode" })}
          variant="standard"
        />
      )}
    />
  );
};

export const useReactColumns = (props: Props) =>
  useMemo<MRT_ColumnDef<Product>[]>(
    () => [
      {
        accessorKey: "name",
        header: lang["name"],
        enableEditing: true,
        size: 100,
        filterFn: "fuzzy",
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
        Cell: ({ row }) => {
          const [open, setOpen] = useState(false);
          return (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography>{row.original.name}</Typography>
              <IconButton onClick={() => setOpen(true)}>
                <Info />
              </IconButton>
              <Dialog
                onClose={() => setOpen(false)}
                open={open}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <ProductInfoDialogContainer productId={row.original._id!} />
              </Dialog>
            </Box>
          );
        },
      },
      {
        accessorKey: "barcode",
        header: lang["barcode"],
        enableEditing: true,
        size: 100,
        muiEditTextFieldProps: ({ cell }) => {
          return {
            type: "text",
            error: !!props.validationErrors?.barcode,
            helperText: props.validationErrors?.barcode,
            onFocus: () => {
              props.setValidationErrors({
                ...props.validationErrors,
                barcode: undefined,
              });
            },
          };
        },
        Cell: (props) => (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <BarcodeModal product={props?.row.original} />
            <Typography sx={{ mr: 1 }}>
              {props?.row.original.barcode}
            </Typography>
          </Box>
        ),
      },
      {
        accessorKey: "qrCodes",
        accessorFn: (row) => (row?.qrCodes || []).join(","),
        header: "Modellar",
        Cell: ({ row }) => (
          <Box
            sx={{
              width: "100px",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.5rem",
            }}
          >
            {row.original.qrCodes?.map((qr: string) => (
              <Chip key={qr} label={qr} />
            ))}
          </Box>
        ),
        Edit: QrCodeEdit,
      },
      {
        accessorKey: "count",
        accessorFn: (row) => row.count || 0,
        header: lang["count"],
        enableEditing: false,
        size: 50,
        muiEditTextFieldProps: () => {
          return {
            type: "text",
          };
        },
        Cell: ({ cell }) => (
          <>
            {cell.getValue<number>().toLocaleString() +
              " " +
              langFormat({ uz: "dona", ru: "единиц", en: "unit" })}
          </>
        ),
        Footer: (props) => (
          <>
            {multiDigitNumberFormat(
              props.table
                .getFilteredRowModel()
                .rows.reduce((sum, row) => sum + (row.original.count || 0), 0)
            )}
          </>
        ),
        Filter: () => null,
        Edit: () => null,
      },
      {
        accessorKey: "minimumCount",
        accessorFn: (row) => row.minimumCount || "kiritilmagan",
        header: "Minimum soni",
        filterFn: (row, _, filterValue) => {
          if (filterValue === "Kamlar") {
            // Filter data where minimumCount > count
            return row.original.minimumCount !== undefined &&
              row.original.count !== undefined
              ? row.original.minimumCount > row.original.count
              : false;
          } else if (filterValue === "Kiritilmagan") {
            // Filter data where minimumCount is 0 or undefined
            return (
              row.original.minimumCount === 0 ||
              row.original.minimumCount === undefined ||
              row.original.minimumCount === null
            );
          } else {
            // Clear filter when no option is selected
            return true;
          }
        },
        Filter: ({ column }) => {
          return (
            <Autocomplete
              size="small"
              options={["Kiritilmagan", "Kamlar"]}
              getOptionLabel={(option) => option}
              onChange={(_, value) => {
                column.setFilterValue(value);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder={"Minimum soni filterlash"}
                  size="small"
                  variant="standard"
                  autoFocus
                />
              )}
            />
          );
        },
      },
      {
        accessorKey: "cost",
        header: lang["cost"],

        accessorFn: (row) =>
          multiDigitNumberFormat(row?.cost || 0) + " " + lang["som"],
        enableEditing: false,
        size: 100,
        muiEditTextFieldProps: () => {
          return {
            type: "text",
          };
        },
        Footer: (props) => (
          <>
            {multiDigitNumberFormat(
              props.table
                .getFilteredRowModel()
                .rows.reduce(
                  (sum, row) =>
                    sum + (row.original.cost * row.original.count || 0),
                  0
                )
            ) +
              " " +
              lang["som"]}
          </>
        ),
        Filter: () => null,
        Edit: () => null,
      },
      {
        accessorKey: "price",
        header: lang["price"],
        size: 100,
        muiEditTextFieldProps: () => {
          return {
            type: "text",
          };
        },
        Cell: ({ row }) => (
          <>
            {multiDigitNumberFormat(row?.original.price || 0) +
              " " +
              lang["som"]}
          </>
        ),
        Footer: (props) => (
          <>
            {multiDigitNumberFormat(
              props.table
                .getFilteredRowModel()
                .rows.reduce(
                  (sum, row) =>
                    sum + (row.original.price * row.original.count || 0),
                  0
                )
            ) +
              " " +
              lang["som"]}
          </>
        ),
        Filter: () => null,
      },
    ],
    [props]
  );

const lang = {
  name: langFormat({ uz: "Nomi", ru: "Название", en: "Name" }),
  barcode: langFormat({ uz: "Barkod", ru: "Штрих-код", en: "Barcode" }),
  count: langFormat({ uz: "Masulot soni", ru: "Количество", en: "Count" }),
  cost: langFormat({
    uz: "Kelish narxi",
    ru: "Стоимость прихода",
    en: "Comming cost",
  }),
  price: langFormat({
    uz: "Sotilish narxi",
    ru: "Стоимость продажи",
    en: "Selling cost",
  }),
  som: langFormat({ uz: "so'm", ru: "сум", en: "sum" }),
  quantityPerBox: langFormat({
    en: "Quantity per box",
    ru: "Количество в коробке",
    uz: "1 quti hajmi",
  }),
  qrCodes: langFormat({ en: "QR codes", ru: "QR-коды", uz: "QR-kodlar" }),
};
