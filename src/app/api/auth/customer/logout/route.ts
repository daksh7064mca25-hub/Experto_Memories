import { NextResponse } from "next/server";
import { AUTH_CUSTOMER_COOKIE_NAME, getCustomerAuthCookieOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const res = NextResponse.json(
    { success: true, message: "Logged out successfully" },
    {
      headers: {
        "Cache-Control": "private, no-cache, no-store, must-revalidate",
      },
    }
  );
  const cookieOpts = getCustomerAuthCookieOptions(req);
  res.cookies.set(AUTH_CUSTOMER_COOKIE_NAME, "", {
    ...cookieOpts,
    maxAge: 0,
  });
  return res;
}
