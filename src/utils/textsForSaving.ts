import { SALE_FORM, Saled_Product } from "@/models/types";
import { MRT_Row } from "material-react-table";
import { dateFormat } from "./dateFormat";

export const textSale = (companyName: string, sale: Saled_Product) => {
  // console.log(process.env.DOMAIN);

  return `
Do'kon: ${companyName ?? "BIMUS"}
      
Haridor: ${sale.buyerName}
Sana: ${new Date(sale.date).toLocaleDateString("uz-UZ", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })}
  
Mahsulot: ${sale.name}
Narx: ${sale.saledPrice} so'm
Soni: ${sale.quantity} ta
  
Jami narx: ${sale.saledPrice * (1 - sale.discount / 100) * sale.quantity} so'm

Do'konlarni aftomatlashtirish hizmati: ${process.env.NEXT_PUBLIC_AD_INFO}
`;
};

export const textMultiSale = (
  companyName: string,
  seperatedRows: Record<string, MRT_Row<Saled_Product>[]>,
  rows: MRT_Row<Saled_Product>[]
) => `
Do'kon: ${companyName || "BIMUS"}

${Object.values(seperatedRows).map(
  (rowsByBuer) => `
Haridor: ${rowsByBuer[0].original.buyerName}\n
Mahsulotlar:
${rowsByBuer
  .map(
    (row) =>
      `${row.original.name} - ${row.original.quantity} X ${
        row.original.saledPrice
      } so'm - ${
        row.original.discount ? row.original.discount + "% chegirma -" : ""
      }${
        row.original.form === SALE_FORM.CASH
          ? "Naqd"
          : row.original.form === SALE_FORM.CARD
          ? "Plastik"
          : "Nasiya"
      } - ${dateFormat(row.original.date)}\n`
  )
  .join("\n")}
Jami summa: ${rowsByBuer.reduce(
    (sum, row) =>
      sum +
      row.original.saledPrice *
        row.original.quantity *
        (1 - row.original.discount / 100),
    0
  )}

`
)}
${
  Object.values(seperatedRows).length >= 2
    ? `
Jami summa: ${rows.reduce(
        (sum, row) =>
          sum +
          row.original.saledPrice *
            row.original.quantity *
            (1 - row.original.discount / 100),
        0
      )}`
    : ""
}

Do'konlarni aftomatlashtirish hizmati: ${process.env.NEXT_PUBLIC_AD_INFO}
`;
