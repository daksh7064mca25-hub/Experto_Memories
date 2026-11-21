import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { WebsiteProject } from "@/models/WebsiteProject";
import { CustomerUser } from "@/models/CustomerUser";
import { getAdminSession } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const adminSession = await getAdminSession(req);
    if (!adminSession || adminSession.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized. Admin session required." }, { status: 401 });
    }

    await connectToDatabase();

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalCustomers,
      newCustomersThisMonth,
      totalOrders,
      grossRevenueResult,
      refundedAmountResult,
      netRevenueResult,
      pendingPayments,
      successfulPayments,
      refundedOrders,
      pendingUpiApprovals,
      totalWebsites,
      publishedWebsites,
      draftWebsites,
      suspendedWebsites,
      expiredWebsites,
      pendingCustomDomains,
      recentOrders,
      recentCustomers,
      recentProjects,
    ] = await Promise.all([
      CustomerUser.countDocuments(),
      CustomerUser.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      Order.countDocuments(),
      Order.aggregate([
        { $match: { paymentStatus: { $in: ["paid", "refunded"] } } },
        { $group: { _id: null, grossRevenue: { $sum: "$totalAmount" } } },
      ]),
      Order.aggregate([
        { $match: { paymentStatus: "refunded" } },
        { $group: { _id: null, totalRefunded: { $sum: "$totalAmount" } } },
      ]),
      Order.aggregate([
        { $match: { paymentStatus: "paid" } },
        { $group: { _id: null, netRevenue: { $sum: "$totalAmount" } } },
      ]),
      Order.countDocuments({
        paymentStatus: { $in: ["pending", "payment_pending_verification"] },
      }),
      Order.countDocuments({ paymentStatus: "paid" }),
      Order.countDocuments({ paymentStatus: "refunded" }),
      Order.countDocuments({
        $or: [
          { paymentStatus: "payment_pending_verification" },
          {
            paymentMethod: { $in: ["upi", "manual_upi"] },
            paymentStatus: "pending",
            "manualUpiDetails.utrNumber": { $exists: true, $ne: "" },
          },
        ],
      } as any),
      WebsiteProject.countDocuments(),
      WebsiteProject.countDocuments({ status: "published" }),
      WebsiteProject.countDocuments({ status: "draft" }),
      WebsiteProject.countDocuments({ status: "suspended" }),
      WebsiteProject.countDocuments({ hostingExpiresAt: { $lt: now } }),
      WebsiteProject.countDocuments({ "customDomain.status": "verification_pending" }),
      Order.find()
        .sort({ createdAt: -1 })
        .limit(6)
        .populate("projectId", "title slug status")
        .lean(),
      CustomerUser.find()
        .sort({ createdAt: -1 })
        .limit(6)
        .select("-passwordHash")
        .lean(),
      WebsiteProject.find()
        .sort({ createdAt: -1 })
        .limit(6)
        .select("-passwordHash")
        .lean(),
    ]);

    const grossRevenue = grossRevenueResult?.[0]?.grossRevenue || 0;
    const totalRefundedAmount = refundedAmountResult?.[0]?.totalRefunded || 0;
    const netRevenue = netRevenueResult?.[0]?.netRevenue || 0;

    return NextResponse.json({
      success: true,
      kpis: {
        totalCustomers,
        newCustomersThisMonth,
        totalOrders,
        grossRevenue,
        totalRefundedAmount,
        netRevenue,
        totalRevenue: netRevenue, // Backward compatibility alias
        pendingPayments,
        successfulPayments,
        refundedOrders,
        pendingUpiApprovals,
        totalWebsites,
        publishedWebsites,
        draftWebsites,
        suspendedWebsites,
        expiredWebsites,
        pendingCustomDomains,
      },
      recentOrders: recentOrders.map((o: any) => ({
        ...o,
        _id: o._id.toString(),
      })),
      recentCustomers: recentCustomers.map((c: any) => ({
        ...c,
        _id: c._id.toString(),
      })),
      recentProjects: recentProjects.map((p: any) => ({
        ...p,
        _id: p._id.toString(),
      })),
    });
  } catch (error: any) {
    console.error("Admin overview fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch overview metrics" }, { status: 500 });
  }
}
