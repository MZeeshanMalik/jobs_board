/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/usage-middleware.ts
import { NextRequest, NextResponse } from "next/server";
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

    // Attach user to request
    req.user = {
      id: payload.id,
      email: payload.email,
      name: payload.name,
    };

    // Execute the handler
    const response = await handler(req);

    // Add usage headers to response

    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
    });
  } catch (error: any) {
    console.error("Usage tracking error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
