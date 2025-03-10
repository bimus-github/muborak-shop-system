import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { LangFormat, USER_ROLE } from "./models/types";
import { getRoleFromUserToken } from "./utils/getRoleFromUserToken";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const role: USER_ROLE = await getRoleFromUserToken(request);

  const isPublicPath = path.includes("/auth/") || path === "/";
  const isApiPublicPath = path.includes("/api/user/");
  const isNotApiPublicPath = path.includes("/api/main/");

  const isSalerPath = path.includes("/main/sale") || path === "/" || path.includes("/main/profile");


  const token = request.cookies.get(process.env.USER_TOKEN_NAME!)?.value || "";

  if (isPublicPath && token) {
    if (path !== "/")
      return NextResponse.redirect(new URL("/main/sale", request.nextUrl));
  }

  if (!(isPublicPath || isApiPublicPath) && !token) {
    if (!isPublicPath)
      return NextResponse.redirect(new URL("/auth/login", request.nextUrl));
    if (!isApiPublicPath) {
      const message: LangFormat = {
        uz: "Ro'yhatdan o'tilmagan",
        ru: "Вы не авторизованы",
        en: "Unauthorized",
      };
      return NextResponse.json(
        { error: message, success: false },
        { status: 401 }
      );
    }
  }

  if (
    !isNotApiPublicPath &&
    !isApiPublicPath &&
    token &&
    !isSalerPath &&
    role !== USER_ROLE.ADMIN
  ) {
    return NextResponse.redirect(new URL("/main/sale", request.nextUrl));
  }
}

export const config = {
  matcher: [
    "/",
    "/main/:path*",
    "/auth/:path*",
    "/api/user/:path*",
    "/api/main/:path*",
  ],
};
