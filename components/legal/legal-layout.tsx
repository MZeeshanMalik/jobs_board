// components/legal/legal-layout.tsx
import Link from "next/link";

interface Section {
  heading: string;
  body: React.ReactNode;
}

interface Props {
  title: string;
  updated: string;
  intro: string;
  sections: Section[];
}

export default function LegalLayout({
  title,
  updated,
  intro,
  sections,
}: Props) {
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

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 text-center">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white text-rose-700 ring-1 ring-rose-200 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-2" />
            Legal
          </span>
          <h1 className="mt-5 text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight leading-tight">
            {title}
          </h1>
          <p className="mt-3 text-sm text-gray-500">Last updated: {updated}</p>
          <p className="mt-5 text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {intro}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="space-y-10">
          {sections.map((s, i) => (
            <div key={i}>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 tracking-tight">
                {s.heading}
              </h2>
              <div className="mt-4 space-y-4 text-gray-600 leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1.5 [&_a]:text-rose-600 [&_a]:hover:text-rose-700 [&_a]:underline [&_a]:underline-offset-2 [&_strong]:text-gray-900">
                {s.body}
              </div>
            </div>
          ))}
        </div>

        {/* Cross links */}
        <nav
          aria-label="Other legal pages"
          className="mt-14 pt-8 border-t border-pink-100"
        >
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Related
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              href="/privacy"
              className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-white text-gray-700 border border-pink-100 hover:border-rose-300 hover:text-rose-600 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-white text-gray-700 border border-pink-100 hover:border-rose-300 hover:text-rose-600 transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/cookies"
              className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-white text-gray-700 border border-pink-100 hover:border-rose-300 hover:text-rose-600 transition-colors"
            >
              Cookie Policy
            </Link>
          </div>
        </nav>

        {/* Contact */}
        <div className="mt-10 rounded-2xl bg-pink-50/60 border border-pink-100 p-6">
          <h3 className="text-sm font-semibold text-gray-900">
            Questions about this policy?
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            Email us at{" "}
            <a
              href="mailto:legal@jobboard.pk"
              className="text-rose-600 hover:text-rose-700 underline underline-offset-2"
            >
              legal@jobboard.pk
            </a>{" "}
            or visit our{" "}
            <Link
              href="/contact"
              className="text-rose-600 hover:text-rose-700 underline underline-offset-2"
            >
              contact page
            </Link>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
