import { NextResponse } from "next/server";
import {
  getCustomerSession,
  comparePassword,
  hashPassword,
  signCustomerToken,
  getCustomerAuthCookieOptions,
  AUTH_CUSTOMER_COOKIE_NAME,
} from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { CustomerUser } from "@/models/CustomerUser";
import { z } from "zod";

export async function GET(req: Request) {
  try {
    const session = await getCustomerSession(req);
    if (!session) {
      return NextResponse.json({ authenticated: false, customer: null });
    }

    return NextResponse.json(
      {
        authenticated: true,
        customer: {
          id: session.userId,
          email: session.email,
          name: session.name,
          phone: session.phone || "",
        },
      },
      {
        headers: {
          "Cache-Control": "private, no-cache, no-store, must-revalidate",
        },
      }
    );
  } catch (err: any) {
    console.error("Customer me error:", err);
    return NextResponse.json({ authenticated: false, customer: null });
  }
}

const UpdateProfileSchema = z.object({
  name: z.string().trim().min(1, "Name cannot be empty").optional(),
  phone: z.string().trim().optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6, "New password must be at least 6 characters").optional(),
});

export async function PATCH(req: Request) {
  try {
    const session = await getCustomerSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validated = UpdateProfileSchema.parse(body);

    await connectToDatabase();
    const user = await CustomerUser.findById(session.userId);
    if (!user) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    if (validated.name !== undefined) {
      user.name = validated.name;
    }
    if (validated.phone !== undefined) {
      user.phone = validated.phone;
    }

    // Password change
    if (validated.newPassword) {
      if (!validated.currentPassword) {
        return NextResponse.json(
          { error: "Current password is required to set a new password." },
          { status: 400 }
        );
      }
      const isMatch = await comparePassword(validated.currentPassword, user.passwordHash);
      if (!isMatch) {
        return NextResponse.json(
          { error: "Current password does not match." },
          { status: 400 }
        );
      }
      user.passwordHash = await hashPassword(validated.newPassword);
    }

    await user.save();

    // Re-issue updated customer token
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
        phone: user.phone || "",
      },
      message: "Profile updated successfully.",
    });

    const cookieOpts = getCustomerAuthCookieOptions(req);
    res.cookies.set(AUTH_CUSTOMER_COOKIE_NAME, token, cookieOpts);

    return res;
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues[0]?.message || "Invalid input" }, { status: 400 });
    }
    console.error("Update profile error:", err);
    return NextResponse.json({ error: "Failed to update profile." }, { status: 500 });
  }
}

