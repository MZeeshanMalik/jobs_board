// app/sitemap.ts
import type { MetadataRoute } from "next";
import { connectDB } from "./(backend)/lib/mongodb";
import JobPost from "./(backend)/models/JobPost";
// import connectDB from "@/lib/db";
// import JobPost from "@/models/JobPost";

const BASE_URL = "https://www.fraudhawkai.com";

// Regenerate at most once every 10 minutes
export const revalidate = 600;

// Force dynamic so it's evaluated at request time, not build time
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/jobs`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/companies`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/cookies`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  try {
    await connectDB();

    const jobs = await JobPost.find(
      { status: "published", isActive: true },
      { slug: 1, datePosted: 1, updatedAt: 1 },
    )
      .sort({ datePosted: -1 })
      .lean();

    const jobUrls: MetadataRoute.Sitemap = jobs.map((job) => ({
      url: `${BASE_URL}/jobs/${job.slug}`,
      lastModified: job.updatedAt ?? job.datePosted ?? new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    }));

    console.log(`[sitemap] generated ${jobUrls.length} job URLs`);

    return [...staticUrls, ...jobUrls];
  } catch (err) {
    console.error("[sitemap] DB query failed:", err);
    return staticUrls;
  }
}
