import { connect } from "@/database/config";
import { LangFormat } from "@/models/types";
import userModel from "@/models/userModel";
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

    const users = await userModel.find({ organizationId: params.id });

    return NextResponse.json({ users, success: true }, { status: 200 });
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
