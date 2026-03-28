import { NextResponse } from "next/server";

export function proxy(request) {
  const pathname = request.nextUrl.pathname;
  const authCookie = request.cookies.get("admin-auth")?.value;

  if (pathname.startsWith("/admin") && authCookie !== "true") {
    return NextResponse.redirect(new URL("/admin-login", request.url));
  }

  if (pathname === "/admin-login" && authCookie === "true") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/admin-login"],
};
