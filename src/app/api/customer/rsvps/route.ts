import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { getCustomerSession } from "@/lib/auth";
import { projectService } from "@/services/project.service";
import { WeddingRSVP } from "@/models/WeddingRSVP";

export async function GET(req: NextRequest) {
  try {
    const session = await getCustomerSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const customerProjects = await projectService.getByCustomer(
      session.userId,
      session.email
    );

    const weddingProjects = customerProjects.filter(
      (p) => p.occasionType === "wedding"
    );

    if (weddingProjects.length === 0) {
      return NextResponse.json({
        rsvps: [],
        stats: { total: 0, attending: 0, declined: 0, totalGuests: 0 },
      });
    }

    const slugs = weddingProjects.map((p) => p.slug);

    const conn = await connectToDatabase();
    if (conn) {
      const rsvpDocs = await WeddingRSVP.find({ projectSlug: { $in: slugs } })
        .sort({ submittedAt: -1 })
        .lean();

      let totalGuests = 0;
      let attendingCount = 0;
      let declinedCount = 0;

      const rsvps = (rsvpDocs || []).map((doc: any) => {
        if (doc.attendanceStatus === "attending") {
          attendingCount++;
          totalGuests += doc.guestCount || 1;
        } else if (doc.attendanceStatus === "declined") {
          declinedCount++;
        }
        return {
          ...doc,
          _id: doc._id.toString(),
          projectId: doc.projectId?.toString(),
        };
      });

      return NextResponse.json({
        rsvps,
        stats: {
          total: rsvps.length,
          attending: attendingCount,
          declined: declinedCount,
          totalGuests,
        },
      });
    }

    return NextResponse.json({
      rsvps: [],
      stats: { total: 0, attending: 0, declined: 0, totalGuests: 0 },
    });
  } catch (error: any) {
    console.error("Error fetching customer RSVPs:", error);
    return NextResponse.json(
      { error: error.message || "Failed to load RSVPs" },
      { status: 500 }
    );
  }
}
