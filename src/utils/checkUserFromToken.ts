import { LangFormat } from "@/models/types";
import { NextRequest, NextResponse } from "next/server";
import { getOrganizationIdFromUserToken } from "./getOrganizationIdFromUserToken";
import User from "@/models/userModel";

export const checkUserFromToken = async (request: NextRequest) => {
  try {
    const userId = await getOrganizationIdFromUserToken(request);

    const user = await User?.findById(userId).select("-password");

    if (!user) {
      //remove token
      const message: LangFormat = {
        uz: "Foydalanuvchi topilmadi",
        ru: "Пользователь не существует",
        en: "User does not exist",
      };
      const res = NextResponse.json({ error: message }, { status: 201 });
      res.cookies.set(process.env.USER_TOKEN_NAME!, "", {
        httpOnly: true,
        expires: new Date(0),
      });
      return res;
    }
  } catch (error) {
    console.log(error);
    const message: LangFormat = {
      uz: "Xatolik yuz berdi",
      ru: "Произошла ошибка",
      en: "An error occurred",
    };
    return NextResponse.json({ error: message }, { status: 201 });
  }
};
