// components/admin/JobJsonSidebar.tsx
"use client";

import { useState } from "react";

interface Props {
  onApply: (data: Partial<JobPostFormDataInput>) => void;
  onError?: (message: string) => void;
}

export interface JobPostFormDataInput {
  title?: string;
  contentJson?: string;
  companyName?: string;
  companyLogoUrl?: string;
  companyUrl?: string;
  aboutCompany?: string;
  jobLocationType?: "ON_SITE" | "REMOTE" | "HYBRID";
  locations?: Array<{
    id?: string;
    streetAddress?: string;
    city?: string;
    region?: string;
    postalCode?: string;
    country?: string;
  }>;
  applicantLocationRequirement?: string;
  employmentType?: string;
  experienceLevel?: string;
  skills?: string[] | string;
  salary?: {
    type?: "fixed" | "range" | "hourly" | "not_specified";
    currency?: string;
    unit?: "HOUR" | "DAY" | "WEEK" | "MONTH" | "YEAR";
    amount?: number;
    minAmount?: number;
    maxAmount?: number;
  };
  datePosted?: string;
  validThrough?: string;
  applyUrl?: string;
  metaDescription?: string;
  slug?: string;
}

const SAMPLE: JobPostFormDataInput = {
  title: "Senior Backend Engineer",
  companyName: "Acme Inc.",
  companyLogoUrl: "https://acme.com/logo.png",
  companyUrl: "https://acme.com",
  aboutCompany: "Acme builds developer tools used by thousands of teams.",
  jobLocationType: "HYBRID",
  locations: [
    {
      city: "Karachi",
      region: "Sindh",
      postalCode: "75500",
      country: "PK",
    },
  ],
  employmentType: "FULL_TIME",
  experienceLevel: "senior",
  skills: ["Node.js", "PostgreSQL", "Docker"],
  salary: {
    type: "range",
    currency: "PKR",
    unit: "MONTH",
    minAmount: 200000,
    maxAmount: 350000,
  },
  datePosted: new Date().toISOString().slice(0, 10),
  applyUrl: "https://acme.com/careers/apply",
  metaDescription:
    "Join Acme as a Senior Backend Engineer to build scalable APIs with Node.js.",
  slug: "senior-backend-engineer-acme",
};

export default function JobJsonSidebar({ onApply, onError }: Props) {
  const [open, setOpen] = useState(true);
  const [raw, setRaw] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const apply = () => {
    setError(null);
    setOk(null);

    if (!raw.trim()) {
      setError("Paste some JSON first.");
      return;
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Invalid JSON";
      setError(msg);
      onError?.(msg);
      return;
    }

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      setError("Top-level JSON must be an object.");
      return;
    }

    onApply(parsed as JobPostFormDataInput);
    setOk("Form filled from JSON.");
  };

  const loadSample = () => {
    setRaw(JSON.stringify(SAMPLE, null, 2));
    setError(null);
    setOk(null);
  };

  const clear = () => {
    setRaw("");
    setError(null);
    setOk(null);
  };

  const format = () => {
    try {
      setRaw(JSON.stringify(JSON.parse(raw), null, 2));
      setError(null);
    } catch {
      setError("Cannot format — invalid JSON.");
    }
  };

  return (
    <aside className="hidden xl:block w-[340px] shrink-0">
      <div className="sticky top-20 space-y-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">
              JSON Autofill
            </h2>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="text-xs text-gray-500 hover:text-gray-900"
              aria-expanded={open}
            >
              {open ? "Hide" : "Show"}
            </button>
          </div>

          {open && (
            <>
              <p className="mt-2 text-xs text-gray-500 leading-relaxed">
                Paste a job object. Fields are applied to the form below.
                Missing fields are left untouched.
              </p>

              <textarea
                value={raw}
                onChange={(e) => setRaw(e.target.value)}
                rows={14}
                spellCheck={false}
                placeholder={`{
  "title": "Senior Backend Engineer",
  "companyName": "Acme Inc.",
  "employmentType": "FULL_TIME",
  "experienceLevel": "senior",
  "skills": ["Node.js", "PostgreSQL"],
  "salary": {
    "type": "range",
    "currency": "PKR",
    "unit": "MONTH",
    "minAmount": 200000,
    "maxAmount": 350000
  }
}`}
                className="mt-3 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-xs font-mono text-gray-900 placeholder:text-gray-400 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-100"
              />

              {error && (
                <p className="mt-2 text-xs text-red-600 break-words">{error}</p>
              )}
              {ok && !error && (
                <p className="mt-2 text-xs text-green-600">{ok}</p>
              )}

              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={apply}
                  className="inline-flex items-center justify-center px-3.5 py-2 rounded-lg text-xs font-semibold text-white bg-pink-600 hover:bg-pink-700 transition-colors"
                >
                  Apply to form
                </button>
                <button
                  type="button"
                  onClick={format}
                  className="inline-flex items-center justify-center px-3 py-2 rounded-lg text-xs font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  Format
                </button>
                <button
                  type="button"
                  onClick={loadSample}
                  className="inline-flex items-center justify-center px-3 py-2 rounded-lg text-xs font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  Load sample
                </button>
                <button
                  type="button"
                  onClick={clear}
                  className="inline-flex items-center justify-center px-3 py-2 rounded-lg text-xs font-medium text-gray-500 hover:text-red-600 transition-colors"
                >
                  Clear
                </button>
              </div>
            </>
          )}
        </div>

        {/* Field reference */}
        <div className="bg-pink-50/60 rounded-xl border border-pink-100 p-4">
          <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wide">
            Accepted fields
          </h3>
          <ul className="mt-2 text-xs text-gray-600 space-y-1 font-mono">
            <li>title</li>
            <li>contentJson</li>
            <li>companyName, companyLogoUrl, companyUrl</li>
            <li>aboutCompany</li>
            <li>jobLocationType: ON_SITE | HYBRID | REMOTE</li>
            <li>locations[]: {"{ city, region, postalCode, country }"}</li>
            <li>applicantLocationRequirement</li>
            <li>employmentType</li>
            <li>experienceLevel</li>
            <li>skills (array or CSV string)</li>
            <li>
              salary: {"{ type, currency, unit, amount, minAmount, maxAmount }"}
            </li>
            <li>datePosted, validThrough</li>
            <li>applyUrl, metaDescription, slug</li>
          </ul>
        </div>
      </div>
    </aside>
  );
}
