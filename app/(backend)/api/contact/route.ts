// app/(backend)/api/contact/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../lib/mongodb";
import ContactMessage from "../../models/ContactMessage";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface ContactPayload {
  name?: unknown;
  email?: unknown;
  subject?: unknown;
  message?: unknown;
}

function sanitize(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

function validate(body: ContactPayload): {
  ok: boolean;
  errors: Record<string, string>;
  data?: { name: string; email: string; subject: string; message: string };
} {
  const name = sanitize(body.name, 100);
  const email = sanitize(body.email, 200).toLowerCase();
  const subject = sanitize(body.subject, 150);
  const message = sanitize(body.message, 2000);

  const errors: Record<string, string> = {};
  if (name.length < 2) errors.name = "Name must be at least 2 characters";
  if (!EMAIL_REGEX.test(email)) errors.email = "Enter a valid email address";
  if (subject.length < 3)
    errors.subject = "Subject must be at least 3 characters";
  if (message.length < 10)
    errors.message = "Message must be at least 10 characters";

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, errors: {}, data: { name, email, subject, message } };
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as ContactPayload;

    const result = validate(body);
    if (!result.ok || !result.data) {
      return NextResponse.json(
        { success: false, errors: result.errors },
        { status: 400 },
      );
    }

    await connectDB();

    // Simple rate limit: max 3 submissions per email in the last 10 minutes
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    const recentCount = await ContactMessage.countDocuments({
      email: result.data.email,
      createdAt: { $gte: tenMinutesAgo },
    });
    if (recentCount >= 3) {
      return NextResponse.json(
        {
          success: false,
          message: "Too many submissions. Please try again later.",
        },
        { status: 429 },
      );
    }

    const forwarded = req.headers.get("x-forwarded-for");
    const ipAddress = forwarded?.split(",")[0]?.trim() ?? undefined;
    const userAgent = req.headers.get("user-agent") ?? undefined;

    const saved = await ContactMessage.create({
      ...result.data,
      ipAddress,
      userAgent,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Thanks for reaching out. We'll get back to you soon.",
        data: { id: saved._id },
      },
      { status: 201 },
    );
  } catch (err) {
    console.error("[POST /api/contact]", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
