// lib/api/jobs.ts
import { JobPost } from "@/types/job";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
export interface JobsQueryParams {
  page?: number;
  limit?: number;
  status?: "draft" | "published" | "archived";
  isActive?: boolean;
  city?: string;
  q?: string;
  employmentType?: string;
  experienceLevel?: string;
  jobLocationType?: string;
  company?: string;
  skills?: string;
  salaryMin?: number;
  salaryMax?: number;
  postedWithinDays?: number;
  sort?: "latest" | "oldest" | "salary_high" | "salary_low";
}

function buildQuery(params: JobsQueryParams = {}): string {
  const search = new URLSearchParams();
  if (params.page) search.set("page", String(params.page));
  if (params.limit) search.set("limit", String(params.limit));
  if (params.status) search.set("status", params.status);
  if (params.isActive !== undefined)
    search.set("isActive", String(params.isActive));
  if (params.city) search.set("city", params.city);
  if (params.q) search.set("q", params.q);
  if (params.employmentType)
    search.set("employmentType", params.employmentType);
  if (params.experienceLevel)
    search.set("experienceLevel", params.experienceLevel);
  if (params.jobLocationType)
    search.set("jobLocationType", params.jobLocationType);
  if (params.company) search.set("company", params.company);
  if (params.skills) search.set("skills", params.skills);
  if (params.salaryMin != null)
    search.set("salaryMin", String(params.salaryMin));
  if (params.salaryMax != null)
    search.set("salaryMax", String(params.salaryMax));
  if (params.postedWithinDays)
    search.set("postedWithinDays", String(params.postedWithinDays));
  if (params.sort) search.set("sort", params.sort);
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export interface JobsResponse {
  jobs: JobPost[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    const error = new Error("Request failed") as Error & { status?: number };
    error.status = res.status;
    throw error;
  }
  return res.json();
}

function getBaseUrl(): string {
  // Browser: use relative URLs so requests go to the current origin.
  // Server (Node): must be absolute.
  if (typeof window !== "undefined") return "";

  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}
// export async function fetchJobBySlug(slug: string): Promise<JobPost | null> {
//   const url = `${getBaseUrl()}/api/jobs/${encodeURIComponent(slug)}`;
//   const res = await fetch(url);
//   if (res.status === 404) return null;
//   if (!res.ok) throw new Error("Failed to fetch job");

//   return res.json();
// }

export async function fetchJobBySlug(slug: string): Promise<JobPost | null> {
  const url = `${getBaseUrl()}/api/jobs/${encodeURIComponent(slug)}`;
  const res = await fetch(url);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to fetch job");

  const json = await res.json();

  // API returns: { success: true, data: JobPost }
  if (!json?.success || !json.data) return null;
  return json.data as JobPost;
}
export async function fetchJobs(
  params: JobsQueryParams = {},
): Promise<JobsResponse> {
  const url = `${API_URL}/api/jobs${buildQuery(params)}`;
  const res = await fetch(url);
  if (!res.ok) {
    const error = new Error("Request failed") as Error & { status?: number };
    error.status = res.status;
    throw error;
  }
  const json = await res.json();

  // Your API: { success, data, pagination }
  const jobs: JobPost[] = Array.isArray(json.data) ? json.data : [];
  const pg = json.pagination ?? {};

  const limit = Number(pg.limit ?? params.limit ?? 5);
  const page = Number(pg.page ?? params.page ?? 1);
  const total = Number(pg.total ?? jobs.length);
  const totalPages = Number(
    pg.totalPages ?? pg.pages ?? Math.max(1, Math.ceil(total / limit)),
  );

  return { jobs, total, page, limit, totalPages };
}

export async function fetchFeaturedJobs(limit = 5): Promise<JobPost[]> {
  const url = `${getBaseUrl()}/api/jobs?status=published&isActive=true&page=1&limit=${limit}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch featured jobs");

  const json = await res.json();
  const jobs: JobPost[] = Array.isArray(json?.data) ? json.data : [];
  return jobs;
}
