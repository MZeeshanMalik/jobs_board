// components/home/featured-jobs.tsx
"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import FeaturedJobCard from "./featured-job-card";
import { fetchFeaturedJobs } from "@/lib/api/jobs";
import { homeJobKeys } from "@/lib/api/query-keys";

export default function FeaturedJobs() {
  const {
    data: jobs = [],
    isPending,
    isError,
  } = useQuery({
    queryKey: homeJobKeys.featured(5),
    queryFn: () => fetchFeaturedJobs(5),
    staleTime: 60_000,
  });

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
      {/* Heading */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Latest Job Opportunities
          </h2>
          <p className="mt-2 text-sm sm:text-base text-gray-600">
            Explore the latest jobs and take the next step in your career.
          </p>
        </div>
        <Link
          href="/jobs"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-rose-600 hover:text-rose-700 transition-colors self-start sm:self-auto whitespace-nowrap"
        >
          View all jobs
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>

      {/* Grid */}
      <div className="mt-8 sm:mt-10">
        {isError ? (
          <ErrorState />
        ) : isPending ? (
          <SkeletonGrid />
        ) : jobs.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {jobs.slice(0, 5).map((job) => (
              <FeaturedJobCard key={job._id} job={job} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-pink-100 p-5 sm:p-6 animate-pulse"
        >
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-xl bg-pink-50" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-pink-50 rounded w-3/4" />
              <div className="h-3 bg-pink-50 rounded w-1/2" />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="h-3 bg-pink-50 rounded w-2/3" />
            <div className="h-3 bg-pink-50 rounded w-1/2" />
            <div className="h-3 bg-pink-50 rounded w-1/3" />
          </div>
          <div className="mt-5 pt-4 border-t border-pink-100 flex justify-between items-center">
            <div className="h-4 bg-pink-50 rounded w-1/3" />
            <div className="h-8 bg-pink-50 rounded-lg w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ErrorState() {
  return (
    <div className="text-center py-16 bg-white rounded-2xl border border-pink-100">
      <h3 className="text-sm font-medium text-gray-900">Failed to load jobs</h3>
      <p className="mt-1 text-sm text-gray-500">
        Please try again in a moment.
      </p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-16 bg-white rounded-2xl border border-pink-100">
      <h3 className="text-sm font-medium text-gray-900">No jobs available</h3>
      <p className="mt-1 text-sm text-gray-500">
        Check back later for new opportunities.
      </p>
    </div>
  );
}
