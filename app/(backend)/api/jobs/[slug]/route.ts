// app/api/jobs/[slug]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/(backend)/lib/mongodb";
import JobPost from "@/app/(backend)/models/JobPost";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

// GET /api/jobs/[slug]  — PUBLIC
export async function GET(_req: NextRequest, { params }: RouteContext) {
  try {
    await connectDB();
    const { slug } = await params;

    const job = await JobPost.findOne({
      slug,
      status: "published",
      isActive: true,
    }).lean();

    if (!job) {
      return NextResponse.json(
        { success: false, error: "Job not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: job });
  } catch (error) {
    console.error("[GET /api/jobs/[slug]]", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
