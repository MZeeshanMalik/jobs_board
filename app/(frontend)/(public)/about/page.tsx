// app/about/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "JobBoard helps students and fresh graduates across Pakistan find their first job, internship, and dream career. Learn about our mission, values, and story.",
  keywords: [
    "about jobboard",
    "jobs for students pakistan",
    "internships pakistan",
    "fresh graduate jobs pakistan",
    "careers pakistan",
  ],
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About JobBoard — Helping Students Find Jobs in Pakistan",
    description:
      "JobBoard helps students and fresh graduates across Pakistan find their first job, internship, and dream career.",
    type: "website",
    url: "/about",
  },
};

const stats = [
  { value: "10,000+", label: "Active job listings" },
  { value: "2,500+", label: "Hiring companies" },
  { value: "150,000+", label: "Students helped" },
  { value: "25+", label: "Cities covered" },
];

const values = [
  {
    title: "Opportunity for Everyone",
    description:
      "Whether you are a fresh graduate or an experienced professional, we connect you with roles that match your skills and ambitions.",
    icon: (
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
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      </svg>
    ),
  },
  {
    title: "Built for Students",
    description:
      "We started with students in mind — internships, entry-level roles, and part-time opportunities tailored for those starting their careers.",
    icon: (
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
          d="M12 14l9-5-9-5-9 5 9 5z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
        />
      </svg>
    ),
  },
  {
    title: "Trusted by Employers",
    description:
      "Top companies across Pakistan trust us to reach talented candidates — from startups in Lahore to enterprises in Karachi and Islamabad.",
    icon: (
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
    ),
  },
];

export default function AboutPage() {
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

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white text-rose-700 ring-1 ring-rose-200 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-2" />
            About JobBoard
          </span>
          <h1 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight leading-tight">
            Helping Students Find Their{" "}
            <span className="bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
              Dream Job
            </span>
          </h1>
          <p className="mt-5 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            JobBoard is a Pakistan-first job platform built to help students,
            fresh graduates, and early-career professionals discover meaningful
            opportunities — from internships to full-time roles with top
            companies across the country.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-10 relative">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl border border-pink-100 shadow-sm p-5 sm:p-6 text-center"
            >
              <p className="text-2xl sm:text-3xl font-bold text-rose-600 tracking-tight">
                {stat.value}
              </p>
              <p className="mt-1 text-xs sm:text-sm text-gray-600">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Our Story */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="prose-custom">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Our Story
          </h2>
          <p className="mt-5 text-gray-600 leading-relaxed">
            Every year, thousands of students graduate from universities across
            Pakistan with great skills and big ambitions — but finding that
            first opportunity is often the hardest part. Scattered job boards,
            unclear listings, and unpaid "experience" roles make the journey
            harder than it needs to be.
          </p>
          <p className="mt-4 text-gray-600 leading-relaxed">
            We started JobBoard to change that. Our goal is simple:{" "}
            <span className="font-medium text-gray-900">
              make it easy for students to find real jobs, internships, and
              entry-level roles from companies that actually want to hire fresh
              talent.
            </span>{" "}
            No clutter. No misleading listings. Just real opportunities, in one
            place.
          </p>
          <p className="mt-4 text-gray-600 leading-relaxed">
            Today, we work with startups, SMEs, and enterprises across Lahore,
            Karachi, Islamabad, and beyond — helping them connect with the next
            generation of Pakistani talent.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="bg-pink-50/40 border-y border-pink-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              What We Stand For
            </h2>
            <p className="mt-3 text-gray-600">
              Three principles guide everything we build.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {values.map((value) => (
              <div
                key={value.title}
                className="bg-white rounded-2xl border border-pink-100 p-6 shadow-sm hover:shadow-md hover:border-rose-200 transition-all"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 text-white">
                  {value.icon}
                </div>
                <h3 className="mt-4 text-base font-semibold text-gray-900">
                  {value.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
          Ready to start your career?
        </h2>
        <p className="mt-3 text-gray-600 max-w-xl mx-auto">
          Browse thousands of opportunities from companies hiring across
          Pakistan.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/jobs"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-rose-600 text-white font-medium hover:bg-rose-700 active:bg-rose-800 transition-colors shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 w-full sm:w-auto"
          >
            Browse Jobs
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
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-white text-gray-700 font-medium border border-pink-100 hover:border-rose-300 hover:text-rose-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 w-full sm:w-auto"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </main>
  );
}
