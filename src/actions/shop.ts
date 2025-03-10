"use server";
import { connect } from "@/database/config";
import productModel from "@/models/productModel";
import shopModel from "@/models/shopModel";
import { LangFormat, Product, Shop } from "@/models/types";
import { getOrganizationIdFromToken } from "@/utils/getOrganizationIdFromCookies";

connect();

export const getShops = async (from: Date) => {
  try {
    const organizationId = await getOrganizationIdFromToken();
    const shopsDoc = await shopModel
      .find({
        userId: organizationId,
        date: { $gte: from },
      })
      .sort({ date: -1 });

    return { success: true, shops: JSON.stringify(shopsDoc) };
  } catch (error: any) {
    console.log(error.message);
  }
};

export const getShop = async (id: string) => {
  try {
    const organizationId = await getOrganizationIdFromToken();

    const shopDoc = await shopModel
      .findOne({ _id: id, userId: organizationId })
      .lean();

    return { success: true, shop: JSON.stringify(shopDoc) };
  } catch (error: any) {
    console.log(error.message);
  }
};

export const createShop = async (shop: Shop) => {
  try {
    const organizationId = await getOrganizationIdFromToken();

    const shopDoc = await shopModel.create({ ...shop, userId: organizationId });

    const message: LangFormat = {
      uz: "Qo'shildi",
      ru: "Добавлен",
      en: "Added",
    };
    return { success: true, shop: JSON.stringify(shopDoc), message };
  } catch (error: any) {
    console.log(error.message);
    const message: LangFormat = {
      uz: `Xatolik yuz berdi: ${error.message}`,
      ru: `Произошла ошибка: ${error.message}`,
      en: `An error occurred: ${error.message}`,
    };
    return { success: false, message };
  }
};

export const updateShop = async (shop: Shop) => {
  try {
    const organizationId = await getOrganizationIdFromToken();

    const shopDoc = await shopModel.findOneAndUpdate(
      { _id: shop._id, userId: organizationId },
      shop
    );

    const message: LangFormat = {
      uz: "O'zgartirildi",
      ru: "Изменено",
      en: "Updated",
    };
    return { success: true, shop: JSON.stringify(shopDoc), message };
  } catch (error: any) {
    console.log(error.message);
    const message: LangFormat = {
      uz: `Xatolik yuz berdi: ${error.message}`,
      ru: `Произошла ошибка: ${error.message}`,
      en: `An error occurred: ${error.message}`,
    };
    return { success: false, message };
  }
};

export const receiveProduct = async ({
  product,
  shopId,
}: {
  product: Product;
  shopId: string;
}) => {
  try {
    const organizationId = await getOrganizationIdFromToken();

    const productInStorage: Product | null = await productModel.findOne({
      _id: product._id,
      userId: organizationId,
    });

    if (!productInStorage) {
      const message: LangFormat = {
        uz: "Mahsulot ombordan topilmadi!",
        en: "Product not found in the warehouse!",
        ru: "Товар не найден в складе!",
      };
      return { message, success: false };
    }

    //  <<<<<<<< add product to shop >>>>>>>>
    const updatedShop = await shopModel.findOneAndUpdate(
      { _id: shopId, userId: organizationId },
      { $push: { products: product } }
    );

    // <<<<<<<< add product to storage >>>>>>>>
    const existingCount = +productInStorage.count;
    const existingCost = +productInStorage.cost;
    const commingCount = +product.count;
    const commingCost = +product.cost;

    product.count = existingCount + commingCount;
    product.cost =
      (existingCost * existingCount + commingCost * commingCount) /
      (existingCount + commingCount);
    product.price =
      product.price === 0 ? productInStorage.price : product.price;

    const savedProduct = await productModel.findOneAndUpdate(
      { _id: product._id, userId: organizationId },
      product
    );

    // console.log(updatedShop);
    // console.log("updatedShop: ", savedProduct?.shop?.products?.lenth);

    const message: LangFormat = {
      uz: "Mahsulot qo'shildi",
      en: "Product added",
      ru: "Продукт добавлен",
    };

    return {
      message,
      success: true,
      product: JSON.stringify(savedProduct),
      shop: JSON.stringify(
        updatedShop?.products?.find((product: any) =>
          product._id.equals(product._id)
        ) || {}
      ),
    };
  } catch (error: any) {
    console.log(error.message);
    const message: LangFormat = {
      uz: `Xatolik yuz berdi: ${error.message}`,
      ru: `Произошла ошибка: ${error.message}`,
      en: `An error occurred: ${error.message}`,
    };
    return { success: false, message };
  }
};

