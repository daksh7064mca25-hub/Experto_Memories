import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { z } from "zod";
import { connectToDatabase } from "@/lib/mongodb";
import { CustomerReview, REVIEW_CATEGORIES, computeAvatarInitials } from "@/models/CustomerReview";
import { getAdminSession } from "@/lib/auth";
import { logAdminAction } from "@/lib/audit";
import { ReviewCategory } from "@/types/review";

interface Context {
  params: Promise<{ id: string }> | { id: string };
}

const UpdateReviewSchema = z.object({
  status: z.enum(["pending", "approved", "rejected"]).optional(),
  customerName: z.string().trim().min(2).max(100).optional(),
  category: z.enum(REVIEW_CATEGORIES as [string, ...string[]]).optional(),
  rating: z.number().int().min(1).max(5).optional(),
  reviewText: z.string().trim().min(10).max(2000).optional(),
  moderationNote: z.string().trim().max(500).optional(),
});

/**
 * PATCH /api/admin/reviews/[id]
 * Moderates (approve/reject) or edits an existing customer review.
 */
export async function PATCH(req: Request, context: Context) {
  try {
    const session = await getAdminSession(req);
    if (!session || session.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized. Admin session required." },
        { status: 401 }
      );
    }

    const resolvedParams = await context.params;
    const id = resolvedParams?.id;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid review ID" }, { status: 400 });
    }

    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const validation = UpdateReviewSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const data = validation.data;
    await connectToDatabase();

    const review = await CustomerReview.findById(id);
    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    const previousStatus = review.status;

    // Requirement: When approving, require consentForDisplay === true
    if (data.status === "approved" && !review.consentForDisplay) {
      return NextResponse.json(
        {
          error:
            "Cannot approve review: Customer has not granted permission for public display.",
        },
        { status: 400 }
      );
    }

    // Apply updates
    if (data.customerName) {
      review.customerName = data.customerName;
      review.avatarInitials = computeAvatarInitials(data.customerName);
    }
    if (data.category) review.category = data.category as ReviewCategory;
    if (data.rating) review.rating = data.rating;
    if (data.reviewText) review.reviewText = data.reviewText;
    if (data.moderationNote !== undefined) review.moderationNote = data.moderationNote;

    if (data.status) {
      review.status = data.status;
      review.moderatedAt = new Date();
      review.moderatedBy = session.email;
    }

    await review.save();

    // Log admin action to immutable audit trail
    await logAdminAction({
      actor: session.email,
      action: data.status ? `REVIEW_${data.status.toUpperCase()}` : "REVIEW_EDIT",
      targetType: "review",
      targetId: review._id.toString(),
      targetIdentifier: review.customerName,
      details: {
        previousStatus,
        newStatus: review.status,
        category: review.category,
        rating: review.rating,
      },
      notes: data.moderationNote || `Moderated by ${session.email}`,
    });

    return NextResponse.json({
      success: true,
      message: `Review successfully ${data.status ? data.status : "updated"}.`,
      review: {
        id: review._id.toString(),
        customerName: review.customerName,
        category: review.category,
        rating: review.rating,
        reviewText: review.reviewText,
        status: review.status,
        moderatedAt: review.moderatedAt?.toISOString(),
        moderatedBy: review.moderatedBy,
        moderationNote: review.moderationNote,
      },
    });
  } catch (error) {
    console.error("Admin review PATCH error:", error);
    return NextResponse.json(
      { error: "Failed to update review." },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/reviews/[id]
 * Permanently removes a review from the database with audit trail recording.
 */
export async function DELETE(req: Request, context: Context) {
  try {
    const session = await getAdminSession(req);
    if (!session || session.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized. Admin session required." },
        { status: 401 }
      );
    }

    const resolvedParams = await context.params;
    const id = resolvedParams?.id;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid review ID" }, { status: 400 });
    }

    await connectToDatabase();
    const deleted = await CustomerReview.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    // Log deletion to audit trail
    await logAdminAction({
      actor: session.email,
      action: "REVIEW_DELETE",
      targetType: "review",
      targetId: id,
      targetIdentifier: deleted.customerName,
      details: {
        status: deleted.status,
        category: deleted.category,
        rating: deleted.rating,
        reviewText: deleted.reviewText.slice(0, 100),
      },
      notes: `Review permanently removed by ${session.email}`,
    });

    return NextResponse.json({
      success: true,
      message: "Review deleted successfully.",
      deletedId: id,
    });
  } catch (error) {
    console.error("Admin review DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete review." },
      { status: 500 }
    );
  }
}
