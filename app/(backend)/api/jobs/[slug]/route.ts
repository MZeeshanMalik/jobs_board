// app/api/jobs/[slug]/route.ts
import { connectDB } from "@/app/(backend)/lib/mongodb";
import JobPost from "@/app/(backend)/models/JobPost";
import { NextRequest, NextResponse } from "next/server";

// GET /api/jobs/[slug]
// Returns a single job post by its slug.
export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } },
) {
  try {
    await connectDB();
    const { slug } = await params;

    const job = await JobPost.findOne({ slug }).lean();

    if (!job) {
      return NextResponse.json(
        { success: false, error: "Job not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: job });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
