import { connect } from "@/database/config";
import ProductModel from "@/models/productModel";
import { LangFormat, Product } from "@/models/types";
import { getOrganizationIdFromUserToken } from "@/utils/getOrganizationIdFromUserToken";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(req: NextRequest) {
  try {
    const userId = await getOrganizationIdFromUserToken(req);
    const product: Product = await req.json();

    product.userId = userId;
    // console.log(product);

    const savedProduct = await ProductModel.create(product);

    const message: LangFormat = {
      uz: "Mahsulot qo'shildi",
      en: "Product added",
      ru: "Продукт добавлен",
    };

    return NextResponse.json({
      message,
      success: true,
      savedProduct,
    });
  } catch (error: any) {
    if (error.code == 11000) {
      const message: LangFormat = {
        uz: "Bunday mahsulot allaqachon qo'shilgan",
        en: "This product already exists",
        ru: "Такой продукт уже существует",
      };
      return NextResponse.json({ message, success: false }, { status: 200 });
    }
    const message: LangFormat = {
      uz: `Xatolik yuz berdi: ${error.message}`,
      ru: `Произошла ошибка: ${error.message}`,
      en: `An error occurred: ${error.message}`,
    };
    console.log(error);
    return NextResponse.json({ message, success: false }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = await getOrganizationIdFromUserToken(request);

    const products = await ProductModel.find({ userId: userId }).lean();

    const message: LangFormat = {
      uz: "Mahsulotlar topildi",
      en: "Products found",
      ru: "Продукты найдены",
    };
    // console.log("products.length: " + products.length);
    return NextResponse.json({
      success: true,
      products,
      message,
    });
  } catch (error: any) {
    const message: LangFormat = {
      uz: `Xatolik yuz berdi: ${error.message}`,
      ru: `Произошла ошибка: ${error.message}`,
      en: `An error occurred: ${error.message}`,
    };
    // console.log(message);
    return NextResponse.json({ error: message }, { status: 200 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const userId = await getOrganizationIdFromUserToken(req);
    const product: Product = await req.json();

    const updatedProduct = await ProductModel.findOneAndReplace(
      {
        _id: product._id,
        userId: userId,
      },
      product
    );

    const message: LangFormat = {
      uz: "Mahsulot o'zgartirildi",
      en: "Product updated",
      ru: "Продукт обновлен",
    };

    return NextResponse.json({
      message,
      success: true,
      updatedProduct,
    });
  } catch (error: any) {
    if (error.code == 11000) {
      const message: LangFormat = {
        uz: "Bunday mahsulot allaqachon qo'shilgan",
        en: "This product already exists",
        ru: "Такой продукт уже существует",
      };
      return NextResponse.json({ message, success: false }, { status: 200 });
    }
    const message: LangFormat = {
      uz: `Xatolik yuz berdi: ${error.message}`,
      ru: `Произошла ошибка: ${error.message}`,
      en: `An error occurred: ${error.message}`,
    };
    console.log(error);
    return NextResponse.json({ message, success: false }, { status: 500 });
  }
}
export async function DELETE(req: NextRequest) {
  try {
    const userId = await getOrganizationIdFromUserToken(req);
    const { id: productId } = await req.json();

    // console.log(productId);

    const product = await ProductModel.findByIdAndDelete({
      _id: productId,
      userId: userId,
    });

    const message: LangFormat = {
      uz: "Mahsulot o'chirildi",
      en: "Product deleted",
      ru: "Продукт удален",
    };

    return NextResponse.json(
      { success: true, message, product },
      { status: 200 }
    );
  } catch (error: any) {
    const message: LangFormat = {
      uz: `Xatolik yuz berdi: ${error.message}`,
      ru: `Произошла ошибка: ${error.message}`,
      en: `An error occurred: ${error.message}`,
    };
    console.log(error);
    return NextResponse.json({ message, success: false }, { status: 200 });
  }
}
