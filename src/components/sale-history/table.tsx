"use client";
import { sendTelegramSms } from "@/actions/telegramsms";
import { useGetBuyers } from "@/hooks/buyer";
import { useGetOrganization } from "@/hooks/organization";
import {
  useDeleteSale,
  useGetSales,
  useGetSalesFromDate,
  useUpdateSale,
} from "@/hooks/sale";
import { useGetCurrentUser } from "@/hooks/user";
import { SALE_FORM, Saled_Product } from "@/models/types";
import { dateFormat } from "@/utils/dateFormat";
import { langFormat } from "@/utils/langFormat";
import { multiDigitNumberFormat } from "@/utils/multiDigitNumberFormat";
import {
  sendDeleteSaleSms,
  sendEditSaleSms,
  sendSaleSms,
  separateRowsByBuyer,
} from "@/utils/saveAllSelectedSales";
import { textMultiSale, textSale } from "@/utils/textsForSaving";
import { ContentCopy, CopyAll, Delete, Refresh } from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  MenuItem,
  Select,
  Tooltip,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import {
  MRT_Cell,
  MRT_ColumnDef,
  MRT_Row,
  MRT_TableInstance,
  useMaterialReactTable,
} from "material-react-table";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Props {
  columns: MRT_ColumnDef<Saled_Product>[];
  //   setValidationErrors: (value: Record<string, string | undefined>) => void;
}

type RowActionsProps = {
  cell: MRT_Cell<Saled_Product, unknown>;
  row: MRT_Row<Saled_Product>;
  table: MRT_TableInstance<Saled_Product>;
};

type TopToolbarProps = {
  table: MRT_TableInstance<Saled_Product>;
  delta: number;
  setDelta: (value: number) => void;
};

