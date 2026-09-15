// lib/api/query-keys.ts
import { JobsQueryParams } from "./jobs";

export const homeJobKeys = {
  featured: (limit: number) => ["jobs", "featured", limit] as const,
};

export const jobKeys = {
  all: ["jobs"] as const,
  list: (p: JobsQueryParams) =>
    [
      "jobs",
      "list",
      p.page ?? 1,
      p.limit ?? 5,
      p.status ?? "published",
      p.isActive ?? true,
      p.q ?? null,
      p.city ?? null,
      p.employmentType ?? null,
      p.experienceLevel ?? null,
      p.jobLocationType ?? null,
      p.company ?? null,
      p.skills ?? null,
      p.salaryMin ?? null,
      p.salaryMax ?? null,
      p.postedWithinDays ?? null,
      p.sort ?? "latest",
    ] as const,
  detail: (slug: string) => ["jobs", "detail", slug] as const,
};
