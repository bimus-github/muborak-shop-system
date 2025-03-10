import { jwtVerify } from "jose";
import { NextRequest } from "next/server";

const key = new TextEncoder().encode(process.env.TOKEN_SECRET!);

export const getOrganizationIdFromUserToken = async (request: NextRequest) => {
  try {
    const token =
      request.cookies.get(process.env.USER_TOKEN_NAME!)?.value || "";
    if (!token) return false;
    const decodedToken: any = await jwtVerify(token, key, {
      algorithms: ["HS256"],
    });

    return decodedToken.payload.organizationId;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
