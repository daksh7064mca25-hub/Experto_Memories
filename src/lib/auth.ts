import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "expertomemories-secret-jwt-key-2025-secure!"
);

export const AUTH_COOKIE_NAME = "em_admin_token";
export const AUTH_CUSTOMER_COOKIE_NAME = "em_customer_token";

export interface AdminPayload {
  userId: string;
  email: string;
  role: "admin";
}

export interface CustomerPayload {
  userId: string;
  email: string;
  name: string;
  phone?: string;
  role: "customer";
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function signAdminToken(payload: AdminPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifyAdminToken(token: string): Promise<AdminPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    if ((payload as any).role === "admin") {
      return payload as unknown as AdminPayload;
    }
    return null;
  } catch {
    return null;
  }
}

export async function signCustomerToken(payload: CustomerPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(JWT_SECRET);
}

export async function verifyCustomerToken(token: string): Promise<CustomerPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    if ((payload as any).role === "customer") {
      return payload as unknown as CustomerPayload;
    }
    return null;
  } catch {
    return null;
  }
}

export interface WebsiteUnlockPayload {
  slug: string;
  type: "website_unlock";
}

/**
 * Signs a tamper-resistant token confirming successful password unlock of a specific website.
 * Scoped strictly to the target slug and expires after 7 days.
 */
export async function signWebsiteUnlockToken(slug: string): Promise<string> {
  return new SignJWT({
    slug,
    type: "website_unlock",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

/**
 * Verifies that an unlock token is authentic, cryptographically signed, unexpired,
 * and scoped exactly to the expected website slug.
 */
export async function verifyWebsiteUnlockToken(
  token: string,
  expectedSlug: string
): Promise<boolean> {
  if (!token || typeof token !== "string") return false;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (
      payload &&
      (payload as any).type === "website_unlock" &&
      (payload as any).slug === expectedSlug
    ) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

/**
 * Determines whether cookies should have the Secure flag.
 * - In local HTTP development (localhost, 127.0.0.1, private IPs, any port like 3000/3001): returns false.
 * - In production over HTTPS: returns true.
 * - Explicit override supported via COOKIE_SECURE="true" | "false".
 */
export function isSecureCookie(req?: Request): boolean {
  if (process.env.COOKIE_SECURE === "true") return true;
  if (process.env.COOKIE_SECURE === "false") return false;

  if (req) {
    try {
      const url = new URL(req.url);
      const host = (url.hostname || "").toLowerCase();
      if (
        host === "localhost" ||
        host === "127.0.0.1" ||
        host === "::1" ||
        host.startsWith("192.168.") ||
        host.startsWith("10.") ||
        host.endsWith(".local")
      ) {
        return false;
      }
      const proto = req.headers.get("x-forwarded-proto");
      if (proto) {
        return proto.toLowerCase().includes("https");
      }
      return url.protocol === "https:";
    } catch {
      // ignore URL parse errors
    }
  }

  // Fallback when req is not passed:
  // In development, never require secure.
  if (process.env.NODE_ENV !== "production") {
    return false;
  }

  return false; // Default to false unless explicitly detected as HTTPS or COOKIE_SECURE=true
}

/**
 * Generates standard cookie options for the admin session cookie.
 */
export function getAuthCookieOptions(req?: Request) {
  return {
    httpOnly: true,
    secure: isSecureCookie(req),
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  };
}

/**
 * Retrieves and validates the current admin session.
 * Supports:
 * 1. Bearer token in Authorization header
 * 2. Next.js cookie store (em_admin_token)
 * 3. Raw Cookie header from Request as fallback
 */
export async function getAdminSession(req?: Request): Promise<AdminPayload | null> {
  try {
    // 1. Check Bearer Authorization header if request object is provided
    if (req) {
      const authHeader = req.headers.get("authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.substring(7).trim();
        const verified = await verifyAdminToken(token);
        if (verified && verified.role === "admin") return verified;
      }
    }

    // 2. Read from Next.js cookie store
    try {
      const cookieStore = await cookies();
      const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
      if (token) {
        const verified = await verifyAdminToken(token);
        if (verified && verified.role === "admin") return verified;
      }
    } catch {
      // cookies() might fail in certain execution contexts
    }

    // 3. Fallback: Parse Cookie header directly from Request if available
    if (req) {
      const cookieHeader = req.headers.get("cookie");
      if (cookieHeader) {
        const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${AUTH_COOKIE_NAME}=([^;]*)`));
        if (match && match[1]) {
          const rawToken = decodeURIComponent(match[1].trim());
          const verified = await verifyAdminToken(rawToken);
          if (verified && verified.role === "admin") return verified;
        }
      }
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Generates standard cookie options for the customer session cookie.
 */
export function getCustomerAuthCookieOptions(req?: Request) {
  return {
    httpOnly: true,
    secure: isSecureCookie(req),
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  };
}

async function validateActiveCustomer(verified: CustomerPayload | null): Promise<CustomerPayload | null> {
  if (!verified || verified.role !== "customer") return null;
  try {
    const { connectToDatabase } = await import("@/lib/mongodb");
    const { CustomerUser } = await import("@/models/CustomerUser");
    const conn = await connectToDatabase();
    if (!conn) {
      return verified;
    }
    const dbUser = await CustomerUser.findById(verified.userId).select("isSuspended").lean();
    if (dbUser && dbUser.isSuspended) {
      return null;
    }
    return verified;
  } catch (err) {
    if (process.env.ALLOW_IN_MEMORY_TEST === "true" || process.env.NODE_ENV !== "production") {
      return verified;
    }
    console.error("validateActiveCustomer error:", err);
    return null;
  }
}

/**
 * Retrieves and validates the current customer session.
 * Supports:
 * 1. Bearer token in Authorization header
 * 2. Next.js cookie store (em_customer_token)
 * 3. Raw Cookie header from Request as fallback
 * Enforces immediate session revocation if customer account is suspended.
 */
export async function getCustomerSession(req?: Request): Promise<CustomerPayload | null> {
  try {
    // 1. Check Bearer Authorization header if request object is provided
    if (req) {
      const authHeader = req.headers.get("authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.substring(7).trim();
        const verified = await verifyCustomerToken(token);
        if (verified && verified.role === "customer") return await validateActiveCustomer(verified);
      }
    }

    // 2. Read from Next.js cookie store
    try {
      const cookieStore = await cookies();
      const token = cookieStore.get(AUTH_CUSTOMER_COOKIE_NAME)?.value;
      if (token) {
        const verified = await verifyCustomerToken(token);
        if (verified && verified.role === "customer") return await validateActiveCustomer(verified);
      }
    } catch {
      // cookies() might fail in certain execution contexts
    }

    // 3. Fallback: Parse Cookie header directly from Request if available
    if (req) {
      const cookieHeader = req.headers.get("cookie");
      if (cookieHeader) {
        const match = cookieHeader.match(
          new RegExp(`(?:^|;\\s*)${AUTH_CUSTOMER_COOKIE_NAME}=([^;]*)`)
        );
        if (match && match[1]) {
          const rawToken = decodeURIComponent(match[1].trim());
          const verified = await verifyCustomerToken(rawToken);
          if (verified && verified.role === "customer") return await validateActiveCustomer(verified);
        }
      }
    }

    return null;
  } catch {
    return null;
  }
}
