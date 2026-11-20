import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { getAdminSession } from "@/lib/auth";

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
    const search = url.searchParams.get("search")?.toLowerCase().trim() || "";

    await connectToDatabase();

    const query: Record<string, any> = {};

    if (paymentStatus && paymentStatus !== "all") {
      if (paymentStatus === "payment_pending_verification") {
        query.paymentStatus = "pending";
        query["manualUpiDetails.utrNumber"] = { $exists: true, $ne: "" };
      } else {
        query.paymentStatus = paymentStatus;
      }
    }

    if (orderStatus && orderStatus !== "all") {
      query.orderStatus = orderStatus;
    }

    if (paymentMethod && paymentMethod !== "all") {
      if (paymentMethod === "upi" || paymentMethod === "manual_upi") {
        query.paymentMethod = { $in: ["upi", "manual_upi"] };
      } else {
        query.paymentMethod = paymentMethod;
      }
    }

    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: "i" } },
        { "customer.name": { $regex: search, $options: "i" } },
        { "customer.email": { $regex: search, $options: "i" } },
        { "customer.phone": { $regex: search, $options: "i" } },
        { "manualUpiDetails.utrNumber": { $regex: search, $options: "i" } },
        { "razorpayDetails.razorpayPaymentId": { $regex: search, $options: "i" } },
        { "razorpayDetails.razorpayOrderId": { $regex: search, $options: "i" } },
      ];
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .populate("projectId", "slug status title")
      .lean();

    return NextResponse.json({
      success: true,
      orders: orders.map((o: any) => ({
        ...o,
        _id: o._id.toString(),
      })),
      count: orders.length,
    });
  } catch (error: any) {
    console.error("Admin orders fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
