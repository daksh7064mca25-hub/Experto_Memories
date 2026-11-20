import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "expertomemories-secret-jwt-key-2025-secure!"
);

const AUTH_ADMIN_COOKIE = "em_admin_token";
const AUTH_CUSTOMER_COOKIE = "em_customer_token";

async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. ADMIN ROUTES: /studio and /studio/* (Strictly for Platform Administrators)
  if (pathname.startsWith("/studio")) {
    // If a customer accesses legacy /studio/editor/[id], redirect to clean customer route /editor/[id]
    if (pathname.startsWith("/studio/editor/")) {
      const editorId = pathname.replace("/studio/editor/", "");
      const editorUrl = request.nextUrl.clone();
      editorUrl.pathname = `/editor/${editorId}`;
      return NextResponse.redirect(editorUrl);
    }

    const adminCookie = request.cookies.get(AUTH_ADMIN_COOKIE)?.value;
    if (!adminCookie) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/admin/login";
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const payload = await verifyToken(adminCookie);
    if (!payload || (payload as any).role !== "admin") {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/admin/login";
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  // 2. CUSTOMER ROUTES: /dashboard, /dashboard/*, /editor, /editor/*
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/editor")) {
    const customerCookie = request.cookies.get(AUTH_CUSTOMER_COOKIE)?.value;
    if (!customerCookie) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/customer/login";
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const payload = await verifyToken(customerCookie);
    if (!payload || (payload as any).role !== "customer") {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/customer/login";
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  // 3. ADMIN LOGIN REDIRECT: If already authenticated as admin, skip login page
  if (pathname === "/admin/login") {
    const adminCookie = request.cookies.get(AUTH_ADMIN_COOKIE)?.value;
    if (adminCookie) {
      const payload = await verifyToken(adminCookie);
      if (payload && (payload as any).role === "admin") {
        const studioUrl = request.nextUrl.clone();
        studioUrl.pathname = "/studio";
        return NextResponse.redirect(studioUrl);
      }
    }
  }

  // 4. CUSTOMER LOGIN REDIRECT: If already authenticated as customer, skip customer login page
  if (pathname === "/customer/login") {
    const customerCookie = request.cookies.get(AUTH_CUSTOMER_COOKIE)?.value;
    if (customerCookie) {
      const payload = await verifyToken(customerCookie);
      if (payload && (payload as any).role === "customer") {
        const redirectParam = request.nextUrl.searchParams.get("redirect") || "/dashboard";
        const targetUrl = request.nextUrl.clone();
        targetUrl.pathname = redirectParam;
        targetUrl.search = "";
        return NextResponse.redirect(targetUrl);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/studio/:path*",
    "/dashboard/:path*",
    "/editor/:path*",
    "/admin/login",
    "/customer/login",
  ],
};
