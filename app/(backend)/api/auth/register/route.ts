/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/app/(backend)/lib/mongodb";
import User from "@/app/(backend)/models/User";
import { signToken } from "@/app/(backend)/lib/jwt";
import { sendWelcomeEmail } from "@/app/(backend)/lib/email";
import { AVAILABLE_TOOLS, PLANS } from "@/app/(backend)/lib/plans";

// Helper to hash phone number with salt
// function hashPhoneNumber(phone: string): { hash: string; salt: string } {
//   const salt = crypto.randomBytes(32).toString("hex");
//   const hash = crypto.createHmac("sha256", salt).update(phone).digest("hex");
//   return { hash, salt };
// }

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { name, email, phone, password, address } = body;

    // Validation
    if (!name || !email || !phone || !password) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 },
      );
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Email already registered" },
        { status: 400 },
      );
    }

    // Hash phone number
    // const { hash: phoneHash, salt: phoneSalt } = hashPhoneNumber(phone);

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      phoneHash: phone, // Store the hashed phone number
      password, // Will be hashed by pre-save middleware
      address,
    });
    // ✅ Initialize usage for all tools
    // const usageRecords = AVAILABLE_TOOLS.map((tool) => ({
    //   userId: user._id,
    //   tool: tool.id,
    //   dailyLimit: PLANS.free.limits[tool.id] || 100,
    //   requestCount: 0,
    //   resetDate: new Date(),
    // }));

    // await Usage.insertMany(usageRecords);
    // ✅ Send welcome email (don't await - we want signup to complete even if email fails)
    sendWelcomeEmail(user.email, user.name)
      .then((result) => {
        if (result.success) {
          console.log(`Welcome email sent to ${user.email}`);
        } else {
          console.error(
            `Failed to send welcome email to ${user.email}:`,
            result.error,
          );
        }
      })
      .catch((error) => {
        console.error(`Welcome email error for ${user.email}:`, error);
      });

    // Generate JWT
    const token = signToken({
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: "user",
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
        },
        token,
      },
    });

    // Set cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Registration failed" },
      { status: 500 },
    );
  }
}
