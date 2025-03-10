"use client";
import { MRT_Row } from "material-react-table";
import { SALE_FORM, Saled_Product } from "@/models/types";
import dayjs from "dayjs";

export const separateRowsByBuyer = (
  rows: Array<MRT_Row<Saled_Product>>
): Record<string, Array<MRT_Row<Saled_Product>>> => {
  return rows.reduce((acc, row) => {
    const buyerName = row.original.buyerName;
    if (!acc[buyerName]) {
      acc[buyerName] = [];
    }
    acc[buyerName].push(row);
    return acc;
  }, {} as Record<string, Array<MRT_Row<Saled_Product>>>);
};

export const sendSaleSms = (
  sales: Saled_Product[],
  buyerName: string,
  organizationName: string
) => {
  const textForBuyer = `
#savdo ${sales.map((sale) => ` #barcode_${sale.barcode} `)}

Do'kon: ${organizationName}


Mahsulotlar:
${sales.map(
  (sale, index) =>
    `\n\n${index + 1}) ${sale.name} - ${sale.quantity} X ${
      sale.saledPrice
    } so'm - ${
      sale.form === SALE_FORM.CASH ? "Naqd 🔵" : "Nasiya 🔴"
    } - ${dayjs(sale.saledDate ? sale.saledDate : sale.date).format(
      "DD.MM.YYYY HH:mm:ss"
    )}`
)}


Jami summa: ${sales.reduce(
    (sum, sale) =>
      sum + sale.saledPrice * sale.quantity * (1 - sale.discount / 100),
    0
  )} so'm
`;

  const textForAdmin = `
#savdo ${sales.map((sale) => ` #barcode_${sale.barcode} `)}

Haridor: ${buyerName}


Mahsulotlar:
${sales.map(
  (sale, index) =>
    `\n\n${index + 1}) ${sale.name} - ${sale.quantity} X ${
      sale.saledPrice
    } so'm - ${
      sale.form === SALE_FORM.CASH ? "Naqd 🔵" : "Nasiya 🔴"
    } - ${dayjs(sale.saledDate ? sale.saledDate : sale.date).format(
      "DD.MM.YYYY HH:mm:ss"
    )}`
)}


Jami summa: ${sales.reduce(
    (sum, sale) =>
      sum + sale.saledPrice * sale.quantity * (1 - sale.discount / 100),
    0
  )} so'm
`;
  return { textForBuyer, textForAdmin };
};

export const sendEditSaleSms = (
  sale: Saled_Product,
  buyerName: string,
  organizationName: string
) => {
  const textForBuyer = `
#ozgartirish #barcode_${sale.barcode}

Do'kon: ${organizationName}

O'ZGARTIRILDI ✍️:

Mahsulot: ${sale.name}
Narx: ${sale.saledPrice} so'm
Soni: ${sale.quantity} ta
Holat: ${sale.form === SALE_FORM.CASH ? "Naqd 🔵" : "Nasiya 🔴"}
Sotib Olingan Sana: ${dayjs(sale.saledDate ? sale.saledDate : sale.date).format(
    "DD.MM.YYYY HH:mm:ss"
  )}
O'zgartirildi: ${dayjs(sale.date).format("DD.MM.YYYY HH:mm:ss")}

Jami narx: ${sale.saledPrice * (1 - sale.discount / 100) * sale.quantity} so'm
`;

  const textForAdmin = `
#ozgartirish #barcode_${sale.barcode}

Haridor: ${buyerName}

O'ZGARTIRILDI ✍️:

Mahsulot: ${sale.name}
Narx: ${sale.saledPrice} so'm
Soni: ${sale.quantity} ta
Holat: ${sale.form === SALE_FORM.CASH ? "Naqd 🔵" : "Nasiya 🔴"}
Sotib Olingan Sana: ${dayjs(sale.saledDate ? sale.saledDate : sale.date).format(
    "DD.MM.YYYY HH:mm:ss"
  )}
O'zgartirildi: ${dayjs(sale.date).format("DD.MM.YYYY HH:mm:ss")}

Jami narx: ${sale.saledPrice * (1 - sale.discount / 100) * sale.quantity} so'm
`;
  return { textForBuyer, textForAdmin };
};

export const sendDeleteSaleSms = (
  sale: Saled_Product,
  buyerName: string,
  organizationName: string
) => {
  const textForBuyer = `
#savdo #barcode_${sale.barcode}

Do'kon: ${organizationName}

O'CHIRILDI ❌: 

Mahsulot: ${sale.name}
Narx: ${sale.saledPrice} so'm
Soni: ${sale.quantity} ta
Holat: O'CHIRILDI ❌
Sotib Olingan Sana: ${dayjs(sale.saledDate ? sale.saledDate : sale.date).format(
    "DD.MM.YYYY HH:mm:ss"
  )}
O'chirildi: ${dayjs(new Date()).format("DD.MM.YYYY HH:mm:ss")}

Jami narx: ${sale.saledPrice * (1 - sale.discount / 100) * sale.quantity} so'm
`;
  const textForAdmin = `
#savdo #barcode_${sale.barcode} 

Haridor: ${buyerName} 

O'CHIRILDI ❌:

Mahsulot: ${sale.name}
Narx: ${sale.saledPrice} so'm
Soni: ${sale.quantity} ta
Holat: O'CHIRILDI ❌
Sotib Olingan Sana: ${dayjs(sale.saledDate ? sale.saledDate : sale.date).format(
    "DD.MM.YYYY HH:mm:ss"
  )}
O'chirildi: ${dayjs(new Date()).format("DD.MM.YYYY HH:mm:ss")}

Jami narx: ${sale.saledPrice * (1 - sale.discount / 100) * sale.quantity} so'm
`;
  return { textForBuyer, textForAdmin };
};
