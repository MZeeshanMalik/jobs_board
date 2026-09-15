// app/companies/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import CompanyCard from "@/components/companies/company-card";
import { companies, companyCategories } from "@/data/companies";

export const metadata: Metadata = {
  title: "Companies Hiring in Pakistan — Government, Banks & Hospitals",
  description:
    "Discover top companies hiring in Pakistan. Explore government jobs, banking careers at HBL, UBL, Meezan Bank, and healthcare roles at Aga Khan, Shaukat Khanum, Indus Hospital, and more.",
  keywords: [
    "companies hiring in pakistan",
    "government jobs pakistan",
    "bank jobs pakistan",
    "hospital jobs pakistan",
    "HBL careers",
    "Meezan Bank jobs",
    "Aga Khan Hospital careers",
    "Shaukat Khanum jobs",
  ],
  alternates: { canonical: "/companies" },
  openGraph: {
    title: "Companies Hiring in Pakistan — Government, Banks & Hospitals",
    description:
      "Explore government, banking, and healthcare employers hiring across Pakistan.",
    type: "website",
    url: "/companies",
  },
};

export default function CompaniesPage() {
  const totalJobs = companies.reduce((sum, c) => sum + c.openJobs, 0);

  return (
    <main className="bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-pink-50 via-pink-50/60 to-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-rose-200/40 blur-3xl" />
          <div className="absolute -bottom-32 -left-24 w-96 h-96 rounded-full bg-pink-200/50 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 text-center">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white text-rose-700 ring-1 ring-rose-200 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-2" />
            {totalJobs}+ open positions across Pakistan
          </span>

          <h1 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight leading-tight">
            Companies Hiring in{" "}
            <span className="bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
              Pakistan
            </span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            We post jobs from government departments, top Pakistani banks, and
            leading hospitals — plus private sector roles across the country.
          </p>
        </div>
      </section>

      {/* Focus areas */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            What We Cover
          </h2>
          <p className="mt-3 text-gray-600">
            We focus on the sectors where Pakistani job seekers look the most.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {companyCategories.map((cat) => (
            <div
              key={cat.key}
              className="bg-white rounded-2xl border border-pink-100 p-6 shadow-sm hover:shadow-md hover:border-rose-200 transition-all"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 text-white">
                {cat.icon}
              </div>
              <h3 className="mt-4 text-base font-semibold text-gray-900">
                {cat.title}
              </h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                {cat.subtitle}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Government notice */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16">
        <div className="rounded-2xl bg-pink-50/60 border border-pink-100 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-rose-600 text-white shrink-0">
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
                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
              />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-semibold text-gray-900">
              Government jobs are a big part of what we post
            </h2>
            <p className="mt-1 text-sm text-gray-600 leading-relaxed">
              From federal departments like NADRA and PSO to provincial roles at
              WAPDA, Pakistan Railways, and SNGPL — we list public sector
              openings as they are announced.
            </p>
          </div>
          <Link
            href="/jobs?q=government"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-rose-600 text-white text-sm font-medium hover:bg-rose-700 transition-colors shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 whitespace-nowrap shrink-0"
          >
            View Government Jobs
          </Link>
        </div>
      </section>

      {/* All companies */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Browse by Employer
            </h2>
            <p className="mt-2 text-sm sm:text-base text-gray-600">
              Top Pakistani banks, hospitals, and government departments hiring
              now.
            </p>
          </div>
          <Link
            href="/jobs"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-rose-600 hover:text-rose-700 transition-colors self-start sm:self-auto whitespace-nowrap"
          >
            See all jobs
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {companies.map((company) => (
            <CompanyCard key={company.slug} company={company} />
          ))}
        </div>
      </section>
    </main>
  );
}
