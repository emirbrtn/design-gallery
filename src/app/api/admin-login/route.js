import { NextResponse } from "next/server";
import {
  createAdminSessionToken,
  getAdminCookieName,
  getAdminSessionMaxAge,
} from "@/lib/admin-auth";

export async function POST(request) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json({ error: "Şifre gerekli." }, { status: 400 });
    }

    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Şifre yanlış." }, { status: 401 });
    }

    const response = NextResponse.json({ success: true });

    response.cookies.set(getAdminCookieName(), createAdminSessionToken(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: getAdminSessionMaxAge(),
    });

    return response;
  } catch (error) {
    console.error("ADMIN LOGIN ERROR:", error);

    return NextResponse.json({ error: "Giriş yapılamadı." }, { status: 500 });
  }
}