function TopToolbarCustomActions(props: TopToolbarProps): JSX.Element {
  const { table, delta, setDelta } = props;
  const { data: userData } = useGetCurrentUser();
  const { data: organizationData } = useGetOrganization(
    userData?.user.organizationId as string
  );
  const { data: buyersData } = useGetBuyers();
  const { mutateAsync: updateSaledProduct } = useUpdateSale();

  const handleSaveAll = (table: MRT_TableInstance<Saled_Product>): void => {
    const selectedProducts = table.getSelectedRowModel().rows;
    const seperatedRows = separateRowsByBuyer(selectedProducts);
    const companyName = organizationData?.organization?.name;
    const text = textMultiSale(
      companyName || "BIMUS",
      seperatedRows,
      selectedProducts
    );

    navigator.clipboard.writeText(text);
    toast.success(langFormat({ uz: "Saqlandi", ru: "Сохранено", en: "Saved" }));
  };

  const handleChangeAllIcon = (
    table: MRT_TableInstance<Saled_Product>
  ): void => {
    const selectedProducts = table.getSelectedRowModel().rows;

    const handleChange = async () => {
      for (let i = 0; i < selectedProducts.length; i++) {
        const newProduct: Saled_Product = {
          ...selectedProducts[i].original,
          date: new Date(),
          saledDate: selectedProducts[i].original.saledDate
            ? selectedProducts[i].original.saledDate
            : selectedProducts[i].original.date,
          form:
            selectedProducts[i].original.form === SALE_FORM.CASH
              ? SALE_FORM.LOAN
              : SALE_FORM.CASH,
        };
        const buyer = buyersData?.buyers.find(
          (buyer) => buyer.name === newProduct.buyerName
        );

        if (!buyer || !buyer.messageId) {
          await toast.promise(
            updateSaledProduct({
              index: selectedProducts[i].index,
              sale: newProduct,
            }),
            {
              success: lang["saved"] + ": " + selectedProducts[i].original.name,
              loading:
                lang["saving"] + ": " + selectedProducts[i].original.name,
              error: lang["error"] + ": " + selectedProducts[i].original.name,
            }
          );
        } else {
          const send = async () => {
            const { textForAdmin, textForBuyer } = sendEditSaleSms(
              newProduct,
              buyer?.name || "",
              organizationData?.organization?.name
            );
            const smsBuyerRes = await sendTelegramSms(
              buyer?.messageId!,
              textForBuyer
            );
            if (smsBuyerRes.success) {
              const smsAdminRes = await sendTelegramSms(
                organizationData?.organization?.messageId!,
                textForAdmin
              );
              if (smsAdminRes.success) {
                await updateSaledProduct({
                  index: selectedProducts[i].index,
                  sale: newProduct,
                });
              } else {
                throw new Error("Adminga sms yuborilmadi, yana urinib ko'ring");
              }
            } else {
              throw new Error("Buyerga sms yuborilmadi, yana urinib ko'ring");
            }
          };

          await toast.promise(send(), {
            success: lang["saved"] + ": " + selectedProducts[i].original.name,
            loading: lang["saving"] + ": " + selectedProducts[i].original.name,
            error: (props) =>
              "Xatolik: " + props.message + selectedProducts[i].original.name,
          });
        }
      }
      table.resetRowSelection();
    };

    toast((t) => (
      <Box>
        <div>{lang["confirm"]}</div>
        <br />
        <Button onClick={() => toast.dismiss(t.id)}>{lang["cancel"]}</Button>
        <Button
          sx={{ ml: "1rem" }}
          onClick={async () => {
            await handleChange();
            toast.dismiss(t.id);
          }}
        >
          {lang["change"]}
        </Button>
      </Box>
    ));
  };

  return (
    <Box
      sx={{
        display: "flex",
        gap: "1rem",
        width: "100%",
        alignItems: "center",
      }}
    >
      <Select
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
      {table.getSelectedRowModel().rows.length > 0 && (
        <>
          <Tooltip title={lang["save"]}>
            <IconButton onClick={() => handleSaveAll(table)}>
              <CopyAll />
            </IconButton>
          </Tooltip>
          <Tooltip title={lang["change"]}>
            <IconButton onClick={() => handleChangeAllIcon(table)}>
              <Refresh />
            </IconButton>
          </Tooltip>
          <Typography variant="h5" sx={{ ml: "auto", mr: 1 }}>
            {multiDigitNumberFormat(
              table
                .getSelectedRowModel()
                ?.rows.reduce(
                  (acc, row) =>
                    acc +
                    row.original.saledPrice *
                      row.original.quantity *
                      (1 - row.original.discount / 100),
                  0
                )
            ) +
              " " +
              lang["sum"]}
          </Typography>
        </>
      )}
    </Box>
  );
}

