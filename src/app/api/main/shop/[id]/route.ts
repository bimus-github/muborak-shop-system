import { LangFormat, Product, Shop } from "@/models/types";
import { NextRequest, NextResponse } from "next/server";

import { getOrganizationIdFromUserToken } from "@/utils/getOrganizationIdFromUserToken";
import { connect } from "@/database/config";
import shopModel from "@/models/shopModel";
import productModel from "@/models/productModel";

connect();

export const GET = async (req: NextRequest, { params }: any) => {
  try {
    const userId = await getOrganizationIdFromUserToken(req);
    const shopId = params.id;

    const shop = await shopModel
      .findOne({
        _id: shopId,
        userId: userId,
      })
      .lean();

    // console.log(shop);

    return NextResponse.json({ success: true, shop }, { status: 200 });
  } catch (error: any) {
    const message: LangFormat = {
      uz: `Xatolik yuz berdi: ${error.message}`,
      ru: `Произошла ошибка: ${error.message}`,
      en: `An error occurred: ${error.message}`,
    };
    // console.log(error);
    return NextResponse.json({ message, success: false }, { status: 201 });
  }
};

export const POST = async (req: NextRequest, { params }: any) => {
  try {
    const userId = await getOrganizationIdFromUserToken(req);
    const shopId = params.id;
    const product: Product = await req.json();

    const productInStorage: Product | null = await productModel.findOne({
      _id: product._id,
      userId: userId,
    });

    if (!productInStorage) {
      const message: LangFormat = {
        uz: "Mahsulot ombordan topilmadi!",
        en: "Product not found in the warehouse!",
        ru: "Товар не найден в складе!",
      };

      return NextResponse.json({ message, success: false }, { status: 201 });
    }

    //  <<<<<<<< add product to shop >>>>>>>>
    const updatedShop = await shopModel.updateOne(
      { _id: shopId, userId: userId },
      {
        $push: {
          products: product,
        },
      }
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
      { _id: product._id, userId: userId },
      product
    );

    // console.log(updatedShop);
    // console.log("updatedShop: ", savedProduct?.shop?.products?.lenth);

    const message: LangFormat = {
      uz: "Mahsulot qo'shildi",
      en: "Product added",
      ru: "Продукт добавлен",
    };
    return NextResponse.json(
      { success: true, result: { savedProduct, updatedShop }, message },
      { status: 201 }
    );
  } catch (error: any) {
    const message: LangFormat = {
      uz: `Xatolik yuz berdi: ${error.message}`,
      ru: `Произошла ошибка: ${error.message}`,
      en: `An error occurred: ${error.message}`,
    };
    console.log(error);

    return NextResponse.json({ message, success: false }, { status: 201 });
  }
};

export const PUT = async (req: NextRequest, { params }: any) => {
  try {
    const userId = await getOrganizationIdFromUserToken(req);
    const shopId = params.id;
    const updatedProduct: Product = await req.json();
    console.log(updatedProduct);

    // <<<<<< find updated product >>>>>>
    const shop = await shopModel.findOne({
      _id: shopId,
      userId: userId,
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

      return NextResponse.json({ message, success: false }, { status: 201 });
    }

    // <<<<<<< find product from storage >>>>>>
    const productInStorage: Product | null = await productModel.findOne({
      _id: updatedProduct._id,
      userId: userId,
    });

    if (!productInStorage) {
      const message: LangFormat = {
        uz: "Mahsulot ombordan topilmadi!",
        en: "Product not found in the warehouse!",
        ru: "Товар не найден в складе!",
      };

      return NextResponse.json({ message, success: false }, { status: 201 });
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

    console.log(JSON.stringify(updatedProducts));

    const updatedShop = await shopModel.findOneAndUpdate(
      { _id: shopId, userId: userId },
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
      { _id: updatedProduct._id, userId: userId },
      productInStorage
    );

    const message: LangFormat = {
      uz: "Yangilandi",
      en: "Updated",
      ru: "Обновлен",
    };

    return NextResponse.json(
      { success: true, data: { savedProduct, updatedShop }, message },
      { status: 201 }
    );
  } catch (error: any) {
    const message: LangFormat = {
      uz: `Xatolik yuz berdi: ${error.message}`,
      ru: `Произошла ошибка: ${error.message}`,
      en: `An error occurred: ${error.message}`,
    };
    console.log(error);

    return NextResponse.json({ message, success: false }, { status: 201 });
  }
};

export const DELETE = async (req: NextRequest, { params }: any) => {
  try {
    const userId = await getOrganizationIdFromUserToken(req);
    const shopId = params.id;
    const { productId } = await req.json();

    // <<<<<< find deleted product >>>>>>
    const shop: Shop | null = await shopModel.findOne({
      _id: shopId,
      userId: userId,
    });
    const deletedProduct = shop?.products.find((product: any) =>
      product._id?.equals(productId)
    );

    if (!deletedProduct) {
      const message: LangFormat = {
        uz: "Mahsulot do'kondan topilmadi!",
        en: "Product not found in the shop!",
        ru: "Товар не найден в магазине!",
      };

      return NextResponse.json({ message, success: false }, { status: 201 });
    }

    // <<<<<<< find product from storage >>>>>>
    const productInStorage: Product | null = await productModel.findOne({
      _id: productId,
      userId: userId,
    });

    if (!productInStorage) {
      const message: LangFormat = {
        uz: "Mahsulot ombordan topilmadi!",
        en: "Product not found in the warehouse!",
        ru: "Товар не найден в складе!",
      };

      return NextResponse.json({ message, success: false }, { status: 201 });
    }

    // <<<<<< delete product from shop >>>>>>
    const updatedShop = await shopModel.updateOne(
      { _id: shopId, userId: userId },
      {
        $pull: {
          products: {
            _id: productId,
          },
        },
      }
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
      { _id: productId, userId: userId },
      productInStorage
    );

    const message: LangFormat = {
      uz: "Ochirildi",
      en: "Deleted",
      ru: "Удален",
    };

    return NextResponse.json(
      { success: true, data: { savedProduct, updatedShop }, message },
      { status: 201 }
    );
  } catch (error: any) {
    const message: LangFormat = {
      uz: `Xatolik yuz berdi: ${error.message}`,
      ru: `Произошла ошибка: ${error.message}`,
      en: `An error occurred: ${error.message}`,
    };
    console.log(error);

    return NextResponse.json({ message, success: false }, { status: 201 });
  }
};
