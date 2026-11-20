import { NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/mongodb";
import { CustomerUser } from "@/models/CustomerUser";
import {
  hashPassword,
  signCustomerToken,
  getCustomerAuthCookieOptions,
  AUTH_CUSTOMER_COOKIE_NAME,
  AUTH_COOKIE_NAME,
  getAuthCookieOptions,
} from "@/lib/auth";

const RegisterSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().trim().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = RegisterSchema.parse(body);

    let conn: any = null;
    try {
      conn = await connectToDatabase();
    } catch (dbErr) {
      if (process.env.ALLOW_IN_MEMORY_TEST === "true") {
        conn = null;
      } else {
        throw dbErr;
      }
    }

    if (!conn) {
      const mockId = `cust-${Date.now()}`;
      const token = await signCustomerToken({
        userId: mockId,
        email: validated.email.toLowerCase(),
        name: validated.name,
        phone: validated.phone || "",
        role: "customer",
      });

      const res = NextResponse.json(
        {
          success: true,
          customer: {
            id: mockId,
            email: validated.email.toLowerCase(),
            name: validated.name,
            phone: validated.phone || "",
          },
        },
        { status: 201 }
      );

      res.cookies.set(AUTH_CUSTOMER_COOKIE_NAME, token, getCustomerAuthCookieOptions(req as any));
      return res;
    }

    const existingUser = await CustomerUser.findOne({ email: validated.email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists. Please log in." },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(validated.password);

    const user = await CustomerUser.create({
      name: validated.name,
      email: validated.email.toLowerCase(),
      passwordHash,
      phone: validated.phone || "",
    });

    const token = await signCustomerToken({
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: "customer",
    });

    const res = NextResponse.json(
      {
        success: true,
        customer: {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          phone: user.phone,
        },
      },
      { status: 201 }
    );

    const cookieOpts = getCustomerAuthCookieOptions(req);
    res.cookies.set(AUTH_CUSTOMER_COOKIE_NAME, token, cookieOpts);
    // Invalidate any lingering admin token on customer registration
    res.cookies.set(AUTH_COOKIE_NAME, "", { ...getAuthCookieOptions(req), maxAge: 0 });

    return res;
  } catch (err: any) {
    if (err.name === "ZodError" || err.issues) {
      return NextResponse.json(
        { error: err.issues?.[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }
    console.error("Customer register error:", err);
    if (err.message?.includes("Database connection failed") || err.name === "MongooseServerSelectionError") {
      return NextResponse.json(
        { error: "Database connection unavailable. Please ensure your IP address is whitelisted in MongoDB Atlas Network Access." },
        { status: 503 }
      );
    }
    return NextResponse.json({ error: "Registration failed. Please try again." }, { status: 500 });
  }
}
