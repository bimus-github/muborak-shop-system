import { connect } from "@/database/config";
import organizationModel from "@/models/organizationModel";
import { LangFormat, Organization } from "@/models/types";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(req: NextRequest) {
  try {
    const organization = await req.json();

    const newOragnization = await organizationModel.create(organization);

    const message: LangFormat = {
      uz: "Tashkilot muvaffaqiyatli qo'shildi",
      ru: "Организация успешно добавлена",
      en: "Organization successfully added",
    };

    return NextResponse.json(
      { organization: newOragnization, success: true, message },
      { status: 201 }
    );
  } catch (error: any) {
    console.log(error.message);

    if (error.code === 11000) {
      const message: LangFormat = {
        uz: "Bunday nom bilan tashkilot mavjud",
        ru: "Такая организация уже существует",
        en: "This organization already exists",
      };

      return NextResponse.json({ message }, { status: 201 });
    }

    const message: LangFormat = {
      uz: `Xatolik yuz berdi: ${error.message}`,
      ru: `Произошла ошибка: ${error.message}`,
      en: `An error occurred: ${error.message}`,
    };

    return NextResponse.json({ message }, { status: 201 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const organization = await req.json();
    const newOragnization = await organizationModel.findOneAndUpdate(
      { _id: organization._id },
      organization
    );

    const message: LangFormat = {
      uz: "Tashkilot muvaffaqiyatli o'zgartirildi",
      ru: "Организация успешно обновлена",
      en: "Organization successfully updated",
    };
    return NextResponse.json(
      { success: true, message, organization: newOragnization },
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
}
