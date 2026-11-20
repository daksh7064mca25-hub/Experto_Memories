import { NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/mongodb";
import { WebsiteProject } from "@/models/WebsiteProject";
import { comparePassword, isSecureCookie, signWebsiteUnlockToken } from "@/lib/auth";

interface Context {
  params: Promise<{ slug: string }>;
}

const PasswordSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

export async function POST(req: Request, context: Context) {
  try {
    const { slug } = await context.params;
    await connectToDatabase();

    const project = await WebsiteProject.findOne({ slug });
    if (!project) {
      return NextResponse.json({ error: "Website not found" }, { status: 404 });
    }

    if (!project.isPasswordProtected || !project.passwordHash) {
      return NextResponse.json({ success: true, unlocked: true });
    }

    const body = await req.json();
    const validated = PasswordSchema.parse(body);

    const isMatch = await comparePassword(validated.password, project.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Incorrect password. Please check and try again." },
        { status: 401 }
      );
    }

    const unlockToken = await signWebsiteUnlockToken(slug);

    const res = NextResponse.json({
      success: true,
      unlocked: true,
      message: "Password verified successfully",
      token: unlockToken,
    });

    // Issue tamper-resistant HTTP-only signed unlock cookie (supporting both em_unlock_ and em_unlocked_ for compatibility)
    const cookieOptions = {
      httpOnly: true,
      secure: isSecureCookie(req),
      sameSite: "lax" as const,
      maxAge: 60 * 60 * 24 * 7, // 7 days unlocked
      path: "/",
    };

    res.cookies.set(`em_unlock_${slug}`, unlockToken, cookieOptions);
    res.cookies.set(`em_unlocked_${slug}`, unlockToken, cookieOptions);

    return res;
  } catch (err: any) {
    if (err.name === "ZodError" || err.issues) {
      return NextResponse.json({ error: err.issues?.[0]?.message || "Password is required" }, { status: 400 });
    }
    console.error("Password verification error:", err);
    return NextResponse.json({ error: "Verification failed. Please try again." }, { status: 500 });
  }
}
