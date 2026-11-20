import { NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/mongodb";
import { WebsiteProject } from "@/models/WebsiteProject";
import { getPlatformSettings } from "@/models/PlatformSettings";
import { getAdminSession, getCustomerSession } from "@/lib/auth";

interface Context {
  params: Promise<{ id: string }>;
}

const CustomDomainSchema = z.object({
  domainName: z.string().trim().toLowerCase(),
  action: z
    .enum(["update_domain", "confirm_registered", "request_verification"])
    .default("update_domain"),
});

export async function POST(req: Request, context: Context) {
  try {
    const { id } = await context.params;
    await connectToDatabase();

    let project = await WebsiteProject.findById(id);
    if (!project) {
      project = await WebsiteProject.findOne({ slug: id });
    }

    if (!project) {
      return NextResponse.json({ error: "Website project not found" }, { status: 404 });
    }

    const adminSession = await getAdminSession(req);
    const customerSession = await getCustomerSession(req);

    const isAdmin = Boolean(adminSession && adminSession.role === "admin");
    const isOwner = Boolean(
      customerSession &&
        (project.customerId?.toString() === customerSession.userId ||
          (project.customerEmail &&
            project.customerEmail.toLowerCase() === customerSession.email.toLowerCase()))
    );

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: "Unauthorized access to project" }, { status: 401 });
    }

    const body = await req.json();
    const validated = CustomDomainSchema.parse(body);

    const domain = validated.domainName.replace(/^https?:\/\//i, "").replace(/\/+$/, "");

    // Validate domain format
    const domainRegex = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i;
    if (!domainRegex.test(domain)) {
      return NextResponse.json(
        { error: "Invalid domain format. Example: mylovesite.com or riyaandrahul.in" },
        { status: 400 }
      );
    }

    // Prohibit reserved hostnames
    if (
      domain === "localhost" ||
      domain.endsWith(".local") ||
      domain.includes("expertomemories.com") ||
      domain.includes("vercel.app")
    ) {
      return NextResponse.json(
        { error: "This domain cannot be used as a custom domain." },
        { status: 400 }
      );
    }

    const settings = await getPlatformSettings();
    const cnameTarget = settings.cnameTarget || "cname.expertomemories.com";

    // Current custom domain state
    const currentCustomDomain = project.customDomain || {
      requested: true,
      status: "not_requested",
      dnsInstructions: { recordType: "CNAME", host: "@", target: cnameTarget },
    };

    let nextStatus = currentCustomDomain.status || "not_requested";

    if (validated.action === "confirm_registered") {
      nextStatus = "awaiting_dns_configuration";
    } else if (validated.action === "request_verification") {
      nextStatus = "verification_pending";
    } else if (nextStatus === "not_requested" || nextStatus === "awaiting_customer_registration") {
      nextStatus = "awaiting_dns_configuration";
    }

    project.customDomain = {
      requested: true,
      domainName: domain,
      status: nextStatus as any,
      dnsInstructions: {
        recordType: "CNAME",
        host: "@",
        target: cnameTarget,
      },
      notes:
        validated.action === "request_verification"
          ? "Customer submitted DNS configuration for admin verification."
          : currentCustomDomain.notes || "Custom domain configured.",
    };

    await project.save();

    return NextResponse.json({
      success: true,
      customDomain: project.customDomain,
      dnsInstructions: {
        recordType: "CNAME",
        host: "@",
        target: cnameTarget,
        instructions: [
          `1. Log in to your domain registrar (GoDaddy, Namecheap, Google Domains, Hostinger, etc.).`,
          `2. Navigate to your DNS Management or DNS Zone Settings for ${domain}.`,
          `3. Add a CNAME record with Host: @ (or www) pointing to: ${cnameTarget}`,
          `4. Once saved in your registrar, return here and click 'Request Verification'.`,
          `5. Our team will verify the DNS propagation and connect your custom domain!`,
        ],
      },
    });
  } catch (err: any) {
    if (err.name === "ZodError" || err.issues) {
      return NextResponse.json(
        { error: err.issues?.[0]?.message || "Invalid domain request" },
        { status: 400 }
      );
    }
    console.error("Custom domain error:", err);
    return NextResponse.json({ error: "Failed to update custom domain settings" }, { status: 500 });
  }
}
