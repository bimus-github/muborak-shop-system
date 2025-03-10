import {
  useCreateProduct,
  useDeleteProduct,
  useGetProducts,
  useUpdateProduct,
} from "@/hooks/product";
import { LangFormat, Product } from "@/models/types";
import { langFormat } from "@/utils/langFormat";
import { Add, Delete, Edit } from "@mui/icons-material";
import { Box, Button, IconButton, Tooltip } from "@mui/material";
import {
  MRT_ActionMenuItem,
  MRT_ColumnDef,
  MRT_TableOptions,
  useMaterialReactTable,
} from "material-react-table";
import { validateProduct } from "./validateProduct";
import toast from "react-hot-toast";
import { createProducts } from "@/actions/product";

interface Props {
  columns: MRT_ColumnDef<Product>[];
  setValidationErrors: (value: Record<string, string | undefined>) => void;
}

export const useReactTable = (props: Props) => {
  const { columns, setValidationErrors } = props;
  const { data, isFetching } = useGetProducts();
  const { mutateAsync, isPending: isCreating } = useCreateProduct();
  const { isPending: isUpdating, mutateAsync: update } = useUpdateProduct();
  const { isPending: isDeleting, mutateAsync: deleteProduct } =
    useDeleteProduct();

  const handelCreateNewProduct: MRT_TableOptions<Product>["onCreatingRowSave"] =
    async (props) => {
      const newValidationErrors = validateProduct(props.values);
      if (Object.values(newValidationErrors).some((error) => error)) {
        setValidationErrors(newValidationErrors);
        return;
      }
      setValidationErrors({});
      const qrCodes = ((props.values.qrCodes || "").split(",") || []).filter(
        (qr: string) => qr !== ""
      );
      const newProduct: Product = {
        name: props.values.name,
        barcode: props.values.barcode,
        price: +props.values.price,
        cost: +props.values.cost,
        count: +props.values.count,
        userId: "",
        qrCodes: qrCodes,
        quantityPerBox: 1,
        minimumCount: +props.values.minimumCount,
      };

      const res = await mutateAsync(newProduct);
      // console.log(res);
      const message = res.data.message as LangFormat;
      if (res.data.success) {
        toast.success(langFormat(message));
        props.table.setCreatingRow(null);
        setTimeout(() => props.table.setCreatingRow(true), 50);
      } else {
        toast.error(langFormat(message));
      }
    };

  const handleEditProduct: MRT_TableOptions<Product>["onEditingRowSave"] =
    async (props) => {
      const newValidationErrors = validateProduct(props.values);
      if (Object.values(newValidationErrors).some((error) => error)) {
        setValidationErrors(newValidationErrors);
        return;
      }
      setValidationErrors({});
      const qrCodes = ((props.values.qrCodes || "").split(",") || []).filter(
        (qr: string) => qr !== ""
      );
      const updatedProduct: Product = {
        ...props.row.original,
        name: props.values.name,
        barcode: props.values.barcode,
        quantityPerBox:
          +props.values.quantityPerBox <= 0 ? 1 : +props.values.quantityPerBox,
        qrCodes,
        minimumCount: +props.values.minimumCount || 0,
        price: +props.values.price,
      };

      const res = await update(updatedProduct);

      // console.log(res);
      const message = res.data.message as LangFormat;
      if (res.data.success) {
        toast.success(langFormat(message));
        props.table.setEditingRow(null);
      } else {
        toast.error(langFormat(message));
      }
    };

  return useMaterialReactTable<Product>({
    data: data?.products || [],
    columns,
    enableDensityToggle: false,
    enableGlobalFilter: false,
    enableFullScreenToggle: false,
    enableColumnActions: false,
    enableColumnFilters: true,
    enableRowActions: true,
    enableRowNumbers: true,
    positionActionsColumn: "last",
    editDisplayMode: "modal",
    createDisplayMode: "modal",
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
        icon={<Edit style={{ color: "green" }} />}
        label={langFormat({
          uz: "Tahrirlash",
          ru: "Редактировать",
          en: "Edit",
        })}
        table={table}
        key="edit"
        onClick={() => table.setEditingRow(row)}
      ></MRT_ActionMenuItem>,
      <MRT_ActionMenuItem
        icon={<Delete style={{ color: "red" }} />}
        label={langFormat({ uz: "O'chirish", ru: "Удалить", en: "Delete" })}
        table={table}
        color="error"
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
                  const res = await deleteProduct({
                    id: row.original._id || "",
                  });
                  // console.log(res);
                  if (res.data.success) {
                    toast.success(langFormat(res.data.message as LangFormat));
                  } else {
                    toast.error(
                      langFormat(
                        (res.data.message || res.data.error) as LangFormat
                      )
                    );
                  }
                }}
              >
                {langFormat({ uz: "O`chirish", ru: "Удалить", en: "Delete" })}
              </Button>
            </Box>
          ));
        }}
      ></MRT_ActionMenuItem>,
    ],
    renderTopToolbarCustomActions: ({ table }) => [
      <Tooltip
        title={langFormat({ uz: "Qo'shish", ru: "Добавить", en: "Add" })}
        key="add"
      >
        <IconButton onClick={() => table.setCreatingRow(true)}>
          <Add />
        </IconButton>
      </Tooltip>,
    ],
    muiTableBodyCellProps: {
      align: "center",
      sx: { border: "1px solid lightgrey" },
    },
    muiFilterTextFieldProps: {
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
    initialState: {
      pagination: { pageIndex: 0, pageSize: 50 },
      sorting: [{ id: "count", desc: false }],
      columnVisibility: {
        _id: false,
        quantityOfBoxes: false,
        quantityPerBox: false,
      },
    },
    state: {
      isSaving: isCreating || isUpdating || isDeleting || isFetching,
      showColumnFilters: true,
      density: "compact",
    },
    muiPaginationProps: {
      size: "small",
      rowsPerPageOptions: [50, 100, 200],
    },
    muiTableBodyRowProps: ({ row }) => ({
      sx: {
        backgroundColor:
          row.original.minimumCount &&
          row.original.minimumCount > row.original.count
            ? "lightcoral"
            : "",
      },
    }),
  });
};
