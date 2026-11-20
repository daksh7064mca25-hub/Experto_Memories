import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, isSecureCookie } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(AUTH_COOKIE_NAME);
  } catch (err) {
    console.warn("cookieStore.delete warning:", err);
  }

  const response = NextResponse.json({ success: true, message: "Logged out successfully" });
  response.cookies.set(AUTH_COOKIE_NAME, "", {
    httpOnly: true,
    secure: isSecureCookie(req),
    sameSite: "lax",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });

  return response;
}
