import { MetadataRoute } from "next";

const BASE_URL = "https://www.fraudhawkai.com";
const API_BASE = "https://www.fraudhawkai.com/api/jobs";
const PAGE_LIMIT = 100; // pull bigger pages from your API to cut request count

interface Job {
  slug: string;
  datePosted: string;
  validThrough: string;
  isActive: boolean;
  status: string;
}

interface JobsResponse {
  success: boolean;
  data: Job[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
  };
}

async function getAllActiveJobs(): Promise<Job[]> {
  const allJobs: Job[] = [];
  let page = 1;
  let hasNextPage = true;

  while (hasNextPage) {
    const res = await fetch(
      `${API_BASE}?page=${page}&limit=${PAGE_LIMIT}&status=published&isActive=true`,
      { next: { revalidate: 3600 } }, // cache each page for 1 hour
    );

    if (!res.ok) break;

    const json: JobsResponse = await res.json();
    allJobs.push(...json.data);

    hasNextPage = json.pagination.hasNextPage;
    page++;
  }

  // Belt-and-suspenders filter in case the API ever returns something stale
  return allJobs.filter((job) => job.status === "published" && job.isActive);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const jobs = await getAllActiveJobs();

  const jobUrls: MetadataRoute.Sitemap = jobs.map((job) => ({
    url: `${BASE_URL}/jobs/${job.slug}`,
    lastModified: new Date(job.datePosted),
    changeFrequency: "daily",
    priority: 0.8,
  }));

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
  ];

  return [...staticUrls, ...jobUrls];
}
