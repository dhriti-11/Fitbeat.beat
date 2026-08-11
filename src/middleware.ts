import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;
  const hasAccess = req.auth?.user?.dashboardAccess;

  if (pathname.startsWith("/dashboard") && !isLoggedIn) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  if (pathname.startsWith("/dashboard/trainer") && role !== "trainer") {
    return NextResponse.redirect(new URL("/dashboard/client", req.url));
  }

  if (pathname === "/dashboard/client" && role === "client" && !hasAccess) {
    return NextResponse.redirect(new URL("/dashboard/client/gate", req.url));
  }

  if (pathname.startsWith("/sign-in") && isLoggedIn) {
    if (role === "trainer") return NextResponse.redirect(new URL("/dashboard/trainer", req.url));
    if (!hasAccess) return NextResponse.redirect(new URL("/dashboard/client/gate", req.url));
    return NextResponse.redirect(new URL("/dashboard/client", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/sign-in"],
};
