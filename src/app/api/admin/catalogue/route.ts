import { NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/mongodb";
import { CatalogueProduct } from "@/models/CatalogueProduct";
import { CATALOG_PRODUCTS } from "@/config/products";
import { getAdminSession } from "@/lib/auth";
import { logAdminAction } from "@/lib/audit";

const ProductUpdateSchema = z.object({
  productId: z.string().min(1),
  title: z.string().min(2),
  subtitle: z.string().optional(),
  price: z.number().min(0),
  originalPrice: z.number().min(0).optional(),
  badge: z.string().optional(),
  isActive: z.boolean().default(true),
  description: z.string().optional(),
  features: z.array(z.string()).optional(),
});

export async function GET(req: Request) {
  try {
    const session = await getAdminSession(req);
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized. Admin session required." }, { status: 401 });
    }

    await connectToDatabase();
    const dbProducts = await CatalogueProduct.find().lean();

    // Merge default catalog products with database overrides
    const products = CATALOG_PRODUCTS.map((def) => {
      const match = dbProducts.find((p) => p.productId === def.id || p.slug === def.slug);
      if (match) {
        return {
          ...def,
          title: match.title || def.title,
          subtitle: match.subtitle || def.subtitle,
          price: match.price ?? def.price,
          originalPrice: match.originalPrice ?? def.originalPrice,
          badge: match.badge ?? def.badge,
          isActive: match.isActive ?? true,
          description: match.description || def.description,
          features: match.features?.length ? match.features : def.features,
        };
      }
      return {
        ...def,
        isActive: true,
      };
    });

    return NextResponse.json({ success: true, products });
  } catch (error: any) {
    console.error("Admin catalogue fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch catalogue" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getAdminSession(req);
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized. Admin session required." }, { status: 401 });
    }

    const body = await req.json();
    const validated = ProductUpdateSchema.parse(body);

    await connectToDatabase();

    const def = CATALOG_PRODUCTS.find((p) => p.id === validated.productId);
    if (!def) {
      return NextResponse.json({ error: "Product not found in base catalogue" }, { status: 404 });
    }

    // Upsert catalogue product override
    // SAFEGUARD: This only modifies the storefront catalogue config.
    // It NEVER overwrites or mutates any customer's existing WebsiteProject documents.
    const updated = await CatalogueProduct.findOneAndUpdate(
      { productId: validated.productId },
      {
        productId: validated.productId,
        slug: def.slug,
        occasionType: def.occasionType,
        title: validated.title,
        subtitle: validated.subtitle || "",
        price: validated.price,
        originalPrice: validated.originalPrice || def.originalPrice,
        badge: validated.badge || "",
        isActive: validated.isActive,
        description: validated.description || def.description,
        features: validated.features || def.features,
        demoUrl: def.demoUrl,
      },
      { upsert: true, new: true }
    );

    await logAdminAction({
      actor: session.email,
      action: "UPDATE_CATALOGUE_PRODUCT",
      targetType: "catalogue",
      targetId: validated.productId,
      targetIdentifier: def.slug,
      details: {
        title: validated.title,
        price: validated.price,
        isActive: validated.isActive,
      },
      notes: `Updated catalogue configuration for ${def.title}`,
    });

    return NextResponse.json({
      success: true,
      message: `Product ${def.title} catalogue updated. Existing customer websites are preserved intact.`,
      product: updated,
    });
  } catch (err: any) {
    if (err.name === "ZodError" || err.issues) {
      return NextResponse.json({ error: err.issues?.[0]?.message || "Validation failed" }, { status: 400 });
    }
    console.error("Admin update catalogue error:", err);
    return NextResponse.json({ error: "Failed to update product catalogue" }, { status: 500 });
  }
}
