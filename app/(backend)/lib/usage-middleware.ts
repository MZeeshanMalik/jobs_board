/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/usage-middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { usageTracker } from "./usage-tracker";
import { verifyToken } from "./jwt";
import { ToolId } from "./plans";

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

/**
 * Middleware to track usage for API endpoints
 */
export async function withUsageTracking(
  req: AuthenticatedRequest,
  tool: ToolId,
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>,
): Promise<NextResponse> {
  try {
    // Get token from cookie or header
    const token =
      req.cookies.get("token")?.value ||
      req.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 },
      );
    }

    const payload = verifyToken(token);
    if (!payload || !payload.id) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 },
      );
    }

    // Check if user has remaining requests
    const usageCheck = await usageTracker.checkUsage(payload.id, tool);

    if (!usageCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: usageCheck.message,
          data: {
            remaining: 0,
            limit: usageCheck.limit,
            resetDate: usageCheck.resetDate,
            upgradeUrl: "/pricing",
          },
        },
        { status: 429 }, // Too Many Requests
      );
    }

    // Increment usage
    await usageTracker.incrementUsage(payload.id, tool);

    // Attach user to request
    req.user = {
      id: payload.id,
      email: payload.email,
      name: payload.name,
    };

    // Execute the handler
    const response = await handler(req);

    // Add usage headers to response
    const usageResult = await usageTracker.getUsage(payload.id, tool);
    const headers = new Headers(response.headers);
    headers.set("X-Usage-Remaining", usageResult.remaining.toString());
    headers.set("X-Usage-Limit", usageResult.limit.toString());
    headers.set("X-Reset-Date", usageResult.resetDate.toISOString());

    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  } catch (error: any) {
    console.error("Usage tracking error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
