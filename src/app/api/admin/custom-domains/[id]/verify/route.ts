import { NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/mongodb";
import { WebsiteProject } from "@/models/WebsiteProject";
import { getAdminSession } from "@/lib/auth";
import { logAdminAction } from "@/lib/audit";

interface Context {
  params: Promise<{ id: string }>;
}

const AdminVerifyDomainSchema = z.object({
  status: z.enum(["connected", "failed", "awaiting_dns_configuration"]),
  notes: z.string().optional(),
});

export async function POST(req: Request, context: Context) {
  try {
    const admin = await getAdminSession(req);
    if (!admin || admin.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized. Admin session required." }, { status: 401 });
    }

    const { id } = await context.params;
    await connectToDatabase();

    const project = await WebsiteProject.findById(id);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const body = await req.json();
    const validated = AdminVerifyDomainSchema.parse(body);

    if (!project.customDomain) {
      return NextResponse.json({ error: "No custom domain requested for this project" }, { status: 400 });
    }

    project.customDomain.status = validated.status as any;
    project.customDomain.verifiedAt = new Date();
    project.customDomain.notes = validated.notes || `Admin marked as ${validated.status}`;

    await project.save();

    await logAdminAction({
      actor: admin.email,
      action: "VERIFY_CUSTOM_DOMAIN",
      targetType: "domain",
      targetId: project._id.toString(),
      targetIdentifier: project.customDomain.domainName,
      details: {
        status: validated.status,
        domain: project.customDomain.domainName,
        projectSlug: project.slug,
        notes: validated.notes,
      },
      notes: validated.notes,
    });

    return NextResponse.json({
      success: true,
      message: `Custom domain status updated to ${validated.status}`,
      customDomain: project.customDomain,
    });
  } catch (err: any) {
    if (err.name === "ZodError" || err.issues) {
      return NextResponse.json({ error: err.issues?.[0]?.message || "Validation failed" }, { status: 400 });
    }
    console.error("Admin domain verify error:", err);
    return NextResponse.json({ error: "Failed to verify custom domain" }, { status: 500 });
  }
}
