"use server";
import { connect } from "@/database/config";
import productModel from "@/models/productModel";
import { getOrganizationIdFromToken } from "@/utils/getOrganizationIdFromCookies";
import { products } from "./data";
import shopModel from "@/models/shopModel";
import { Product, Saled_Product, Shop } from "@/models/types";
import saleModel from "@/models/saleModel";

connect();

export const createProducts = async () => {
  try {
    const organizationId = await getOrganizationIdFromToken();

    if (!organizationId) {
      return false;
    }

    const newProducts = await productModel.insertMany(
      products.map((product) => ({
        userId: organizationId,
        count: 0,
        cost: 0,
        price: 0,
        quantityPerBox: 0,
        barcode: product.barcode.toString(),
        name: product.name,
        minimumCount: product.minimumCount || 0,
        qrCodes: product.qrCodes,
      }))
    );

    return newProducts;
  } catch (error: any) {
    console.log(error);
    return false;
  }
};

export const getProductHistory = async (
  id: string
): Promise<
  | [string]
  | [
      "",
      {
        product: Product;
        shops: Shop[];
        sales: Saled_Product[];
      }
    ]
> => {
  try {
    const organizationId = await getOrganizationIdFromToken();

    if (!organizationId) {
      return ["Tashkilot topilmadi"];
    }

    const product = await productModel.findById<Product>(id);

    if (!product) {
      return ["Mahsulot topilmadi"];
    }
    const shops = await shopModel
      .find({ "products.barcode": product.barcode })
      .sort({ date: -1 })
      .lean();

    const sales = await saleModel
      .find({ productId: id })
      .sort({
        date: -1,
      })
      .lean();

    return [
      "",
      {
        product: JSON.parse(JSON.stringify(product)) as Product,
        shops: JSON.parse(JSON.stringify(shops)) as Shop[],
        sales: JSON.parse(JSON.stringify(sales)) as Saled_Product[],
      },
    ];
  } catch (error: any) {
    console.log(error);
    return ["Xatolik"];
  }
};
