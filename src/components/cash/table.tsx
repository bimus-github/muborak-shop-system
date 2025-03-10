"use client";

import {
  useCreateCash,
  useDeleteCash,
  useGetCashs,
  useUpdateCash,
} from "@/hooks/cash";
import { Cash, LangFormat } from "@/models/types";
import { langFormat } from "@/utils/langFormat";
import { Add, Delete, Edit } from "@mui/icons-material";
import { Box, Button, IconButton, Tooltip, colors } from "@mui/material";
import {
  MRT_Cell,
  MRT_ColumnDef,
  MRT_Row,
  MRT_TableInstance,
  MRT_TableOptions,
  useMaterialReactTable,
} from "material-react-table";
import { validateCash } from "./validateCash";
import toast from "react-hot-toast";

interface Props {
  columns: MRT_ColumnDef<Cash>[];
  setValidationErrors: (value: Record<string, string | undefined>) => void;
}

interface RowActionsProps {
  cell: MRT_Cell<Cash, unknown>;
  row: MRT_Row<Cash>;
  table: MRT_TableInstance<Cash>;
}

interface TopToolbarProps {
  table: MRT_TableInstance<Cash>;
}

const RowActions = ({ row, table }: RowActionsProps) => {
  const { mutateAsync: deleteCash } = useDeleteCash();

  const handleDelete = async (id: string) => {
    toast((t) => (
      <Box
        sx={{
          display: "flex",
          gap: "1rem",
          justifyContent: "center",
        }}
      >
        <Button
          color="error"
          onClick={async () => {
            const res = await deleteCash(id);

            if (res.success) {
              toast.dismiss(t.id);
              toast.success(langFormat(res.message as LangFormat));
            } else {
              toast.error(langFormat(res.message as LangFormat));
            }
          }}
        >
          {lang["delete"]}
        </Button>
        <Button color="inherit" onClick={() => toast.dismiss(t.id)}>
          {lang["cancel"]}
        </Button>
      </Box>
    ));
  };
  return (
    <Box sx={{ display: "flex", gap: "1rem" }}>
      <Tooltip arrow placement="left" title={lang["edit"]}>
        <IconButton
          onClick={() => {
            table.setEditingRow(row);
          }}
        >
          <Edit sx={{ color: colors.blue[500] }} />
        </IconButton>
      </Tooltip>
      <Tooltip arrow placement="right" title={lang["delete"]}>
        <IconButton
          onClick={() => {
            const { original } = row;
            const id = original._id;
            id && handleDelete(id);
          }}
        >
          <Delete sx={{ color: colors.red[500] }} />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

const TopToolbarCustomActions = ({ table }: TopToolbarProps) => {
  return (
    <Box sx={{ display: "flex", gap: "1rem" }}>
      <Tooltip arrow placement="left" title={lang["create"]}>
        <IconButton
          onClick={() => {
            table.setCreatingRow(true);
          }}
        >
          <Add sx={{ color: colors.blue[500] }} />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export const useTable = (props: Props) => {
  const { columns, setValidationErrors } = props;

  const { data: cashData, isFetching: isFetchingCash } = useGetCashs();
  const { isPending: isCreateCashPending, mutateAsync: createCash } =
    useCreateCash();
  const { isPending: isUpdateCashPending, mutateAsync: updateCash } =
    useUpdateCash();

  const handleCreateCash: MRT_TableOptions<Cash>["onCreatingRowSave"] = async ({
    values,
    table,
  }) => {
    const valdiations = validateCash(values);
    if (Object.values(valdiations).some((error) => error)) {
      props.setValidationErrors(valdiations);
      return;
    }
    setValidationErrors({});

    const newCash: Cash = {
      date: new Date(),
      value: values.value,
      reason: values.reason,
      extraInfo: values.extraInfo,
      userId: "",
    };

    const res = await createCash(newCash);

    if (res.success) {
      const message = res.message as LangFormat;
      toast.success(langFormat(message));
      table.setCreatingRow(null);

      setTimeout(() => table.setCreatingRow(true), 50);
    } else {
      toast.error(langFormat(res.message as LangFormat));
    }
  };

  const handleUpdateCash: MRT_TableOptions<Cash>["onEditingRowSave"] = async ({
    values,
    row,
    table,
  }) => {
    const newValidationErrors = validateCash(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});

    const updatedCash: Cash = {
      _id: row.original._id,
      date: row.original.date,
      value: values.value,
      reason: values.reason,
      extraInfo: values.extraInfo,
      userId: row.original.userId,
    };

    const res = await updateCash(updatedCash);

    if (res.success) {
      const message = res.message as LangFormat;
      toast.success(langFormat(message));
      table.setEditingRow(null);
    } else {
      toast.error(langFormat(res.message as LangFormat));
    }
  };

  return useMaterialReactTable({
    columns: columns,
    data: cashData?.data || [],
    enableColumnActions: false,
    enablePagination: false,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableHiding: false,
    enableColumnFilters: true,
    enableRowActions: true,
    enableRowNumbers: true,
    positionActionsColumn: "last",
    onCreatingRowSave: handleCreateCash,
    onEditingRowSave: handleUpdateCash,
    renderRowActions: (props) => <RowActions {...props} />,
    renderTopToolbarCustomActions: (props) => (
      <TopToolbarCustomActions {...props} />
    ),
    initialState: {
      sorting: [
        {
          id: "date",
          desc: true,
        },
      ],
    },
    state: {
      isLoading: isFetchingCash,
      isSaving: isCreateCashPending || isUpdateCashPending,
    },
  });
};

const lang = {
  create: langFormat({ uz: "Qo'shish", ru: "Создать", en: "Create" }),
  edit: langFormat({ uz: "Tahrirlash", ru: "Редактировать", en: "Edit" }),
  delete: langFormat({ uz: "O`chirish", ru: "Удалить", en: "Delete" }),
  cancel: langFormat({ uz: "Bekor qilish", ru: "Отмена", en: "Cancel" }),
};
