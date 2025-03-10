import { connect } from "@/database/config";
import organizationModel from "@/models/organizationModel";
import { LangFormat } from "@/models/types";
import { getOrganizationIdFromUserToken } from "@/utils/getOrganizationIdFromUserToken";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function GET(req: NextRequest, { params }: any) {
  try {
    const organizationId = await getOrganizationIdFromUserToken(req);

    if (organizationId !== params.id) {
      const message: LangFormat = {
        uz: "Xatolik yuz berdi!",
        ru: "Произошла ошибка!",
        en: "An error occurred!",
      };

      return NextResponse.json({ error: message }, { status: 200 });
    }

    const organization = await organizationModel.findById(params.id);

    return NextResponse.json({ organization, success: true }, { status: 200 });
  } catch (error: any) {
    console.log(error.message);

    const message: LangFormat = {
      uz: `Xatolik yuz berdi: ${error.message}`,
      ru: `Произошла ошибка: ${error.message}`,
      en: `An error occurred: ${error.message}`,
    };
    return NextResponse.json({ error: message }, { status: 200 });
  }
}

export async function DELETE(req: NextRequest, { params }: any) {
  try {
    const organizationId = await getOrganizationIdFromUserToken(req);

    if (organizationId !== params.id) {
      const message: LangFormat = {
        uz: "Xatolik yuz berdi!",
        ru: "Произошла ошибка!",
        en: "An error occurred!",
      };

      return NextResponse.json({ error: message }, { status: 200 });
    }

    const organization = await organizationModel.findByIdAndDelete(params.id);
    return NextResponse.json({ organization, success: true }, { status: 200 });
  } catch (error: any) {
    console.log(error.message);

    const message: LangFormat = {
      uz: `Xatolik yuz berdi: ${error.message}`,
      ru: `Произошла ошибка: ${error.message}`,
      en: `An error occurred: ${error.message}`,
    };
    return NextResponse.json({ error: message }, { status: 200 });
  }
}
