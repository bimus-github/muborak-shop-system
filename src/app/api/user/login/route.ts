import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import User from "@/models/userModel";
import { LangFormat } from "@/models/types";
import { connect } from "@/database/config";
import { SignJWT } from "jose";

connect();

const key = new TextEncoder().encode(process.env.TOKEN_SECRET!);

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;
    // console.log(reqBody);

    //check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      const message: LangFormat = {
        uz: "Foydalanuvchi topilmadi",
        ru: "Пользователь не существует",
        en: "User does not exist",
      };
      return NextResponse.json({ error: message }, { status: 400 });
    }

    //check if password is correct
    const validPassword = await bcryptjs.compare(password, user.password);
    if (!validPassword) {
      const message: LangFormat = {
        uz: "Parol noto'g'ri",
        ru: "Неверный пароль",
        en: "Incorrect password",
      };
      return NextResponse.json({ error: message }, { status: 400 });
    }

    //create token data
    const tokenData = {
      organizationId: user.organizationId,
      role: user.role,
      userId: user._id,
    };
    //create token
    const token = await new SignJWT(tokenData)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("30 days from now")
      .sign(key);

    const message: LangFormat = {
      uz: "Tabriklaymiz. Tizimga kirdi. Iltimos biroz kuting",
      ru: "Благодарим. Вы вошли. Пожалуйста, подождите немного",
      en: "Congratulations. You have logged in. Please wait a moment",
    };
    const response = NextResponse.json({
      message: message,
      success: true,
    });
    response.cookies.set(process.env.USER_TOKEN_NAME!, token, {
      httpOnly: true,
    });
    return response;
  } catch (error: any) {
    const message: LangFormat = {
      uz: `Xatolik yuz berdi: ${error.message}`,
      ru: `Произошла ошибка: ${error.message}`,
      en: `An error occurred: ${error.message}`,
    };
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
