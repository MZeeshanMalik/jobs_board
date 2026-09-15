// app/api/jobs/id/[id]/route.ts
import { connectDB, disconnectDB } from "@/app/(backend)/lib/mongodb";
import JobPost from "@/app/(backend)/models/JobPost";
import { NextRequest, NextResponse } from "next/server";

// GET /api/jobs/id/[id]
// Fetches a single job by its Mongo _id (used by the admin edit page,
// since the admin needs to load a job before its slug may have been finalized).
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await connectDB();

    const job = await JobPost.findById(params.id).lean();

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

// PATCH /api/jobs/id/[id]
// Updates an existing job. No validation applied here (per request) —
// whatever is sent in the body is passed straight to Mongoose.
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await disconnectDB();

    const body = await req.json();

    const job = await JobPost.findByIdAndUpdate(params.id, body, {
      new: true, // return the updated document
      runValidators: false, // per request: no validation for now
    });

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

// DELETE /api/jobs/id/[id]
// Permanently deletes a job.
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const { id } = await params;
    const job = await JobPost.findByIdAndDelete(id);

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
