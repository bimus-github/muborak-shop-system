import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const key = new TextEncoder().encode(process.env.TOKEN_SECRET!);

export const getOrganizationIdFromToken = async () => {
    const cookieStore = cookies();
    try {
      const token = cookieStore.get(process.env.USER_TOKEN_NAME!)?.value || "";
      if (!token) return false;
      const decodedToken: any = await jwtVerify(token, key, {
        algorithms: ["HS256"],
      });
  
      return decodedToken.payload.organizationId as string;
    } catch (error: any) {
      throw new Error(error.message);
    }
  };