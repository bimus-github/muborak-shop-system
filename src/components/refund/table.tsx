"use client";

import { useDeleteRefund, useGetRefunds } from "@/hooks/refund";
import { Refund } from "@/models/types";
import { langFormat } from "@/utils/langFormat";
import { Delete } from "@mui/icons-material";
import { Box, Button, IconButton, Tooltip } from "@mui/material";
import {
  MRT_Cell,
  MRT_ColumnDef,
  MRT_Row,
  MRT_TableInstance,
  useMaterialReactTable,
} from "material-react-table";
import toast from "react-hot-toast";

interface Props {
  columns: MRT_ColumnDef<Refund>[];
}

type RowActionsProps = {
  cell: MRT_Cell<Refund, unknown>;
  row: MRT_Row<Refund>;
  table: MRT_TableInstance<Refund>;
};

const RowActions = ({ row }: RowActionsProps) => {
  const { mutateAsync: deleteRefund } = useDeleteRefund();

  const handleDeleteRefund = async () => {
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
            await deleteRefund(row.original?._id || "");
            toast.dismiss(t.id);
          }}
        >
          {langFormat({ uz: "O`chirish", ru: "Удалить", en: "Delete" })}
        </Button>
        <Button color="inherit" onClick={() => toast.dismiss(t.id)}>
          {langFormat({ uz: "Bekor qilish", ru: "Отмена", en: "Cancel" })}
        </Button>
      </Box>
    ));
  };

  return (
    <Box
      sx={{
        display: "flex",
        gap: "1rem",
        justifyContent: "center",
      }}
    >
      <Tooltip
        arrow
        title={langFormat({ uz: "O`chirish", ru: "Удалить", en: "Delete" })}
      >
        <IconButton onClick={handleDeleteRefund}>
          <Delete sx={{ color: "red" }} />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export const useReactTable = ({ columns }: Props) => {
  const { data: refundsData, isFetching: isFetchingRefunds } = useGetRefunds();

  return useMaterialReactTable({
    columns,
    data: refundsData?.data || [],
    enableDensityToggle: false,
    enablePagination: false,
    enableBottomToolbar: false,
    enableFullScreenToggle: false,
    enableHiding: false,
    enableColumnActions: false,
    enableColumnFilters: true,
    enableRowActions: true,
    enableRowNumbers: true,
    positionActionsColumn: "last",
    renderRowActions: (props) => <RowActions {...props} />,
    state: {
      isLoading: isFetchingRefunds,
    },
  });
};
