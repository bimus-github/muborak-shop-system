import {
  MRT_Column,
  MRT_Header,
  MRT_Cell,
  MRT_Row,
  MRT_TableInstance,
  MRT_ColumnDef,
} from "material-react-table";
import { SALE_FORM, Saled_Product } from "@/models/types";
import { multiDigitNumberFormat } from "@/utils/multiDigitNumberFormat";
import {
  Typography,
  Autocomplete,
  Box,
  Button,
  IconButton,
  TextField,
  Tooltip,
  Dialog,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { langFormat } from "@/utils/langFormat";
import { sendTelegramSms } from "@/actions/telegramsms";
import { useGetBuyers } from "@/hooks/buyer";
import { useGetOrganization } from "@/hooks/organization";
import { useUpdateSale } from "@/hooks/sale";
import { useGetCurrentUser } from "@/hooks/user";
import { dateFormat } from "@/utils/dateFormat";
import { sendEditSaleSms } from "@/utils/saveAllSelectedSales";
import { Clear, Info, Refresh } from "@mui/icons-material";
import { useState, useMemo } from "react";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { getProductHistory } from "@/actions/product";
import Grid from "@mui/material/Grid";
import AccordionComponent from "../accordion";
import { ProductInfoDialogContainer } from "../product";

type FilterByProps = {
  column: MRT_Column<Saled_Product, unknown>;
  header: MRT_Header<Saled_Product>;
  table: MRT_TableInstance<Saled_Product>;
};

type CellProps = {
  cell: MRT_Cell<Saled_Product, unknown>;
  column: MRT_Column<Saled_Product, unknown>;
  renderedCellValue: React.ReactNode;
  table: MRT_TableInstance<Saled_Product>;
  row: MRT_Row<Saled_Product>;
};

type Footer = {
  column: MRT_Column<Saled_Product, unknown>;
  footer: MRT_Header<Saled_Product>;
  table: MRT_TableInstance<Saled_Product>;
};

export const TotalFooter = (props: Footer) => {
  const total = multiDigitNumberFormat(
    props.table
      .getFilteredRowModel()
      .rows.reduce(
        (sum, row) =>
          sum +
          row.original.saledPrice *
            row.original.quantity *
            (1 - (row.original.discount || 0) / 100),
        0
      )
  );
  return (
    <Typography sx={{ whiteSpace: "nowrap" }}>
      {total + " " + langFormat({ uz: "so'm", ru: "сум", en: "so'm" })}
    </Typography>
  );
};

export const ProfitFooter = (props: Footer) => {
  const profit = multiDigitNumberFormat(
    props.table
      .getFilteredRowModel()
      .rows.reduce(
        (sum, row) =>
          sum +
          (row.original.saledPrice * (1 - (row.original.discount || 0) / 100) -
            row.original.cost) *
            row.original.quantity,
        0
      )
  );
  return (
    <Typography sx={{ whiteSpace: "nowrap" }}>
      {profit + " " + langFormat({ uz: "so'm", ru: "сум", en: "so'm" })}
    </Typography>
  );
};

export const FilterByBuyer = (props: FilterByProps) => {
  const { data: buyresData } = useGetBuyers();
  return (
    <Autocomplete
      size="small"
      options={[...(buyresData?.buyers || []), { name: "BOSHQA HARIDORLAR" }]}
      getOptionLabel={(option) => option.name}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={langFormat({
            uz: "Haridor",
            ru: "Покупатель",
            en: "Buyer",
          })}
          size="small"
          variant="standard"
          autoFocus
        />
      )}
      onChange={(_, value) => {
        props.column.setFilterValue(value?.name);
      }}
    />
  );
};

export const FilterByDate = (props: FilterByProps) => {
  const [value, setValue] = useState(dateFormat(new Date(), true));
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <TextField
        size="small"
        placeholder={langFormat({ uz: "Sana", ru: "Дата", en: "Date" })}
        variant="standard"
        value={value}
        onChange={(event) => {
          props.column.setFilterValue(event.target.value);
          setValue(event.target.value);
        }}
      />
      <IconButton
        onClick={() => {
          props.column.setFilterValue(undefined);
          setValue("");
        }}
        sx={{ ml: 1 }}
        size="small"
      >
        <Clear fontSize="small" />
      </IconButton>
    </Box>
  );
};

export const FiletrBySaleForm = (props: FilterByProps) => {
  const options = useMemo(
    () =>
      Object.values(SALE_FORM).map((item) => ({
        label:
          item === SALE_FORM.CASH
            ? "Naqd"
            : item === SALE_FORM.CARD
            ? "Plastik"
            : item === SALE_FORM.LOAN
            ? "Nasiya"
            : "Boshqa",
        value: item,
      })),
    []
  );

  return (
    <Autocomplete
      options={options}
      getOptionLabel={(option: { label: string; value: string }) =>
        option.label
      }
      value={options.find(
        (item) => item.label === props.column.getFilterValue()
      )}
      onChange={(_, value) => {
        props.column.setFilterValue(value?.label);
      }}
      renderInput={(inputProps) => (
        <TextField
          {...inputProps}
          placeholder={langFormat({
            uz: "Savdo Shakli",
            ru: "Форма",
            en: "Form",
          })}
          size="small"
          variant="standard"
        />
      )}
    />
  );
};

