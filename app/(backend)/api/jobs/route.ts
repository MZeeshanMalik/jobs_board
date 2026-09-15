// app/api/jobs/route.ts
import { NextRequest, NextResponse } from "next/server";
import JobPost from "../../models/JobPost";
import { connectDB, disconnectDB } from "../../lib/mongodb";
import { cookies } from "next/headers";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
interface JwtPayload {
  id?: string;
  userId?: string;
  sub?: string;
  email?: string;
  role?: string;
  [key: string]: unknown;
}

// POST /api/jobs
// Creates a new job post. No validation applied here (per request) —
// data is passed straight to Mongoose, so add checks before going to production.

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    // 1. Read the token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 },
      );
    }

    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not set in environment variables");
    }
    // 2. Verify + decode
    let payload: JwtPayload;
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      if (typeof decoded === "string") {
        return NextResponse.json(
          { success: false, error: "Invalid token payload" },
          { status: 401 },
        );
      }
      payload = decoded as JwtPayload;
    } catch (err) {
      const message =
        err instanceof jwt.TokenExpiredError
          ? "Session expired. Please log in again."
          : "Invalid or malformed token";
      return NextResponse.json(
        { success: false, error: message },
        { status: 401 },
      );
    }

    // 3. Your token uses `id` as the user identifier
    const userId = payload.id ?? payload.userId ?? payload.sub;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { success: false, error: "Invalid user in token" },
        { status: 401 },
      );
    }

    // 4. Create job with token-derived userId (ignore any client-supplied userId)
    const body = await req.json();
    const { userId: _ignored, ...rest } = body as Record<string, unknown> & {
      userId?: unknown;
    };

    const job = await JobPost.create({
      ...rest,
      userId: new mongoose.Types.ObjectId(userId),
    });

    return NextResponse.json({ success: true, data: job }, { status: 201 });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      const errors = Object.entries(error.errors).map(([field, err]) => ({
        field,
        message: err.message,
      }));
      return NextResponse.json(
        { success: false, error: "Validation failed", errors },
        { status: 400 },
      );
    }

    console.error("[POST /api/jobs]", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}

const MAX_LIMIT = 50;
const DEFAULT_LIMIT = 20;

const EMPLOYMENT_TYPES = [
  "FULL_TIME",
  "PART_TIME",
  "CONTRACTOR",
  "TEMPORARY",
  "INTERN",
  "VOLUNTEER",
  "PER_DIEM",
  "OTHER",
] as const;

const EXPERIENCE_LEVELS = [
  "entry",
  "mid",
  "senior",
  "lead",
  "executive",
] as const;

const JOB_LOCATION_TYPES = ["ON_SITE", "REMOTE", "HYBRID"] as const;

const STATUSES = ["draft", "published", "archived"] as const;

type EmploymentType = (typeof EMPLOYMENT_TYPES)[number];
type ExperienceLevel = (typeof EXPERIENCE_LEVELS)[number];
type JobLocationType = (typeof JOB_LOCATION_TYPES)[number];
type Status = (typeof STATUSES)[number];

