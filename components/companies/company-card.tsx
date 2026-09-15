// components/companies/company-card.tsx
import Link from "next/link";
import { Company } from "@/data/companies";

interface Props {
  company: Company;
}

export default function CompanyCard({ company }: Props) {
  return (
    <article className="group flex flex-col h-full bg-white rounded-2xl border border-pink-100 p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-rose-200 hover:-translate-y-0.5 transition-all duration-200 min-w-0">
      <div className="flex items-start gap-4 min-w-0">
        <div
          aria-hidden="true"
          className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 text-white font-bold text-sm"
        >
          {company.initials}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-rose-600 transition-colors">
            {company.name}
          </h3>
          <div className="mt-1 flex items-center gap-2 text-xs">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full font-medium bg-rose-50 text-rose-700 ring-1 ring-rose-100">
              {company.category}
            </span>
          </div>
        </div>
      </div>

      <p className="mt-4 text-sm text-gray-600 line-clamp-2 leading-relaxed">
        {company.description}
      </p>

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
          <span className="truncate">{company.location}</span>
        </li>
      </ul>

      <div className="mt-5 pt-4 border-t border-pink-100 flex items-center justify-between gap-3">
        <p className="text-xs text-gray-500">
          <span className="font-semibold text-gray-900">
            {company.openJobs}
          </span>{" "}
          open {company.openJobs === 1 ? "role" : "roles"}
        </p>
        <Link
          href={`/jobs?q=${encodeURIComponent(company.name)}`}
          className="inline-flex items-center justify-center px-3.5 py-2 rounded-lg bg-rose-600 text-white text-sm font-medium hover:bg-rose-700 active:bg-rose-800 transition-colors shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 whitespace-nowrap"
        >
          View Jobs
        </Link>
      </div>
    </article>
  );
}
