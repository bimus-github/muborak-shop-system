import { getProductHistory } from "@/actions/product";
import { SALE_FORM } from "@/models/types";
import {
  IconButton,
  DialogContent,
  ListItemText,
  ListItem,
  Box,
  CircularProgress,
  List,
  Typography,
  Tooltip,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { memo, useMemo } from "react";
import AccordionComponent from "./accordion";
import { dateFormat } from "@/utils/dateFormat";
import { CopyAll, Refresh } from "@mui/icons-material";
import toast from "react-hot-toast";
import { decreaseByPercent } from "@/utils/calcs";

export const ProductInfoDialogContainer: React.FC<{ productId: string }> = memo(
  ({ productId }) => {
    const {
      data: productHistory,
      isLoading: fetchingProductHistory,
      refetch,
    } = useQuery({
      queryKey: ["product-history", productId],
      queryFn: () =>
        getProductHistory(productId).then((result) => {
          console.log(productId);
          if (result[0] === "") {
            return result[1];
          } else {
            return result[0];
          }
        }),
    });

    const totalSold = useMemo(() => {
      if (!productHistory || typeof productHistory === "string")
        return { quantity: 0, totalSoldAmount: "0", totalProfit: "0" };
      return {
        quantity: productHistory.sales.reduce(
          (sum, sale) => sum + sale.quantity,
          0
        ),
        totalSoldAmount: productHistory.sales
          .reduce(
            (sum, sale) =>
              sum +
              decreaseByPercent(sale.saledPrice, sale.discount) * sale.quantity,
            0
          )
          .toLocaleString("ru-RU"),
        totalProfit: productHistory.sales
          .reduce(
            (sum, sale) =>
              sum +
              (decreaseByPercent(sale.saledPrice, sale.discount) - sale.cost) *
                sale.quantity,
            0
          )
          .toLocaleString("ru-RU"),
      };
    }, [productHistory]);

    const totalBrought = useMemo(() => {
      if (!productHistory || typeof productHistory === "string")
        return { quantity: 0, totalBroughtAmount: "0" };
      return {
        quantity: productHistory.shops.reduce(
          (sum, shop) =>
            sum +
            (shop.products.find(
              (p) => p.barcode === productHistory.product?.barcode
            )?.count ?? 0),
          0
        ),
        totalBroughtAmount: productHistory.shops
          .reduce((sum, shop) => {
            const shopProduct = shop.products.find(
              (p) => p.barcode === productHistory.product?.barcode
            );
            return sum + (shopProduct?.count ?? 0) * (shopProduct?.cost ?? 0);
          }, 0)
          .toLocaleString("ru-RU"),
      };
    }, [productHistory]);

    if (fetchingProductHistory) {
      return (
        <Box sx={{ p: 5 }}>
          <CircularProgress color="inherit" />
        </Box>
      );
    }

    if (!productHistory || typeof productHistory === "string") {
      return (
        <Box>
          <Typography color={"red"}>
            {productHistory || "Product not found"}
          </Typography>
        </Box>
      );
    }

    const { product, sales, shops } = productHistory;

    return (
      <>
        <Box sx={{ alignItems: "center", display: "flex", m: 1, px: 1 }}>
          <Typography variant="overline">
            Mahsulot haqida ma'lumotlar: {product.name} ({product.barcode})
          </Typography>
          <IconButton
            sx={{ ml: 1 }}
            onClick={() => {
              toast.success("Saqlandi");
              navigator.clipboard.writeText(
                `${product.name} (${product.barcode})`
              );
            }}
          >
            <CopyAll />
          </IconButton>
          <IconButton sx={{ ml: 1 }} onClick={() => refetch()}>
            <Refresh />
          </IconButton>
        </Box>
        <DialogContent sx={{ width: 600 }}>
          {/* info of product based on storage */}
          <AccordionComponent
            defaultExpanded
            title="Mahsulotni Ombordagi holati boyicha"
          >
            <List sx={{ width: "100%" }} dense>
              <ListItem
                key={product.name}
                disableGutters
                secondaryAction={<ListItemText primary={product.name} />}
              >
                <ListItemText
                  primaryTypographyProps={{ fontWeight: "bold" }}
                  primary={"Nomi:"}
                />
              </ListItem>
              <ListItem
                key={product.barcode}
                disableGutters
                secondaryAction={<ListItemText primary={product.barcode} />}
              >
                <ListItemText
                  primaryTypographyProps={{ fontWeight: "bold" }}
                  primary={"Barkod:"}
                />
              </ListItem>
              <ListItem
                key={product.barcode}
                disableGutters
                secondaryAction={
                  <ListItemText
                    primaryTypographyProps={{
                      color:
                        product.count ===
                        totalBrought.quantity - totalSold.quantity
                          ? ""
                          : "red",
                    }}
                    primary={product.count + " ta"}
                  />
                }
              >
                <ListItemText
                  primaryTypographyProps={{ fontWeight: "bold" }}
                  primary={"Mavjud:"}
                />
              </ListItem>
              <ListItem
                key={product.price}
                disableGutters
                secondaryAction={
                  <ListItemText primary={product.price + " so'm"} />
                }
              >
                <ListItemText
                  primaryTypographyProps={{ fontWeight: "bold" }}
                  primary={"Sotuvdagi narxi:"}
                />
              </ListItem>
              <ListItem
                key={"all profit"}
                disableGutters
                secondaryAction={
                  <ListItemText primary={totalSold.totalProfit + " s'om"} />
                }
              >
                <ListItemText
                  primaryTypographyProps={{ fontWeight: "bold" }}
                  primary={"Ushbu mahsulotdan topilgan foyda:"}
                />
              </ListItem>
            </List>
          </AccordionComponent>

          {/* history of product where saled */}
          <AccordionComponent
            title="Mahsulotni sotilish tarihi"
            describtion={`Jami: ${totalSold.quantity} dona (${totalSold.totalSoldAmount} so'm) sotilgan`}
          >
            <List sx={{ width: "100%" }} dense>
              {sales.map((sale) => (
                <ListItem
                  key={sale._id}
                  disableGutters
                  secondaryAction={
                    <ListItemText
                      primary={`${sale.quantity} ta (${decreaseByPercent(
                        sale.saledPrice,
                        sale.discount
                      )} so'm)`}
                      secondary={dateFormat(sale.date)}
                      secondaryTypographyProps={{
                        color: sale.form === SALE_FORM.LOAN ? "red" : "inherit",
                      }}
                    />
                  }
                >
                  <ListItemText
                    primaryTypographyProps={{ fontWeight: "bold" }}
                    secondaryTypographyProps={{
                      color: sale.form === SALE_FORM.LOAN ? "red" : "inherit",
                    }}
                    primary={sale.buyerName || "Boshqa Haridor"}
                    secondary={
                      sale.form === SALE_FORM.CASH
                        ? "Naqd"
                        : sale.form === SALE_FORM.CARD
                        ? "Plastik"
                        : "Nasiya"
                    }
                  />
                </ListItem>
              ))}
            </List>
          </AccordionComponent>

          {/* histpry of product based on where and when to be brought */}
          <AccordionComponent
            title="Mahsulotni olib kelingan joylari"
            describtion={`Jami: ${totalBrought.quantity} ta (${totalBrought.totalBroughtAmount} so'm) olib kelingan`}
          >
            <List sx={{ width: "100%" }} dense>
              {shops.map((shop) => (
                <ListItem
                  key={shop._id}
                  disableGutters
                  secondaryAction={(() => {
                    const shopProduct = shop.products.find(
                      (p) => p.barcode === product?.barcode
                    );

                    return (
                      <ListItemText
                        primary={shopProduct?.count + " ta"}
                        secondary={shopProduct?.cost + " so'm"}
                      />
                    );
                  })()}
                >
                  <ListItemText
                    primaryTypographyProps={{ fontWeight: "bold" }}
                    secondaryTypographyProps={{ color: "inherit" }}
                    primary={(() => {
                      return (
                        <Tooltip title="Do'konni ochish">
                          <a
                            href={`/main/shop/${shop._id}`}
                            // open in new tab
                            target="_blank"
                            rel="noreferrer"
                          >
                            {shop.name}
                          </a>
                        </Tooltip>
                      );
                    })()}
                    secondary={dateFormat(shop.date)}
                  />
                </ListItem>
              ))}
            </List>
          </AccordionComponent>
        </DialogContent>
      </>
    );
  }
);
