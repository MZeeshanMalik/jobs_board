/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/auth/me/route.ts
import { verifyToken } from "@/app/(backend)/lib/jwt";
import { connectDB } from "@/app/(backend)/lib/mongodb";
import User from "@/app/(backend)/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Get token from cookie or header
    const token =
      request.cookies.get("token")?.value ||
      request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 },
      );
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 },
      );
    }
    await connectDB();
    const user = await User.findById(payload.id).select(
      "-password -phoneHash -phoneSalt",
    );
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 200 },
    );
  }
}
