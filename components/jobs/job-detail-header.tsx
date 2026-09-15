// components/job-detail-header.tsx
import Link from "next/link";
import { JobPost } from "@/types/job";
import {
  formatEmploymentType,
  formatExperienceLevel,
  formatFullLocation,
  formatLocationType,
  formatRelativeDate,
  getSalaryDisplay,
  isValidHttpUrl,
} from "@/lib/job-utils";

interface JobDetailHeaderProps {
  job: JobPost;
}

export default function JobDetailHeader({ job }: JobDetailHeaderProps) {
  const location = formatFullLocation(job);
  const salary = getSalaryDisplay(job.salary);
  const employment = formatEmploymentType(job.employmentType);
  const locationType = formatLocationType(job.jobLocationType);
  const experience = formatExperienceLevel(job.experienceLevel);

  return (
    <header className="bg-white border-b border-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-4 py-8 sm:py-10">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-1.5 text-sm text-gray-500">
            <li>
              <Link href="/" className="hover:text-rose-600 transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link
                href="/jobs"
                className="hover:text-rose-600 transition-colors"
              >
                Jobs
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li
              className="text-gray-900 font-medium truncate max-w-[200px] sm:max-w-none"
              aria-current="page"
            >
              {job.title}
            </li>
          </ol>
        </nav>

        <div className="flex flex-col sm:flex-row gap-5 sm:gap-6">
          {/* Company Logo */}
          <div className="flex-shrink-0">
            {job.companyLogoUrl && isValidHttpUrl(job.companyLogoUrl) ? (
              <img
                src={job.companyLogoUrl}
                alt={`${job.companyName} logo`}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-contain bg-gray-50 p-2 border border-gray-100"
              />
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center text-white font-bold text-2xl">
                {job.companyName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Title & Meta */}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              {job.title}
            </h1>

            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-600">
              {isValidHttpUrl(job.companyUrl) ? (
                <a
                  href={job.companyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-gray-900 hover:text-rose-600 transition-colors"
                >
                  {job.companyName}
                </a>
              ) : (
                <span className="font-medium text-gray-900">
                  {job.companyName}
                </span>
              )}
              <span aria-hidden="true">•</span>
              <span>{location}</span>
              <span aria-hidden="true">•</span>
              <span>Posted {formatRelativeDate(job.datePosted)}</span>
            </div>

            {/* Badges */}
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge color="rose">{employment}</Badge>
              <Badge color="pink">{locationType}</Badge>
              <Badge color="gray">{experience}</Badge>
            </div>
          </div>
        </div>

        {/* Apply CTA */}
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          {isValidHttpUrl(job.applyUrl) && (
            <a
              href={job.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-rose-600 text-white font-medium hover:bg-rose-700 active:bg-rose-800 transition-colors shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
            >
              Apply Now
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
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          )}
          <p className="text-sm text-gray-500">
            Salary: <span className="font-medium text-gray-700">{salary}</span>
          </p>
        </div>
      </div>
    </header>
  );
}

function Badge({
  children,
  color,
}: {
  children: React.ReactNode;
  color: "rose" | "pink" | "gray";
}) {
  const styles: Record<string, string> = {
    rose: "bg-rose-50 text-rose-700 ring-rose-200",
    pink: "bg-pink-50 text-pink-700 ring-pink-200",
    gray: "bg-gray-50 text-gray-700 ring-gray-200",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ring-1 ${styles[color]}`}
    >
      {children}
    </span>
  );
}
