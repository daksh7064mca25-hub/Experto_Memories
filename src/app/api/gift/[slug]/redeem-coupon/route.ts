import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { projectService } from "@/services/project.service";
import { WebsiteProject } from "@/models/WebsiteProject";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    if (slug === "demo" || slug === "demo-apology" || slug.startsWith("demo-")) {
      return NextResponse.json({ redemptions: {}, maxRedemptions: 2 });
    }

    const project = await projectService.getBySlug(slug);
    if (!project) {
      return NextResponse.json({ error: "Gift project not found" }, { status: 404 });
    }
    if (project.status !== "published") {
      return NextResponse.json({ error: "This gift experience is not published yet." }, { status: 403 });
    }

    const couponSection = project.sections?.find((s) => s.type === "coupon_book");
    const maxRedemptions = couponSection?.config?.maxRedemptions ?? 2;
    const redemptions = project.couponRedemptions || {};

    return NextResponse.json({ redemptions, maxRedemptions });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch redemptions" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const body = await req.json();
    const { couponId } = body;
    if (!couponId || typeof couponId !== "string") {
      return NextResponse.json({ error: "couponId is required" }, { status: 400 });
    }

    const dateStr = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    // Handle interactive demo slugs gracefully without requiring DB records
    if (slug === "demo" || slug === "demo-apology" || slug.startsWith("demo-")) {
      return NextResponse.json({
        success: true,
        couponId,
        dateStr,
        redemptions: { [couponId]: dateStr },
        remaining: 1,
      });
    }

    const project = await projectService.getBySlug(slug);
    if (!project) {
      return NextResponse.json({ error: "Gift project not found" }, { status: 404 });
    }
    if (project.status !== "published") {
      return NextResponse.json({ error: "This gift experience is not published yet." }, { status: 403 });
    }

    const couponSection = project.sections?.find((s) => s.type === "coupon_book");
    const maxRedemptions = couponSection?.config?.maxRedemptions ?? 2;
    const coupons = couponSection?.config?.coupons || [];

    const couponExists = coupons.some((c: any) => c.id === couponId);
    if (!couponExists) {
      return NextResponse.json({ error: "Coupon not found in this gift" }, { status: 404 });
    }

    const currentRedemptions = (project.couponRedemptions || {}) as Record<string, string>;

    if (currentRedemptions[couponId]) {
      return NextResponse.json(
        { error: "This coupon has already been redeemed." },
        { status: 400 }
      );
    }

    const redeemedCount = Object.keys(currentRedemptions).length;
    if (redeemedCount >= maxRedemptions) {
      return NextResponse.json(
        { error: `Redemption limit reached (${maxRedemptions} maximum allowed).` },
        { status: 400 }
      );
    }

    const updatedRedemptions = {
      ...currentRedemptions,
      [couponId]: dateStr,
    };

    // Persist to MongoDB
    const conn = await connectToDatabase();
    if (conn) {
      await WebsiteProject.updateOne(
        { slug },
        { $set: { [`couponRedemptions.${couponId}`]: dateStr } }
      );
    }

    // Also update in-memory object (for dev/test or cached store)
    project.couponRedemptions = updatedRedemptions;

    const remaining = Math.max(0, maxRedemptions - Object.keys(updatedRedemptions).length);

    return NextResponse.json({
      success: true,
      couponId,
      dateStr,
      redemptions: updatedRedemptions,
      remaining,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to redeem coupon" },
      { status: 500 }
    );
  }
}
