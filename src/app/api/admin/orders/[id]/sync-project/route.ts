import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { getAdminSession } from "@/lib/auth";
import { syncPersonalizationToProject } from "@/services/personalization-sync.service";

interface Context {
  params: Promise<{ id: string }> | { id: string };
}

export async function POST(req: Request, context: Context) {
  try {
    const session = await getAdminSession(req);
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized. Admin session required." }, { status: 401 });
    }

    const resolvedParams = await context.params;
    const id = resolvedParams?.id;
    if (!id) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    await connectToDatabase();

    let order = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      order = await Order.findById(id);
    }
    if (!order) {
      order = await Order.findOne({ orderNumber: id });
    }

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const syncResult = await syncPersonalizationToProject(order);
    if (!syncResult.success) {
      return NextResponse.json({ error: syncResult.error || "Failed to sync project" }, { status: 400 });
    }

    order.auditTrail = order.auditTrail || [];
    order.auditTrail.push({
      action: "ADMIN_PROJECT_RESYNCED",
      timestamp: new Date(),
      actor: session.email,
      details: { projectId: syncResult.projectId },
    });
    await order.save();

    return NextResponse.json({
      success: true,
      message: "Personalization synced to WebsiteProject successfully.",
      projectId: syncResult.projectId,
      projectSlug: syncResult.projectSlug,
    });
  } catch (error: any) {
    console.error("Admin sync error:", error);
    return NextResponse.json({ error: error.message || "Failed to sync project" }, { status: 500 });
  }
}
