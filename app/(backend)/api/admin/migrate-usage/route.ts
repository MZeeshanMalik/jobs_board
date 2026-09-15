/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/admin/migrate-usage/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/(backend)/lib/mongodb";
import User from "@/app/(backend)/models/User";
import { usageTracker } from "@/app/(backend)/lib/usage-tracker";
// import { usageTracker } from "@/lib/usage-tracker";

export async function POST(req: NextRequest) {
  try {
    // Verify admin access
    const apiKey = req.headers.get("x-api-key");
    if (apiKey !== process.env.ADMIN_API_KEY) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    await connectDB();

    // Get all users
    const users = await User.find().select("_id plan");
    let initialized = 0;
    let errors = 0;

    for (const user of users) {
      try {
        await usageTracker.initializeUserUsage(
          user._id.toString(),
          user.plan?.tier || "free",
        );
        initialized++;
      } catch (error) {
        console.error(
          `Failed to initialize usage for user ${user._id}:`,
          error,
        );
        errors++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Usage initialized for ${initialized} users. ${errors} errors.`,
      data: { initialized, errors },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
