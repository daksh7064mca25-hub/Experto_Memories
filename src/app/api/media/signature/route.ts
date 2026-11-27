import { NextResponse } from "next/server";
import { generateUploadSignature } from "@/lib/cloudinary";
import { getAdminSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getAdminSession(req);
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized. Admin session required." }, { status: 401 });
    }

    const { folder = "expertomemories" } = await req.json().catch(() => ({}));
    const signatureData = generateUploadSignature(folder);
    return NextResponse.json({ success: true, ...signatureData });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to generate signature" }, { status: 500 });
  }
}

