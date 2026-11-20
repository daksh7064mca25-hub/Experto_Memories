import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { getCustomerSession, getAdminSession } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const customerSession = await getCustomerSession(req);
    if (!customerSession || customerSession.role !== "customer") {
      return NextResponse.json(
        { error: "Unauthorized. Customer session required." },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const orConditions: any[] = [
      { "customer.email": customerSession.email.toLowerCase().trim() },
    ];

    if (customerSession.userId) {
      orConditions.push({ customerId: customerSession.userId });
      try {
        const mongoose = await import("mongoose");
        if (mongoose.default?.Types?.ObjectId?.isValid(customerSession.userId)) {
          orConditions.push({ customerId: new mongoose.default.Types.ObjectId(customerSession.userId) });
        }
      } catch {}
    }

    const orders = await Order.find({ $or: orConditions })
      .sort({ createdAt: -1 })
      .populate("projectId", "title slug status occasionType")
      .lean();

    return NextResponse.json(
      {
        success: true,
        orders: orders.map((o: any) => ({
          ...o,
          _id: o._id.toString(),
        })),
      },
      {
        headers: {
          "Cache-Control": "private, no-cache, no-store, must-revalidate",
        },
      }
    );
  } catch (error: any) {
    console.error("Orders fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
