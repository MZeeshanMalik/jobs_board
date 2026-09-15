// // app/jobs/jobs-list-client.tsx
// "use client";

// import { useMemo } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { keepPreviousData, useQuery } from "@tanstack/react-query";
// import JobCard from "@/components/jobs/job-card";
// import Pagination from "@/components/jobs/pagination";
// import JobFilters from "@/components/jobs/job-filters";
// import MobileFilters from "@/components/jobs/mobile-filters";
// import { fetchJobs, JobsQueryParams } from "@/lib/api/jobs";
// import { jobKeys } from "@/lib/api/query-keys";

// interface Props {
//   initialParams: JobsQueryParams;
// }

// export default function JobsListClient({ initialParams }: Props) {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const pageFromUrl = Number(searchParams.get("page") ?? 1) || 1;

//   const params: JobsQueryParams = useMemo(
//     () => ({ ...initialParams, page: pageFromUrl }),
//     [initialParams, pageFromUrl],
//   );

//   const { data, isPending, isError, isFetching } = useQuery({
//     queryKey: jobKeys.list(params),
//     queryFn: () => fetchJobs(params),
//     placeholderData: keepPreviousData,
//     staleTime: 30_000,
//   });

//   const jobs = data?.jobs ?? [];
//   const total = data?.total ?? 0;
//   const totalPages = data?.totalPages ?? 1;
//   const limit = data?.limit ?? initialParams.limit ?? 10;

//   const startIndex = (pageFromUrl - 1) * limit;
//   const endIndex = Math.min(startIndex + limit, total);

//   const handlePageChange = (p: number) => {
//     const next = new URLSearchParams(searchParams.toString());
//     next.set("page", String(p));
//     router.push(`/jobs?${next.toString()}`, { scroll: false });
//     // Scroll only the results column into view, not the whole page
//     requestAnimationFrame(() => {
//       document
//         .getElementById("job-results-top")
//         ?.scrollIntoView({ behavior: "smooth", block: "start" });
//     });
//   };

//   return (
//     <section className="mx-auto px-2 sm:px-2 lg:px-2 py-8">
//       <div className="grid grid-cols-1 lg:grid-cols-[270px_1fr] gap-8 lg:items-start">
//         {/* Sidebar (desktop) */}
//         <div className="hidden lg:block lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto lg:pr-2">
//           <JobFilters total={total} />
//         </div>

//         {/* Results */}
//         <div id="job-results-top" className="min-h-[70vh] flex flex-col">
//           <div className="flex items-center justify-between gap-3 mb-5">
//             <div>
//               <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
//                 Job Results
//               </h1>
//               <p className="text-sm text-gray-600 mt-0.5">
//                 {total} {total === 1 ? "job" : "jobs"} found
//               </p>
//             </div>
//             <MobileFilters total={total} />
//           </div>

//           {/* Results area — flex-1 keeps footer from riding up on empty state */}
//           <div className="flex-1">
//             {isError ? (
//               <ErrorState />
//             ) : isPending ? (
//               <JobListSkeleton count={limit} />
//             ) : jobs.length === 0 ? (
//               <EmptyState />
//             ) : (
//               <>
//                 <ul
//                   className={`space-y-3 transition-opacity duration-200 ${
//                     isFetching ? "opacity-60" : "opacity-100"
//                   }`}
//                 >
//                   {jobs.map((job) => (
//                     <li key={job._id}>
//                       <JobCard job={job} />
//                     </li>
//                   ))}
//                 </ul>

//                 <Pagination
//                   currentPage={pageFromUrl}
//                   totalPages={totalPages}
//                   startIndex={startIndex}
//                   endIndex={endIndex}
//                   total={total}
//                   onPageChange={handlePageChange}
//                 />
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// function JobListSkeleton({ count = 5 }: { count?: number }) {
//   return (
//     <ul className="space-y-3">
//       {Array.from({ length: count }).map((_, i) => (
//         <li
//           key={i}
//           className="bg-white rounded-xl border border-pink-100 p-6 animate-pulse"
//         >
//           <div className="flex gap-4">
//             <div className="w-14 h-14 rounded-lg bg-pink-50 shrink-0" />
//             <div className="flex-1 space-y-3 min-w-0">
//               <div className="h-5 bg-pink-50 rounded w-2/3 sm:w-1/3" />
//               <div className="h-4 bg-pink-50 rounded w-1/2 sm:w-1/4" />
//               <div className="h-3 bg-pink-50 rounded w-full" />
//               <div className="h-3 bg-pink-50 rounded w-5/6 sm:w-2/3" />
//             </div>
//           </div>
//         </li>
//       ))}
//     </ul>
//   );
// }

// function ErrorState() {
//   return (
//     <div className="flex flex-col items-center justify-center min-h-[400px] text-center bg-white rounded-xl border border-pink-100 p-8">
//       <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-rose-50 text-rose-600">
//         <svg
//           className="w-6 h-6"
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//           aria-hidden="true"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M12 9v2m0 4h.01M5.07 19h13.86a2 2 0 001.74-2.99l-6.93-12a2 2 0 00-3.48 0l-6.93 12A2 2 0 005.07 19z"
//           />
//         </svg>
//       </div>
//       <h3 className="mt-4 text-sm font-medium text-gray-900">
//         Failed to load jobs
//       </h3>
//       <p className="mt-1 text-sm text-gray-500 max-w-sm">
//         Please try again in a moment.
//       </p>
//     </div>
//   );
// }

