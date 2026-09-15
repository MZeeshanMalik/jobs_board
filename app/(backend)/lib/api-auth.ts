/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/api-auth.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/(backend)/lib/mongodb";
import User from "@/app/(backend)/models/User";
import { usageTracker } from "./usage-tracker";
import { AVAILABLE_TOOLS, ToolId } from "./plans";

export interface ApiAuthenticatedRequest extends NextRequest {
  user?: {
    id: string;
    email: string;
    name: string;
    apiKey: string;
    plan: any;
  };
}

/**
 * Validate API key from request
 */
async function validateApiKey(apiKey: string) {
  if (!apiKey) return null;

  await connectDB();

  const user = await User.findOne({
    apiKey,
    isActive: true,
  }).select("_id name email plan apiKey");

  if (!user) return null;

  // Update last used timestamp
  await User.updateOne(
    { _id: user._id },
    { $set: { apiKeyLastUsed: new Date() } },
  );

  return user;
}

/**
 * Middleware to authenticate API requests using API key
 */
export async function authenticateApiRequest(
  req: NextRequest,
): Promise<{ success: boolean; user?: any; error?: string; status?: number }> {
  // Check for API key in headers
  const apiKey =
    req.headers.get("x-api-key") ||
    req.headers.get("authorization")?.replace("Bearer ", "");

  if (!apiKey) {
    return {
      success: false,
      error:
        "API key is required. Please provide x-api-key header or Bearer token.",
      status: 401,
    };
  }

  const user = await validateApiKey(apiKey);

  if (!user) {
    return {
      success: false,
      error: "Invalid API key. Please check your credentials.",
      status: 401,
    };
  }

  return {
    success: true,
    user: {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      apiKey: user.apiKey,
      plan: user.plan,
    },
  };
}

/**
 * Middleware for API routes with usage tracking
 */
export async function withApiAuthAndUsage(
  req: NextRequest,
  tool: ToolId,
  handler: (req: ApiAuthenticatedRequest) => Promise<NextResponse>,
): Promise<NextResponse> {
  try {
    // ✅ First authenticate
    const authResult = await authenticateApiRequest(req);

    if (!authResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: authResult.error,
          code: "AUTH_FAILED",
        },
        { status: authResult.status || 401 },
      );
    }

    // ✅ Check if tool is valid
    if (!AVAILABLE_TOOLS.some((t) => t.id === tool)) {
      return NextResponse.json(
        {
          success: false,
          message: `Invalid tool: ${tool}`,
          code: "INVALID_TOOL",
        },
        { status: 400 },
      );
    }

    // ✅ Check usage limits
    const usageCheck = await usageTracker.checkUsage(authResult.user.id, tool);
    if (!usageCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: usageCheck.message,
          code: "USAGE_LIMIT_EXCEEDED",
          data: {
            tool,
            remaining: 0,
            limit: usageCheck.limit,
            resetDate: usageCheck.resetDate,
            upgradeUrl: "/pricing",
          },
        },
        { status: 429 },
      );
    }

    // ✅ Increment usage
    await usageTracker.incrementUsage(authResult.user.id, tool);

    // ✅ Attach user to request
    (req as ApiAuthenticatedRequest).user = authResult.user;

    // ✅ Execute handler
    const response = await handler(req as ApiAuthenticatedRequest);

    // ✅ Add usage headers to response
    const usageResult = await usageTracker.getUsage(authResult.user.id, tool);
    const headers = new Headers(response.headers);
    headers.set("X-Usage-Remaining", usageResult.remaining.toString());
    headers.set("X-Usage-Limit", usageResult.limit.toString());
    headers.set("X-Usage-Used", usageResult.used.toString());
    headers.set("X-Reset-Date", usageResult.resetDate.toISOString());
    headers.set("X-User-Id", authResult.user.id);

    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  } catch (error: any) {
    console.error("API auth error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        code: "INTERNAL_ERROR",
      },
      { status: 500 },
    );
  }
}
