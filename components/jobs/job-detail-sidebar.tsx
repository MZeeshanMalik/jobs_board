// components/job-detail-sidebar.tsx
import { JobPost } from "@/types/job";
import {
  formatExperienceLevel,
  formatLocationType,
  isValidHttpUrl,
} from "@/lib/job-utils";

interface JobDetailSidebarProps {
  job: JobPost;
}

export default function JobDetailSidebar({ job }: JobDetailSidebarProps) {
  const hasCompanyInfo = job.aboutCompany || isValidHttpUrl(job.companyUrl);

  return (
    <aside className="space-y-6">
      {/* Job Overview */}
      <section
        className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm"
        aria-labelledby="job-overview-heading"
      >
        <h2
          id="job-overview-heading"
          className="text-sm font-semibold text-gray-900 uppercase tracking-wide"
        >
          Job Overview
        </h2>
        <dl className="mt-4 space-y-4 text-sm">
          <OverviewRow label="Employment Type">
            {formatEmploymentType(job.employmentType)}
          </OverviewRow>
          <OverviewRow label="Experience">
            {formatExperienceLevel(job.experienceLevel)}
          </OverviewRow>
          <OverviewRow label="Work Mode">
            {formatLocationType(job.jobLocationType)}
          </OverviewRow>
          {job.validThrough && (
            <OverviewRow label="Apply Before">
              {new Date(job.validThrough).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </OverviewRow>
          )}
        </dl>
      </section>

      {/* Skills */}
      {job.skills.length > 0 && (
        <section
          className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm"
          aria-labelledby="skills-heading"
        >
          <h2
            id="skills-heading"
            className="text-sm font-semibold text-gray-900 uppercase tracking-wide"
          >
            Skills
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {job.skills.map((skill) => (
              <li key={skill}>
                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-rose-50 text-rose-700 border border-rose-100">
                  {skill}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Company */}
      {hasCompanyInfo && (
        <section
          className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm"
          aria-labelledby="company-heading"
        >
          <h2
            id="company-heading"
            className="text-sm font-semibold text-gray-900 uppercase tracking-wide"
          >
            About {job.companyName}
          </h2>
          {job.aboutCompany && (
            <p className="mt-3 text-sm text-gray-600 leading-relaxed">
              {job.aboutCompany}
            </p>
          )}
          {isValidHttpUrl(job.companyUrl) && (
            <a
              href={job.companyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-rose-600 hover:text-rose-700 transition-colors"
            >
              Visit website
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
        </section>
      )}
    </aside>
  );
}

function OverviewRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-gray-500">{label}</dt>
      <dd className="font-medium text-gray-900 text-right">{children}</dd>
    </div>
  );
}

// Local helper to avoid circular import
function formatEmploymentType(type: JobPost["employmentType"]): string {
  const map: Record<JobPost["employmentType"], string> = {
    FULL_TIME: "Full-time",
    PART_TIME: "Part-time",
    CONTRACTOR: "Contract",
    TEMPORARY: "Temporary",
    INTERN: "Internship",
    VOLUNTEER: "Volunteer",
    PER_DIEM: "Per Diem",
    OTHER: "Other",
  };
  return map[type] ?? type;
}
