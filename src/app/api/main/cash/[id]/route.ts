import { connect } from "@/database/config";
import cashModel from "@/models/cashModel";
import { LangFormat } from "@/models/types";
import { getOrganizationIdFromUserToken } from "@/utils/getOrganizationIdFromUserToken";
import { NextRequest, NextResponse } from "next/server";

connect();

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const userId = await getOrganizationIdFromUserToken(req);
    const id = params.id;
    const deletedCash = await cashModel.findByIdAndDelete({
      _id: id,
      userId: userId,
    });

    const message: LangFormat = {
      uz: "O'chirildi",
      ru: "Удалено",
      en: "Deleted",
    };

    return NextResponse.json(
      { data: deletedCash, success: true, message },
      { status: 201 }
    );
  } catch (error: any) {
    console.log(error);
    const message: LangFormat = {
      uz: `Xatolik yuz berdi: ${error.message}`,
      en: `An error occurred: ${error.message}`,
      ru: `Произошла ошибка: ${error.message}`,
    };

    return NextResponse.json({ message, success: false }, { status: 201 });
  }
};
