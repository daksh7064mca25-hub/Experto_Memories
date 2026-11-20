import { NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/mongodb";
import { getPlatformSettings } from "@/models/PlatformSettings";
import { getAdminSession } from "@/lib/auth";

const UpdatePricingSchema = z.object({
  basePrice: z.number().min(0, "Base price must be positive"),
  customDomainPrice: z.number().min(0, "Custom domain price must be positive"),
  currency: z.string().default("INR"),
  hostingDurationMonths: z.number().min(1).default(12),
  renewalPolicy: z.string().min(5),
  cnameTarget: z.string().min(3).default("cname.expertomemories.com"),
});

export async function PUT(req: Request) {
  try {
    const admin = await getAdminSession(req);
    if (!admin || admin.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validated = UpdatePricingSchema.parse(body);

    await connectToDatabase();
    const settings = await getPlatformSettings();

    settings.basePrice = validated.basePrice;
    settings.customDomainPrice = validated.customDomainPrice;
    settings.currency = validated.currency;
    settings.hostingDurationMonths = validated.hostingDurationMonths;
    settings.renewalPolicy = validated.renewalPolicy;
    settings.cnameTarget = validated.cnameTarget;
    settings.updatedBy = admin.email;

    await settings.save();

    return NextResponse.json({
      success: true,
      pricing: {
        basePrice: settings.basePrice,
        customDomainPrice: settings.customDomainPrice,
        currency: settings.currency,
        hostingDurationMonths: settings.hostingDurationMonths,
        renewalPolicy: settings.renewalPolicy,
        cnameTarget: settings.cnameTarget,
      },
    });
  } catch (err: any) {
    if (err.name === "ZodError" || err.issues) {
      return NextResponse.json({ error: err.issues?.[0]?.message || "Validation failed" }, { status: 400 });
    }
    console.error("Admin update pricing error:", err);
    return NextResponse.json({ error: "Failed to update pricing settings" }, { status: 500 });
  }
}
