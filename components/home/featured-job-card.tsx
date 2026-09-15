import Link from "next/link";
import { JobPost } from "@/types/job";
import {
  formatEmploymentType,
  formatExperienceLevel,
  formatLocation,
  formatRelativeDate,
  getSalaryDisplay,
} from "@/lib/job-utils";

interface Props {
  job: JobPost;
}

export default function FeaturedJobCard({ job }: Props) {
  const initials = job.companyName
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <article className="group relative flex flex-col h-full bg-white rounded-2xl border border-pink-100 p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-rose-200 hover:-translate-y-0.5 transition-all duration-200">
      {/* Save button */}
      <button
        type="button"
        aria-label={`Save ${job.title}`}
        className="absolute top-4 right-4 inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-300 hover:text-rose-600 hover:bg-rose-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
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
            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-4-7 4V5z"
          />
        </svg>
      </button>

      {/* Header */}
      <div className="flex items-start gap-4 pr-8">
        {job.companyLogoUrl ? (
          <img
            src={job.companyLogoUrl}
            alt={`${job.companyName} logo`}
            className="flex-shrink-0 w-12 h-12 rounded-xl object-contain bg-white border border-pink-100 p-1"
          />
        ) : (
          <div
            className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 text-white font-bold text-sm"
            aria-hidden="true"
          >
            {initials}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-rose-600 transition-colors">
            {job.title}
          </h3>
          <p className="mt-1 text-sm text-gray-600 truncate">
            {job.companyName}
          </p>
        </div>
      </div>

      {/* Meta */}
      <ul className="mt-4 space-y-2 text-sm text-gray-600">
        <li className="flex items-center gap-2">
          <svg
            className="w-4 h-4 text-rose-500 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span className="truncate">{formatLocation(job)}</span>
        </li>
        <li className="flex items-center gap-2">
          <svg
            className="w-4 h-4 text-rose-500 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <span className="truncate">
            {formatEmploymentType(job.employmentType)}
          </span>
        </li>
        <li className="flex items-center gap-2">
          <svg
            className="w-4 h-4 text-rose-500 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="truncate">
            {formatExperienceLevel(job.experienceLevel)}
          </span>
        </li>
      </ul>

      {/* Footer */}
      <div className="mt-5 pt-4 border-t border-pink-100 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">
            {getSalaryDisplay(job.salary)}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            {formatRelativeDate(job.datePosted)}
          </p>
        </div>
        <Link
          href={`/jobs/${job.slug}`}
          className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-rose-600 text-white text-sm font-medium hover:bg-rose-700 active:bg-rose-800 transition-colors shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 whitespace-nowrap"
        >
          View Job
        </Link>
      </div>
    </article>
  );
}
