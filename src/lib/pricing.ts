import { connectToDatabase } from "@/lib/mongodb";
import { getPlatformSettings } from "@/models/PlatformSettings";
import { CatalogueProduct } from "@/models/CatalogueProduct";
import { CATALOG_PRODUCTS } from "@/config/products";

export interface OccasionPricingInfo {
  id: string;
  slug: string;
  title: string;
  occasionType: string;
  price: number;
  originalPrice: number;
  isCustomPrice: boolean;
  isActive: boolean;
}

export interface EffectivePricingResult {
  basePrice: number;
  customDomainPrice: number;
  currency: string;
  hostingDurationMonths: number;
  renewalPolicy: string;
  cnameTarget: string;
  occasionPrices: Record<string, number>;
  products: OccasionPricingInfo[];
}

/**
 * Computes authoritative server-side pricing by merging:
 * 1. Global PlatformSettings (basePrice, customDomainPrice)
 * 2. Database CatalogueProduct overrides
 * 3. Base catalog defaults (CATALOG_PRODUCTS)
 *
 * If occasionOrSlug is provided, resolves the specific productPrice.
 */
export async function getEffectivePricing(occasionOrSlug?: string): Promise<{
  productPrice: number;
  basePrice: number;
  customDomainPrice: number;
  effectivePricing: EffectivePricingResult;
}> {
  await connectToDatabase();

  let settings;
  try {
    settings = await getPlatformSettings();
  } catch (err) {
    console.warn("Failed to load PlatformSettings in getEffectivePricing, using defaults:", err);
    settings = {
      basePrice: 999,
      customDomainPrice: 1200,
      currency: "INR",
      hostingDurationMonths: 12,
      renewalPolicy:
        "1 Year hosting included. Annual hosting renewal applies thereafter. Custom domain renewal after Year 1 is managed directly by you with your domain registrar.",
      cnameTarget: "cname.expertomemories.com",
    };
  }

  const basePrice = settings.basePrice || 999;
  const customDomainPrice = settings.customDomainPrice || 1200;
  const currency = settings.currency || "INR";
  const hostingDurationMonths = settings.hostingDurationMonths || 12;
  const renewalPolicy =
    settings.renewalPolicy ||
    "1 Year hosting included. Annual hosting renewal applies thereafter. Custom domain renewal after Year 1 is managed directly by you with your domain registrar.";
  const cnameTarget = settings.cnameTarget || "cname.expertomemories.com";

  let dbProducts: any[] = [];
  try {
    dbProducts = await CatalogueProduct.find().lean();
  } catch (err) {
    console.warn("Failed to load CatalogueProduct in getEffectivePricing:", err);
  }

  const occasionPrices: Record<string, number> = {};
  const products: OccasionPricingInfo[] = [];

  for (const def of CATALOG_PRODUCTS) {
    const override = dbProducts.find(
      (p) => p.productId === def.id || p.slug === def.slug || p.occasionType === def.occasionType
    );

    const price =
      override && typeof override.price === "number" && override.price >= 0
        ? override.price
        : typeof def.price === "number"
        ? def.price
        : basePrice;

    const originalPrice =
      override && typeof override.originalPrice === "number" && override.originalPrice >= 0
        ? override.originalPrice
        : def.originalPrice || price * 2;

    const isCustomPrice = Boolean(override && typeof override.price === "number");
    const isActive = override?.isActive !== undefined ? Boolean(override.isActive) : true;

    // Register by slug, occasionType, and product ID for seamless lookup
    occasionPrices[def.slug.toLowerCase()] = price;
    occasionPrices[def.occasionType.toLowerCase()] = price;
    occasionPrices[def.id.toLowerCase()] = price;

    products.push({
      id: def.id,
      slug: def.slug,
      title: override?.title || def.title,
      occasionType: def.occasionType,
      price,
      originalPrice,
      isCustomPrice,
      isActive,
    });
  }

  // Determine price for requested occasion or slug
  let productPrice = basePrice;
  if (occasionOrSlug) {
    const key = occasionOrSlug.toLowerCase().trim();
    if (occasionPrices[key] !== undefined) {
      productPrice = occasionPrices[key];
    } else {
      // Check partial match (e.g. "wedding" in "prod-wedding")
      const found = products.find(
        (p) =>
          p.slug.toLowerCase() === key ||
          p.occasionType.toLowerCase() === key ||
          p.id.toLowerCase() === key
      );
      if (found) {
        productPrice = found.price;
      }
    }
  }

  return {
    productPrice,
    basePrice,
    customDomainPrice,
    effectivePricing: {
      basePrice,
      customDomainPrice,
      currency,
      hostingDurationMonths,
      renewalPolicy,
      cnameTarget,
      occasionPrices,
      products,
    },
  };
}
