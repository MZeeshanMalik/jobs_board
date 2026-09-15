// components/jobs/job-filters.tsx
"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";

const EMPLOYMENT_TYPES = [
  { value: "FULL_TIME", label: "Full-time" },
  { value: "PART_TIME", label: "Part-time" },
  { value: "CONTRACTOR", label: "Contract" },
  { value: "TEMPORARY", label: "Temporary" },
  { value: "INTERN", label: "Internship" },
  { value: "VOLUNTEER", label: "Volunteer" },
  { value: "PER_DIEM", label: "Per Diem" },
  { value: "OTHER", label: "Other" },
];

const EXPERIENCE_LEVELS = [
  { value: "entry", label: "Entry Level" },
  { value: "mid", label: "Mid Level" },
  { value: "senior", label: "Senior Level" },
  { value: "lead", label: "Lead" },
  { value: "executive", label: "Executive" },
];

const LOCATION_TYPES = [
  { value: "ON_SITE", label: "On-site" },
  { value: "REMOTE", label: "Remote" },
  { value: "HYBRID", label: "Hybrid" },
];

const SORT_OPTIONS = [
  { value: "latest", label: "Latest" },
  { value: "oldest", label: "Oldest" },
  { value: "salary_high", label: "Salary: High to Low" },
  { value: "salary_low", label: "Salary: Low to High" },
  { value: "title_asc", label: "Title: A → Z" },
  { value: "title_desc", label: "Title: Z → A" },
];

const POPULAR_CITIES = [
  "Karachi",
  "Lahore",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
  "Peshawar",
  "Quetta",
];

interface Props {
  total: number;
}

