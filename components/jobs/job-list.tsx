// components/job-list.tsx
"use client";

import { useState, useMemo } from "react";
import JobCard from "./job-card";
import { JobPost } from "@/types/job";

interface JobListProps {
  jobs: JobPost[];
  itemsPerPage?: number;
}

export default function JobList({ jobs, itemsPerPage = 5 }: JobListProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(jobs.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, jobs.length);
  const currentJobs = jobs.slice(startIndex, endIndex);

  const pageNumbers = useMemo(() => {
    const pages: (number | "ellipsis")[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    if (currentPage <= 3) {
      for (let i = 1; i <= 4; i++) pages.push(i);
      pages.push("ellipsis");
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1);
      pages.push("ellipsis");
      for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      pages.push("ellipsis");
      for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
      pages.push("ellipsis");
      pages.push(totalPages);
    }

    return pages;
  }, [currentPage, totalPages]);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (jobs.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
        <svg
          className="mx-auto h-12 w-12 text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
        <h3 className="mt-3 text-sm font-medium text-gray-900">
          No jobs found
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Check back later for new opportunities.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Job Listings */}
      <div className="space-y-3" role="list">
        {currentJobs.map((job) => (
          <JobCard key={job._id} job={job} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-100"
          aria-label="Job listings pagination"
        >
          {/* Results count */}
          <p className="text-sm text-gray-600 order-2 sm:order-1">
            Showing{" "}
            <span className="font-medium text-gray-900">{startIndex + 1}</span>{" "}
            to <span className="font-medium text-gray-900">{endIndex}</span> of{" "}
            <span className="font-medium text-gray-900">{jobs.length}</span>{" "}
            jobs
          </p>

          {/* Page controls */}
          <div className="order-1 sm:order-2 flex items-center gap-1">
            {/* Previous */}
            <button
              type="button"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 text-gray-500 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-500 disabled:hover:border-gray-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
              aria-label="Previous page"
            >
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            {/* Page numbers */}
            {pageNumbers.map((page, idx) =>
              page === "ellipsis" ? (
                <span
                  key={`ellipsis-${idx}`}
                  className="inline-flex items-center justify-center w-9 h-9 text-gray-400 text-sm"
                  aria-hidden="true"
                >
                  …
                </span>
              ) : (
                <button
                  key={page}
                  type="button"
                  onClick={() => goToPage(page)}
                  aria-current={currentPage === page ? "page" : undefined}
                  aria-label={`Go to page ${page}`}
                  className={`inline-flex items-center justify-center w-9 h-9 rounded-lg text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 ${
                    currentPage === page
                      ? "bg-rose-600 text-white shadow-sm"
                      : "border border-gray-200 text-gray-700 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200"
                  }`}
                >
                  {page}
                </button>
              ),
            )}

            {/* Next */}
            <button
              type="button"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 text-gray-500 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-500 disabled:hover:border-gray-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
              aria-label="Next page"
            >
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
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}
