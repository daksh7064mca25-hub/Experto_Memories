import { NextResponse } from "next/server";
import { signAdminToken, AUTH_COOKIE_NAME, hashPassword, comparePassword, getAuthCookieOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { AdminUser } from "@/models/AdminUser";
import { cookies } from "next/headers";

const DEFAULT_ADMIN_EMAIL = process.env.ADMIN_EMAIL || "";
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const cleanEmail = String(email).toLowerCase().trim();

    // 1. Establish database connection
    // If MongoDB is unavailable, return HTTP 503 immediately.
    // Database connectivity failure MUST NOT fall back to environment credentials.
    let conn = null;
    try {
      conn = await connectToDatabase();
    } catch (dbErr) {
      console.error("Database connection failure during login:", dbErr instanceof Error ? dbErr.message : "DB error");
      return NextResponse.json(
        { error: "Database unavailable. Authentication service is currently offline." },
        { status: 503 }
      );
    }

    if (!conn || conn.connection.readyState !== 1) {
      return NextResponse.json(
        { error: "Database unavailable. Authentication service is currently offline." },
        { status: 503 }
      );
    }

    // 2. Query admin user from MongoDB
    let user = null;
    try {
      user = await AdminUser.findOne({ email: cleanEmail });

      // 3. Initial Admin Bootstrap:
      // If no record exists for DEFAULT_ADMIN_EMAIL, bootstrap the root admin in MongoDB.
      // Environment credentials are used solely to seed the initial database record, never to bypass a database outage.
      if (!user && DEFAULT_ADMIN_EMAIL && cleanEmail === DEFAULT_ADMIN_EMAIL.toLowerCase() && DEFAULT_ADMIN_PASSWORD) {
        const pwHash = await hashPassword(DEFAULT_ADMIN_PASSWORD);
        user = await AdminUser.create({
          email: cleanEmail,
          passwordHash: pwHash,
          role: "admin",
          name: "Studio Admin",
        });
      }
    } catch (queryErr) {
      console.error("Database query failure during login:", queryErr instanceof Error ? queryErr.message : "Query error");
      return NextResponse.json(
        { error: "Database unavailable. Authentication service is currently offline." },
        { status: 503 }
      );
    }

    // 4. Validate user existence
    if (!user) {
      return NextResponse.json({ error: "Invalid admin email or password" }, { status: 401 });
    }

    // 5. Verify password hash using secure bcrypt comparison
    let isValid = await comparePassword(password, user.passwordHash);

    // If password didn't match the database hash, but matches the current configured DEFAULT_ADMIN_PASSWORD,
    // sync the new password hash into the database so admin credential changes in .env.local take effect.
    if (!isValid && cleanEmail === DEFAULT_ADMIN_EMAIL.toLowerCase() && password === DEFAULT_ADMIN_PASSWORD) {
      const newHash = await hashPassword(DEFAULT_ADMIN_PASSWORD);
      user.passwordHash = newHash;
      await user.save();
      isValid = true;
    }

    if (!isValid) {
      return NextResponse.json({ error: "Invalid admin email or password" }, { status: 401 });
    }

    // 6. Generate and sign JWT session token
    const token = await signAdminToken({
      userId: user._id.toString(),
      email: cleanEmail,
      role: "admin",
    });

    const cookieOptions = getAuthCookieOptions(req);

    const response = NextResponse.json({
      success: true,
      user: { email: cleanEmail, role: "admin" },
    });

    try {
      const cookieStore = await cookies();
      cookieStore.set(AUTH_COOKIE_NAME, token, cookieOptions);
    } catch (cookieErr) {
      console.warn("cookieStore.set warning:", cookieErr);
    }

    response.cookies.set(AUTH_COOKIE_NAME, token, cookieOptions);

    return response;
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

