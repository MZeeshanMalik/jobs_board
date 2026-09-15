/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/auth/reset-password/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/app/(backend)/lib/mongodb";
import User from "@/app/(backend)/models/User";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { token, password } = await request.json();

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: new Date() },
    }).select("+passwordResetToken +passwordResetExpires");

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Token is invalid or expired" },
        { status: 400 },
      );
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    return NextResponse.json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
