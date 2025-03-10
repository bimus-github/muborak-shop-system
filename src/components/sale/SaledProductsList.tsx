"use client";
import { useGetRoom, useUpdateRoom } from "@/hooks/room";
import { Room, SALE_FORM, Saled_Product } from "@/models/types";
import { langFormat } from "@/utils/langFormat";
import { Delete } from "@mui/icons-material";
import { Box, Button, CircularProgress, IconButton, List, ListItem, ListItemIcon, ListItemText, TextField, Tooltip, Typography, colors } from "@mui/material";
import { MRT_Cell, MRT_Column, MRT_ColumnDef, MRT_Row, MRT_TableInstance, MaterialReactTable, } from "material-react-table";
import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import CustomPopover from "../popover";
import search from "search-in-js";
import { useCreateSales } from "@/hooks/sale";
import { multiDigitNumberFormat } from "@/utils/multiDigitNumberFormat";

interface CellProps {
  cell: MRT_Cell<Saled_Product, unknown>;
  column: MRT_Column<Saled_Product, unknown>;
  renderedCellValue: React.ReactNode;
  row: MRT_Row<Saled_Product>;
  table: MRT_TableInstance<Saled_Product>;
  roomData?: { room: Room };
}

const QuantityCell = (props: CellProps) => {
  const { mutateAsync: updateRoom } = useUpdateRoom();

  return (
    <TextField
      type="number"
      value={props.row.getValue<number>("quantity")}
      style={{ width: "100%" }}
      size="small"
      onChange={async (e) => {
        const newProducts = props.roomData?.room.saledProducts?.map((item) => {
          if (item._id === props.row.original._id) {
            if (+e.target.value > item.count) {
              return {
                ...item,
                quantity: Math.floor(item.count),
              };
            }
            return {
              ...item,
              quantity: Number(e.target.value || 0),
            };
          }
          return item;
        });

          const updatedRoom: Room = {
            ...props.roomData?.room!,
            saledProducts: newProducts || [],
          };

          await updateRoom(updatedRoom);
      }}
    />
  );
};

const SaledPriceCell = (props: CellProps) => {
  const { mutateAsync: updateRoom } = useUpdateRoom();

  return (
    <TextField
      type="text"
      value={props.row.getValue<number>("saledPrice")}
      style={{ width: "100%" }}
      size="small"
      helperText={props.row.original.saledPrice < props.row.original.cost ? "Zarar" : ""}
      onChange={async (e) => {
        if (typeof +e.target.value !== "number" && !e.target.value) return;
        const newProducts = props.roomData?.room.saledProducts?.map((item) => {
          if (item._id === props.row.original._id) {
            return {...item, saledPrice: Number(e.target.value || 0)};
          }
          return item;
        });

          const updatedRoom: Room = {...props.roomData?.room!, saledProducts: newProducts || []};
          await updateRoom(updatedRoom);
      }}
    />
  );
};

