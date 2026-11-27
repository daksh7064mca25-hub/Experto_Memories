import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { CustomerReview } from "@/models/CustomerReview";
import { getAdminSession } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    // 1. Strict admin authentication check
    const session = await getAdminSession(req);
    if (!session || session.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized. Admin session required." },
        { status: 401 }
      );
    }

    await connectToDatabase();

    // 2. Query parameters
    const url = new URL(req.url);
    const statusParam = url.searchParams.get("status") || "all";
    const categoryParam = url.searchParams.get("category");
    const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get("limit") || "20", 10)));
    const skip = (page - 1) * limit;

    // 3. Build filter query
    const filterQuery: any = {};
    if (statusParam && statusParam !== "all") {
      filterQuery.status = statusParam;
    }
    if (categoryParam && categoryParam !== "all") {
      filterQuery.category = categoryParam;
    }

    // 4. Fetch paginated items and total matching count
    const [docs, totalMatching] = await Promise.all([
      CustomerReview.find(filterQuery)
        .sort({ submittedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      CustomerReview.countDocuments(filterQuery),
    ]);

    // 5. Calculate global aggregate summary metrics
    const [stats, countsByStatus] = await Promise.all([
      CustomerReview.aggregate([
        { $match: { status: "approved" } },
        {
          $group: {
            _id: null,
            avgRating: { $avg: "$rating" },
            approvedCount: { $sum: 1 },
          },
        },
      ]),
      CustomerReview.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    let pendingCount = 0;
    let approvedCount = 0;
    let rejectedCount = 0;
    let totalCount = 0;

    for (const item of countsByStatus) {
      totalCount += item.count;
      if (item._id === "pending") pendingCount = item.count;
      if (item._id === "approved") approvedCount = item.count;
      if (item._id === "rejected") rejectedCount = item.count;
    }

    const rawAvg = stats[0]?.avgRating;
    const averageApprovedRating = rawAvg ? Number(rawAvg.toFixed(1)) : 5.0;

    const summary = {
      total: totalCount,
      pending: pendingCount,
      approved: approvedCount,
      rejected: rejectedCount,
      averageApprovedRating,
    };

    // 6. Format reviews
    const formattedReviews = docs.map((doc: any) => ({
      id: doc._id.toString(),
      customerName: doc.customerName,
      avatarInitials: doc.avatarInitials,
      category: doc.category,
      rating: doc.rating,
      reviewText: doc.reviewText,
      consentForDisplay: Boolean(doc.consentForDisplay),
      status: doc.status,
      submittedAt: doc.submittedAt ? doc.submittedAt.toISOString() : doc.createdAt.toISOString(),
      moderatedAt: doc.moderatedAt ? doc.moderatedAt.toISOString() : undefined,
      moderatedBy: doc.moderatedBy,
      moderationNote: doc.moderationNote,
      verifiedOrderId: doc.verifiedOrderId,
      isVerifiedPurchase: Boolean(doc.isVerifiedPurchase),
    }));

    return NextResponse.json({
      success: true,
      reviews: formattedReviews,
      pagination: {
        page,
        limit,
        totalItems: totalMatching,
        totalPages: Math.ceil(totalMatching / limit) || 1,
      },
      counts: summary,
      summary,
    });
  } catch (error) {
    console.error("Admin reviews GET error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve reviews." },
      { status: 500 }
    );
  }
}
