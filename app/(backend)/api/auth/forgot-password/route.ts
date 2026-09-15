/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/auth/forgot-password/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/(backend)/lib/mongodb";
import User from "@/app/(backend)/models/User";
import { sendPasswordResetEmail } from "@/app/(backend)/lib/email";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 },
      );
    }

    // Find user by email
    const user = await User.findOne({
      email: email.toLowerCase(),
      isActive: true,
    });

    // For security, don't reveal if email exists
    if (!user) {
      return NextResponse.json({
        success: true,
        message:
          "If an account exists with this email, a reset link has been sent.",
      });
    }

    // Generate reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // Send email
    try {
      await sendPasswordResetEmail(user.email, resetToken, user.name);

      return NextResponse.json({
        success: true,
        message: "Password reset link sent to your email.",
      });
    } catch (emailError) {
      // If email fails, clear the reset token
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });

      console.error("Email error:", emailError);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to send reset email. Please try again later.",
        },
        { status: 500 },
      );
    }
  } catch (error: any) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
