import { NextResponse } from "next/server";
import { projectService } from "@/services/project.service";
import { CreateProjectSchema } from "@/lib/validations/project.schema";
import { getAdminSession, getCustomerSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { CatalogueProduct } from "@/models/CatalogueProduct";

export async function GET(req: Request) {
  try {
    const customerSession = await getCustomerSession(req);
    if (!customerSession || customerSession.role !== "customer") {
      return NextResponse.json(
        { error: "Unauthorized. Customer session required." },
        { status: 401 }
      );
    }

    const projects = await projectService.getByCustomer(
      customerSession.userId,
      customerSession.email
    );
    const safeProjects = projects.map((p) => {
      const copy: any = { ...p };
      delete copy.passwordHash;
      delete copy.password;
      return copy;
    });

    return NextResponse.json(
      { success: true, projects: safeProjects },
      {
        headers: {
          "Cache-Control": "private, no-cache, no-store, must-revalidate",
        },
      }
    );
  } catch (error: any) {
    const isProduction = process.env.NODE_ENV === "production";
    const message = isProduction
      ? "An internal error occurred while fetching projects."
      : error.message || "Failed to fetch projects";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const adminSession = await getAdminSession(req);
    const customerSession = await getCustomerSession(req);

    if (!adminSession && !customerSession) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validated = CreateProjectSchema.parse(body);

    await connectToDatabase();
    // Enforce server-side product visibility: reject new creation if occasion is hidden
    const productRecord = await CatalogueProduct.findOne({
      $or: [
        { occasionType: validated.occasionType },
        { slug: validated.occasionType },
      ],
    }).lean();

    if (productRecord && productRecord.isActive === false) {
      return NextResponse.json(
        { error: "This experience is currently unavailable for new creations." },
        { status: 400 }
      );
    }

    const projectPayload: any = {
      ...validated,
    };

    if (customerSession) {
      // Tie customer ID and contact to project
      projectPayload.customerId = customerSession.userId;
      projectPayload.customerEmail = customerSession.email;
      projectPayload.customerPhone = customerSession.phone || validated.customerPhone;
      projectPayload.status = "draft";
      projectPayload.paymentStatus = "unpaid";
    }

    const project = await projectService.create(projectPayload);
    const safeProject: any = { ...project };
    delete safeProject.passwordHash;
    delete safeProject.password;
    return NextResponse.json({ success: true, project: safeProject }, { status: 201 });
  } catch (error: any) {
    if (error.name === "ZodError" || error.issues) {
      return NextResponse.json({ error: error.message || "Invalid input data" }, { status: 400 });
    }
    const isProduction = process.env.NODE_ENV === "production";
    const message = isProduction
      ? "Failed to create project due to a database error."
      : error.message || "Failed to create project";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
