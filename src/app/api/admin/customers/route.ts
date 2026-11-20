import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { CustomerUser } from "@/models/CustomerUser";
import { WebsiteProject } from "@/models/WebsiteProject";
import { Order } from "@/models/Order";
import { getAdminSession } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await getAdminSession(req);
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized. Admin session required." }, { status: 401 });
    }

    const url = new URL(req.url);
    const search = url.searchParams.get("search")?.toLowerCase().trim() || "";
    const status = url.searchParams.get("status"); // "all" | "active" | "suspended"

    await connectToDatabase();

    const query: Record<string, any> = {};
    if (status === "suspended") {
      query.isSuspended = true;
    } else if (status === "active") {
      query.isSuspended = { $ne: true };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    const customers = await CustomerUser.find(query)
      .select("-passwordHash")
      .sort({ createdAt: -1 })
      .lean();

    // Aggregate website and order stats per customer
    const customerEmails = customers.map((c) => c.email.toLowerCase());
    const customerIds = customers.map((c) => c._id.toString());

    const [projects, orders] = await Promise.all([
      WebsiteProject.find({
        $or: [
          { customerEmail: { $in: customerEmails } },
          { customerId: { $in: customerIds } },
        ],
      })
        .select("_id customerEmail customerId status paymentStatus")
        .lean(),
      Order.find({
        "customer.email": { $in: customerEmails },
      })
        .select("_id customer totalAmount paymentStatus paymentMethod createdAt")
        .lean(),
    ]);

    const enrichedCustomers = customers.map((c: any) => {
      const email = c.email.toLowerCase();
      const id = c._id.toString();

      const userProjects = projects.filter(
        (p: any) =>
          (p.customerEmail && p.customerEmail.toLowerCase() === email) ||
          p.customerId === id
      );

      const userOrders = orders.filter(
        (o: any) => o.customer?.email?.toLowerCase() === email
      );

      const paidOrders = userOrders.filter((o: any) => o.paymentStatus === "paid");
      const totalSpend = paidOrders.reduce((sum: number, o: any) => sum + (o.totalAmount || 0), 0);

      const projectStats = {
        total: userProjects.length,
        published: userProjects.filter((p: any) => p.status === "published").length,
        draft: userProjects.filter((p: any) => p.status === "draft").length,
        suspended: userProjects.filter((p: any) => p.status === "suspended").length,
      };

      const orderStats = {
        total: userOrders.length,
        paidCount: paidOrders.length,
        totalSpend,
        razorpayCount: userOrders.filter((o: any) => o.paymentMethod === "razorpay").length,
        upiCount: userOrders.filter((o: any) => ["upi", "manual_upi"].includes(o.paymentMethod)).length,
      };

      return {
        _id: id,
        name: c.name,
        email: c.email,
        phone: c.phone || "",
        isSuspended: Boolean(c.isSuspended),
        suspendedAt: c.suspendedAt || null,
        suspendedReason: c.suspendedReason || "",
        createdAt: c.createdAt,
        projectStats,
        orderStats,
      };
    });

    return NextResponse.json({
      success: true,
      customers: enrichedCustomers,
      totalCount: enrichedCustomers.length,
    });
  } catch (error: any) {
    console.error("Admin customers fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
  }
}
