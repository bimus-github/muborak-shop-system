import { useGetProducts } from "@/hooks/product";
import { useGetRoom, useUpdateRoom } from "@/hooks/room";
import { useCreateSales } from "@/hooks/sale";
import {
  LangFormat,
  Product,
  Refund,
  SALE_FORM,
  Saled_Product,
} from "@/models/types";
import { langFormat } from "@/utils/langFormat";
import {
  Autocomplete,
  Box,
  Button,
  ButtonGroup,
  Chip,
  CircularProgress,
  IconButton,
  TextField,
  Tooltip,
  colors,
} from "@mui/material";
import {
  MRT_ColumnDef,
  MRT_TableInstance,
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import CheckListModal from "../check-list-modal";
import { useGetBuyers } from "@/hooks/buyer";
import { useCreateRefunds } from "@/hooks/refund";
import { Clear } from "@mui/icons-material";
import { sendTelegramSms } from "@/actions/telegramsms";
import { useGetCurrentUser } from "@/hooks/user";
import { useGetOrganization } from "@/hooks/organization";
import { sendSaleSms } from "@/utils/saveAllSelectedSales";

const CustomTable = ({ roomId }: { roomId: number }) => {
  const [saerchValue, setSearchValue] = useState("");
  const searchRef = React.useRef<HTMLInputElement>(null);
  const { data: productsData, isFetching: isFetchingProducts } =
    useGetProducts();
  const { data: roomData } = useGetRoom(roomId.toString());
  const { mutateAsync: update } = useUpdateRoom();

  const columns = useMemo<MRT_ColumnDef<Product>[]>(
    () => [
      {
        accessorKey: "name",
        header: langFormat({ uz: "Nomi", ru: "Название", en: "Name" }),
        size: 50,
      },
      {
        accessorKey: "barcode",
        header: langFormat({ uz: "Kod", ru: "Код", en: "Code" }),
        size: 50,
      },
      {
        accessorKey: "qrCodes",
        accessorFn: (row) => (row?.qrCodes || []).join(","),
        header: "Modellar",
        Cell: ({ row }) => (
          <Box
            sx={{
              maxWidth: "250px",
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "0.5rem",
            }}
          >
            {row.original?.qrCodes?.map((qr: string) => (
              <Chip key={qr} label={qr} />
            ))}
          </Box>
        ),
      },
      {
        accessorKey: "count",
        header: langFormat({
          uz: "Qutilar soni",
          ru: "Количество",
          en: "Count",
        }),
        accessorFn: (row) => row.count / (row.quantityPerBox || 1),
        size: 50,
        enableGlobalFilter: false,
        Cell: (props) => <>{props.renderedCellValue?.toLocaleString()}</>,
      },
      {
        header: langFormat({ uz: "Narxi", ru: "Цена", en: "Price" }),
        accessorFn: (row) =>
          row.price * (row.quantityPerBox || 1) +
          " " +
          langFormat({ uz: "so'm", ru: "сум", en: "so'm" }),
        size: 50,
        enableGlobalFilter: false,
      },
    ],
    []
  );

  const focusGlobalSearch = useCallback(() => {
    searchRef.current?.getElementsByTagName("input")[0].focus();
  }, [searchRef]);

  const handleAddToRoom = useCallback(
    async (product: Product, table: MRT_TableInstance<Product>) => {
      if (product?.count <= 0)
        return toast.error(
          langFormat({
            uz: "Mahsulot mavjud emas",
            ru: "Товар уже существует",
            en: "Product already exists",
          })
        );

      const isProductExist = roomData?.room.saledProducts.find(
        (item) => item.productId === product._id
      );

      const quantity = getSaleQuantity(
        isProductExist?.quantity || 0,
        product.count,
        product.quantityPerBox || 1
      );

      if (!quantity)
        return toast.error(
          langFormat({
            uz: "Xatolik yuz berdi",
            ru: "Произошла ошибка",
            en: "An error occurred",
          })
        );

      const newSaledProduct: Saled_Product = {
        _id: Math.random().toString(),
        productId: product._id!,
        count: product.count,
        price: product.price,
        barcode: product.barcode,
        buyerName: "",
        cost: product.cost,
        date: new Date(),
        discount: 0,
        name: product.name,
        quantity,
        saledPrice: +roomData.room.id === 10 ? product.cost : product.price,
        userId: product.userId,
        form: SALE_FORM.NONE,
        qrCodes: product.qrCodes || [],
        quantityPerBox: product.quantityPerBox,
      };

      const res = await update({
        ...roomData?.room!,
        saledProducts: isProductExist
          ? roomData?.room?.saledProducts?.map((item) => {
              if (item.productId === product._id) {
                return newSaledProduct;
              }
              return item;
            }) || []
          : [newSaledProduct, ...(roomData?.room?.saledProducts || [])],
      });

      if (res.success) {
        toast.success(
          langFormat({
            uz: "Mahsulot qo'shildi",
            ru: "Товар добавлен",
            en: "Product added",
          })
        );
        setSearchValue("");
        table.setGlobalFilter("");
      } else {
        toast.error(
          langFormat({
            uz: "Xatolik yuz berdi",
            ru: "Произошла ошибка",
            en: "An error occurred",
          })
        );
      }
    },
    [roomData?.room, update]
  );

  const table = useMaterialReactTable<Product>({
    data: productsData?.products || [],
    columns: columns,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableHiding: false,
    enableTableFooter: false,
    enableStickyFooter: false,
    enableColumnActions: false,
    enableColumnFilters: false,
    enableGlobalFilterModes: false,
    enableBottomToolbar: false,
    positionGlobalFilter: "left",
    muiTableBodyRowProps: ({ table, row }) => ({
      onClick: async () => {
        await handleAddToRoom(row.original, table);
        focusGlobalSearch();
      },
    }),
    muiTableBodyCellProps: {
      align: "center",
      sx: { border: "1px solid lightgrey" },
    },
    renderTopToolbar: () => {
      return (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <TextField
            ref={searchRef}
            autoFocus
            value={saerchValue}
            placeholder={langFormat({
              uz: "Qidirish",
              ru: "Поиск",
              en: "Search",
            })}
            sx={{ width: "90%", m: 1 }}
            onChange={(e) => {
              setSearchValue(e.target.value);
              table.setGlobalFilter(e.target.value);
            }}
          />
          <Tooltip
            title={langFormat({ uz: "Tozalash", ru: "Очистить", en: "Clear" })}
          >
            <IconButton
              onClick={() => {
                setSearchValue("");
                table.setGlobalFilter(undefined);
                searchRef.current?.getElementsByTagName("input")[0].focus();
              }}
            >
              <Clear />
            </IconButton>
          </Tooltip>
        </Box>
      );
    },
    muiTableContainerProps: {
      sx: {
        maxHeight: "50vh",
      },
    },
    muiSearchTextFieldProps: {
      ref: searchRef,
      autoFocus: true,
      placeholder: langFormat({ uz: "Qidirish", ru: "Поиск", en: "Search" }),
    },
    initialState: {
      sorting: [
        {
          id: "count",
          desc: false,
        },
      ],
    },
    state: {
      isSaving: isFetchingProducts,
      showGlobalFilter: true,
      density: "compact",
    },
  });

  useEffect(() => {
    const keyboarFunction = async (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        focusGlobalSearch();
        await handleAddToRoom(table.getRowModel().rows[0].original, table);
      }
    };

    document.addEventListener("keydown", keyboarFunction);

    return () => {
      document.removeEventListener("keydown", keyboarFunction);
    };
  }, [table, focusGlobalSearch, handleAddToRoom]);

  return <MaterialReactTable table={table} />;
};

