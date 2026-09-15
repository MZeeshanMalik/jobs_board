// app/jobs/page.tsx
import type { Metadata } from "next";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import JobsListClient from "./jobs-list-client";
import { fetchJobs, JobsQueryParams } from "@/lib/api/jobs";
import { jobKeys } from "@/lib/api/query-keys";

export const metadata: Metadata = {
  title: "Browse Jobs | Find Your Next Opportunity",
  description:
    "Explore curated job openings in engineering, design, and data. Filter by location, salary, and experience level to find your next role.",
  alternates: { canonical: "/jobs" },
};

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function toArray(value: string | string[] | undefined): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function toSingle(value: string | string[] | undefined): string | undefined {
  const arr = toArray(value);
  return arr[0];
}

function toCsv(value: string | string[] | undefined): string | undefined {
  const arr = toArray(value).filter(Boolean);
  return arr.length > 0 ? arr.join(",") : undefined;
}

function toInt(value: string | string[] | undefined): number | undefined {
  const v = toSingle(value);
  if (!v) return undefined;
  const n = Number.parseInt(v, 10);
  return Number.isNaN(n) ? undefined : n;
}

export default async function JobsPage({ searchParams }: PageProps) {
  const sp = await searchParams;

  const params: JobsQueryParams = {
    status: "published",
    isActive: true,
    page: toInt(sp.page) ?? 1,
    limit: toInt(sp.limit) ?? 10,
    q: toSingle(sp.q),
    city: toSingle(sp.city),
    // multi-value → comma-separated (backend supports both)
    employmentType: toCsv(sp.employmentType),
    experienceLevel: toCsv(sp.experienceLevel),
    jobLocationType: toCsv(sp.jobLocationType),
    company: toSingle(sp.company),
    skills: toSingle(sp.skills),
    salaryMin: toInt(sp.salaryMin),
    salaryMax: toInt(sp.salaryMax),
    postedWithinDays: toInt(sp.postedWithinDays),
    sort: toSingle(sp.sort) as JobsQueryParams["sort"],
  };

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: jobKeys.list(params),
    queryFn: () => fetchJobs(params),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <JobsListClient initialParams={params} />
    </HydrationBoundary>
  );
}
