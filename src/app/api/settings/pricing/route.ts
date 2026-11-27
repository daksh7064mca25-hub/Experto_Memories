import { NextResponse } from "next/server";
import { getEffectivePricing } from "@/lib/pricing";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const { effectivePricing } = await getEffectivePricing();
    const safeManualUpiConfig = effectivePricing.manualUpiConfig
      ? {
          upiId: effectivePricing.manualUpiConfig.upiId,
          displayName: effectivePricing.manualUpiConfig.displayName,
          qrCodeUrl: effectivePricing.manualUpiConfig.qrCodeUrl,
          bankName: effectivePricing.manualUpiConfig.bankName,
        }
      : undefined;

    return NextResponse.json(
      {
        success: true,
        pricing: {
          ...effectivePricing,
          manualUpiConfig: safeManualUpiConfig,
        },
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (err: any) {
    console.error("Failed to fetch platform pricing:", err);
    // Safe fallback preserving existing defaults
    return NextResponse.json(
      {
        success: true,
        pricing: {
          basePrice: 999,
          customDomainPrice: 1200,
          currency: "INR",
          hostingDurationMonths: 12,
          renewalPolicy:
            "1 Year hosting included. Annual hosting renewal applies thereafter. Custom domain renewal after Year 1 is managed directly by you with your domain registrar.",
          cnameTarget: "cname.expertomemories.shop",
          occasionPrices: {
            anniversary: 299,
            apology: 349,
            birthday: 351,
            love: 349,
            wedding: 999,
          },
          products: [],
          paymentMethodsAllowed: "both",
        },
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  }
}
