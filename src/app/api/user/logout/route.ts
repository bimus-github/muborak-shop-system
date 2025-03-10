import { connect } from "@/database/config";
import { LangFormat } from "@/models/types";
import { NextResponse } from "next/server";

connect();

export async function POST() {
  try {
    const message: LangFormat = {
      uz: "Chiqish muvaffaqiyatli bajarildi",
      ru: "Вы вышли из аккаунта",
      en: "Logout successful",
    };
    const response = NextResponse.json({
      message: message,
      success: true,
    });
    response.cookies.set(process.env.USER_TOKEN_NAME!, "", {
      httpOnly: true,
      expires: new Date(0),
    });
    return response;
  } catch (error: any) {
    const message: LangFormat = {
      uz: "Nimadur xato: " + error.message,
      ru: "Произошла ошибка: " + error.message,
      en: "An error occurred: " + error.message,
    };
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
