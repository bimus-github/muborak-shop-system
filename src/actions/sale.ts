"use server";
import { connect } from "@/database/config";
import productModel from "@/models/productModel";
import saleModel from "@/models/saleModel";
import { LangFormat, Saled_Product } from "@/models/types";
import { getOrganizationIdFromToken } from "@/utils/getOrganizationIdFromCookies";
import mongoose from "mongoose";

connect();

export const getSales = async () => {
  try {
    const organizationId = await getOrganizationIdFromToken();

    const salesDoc = await saleModel
      .find({ userId: organizationId })
      .lean()
      .sort({ date: -1 });

    return { success: true, sales: JSON.stringify(salesDoc) };
  } catch (error: any) {
    console.log(error);
  }
};

export const getSalesFromDate = async (from: Date) => {
  try {
    const organizationId = await getOrganizationIdFromToken();
    const salesDoc = await saleModel
      .find({ userId: organizationId, date: { $gte: from } })
      .lean()
      .sort({ date: -1 });
    return { success: true, sales: JSON.stringify(salesDoc) };
  } catch (error: any) {
    console.log(error);
  }
};

export const saveSale = async (
  sales: Saled_Product[]
): Promise<{
  success: boolean;
  message: LangFormat;
}> => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const organizationId = await getOrganizationIdFromToken();

    // Prepare bulk operations
    const productUpdates = sales.map((sale) => ({
      updateOne: {
        filter: { _id: sale.productId, userId: organizationId },
        update: { $inc: { count: -sale.quantity } },
      },
    }));

    const salesInserts = sales.map((sale) => ({
      ...sale,
      userId: organizationId,
    }));

    // Execute operations within a transaction
    await productModel.bulkWrite(productUpdates, { session });
    await saleModel.insertMany(salesInserts, { session });

    await session.commitTransaction();
    const message: LangFormat = { uz: "Sotildi", ru: "Продано", en: "Sold" };
    return { success: true, message };
  } catch (error: any) {
    console.error("Error saving sale before endSession:", error);
    await session.abortTransaction();
    console.error("Error saving sale after endSession:", error);
    const message: LangFormat = {
      uz: "Xatolik yuz berdi: " + error.message,
      ru: "Произошла ошибка: " + error.message,
      en: "An error occurred: " + error.message,
    };

    return { success: false, message };
  } finally {
    console.log("Finally block: endSession");
    await session.endSession();
  }
};

export const updateSale = async (sale: Saled_Product) => {
  try {
    const organizationId = await getOrganizationIdFromToken();

    // <<<<<< update sale >>>>>>
    await saleModel.findOneAndReplace(
      { _id: sale._id, userId: organizationId },
      sale
    );

    const message: LangFormat = {
      uz: "O'zgartirildi",
      ru: "Изменено",
      en: "Updated",
    };

    return { success: true, message, sale: JSON.stringify(sale) };
  } catch (error: any) {
    const message: LangFormat = {
      uz: "Xatolik yuz berdi: " + error.message,
      ru: "Произошла ошибка: " + error.message,
      en: "An error occurred: " + error.message,
    };

    return { success: false, message };
  }
};

export const deleteSale = async (sale: Saled_Product) => {
  try {
    const organizationId = await getOrganizationIdFromToken();
    if (!sale._id) return;
    // <<<<<< delete sale >>>>>>
    await saleModel.deleteOne({ _id: sale._id, userId: organizationId });

    // <<<<<< update product count >>>>>>
    await productModel.updateOne(
      { _id: sale.productId, userId: organizationId },
      { $inc: { count: +sale.quantity } }
    );

    const message: LangFormat = {
      uz: "O'chirildi",
      ru: "Удалено",
      en: "Deleted",
    };

    return { success: true, message };
  } catch (error: any) {
    console.log(error);
    const message: LangFormat = {
      uz: "Xatolik yuz berdi: " + error.message,
      ru: "Произошла ошибка: " + error.message,
      en: "An error occurred: " + error.message,
    };

    return { success: false, message };
  }
};
