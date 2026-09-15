/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/usage-tracker.ts
import { connectDB } from "@/app/(backend)/lib/mongodb";
import Usage from "@/app/(backend)/models/Usage";
import User from "@/app/(backend)/models/User";
import mongoose from "mongoose";
import { AVAILABLE_TOOLS, getToolLimit, ToolId } from "./plans";

export interface UsageResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  used: number;
  resetDate: Date;
  message?: string;
}

export class UsageTracker {
  private static instance: UsageTracker;

  public static getInstance(): UsageTracker {
    if (!UsageTracker.instance) {
      UsageTracker.instance = new UsageTracker();
    }
    return UsageTracker.instance;
  }

  /**
   * Initialize usage records for a new user
   */
  async initializeUserUsage(
    userId: string,
    tier: string = "free",
  ): Promise<void> {
    await connectDB();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const records = AVAILABLE_TOOLS.map((tool: any) => ({
      userId: new mongoose.Types.ObjectId(userId),
      tool: tool.id,
      dailyLimit: getToolLimit(tool.id, tier),
      requestCount: 0,
      resetDate: today,
    }));

    await Usage.insertMany(records, { ordered: false });
  }

  /**
   * Ensure usage record exists for a tool (creates if missing)
   */
  async ensureUsageRecord(userId: string, tool: ToolId): Promise<void> {
    await connectDB();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const user = await User.findById(userId).select("plan");
    if (!user) {
      throw new Error("User not found");
    }

    const existing = await Usage.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      tool,
      resetDate: today,
    });

    if (!existing) {
      const limit = getToolLimit(tool, user.plan?.tier || "free");
      await Usage.create({
        userId: new mongoose.Types.ObjectId(userId),
        tool,
        dailyLimit: limit,
        requestCount: 0,
        resetDate: today,
      });
    }
  }

  /**
   * Get user's current usage for a specific tool
   */
  async getUsage(userId: string, tool: ToolId): Promise<UsageResult> {
    await connectDB();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Ensure usage record exists
    await this.ensureUsageRecord(userId, tool);

    const usage = await Usage.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      tool,
      resetDate: today,
    });

    if (!usage) {
      throw new Error(`Usage record not found for tool ${tool}`);
    }

    const allowed = usage.requestCount < usage.dailyLimit;
    const remaining = Math.max(0, usage.dailyLimit - usage.requestCount);

    return {
      allowed,
      remaining,
      limit: usage.dailyLimit,
      used: usage.requestCount,
      resetDate: usage.resetDate,
      message: allowed
        ? `${remaining} requests remaining today`
        : `Daily limit of ${usage.dailyLimit} requests exceeded. Upgrade to continue.`,
    };
  }

  /**
   * Increment usage count for a user's tool
   */
  async incrementUsage(userId: string, tool: ToolId): Promise<UsageResult> {
    await connectDB();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Ensure usage record exists
    await this.ensureUsageRecord(userId, tool);

    // Atomic update to prevent race conditions
    const usage = await Usage.findOneAndUpdate(
      {
        userId: new mongoose.Types.ObjectId(userId),
        tool,
        resetDate: today,
      },
      {
        $inc: { requestCount: 1 },
      },
      {
        new: true,
      },
    );

    if (!usage) {
      throw new Error(`Usage record not found for tool ${tool}`);
    }

    const allowed = usage.requestCount <= usage.dailyLimit;
    const remaining = Math.max(0, usage.dailyLimit - usage.requestCount);

    return {
      allowed,
      remaining,
      limit: usage.dailyLimit,
      used: usage.requestCount,
      resetDate: usage.resetDate,
      message: allowed
        ? `${remaining} requests remaining today`
        : `Daily limit of ${usage.dailyLimit} requests exceeded. Upgrade to continue.`,
    };
  }

  /**
   * Check if user has remaining requests without incrementing
   */
  async checkUsage(userId: string, tool: ToolId): Promise<UsageResult> {
    await connectDB();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Ensure usage record exists
    await this.ensureUsageRecord(userId, tool);

    const usage = await Usage.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      tool,
      resetDate: today,
    });

    if (!usage) {
      throw new Error(`Usage record not found for tool ${tool}`);
    }

    const allowed = usage.requestCount < usage.dailyLimit;
    const remaining = Math.max(0, usage.dailyLimit - usage.requestCount);

    return {
      allowed,
      remaining,
      limit: usage.dailyLimit,
      used: usage.requestCount,
      resetDate: usage.resetDate,
      message: allowed
        ? `${remaining} requests remaining today`
        : `Daily limit of ${usage.dailyLimit} requests exceeded. Upgrade to continue.`,
    };
  }

  /**
   * Get usage statistics for all tools
   */
  async getUserStats(userId: string): Promise<Record<string, UsageResult>> {
    await connectDB();

    const user = await User.findById(userId).select("plan");
    if (!user) {
      throw new Error("User not found");
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const stats: Record<string, UsageResult> = {};

    // Ensure all tools have usage records
    for (const tool of AVAILABLE_TOOLS) {
      await this.ensureUsageRecord(userId, tool.id);
    }

    // Get all usage records
    const usages = await Usage.find({
      userId: new mongoose.Types.ObjectId(userId),
      resetDate: today,
    });

    for (const usage of usages) {
      const allowed = usage.requestCount < usage.dailyLimit;
      const remaining = Math.max(0, usage.dailyLimit - usage.requestCount);

      stats[usage.tool] = {
        allowed,
        remaining,
        limit: usage.dailyLimit,
        used: usage.requestCount,
        resetDate: usage.resetDate,
        message: `${usage.requestCount}/${usage.dailyLimit} used today`,
      };
    }

    return stats;
  }

  /**
   * Reset usage for all users (cron job)
   */
  async resetDailyUsage(): Promise<void> {
    await connectDB();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Reset request counts for today's records
    await Usage.updateMany(
      {
        resetDate: { $lt: today },
      },
      {
        $set: {
          requestCount: 0,
          resetDate: today,
        },
      },
    );

    
  }

  /**
   * Sync limits with user's plan (called when plan changes)
   */
  async syncUserLimits(userId: string): Promise<void> {
    await connectDB();

    const user = await User.findById(userId).select("plan");
    if (!user) {
      throw new Error("User not found");
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const updates = AVAILABLE_TOOLS.map((tool: any) => ({
      updateOne: {
        filter: {
          userId: new mongoose.Types.ObjectId(userId),
          tool: tool.id,
          resetDate: today,
        },
        update: {
          $set: {
            dailyLimit: getToolLimit(tool.id, user.plan?.tier || "free"),
          },
        },
        upsert: true,
      },
    }));

    await Usage.bulkWrite(updates);
  }
}

export const usageTracker = UsageTracker.getInstance();
