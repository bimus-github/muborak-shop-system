import { connect } from "@/database/config";
import productModel from "@/models/productModel";
import refundModel from "@/models/refundModel";
import { LangFormat, Refund } from "@/models/types";
import { getOrganizationIdFromUserToken } from "@/utils/getOrganizationIdFromUserToken";
import { NextRequest, NextResponse } from "next/server";

connect();

export const GET = async (req: NextRequest) => {
  try {
    const userId = await getOrganizationIdFromUserToken(req);
    const refunds = await refundModel
      .find({ userId: userId })
      .sort({ date: -1 })
      .lean();

    return NextResponse.json({ data: refunds }, { status: 201 });
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

export const POST = async (req: NextRequest) => {
  try {
    const userId = await getOrganizationIdFromUserToken(req);
    const refunds: Refund[] = await req.json();

    const savedRefund = [];

    for (let i = 0; i < refunds.length; i++) {
      const refund = refunds[i];

      await productModel.findOneAndUpdate(
        { _id: refund._id, userId: userId },
        { $inc: { count: -Number(refund.count) } }
      );

      refund.userId = userId;
      refund._id = undefined;
      const doc = await refundModel.create(refund);

      savedRefund.push(doc);
    }

    const message: LangFormat = {
      uz: "Qaytarildi",
      ru: "Возвращено",
      en: "Returned",
    };

    return NextResponse.json(
      { data: savedRefund, success: true, message },
      { status: 201 }
    );
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
