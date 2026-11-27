import { NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/mongodb";
import { getPlatformSettings } from "@/models/PlatformSettings";
import { CatalogueProduct } from "@/models/CatalogueProduct";
import { CATALOG_PRODUCTS } from "@/config/products";
import { getEffectivePricing } from "@/lib/pricing";
import { getAdminSession } from "@/lib/auth";
import { logAdminAction } from "@/lib/audit";

const SettingsUpdateSchema = z.object({
  basePrice: z.number().min(0, "Base price must be positive"),
  customDomainPrice: z.number().min(0, "Custom domain price must be positive"),
  currency: z.string().default("INR"),
  hostingDurationMonths: z.number().min(1).default(12),
  renewalPolicy: z.string().min(5),
  cnameTarget: z.string().min(3).default("cname.expertomemories.shop"),
  paymentMethodsAllowed: z.enum(["both", "razorpay_only", "upi_only"]).default("both"),
  manualUpiConfig: z
    .object({
      bankName: z.string().min(2),
      accountNumber: z.string().min(4),
      ifscCode: z.string().min(4),
      upiId: z.string().min(3),
      displayName: z.string().min(2),
      qrCodeUrl: z.string().default("/images/upi-qr.jpeg"),
    })
    .optional(),
  occasionPrices: z.record(z.string(), z.number().min(0)).optional(),
});

export async function GET(req: Request) {
  try {
    const admin = await getAdminSession(req);
    if (!admin || admin.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized. Admin session required." }, { status: 401 });
    }

    await connectToDatabase();
    const settings = await getPlatformSettings();
    const { effectivePricing } = await getEffectivePricing();

    // Mask sensitive Razorpay info
    const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || "";
    const hasSecret = Boolean(process.env.RAZORPAY_KEY_SECRET);
    const hasWebhookSecret = Boolean(process.env.RAZORPAY_WEBHOOK_SECRET);
    const isTestMode = razorpayKeyId.startsWith("rzp_test_");

    return NextResponse.json({
      success: true,
      settings: {
        basePrice: settings.basePrice,
        customDomainPrice: settings.customDomainPrice,
        currency: settings.currency,
        hostingDurationMonths: settings.hostingDurationMonths,
        renewalPolicy: settings.renewalPolicy,
        cnameTarget: settings.cnameTarget,
        paymentMethodsAllowed: settings.paymentMethodsAllowed || "both",
        manualUpiConfig: settings.manualUpiConfig,
        updatedBy: settings.updatedBy,
        updatedAt: settings.updatedAt,
      },
      occasionPrices: effectivePricing.occasionPrices,
      productPrices: effectivePricing.products,
      gateways: {
        razorpay: {
          keyId: razorpayKeyId ? `${razorpayKeyId.slice(0, 8)}••••••••` : "Not Configured",
          isConfigured: Boolean(razorpayKeyId && hasSecret),
          hasWebhookSecret,
          mode: isTestMode ? "Test Mode" : "Live Production",
          webhookEndpoint: "/api/checkout/webhook",
        },
        manualUpi: {
          configured: Boolean(settings.manualUpiConfig?.upiId),
          upiId: settings.manualUpiConfig?.upiId,
          bankName: settings.manualUpiConfig?.bankName,
          accountNumber: settings.manualUpiConfig?.accountNumber,
          ifscCode: settings.manualUpiConfig?.ifscCode,
        },
      },
    });
  } catch (error: any) {
    console.error("Admin settings fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const admin = await getAdminSession(req);
    if (!admin || admin.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized. Admin session required." }, { status: 401 });
    }

    const body = await req.json();
    const validated = SettingsUpdateSchema.parse(body);

    await connectToDatabase();
    const settings = await getPlatformSettings();

    settings.basePrice = validated.basePrice;
    settings.customDomainPrice = validated.customDomainPrice;
    settings.currency = validated.currency;
    settings.hostingDurationMonths = validated.hostingDurationMonths;
    settings.renewalPolicy = validated.renewalPolicy;
    settings.cnameTarget = validated.cnameTarget;
    settings.paymentMethodsAllowed = validated.paymentMethodsAllowed;
    if (validated.manualUpiConfig) {
      settings.manualUpiConfig = validated.manualUpiConfig as any;
    }
    settings.updatedBy = admin.email;

    await settings.save();

    // If occasion-specific prices are provided, update CatalogueProduct price overrides safely
    // SAFEGUARD: Only update the price field via $set. NEVER overwrite isActive, originalPrice, or metadata.
    if (validated.occasionPrices) {
      for (const [key, price] of Object.entries(validated.occasionPrices)) {
        const def = CATALOG_PRODUCTS.find(
          (p) => p.slug.toLowerCase() === key.toLowerCase() || p.occasionType.toLowerCase() === key.toLowerCase() || p.id.toLowerCase() === key.toLowerCase()
        );
        if (def) {
          await CatalogueProduct.findOneAndUpdate(
            { productId: def.id },
            {
              $set: {
                price: Number(price),
              },
              $setOnInsert: {
                productId: def.id,
                slug: def.slug,
                occasionType: def.occasionType,
                title: def.title,
                subtitle: def.subtitle || "",
                originalPrice: def.originalPrice || Number(price) * 2,
                isActive: true,
                description: def.description,
                features: def.features,
                demoUrl: def.demoUrl,
              },
            },
            { upsert: true, new: true }
          );
        }
      }
    }

    await logAdminAction({
      actor: admin.email,
      action: "UPDATE_PLATFORM_SETTINGS",
      targetType: "pricing",
      targetIdentifier: "pricing-and-gateways",
      details: {
        basePrice: settings.basePrice,
        customDomainPrice: settings.customDomainPrice,
        paymentMethodsAllowed: settings.paymentMethodsAllowed,
        occasionPrices: validated.occasionPrices,
      },
      notes: "Platform pricing and payment gateway configuration updated",
    });

    const { effectivePricing } = await getEffectivePricing();

    return NextResponse.json({
      success: true,
      message: "Platform settings updated successfully",
      settings: {
        basePrice: settings.basePrice,
        customDomainPrice: settings.customDomainPrice,
        currency: settings.currency,
        hostingDurationMonths: settings.hostingDurationMonths,
        renewalPolicy: settings.renewalPolicy,
        cnameTarget: settings.cnameTarget,
        paymentMethodsAllowed: settings.paymentMethodsAllowed,
        manualUpiConfig: settings.manualUpiConfig,
      },
      occasionPrices: effectivePricing.occasionPrices,
      productPrices: effectivePricing.products,
    });
  } catch (err: any) {
    if (err.name === "ZodError" || err.issues) {
      return NextResponse.json({ error: err.issues?.[0]?.message || "Validation failed" }, { status: 400 });
    }
    console.error("Admin update settings error:", err);
    return NextResponse.json({ error: "Failed to update platform settings" }, { status: 500 });
  }
}
