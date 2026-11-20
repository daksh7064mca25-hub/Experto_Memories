import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { CustomerUser } from "@/models/CustomerUser";
import { WebsiteProject } from "@/models/WebsiteProject";
import { Order } from "@/models/Order";
import { getAdminSession } from "@/lib/auth";
import { logAdminAction } from "@/lib/audit";

interface Context {
  params: Promise<{ id: string }>;
}

export async function GET(req: Request, context: Context) {
  try {
    const session = await getAdminSession(req);
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized. Admin session required." }, { status: 401 });
    }

    const { id } = await context.params;
    await connectToDatabase();

    const customer = await CustomerUser.findById(id).select("-passwordHash").lean();
    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    const customerEmail = customer.email.toLowerCase();
    const customerId = customer._id.toString();

    const [projects, orders] = await Promise.all([
      WebsiteProject.find({
        $or: [
          { customerEmail },
          { customerId },
        ],
      })
        .select("-passwordHash")
        .sort({ updatedAt: -1 })
        .lean(),
      Order.find({
        "customer.email": customerEmail,
      })
        .sort({ createdAt: -1 })
        .lean(),
    ]);

    return NextResponse.json({
      success: true,
      customer: {
        ...customer,
        _id: customerId,
      },
      projects: projects.map((p: any) => ({
        ...p,
        _id: p._id.toString(),
      })),
      orders: orders.map((o: any) => ({
        ...o,
        _id: o._id.toString(),
      })),
    });
  } catch (error: any) {
    console.error("Admin customer details fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch customer profile" }, { status: 500 });
  }
}

export async function PATCH(req: Request, context: Context) {
  try {
    const session = await getAdminSession(req);
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized. Admin session required." }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await req.json();
    const { action, reason, suspendWebsites } = body;

    if (!["suspend", "reactivate"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid action. Must be 'suspend' or 'reactivate'." },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const customer = await CustomerUser.findById(id);
    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    if (action === "suspend") {
      const suspensionReason = reason?.trim() || "Administrative suspension applied by business owner.";
      customer.isSuspended = true;
      customer.suspendedAt = new Date();
      customer.suspendedReason = suspensionReason;

      await customer.save();

      // Optionally suspend customer's public websites
      if (suspendWebsites === true) {
        await WebsiteProject.updateMany(
          {
            $or: [
              { customerEmail: customer.email.toLowerCase() },
              { customerId: customer._id.toString() },
            ],
            status: "published",
          },
          { status: "suspended" }
        );
      }

      await logAdminAction({
        actor: session.email,
        action: "SUSPEND_CUSTOMER",
        targetType: "customer",
        targetId: customer._id.toString(),
        targetIdentifier: customer.email,
        details: {
          customerName: customer.name,
          reason: suspensionReason,
          websitesSuspended: Boolean(suspendWebsites),
        },
        notes: suspensionReason,
      });

      return NextResponse.json({
        success: true,
        message: `Customer account ${customer.email} has been suspended.`,
        customer: {
          _id: customer._id.toString(),
          name: customer.name,
          email: customer.email,
          isSuspended: true,
          suspendedAt: customer.suspendedAt,
          suspendedReason: customer.suspendedReason,
        },
      });
    } else {
      // Reactivate
      const reactivationReason = reason?.trim() || "Administrative reactivation";
      customer.isSuspended = false;
      customer.suspendedAt = undefined as any;
      customer.suspendedReason = undefined as any;

      await customer.save();

      await logAdminAction({
        actor: session.email,
        action: "REACTIVATE_CUSTOMER",
        targetType: "customer",
        targetId: customer._id.toString(),
        targetIdentifier: customer.email,
        details: {
          customerName: customer.name,
          notes: reactivationReason,
        },
        notes: reactivationReason,
      });

      return NextResponse.json({
        success: true,
        message: `Customer account ${customer.email} has been reactivated.`,
        customer: {
          _id: customer._id.toString(),
          name: customer.name,
          email: customer.email,
          isSuspended: false,
        },
      });
    }
  } catch (error: any) {
    console.error("Admin customer update error:", error);
    return NextResponse.json({ error: "Failed to update customer status" }, { status: 500 });
  }
}
