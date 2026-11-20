import { NextResponse } from "next/server";
import { projectService } from "@/services/project.service";
import { UpdateProjectSchema } from "@/lib/validations/project.schema";
import { getAdminSession, getCustomerSession, verifyWebsiteUnlockToken } from "@/lib/auth";

interface Context {
  params: Promise<{ id: string }>;
}

export async function GET(req: Request, context: Context) {
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

    // If neither admin nor owner, only published projects can be accessed
    if (!isAdmin && !isOwner) {
      if (project.status !== "published") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      // Password Protection Gate: do not leak contents if password protected and signed unlock token is missing or invalid
      if (project.isPasswordProtected && project.passwordHash) {
        const cookieHeader = req.headers.get("cookie") || "";
        let unlockToken = "";
        const match =
          cookieHeader.match(new RegExp(`(?:^|;\\s*)em_unlock_${project.slug}=([^;]*)`)) ||
          cookieHeader.match(new RegExp(`(?:^|;\\s*)em_unlocked_${project.slug}=([^;]*)`));
        if (match && match[1]) {
          unlockToken = decodeURIComponent(match[1].trim());
        }

        const isUnlocked = unlockToken
          ? await verifyWebsiteUnlockToken(unlockToken, project.slug)
          : false;

        if (!isUnlocked) {
          return NextResponse.json(
            {
              error: "Password verification required to view this website.",
              isPasswordProtected: true,
              passwordHint: project.passwordHint,
              slug: project.slug,
            },
            { status: 403 }
          );
        }
      }
    }

    // Never leak passwordHash
    const safeProject: any = { ...project };
    delete safeProject.passwordHash;

    return NextResponse.json({ success: true, project: safeProject });
  } catch (error: any) {
    const isProduction = process.env.NODE_ENV === "production";
    const message = isProduction
      ? "An internal error occurred while fetching the project."
      : error.message || "Failed to fetch project";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(req: Request, context: Context) {
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

    const body = await req.json();
    const validated = UpdateProjectSchema.parse(body);

    const updates: any = { ...validated };

    // Security: Non-admin customers cannot bypass payment or manually publish via PUT
    if (!isAdmin) {
      delete updates.paymentStatus;
      delete updates.paidAt;
      if (updates.status === "published" && project.paymentStatus !== "paid") {
        return NextResponse.json(
          { error: "Payment required before publishing this gift website." },
          { status: 402 }
        );
      }
    }

    // Slug change validation: ensure slug is available
    if (updates.slug && updates.slug !== project.slug) {
      const isAvailable = await projectService.isSlugAvailable(updates.slug, project._id);
      if (!isAvailable) {
        return NextResponse.json(
          { error: "This website URL slug is already taken. Please choose another." },
          { status: 400 }
        );
      }
    }

    const updated = await projectService.update(project._id || id, updates);
    if (!updated) {
      return NextResponse.json(
        { error: "Project not found or could not be updated" },
        { status: 404 }
      );
    }

    const safeUpdated: any = { ...updated };
    delete safeUpdated.passwordHash;

    return NextResponse.json({ success: true, project: safeUpdated });
  } catch (error: any) {
    if (error.name === "ZodError" || error.issues) {
      return NextResponse.json({ error: error.message || "Invalid update data" }, { status: 400 });
    }
    const isProduction = process.env.NODE_ENV === "production";
    const message = isProduction
      ? "Failed to update project due to a database error."
      : error.message || "Failed to update project";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: Context) {
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

    const deleted = await projectService.delete(project._id || id);
    return NextResponse.json({ success: deleted });
  } catch (error: any) {
    const isProduction = process.env.NODE_ENV === "production";
    const message = isProduction
      ? "Failed to delete project due to a database error."
      : error.message || "Failed to delete";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
