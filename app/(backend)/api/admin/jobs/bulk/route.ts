// app/api/admin/jobs/bulk/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/(backend)/lib/mongodb";
import JobPost from "@/app/(backend)/models/JobPost";
import { verifyToken } from "@/app/(backend)/lib/jwt";

export async function PUT(request: NextRequest) {
  try {
    await connectDB();

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
    const { jobIds, action } = body;

    if (!jobIds || !Array.isArray(jobIds) || jobIds.length === 0) {
      return NextResponse.json(
        { success: false, message: "No jobs selected" },
        { status: 400 },
      );
    }

    let updateData: any = {};
    switch (action) {
      case "publish":
        updateData = { status: "published", isActive: true };
        break;
      case "archive":
        updateData = { status: "archived", isActive: false };
        break;
      case "delete":
        await JobPost.deleteMany({ _id: { $in: jobIds } });
        return NextResponse.json({
          success: true,
          message: `${jobIds.length} jobs deleted successfully`,
        });
      default:
        return NextResponse.json(
          { success: false, message: "Invalid action" },
          { status: 400 },
        );
    }

    const result = await JobPost.updateMany(
      { _id: { $in: jobIds } },
      { $set: updateData },
    );

    return NextResponse.json({
      success: true,
      message: `${result.modifiedCount} jobs updated successfully`,
    });
  } catch (error: any) {
    console.error("Error performing bulk action:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
