import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { LangFormat, User as User_Type } from "@/models/types";
import { connect } from "@/database/config";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { username, email, password, organizationId, role } =
      reqBody as User_Type;
    // console.log(reqBody);

    //check if user already exists
    const user = await User.findOne({ email });

    if (user) {
      const message: LangFormat = {
        uz: "Foydalanuvchi allaqachon qo'shilgan",
        ru: "Пользователь с таким email уже существует",
        en: "User with this email already exists",
      };
      return NextResponse.json({ error: message }, { status: 400 });
    }

    //hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = new User({
      username,
      email,
      organizationId,
      role,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    // console.log(savedUser);

    const message: LangFormat = {
      uz: "Foydalanuvchi muvaffaqiyatli qo'shildi. Iltimos biroz kuting",
      ru: "Пользователь успешно создан. Пожалуйста, подождите немного",
      en: "User created successfully. Please wait a moment",
    };

    return NextResponse.json({
      message,
      success: true,
      savedUser,
    });
  } catch (error: any) {
    console.log(error.message);

    if (error.code === 11000) {
      const message: LangFormat = {
        uz: "Foydalanuvchi allaqachon qo'shilgan",
        ru: "Пользователь с таким email уже существует",
        en: "User with this email already exists",
      };
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const message: LangFormat = {
      uz: `Xatolik yuz berdi: ${error.message}`,
      ru: `Произошла ошибка: ${error.message}`,
      en: `An error occurred: ${error.message}`,
    };
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
