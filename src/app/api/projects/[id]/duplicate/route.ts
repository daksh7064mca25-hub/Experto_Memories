import { NextResponse } from "next/server";
import { projectService } from "@/services/project.service";
import { getAdminSession, getCustomerSession } from "@/lib/auth";

interface Context {
  params: Promise<{ id: string }>;
}

export async function POST(req: Request, context: Context) {
  try {
    const { id } = await context.params;
    let source = await projectService.getById(id);
    if (!source) {
      source = await projectService.getBySlug(id);
    }

    if (!source) {
      return NextResponse.json({ error: "Source project not found" }, { status: 404 });
    }

    const adminSession = await getAdminSession(req);
    const customerSession = await getCustomerSession(req);

    const isAdmin = Boolean(adminSession && adminSession.role === "admin");
    const isOwner = Boolean(
      customerSession &&
        ((source.customerId && source.customerId.toString() === customerSession.userId) ||
          (source.customerEmail &&
            source.customerEmail.toLowerCase() === customerSession.email.toLowerCase()))
    );

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: "Unauthorized access to project" }, { status: 401 });
    }

    const duplicated = await projectService.duplicate(source._id || id);
    if (!duplicated) {
      return NextResponse.json({ error: "Failed to duplicate project" }, { status: 500 });
    }

    // Ensure duplicated project has reset payment and publication status
    const overrides: any = {
      status: "draft",
      paymentStatus: "unpaid",
      paidAt: null,
      publishedAt: null,
    };
    if (customerSession && !isAdmin) {
      overrides.customerId = customerSession.userId;
      overrides.customerEmail = customerSession.email;
    }

    const updated = await projectService.update(duplicated._id || "", overrides);

    return NextResponse.json({ success: true, project: updated || duplicated }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to duplicate project" }, { status: 500 });
  }
}

