import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { getPlatformSettings } from "@/models/PlatformSettings";

export async function GET() {
  try {
    await connectToDatabase();
    const settings = await getPlatformSettings();
    return NextResponse.json({
      success: true,
      pricing: {
        basePrice: settings.basePrice,
        customDomainPrice: settings.customDomainPrice,
        currency: settings.currency || "INR",
        hostingDurationMonths: settings.hostingDurationMonths || 12,
        renewalPolicy: settings.renewalPolicy,
        cnameTarget: settings.cnameTarget || "cname.expertomemories.com",
      },
    });
  } catch (err: any) {
    console.error("Failed to fetch platform settings:", err);
    // Safe fallback
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
      },
    });
  }
}
