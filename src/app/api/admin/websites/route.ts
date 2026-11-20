import { NextResponse } from "next/server";
import { projectService } from "@/services/project.service";
import { getAdminSession } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await getAdminSession(req);
    if (!session || session.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized. Admin session required." },
        { status: 401 }
      );
    }

    const projects = await projectService.getAll();
    const safeProjects = projects.map((p) => {
      const copy: any = { ...p };
      delete copy.passwordHash;
      delete copy.password;
      return copy;
    });

    return NextResponse.json({
      success: true,
      projects: safeProjects,
    });
  } catch (error: any) {
    console.error("Admin websites fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch platform websites" },
      { status: 500 }
    );
  }
}
