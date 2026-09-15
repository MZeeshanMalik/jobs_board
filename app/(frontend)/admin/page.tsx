// app/admin/jobs/new/page.tsx
"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type {
  EmploymentType,
  ExperienceLevel,
  JobLocation,
  JobLocationType,
  JobPostFormData,
  SalaryType,
  SalaryUnit,
} from "@/types/job-post-types";
import {
  EMPLOYMENT_TYPE_LABELS,
  EXPERIENCE_LEVEL_LABELS,
} from "@/types/job-post-types";
import { validateJobPost, type ValidationError } from "@/lib/validateJobPost";
import JobArticleEditor from "@/components/admin/editor/JobArticleEditor";
import JobJsonSidebar, {
  type JobPostFormDataInput,
} from "@/components/admin/JobJsonSidebar";

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function makeLocationId(): string {
  return `loc_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-100";

const labelClass = "block text-sm font-medium text-gray-700 mb-1";

const sectionClass = "bg-white rounded-xl border border-gray-200 p-6 space-y-5";

const errorTextClass = "text-xs text-red-600 mt-1";

function fieldError(
  errors: ValidationError[],
  field: string,
): string | undefined {
  return errors.find((e) => e.field === field)?.message;
}

const VALID_EMPLOYMENT: EmploymentType[] = [
  "FULL_TIME",
  "PART_TIME",
  "CONTRACTOR",
  "TEMPORARY",
  "INTERN",
  "VOLUNTEER",
  "PER_DIEM",
  "OTHER",
];

const VALID_EXPERIENCE: ExperienceLevel[] = [
  "entry",
  "mid",
  "senior",
  "lead",
  "executive",
];

const VALID_LOCATION_TYPES: JobLocationType[] = ["ON_SITE", "REMOTE", "HYBRID"];

const VALID_SALARY_TYPES: SalaryType[] = [
  "fixed",
  "range",
  "hourly",
  "not_specified",
];

const VALID_SALARY_UNITS: SalaryUnit[] = [
  "HOUR",
  "DAY",
  "WEEK",
  "MONTH",
  "YEAR",
];

export default function NewJobPostPage() {
  const router = useRouter();
  const contentRef = useRef<string | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyLogoUrl, setCompanyLogoUrl] = useState("");
  const [companyUrl, setCompanyUrl] = useState("");
  const [aboutCompany, setAboutCompany] = useState("");

  const [jobLocationType, setJobLocationType] =
    useState<JobLocationType>("ON_SITE");
  const [locations, setLocations] = useState<JobLocation[]>([
    { id: makeLocationId(), city: "", region: "", country: "PK" },
  ]);
  const [applicantLocationRequirement, setApplicantLocationRequirement] =
    useState("");

  const [employmentType, setEmploymentType] =
    useState<EmploymentType>("FULL_TIME");
  const [experienceLevel, setExperienceLevel] =
    useState<ExperienceLevel>("mid");

  const [salaryType, setSalaryType] = useState<SalaryType>("range");
  const [salaryCurrency, setSalaryCurrency] = useState("PKR");
  const [salaryUnit, setSalaryUnit] = useState<SalaryUnit>("MONTH");
  const [salaryAmount, setSalaryAmount] = useState("");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");

  const [datePosted, setDatePosted] = useState(todayISO());
  const [validThrough, setValidThrough] = useState("");

  const [skillsInput, setSkillsInput] = useState("");
  const [applyUrl, setApplyUrl] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [slug, setSlug] = useState("");

  // UI states
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<ValidationError[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const skills = useMemo(
    () =>
      skillsInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    [skillsInput],
  );

  const autoSlug = useMemo(
    () =>
      title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-"),
    [title],
  );

  // ---------- JSON autofill ----------
  const handleJsonApply = (data: JobPostFormDataInput) => {
    const s = (v: unknown, fallback = ""): string =>
      typeof v === "string" ? v : v == null ? fallback : String(v);
    const n = (v: unknown): string =>
      typeof v === "number" && !Number.isNaN(v) ? String(v) : "";

    // Core
    if (data.title !== undefined) setTitle(s(data.title));
    if (data.companyName !== undefined) setCompanyName(s(data.companyName));
    if (data.companyLogoUrl !== undefined)
      setCompanyLogoUrl(s(data.companyLogoUrl));
    if (data.companyUrl !== undefined) setCompanyUrl(s(data.companyUrl));
    if (data.aboutCompany !== undefined) setAboutCompany(s(data.aboutCompany));

    // Content
    if (typeof data.contentJson === "string") {
      contentRef.current = data.contentJson;
    }

    // Location
    if (
      data.jobLocationType &&
      VALID_LOCATION_TYPES.includes(data.jobLocationType)
    ) {
      setJobLocationType(data.jobLocationType);
    }

    if (Array.isArray(data.locations)) {
      const next: JobLocation[] = data.locations.map((l) => ({
        id: l.id ?? makeLocationId(),
        streetAddress: l.streetAddress,
        city: s(l.city),
        region: s(l.region),
        postalCode: l.postalCode,
        country: s(l.country, "PK").toUpperCase(),
      }));
      setLocations(
        next.length > 0
          ? next
          : [{ id: makeLocationId(), city: "", region: "", country: "PK" }],
      );
    }

    if (data.applicantLocationRequirement !== undefined) {
      setApplicantLocationRequirement(s(data.applicantLocationRequirement));
    }

    // Employment
    if (
      data.employmentType &&
      VALID_EMPLOYMENT.includes(data.employmentType as EmploymentType)
    ) {
      setEmploymentType(data.employmentType as EmploymentType);
    }
    if (
      data.experienceLevel &&
      VALID_EXPERIENCE.includes(data.experienceLevel as ExperienceLevel)
    ) {
      setExperienceLevel(data.experienceLevel as ExperienceLevel);
    }

    // Skills — array or CSV string
    if (Array.isArray(data.skills)) {
      setSkillsInput(data.skills.filter(Boolean).map(String).join(", "));
    } else if (typeof data.skills === "string") {
      setSkillsInput(data.skills);
    }

    // Salary
    if (data.salary && typeof data.salary === "object") {
      const sal = data.salary;
      if (sal.type && VALID_SALARY_TYPES.includes(sal.type)) {
        setSalaryType(sal.type);
      }
      if (sal.currency) setSalaryCurrency(s(sal.currency).toUpperCase());
      if (sal.unit && VALID_SALARY_UNITS.includes(sal.unit)) {
        setSalaryUnit(sal.unit);
      }
      if (sal.amount !== undefined) setSalaryAmount(n(sal.amount));
      if (sal.minAmount !== undefined) setSalaryMin(n(sal.minAmount));
      if (sal.maxAmount !== undefined) setSalaryMax(n(sal.maxAmount));
    }

    // Dates
    if (data.datePosted) setDatePosted(s(data.datePosted).slice(0, 10));
    if (data.validThrough !== undefined) {
      setValidThrough(s(data.validThrough).slice(0, 10));
    }

    // Application
    if (data.applyUrl !== undefined) setApplyUrl(s(data.applyUrl));

    // SEO
    if (data.metaDescription !== undefined) {
      setMetaDescription(s(data.metaDescription).slice(0, 160));
    }
    if (data.slug !== undefined) setSlug(s(data.slug));

    // Reset error state so the user can submit immediately
    setSubmitError(null);
    setFieldErrors([]);
    setSuccessMessage(null);
  };

  const handleEditorSave = (jsonString: string): void => {
    contentRef.current = jsonString;
  };

  const addLocation = () => {
    setLocations((prev) => [
      ...prev,
      { id: makeLocationId(), city: "", region: "", country: "PK" },
    ]);
  };

  const removeLocation = (id: string) => {
    setLocations((prev) => prev.filter((l) => l.id !== id));
  };

  const updateLocation = (id: string, patch: Partial<JobLocation>) => {
    setLocations((prev) =>
      prev.map((l) => (l.id === id ? { ...l, ...patch } : l)),
    );
  };

  const buildFormData = (): JobPostFormData => ({
    title,
    contentJson: contentRef.current || "",
    companyName,
    companyLogoUrl: companyLogoUrl || undefined,
    companyUrl: companyUrl || undefined,
    aboutCompany: aboutCompany || undefined,
    jobLocationType,
    locations: jobLocationType === "REMOTE" ? [] : locations,
    applicantLocationRequirement: applicantLocationRequirement || undefined,
    employmentType,
    experienceLevel,
    salary: {
      type: salaryType,
      currency: salaryCurrency,
      unit: salaryUnit,
      amount:
        salaryType === "fixed" || salaryType === "hourly"
          ? Number(salaryAmount) || undefined
          : undefined,
      minAmount:
        salaryType === "range" ? Number(salaryMin) || undefined : undefined,
      maxAmount:
        salaryType === "range" ? Number(salaryMax) || undefined : undefined,
    },
    datePosted,
    validThrough: validThrough || undefined,
    skills,
    applyUrl,
    metaDescription: metaDescription || undefined,
    slug: slug || autoSlug || undefined,
  });

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    setSubmitError(null);
    setSuccessMessage(null);

    const data = buildFormData();
    const errors = validateJobPost(data);
    setFieldErrors(errors);

    if (errors.length > 0) {
      setSubmitError("Please fix the highlighted fields before publishing.");
      const el = document.querySelector(
        `[data-field="${errors[0].field.split(".")[0]}"]`,
      );
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setSaving(true);

    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.errors) {
          setFieldErrors(result.errors);
          setSubmitError(
            result.errors[0]?.message ||
              "Validation failed. Please check your inputs.",
          );
        } else {
          throw new Error(result.message || "Failed to save job post");
        }
        return;
      }

      setSuccessMessage("Job post published successfully! Redirecting...");
      // setTimeout(() => {
      //   router.push(`/jobs/${result.data.slug || result.data._id}`);
      // }, 1500);
    } catch (err: unknown) {
      console.error("Submit error:", err);
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Something went wrong while saving. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex gap-8 items-start">
        {/* JSON autofill sidebar */}
        <JobJsonSidebar onApply={handleJsonApply} />

        {/* Form column */}
        <div className="flex-1 min-w-0 max-w-3xl">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Post a new job</h1>
            <p className="text-sm text-gray-500 mt-1">
              Fields marked with <span className="text-red-500">*</span> are
              required for your listing to appear in Google for Jobs.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* --- Core details --- */}
            <section className={sectionClass} data-field="title">
              <h2 className="text-base font-semibold text-gray-900">
                Job details
              </h2>

              <div>
                <label className={labelClass}>
                  Job title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Senior Backend Engineer"
                  className={inputClass}
                  required
                />
                <p className="text-xs text-gray-400 mt-1">
                  Use just the role name — avoid adding company, location, or
                  salary here.
                </p>
                {fieldError(fieldErrors, "title") && (
                  <p className={errorTextClass}>
                    {fieldError(fieldErrors, "title")}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Employment type</label>
                  <select
                    value={employmentType}
                    onChange={(e) =>
                      setEmploymentType(e.target.value as EmploymentType)
                    }
                    className={inputClass}
                  >
                    {Object.entries(EMPLOYMENT_TYPE_LABELS).map(
                      ([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ),
                    )}
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Experience level</label>
                  <select
                    value={experienceLevel}
                    onChange={(e) =>
                      setExperienceLevel(e.target.value as ExperienceLevel)
                    }
                    className={inputClass}
                  >
                    {Object.entries(EXPERIENCE_LEVEL_LABELS).map(
                      ([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ),
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label className={labelClass}>Skills / tags</label>
                <input
                  type="text"
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                  placeholder="React, Node.js, PostgreSQL (comma separated)"
                  className={inputClass}
                />
                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center rounded-full bg-pink-50 text-pink-700 text-xs font-medium px-2.5 py-1"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* --- Company --- */}
            <section className={sectionClass} data-field="companyName">
              <h2 className="text-base font-semibold text-gray-900">Company</h2>

              <div>
                <label className={labelClass}>
                  Company name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Acme Inc."
                  className={inputClass}
                  required
                />
                {fieldError(fieldErrors, "companyName") && (
                  <p className={errorTextClass}>
                    {fieldError(fieldErrors, "companyName")}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Company logo URL</label>
                  <input
                    type="url"
                    value={companyLogoUrl}
                    onChange={(e) => setCompanyLogoUrl(e.target.value)}
                    placeholder="https://acme.com/logo.png"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Company website</label>
                  <input
                    type="url"
                    value={companyUrl}
                    onChange={(e) => setCompanyUrl(e.target.value)}
                    placeholder="https://acme.com"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>About the company</label>
                <textarea
                  value={aboutCompany}
                  onChange={(e) => setAboutCompany(e.target.value)}
                  placeholder="A short 2–3 sentence blurb about what the company does."
                  rows={3}
                  className={inputClass}
                />
              </div>
            </section>

            {/* --- Location --- */}
            <section className={sectionClass} data-field="locations">
              <h2 className="text-base font-semibold text-gray-900">
                Location
              </h2>

              <div>
                <label className={labelClass}>Work arrangement</label>
                <div className="flex gap-2 flex-wrap">
                  {(["ON_SITE", "HYBRID", "REMOTE"] as JobLocationType[]).map(
                    (type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setJobLocationType(type)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                          jobLocationType === type
                            ? "bg-pink-600 text-white border-pink-600"
                            : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {type === "ON_SITE"
                          ? "On-site"
                          : type === "HYBRID"
                            ? "Hybrid"
                            : "Remote"}
                      </button>
                    ),
                  )}
                </div>
              </div>

              {jobLocationType === "REMOTE" ? (
                <div>
                  <label className={labelClass}>
                    Where can remote applicants be based?{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={applicantLocationRequirement}
                    onChange={(e) =>
                      setApplicantLocationRequirement(e.target.value)
                    }
                    placeholder="United States, or Worldwide"
                    className={inputClass}
                  />
                  {fieldError(fieldErrors, "applicantLocationRequirement") && (
                    <p className={errorTextClass}>
                      {fieldError(fieldErrors, "applicantLocationRequirement")}
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {locations.map((loc, i) => (
                    <div
                      key={loc.id}
                      className="rounded-lg border border-gray-200 p-3 relative"
                    >
                      {locations.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeLocation(loc.id)}
                          className="absolute top-2 right-2 text-xs text-gray-400 hover:text-red-500"
                          aria-label="Remove location"
                        >
                          ✕
                        </button>
                      )}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">
                            City <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={loc.city}
                            onChange={(e) =>
                              updateLocation(loc.id, { city: e.target.value })
                            }
                            placeholder="Karachi"
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">
                            State / Region
                          </label>
                          <input
                            type="text"
                            value={loc.region}
                            onChange={(e) =>
                              updateLocation(loc.id, { region: e.target.value })
                            }
                            placeholder="Sindh"
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">
                            Postal code
                          </label>
                          <input
                            type="text"
                            value={loc.postalCode || ""}
                            onChange={(e) =>
                              updateLocation(loc.id, {
                                postalCode: e.target.value,
                              })
                            }
                            placeholder="75500"
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">
                            Country <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={loc.country}
                            onChange={(e) =>
                              updateLocation(loc.id, {
                                country: e.target.value,
                              })
                            }
                            placeholder="PK"
                            className={inputClass}
                          />
                        </div>
                      </div>
                      {fieldError(fieldErrors, `locations.${i}`) && (
                        <p className={errorTextClass}>
                          {fieldError(fieldErrors, `locations.${i}`)}
                        </p>
                      )}
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addLocation}
                    className="text-sm font-medium text-pink-600 hover:text-pink-700"
                  >
                    + Add another location
                  </button>

                  {fieldError(fieldErrors, "locations") && (
                    <p className={errorTextClass}>
                      {fieldError(fieldErrors, "locations")}
                    </p>
                  )}
                </div>
              )}
            </section>

            {/* --- Compensation --- */}
            <section className={sectionClass} data-field="salary">
              <h2 className="text-base font-semibold text-gray-900">
                Compensation
              </h2>
              <p className="text-xs text-gray-400 -mt-3">
                Listings with salary information tend to get more qualified
                applicants.
              </p>

              <div>
                <label className={labelClass}>Salary type</label>
                <div className="flex gap-2 flex-wrap">
                  {(
                    [
                      { value: "range", label: "Range" },
                      { value: "fixed", label: "Fixed amount" },
                      { value: "hourly", label: "Hourly rate" },
                      { value: "not_specified", label: "Don't specify" },
                    ] as { value: SalaryType; label: string }[]
                  ).map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setSalaryType(opt.value)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                        salaryType === opt.value
                          ? "bg-pink-600 text-white border-pink-600"
                          : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {salaryType !== "not_specified" && (
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>Currency</label>
                    <input
                      type="text"
                      value={salaryCurrency}
                      onChange={(e) =>
                        setSalaryCurrency(e.target.value.toUpperCase())
                      }
                      placeholder="PKR"
                      maxLength={3}
                      className={inputClass}
                    />
                  </div>

                  {salaryType === "range" ? (
                    <>
                      <div>
                        <label className={labelClass}>Min</label>
                        <input
                          type="number"
                          value={salaryMin}
                          onChange={(e) => setSalaryMin(e.target.value)}
                          placeholder="70000"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Max</label>
                        <input
                          type="number"
                          value={salaryMax}
                          onChange={(e) => setSalaryMax(e.target.value)}
                          placeholder="90000"
                          className={inputClass}
                        />
                      </div>
                    </>
                  ) : (
                    <div className="col-span-2">
                      <label className={labelClass}>Amount</label>
                      <input
                        type="number"
                        value={salaryAmount}
                        onChange={(e) => setSalaryAmount(e.target.value)}
                        placeholder={salaryType === "hourly" ? "45" : "80000"}
                        className={inputClass}
                      />
                    </div>
                  )}

                  <div>
                    <label className={labelClass}>Per</label>
                    <select
                      value={salaryUnit}
                      onChange={(e) =>
                        setSalaryUnit(e.target.value as SalaryUnit)
                      }
                      className={inputClass}
                    >
                      <option value="HOUR">Hour</option>
                      <option value="DAY">Day</option>
                      <option value="WEEK">Week</option>
                      <option value="MONTH">Month</option>
                      <option value="YEAR">Year</option>
                    </select>
                  </div>
                </div>
              )}

              {fieldError(fieldErrors, "salary") && (
                <p className={errorTextClass}>
                  {fieldError(fieldErrors, "salary")}
                </p>
              )}
            </section>

            {/* --- Dates --- */}
            <section className={sectionClass} data-field="datePosted">
              <h2 className="text-base font-semibold text-gray-900">Dates</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>
                    Date posted <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={datePosted}
                    onChange={(e) => setDatePosted(e.target.value)}
                    className={inputClass}
                  />
                  {fieldError(fieldErrors, "datePosted") && (
                    <p className={errorTextClass}>
                      {fieldError(fieldErrors, "datePosted")}
                    </p>
                  )}
                </div>
                <div>
                  <label className={labelClass}>
                    Applications close (optional)
                  </label>
                  <input
                    type="date"
                    value={validThrough}
                    onChange={(e) => setValidThrough(e.target.value)}
                    className={inputClass}
                  />
                  {fieldError(fieldErrors, "validThrough") && (
                    <p className={errorTextClass}>
                      {fieldError(fieldErrors, "validThrough")}
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* --- Description (rich text) --- */}
            <section className={sectionClass} data-field="contentJson">
              <h2 className="text-base font-semibold text-gray-900">
                Job description
              </h2>
              <p className="text-xs text-gray-400 -mt-3">
                Include responsibilities, requirements, and benefits. Use
                headings and lists.
              </p>
              <JobArticleEditor onSave={handleEditorSave} />
              {fieldError(fieldErrors, "contentJson") && (
                <p className={errorTextClass}>
                  {fieldError(fieldErrors, "contentJson")}
                </p>
              )}
            </section>

            {/* --- Application --- */}
            <section className={sectionClass} data-field="applyUrl">
              <h2 className="text-base font-semibold text-gray-900">
                How to apply
              </h2>
              <div>
                <label className={labelClass}>
                  Application link or email{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={applyUrl}
                  onChange={(e) => setApplyUrl(e.target.value)}
                  placeholder="https://acme.com/careers/apply or jobs@acme.com"
                  className={inputClass}
                />
                {fieldError(fieldErrors, "applyUrl") && (
                  <p className={errorTextClass}>
                    {fieldError(fieldErrors, "applyUrl")}
                  </p>
                )}
              </div>
            </section>

            {/* --- SEO --- */}
            <section className={sectionClass}>
              <h2 className="text-base font-semibold text-gray-900">SEO</h2>

              <div>
                <label className={labelClass}>URL slug</label>
                <div className="flex items-center gap-1 text-sm text-gray-400">
                  <span>/jobs/</span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder={autoSlug || "senior-backend-engineer"}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Meta description</label>
                <textarea
                  value={metaDescription}
                  onChange={(e) =>
                    setMetaDescription(e.target.value.slice(0, 160))
                  }
                  placeholder="A concise 1–2 sentence summary shown in Google search results."
                  rows={2}
                  className={inputClass}
                />
                <p className="text-xs text-gray-400 mt-1">
                  {metaDescription.length}/160 characters
                </p>
              </div>
            </section>

            {/* Submit Error */}
            {submitError && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3">
                <p className="text-sm text-red-700">{submitError}</p>
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3">
                <p className="text-sm text-green-700">{successMessage}</p>
              </div>
            )}

            <div className="flex justify-end pb-10">
              <button
                type="submit"
                disabled={saving}
                className={`px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition-colors ${
                  saving
                    ? "bg-pink-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-pink-600 to-purple-600 hover:shadow-lg"
                }`}
              >
                {saving ? "Publishing…" : "Publish job post"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
