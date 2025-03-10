import { connect } from "@/database/config";
import productModel from "@/models/productModel";
import refundModel from "@/models/refundModel";
import { LangFormat } from "@/models/types";
import { getOrganizationIdFromUserToken } from "@/utils/getOrganizationIdFromUserToken";
import { NextRequest, NextResponse } from "next/server";

connect();

export const DELETE = async (req: NextRequest, { params }: any) => {
  try {
    const userId = await getOrganizationIdFromUserToken(req);
    const refundId = params.id;

    const deletedRefund = await refundModel.findOneAndDelete({
      _id: refundId,
      userId: userId,
    });

    await productModel.findOneAndUpdate(
      { name: deletedRefund?.name, userId: userId },
      { $inc: { count: +deletedRefund?.count || 0 } }
    );

    const message: LangFormat = {
      uz: "O'chirildi",
      ru: "Удалено",
      en: "Deleted",
    };
    return NextResponse.json(
      { data: deletedRefund, success: true, message },
      {
        status: 201,
      }
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
