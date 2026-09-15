// app/jobs/[slug]/job-detail-client.tsx
"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import JobDetailHeader from "@/components/jobs/job-detail-header";
import JobDetailSidebar from "@/components/jobs/job-detail-sidebar";
import RichTextRenderer from "@/components/jobs/rich-text-renderer";
import { fetchJobBySlug } from "@/lib/api/jobs";
import { jobKeys } from "@/lib/api/query-keys";
import { JobPost } from "@/types/job";
import { extractPlainText } from "@/lib/job-utils";

interface Props {
  slug: string;
  initialJob: JobPost;
}

export default function JobDetailClient({ slug, initialJob }: Props) {
  const { data } = useQuery({
    queryKey: jobKeys.detail(slug),
    queryFn: () => fetchJobBySlug(slug),
    initialData: initialJob,
  });
  const job = data ?? initialJob;

  // Build JobPosting JSON-LD
  const salaryCurrency = job.salary?.currency || "USD";
  const baseSalary: Record<string, unknown> = {
    "@type": "MonetaryAmount",
    currency: salaryCurrency,
  };
  if (job.salary?.type === "range") {
    baseSalary.value = {
      "@type": "QuantitativeValue",
      minValue: job.salary.minAmount,
      maxValue: job.salary.maxAmount,
      unitText: job.salary.unit,
    };
  } else if (job.salary?.type === "fixed" || job.salary.type === "hourly") {
    baseSalary.value = {
      "@type": "QuantitativeValue",
      value: job.salary.amount,
      unitText: job.salary.unit,
    };
  }

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: extractPlainText(job.contentJson, 5000),
    datePosted: job.datePosted,
    ...(job.validThrough ? { validThrough: job.validThrough } : {}),
    employmentType: job.employmentType,
    hiringOrganization: {
      "@type": "Organization",
      name: job.companyName,
      ...(job.companyUrl ? { sameAs: job.companyUrl } : {}),
      ...(job.companyLogoUrl ? { logo: job.companyLogoUrl } : {}),
    },
    ...(job.jobLocationType === "REMOTE"
      ? { jobLocationType: "TELECOMMUTE" }
      : {}),
    jobLocation: job.locations.map((loc) => ({
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        ...(loc.streetAddress ? { streetAddress: loc.streetAddress } : {}),
        addressLocality: loc.city,
        addressRegion: loc.region,
        ...(loc.postalCode ? { postalCode: loc.postalCode } : {}),
        addressCountry: loc.country,
      },
    })),
    ...(job.salary.type !== "not_specified" ? { baseSalary } : {}),
    skills: job.skills.join(", "),
    experienceRequirements: job.experienceLevel,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-gray-50">
        <JobDetailHeader job={job} />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
            <article className="bg-white rounded-xl border border-gray-100 p-6 sm:p-8 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Job Description
              </h2>
              <RichTextRenderer contentJson={job.contentJson} />

              <div className="mt-8 pt-6 border-t border-gray-100">
                <a
                  href={job.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-lg bg-rose-600 text-white font-medium hover:bg-rose-700 transition-colors shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
                >
                  Apply for this position
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </a>
              </div>
            </article>

            <JobDetailSidebar job={job} />
          </div>

          <div className="mt-8">
            <Link
              href="/jobs"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-rose-600 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to all jobs
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
