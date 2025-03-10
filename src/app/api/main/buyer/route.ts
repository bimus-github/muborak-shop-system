import { connect } from "@/database/config";
import buyerModel from "@/models/buyerModel";
import { LangFormat } from "@/models/types";
import { getOrganizationIdFromUserToken } from "@/utils/getOrganizationIdFromUserToken";
import { NextRequest, NextResponse } from "next/server";

connect();

export const PUT = async (req: NextRequest) => {
  try {
    const userId = await getOrganizationIdFromUserToken(req);
    const buyer = await req.json();

    await buyerModel.findOneAndUpdate(
      { _id: buyer._id, userId: userId },
      buyer
    );

    const message: LangFormat = {
      uz: "Buyer o'zgartirildi",
      en: "Buyer updated",
      ru: "Покупатель обновлен",
    };

    return NextResponse.json({ success: true, message }, { status: 201 });
  } catch (error: any) {
    console.log(error.message);

    if (error.code === 11000) {
      const message: LangFormat = {
        uz: "Haridor Mavjud",
        en: "Buyer already exists",
        ru: "Покупатель уже существует",
      };

      return NextResponse.json({ message }, { status: 201 });
    }

    const message: LangFormat = {
      uz: `Xatolik yuz berdi: ${error.message}`,
      ru: `Произошла ошибка: ${error.message}`,
      en: `An error occurred: ${error.message}`,
    };

    return NextResponse.json({ message }, { status: 201 });
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const userId = await getOrganizationIdFromUserToken(req);
    const buyer = await req.json();

    buyer.userId = userId;

    const savedBuyer = await buyerModel.create(buyer);
    const message: LangFormat = {
      uz: "Haridor qo'shildi",
      en: "Buyer added",
      ru: "Покупатель добавлен",
    };

    return NextResponse.json(
      { success: true, savedBuyer, message },
      { status: 201 }
    );
  } catch (error: any) {
    console.log(error.message);

    if (error.code === 11000) {
      const message: LangFormat = {
        uz: "Haridor Mavjud",
        en: "Buyer already exists",
        ru: "Покупатель уже существует",
      };

      return NextResponse.json({ message }, { status: 201 });
    }

    const message: LangFormat = {
      uz: `Xatolik yuz berdi: ${error.message}`,
      ru: `Произошла ошибка: ${error.message}`,
      en: `An error occurred: ${error.message}`,
    };

    return NextResponse.json({ message }, { status: 201 });
  }
};

export const GET = async (req: NextRequest) => {
  try {
    const userId = await getOrganizationIdFromUserToken(req);
    const buyers = await buyerModel.find({ userId: userId }).lean();

    return NextResponse.json({ buyers, success: true }, { status: 201 });
  } catch (error: any) {
    console.log(error.message);
    const message: LangFormat = {
      uz: `Xatolik yuz berdi: ${error.message}`,
      ru: `Произошла ошибка: ${error.message}`,
      en: `An error occurred: ${error.message}`,
    };

    return NextResponse.json({ message }, { status: 201 });
  }
};