export default function JobFilters({ total }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const current = useMemo(() => {
    return {
      city: searchParams.get("city") ?? "",
      employmentType: searchParams.getAll("employmentType"),
      experienceLevel: searchParams.getAll("experienceLevel"),
      jobLocationType: searchParams.getAll("jobLocationType"),
      salaryMin: searchParams.get("salaryMin") ?? "",
      salaryMax: searchParams.get("salaryMax") ?? "",
      sort: searchParams.get("sort") ?? "latest",
      q: searchParams.get("q") ?? "",
    };
  }, [searchParams]);

  const updateParams = useCallback(
    (mutate: (p: URLSearchParams) => void) => {
      const next = new URLSearchParams(searchParams.toString());
      mutate(next);
      next.delete("page"); // reset to page 1 on any filter change
      const qs = next.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  const toggleMulti = (key: string, value: string) => {
    updateParams((p) => {
      const existing = p.getAll(key);
      p.delete(key);
      if (existing.includes(value)) {
        existing.filter((v) => v !== value).forEach((v) => p.append(key, v));
      } else {
        [...existing, value].forEach((v) => p.append(key, v));
      }
    });
  };

  const setSingle = (key: string, value: string) => {
    updateParams((p) => {
      if (value) p.set(key, value);
      else p.delete(key);
    });
  };

  const clearAll = () => {
    const next = new URLSearchParams();
    // Preserve keyword search if present
    if (current.q) next.set("q", current.q);
    const qs = next.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const activeCount =
    (current.city ? 1 : 0) +
    current.employmentType.length +
    current.experienceLevel.length +
    current.jobLocationType.length +
    (current.salaryMin ? 1 : 0) +
    (current.salaryMax ? 1 : 0);

  return (
    <aside className="lg:sticky lg:top-20 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
          Filters
        </h2>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="text-xs font-medium text-rose-600 hover:text-rose-700 transition-colors"
          >
            Clear all ({activeCount})
          </button>
        )}
      </div>

      {/* Sort */}
      <FilterCard title="Sort by">
        <select
          value={current.sort}
          onChange={(e) => setSingle("sort", e.target.value)}
          className="w-full text-sm rounded-lg border border-pink-100 bg-white px-3 py-2 focus:border-rose-300 focus:ring-2 focus:ring-rose-200 focus:outline-none"
          aria-label="Sort jobs"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </FilterCard>

      {/* City */}
      <FilterCard title="City">
        <input
          type="text"
          value={current.city}
          onChange={(e) => setSingle("city", e.target.value)}
          placeholder="Enter a city"
          className="w-full text-sm rounded-lg border border-pink-100 bg-pink-50/40 px-3 py-2 focus:border-rose-300 focus:bg-white focus:ring-2 focus:ring-rose-200 focus:outline-none placeholder:text-gray-400"
          aria-label="Filter by city"
        />
        <div className="mt-3 flex flex-wrap gap-1.5">
          {POPULAR_CITIES.map((c) => {
            const active = current.city.toLowerCase() === c.toLowerCase();
            return (
              <button
                key={c}
                type="button"
                onClick={() => setSingle("city", active ? "" : c)}
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                  active
                    ? "bg-rose-600 text-white border-rose-600"
                    : "bg-white text-gray-700 border-pink-100 hover:border-rose-300 hover:text-rose-600"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
      </FilterCard>

      {/* Work mode */}
      <FilterCard title="Work mode">
        <CheckboxGroup
          options={LOCATION_TYPES}
          values={current.jobLocationType}
          onChange={(v) => toggleMulti("jobLocationType", v)}
        />
      </FilterCard>

      {/* Employment type */}
      <FilterCard title="Employment type">
        <CheckboxGroup
          options={EMPLOYMENT_TYPES}
          values={current.employmentType}
          onChange={(v) => toggleMulti("employmentType", v)}
        />
      </FilterCard>

      {/* Experience */}
      <FilterCard title="Experience level">
        <CheckboxGroup
          options={EXPERIENCE_LEVELS}
          values={current.experienceLevel}
          onChange={(v) => toggleMulti("experienceLevel", v)}
        />
      </FilterCard>

      {/* Salary */}
      <FilterCard title="Salary range (monthly)">
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="Min"
            value={current.salaryMin}
            onChange={(e) => setSingle("salaryMin", e.target.value)}
            className="w-full text-sm rounded-lg border border-pink-100 bg-pink-50/40 px-3 py-2 focus:border-rose-300 focus:bg-white focus:ring-2 focus:ring-rose-200 focus:outline-none placeholder:text-gray-400"
            aria-label="Minimum salary"
          />
          <input
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="Max"
            value={current.salaryMax}
            onChange={(e) => setSingle("salaryMax", e.target.value)}
            className="w-full text-sm rounded-lg border border-pink-100 bg-pink-50/40 px-3 py-2 focus:border-rose-300 focus:bg-white focus:ring-2 focus:ring-rose-200 focus:outline-none placeholder:text-gray-400"
            aria-label="Maximum salary"
          />
        </div>
        <p className="mt-2 text-xs text-gray-500">
          Matches jobs whose salary range overlaps.
        </p>
      </FilterCard>

      <p className="text-xs text-gray-500">
        {total} {total === 1 ? "job" : "jobs"} found
      </p>
    </aside>
  );
}

function FilterCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white rounded-xl border border-pink-100 p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">{title}</h3>
      {children}
    </section>
  );
}

function CheckboxGroup({
  options,
  values,
  onChange,
}: {
  options: { value: string; label: string }[];
  values: string[];
  onChange: (value: string) => void;
}) {
  return (
    <ul className="space-y-2">
      {options.map((o) => {
        const checked = values.includes(o.value);
        return (
          <li key={o.value}>
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={checked}
                onChange={() => onChange(o.value)}
                className="w-4 h-4 rounded border-gray-300 text-rose-600 focus:ring-rose-500 focus:ring-offset-0"
              />
              <span
                className={`text-sm transition-colors ${
                  checked
                    ? "font-medium text-rose-700"
                    : "text-gray-700 group-hover:text-rose-600"
                }`}
              >
                {o.label}
              </span>
            </label>
          </li>
        );
      })}
    </ul>
  );
}
