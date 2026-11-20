import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { AdminAuditLog } from "@/models/AdminAuditLog";
import { getAdminSession } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await getAdminSession(req);
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized. Admin session required." }, { status: 401 });
    }

    const url = new URL(req.url);
    const targetType = url.searchParams.get("targetType");
    const action = url.searchParams.get("action");
    const limit = Math.min(Number(url.searchParams.get("limit") || 100), 200);

    await connectToDatabase();

    const query: Record<string, any> = {};
    if (targetType && targetType !== "all") {
      query.targetType = targetType;
    }
    if (action && action !== "all") {
      query.action = action.toUpperCase();
    }

    const logs = await AdminAuditLog.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      logs: logs.map((log: any) => ({
        ...log,
        _id: log._id.toString(),
      })),
      count: logs.length,
    });
  } catch (error: any) {
    console.error("Admin audit log fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch audit log" }, { status: 500 });
  }
}