export const updateReceivedProduct = async ({
  product: updatedProduct,
  shopId,
}: {
  product: Product;
  shopId: string;
}) => {
  try {
    const organizationId = await getOrganizationIdFromToken();

    // <<<<<< find updated product >>>>>>
    const shop = await shopModel.findOne({
      _id: shopId,
      userId: organizationId,
    });

    const productInShop = shop?.products.find((product: any) =>
      product._id.equals(updatedProduct._id)
    );

    if (!productInShop) {
      const message: LangFormat = {
        uz: "Mahsulot do'kondan topilmadi!",
        en: "Product not found in the shop!",
        ru: "Товар не найден в магазине!",
      };
      return { message, success: false };
    }

    // <<<<<<< find product from storage >>>>>>
    const productInStorage: Product | null = await productModel.findOne({
      _id: updatedProduct._id,
      userId: organizationId,
    });

    if (!productInStorage) {
      const message: LangFormat = {
        uz: "Mahsulot ombordan topilmadi!",
        en: "Product not found in the warehouse!",
        ru: "Товар не найден в складе!",
      };
      return { message, success: false };
    }

    // <<<<<< update product in storage and shop >>>>>>
    const updatedProducts: Product[] = JSON.parse(
      JSON.stringify(shop)
    )?.products?.map((product: any) => {
      if (product._id.toString() === updatedProduct._id) {
        return updatedProduct;
      } else {
        return product;
      }
    });
    // console.log(JSON.stringify(updatedProducts));

    const updatedShop = await shopModel.findOneAndUpdate(
      { _id: shopId, userId: organizationId },
      { products: updatedProducts }
    );

    const existingCount = +productInStorage.count;
    const existingCost = +productInStorage.cost;
    const cameCount = +productInShop.count;
    const cameCost = +productInShop.cost;
    const updatedCount = +updatedProduct.count;
    const updatedCost = +updatedProduct.cost;

    productInStorage.count = existingCount - cameCount + updatedCount;
    productInStorage.cost =
      (existingCost * existingCount -
        cameCost * cameCount +
        updatedCost * updatedCount) /
      (existingCount + updatedCount - cameCount);

    const savedProduct = await productModel.findOneAndUpdate(
      { _id: updatedProduct._id, userId: organizationId },
      productInStorage
    );

    const message: LangFormat = {
      uz: "Yangilandi",
      en: "Updated",
      ru: "Обновлен",
    };

    return {
      message,
      success: true,
      product: JSON.stringify(savedProduct),
      shop: JSON.stringify(updatedShop),
    };
  } catch (error: any) {
    console.log(error.message);
    const message: LangFormat = {
      uz: `Xatolik yuz berdi: ${error.message}`,
      ru: `Произошла ошибка: ${error.message}`,
      en: `An error occurred: ${error.message}`,
    };
    return { success: false, message };
  }
};

export const deleteReceivedProduct = async ({
  product: deletedProduct,
  shopId,
}: {
  product: Product;
  shopId: string;
}) => {
  try {
    const organizationId = await getOrganizationIdFromToken();
    // <<<<<< find deleted product >>>>>>
    const ifExsits = await shopModel.findOne(
      { _id: shopId, userId: organizationId },
      {
        products: { $elemMatch: { _id: deletedProduct._id } },
      }
    );
    if (ifExsits) {
      const productId = deletedProduct._id;
      // <<<<<<< find product from storage >>>>>>
      const productInStorage: Product | null = await productModel.findOne({
        _id: productId,
        userId: organizationId,
      });

      if (!productInStorage) {
        const message: LangFormat = {
          uz: "Mahsulot ombordan topilmadi!",
          en: "Product not found in the warehouse!",
          ru: "Товар не найден в складе!",
        };
        return { message, success: false };
      }

      // <<<<<< delete product from shop >>>>>>
      const updatedShop = await shopModel.findOneAndUpdate(
        { _id: shopId, userId: organizationId },
        { $pull: { products: { _id: productId } } }
      );

      // <<<<<< update product in storage >>>>>>
      const existingCount = +productInStorage.count;
      const existingCost = +productInStorage.cost;
      const deletedCount = +deletedProduct.count;
      const deletedCost = +deletedProduct.cost;

      productInStorage.count =
        existingCount - deletedCount > 0 ? existingCount - deletedCount : 0;
      productInStorage.cost =
        (existingCost * existingCount - deletedCost * deletedCount) /
          (existingCount - deletedCount) || 0;

      const savedProduct = await productModel.findOneAndUpdate(
        { _id: productId, userId: organizationId },
        productInStorage
      );

      const message: LangFormat = {
        uz: "Ochirildi",
        en: "Deleted",
        ru: "Удален",
      };

      return {
        message,
        success: true,
        product: JSON.stringify(savedProduct),
        shop: JSON.stringify(updatedShop),
      };
    } else {
      const message: LangFormat = {
        uz: "Mahsulot ombordan topilmadi!",
        en: "Product not found in the warehouse!",
        ru: "Товар не найден в складе!",
      };
      return { message, success: false };
    }
  } catch (error: any) {
    console.log(error.message);
    const message: LangFormat = {
      uz: `Xatolik yuz berdi: ${error.message}`,
      ru: `Произошла ошибка: ${error.message}`,
      en: `An error occurred: ${error.message}`,
    };
    return { success: false, message };
  }
};