// function EmptyState() {
//   return (
//     <div className="flex flex-col items-center justify-center min-h-[400px] text-center bg-white rounded-xl border border-pink-100 p-8">
//       <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-pink-50 text-rose-600">
//         <svg
//           className="w-6 h-6"
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//           aria-hidden="true"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//           />
//         </svg>
//       </div>
//       <h3 className="mt-4 text-sm font-medium text-gray-900">
//         No jobs match your filters
//       </h3>
//       <p className="mt-1 text-sm text-gray-500 max-w-sm">
//         Try adjusting or clearing some filters to see more results.
//       </p>
//     </div>
//   );
// }

// app/jobs/jobs-list-client.tsx
"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import JobCard from "@/components/jobs/job-card";
import Pagination from "@/components/jobs/pagination";
import JobFilters from "@/components/jobs/job-filters";
import MobileFilters from "@/components/jobs/mobile-filters";
import { fetchJobs, JobsQueryParams } from "@/lib/api/jobs";
import { jobKeys } from "@/lib/api/query-keys";

interface Props {
  initialParams: JobsQueryParams;
}

export default function JobsListClient({ initialParams }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageFromUrl = Number(searchParams.get("page") ?? 1) || 1;

  const params: JobsQueryParams = useMemo(
    () => ({ ...initialParams, page: pageFromUrl }),
    [initialParams, pageFromUrl],
  );

  const { data, isPending, isError, isFetching } = useQuery({
    queryKey: jobKeys.list(params),
    queryFn: () => fetchJobs(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });

  const jobs = data?.jobs ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;
  const limit = data?.limit ?? initialParams.limit ?? 10;

  const startIndex = (pageFromUrl - 1) * limit;
  const endIndex = Math.min(startIndex + limit, total);

  const handlePageChange = (p: number) => {
    const next = new URLSearchParams(searchParams.toString());
    next.set("page", String(p));
    router.push(`/jobs?${next.toString()}`, { scroll: false });
    requestAnimationFrame(() => {
      document
        .getElementById("job-results-top")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  return (
    <section className="w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)] gap-6 lg:gap-8 lg:items-start">
          {/* Sidebar — desktop only */}
          <aside className="hidden lg:block lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto lg:pr-2 lg:-mr-2">
            <JobFilters total={total} />
          </aside>

          {/* Results */}
          <div
            id="job-results-top"
            className="min-w-0 flex flex-col min-h-[70vh]"
          >
            {/* Header row — stacks on very small screens */}
            <header className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3 mb-5">
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 tracking-tight">
                  Job Results
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
                  {total} {total === 1 ? "job" : "jobs"} found
                </p>
              </div>
              <div className="shrink-0">
                <MobileFilters total={total} />
              </div>
            </header>

            {/* Results area */}
            <div className="flex-1 min-w-0">
              {isError ? (
                <ErrorState />
              ) : isPending ? (
                <JobListSkeleton count={limit} />
              ) : jobs.length === 0 ? (
                <EmptyState />
              ) : (
                <>
                  <ul
                    className={`space-y-3 transition-opacity duration-200 ${
                      isFetching ? "opacity-60" : "opacity-100"
                    }`}
                  >
                    {jobs.map((job) => (
                      <li key={job._id} className="min-w-0">
                        <JobCard job={job} />
                      </li>
                    ))}
                  </ul>

                  <Pagination
                    currentPage={pageFromUrl}
                    totalPages={totalPages}
                    startIndex={startIndex}
                    endIndex={endIndex}
                    total={total}
                    onPageChange={handlePageChange}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function JobListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <ul className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <li
          key={i}
          className="bg-white rounded-xl border border-pink-100 p-5 sm:p-6 animate-pulse"
        >
          <div className="flex gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-pink-50 shrink-0" />
            <div className="flex-1 space-y-3 min-w-0">
              <div className="h-5 bg-pink-50 rounded w-3/4 sm:w-1/3" />
              <div className="h-4 bg-pink-50 rounded w-1/2 sm:w-1/4" />
              <div className="h-3 bg-pink-50 rounded w-full" />
              <div className="h-3 bg-pink-50 rounded w-5/6 sm:w-2/3" />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

function ErrorState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center bg-white rounded-xl border border-pink-100 p-6 sm:p-8">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-rose-50 text-rose-600">
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01M5.07 19h13.86a2 2 0 001.74-2.99l-6.93-12a2 2 0 00-3.48 0l-6.93 12A2 2 0 005.07 19z"
          />
        </svg>
      </div>
      <h3 className="mt-4 text-sm font-medium text-gray-900">
        Failed to load jobs
      </h3>
      <p className="mt-1 text-sm text-gray-500 max-w-sm">
        Please try again in a moment.
      </p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center bg-white rounded-xl border border-pink-100 p-6 sm:p-8">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-pink-50 text-rose-600">
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <h3 className="mt-4 text-sm font-medium text-gray-900">
        No jobs match your filters
      </h3>
      <p className="mt-1 text-sm text-gray-500 max-w-sm">
        Try adjusting or clearing some filters to see more results.
      </p>
    </div>
  );
}
