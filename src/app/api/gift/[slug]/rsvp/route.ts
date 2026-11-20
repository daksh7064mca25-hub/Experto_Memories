import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { projectService } from "@/services/project.service";
import { WeddingRSVP } from "@/models/WeddingRSVP";
import crypto from "crypto";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    if (slug === "demo-wedding" || slug.startsWith("demo-wedding")) {
      return NextResponse.json({
        success: true,
        message: "Demo RSVP recorded successfully",
        rsvpId: `demo-rsvp-${Date.now()}`,
      });
    }

    const project = await projectService.getBySlug(slug);
    if (!project) {
      return NextResponse.json({ error: "Wedding project not found" }, { status: 404 });
    }

    const body = await req.json();
    const {
      guestName,
      guestEmail,
      guestPhone,
      attendanceStatus = "attending",
      guestCount = 1,
      attendingEvents = [],
      dietaryNotes,
      personalBlessing,
    } = body;

    if (!guestName || typeof guestName !== "string" || !guestName.trim()) {
      return NextResponse.json({ error: "Guest name is required" }, { status: 400 });
    }

    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown-ip";
    const ipHash = crypto.createHash("sha256").update(clientIp).digest("hex").slice(0, 16);

    const conn = await connectToDatabase();
    if (conn) {
      const rsvpDoc = await WeddingRSVP.create({
        projectId: project._id,
        projectSlug: slug,
        guestName: guestName.trim(),
        guestEmail: guestEmail?.trim()?.toLowerCase(),
        guestPhone: guestPhone?.trim(),
        attendanceStatus,
        guestCount: Math.max(1, Math.min(20, Number(guestCount) || 1)),
        attendingEvents: Array.isArray(attendingEvents) ? attendingEvents : [],
        dietaryNotes: dietaryNotes?.trim(),
        personalBlessing: personalBlessing?.trim(),
        isApproved: true,
        ipHash,
        submittedAt: new Date(),
      });

      return NextResponse.json({
        success: true,
        message: "RSVP recorded successfully",
        rsvpId: rsvpDoc._id.toString(),
      });
    }

    // In-memory / development fallback
    return NextResponse.json({
      success: true,
      message: "RSVP recorded in memory mode",
      rsvpId: `mem-${Date.now()}`,
    });
  } catch (error: any) {
    console.error("Error in wedding RSVP endpoint:", error);
    return NextResponse.json(
      { error: error.message || "Failed to submit RSVP" },
      { status: 500 }
    );
  }
}
