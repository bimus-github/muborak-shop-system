import { connect } from "@/database/config";
import buyerModel from "@/models/buyerModel";
import { LangFormat } from "@/models/types";
import { getOrganizationIdFromUserToken } from "@/utils/getOrganizationIdFromUserToken";
import { NextRequest, NextResponse } from "next/server";

connect();

export const DELETE = async (req: NextRequest, { params }: any) => {
  try {
    const userId = await getOrganizationIdFromUserToken(req);
    const buyerId = params.id;

    const deletedBuyer = await buyerModel.findOneAndDelete({
      _id: buyerId,
      userId: userId,
    });

    const message: LangFormat = {
      uz: "Buyer o'chirildi",
      en: "Buyer deleted",
      ru: "Покупатель удален",
    };

    return NextResponse.json(
      { buyer: deletedBuyer, success: true, message },
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
