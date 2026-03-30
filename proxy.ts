import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith("/admin")) return NextResponse.next();
  if (pathname === "/admin/login") return NextResponse.next();

  // Check session via next-auth
  const session = await auth();

  if (!session) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  const login = (session.user as { login?: string })?.login;
  const allowed = process.env.ADMIN_GITHUB_USERNAME;
  if (!login || login !== allowed) {
    return NextResponse.redirect(new URL("/admin/login?error=AccessDenied", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
