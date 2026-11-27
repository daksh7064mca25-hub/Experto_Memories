import { WebsiteProjectData } from "@/types/website";

/**
 * Checks if a value is a MongoDB ObjectId (Mongoose Types.ObjectId or BSON ObjectId)
 */
function isObjectId(value: any): boolean {
  if (!value || typeof value !== "object") return false;
  return (
    value._bsontype === "ObjectID" ||
    value._bsontype === "ObjectId" ||
    value.constructor?.name === "ObjectId" ||
    value.constructor?.name === "ObjectID" ||
    typeof value.toHexString === "function"
  );
}

/**
 * Checks if a value is a Date object or has Date methods
 */
function isDate(value: any): boolean {
  if (!value || typeof value !== "object") return false;
  return (
    value instanceof Date ||
    Object.prototype.toString.call(value) === "[object Date]" ||
    typeof value.toISOString === "function"
  );
}

/**
 * Deep recursive sanitizer that converts ObjectIds to strings, Dates to ISO strings,
 * unrolls Mongoose documents, and strips prototype pollution.
 */
function sanitizeValue(value: any): any {
  if (value === null || value === undefined) {
    return value;
  }

  // 1. Date conversion
  if (isDate(value)) {
    try {
      return value.toISOString();
    } catch {
      return String(value);
    }
  }

  // 2. MongoDB ObjectId conversion
  if (isObjectId(value)) {
    return value.toString();
  }

  // 3. Arrays: recursively sanitize all items
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  // 4. Objects (plain or Mongoose subdocs)
  if (typeof value === "object") {
    // If it's a Mongoose Document, convert to plain object first
    const raw = typeof value.toObject === "function" ? value.toObject() : value;
    const clean: Record<string, any> = {};

    for (const [key, val] of Object.entries(raw)) {
      // Security filter: NEVER expose credentials, hashes, or private tokens to Client Components
      if (
        key === "passwordHash" ||
        key === "password" ||
        key === "__v" ||
        key === "razorpayPaymentDetails" ||
        key === "manualUpiDetails" ||
        key === "internalNotes" ||
        key === "authTokens"
      ) {
        continue;
      }

      clean[key] = sanitizeValue(val);
    }
    return clean;
  }

  // Primitive types (string, number, boolean)
  return value;
}

/**
 * Transforms any WebsiteProject document into a safe, purely serializable Client Component DTO.
 *
 * Guarantees:
 * 1. Zero MongoDB ObjectIds (all normalized to plain strings).
 * 2. Zero Date objects (all normalized to ISO-8601 strings).
 * 3. Zero .toJSON prototype methods (100% plain objects with Object.prototype).
 * 4. Zero sensitive credentials (passwordHash, private payment information stripped).
 * 5. Safe across Next.js 16 Server Component -> Client Component boundary.
 */
export function toClientProjectDTO(project: any): WebsiteProjectData {
  if (!project) {
    throw new Error("Cannot serialize null or undefined project.");
  }

  // Sanitize recursively
  const sanitized = sanitizeValue(project);

  // Guarantee string types for top-level identifiers
  if (sanitized._id !== undefined && sanitized._id !== null) {
    sanitized._id = String(sanitized._id);
  }
  if (sanitized.customerId !== undefined && sanitized.customerId !== null) {
    sanitized.customerId = String(sanitized.customerId);
  }
  if (sanitized.orderId !== undefined && sanitized.orderId !== null) {
    sanitized.orderId = String(sanitized.orderId);
  }

  // Ensure default fallbacks
  sanitized.occasionType = sanitized.occasionType || "apology";
  sanitized.sections = Array.isArray(sanitized.sections) ? sanitized.sections : [];

  // Guarantee 100% pure plain object without prototype methods (Next.js 16 requirement)
  return JSON.parse(JSON.stringify(sanitized));
}
