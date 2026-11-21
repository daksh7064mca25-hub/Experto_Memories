import { NextResponse } from "next/server";
import { getEffectivePricing } from "@/lib/pricing";

export async function GET() {
  try {
    const { effectivePricing } = await getEffectivePricing();
    return NextResponse.json({
      success: true,
      pricing: effectivePricing,
    });
  } catch (err: any) {
    console.error("Failed to fetch platform pricing:", err);
    // Safe fallback preserving existing defaults
    return NextResponse.json({
      success: true,
      pricing: {
        basePrice: 999,
        customDomainPrice: 1200,
        currency: "INR",
        hostingDurationMonths: 12,
        renewalPolicy:
          "1 Year hosting included. Annual hosting renewal applies thereafter. Custom domain renewal after Year 1 is managed directly by you with your domain registrar.",
        cnameTarget: "cname.expertomemories.com",
        occasionPrices: {
          anniversary: 999,
          apology: 999,
          birthday: 999,
          love: 999,
          wedding: 1499,
        },
        products: [],
      },
    });
  }
}
