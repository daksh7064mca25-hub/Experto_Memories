import { NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/mongodb";
import { getPlatformSettings } from "@/models/PlatformSettings";
import { CatalogueProduct } from "@/models/CatalogueProduct";
import { CATALOG_PRODUCTS } from "@/config/products";
import { getEffectivePricing } from "@/lib/pricing";
import { getAdminSession } from "@/lib/auth";

const UpdatePricingSchema = z.object({
  basePrice: z.number().min(0, "Base price must be positive"),
  customDomainPrice: z.number().min(0, "Custom domain price must be positive"),
  currency: z.string().default("INR"),
  hostingDurationMonths: z.number().min(1).default(12),
  renewalPolicy: z.string().min(5),
  cnameTarget: z.string().min(3).default("cname.expertomemories.com"),
  occasionPrices: z.record(z.string(), z.number().min(0)).optional(),
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

    if (validated.occasionPrices) {
      for (const [key, price] of Object.entries(validated.occasionPrices)) {
        const def = CATALOG_PRODUCTS.find(
          (p) =>
            p.slug.toLowerCase() === key.toLowerCase() ||
            p.occasionType.toLowerCase() === key.toLowerCase() ||
            p.id.toLowerCase() === key.toLowerCase()
        );
        if (def) {
          await CatalogueProduct.findOneAndUpdate(
            { productId: def.id },
            {
              productId: def.id,
              slug: def.slug,
              occasionType: def.occasionType,
              title: def.title,
              subtitle: def.subtitle || "",
              price: Number(price),
              originalPrice: def.originalPrice || Number(price) * 2,
              isActive: true,
              description: def.description,
              features: def.features,
              demoUrl: def.demoUrl,
            },
            { upsert: true, new: true }
          );
        }
      }
    }

    const { effectivePricing } = await getEffectivePricing();

    return NextResponse.json({
      success: true,
      pricing: {
        basePrice: settings.basePrice,
        customDomainPrice: settings.customDomainPrice,
        currency: settings.currency,
        hostingDurationMonths: settings.hostingDurationMonths,
        renewalPolicy: settings.renewalPolicy,
        cnameTarget: settings.cnameTarget,
        occasionPrices: effectivePricing.occasionPrices,
        products: effectivePricing.products,
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
