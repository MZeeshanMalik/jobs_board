// components/job-card.tsx
import Link from "next/link";
import { JobPost } from "@/types/job";
import {
  formatSalary,
  formatEmploymentType,
  formatLocationType,
  formatLocation,
  formatRelativeDate,
  extractPlainText,
} from "@/lib/job-utils";

interface JobCardProps {
  job: JobPost;
}

export default function JobCard({ job }: JobCardProps) {
  const description = job.metaDescription || extractPlainText(job.contentJson);
  const location = formatLocation(job);
  const salary = formatSalary(job.salary);
  const isRemote = job.jobLocationType === "REMOTE";

  return (
    <article
      className=" group relative bg-white rounded-xl border border-gray-100 p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-rose-200 transition-all duration-200"
      itemScope
      itemType="https://schema.org/JobPosting"
    >
      <meta itemProp="datePosted" content={job.datePosted} />
      {job.validThrough && (
        <meta itemProp="validThrough" content={job.validThrough} />
      )}

      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        {/* Company Logo */}
        <div className="flex-shrink-0">
          {job.companyLogoUrl ? (
            <img
              src={job.companyLogoUrl}
              alt={`${job.companyName} logo`}
              className="w-14 h-14 rounded-lg object-contain bg-gray-50 p-1 border border-gray-100"
              itemProp="hiringOrganization"
            />
          ) : (
            <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
              {job.companyName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <Link
                href={`/jobs/${job.slug}`}
                className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 rounded"
                aria-label={`View details for ${job.title} at ${job.companyName}`}
              >
                <h2
                  className="text-lg font-semibold text-gray-900 group-hover:text-rose-600 transition-colors truncate"
                  itemProp="title"
                >
                  {job.title}
                </h2>
              </Link>

              <p
                className="mt-1 text-sm text-gray-600 truncate"
                itemProp="hiringOrganization"
              >
                {job.companyName}
              </p>
            </div>

            {/* Employment Type Badge */}
            <span
              className={`flex-shrink-0 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                isRemote
                  ? "bg-pink-50 text-pink-700 ring-1 ring-pink-200"
                  : "bg-rose-50 text-rose-700 ring-1 ring-rose-200"
              }`}
            >
              {formatEmploymentType(job.employmentType)}
            </span>
          </div>

          {/* Meta Row */}
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-gray-600">
            <span className="inline-flex items-center gap-1.5">
              <svg
                className="w-4 h-4 text-gray-400"
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
              <span itemProp="jobLocation">{location}</span>
            </span>

            <span className="inline-flex items-center gap-1.5">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span itemProp="baseSalary">{salary}</span>
            </span>

            <span className="inline-flex items-center gap-1.5 text-gray-500">
              <svg
                className="w-4 h-4 text-gray-400"
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
              <time dateTime={job.datePosted}>
                {formatRelativeDate(job.datePosted)}
              </time>
            </span>
          </div>

          {/* Description */}
          {description && (
            <p
              className="mt-3 text-sm text-gray-600 line-clamp-2"
              itemProp="description"
            >
              {description}
            </p>
          )}

          {/* Skills Tags */}
          {job.skills.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {job.skills.slice(0, 5).map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-50 text-gray-700 border border-gray-100"
                >
                  {skill}
                </span>
              ))}
              {job.skills.length > 5 && (
                <span className="inline-flex items-center px-2 py-0.5 text-xs text-gray-500">
                  +{job.skills.length - 5} more
                </span>
              )}
            </div>
          )}

          {/* View Link */}
          <div className="mt-4">
            <Link
              href={`/jobs/${job.slug}`}
              className="inline-flex items-center gap-1 text-sm font-medium text-rose-600 hover:text-rose-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 rounded"
            >
              View details
              <svg
                className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
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
        </div>
      </div>
    </article>
  );
}
