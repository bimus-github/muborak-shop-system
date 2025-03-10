"use client";
import { useCreateShop, useGetShops, useUpdateShop } from "@/hooks/shop";
import { LangFormat, Shop } from "@/models/types";
import { langFormat } from "@/utils/langFormat";
import { Add, Edit } from "@mui/icons-material";
import {
  Box,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Tooltip,
} from "@mui/material";
import {
  MRT_ActionMenuItem,
  MRT_ColumnDef,
  MRT_TableOptions,
  useMaterialReactTable,
} from "material-react-table";
import toast from "react-hot-toast";
import { validateShop } from "./validateShop";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import fuzzy from "fuzzy";

interface Props {
  columns: MRT_ColumnDef<Shop>[];
  setValidationErrors: (value: Record<string, string | undefined>) => void;
}

export const useReactTable = (props: Props) => {
  const [delta, setDelta] = useState(7);
  const router = useRouter();
  const { columns, setValidationErrors } = props;
  const {
    data,
    isFetching,
    refetch: refetchShops,
    productName,
    setProductName,
  } = useGetShops(dayjs(new Date()).subtract(delta, "day").toDate());
  const { mutateAsync, isPending: isCreating } = useCreateShop();
  const { isPending: isUpdating, mutateAsync: update } = useUpdateShop();

  const handelCreateNewShop: MRT_TableOptions<Shop>["onCreatingRowSave"] =
    async (props) => {
      // console.log(props.values);

      const newValidationErrors = validateShop(props.values);
      if (Object.values(newValidationErrors).some((error) => error)) {
        setValidationErrors(newValidationErrors);
        return;
      }
      setValidationErrors({});
      const newShop: Shop = {
        name: props.values.name,
        date: new Date(),
        loan_price: +props.values.loan_price,
        phone: props.values.phone,
        products: [],
        userId: "",
      };

      const res = await mutateAsync(newShop);
      // console.log(res.message);
      const message = res.message as LangFormat;
      if (res.success) {
        toast.success(langFormat(message));
        props.exitCreatingMode();
        setTimeout(() => props.table.setCreatingRow(null), 50);
      } else {
        toast.error(langFormat(message));
      }
    };

  const handleEditShop: MRT_TableOptions<Shop>["onEditingRowSave"] = async (
    props
  ) => {
    const newValidationErrors = validateShop(props.values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    const updatedShop: Shop = {
      ...props.row.original,
      name: props.values.name,
      date: props.row.original.date,
      loan_price: +props.values.loan_price,
      phone: props.values.phone,
    };

    const res = await update({ shop: updatedShop, index: props.row.index });

    // console.log(res);
    const message = res.message as LangFormat;
    if (res.success) {
      toast.success(langFormat(message));
      props.exitEditingMode();
      setTimeout(() => props.table.setEditingRow(null), 50);
    } else {
      toast.error(langFormat(message));
    }
  };

  useEffect(() => {
    refetchShops();
  }, [refetchShops, delta]);

  return useMaterialReactTable<Shop>({
    data: productName
      ? (data?.shops || []).filter(
          (shop) =>
            fuzzy.filter(productName, shop.products, {
              extract: (el) => el.name,
            }).length > 0
        )
      : data?.shops || [],
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
    onCreatingRowSave: handelCreateNewShop,
    onEditingRowSave: handleEditShop,
    filterFns: {
      startsWithNoSpace: (row, columnId, value) => {
        return row
          .getValue<string>(columnId)
          .replaceAll(" ", "")
          .toLocaleLowerCase()
          .startsWith(value.replaceAll(" ", "").toLocaleLowerCase());
      },
    },
    muiTableBodyCellProps: ({ row, cell }) => ({
      sx: {
        "&:hover": {
          color: cell.column.id === "name" ? "blue" : "",
          cursor: cell.column.id === "name" ? "pointer" : "",
        },
      },
      onClick: () => {
        if (cell.column.id === "name") {
          const shopId = row.original._id;

          router.push(`/main/shop/${shopId}`);
        }
      },
    }),
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
        onClick={() => table.setEditingRow(row)}
      ></MRT_ActionMenuItem>,
    ],
    renderTopToolbarCustomActions: ({ table }) => (
      <Box sx={{ display: "flex", gap: "0.5rem" }}>
        <Tooltip
          title={langFormat({ uz: "Qo'shish", ru: "Добавить", en: "Add" })}
          key="add"
        >
          <IconButton onClick={() => table.setCreatingRow(true)}>
            <Add />
          </IconButton>
        </Tooltip>
        <Select
          key={"delta"}
          size="small"
          sx={{ width: "200px" }}
          value={delta}
          onChange={(e) => setDelta(+e.target.value)}
        >
          <MenuItem value={1}>1 kunlik</MenuItem>
          <MenuItem value={7}>7 kunlik</MenuItem>
          <MenuItem value={30}>1 oylik</MenuItem>
          <MenuItem value={90}>3 oylik</MenuItem>
          <MenuItem value={365}>1 yillik</MenuItem>
          <MenuItem value={365 * 3}>3 yillik</MenuItem>
          <MenuItem value={365 * 6}>6 yillik</MenuItem>
          <MenuItem value={365 * 10}>10 yillik</MenuItem>
        </Select>
        <TextField
          size="small"
          sx={{ width: "400px" }}
          placeholder="Mahsulotni nomini kiriting"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
      </Box>
    ),
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
    state: {
      isSaving: isCreating || isUpdating || isFetching,
      showColumnFilters: true,
      density: "compact",
    },
  });
};
