// import { data } from "@/constants/data";
import { connect } from "@/database/config";
// import { getOrganizationIdFromUserToken } from "@/utils/getOrganizationIdFromUserToken";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(req: NextRequest) {
  try {
    // const organizationId = await getOrganizationIdFromUserToken(req);
    console.log("saving");

    // await shopModel.insertMany(shops);
    console.log("saved");

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.log(error);

    return NextResponse.json({ success: false });
  }
}
