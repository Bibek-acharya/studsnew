import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Role-based route protection
const roleRoutes: Record<string, string[]> = {
  "/superadmin": ["/superadmin/login"],
  "/institutions": ["/institutions/login", "/institutions/auth"],
  "/scholarship-provider": ["/scholarship-provider"],
  "/user/dashboard": ["/user/dashboard"],
};

function isPublicRoute(pathname: string): boolean {
  const publicRoutes = [
    "/login",
    "/register",
    "/forgot-password",
    "/verify",
    "/superadmin/login",
    "/scholarship-provider",
    "/auth/google",
    "/auth/google-callback",
    "/institutions/auth/google-callback",
    "/scholarship-providers/auth/google-callback",
  ];
  return publicRoutes.some(route => pathname === route || pathname.startsWith(route + "/"));
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // Allow public routes without authentication
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Protect superadmin routes
  if (pathname.startsWith("/superadmin/")) {
    if (!token) {
      return NextResponse.redirect(new URL("/superadmin/login", request.url));
    }
    // Superadmin routes should have superadmin role - validated by backend
  }

  // Protect scholarship provider routes
  if (pathname.startsWith("/scholarship-provider/")) {
    if (!token) {
      const providerLoginUrl = new URL("/scholarship-provider", request.url);
      providerLoginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(providerLoginUrl);
    }
  }

  // Protect institution routes
  if (pathname.startsWith("/institutions/")) {
    if (!token) {
      const institutionLoginUrl = new URL("/institutions/login", request.url);
      institutionLoginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(institutionLoginUrl);
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
  matcher: [
    "/superadmin/:path*",
    "/user/dashboard/:path*",
    "/scholarship-provider/:path*",
    "/institutions/:path*",
  ],
};
