import { connect } from "@/database/config";
import cashModel from "@/models/cashModel";
import { LangFormat } from "@/models/types";
import { getOrganizationIdFromUserToken } from "@/utils/getOrganizationIdFromUserToken";
import { NextRequest, NextResponse } from "next/server";

connect();

export const GET = async (req: NextRequest) => {
  try {
    const userId = await getOrganizationIdFromUserToken(req);

    const cashes = await cashModel.find({ userId: userId }).lean();

    // console.log(cashes);

    return NextResponse.json({ data: cashes }, { status: 201 });
  } catch (error: any) {
    console.log(error.message);

    const message: LangFormat = {
      uz: "Xatolik yuz berdi: " + error.message,
      ru: "Произошла ошибка: " + error.message,
      en: "An error occurred: " + error.message,
    };
    return NextResponse.json({ message }, { status: 201 });
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const userId = await getOrganizationIdFromUserToken(req);
    const cash = await req.json();

    cash.userId = userId;

    await cashModel.create(cash);

    const message: LangFormat = {
      uz: "Qo'shildi",
      ru: "Добавлен",
      en: "Added",
    };

    return NextResponse.json({ success: true, message }, { status: 201 });
  } catch (error: any) {
    console.log(error.message);

    const message: LangFormat = {
      uz: "Xatolik yuz berdi: " + error.message,
      ru: "Произошла ошибка: " + error.message,
      en: "An error occurred: " + error.message,
    };
    return NextResponse.json({ message }, { status: 201 });
  }
};

export const PUT = async (req: NextRequest) => {
  try {
    const userId = await getOrganizationIdFromUserToken(req);
    const cash = await req.json();

    await cashModel.updateOne({ _id: cash._id, userId: userId }, cash);

    const message: LangFormat = {
      uz: "O'zgartirildi",
      ru: "Изменено",
      en: "Updated",
    };

    return NextResponse.json({ success: true, message }, { status: 201 });
  } catch (error: any) {
    console.log(error.message);

    const message: LangFormat = {
      uz: "Xatolik yuz berdi: " + error.message,
      ru: "Произошла ошибка: " + error.message,
      en: "An error occurred: " + error.message,
    };

    return NextResponse.json({ message }, { status: 201 });
  }
};
