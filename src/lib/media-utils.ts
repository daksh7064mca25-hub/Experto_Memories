/**
 * Media URL resolution and optimization helpers.
 * Client and server safe.
 */

/**
 * Determines whether an image source points to a protected endpoint,
 * a local API endpoint with query parameters (e.g. /api/media/view?key=...),
 * or a private Cloudflare R2 bucket.
 * 
 * When true, Next.js <Image /> must have unoptimized={true} so that:
 * 1. The browser requests the protected endpoint directly with all authentication cookies.
 * 2. Next.js image optimizer does not throw images.localPatterns configuration errors.
 */
export function isProtectedMediaUrl(url?: string | null): boolean {
  if (!url || typeof url !== "string") return false;
  const clean = url.trim();
  if (!clean) return false;

  return (
    clean.startsWith("/api/media/") ||
    clean.startsWith("/api/") ||
    clean.includes("r2.cloudflarestorage.com") ||
    clean.includes(".r2.dev") ||
    clean.startsWith("blob:") ||
    clean.startsWith("data:") ||
    (clean.startsWith("/") && !clean.startsWith("//") && clean.includes("?"))
  );
}
