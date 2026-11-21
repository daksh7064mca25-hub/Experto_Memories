import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import "@/models/WebsiteProject";
import { getAdminSession } from "@/lib/auth";

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function GET(req: Request) {
  try {
    const session = await getAdminSession(req);
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized. Admin session required." }, { status: 401 });
    }

    const url = new URL(req.url);
    const paymentStatus = url.searchParams.get("paymentStatus");
    const orderStatus = url.searchParams.get("orderStatus");
    const paymentMethod = url.searchParams.get("paymentMethod");
    const search = url.searchParams.get("search")?.trim() || "";

    await connectToDatabase();

    const andConditions: any[] = [];

    // 1. Payment Status Filter
    if (paymentStatus && paymentStatus !== "all") {
      if (paymentStatus === "payment_pending_verification") {
        andConditions.push({
          $or: [
            { paymentStatus: "payment_pending_verification" },
            {
              paymentMethod: { $in: ["upi", "manual_upi"] },
              paymentStatus: "pending",
              "manualUpiDetails.utrNumber": { $exists: true, $ne: "" },
            },
          ],
        });
      } else if (paymentStatus === "pending") {
        andConditions.push({
          paymentStatus: "pending",
          $or: [
            { "manualUpiDetails.utrNumber": { $exists: false } },
            { "manualUpiDetails.utrNumber": "" },
            { "manualUpiDetails.utrNumber": null },
            { paymentMethod: "razorpay" },
          ],
        });
      } else {
        andConditions.push({ paymentStatus });
      }
    }

    // 2. Order Status Filter
    if (orderStatus && orderStatus !== "all") {
      andConditions.push({ orderStatus });
    }

    // 3. Payment Method Filter
    if (paymentMethod && paymentMethod !== "all") {
      if (paymentMethod === "upi" || paymentMethod === "manual_upi") {
        andConditions.push({ paymentMethod: { $in: ["upi", "manual_upi"] } });
      } else {
        andConditions.push({ paymentMethod });
      }
    }

    // 4. Search Filter (Multi-Field + BSON ObjectId)
    if (search) {
      const escapedSearch = escapeRegex(search);
      const searchClauses: any[] = [
        { orderNumber: { $regex: escapedSearch, $options: "i" } },
        { "customer.name": { $regex: escapedSearch, $options: "i" } },
        { "customer.email": { $regex: escapedSearch, $options: "i" } },
        { "customer.phone": { $regex: escapedSearch, $options: "i" } },
        { "manualUpiDetails.utrNumber": { $regex: escapedSearch, $options: "i" } },
        { "razorpayDetails.razorpayPaymentId": { $regex: escapedSearch, $options: "i" } },
        { "razorpayDetails.razorpayOrderId": { $regex: escapedSearch, $options: "i" } },
        { "items.title": { $regex: escapedSearch, $options: "i" } },
        { "items.occasionType": { $regex: escapedSearch, $options: "i" } },
      ];

      // Match MongoDB ObjectId if 24-character hexadecimal
      if (mongoose.Types.ObjectId.isValid(search) && /^[0-9a-fA-F]{24}$/.test(search)) {
        searchClauses.unshift({ _id: new mongoose.Types.ObjectId(search) });
      }

      andConditions.push({ $or: searchClauses });
    }

    const query = andConditions.length > 0 ? { $and: andConditions } : {};

    // Execute query and tab counts concurrently
    const [
      orders,
      allCount,
      needsVerificationCount,
      paidCount,
      refundedCount,
      pendingCount,
      failedCount,
    ] = await Promise.all([
      Order.find(query as any)
        .sort({ createdAt: -1 })
        .populate("projectId", "slug status title occasionType customerEmail")
        .lean(),
      Order.countDocuments(),
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
      Order.countDocuments({ paymentStatus: "paid" }),
      Order.countDocuments({ paymentStatus: "refunded" }),
      Order.countDocuments({
        paymentStatus: "pending",
        $or: [
          { "manualUpiDetails.utrNumber": { $exists: false } },
          { "manualUpiDetails.utrNumber": "" },
          { "manualUpiDetails.utrNumber": null },
          { paymentMethod: "razorpay" },
        ],
      } as any),
      Order.countDocuments({ paymentStatus: "failed" }),
    ]);

    return NextResponse.json({
      success: true,
      orders: orders.map((o: any) => ({
        ...o,
        _id: o._id.toString(),
        projectId: o.projectId
          ? typeof o.projectId === "object"
            ? {
                ...o.projectId,
                _id: o.projectId._id?.toString(),
              }
            : o.projectId.toString()
          : null,
      })),
      count: orders.length,
      counts: {
        all: allCount,
        needsVerification: needsVerificationCount,
        paid: paidCount,
        refunded: refundedCount,
        pending: pendingCount,
        failed: failedCount,
      },
    });
  } catch (error: any) {
    console.error("Admin orders fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
