import { connect } from "@/database/config";
import shopModel from "@/models/shopModel";
import { LangFormat } from "@/models/types";
import { getOrganizationIdFromUserToken } from "@/utils/getOrganizationIdFromUserToken";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function GET(req: NextRequest) {
  try {
    const userId = await getOrganizationIdFromUserToken(req);
    const shops = await shopModel
      .find({ userId: userId })
      .sort({ date: -1 })
      .lean();
    return NextResponse.json({ success: true, shops }, { status: 201 });
  } catch (error: any) {
    const message: LangFormat = {
      uz: `Xatolik yuz berdi: ${error.message}`,
      ru: `Произошла ошибка: ${error.message}`,
      en: `An error occurred: ${error.message}`,
    };

    return NextResponse.json({ message }, { status: 201 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getOrganizationIdFromUserToken(req);
    const shop = await req.json();

    shop.userId = userId;
    const message: LangFormat = {
      uz: "Do'kon qo'shildi",
      en: "Shop added",
      ru: "Магазин добавлен",
    };
    const savedShop = await shopModel.create(shop);
    return NextResponse.json(
      { success: true, savedShop, message },
      { status: 201 }
    );
  } catch (error: any) {
    const message: LangFormat = {
      uz: `Xatolik yuz berdi: ${error.message}`,
      ru: `Произошла ошибка: ${error.message}`,
      en: `An error occurred: ${error.message}`,
    };
    console.log("error while creating shop", error);

    return NextResponse.json({ message }, { status: 201 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const userId = await getOrganizationIdFromUserToken(req);
    const shop = await req.json();

    const updatedShop = await shopModel.findOneAndReplace(
      {
        _id: shop._id,
        userId: userId,
      },
      shop
    );

    const message: LangFormat = {
      uz: "Do'kon o'zgartirildi",
      en: "Shop updated",
      ru: "Магазин обновлен",
    };

    return NextResponse.json({ success: true, updatedShop, message });
  } catch (error: any) {
    const message: LangFormat = {
      uz: `Xatolik yuz berdi: ${error.message}`,
      ru: `Произошла ошибка: ${error.message}`,
      en: `An error occurred: ${error.message}`,
    };
    console.log("error while updating shop", error);
    return NextResponse.json({ message }, { status: 201 });
  }
}
