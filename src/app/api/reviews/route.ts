import { NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/mongodb";
import { CustomerReview, REVIEW_CATEGORIES, computeAvatarInitials } from "@/models/CustomerReview";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { ReviewCategory } from "@/types/review";

// Input sanitization: strips HTML tags to prevent XSS while preserving legitimate text punctuation
function sanitizeText(input: string): string {
  return input.replace(/<[^>]*>?/gm, "").trim();
}

const ReviewSubmissionSchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(2, "Display name must be at least 2 characters")
    .max(100, "Display name cannot exceed 100 characters"),
  category: z.enum([
    "Love & Relationship",
    "Wedding Invitations",
    "Birthday Gifts",
    "Anniversary Keepsakes",
    "Personalized Memories",
  ]),
  rating: z
    .number()
    .int("Rating must be a whole number")
    .min(1, "Rating must be at least 1 star")
    .max(5, "Rating cannot exceed 5 stars"),
  reviewText: z
    .string()
    .trim()
    .min(10, "Please share a few more details (minimum 10 characters)")
    .max(2000, "Review cannot exceed 2000 characters"),
  consentForDisplay: z.literal(true),
});

/**
 * POST /api/reviews
 * Public endpoint for visitors to submit genuine celebration reviews for moderation.
 */
export async function POST(req: Request) {
  try {
    // 1. Request size safeguard (reject payloads > 50KB)
    const contentLength = Number(req.headers.get("content-length") || 0);
    if (contentLength > 50 * 1024) {
      return NextResponse.json(
        { error: "Payload too large. Maximum 50KB allowed." },
        { status: 413 }
      );
    }

    // 2. Body JSON parsing with graceful syntax error handling
    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Malformed request payload. JSON format required." },
        { status: 400 }
      );
    }

    // 3. Schema validation with Zod (checked before rate limiting so malformed inputs do not exhaust quota)
    const validationResult = ReviewSubmissionSchema.safeParse(body);
    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0]?.message || "Validation failed";
      return NextResponse.json(
        {
          error: firstError,
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    // 4. Server-side Rate Limiting (5 reviews per 10 minutes per IP)
    const bypassRateLimit =
      process.env.NODE_ENV !== "production" &&
      req.headers.get("x-test-bypass-rate-limit") === "1";

    let rateLimit = { success: true, resetSeconds: 600, limit: 5, remaining: 5 };
    if (!bypassRateLimit) {
      const clientIp = getClientIp(req);
      rateLimit = checkRateLimit(`review_submit_${clientIp}`, 5, 10 * 60 * 1000);
      if (!rateLimit.success) {
        return NextResponse.json(
          {
            error: "You have submitted multiple reviews recently. Please try again later.",
            retryAfterSeconds: rateLimit.resetSeconds,
          },
          {
            status: 429,
            headers: {
              "Retry-After": String(rateLimit.resetSeconds),
              "X-RateLimit-Limit": String(rateLimit.limit),
              "X-RateLimit-Remaining": "0",
            },
          }
        );
      }
    }

    const { customerName, category, rating, reviewText, consentForDisplay } =
      validationResult.data;

    // 5. Sanitize text inputs
    const cleanName = sanitizeText(customerName);
    const cleanText = sanitizeText(reviewText);

    // 6. Connect to database
    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json(
        { error: "Review service temporarily unavailable. Please try again soon." },
        { status: 503 }
      );
    }

    // 7. Persist to MongoDB with default status 'pending'
    const newReview = (await CustomerReview.create({
      customerName: cleanName,
      avatarInitials: computeAvatarInitials(cleanName),
      category: category as ReviewCategory,
      rating,
      reviewText: cleanText,
      consentForDisplay: true,
      status: "pending",
      submittedAt: new Date(),
      isVerifiedPurchase: false, // Strictly false for public untrusted form submissions
    })) as any;

    // 8. Return truthful confirmation response
    return NextResponse.json(
      {
        success: true,
        message:
          "Thank you for sharing your experience! Your review has been submitted successfully and is awaiting moderation.",
        reviewId: newReview._id.toString(),
      },
      {
        status: 201,
        headers: {
          "X-RateLimit-Remaining": String(rateLimit.remaining),
        },
      }
    );
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("Failed to submit review:", error);
    return NextResponse.json(
      {
        error: "An unexpected error occurred while saving your review. Please try again.",
        details: process.env.NODE_ENV !== "production" ? errorMsg : undefined,
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/reviews
 * Public endpoint to fetch approved genuine reviews for display.
 * Only returns reviews where status === 'approved' and consentForDisplay === true.
 */
export async function GET() {
  try {
    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json({
        success: true,
        reviews: [],
        totalApproved: 0,
        averageRating: 5.0,
      });
    }

    // 1. Fetch approved reviews (up to 12 newest)
    const approvedDocs = await CustomerReview.find({
      status: "approved",
      consentForDisplay: true,
    })
      .sort({ submittedAt: -1 })
      .limit(12)
      .lean();

    // 2. Aggregate counts and average rating
    const stats = await CustomerReview.aggregate([
      {
        $match: {
          status: "approved",
          consentForDisplay: true,
        },
      },
      {
        $group: {
          _id: null,
          avgRating: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
    ]);

    const totalApproved = stats[0]?.count || 0;
    const rawAvg = stats[0]?.avgRating;
    const averageRating = rawAvg ? Number(rawAvg.toFixed(1)) : 5.0;

    // 3. Format safe public DTOs (strip private admin/moderation fields)
    const publicReviews = approvedDocs.map((doc: any) => {
      const dateObj = doc.submittedAt ? new Date(doc.submittedAt) : new Date(doc.createdAt);
      const formattedDate = dateObj.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });

      return {
        id: doc._id.toString(),
        customerName: doc.customerName,
        avatarInitials: doc.avatarInitials || doc.customerName.slice(0, 2).toUpperCase(),
        photoUrl: undefined,
        rating: doc.rating,
        reviewText: doc.reviewText,
        category: doc.category,
        reviewDate: formattedDate,
        isVerifiedPurchase: Boolean(doc.isVerifiedPurchase),
        status: "approved" as const,
      };
    });

    return NextResponse.json({
      success: true,
      reviews: publicReviews,
      totalApproved,
      averageRating,
      stats: {
        totalApproved,
        averageRating,
      },
    });
  } catch (error) {
    console.error("Failed to fetch public reviews:", error);
    return NextResponse.json(
      { error: "Failed to load customer reviews." },
      { status: 500 }
    );
  }
}
