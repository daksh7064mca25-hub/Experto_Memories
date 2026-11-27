import { NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/mongodb";
import { CatalogueProduct } from "@/models/CatalogueProduct";
import { CATALOG_PRODUCTS } from "@/config/products";
import { getAdminSession } from "@/lib/auth";
import { logAdminAction } from "@/lib/audit";

const ProductUpdateSchema = z.object({
  productId: z.string().min(1),
  title: z.string().min(2).optional(),
  subtitle: z.string().optional(),
  price: z.number().min(0).optional(),
  originalPrice: z.number().min(0).optional(),
  badge: z.string().optional(),
  isActive: z.boolean().optional(),
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

    // Build safe partial update so fields not explicitly provided are NOT overwritten
    const updateSet: Record<string, any> = {};
    if (validated.title !== undefined) updateSet.title = validated.title;
    if (validated.subtitle !== undefined) updateSet.subtitle = validated.subtitle;
    if (validated.price !== undefined) updateSet.price = validated.price;
    if (validated.originalPrice !== undefined) updateSet.originalPrice = validated.originalPrice;
    if (validated.badge !== undefined) updateSet.badge = validated.badge;
    if (validated.isActive !== undefined) updateSet.isActive = validated.isActive;
    if (validated.description !== undefined) updateSet.description = validated.description;
    if (validated.features !== undefined) updateSet.features = validated.features;

    const setOnInsert: Record<string, any> = {
      productId: def.id,
      slug: def.slug,
      occasionType: def.occasionType,
      demoUrl: def.demoUrl,
    };
    if (updateSet.title === undefined) setOnInsert.title = def.title;
    if (updateSet.subtitle === undefined) setOnInsert.subtitle = def.subtitle || "";
    if (updateSet.price === undefined) setOnInsert.price = def.price;
    if (updateSet.originalPrice === undefined) setOnInsert.originalPrice = def.originalPrice;
    if (updateSet.badge === undefined) setOnInsert.badge = def.badge || "";
    if (updateSet.isActive === undefined) setOnInsert.isActive = true;
    if (updateSet.description === undefined) setOnInsert.description = def.description;
    if (updateSet.features === undefined) setOnInsert.features = def.features;

    // Upsert catalogue product override safely
    // SAFEGUARD: This only modifies the storefront catalogue config.
    // It NEVER overwrites or mutates any customer's existing WebsiteProject documents.
    const updated = await CatalogueProduct.findOneAndUpdate(
      { productId: validated.productId },
      {
        $set: updateSet,
        $setOnInsert: setOnInsert,
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
        title: updated.title,
        price: updated.price,
        originalPrice: updated.originalPrice,
        isActive: updated.isActive,
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
    return NextResponse.json({ error: "Failed to update product catalogue", details: err?.message || String(err) }, { status: 500 });
  }
}
