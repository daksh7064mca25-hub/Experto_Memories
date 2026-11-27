import { NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/mongodb";
import { CustomerUser } from "@/models/CustomerUser";
import {
  comparePassword,
  signCustomerToken,
  getCustomerAuthCookieOptions,
  AUTH_CUSTOMER_COOKIE_NAME,
  AUTH_COOKIE_NAME,
  getAuthCookieOptions,
} from "@/lib/auth";

const LoginSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = LoginSchema.parse(body);

    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json({ error: "Database connection unavailable" }, { status: 503 });
    }

    const user = await CustomerUser.findOne({ email: validated.email.toLowerCase() });
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const isMatch = await comparePassword(validated.password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    if (user.isSuspended) {
      return NextResponse.json(
        { error: "Your customer account has been suspended. Please contact support@expertomemories.shop." },
        { status: 403 }
      );
    }

    const token = await signCustomerToken({
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: "customer",
    });

    const res = NextResponse.json({
      success: true,
      customer: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        phone: user.phone,
      },
    });

    const cookieOpts = getCustomerAuthCookieOptions(req);
    res.cookies.set(AUTH_CUSTOMER_COOKIE_NAME, token, cookieOpts);
    // Explicitly invalidate any lingering admin session so customer dashboard never inherits admin rights
    res.cookies.set(AUTH_COOKIE_NAME, "", { ...getAuthCookieOptions(req), maxAge: 0 });

    return res;
  } catch (err: any) {
    if (err.name === "ZodError" || err.issues) {
      return NextResponse.json(
        { error: err.issues?.[0]?.message || "Invalid login input" },
        { status: 400 }
      );
    }
    console.error("Customer login error:", err);
    if (err.message?.includes("Database connection failed") || err.name === "MongooseServerSelectionError") {
      return NextResponse.json(
        { error: "Database connection unavailable. Please ensure your IP address is whitelisted in MongoDB Atlas Network Access." },
        { status: 503 }
      );
    }
    return NextResponse.json({ error: "Login failed. Please try again." }, { status: 500 });
  }
}
