import { NextResponse } from "next/server";

const PROTECTED_ROUTES = ["/cart", "/allorders", "/whish-list", "/checkout"];

const ADMIN_ROUTES = ["/admin"];

function getTokenPayload(token) {
  try {
    // JWT is base64url encoded; decode the payload (middle part)
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(
      Buffer.from(parts[1], "base64url").toString("utf-8"),
    );
    if (payload.exp && payload.exp * 1000 < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export function middleware(request) {
  const { pathname } = request.nextUrl;

  const token =
    request.cookies.get("token")?.value ||
    request.headers.get("authorization")?.replace("Bearer ", "");

  const payload = token ? getTokenPayload(token) : null;

  // ── Admin routes ─────────────────────────────────────────────────────────
  if (ADMIN_ROUTES.some((r) => pathname.startsWith(r))) {
    if (!payload) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (payload.role !== "admin") {
      // Logged in but not admin → redirect home
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // ── Protected user routes ─────────────────────────────────────────────────
  if (PROTECTED_ROUTES.some((r) => pathname.startsWith(r))) {
    if (!payload) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // ── Redirect logged-in users away from login/register ─────────────────────
  if (payload && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api|public).*)"],
};
