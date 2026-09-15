// app/api/admin/jobs/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/(backend)/lib/mongodb";
import JobPost from "@/app/(backend)/models/JobPost";
import { verifyToken } from "@/app/(backend)/lib/jwt";

// ✅ GET handler - Fetch a single job
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const { id } = await params;

    // Verify admin authentication
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const payload = verifyToken(token);
    if (
      !payload ||
      (payload.role !== "admin" && payload.role !== "super_admin")
    ) {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 },
      );
    }

    // Fetch the job
    const job = await JobPost.findById(id).select("-__v").lean();

    if (!job) {
      return NextResponse.json(
        { success: false, message: "Job not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: job,
    });
  } catch (error: any) {
    console.error("Error fetching job:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch job" },
      { status: 500 },
    );
  }
}

// ✅ PUT handler - Update a job
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const { id } = await params;

    // Verify admin authentication
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const payload = verifyToken(token);
    if (
      !payload ||
      (payload.role !== "admin" && payload.role !== "super_admin")
    ) {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const {
      title,
      contentJson,
      companyName,
      companyLogoUrl,
      companyUrl,
      aboutCompany,
      jobLocationType,
      locations,
      applicantLocationRequirement,
      employmentType,
      experienceLevel,
      salary,
      datePosted,
      validThrough,
      skills,
      applyUrl,
      metaDescription,
      slug,
      status,
    } = body;

    // Check if job exists
    const existingJob = await JobPost.findById(id);
    if (!existingJob) {
      return NextResponse.json(
        { success: false, message: "Job not found" },
        { status: 404 },
      );
    }

    // Update job
    const updatedJob = await JobPost.findByIdAndUpdate(
      id,
      {
        $set: {
          title,
          contentJson,
          companyName,
          companyLogoUrl,
          companyUrl,
          aboutCompany,
          jobLocationType,
          locations,
          applicantLocationRequirement,
          employmentType,
          experienceLevel,
          salary,
          datePosted,
          validThrough,
          skills,
          applyUrl,
          metaDescription,
          slug,
          status: status || existingJob.status,
          updatedAt: new Date(),
        },
      },
      { new: true, runValidators: true },
    );

    return NextResponse.json({
      success: true,
      message: "Job updated successfully",
      data: updatedJob,
    });
  } catch (error: any) {
    console.error("Error updating job:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update job" },
      { status: 500 },
    );
  }
}

// ✅ DELETE handler - Delete a job
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const { id } = await params;

    // Verify admin authentication
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const payload = verifyToken(token);
    if (
      !payload ||
      (payload.role !== "admin" && payload.role !== "super_admin")
    ) {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 },
      );
    }

    // Check if job exists
    const job = await JobPost.findById(id);
    if (!job) {
      return NextResponse.json(
        { success: false, message: "Job not found" },
        { status: 404 },
      );
    }

    // Delete the job
    await JobPost.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting job:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete job" },
      { status: 500 },
    );
  }
}
