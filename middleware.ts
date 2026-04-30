import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // Protect scholarship provider routes
  if (pathname.startsWith("/scholarship-provider/")) {
    if (!token) {
      return NextResponse.redirect(new URL("/scholarship-provider", request.url));
    }
  }

  // Protect user dashboard routes
  if (pathname.startsWith("/user/dashboard")) {
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/user/dashboard/:path*", "/scholarship-provider/:path*"],
};