function SaledProductsList({ roomId }: { roomId: number }) {
  const { data: roomData, isFetching: isFetchingRoom } = useGetRoom(roomId.toString());
  const { mutateAsync: updateRoom, isPending: isUpdating } = useUpdateRoom();
  const columns = useMemo<MRT_ColumnDef<Saled_Product>[]>(
    () => [
      {
        accessorKey: "name",
        header: langFormat({ uz: "Nomi", ru: "Название", en: "Name" }),
        size: 100,
        Cell: ({row}) => <Typography>{row.original.name}</Typography>
      },
      {
        accessorKey: "quantity",
        header: langFormat({ uz: "Soni(dona)", ru: "Количество", en: "Count" }),
        size: 10,
        Cell: (props) => <QuantityCell roomData={roomData} {...props} />,
      },
      {
        accessorKey: "saledPrice",
        header: langFormat({ uz: "Narxi", ru: "Цена", en: "Price" }),
        size: 100,
        Cell: (props) => <SaledPriceCell roomData={roomData} {...props} />,
      },
      {
        accessorFn: (row) => multiDigitNumberFormat(row.quantity * row.saledPrice) + " " + langFormat({ uz: "so'm", ru: "сум", en: "so'm" }),
        header: langFormat({ uz: "Jami", ru: "Итого", en: "Total" }),
        size: 80
      }
    ],
    [roomData]
  );

  const handleDeleteProductFromRoom = async (product: Saled_Product) => {
    const newProducts = roomData?.room.saledProducts?.filter(
      (item) => item._id !== product._id
    );

    const updatedRoom: Room = { ...roomData?.room!, saledProducts: newProducts || [], };
    const res = await updateRoom(updatedRoom);

    if (res) {
      toast.success(
        langFormat({ uz: "Mahsulot o'chirildi", ru: "Продукт удален", en: "Product deleted", }) );
    } else {
      toast.error(
        langFormat({ uz: "Xatolik yuz berdi", ru: "Произошла ошибка", en: "An error occurred", }) );
    }
  };

  if (typeof window === "undefined") return null;
  return (
    <MaterialReactTable
      columns={columns}
      data={roomData?.room.saledProducts || []}
      enableDensityToggle={false}
      enableFilters={false}
      enableFullScreenToggle={false}
      enableHiding={false}
      enableStickyFooter={false}
      enableBottomToolbar={false}
      enablePagination={false}
      enableSorting={false}
      enableColumnActions={false}
      enableRowActions
      enableRowNumbers
      positionActionsColumn="last"
      state={{
        isSaving: isUpdating || isFetchingRoom,
        density: 'compact'
      }}
      muiTableContainerProps={{
        sx: {
          maxHeight: "calc(100vh - 200px)",
        },
      }}
      renderRowActions={({ row }) => (
        <Tooltip
          title={langFormat({ uz: "O'chirish", ru: "Удалить", en: "Delete" })}
          placement="left"
        >
          <IconButton
            onClick={() => handleDeleteProductFromRoom(row.original)}
          >
            <Delete sx={{ color: "red" }} />
          </IconButton>
        </Tooltip>
      )}
      renderTopToolbarCustomActions={({table}) => {
        const rows = table.getFilteredRowModel().rows;
        const total = rows.reduce((acc, p) => acc + p.original.saledPrice*(1 - (p.original.discount || 0) / 100)*p.original.quantity, 0);
        
        return (
          <Box
            sx={{display: "flex", alignItems: "center", justifyContent: "space-between", border: "1px solid", borderColor: "primary.textContrast", borderRadius: 2, mr: "auto", p: 2, bgcolor: colors.lightBlue[500], width: "100%"}}
          >
            <Typography color="white" fontSize={26}>
              <b>{langFormat({ uz: "Jami", ru: "Всего", en: "Total" })}: </b>{" "}
              {multiDigitNumberFormat(total)} so`m
            </Typography>
            <NotSavedSales />
          </Box>
        )
      }}
    />
  );
}

const NotSavedSales = () => {
  const {mutateAsync: saveSale, isPending: isSavingSale} = useCreateSales();
  const [unSaledSales, setUnSaledSales] = useState<Saled_Product[]>([]);

  const handleCancleSale = (i: number) => {
    toast.success(langFormat({ uz: "Mahsulot o'chirildi", ru: "Продукт удален", en: "Product deleted", }) );
    const newUnSaledSales = unSaledSales.filter((_, index) => index !== i);
    setUnSaledSales(newUnSaledSales);
    localStorage.setItem("sales", JSON.stringify(newUnSaledSales));
  }

  const filterProducts = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const products = JSON.parse(localStorage.getItem("sales") || "[]") as Saled_Product[];

    setUnSaledSales(search(value, products, ['name', 'barcode', 'buyerName'], 'fuzzy'));
  }

  const handleSaveSales = async() => {
    if(!window.navigator.onLine) return toast.error(langFormat({ uz: "Internetga ulanib qayta urinib ko'ring", ru: "Подключитесь к интернету еще раз", en: "Please connect to the internet", }));

    const res = await saveSale(unSaledSales);

    if(res.success) {
      setUnSaledSales([]);
      localStorage.setItem("sales", JSON.stringify([]));
      toast.success(langFormat({ uz: "Savdo saqlandi", ru: "Продажа сохранена", en: "Sale saved", }));
    } else {
      toast.error(langFormat({ uz: "Xatolik yuz berdi", ru: "Произошла ошибка", en: "An error occurred", }));
    }
  }

  const loading = isSavingSale;
  const disable = loading || unSaledSales.length === 0;

  return (
      <CustomPopover handleClick={() => {
        const sales = localStorage.getItem("sales");
          if (sales) {
            setUnSaledSales(JSON.parse(sales));
          }
        }}>
        <TextField sx={{m: 1}} size="small" placeholder={langFormat({uz: "Qidirish", ru: "Поиск", en: "Search"})} variant="standard" onChange={filterProducts} />
        <List sx={{ p: 2, minWidth: '200px', height: '500px', overflowY: 'auto' }}>
            <ListItem divider disablePadding>
              <ListItemText sx={{ mr: 1, width: '20px' }} primary={"#"} />
              <ListItemText sx={{ mr: 1, width: '200px' }} primary={langFormat({uz: 'Xaridor', ru: 'Покупатель', en: 'Buyer'})} />
              <ListItemText sx={{ mr: 1, width: '100px' }} primary={langFormat({uz: "Savdo shakli", ru: "Тип продажи", en: "Sale type"})} />
              <ListItemText sx={{ mr: 1, width: '200px' }} primary={langFormat({uz: 'Nomi', ru: 'Название', en: 'Name'})} />
              <ListItemText sx={{ mr: 1, width: '100px' }} primary={langFormat({uz: 'Soni', ru: 'Количество', en: 'Count'})} />
              <ListItemText sx={{ mr: 1, width: '100px' }} primary={langFormat({uz: 'Jami', ru: 'Всего', en: 'Total'})} />
              <ListItemText sx={{ mr: 1, width: '50px' }} primary={''} />
            </ListItem>
          {unSaledSales.map((item, index) => (
            <ListItem key={index} divider disablePadding sx={{':hover': {backgroundColor: 'divider', }, px: 1, borderRadius: 1}}>
              <ListItemText sx={{ mr: 1, width: '20px' }} primary={index + 1} />
              <ListItemText sx={{ mr: 1, width: '200px' }} primary={item.buyerName} />
              <ListItemText sx={{ mr: 1, width: '100px', color: item.form === SALE_FORM.CASH ? "green" : item.form === SALE_FORM.CARD ? "blue" : "red" }} primary={item.form === SALE_FORM.CASH ? "Naqd" : item.form === SALE_FORM.CARD ? "Plastik" : "Nasiya"} />
              <ListItemText sx={{ mr: 1, width: '200px' }} primary={item.name} />
              <ListItemText sx={{ mr: 1, width: '100px' }} primary={item.quantity} />
              <ListItemText sx={{ mr: 1, width: '100px' }} primary={item.saledPrice * item.quantity * (1 - item.discount/100) + " " + langFormat({uz: 'so`m', ru: 'сом', en: 'som'})} />
              <ListItemIcon sx={{ mr: 1, width: '50px' }}>
                <Tooltip title={langFormat({uz: 'O`chirish', ru: 'Удалить', en: 'Delete'})}>
                  <IconButton onClick={() => handleCancleSale(index)}>
                    <Delete sx={{ color: "red" }} />
                  </IconButton>
                </Tooltip>
              </ListItemIcon> 
            </ListItem>
          ))}
        </List>
        <Button disabled={disable} endIcon={loading ? <CircularProgress size={20} /> : undefined} sx={{ m: 1 }} variant="contained" color="primary" onClick={handleSaveSales}>{langFormat({uz: 'Saqlash', ru: 'Сохранить', en: 'Save'})}</Button>
      </CustomPopover>
  )
}

export default SaledProductsList;
