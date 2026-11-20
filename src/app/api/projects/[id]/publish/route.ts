import { NextResponse } from "next/server";
import { projectService } from "@/services/project.service";
import { getAdminSession, getCustomerSession } from "@/lib/auth";
import { logAdminAction } from "@/lib/audit";

interface Context {
  params: Promise<{ id: string }>;
}

export async function POST(req: Request, context: Context) {
  try {
    const { id } = await context.params;
    let project = await projectService.getById(id);
    if (!project) {
      project = await projectService.getBySlug(id);
    }

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const adminSession = await getAdminSession(req);
    const customerSession = await getCustomerSession(req);

    const isAdmin = Boolean(adminSession && adminSession.role === "admin");
    const isOwner = Boolean(
      customerSession &&
        ((project.customerId && project.customerId.toString() === customerSession.userId) ||
          (project.customerEmail &&
            project.customerEmail.toLowerCase() === customerSession.email.toLowerCase()))
    );

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const action = body.action || "publish"; // "publish" | "unpublish" | "suspend" | "reactivate" | "extend_hosting"
    const reason = body.reason?.trim() || "";

    // Backend Publishing Lock: Customers CANNOT publish unpaid projects
    if (!isAdmin && action === "publish") {
      if (project.paymentStatus !== "paid") {
        return NextResponse.json(
          {
            error:
              "Payment required before publishing. Please complete payment to unlock your shareable website link.",
          },
          { status: 402 }
        );
      }
    }

    let updated;
    const now = new Date();
    const hostingMonths = project.hostingDurationMonths || 12;
    const currentExpiry = project.hostingExpiresAt ? new Date(project.hostingExpiresAt) : new Date(now.getTime() + hostingMonths * 30 * 24 * 3600 * 1000);

    if (action === "unpublish") {
      updated = await projectService.unpublish(project._id || id);
      if (isAdmin && adminSession) {
        await logAdminAction({
          actor: adminSession.email,
          action: "UNPUBLISH_WEBSITE",
          targetType: "website",
          targetId: project._id,
          targetIdentifier: project.slug,
          details: { title: project.title, customerEmail: project.customerEmail },
        });
      }
    } else if (action === "suspend") {
      if (!isAdmin) {
        return NextResponse.json({ error: "Only admins can suspend websites" }, { status: 403 });
      }
      updated = await projectService.update(project._id || id, { status: "suspended" });
      if (adminSession) {
        await logAdminAction({
          actor: adminSession.email,
          action: "SUSPEND_WEBSITE",
          targetType: "website",
          targetId: project._id,
          targetIdentifier: project.slug,
          details: { reason, title: project.title, customerEmail: project.customerEmail },
          notes: reason || "Administrative suspension",
        });
      }
    } else if (action === "reactivate") {
      if (!isAdmin) {
        return NextResponse.json({ error: "Only admins can reactivate suspended websites" }, { status: 403 });
      }
      updated = await projectService.update(project._id || id, { status: "published" });
      if (adminSession) {
        await logAdminAction({
          actor: adminSession.email,
          action: "REACTIVATE_WEBSITE",
          targetType: "website",
          targetId: project._id,
          targetIdentifier: project.slug,
          details: { reason, title: project.title, customerEmail: project.customerEmail },
          notes: reason || "Administrative reactivation",
        });
      }
    } else if (action === "extend_hosting") {
      if (!isAdmin) {
        return NextResponse.json({ error: "Only admins can extend website hosting" }, { status: 403 });
      }
      const additionalMonths = Number(body.extendMonths || 12);
      const newExpiry = new Date(
        (currentExpiry > now ? currentExpiry : now).getTime() + additionalMonths * 30 * 24 * 3600 * 1000
      );
      updated = await projectService.update(project._id || id, { hostingExpiresAt: newExpiry });
      if (adminSession) {
        await logAdminAction({
          actor: adminSession.email,
          action: "EXTEND_HOSTING",
          targetType: "website",
          targetId: project._id,
          targetIdentifier: project.slug,
          details: {
            previousExpiry: currentExpiry,
            newExpiry,
            additionalMonths,
            title: project.title,
            customerEmail: project.customerEmail,
          },
          notes: `Extended hosting by ${additionalMonths} months`,
        });
      }
    } else {
      // Validate slug uniqueness before publish
      const isAvailable = await projectService.isSlugAvailable(project.slug, project._id);
      if (!isAvailable) {
        return NextResponse.json(
          { error: "Slug is already in use by another website. Please change slug before publishing." },
          { status: 400 }
        );
      }

      updated = await projectService.update(project._id || id, {
        status: "published",
        publishedAt: now,
        hostingExpiresAt: currentExpiry,
      });

      if (isAdmin && adminSession) {
        await logAdminAction({
          actor: adminSession.email,
          action: "PUBLISH_WEBSITE",
          targetType: "website",
          targetId: project._id,
          targetIdentifier: project.slug,
          details: { title: project.title, customerEmail: project.customerEmail },
        });
      }
    }

    if (!updated) {
      return NextResponse.json({ error: "Project could not be updated" }, { status: 404 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || "http://localhost:3000";
    const publicUrl = `${baseUrl}/gift/${updated.slug}`;

    const safeProject: any = { ...updated };
    delete safeProject.passwordHash;

    return NextResponse.json({
      success: true,
      project: safeProject,
      publicUrl,
      status: safeProject.status,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update status" }, { status: 500 });
  }
}
