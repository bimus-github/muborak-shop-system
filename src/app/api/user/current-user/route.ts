import { connect } from "@/database/config";
import { LangFormat } from "@/models/types";
import User from "@/models/userModel";
import { getOrganizationIdFromUserToken } from "@/utils/getOrganizationIdFromUserToken";
import { getUserIdFromUserToken } from "@/utils/getUserIdFromUserToken";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function GET(request: NextRequest) {
  try {
    const organizationId = await getOrganizationIdFromUserToken(request);
    const userId = await getUserIdFromUserToken(request);

    const user = await User.findOne({ organizationId, _id: userId }).select(
      "-password"
    );

    if (!user) {
      const message: LangFormat = {
        uz: "Foydalanuvchi topilmadi",
        ru: "Пользователь не существует",
        en: "User does not exist",
      };
      return NextResponse.json({ error: message }, { status: 400 });
    }

    return NextResponse.json({ user, success: true }, { status: 200 });
  } catch (error: any) {
    const message: LangFormat = {
      uz: "Nimadur xate: " + error.message,
      ru: "Произошла ошибка: " + error.message,
      en: "An error occurred: " + error.message,
    };

    console.log(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