/** Escape user input used inside a RegExp */
function escapeRegex(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function parseIntSafe(
  value: string | null,
  fallback: number,
  { min, max }: { min: number; max: number },
): number {
  if (!value) return fallback;
  const n = Number.parseInt(value, 10);
  if (Number.isNaN(n)) return fallback;
  return Math.min(Math.max(n, min), max);
}

function parseBool(value: string | null): boolean | undefined {
  if (value === null) return undefined;
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
}

function parseEnum<T extends string>(
  value: string | null,
  allowed: readonly T[],
): T | undefined {
  if (!value) return undefined;
  return allowed.includes(value as T) ? (value as T) : undefined;
}

function parseEnumList<T extends string>(
  value: string | null,
  allowed: readonly T[],
): T[] | undefined {
  if (!value) return undefined;
  const parts = value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
  const valid = parts.filter((v): v is T => allowed.includes(v as T));
  return valid.length > 0 ? valid : undefined;
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    // ---- Pagination ----
    const page = parseIntSafe(searchParams.get("page"), 1, {
      min: 1,
      max: 10_000,
    });
    const limit = parseIntSafe(searchParams.get("limit"), DEFAULT_LIMIT, {
      min: 1,
      max: MAX_LIMIT,
    });
    const skip = (page - 1) * limit;

    // ---- Filtering ----
    const filter: Record<string, unknown> = {};

    // Status — default to "published" for public listing
    const statusParam = searchParams.get("status");
    filter.status = parseEnum<Status>(statusParam, STATUSES) ?? "published";

    // isActive — default true
    const isActiveParam = parseBool(searchParams.get("isActive"));
    filter.isActive = isActiveParam ?? true;

    // Employment type — single or comma-separated
    const employmentType = parseEnumList<EmploymentType>(
      searchParams.get("employmentType"),
      EMPLOYMENT_TYPES,
    );
    if (employmentType) filter.employmentType = { $in: employmentType };

    // Experience level — single or comma-separated
    const experienceLevel = parseEnumList<ExperienceLevel>(
      searchParams.get("experienceLevel"),
      EXPERIENCE_LEVELS,
    );
    if (experienceLevel) filter.experienceLevel = { $in: experienceLevel };

    // Location type — single or comma-separated
    const jobLocationType = parseEnumList<JobLocationType>(
      searchParams.get("jobLocationType"),
      JOB_LOCATION_TYPES,
    );
    if (jobLocationType) filter.jobLocationType = { $in: jobLocationType };

    // City — case-insensitive partial match
    const city = searchParams.get("city")?.trim();
    if (city) {
      filter["locations.city"] = {
        $regex: escapeRegex(city),
        $options: "i",
      };
    }

    // Country — exact ISO code
    const country = searchParams.get("country")?.trim().toUpperCase();
    if (country && /^[A-Z]{2}$/.test(country)) {
      filter["locations.country"] = country;
    }

    // Skills — any skill from comma-separated list
    const skillsParam = searchParams.get("skills")?.trim();
    if (skillsParam) {
      const skills = skillsParam
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 10);
      if (skills.length > 0) {
        filter.skills = {
          $in: skills.map((s) => new RegExp(`^${escapeRegex(s)}$`, "i")),
        };
      }
    }

    // Company name — case-insensitive partial match
    const company = searchParams.get("company")?.trim();
    if (company) {
      filter.companyName = {
        $regex: escapeRegex(company),
        $options: "i",
      };
    }

    // Salary range — matches if job's min/max overlaps the requested range
    const salaryMin = Number.parseInt(searchParams.get("salaryMin") ?? "", 10);
    const salaryMax = Number.parseInt(searchParams.get("salaryMax") ?? "", 10);
    if (!Number.isNaN(salaryMin) || !Number.isNaN(salaryMax)) {
      const salaryClauses: Record<string, unknown>[] = [];

      // Range salary: overlap test
      if (!Number.isNaN(salaryMin)) {
        salaryClauses.push({
          "salary.type": "range",
          "salary.maxAmount": { $gte: salaryMin },
        });
      }
      if (!Number.isNaN(salaryMax)) {
        salaryClauses.push({
          "salary.type": "range",
          "salary.minAmount": { $lte: salaryMax },
        });
      }

      // Fixed / hourly salaries
      const fixedClause: Record<string, unknown> = {
        "salary.type": { $in: ["fixed", "hourly"] },
      };
      if (!Number.isNaN(salaryMin)) {
        fixedClause["salary.amount"] = { $gte: salaryMin };
      }
      if (!Number.isNaN(salaryMax)) {
        fixedClause["salary.amount"] = {
          ...(fixedClause["salary.amount"] as object),
          $lte: salaryMax,
        };
      }
      salaryClauses.push(fixedClause);

      filter.$or = [...((filter.$or as object[]) ?? []), ...salaryClauses];
    }

    // Full-text search across title, company, skills, description
    const q = searchParams.get("q")?.trim();
    if (q) {
      const safe = escapeRegex(q);
      const re = { $regex: safe, $options: "i" };

      // Merge with any existing $or from salary
      const searchOr = [
        { title: re },
        { companyName: re },
        { skills: re },
        { metaDescription: re },
      ];

      if (Array.isArray(filter.$or)) {
        filter.$and = [{ $or: filter.$or }, { $or: searchOr }];
        delete filter.$or;
      } else {
        filter.$or = searchOr;
      }
    }

    // Posted within N days
    const postedWithinDays = Number.parseInt(
      searchParams.get("postedWithinDays") ?? "",
      10,
    );
    if (!Number.isNaN(postedWithinDays) && postedWithinDays > 0) {
      const since = new Date(Date.now() - postedWithinDays * 86_400_000);
      filter.datePosted = { $gte: since };
    }

    // ---- Sorting ----
    // Default: newest first. Allow `sort` param for other orders.
    const sortParam = searchParams.get("sort") ?? "latest";
    const sortMap: Record<string, Record<string, 1 | -1>> = {
      latest: { datePosted: -1, createdAt: -1 },
      oldest: { datePosted: 1, createdAt: 1 },
      salary_high: { "salary.maxAmount": -1, "salary.amount": -1 },
      salary_low: { "salary.minAmount": 1, "salary.amount": 1 },
      title_asc: { title: 1 },
      title_desc: { title: -1 },
    };
    const sort = sortMap[sortParam] ?? sortMap.latest;

    // ---- Query ----
    const [jobs, total] = await Promise.all([
      JobPost.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      JobPost.countDocuments(filter),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / limit));

    return NextResponse.json(
      {
        success: true,
        data: jobs,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
        filters: {
          status: filter.status,
          isActive: filter.isActive,
          employmentType: employmentType ?? null,
          experienceLevel: experienceLevel ?? null,
          jobLocationType: jobLocationType ?? null,
          city: city ?? null,
          country: filter["locations.country"] ?? null,
          company: company ?? null,
          q: q ?? null,
          sort: sortParam,
        },
      },
      {
        headers: {
          // Cache on CDN for 60s, serve stale for 5 min while revalidating
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      },
    );
  } catch (error) {
    console.error("[GET /api/jobs]", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
