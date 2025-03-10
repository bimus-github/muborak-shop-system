"use client";

import { useGetProducts } from "@/hooks/product";
import { Product } from "@/models/types";
import { langFormat } from "@/utils/langFormat";
import { multiDigitNumberFormat } from "@/utils/multiDigitNumberFormat";
import { Autocomplete, Box, TextField, Typography } from "@mui/material";
import {
  MRT_Cell,
  MRT_Column,
  MRT_ColumnDef,
  MRT_Row,
  MRT_TableInstance,
} from "material-react-table";
import { Dispatch, useMemo } from "react";
import BarcodeModal from "../barcode-modal";
import AddProductModal from "./AddProductModal";
import fuzzy from "fuzzy";
interface Props {
  validationErrors?: Record<string, string | undefined>;
  setValidationErrors: Dispatch<Record<string, string | undefined>>;
  selectedProduct: Product | null;
  setSelectedProduct: Dispatch<Product | null>;
}
interface EditProps {
  cell: MRT_Cell<Product, unknown>;
  column: MRT_Column<Product, unknown>;
  row: MRT_Row<Product>;
  table: MRT_TableInstance<Product>;
}

export const useReactColumns = (props: Props) => {
  const {
    validationErrors,
    setValidationErrors,
    selectedProduct,
    setSelectedProduct,
  } = props;
  const { data: productsData } = useGetProducts();
  return useMemo<MRT_ColumnDef<Product>[]>(
    () => [
      {
        accessorKey: "name",
        header: langFormat({ uz: "Nomi", ru: "Название", en: "Name" }),
        enableEditing: true,
        size: 100,
        Edit(props) {
          return (
            <Autocomplete
              options={productsData?.products || []}
              filterOptions={(options, { inputValue }) => {
                return fuzzy
                  .filter(inputValue, options, {
                    extract: (el) => el.name + " " + el.barcode,
                  })
                  .map((el) => el.original);
              }}
              getOptionLabel={(product: Product) =>
                `${
                  product.name && product.barcode
                    ? `${product.name} (${product.barcode})`
                    : ""
                }`
              }
              value={selectedProduct}
              onChange={(_, value) => setSelectedProduct(value)}
              renderInput={(props) => (
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <TextField
                    autoFocus={true}
                    label={langFormat({
                      uz: "Mahsulot nomi yoki kodi",
                      ru: "Название продукта или штрих-код",
                      en: "Product name or barcode",
                    })}
                    variant="standard"
                    error={
                      !!validationErrors?.name || !!validationErrors?.barcode
                    }
                    helperText={
                      validationErrors?.name || validationErrors?.barcode
                    }
                    onFocus={() => {
                      setValidationErrors({
                        ...validationErrors,
                        name: undefined,
                        barcode: undefined,
                      });
                    }}
                    {...props}
                  />
                  <AddProductModal></AddProductModal>
                </Box>
              )}
              {...props.column.columnDef.meta}
            />
          );
        },
      },
      {
        accessorKey: "barcode",
        header: langFormat({ uz: "Bar kod", ru: "Bаркод", en: "Barcode" }),
        Edit: () => null,
        Filter: () => null,
        size: 70,
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
        accessorKey: "count",
        header: langFormat({ uz: "Soni", ru: "Количество", en: "Count" }),
        enableEditing: true,
        size: 100,
        muiEditTextFieldProps: () => {
          return {
            type: "number",
            error: !!validationErrors?.count,
            helperText:
              validationErrors?.count ||
              `${selectedProduct?.count?.toLocaleString()} ${langFormat({
                uz: "dona",
                ru: "единиц",
                en: "unit",
              })}`,
            onFocus: () =>
              setValidationErrors({ ...validationErrors, count: undefined }),
          };
        },
        Filter: () => null,
        Cell: ({ row }) => (
          <>{`${row.original.count || 0} ${langFormat({
            uz: "dona",
            ru: "единиц",
            en: "unit",
          })}`}</>
        ),
      },
      {
        header: langFormat({
          uz: "Qutilar soni",
          ru: "Количество коробок",
          en: "Quantity per box",
        }),
        accessorFn: (row) =>
          row.count / (row.quantityPerBox || 1) +
          " " +
          langFormat({ uz: "quti", ru: "коробка", en: "box" }),
        Filter: () => null,
        Edit: () => null,
      },
      {
        accessorKey: "cost",
        header: langFormat({
          uz: "Tovar narxi",
          ru: "Цена продукта",
          en: "Cost",
        }),
        enableEditing: true,
        size: 100,
        muiEditTextFieldProps: () => {
          return {
            type: "number",
            error: !!validationErrors?.cost,
            helperText:
              validationErrors?.cost ||
              multiDigitNumberFormat(selectedProduct?.cost || 0) +
                " " +
                langFormat({ uz: "so'm", ru: "сом", en: "som" }),
            defaultValue: selectedProduct?.cost || 0,
            onFocus: () => {
              setValidationErrors({
                ...validationErrors,
                cost: undefined,
              });
            },
          };
        },
        Filter: () => null,
        Cell: ({ cell }) => (
          <>
            {multiDigitNumberFormat(cell.getValue<number>() || 0) +
              " " +
              langFormat({ uz: "so'm", ru: "сом", en: "som" })}
          </>
        ),
      },
      {
        accessorKey: "price",
        header: langFormat({
          uz: "Sotilish Narxi",
          ru: "Цена продажи",
          en: "Price",
        }),
        enableEditing: true,
        size: 100,
        muiEditTextFieldProps: () => {
          return {
            type: "number",
            error: !!validationErrors?.price,
            helperText:
              validationErrors?.price ||
              multiDigitNumberFormat(selectedProduct?.price || 0) +
                " " +
                langFormat({ uz: "so'm", ru: "сом", en: "som" }),
            onFocus: () => {
              setValidationErrors({ ...validationErrors, price: undefined });
            },
          };
        },
        Filter: () => null,
        Cell: ({ cell }) => (
          <>
            {" "}
            {multiDigitNumberFormat(cell.getValue<number>()) +
              " " +
              langFormat({ uz: "so'm", ru: "сом", en: "som" })}{" "}
          </>
        ),
      },
    ],
    [
      productsData?.products,
      selectedProduct,
      setSelectedProduct,
      validationErrors,
      setValidationErrors,
    ]
  );
};
