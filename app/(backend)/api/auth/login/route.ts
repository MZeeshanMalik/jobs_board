/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import User from "@/app/(backend)/models/User";
import { signToken } from "@/app/(backend)/lib/jwt";
import { connectDB } from "@/app/(backend)/lib/mongodb";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password required" },
        { status: 400 },
      );
    }

    // Find user with password field
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password",
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 },
      );
    }

    // Check if user is active
    if (!user.isActive) {
      return NextResponse.json(
        { success: false, message: "Account deactivated" },
        { status: 401 },
      );
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 },
      );
    }

    // Generate JWT
    const token = signToken({
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      storeId: user.storeId?.toString(),
      role: user.role || "user",
    });

    // Create response
    const response = NextResponse.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          address: user.address,
          storeId: user.storeId,
        },
        token,
      },
    });

    // Set cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Login failed" },
      { status: 500 },
    );
  }
}
