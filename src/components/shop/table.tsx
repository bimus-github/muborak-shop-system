"use client";
import {
  useCreateProductToShop,
  useDeleteProductFromShop,
  useGetShopById,
  useUpdateProductOfShop,
} from "@/hooks/shop";
import { LangFormat, Product } from "@/models/types";
import { langFormat } from "@/utils/langFormat";
import { Add, ArrowBack, ArrowRight, Delete, Edit } from "@mui/icons-material";
import { Box, Button, IconButton, Tooltip } from "@mui/material";
import {
  MRT_ActionMenuItem,
  MRT_ColumnDef,
  MRT_TableOptions,
  useMaterialReactTable,
} from "material-react-table";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { validateShopProduct } from "./validateShopProduct";
import { Dispatch } from "react";

interface Props {
  columns: MRT_ColumnDef<Product>[];
  setValidationErrors: (value: Record<string, string | undefined>) => void;
  selectedProduct: Product | null;
  setSelectedProduct: Dispatch<Product | null>;
}

export const useReactTable = (props: Props) => {
  const { id } = useParams();
  const router = useRouter();
  const { columns, setValidationErrors, selectedProduct, setSelectedProduct } = props;
  const { data, isFetching } = useGetShopById({ shopId: id as string });
  const { isPending: isCreating, mutateAsync: create } = useCreateProductToShop();
  const { isPending: isDeleting, mutateAsync: deleteProduct } = useDeleteProductFromShop();
  const { isPending: isUpdating, mutateAsync: update } = useUpdateProductOfShop();

  const handelCreateNewProduct: MRT_TableOptions<Product>["onCreatingRowSave"] =
    async (props) => {
      const newValidationErrors = validateShopProduct({
        ...props.values,
        name: "text",
        barcode: "text",
      });
      if (Object.values(newValidationErrors).some((error) => error)) {
        setValidationErrors(newValidationErrors);
        return;
      }

      if (!selectedProduct) {
        return setValidationErrors({
          name: langFormat({
            uz: "Mahsulotni tanlang",
            ru: "Выберите продукт",
            en: "Select product",
          }),
        });
      }
      setValidationErrors({});

      if (
        data?.shop?.products.find(
          (product: Product) => product._id === selectedProduct._id
        )
      ) {
        return toast.error(
          langFormat({
            uz: "Bu mahsulot allaqachon qo'shilgan",
            ru: "Этот продукт уже добавлен",
            en: "This product has already been added",
          })
        );
      }

      const product: Product = {
        ...selectedProduct,
        cost: props.values.cost,
        price: props.values.price,
        count: props.values.count,
      };

      const res = await create({ shopId: id as string, product });

      if (res.success) {
        toast.success(langFormat(res.message as LangFormat));
        setSelectedProduct(null);
        props.exitCreatingMode();
        setTimeout(() => props.table.setCreatingRow(true), 50);
      } else {
        toast.error(langFormat(res.message as LangFormat));
      }
    };

  const handleEditProduct: MRT_TableOptions<Product>["onEditingRowSave"] =
    async (props) => {
      const newValidationErrors = validateShopProduct({
        ...props.values,
        name: "text",
        barcode: "text",
      });
      if (Object.values(newValidationErrors).some((error) => error)) {
        setValidationErrors(newValidationErrors);
        return;
      }

      if (!selectedProduct) {
        return setValidationErrors({
          name: langFormat({
            uz: "Mahsulotni tanlang",
            ru: "Выберите продукт",
            en: "Select product",
          }),
        });
      }
      setValidationErrors({});

      const product: Product = {
        ...selectedProduct,
        cost: props.values.cost,
        price: props.values.price,
        count: props.values.count,
      };

      const res = await update({ shopId: id as string, product, index: props.row.index });

      if (res.success) {
        toast.success(langFormat(res.message as LangFormat));
        setSelectedProduct(null);
        props.exitEditingMode();
      } else {
        toast.error(langFormat(res.message as LangFormat));
      }
    };

  return useMaterialReactTable<Product>({
    data: data?.shop?.products || [],
    columns,
    enableDensityToggle: false,
    enableGlobalFilter: false,
    enablePagination: false,
    enableBottomToolbar: false,
    enableFullScreenToggle: false,
    enableHiding: false,
    enableColumnActions: false,
    enableColumnFilters: true,
    enableRowActions: true,
    enableRowNumbers: true,
    editDisplayMode: "modal",
    createDisplayMode: "modal",
    positionActionsColumn: "last",
    onCreatingRowSave: handelCreateNewProduct,
    onEditingRowSave: handleEditProduct,
    filterFns: {
      startsWithNoSpace: (row, columnId, value) => {
        return row
          .getValue<string>(columnId)
          .replaceAll(" ", "")
          .toLocaleLowerCase()
          .startsWith(value.replaceAll(" ", "").toLocaleLowerCase());
      },
    },

    renderRowActionMenuItems: ({ row, table }) => [
      <MRT_ActionMenuItem
        icon={<Edit />}
        label={langFormat({
          uz: "Tahrirlash",
          ru: "Редактировать",
          en: "Edit",
        })}
        table={table}
        key="edit"
        onClick={() => {
          table.setEditingRow(row);
          setSelectedProduct(row.original);
        }}
      ></MRT_ActionMenuItem>,
      <MRT_ActionMenuItem
        icon={<Delete />}
        label={langFormat({
          uz: "O'chirish",
          ru: "Удалить",
          en: "Delete",
        })}
        table={table}
        key="delete"
        onClick={() => {
          toast((t) => (
            <Box>
              <div>
                {langFormat({
                  uz: "O`chirishni istaysizmi?",
                  ru: "Удалить?",
                  en: "Delete?",
                })}
              </div>
              <br />
              <Button color="inherit" onClick={() => toast.dismiss(t.id)}>
                {langFormat({ uz: "Bekor qilish", ru: "Отмена", en: "Cancel" })}
              </Button>
              <span>&nbsp;&nbsp;</span>
              <Button
                color="error"
                onClick={async () => {
                  toast.dismiss(t.id);
                  const res = await deleteProduct({ product: row.original, shopId: id as string, });
                  res.success ? toast.success(langFormat(res.message as LangFormat)) : toast.error(langFormat((res.message) as LangFormat))
                }}
              >
                {langFormat({ uz: "O`chirish", ru: "Удалить", en: "Delete" })}
              </Button>
            </Box>
          ));
        }}
      ></MRT_ActionMenuItem>,
    ],
    renderTopToolbar: ({ table }) => [
      <Box key={''}>
        <Tooltip
          title={langFormat({ uz: "Ortga", ru: "", en: "Back" })}
          key="back"
        >
          <IconButton onClick={() => router.back()}>
            <ArrowBack />
          </IconButton>
        </Tooltip>
        <Tooltip
          title={langFormat({ uz: "Qo'shish", ru: "Добавить", en: "Add" })}
          key="add"
        >
          <IconButton onClick={() => table.setCreatingRow(true)}>
            <Add />
          </IconButton>
        </Tooltip>
      </Box>,
    ],
    muiFilterTextFieldProps: {
      ...props,
      placeholder: langFormat({ uz: "Qidirish", ru: "Поиск", en: "Search" }),
    },

    displayColumnDefOptions: {
      "mrt-row-actions": {
        header: langFormat({ uz: "Amallar", ru: "Действия", en: "Actions" }),
        size: 100,
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
      },
    },
    state: {
      isSaving: isCreating || isUpdating || isDeleting || isFetching,
      showColumnFilters: true,
      density: "compact",
    },
  });
};
