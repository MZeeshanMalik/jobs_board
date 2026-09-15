export type EmploymentType =
  | "FULL_TIME"
  | "PART_TIME"
  | "CONTRACTOR"
  | "TEMPORARY"
  | "INTERN"
  | "VOLUNTEER"
  | "PER_DIEM"
  | "OTHER";

export type ExperienceLevel = "entry" | "mid" | "senior" | "lead" | "executive";

export type SalaryType = "fixed" | "range" | "hourly" | "not_specified";

export type SalaryUnit = "HOUR" | "DAY" | "WEEK" | "MONTH" | "YEAR";

export interface SalaryInfo {
  type: SalaryType;
  currency: string; // ISO 4217, e.g. "USD"
  unit: SalaryUnit;
  /** Used when type is 'fixed' or 'hourly' */
  amount?: number;
  /** Used when type is 'range' */
  minAmount?: number;
  maxAmount?: number;
}

export type JobLocationType = "ON_SITE" | "REMOTE" | "HYBRID";

export interface JobLocation {
  id: string; // client-side key for list rendering, not persisted meaning
  streetAddress?: string;
  city: string;
  region: string; // state/province
  postalCode?: string;
  country: string; // ISO 3166-1 alpha-2, e.g. "US"
}

export interface JobPostFormData {
  // --- Core content (Google required) ---
  title: string;
  contentJson: string; // Lexical JSON string (rich description body)

  // --- Organization (Google required) ---
  companyName: string;
  companyLogoUrl?: string;
  companyUrl?: string;

  // --- Location (Google required, unless fully remote) ---
  jobLocationType: JobLocationType;
  locations: JobLocation[]; // empty allowed only if jobLocationType === 'REMOTE'
  /** Only relevant when jobLocationType is REMOTE: where remote applicants may be based */
  applicantLocationRequirement?: string;

  // --- Recommended by Google ---
  employmentType: EmploymentType;
  salary: SalaryInfo;
  datePosted: string; // YYYY-MM-DD
  validThrough?: string; // YYYY-MM-DD

  // --- Site-specific / not part of schema, but useful for filtering & UX ---
  experienceLevel: ExperienceLevel;
  skills: string[]; // tags for on-site filtering/search
  applyUrl: string; // where "Apply" sends the candidate
  aboutCompany?: string; // short blurb, separate from full description body

  // --- SEO meta (page-level, not schema) ---
  metaDescription?: string; // for <meta name="description">; falls back to auto-generated
  slug?: string; // URL slug; auto-generated from title if omitted
}

export const EMPLOYMENT_TYPE_LABELS: Record<EmploymentType, string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACTOR: "Contract",
  TEMPORARY: "Temporary",
  INTERN: "Internship",
  VOLUNTEER: "Volunteer",
  PER_DIEM: "Per diem",
  OTHER: "Other",
};

export const EXPERIENCE_LEVEL_LABELS: Record<ExperienceLevel, string> = {
  entry: "Entry level",
  mid: "Mid level",
  senior: "Senior",
  lead: "Lead",
  executive: "Executive",
};
