"use client";
import {
  useCreateBuyer,
  useDeleteBuyer,
  useGetBuyers,
  useUpdateBuyer,
} from "@/hooks/buyer";
import { Buyer, LangFormat } from "@/models/types";
import { langFormat } from "@/utils/langFormat";
import { Add, Delete, Edit } from "@mui/icons-material";
import { Box, Button, IconButton, Tooltip } from "@mui/material";
import {
  MRT_Cell,
  MRT_ColumnDef,
  MRT_Row,
  MRT_TableInstance,
  MRT_TableOptions,
  useMaterialReactTable,
} from "material-react-table";
import { useCallback } from "react";
import toast from "react-hot-toast";
import { validateBuyer } from "./buyerValidation";

interface RecatTableProps {
  columns: MRT_ColumnDef<Buyer>[];
  setValidationErrors: (value: Record<string, string | undefined>) => void;
}

interface RowActionsProps {
  cell: MRT_Cell<Buyer, unknown>;
  row: MRT_Row<Buyer>;
  table: MRT_TableInstance<Buyer>;
}

const RowActions = ({ row, table }: RowActionsProps) => {
  const { mutateAsync: deleteBuyer } = useDeleteBuyer();

  const handleDeleteBuyer = useCallback(async () => {
    toast((t) => (
      <Box>
        <div>{lang["confirm?"]}</div>
        <br />
        <Button color="inherit" onClick={() => toast.dismiss(t.id)}>
          {lang["cancel"]}
        </Button>
        <Button
          color="error"
          sx={{ ml: "1rem" }}
          onClick={async () => {
            toast.dismiss(t.id);
            await toast.promise(deleteBuyer(row.original?._id!), {
              loading: lang["deleting"],
              success: lang["deleted"],
              error: lang["error"],
            });
          }}
        >
          {lang["delete"]}
        </Button>
      </Box>
    ));
  }, [deleteBuyer, row.original?._id]);

  return (
    <Box
      sx={{
        display: "flex",
        gap: "5px",
      }}
    >
      <Tooltip arrow placement="left" title={lang["edit"]}>
        <IconButton onClick={() => table.setEditingRow(row)}>
          <Edit sx={{ color: "primary.main" }} />
        </IconButton>
      </Tooltip>
      <Tooltip arrow placement="right" title={lang["delete"]}>
        <IconButton onClick={handleDeleteBuyer}>
          <Delete sx={{ color: "error.main" }} />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export const useReactTable = (props: RecatTableProps) => {
  const { columns, setValidationErrors } = props;

  const { isPending: isCreateBuyerPending, mutateAsync: createBuyer } =
    useCreateBuyer();
  const { isFetching: isGetBuyersFetching, data: buyersData } = useGetBuyers();
  const { isPending: isUpdateBuyerPending, mutateAsync: updateBuyer } =
    useUpdateBuyer();

  const handleCreateBuyer: MRT_TableOptions<Buyer>["onCreatingRowSave"] =
    async ({ values, table }) => {
      const newValidationErrors = validateBuyer(values);
      if (Object.values(newValidationErrors).some((error) => error)) {
        setValidationErrors(newValidationErrors);
        return;
      }
      setValidationErrors({});

      const newBuyer: Buyer = {
        name: values.name,
        info: values.info,
        messageId: values.messageId,
        userId: "",
      };

      const res = await createBuyer(newBuyer);

      if (res.success) {
        const message = res.message as LangFormat;
        toast.success(langFormat(message));
        table.setCreatingRow(null);
        setTimeout(() => table.setCreatingRow(true), 50);
      } else {
        toast.error(langFormat(res.message as LangFormat));
      }
    };

  const handleUpdateBuyer: MRT_TableOptions<Buyer>["onEditingRowSave"] =
    async ({ values, table, row }) => {
      const newValidationErrors = validateBuyer(values);
      if (Object.values(newValidationErrors).some((error) => error)) {
        setValidationErrors(newValidationErrors);
        return;
      }
      setValidationErrors({});

      const updatedBuyer: Buyer = {
        _id: row.original._id,
        name: values.name,
        info: values.info,
        userId: row.original.userId,
        messageId: values.messageId,
      };

      const res = await updateBuyer(updatedBuyer);

      if (res.success) {
        const message = res.message as LangFormat;
        toast.success(langFormat(message));
        table.setEditingRow(null);
      } else {
        toast.error(langFormat(res.message as LangFormat));
      }
    };

  return useMaterialReactTable({
    columns,
    data: buyersData?.buyers || [],
    enableRowNumbers: true,
    enableEditing: true,
    enableRowActions: true,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableColumnActions: false,
    enablePagination: false,
    enableBottomToolbar: false,
    positionActionsColumn: "last",
    editDisplayMode: "modal",
    createDisplayMode: "modal",
    onCreatingRowSave: handleCreateBuyer,
    onEditingRowSave: handleUpdateBuyer,
    renderRowActions: (props) => <RowActions {...props} />,
    renderTopToolbarCustomActions: ({ table }) => [
      <Tooltip title={lang["add"]} key="add">
        <IconButton onClick={() => table.setCreatingRow(true)}>
          <Add />
        </IconButton>
      </Tooltip>,
    ],
    initialState: {
      sorting: [
        {
          id: "loan",
          desc: true,
        },
      ],
    },
    state: {
      isSaving:
        isCreateBuyerPending || isGetBuyersFetching || isUpdateBuyerPending,
    },
  });
};

const lang = {
  add: langFormat({ uz: "Qo'shish", ru: "Добавить", en: "Add" }),
  edit: langFormat({ uz: "Tahrirlash", ru: "Редактировать", en: "Edit" }),
  delete: langFormat({ uz: "O'chirish", ru: "Удалить", en: "Delete" }),
  deleting: langFormat({ uz: "O'chirilmoqda", ru: "Удаление", en: "Deleting" }),
  deleted: langFormat({ uz: "O'chirildi", ru: "Удалено", en: "Deleted" }),
  error: langFormat({ uz: "Xatolik", ru: "Ошибка", en: "Error" }),
  "confirm?": langFormat({
    uz: "Tasdiqlaysizmi?",
    ru: "Подтвердить?",
    en: "Confirm?",
  }),
  cancel: langFormat({ uz: "Bekor qilish", ru: "Отмена", en: "Cancel" }),
};