export const SaleFormCell = (props: CellProps) => {
  const data = props.row.original;
  const form =
    data.form === SALE_FORM.CASH
      ? "Naqd"
      : data.form === SALE_FORM.CARD
      ? "Plastik"
      : "Nasiya";
  const { mutateAsync: updateSale } = useUpdateSale();
  const { data: userData } = useGetCurrentUser();
  const { data: organizationData } = useGetOrganization(
    userData?.user.organizationId as string
  );
  const { data: buyersData } = useGetBuyers();

  const handleUpdate = () => {
    const newSaleForm =
      data.form === SALE_FORM.CASH ? SALE_FORM.LOAN : SALE_FORM.CASH;

    const saledProduct: Saled_Product = {
      _id: data._id,
      name: data.name,
      barcode: data.barcode,
      quantity: data.quantity,
      cost: data.cost,
      saledPrice: data.saledPrice,
      buyerName: data.buyerName,
      discount: data.discount,
      count: data.count,
      price: data.price,
      productId: data.productId,
      userId: data.userId,
      qrCodes: data.qrCodes,
      quantityPerBox: data.quantityPerBox,
      // changing
      form: newSaleForm,
      date: new Date(),
      saledDate: data.saledDate ? data.saledDate : data.date,
    };

    toast((t) => (
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <div>
          {langFormat({
            uz: "Pul shaklini o`zgartirishni istaysizmi?",
            ru: "Изменить счет?",
            en: "Change form of payment?",
          })}
        </div>
        <br />
        <Box
          sx={{ display: "flex", justifyContent: "space-between", gap: "10px" }}
        >
          <Button onClick={() => toast.dismiss(t.id)}>
            {langFormat({ uz: "Bekor qilish", ru: "Отмена", en: "Cancel" })}
          </Button>
          <Button
            color="error"
            onClick={async () => {
              toast.dismiss(t.id);

              const buyer = buyersData?.buyers.find(
                (buyer) => buyer.name === data.buyerName
              );

              if (!buyer || !buyer?.messageId) {
                await toast.promise(
                  updateSale({
                    index: props.row.index,
                    sale: saledProduct,
                  }).then((result) => {
                    if (result.success)
                      toast.success(langFormat(result.message));
                  }),
                  {
                    loading: langFormat({
                      uz: "Pul shaklini o`zgartirish...",
                      ru: "Изменение счета...",
                      en: "Changing form of payment...",
                    }),
                    success: langFormat({
                      uz: "Pul shaklini o`zgartirildi",
                      ru: "Счет изменен",
                      en: "Form of payment changed",
                    }),
                    error: langFormat({
                      uz: "Pul shaklini o`zgartirishda xatolik yuz berdi",
                      ru: "Изменение счета произошла ошибка",
                      en: "Error while changing form of payment",
                    }),
                  }
                );
              } else {
                const send = async () => {
                  const { textForAdmin, textForBuyer } = sendEditSaleSms(
                    saledProduct,
                    buyer?.name || "",
                    organizationData?.organization?.name
                  );
                  const buyerRes = await sendTelegramSms(
                    buyer.messageId!,
                    textForBuyer
                  );
                  if (buyerRes.success) {
                    const adminRes = await sendTelegramSms(
                      organizationData?.organization?.messageId!,
                      textForAdmin
                    );
                    if (adminRes.success) {
                      await toast.promise(
                        updateSale({
                          index: props.row.index,
                          sale: saledProduct,
                        }).then((result) => {
                          if (result.success)
                            toast.success(langFormat(result.message));
                        }),
                        {
                          loading: langFormat({
                            uz: "Pul shaklini o`zgartirish...",
                            ru: "Изменение счета...",
                            en: "Changing form of payment...",
                          }),
                          success: langFormat({
                            uz: "Pul shaklini o`zgartirildi",
                            ru: "Счет изменен",
                            en: "Form of payment changed",
                          }),
                          error: langFormat({
                            uz: "Pul shaklini o`zgartirishda xatolik yuz berdi",
                            ru: "Изменение счета произошла ошибка",
                            en: "Error while changing form of payment",
                          }),
                        }
                      );
                    } else {
                      toast.error(
                        "Adminga sms yuborilmadi, yana urinib ko'ring"
                      );
                    }
                  } else {
                    toast.error(
                      "Haridorga sms yuborilmadi, yana urinib ko'ring"
                    );
                  }
                };

                await toast.promise(send(), {
                  loading: langFormat({
                    uz: "Pul shaklini o`zgartirish...",
                    ru: "Изменение счета...",
                    en: "Changing form of payment...",
                  }),
                  success: langFormat({
                    uz: "Pul shaklini o`zgartirildi",
                    ru: "Счет изменен",
                    en: "Form of payment changed",
                  }),
                  error: "Xatolik yuz berdi",
                });
              }
            }}
          >
            {langFormat({ uz: "Ha", ru: "Да", en: "Yes" })}
          </Button>
        </Box>
      </Box>
    ));
  };
  return (
    <Box
      {...props}
      sx={{
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
        gap: "0.5rem",
      }}
    >
      <Typography sx={{ color: form === "Nasiya" ? "red" : "" }}>
        {form}
      </Typography>
      <Tooltip
        title={langFormat({
          uz: "Pul shaklini o`zgartirish",
          ru: "Изменить счет",
          en: "Change form of payment",
        })}
      >
        <IconButton onClick={handleUpdate}>
          <Refresh />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export const ProductNameCell: MRT_ColumnDef<Saled_Product>["Cell"] = ({
  row: { original: product },
}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <p>{product.name}</p>
        <IconButton onClick={() => setOpen(true)}>
          <Info />
        </IconButton>
        <Dialog
          onClose={() => setOpen(false)}
          open={open}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <ProductInfoDialogContainer productId={product.productId} />
        </Dialog>
      </Box>
    </>
  );
};