const RowActions = (props: RowActionsProps) => {
  const { row } = props;
  const { data: buyersData } = useGetBuyers();
  const { data: userData } = useGetCurrentUser();
  const { data: organizationData } = useGetOrganization(
    userData?.user.organizationId as string
  );

  const { mutateAsync: deleteSaledProduct } = useDeleteSale();

  const handleDelete = async (sale: Saled_Product) => {
    const { textForAdmin, textForBuyer } = sendDeleteSaleSms(
      sale,
      sale.buyerName,
      organizationData.organization.name
    );
    const buyer = buyersData?.buyers.find((b) => b.name === sale.buyerName);
    if (!buyer?.messageId!) {
      return await deleteSaledProduct({ sale, index: row.index });
    }
    const buyerRes = await sendTelegramSms(buyer?.messageId!, textForBuyer);
    if (buyerRes.success) {
      const adminRes = await sendTelegramSms(
        organizationData.organization.messageId!,
        textForAdmin
      );
      if (adminRes.success) {
        await deleteSaledProduct({ sale, index: row.index });
      } else {
        throw new Error("Adminga sms yuborilmadi, yana urinib ko'ring");
      }
    } else {
      throw new Error("Buyerga sms yuborilmadi, yana urinib ko'ring");
    }
  };

  return (
    <Box sx={{ display: "flex", gap: "1rem" }}>
      <Tooltip title={lang["delete"]}>
        <IconButton
          onClick={async () => {
            toast((t) => (
              <Box>
                <div>{lang["confirm"]}</div>
                <br />
                <Button onClick={() => toast.dismiss(t.id)}>
                  {lang["cancel"]}
                </Button>
                <Button
                  sx={{ ml: "1rem" }}
                  onClick={async () => {
                    toast.dismiss(t.id);
                    // console.log(row.original);

                    await toast.promise(handleDelete(row.original), {
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
          }}
        >
          <Delete sx={{ color: "red" }} />
        </IconButton>
      </Tooltip>
      <Tooltip title={lang["save"]}>
        <IconButton
          onClick={async () => {
            const sale = row.original;
            const text = textSale(
              organizationData?.organization?.name || "BIMUS",
              sale
            );

            toast.success(lang["copied"]);
            navigator.clipboard.writeText(text);
          }}
        >
          <ContentCopy />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export const useReactTable = (props: Props) => {
  const [delta, setDelta] = useState(7);
  const { columns } = props;

  const {
    data: salesData,
    isFetching: isFetchingSales,
    refetch: refetchSales,
  } = useGetSalesFromDate(dayjs(new Date()).subtract(delta, "day").toDate());

  useEffect(() => {
    refetchSales();
  }, [delta, refetchSales]);

  return useMaterialReactTable<Saled_Product>({
    columns,
    data: salesData?.sales || [],
    enableRowNumbers: true,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableColumnActions: false,
    enableRowActions: true,
    enableRowSelection: true,
    enableBatchRowSelection: true,
    enableStickyHeader: true,
    enableStickyFooter: true,
    positionGlobalFilter: "left",
    positionActionsColumn: "last",
    selectAllMode: "all",
    renderRowActions: (props) => <RowActions {...props} />,
    renderTopToolbarCustomActions: (props) => (
      <TopToolbarCustomActions
        table={props.table}
        setDelta={setDelta}
        delta={delta}
      />
    ),
    initialState: {
      columnVisibility: {
        barcode: false,
        quantity: false,
        cost: false,
        price: false,
        profit: false,
        saledPrice: false,
        discount: false,
      },
      pagination: {
        pageIndex: 0,
        pageSize: 50,
      },
      columnFilters: [
        {
          id: "date",
          value: dateFormat(new Date(), true),
        },
      ],
    },
    state: {
      isSaving: isFetchingSales,
      showColumnFilters: true,
      showGlobalFilter: true,
      density: "compact",
    },
    muiPaginationProps: {
      rowsPerPageOptions: [50, 75, 100, 125],
    },
    muiTableContainerProps: {
      sx: {
        maxHeight: "calc(100vh - 180px)",
      },
    },
  });
};

const lang = {
  save: langFormat({ uz: "Saqlash", ru: "Сохранить", en: "Save" }),
  change: langFormat({ uz: "O`zgartirish", ru: "Изменить", en: "Change" }),
  delete: langFormat({ uz: "O`chirish", ru: "Удалить", en: "Delete" }),
  cancel: langFormat({ uz: "Bekor qilish", ru: "Отмена", en: "Cancel" }),
  confirm: langFormat({ uz: "Tasdiqlash", ru: "Подтвердить", en: "Confirm" }),
  edit: langFormat({ uz: "Tahrirlash", ru: "Редактировать", en: "Edit" }),
  deleting: langFormat({
    uz: "O`chirishni istaysizmi?",
    ru: "Удалить?",
    en: "Delete?",
  }),
  deleted: langFormat({ uz: "O`chirildi", ru: "Удалено", en: "Deleted" }),
  error: langFormat({ uz: "Xatolik", ru: "Ошибка", en: "Error" }),
  copied: langFormat({ uz: "Saqlandi", ru: "Сохранено", en: "Saved" }),
  saved: langFormat({ uz: "Saqlandi", ru: "Сохранено", en: "Saved" }),
  saving: langFormat({ uz: "Saqlanmoqda", ru: "Сохранение", en: "Saving" }),
  sum: langFormat({ uz: "so'm", ru: "сум", en: "so'm" }),
};