function SearchSide({ roomId }: { roomId: number }) {
  const [loading, setLoading] = useState(false);
  const { mutateAsync: createSales, isPending: isCreating } = useCreateSales();
  const { data: roomData, isFetching: isFetchingRoom } = useGetRoom(
    roomId.toString()
  );
  const { data: buyersData, isFetching: isFetchingBuyers } = useGetBuyers();
  const { data: userData, isLoading: userLoading } = useGetCurrentUser();
  const { data: organizationData, isLoading: organizationLoading } =
    useGetOrganization(userData?.user?.organizationId as string);
  const { mutateAsync: updateRoom, isPending: isUpdating } = useUpdateRoom();
  const { mutateAsync: createRefunds } = useCreateRefunds();

  const onHandleSale = useCallback(
    async (saleForm: SALE_FORM) => {
      if (!roomData.room.saledProducts?.length) {
        return toast.error("Mahsulotlar ro'yxati bo'sh!");
      }

      if (+roomData.room.id === 10) {
        const confirm = window.confirm("Siz tovarni oz narxida sotmoqchimisz?");
        if (!confirm) return;
      }

      setLoading(true);
      try {
        let retryCount = 0;
        const all =
          roomData.room.saledProducts?.map((item) => ({
            ...item,
            form: saleForm,
            buyerName: roomData.room.buyerName,
            discount: roomData.room.discount,
            _id: undefined,
          })) || [];

        if (!all.length) {
          setLoading(false);
          return toast.error("Sotiladigan mahsulot yo'q!");
        }

        const buyer = buyersData?.buyers.find(
          (item) => item.name === roomData.room.buyerName
        );

        const saveSales = async () => {
          const res = await createSales(all);
          retryCount++;

          if (res?.success) {
            await updateRoom({
              ...roomData.room,
              saledProducts: [],
              buyerName: "",
              discount: 0,
            });
            toast.success(
              langFormat(res.message as LangFormat) +
                ` ${
                  saleForm === SALE_FORM.CASH
                    ? "Naqd"
                    : saleForm === SALE_FORM.CARD
                    ? "Plastik"
                    : "Qarz"
                } `
            );
          } else {
            if (retryCount < 3) {
              await saveSales();
            } else {
              toast.error(
                "Savdoni saqlashda xatolik yuz berdi! Iltimos qayta urinib ko'ring!"
              );
            }
          }
        };

        if (!buyer) {
          await saveSales();
        } else {
          if (buyer.messageId) {
            const { textForAdmin, textForBuyer } = sendSaleSms(
              all,
              buyer.name,
              organizationData?.organization?.name as string
            );
            const smsAdminRes = await sendTelegramSms(
              organizationData?.organization?.messageId,
              textForAdmin
            );

            if (smsAdminRes && smsAdminRes?.success) {
              const smsBuyerRes = await sendTelegramSms(
                buyer.messageId,
                textForBuyer
              );
              if (smsBuyerRes && smsBuyerRes?.success) {
                await saveSales();
              } else {
                toast.error("Yana urunib ko'ring, Haridorga sms ketmadi!");
              }
            } else {
              toast.error("Yana urunib ko'ring, Adminga sms ketmadi!");
            }
          } else {
            await saveSales();
          }
        }
      } catch (error: unknown) {
        console.error("Error in onHandleSale:", error);
        toast.error(
          error instanceof Error ? error.message : "Xatolik yuz berdi!"
        );
      } finally {
        setLoading(false);
      }
    },
    [
      buyersData?.buyers,
      createSales,
      organizationData?.organization?.messageId,
      organizationData?.organization?.name,
      roomData,
      updateRoom,
    ]
  );

  const handleClickResetRoom = useCallback(async () => {
    if (!roomData) return;

    await updateRoom({
      ...roomData.room,
      saledProducts: [],
      buyerName: "",
      discount: 0,
    });
  }, [roomData, updateRoom]);

  const handleRefund = useCallback(async () => {
    const saledProducts = roomData?.room.saledProducts;

    if (saledProducts.length === 0) {
      return toast.error("Mahsulotlar ro'yxati bo'sh!");
    }

    const refundedProducts: Refund[] = saledProducts.map((item) => {
      return {
        barcode: item.barcode,
        name: item.name,
        cost: item.cost,
        count: item.quantity,
        date: new Date(),
        userId: item.userId,
        _id: item.productId,
        shopName: roomData?.room.buyerName || "",
      } as Refund;
    });

    const res = await createRefunds(refundedProducts);

    if (res.success) {
      toast.success(langFormat(res.message as LangFormat));
      handleClickResetRoom();
    } else {
      toast.error(langFormat(res.message as LangFormat));
    }
  }, [roomData, createRefunds, handleClickResetRoom]);

  useEffect(() => {
    const keyboarFunction = async (e: KeyboardEvent) => {
      switch (e.key) {
        case "F1": {
          e.preventDefault();
          await onHandleSale(SALE_FORM.CASH);
          break;
        }
        case "F2": {
          e.preventDefault();
          await onHandleSale(SALE_FORM.LOAN);
          break;
        }
        case "F4": {
          e.preventDefault();
          await handleClickResetRoom();
          break;
        }
        case "F5": {
          e.preventDefault();
          await handleRefund();
          break;
        }
      }
    };

    document.addEventListener("keydown", keyboarFunction);

    return () => {
      document.removeEventListener("keydown", keyboarFunction);
    };
  }, [onHandleSale, handleClickResetRoom, handleRefund]);

  const disableMode =
    isCreating ||
    isUpdating ||
    isFetchingRoom ||
    isFetchingBuyers ||
    userLoading ||
    organizationLoading ||
    loading;

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        height: "80vh",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <CustomTable roomId={roomId} />

      <Box sx={{ display: "flex", gap: "1rem", width: "100%", mt: "auto" }}>
        <Autocomplete
          options={buyersData?.buyers?.map((item) => item.name) || []}
          loading={disableMode}
          fullWidth
          size="small"
          disablePortal
          value={roomData.room.buyerName}
          onInputChange={(_e, newValue) =>
            updateRoom({
              ...roomData.room,
              buyerName: newValue,
              saledProducts: roomData.room?.saledProducts?.map((p) => ({
                ...p,
                buyerName: newValue,
              })),
            })
          }
          renderInput={(params) => (
            <TextField
              {...params}
              disabled={disableMode}
              label={langFormat({
                uz: "Haridor",
                ru: "Покупатель",
                en: "Buyer",
              })}
              size="small"
              variant="outlined"
            />
          )}
        />
        <TextField
          fullWidth
          size="small"
          label={langFormat({ uz: "Chegirma", ru: "Скидка", en: "Discount" })}
          type="number"
          value={roomData?.room.discount}
          onChange={(e) =>
            updateRoom({
              ...roomData.room,
              discount: +e.target.value,
              saledProducts: roomData.room?.saledProducts?.map((p) => ({
                ...p,
                discount: +e.target.value,
              })),
            })
          }
        />
      </Box>

      <ButtonGroup
        fullWidth
        sx={{ width: "100%", gap: "1rem", boxShadow: "none" }}
        variant="contained"
        size="small"
      >
        <Button
          endIcon={disableMode ? <CircularProgress size={20} /> : undefined}
          onClick={() => onHandleSale(SALE_FORM.CASH)}
          sx={{ bgcolor: colors.green.A400, fontWeight: "800" }}
          disabled={disableMode}
        >
          {langFormat({ uz: "Naqd", ru: "Наличка", en: "Cash" })} [F1]
        </Button>
        <Button
          endIcon={disableMode ? <CircularProgress size={20} /> : undefined}
          onClick={() => onHandleSale(SALE_FORM.LOAN)}
          sx={{ bgcolor: colors.red.A400, fontWeight: "800" }}
          disabled={disableMode}
        >
          {langFormat({ uz: "Qarz", ru: "Долг", en: "Loan" })} [F2]
        </Button>
      </ButtonGroup>
      <ButtonGroup
        fullWidth
        sx={{ width: "100%", gap: "1rem", boxShadow: "none" }}
        variant="contained"
        size="small"
      >
        <Button
          onClick={() => handleClickResetRoom()}
          fullWidth
          sx={{ bgcolor: colors.red.A400, fontWeight: "800", color: "white" }}
          disabled={disableMode}
        >
          {langFormat({ uz: "Tozalash", ru: "Очистить", en: "Reset" })} [F4]
        </Button>
        <Button
          onClick={() => handleRefund()}
          fullWidth
          sx={{
            bgcolor: colors.deepOrange[500],
            fontWeight: "800",
            color: "white",
          }}
          disabled={!!disableMode}
        >
          {langFormat({ uz: "Qaytarish", ru: "Возврат", en: "Refund" })} [F5]
        </Button>
        <CheckListModal roomId={roomId.toString()} />
      </ButtonGroup>
    </Box>
  );
}

const getSaleQuantity = (
  exists: number,
  count: number,
  quantityPerBox: number
) => {
  switch (true) {
    case exists + quantityPerBox >= count:
      return count;
    case exists + quantityPerBox < count:
      return exists + quantityPerBox;
  }
};

export default SearchSide;
