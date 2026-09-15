// app/contact/page.tsx
import type { Metadata } from "next";
import ContactForm from "@/components/contact/contact-form";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with JobBoard. Have a question, feedback, or partnership inquiry? Send us a message and we'll respond as soon as possible.",
  keywords: ["contact jobboard", "contact us", "support", "feedback"],
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact Us | JobBoard",
    description:
      "Have a question or feedback? Send us a message and we'll get back to you.",
    type: "website",
    url: "/contact",
  },
};

const contactDetails = [
  {
    label: "Email",
    value: "m121zeeshan@gmail.com",
    href: "mailto:m121zeeshan@gmail.com",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    label: "Phone",
    value: "+92 300 000 0000",
    href: "tel:+923000000000",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
        />
      </svg>
    ),
  },
  {
    label: "Office",
    value: "Lahore, Pakistan",
    href: undefined,
    icon: (
      <svg
        className="w-5 h-5"
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
    ),
  },
];

export default function ContactPage() {
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

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white text-rose-700 ring-1 ring-rose-200 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-2" />
            Contact
          </span>
          <h1 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight leading-tight">
            Get in{" "}
            <span className="bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
              Touch
            </span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-gray-600 max-w-xl mx-auto">
            Have a question, feedback, or partnership inquiry? We'd love to hear
            from you.
          </p>
        </div>
      </section>

      {/* Form + Details */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 lg:gap-12">
          {/* Form */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Send us a message
            </h2>
            <ContactForm />
          </div>

          {/* Contact details */}
          <aside className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Contact Details
            </h2>
            {contactDetails.map((item) => (
              <div
                key={item.label}
                className="flex items-start gap-3 bg-pink-50/40 border border-pink-100 rounded-xl p-4"
              >
                <div className="flex-shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white text-rose-600 border border-pink-100">
                  {item.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    {item.label}
                  </p>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="mt-0.5 block text-sm font-medium text-gray-900 hover:text-rose-600 transition-colors break-words"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="mt-0.5 text-sm font-medium text-gray-900">
                      {item.value}
                    </p>
                  )}
                </div>
              </div>
            ))}

            <div className="bg-white border border-pink-100 rounded-xl p-4">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Response Time
              </p>
              <p className="mt-0.5 text-sm text-gray-700">
                We typically respond within 24 hours on business days.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
