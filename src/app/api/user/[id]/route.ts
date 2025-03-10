import { connect } from "@/database/config";
import { LangFormat } from "@/models/types";
import userModel from "@/models/userModel";
import { getOrganizationIdFromUserToken } from "@/utils/getOrganizationIdFromUserToken";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const organizationId = await getOrganizationIdFromUserToken(req);
    const userId = params.id;

    const user = await userModel.findOne({ _id: userId, organizationId });

    return NextResponse.json({ user, success: true }, { status: 200 });
  } catch (error: any) {
    const message: LangFormat = {
      uz: `Xatolik yuz berdi: ${error.message}`,
      ru: `Произошла ошибка: ${error.message}`,
      en: `An error occurred: ${error.message}`,
    };
    console.log(error);
    return NextResponse.json({ error: message }, { status: 205 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const organizationId = await getOrganizationIdFromUserToken(req);
    const userId = params.id;
    const updatedUser = await req.json();

    const user = await userModel.findOneAndUpdate(
      { _id: userId, organizationId },
      updatedUser
    );

    const message: LangFormat = {
      uz: "O'zgartirildi",
      ru: "Изменено",
      en: "Updated",
    };

    return NextResponse.json({ user, success: true, message }, { status: 200 });
  } catch (error: any) {
    console.log(error.message);

    const message: LangFormat = {
      uz: `Xatolik yuz berdi: ${error.message}`,
      ru: `Произошла ошибка: ${error.message}`,
      en: `An error occurred: ${error.message}`,
    };

    return NextResponse.json({ error: message }, { status: 205 });
  }
}

export async function DELETE(req: NextRequest, { params }: any) {
  try {
    const organizationId = await getOrganizationIdFromUserToken(req);
    const userId = params.id;

    const deletedUser = await userModel.findOneAndDelete({
      _id: userId,
      organizationId,
    });

    const message: LangFormat = {
      uz: "O'chirildi",
      ru: "Удалено",
      en: "Deleted",
    };

    return NextResponse.json(
      { user: deletedUser, success: true, message },
      { status: 200 }
    );
  } catch (error: any) {
    console.log(error.message);
    const message: LangFormat = {
      uz: `Xatolik yuz berdi: ${error.message}`,
      ru: `Произошла ошибка: ${error.message}`,
      en: `An error occurred: ${error.message}`,
    };

    return NextResponse.json({ error: message }, { status: 205 });
  }
}
