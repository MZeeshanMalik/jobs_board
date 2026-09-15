// lib/job-utils.ts
import { JobSalary } from "@/types/job";

export function formatSalary(salary: JobSalary): string {
  if (salary.type === "not_specified") return "Salary not specified";

  const currencySymbols: Record<string, string> = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    PKR: "₨",
    INR: "₹",
    CAD: "C$",
    AUD: "A$",
  };

  const symbol = currencySymbols[salary.currency] || salary.currency;
  const unitMap: Record<string, string> = {
    HOUR: "/hr",
    DAY: "/day",
    WEEK: "/wk",
    MONTH: "/mo",
    YEAR: "/yr",
  };
  const unit = unitMap[salary.unit] || "";

  const formatNumber = (n: number) =>
    n >= 1000 ? `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k` : n.toString();

  if (salary.type === "range" && salary.minAmount && salary.maxAmount) {
    return `${symbol}${formatNumber(salary.minAmount)} - ${symbol}${formatNumber(salary.maxAmount)}${unit}`;
  }

  if ((salary.type === "fixed" || salary.type === "hourly") && salary.amount) {
    return `${symbol}${formatNumber(salary.amount)}${unit}`;
  }

  return "Salary not specified";
}

export function formatEmploymentType(type: JobPost["employmentType"]): string {
  const map: Record<JobPost["employmentType"], string> = {
    FULL_TIME: "Full-time",
    PART_TIME: "Part-time",
    CONTRACTOR: "Contract",
    TEMPORARY: "Temporary",
    INTERN: "Internship",
    VOLUNTEER: "Volunteer",
    PER_DIEM: "Per Diem",
    OTHER: "Other",
  };
  return map[type] || type;
}

export function formatLocationType(type: JobPost["jobLocationType"]): string {
  const map: Record<JobPost["jobLocationType"], string> = {
    ON_SITE: "On-site",
    REMOTE: "Remote",
    HYBRID: "Hybrid",
  };
  return map[type] || type;
}

export function formatLocation(job: JobPost): string {
  if (job.jobLocationType === "REMOTE") {
    return job.applicantLocationRequirement || "Remote";
  }
  if (job.locations.length === 0) return "Location not specified";
  const loc = job.locations[0];
  return `${loc.city}, ${loc.country}`;
}

export function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

export function extractPlainText(contentJson: string, maxLength = 200): string {
  try {
    const parsed = JSON.parse(contentJson);
    const text = extractTextFromLexical(parsed);
    return text.length > maxLength
      ? text.slice(0, maxLength).trim() + "..."
      : text;
  } catch {
    return "";
  }
}

function extractTextFromLexical(node: any): string {
  if (!node) return "";
  if (typeof node === "string") return node;
  if (node.text) return node.text;
  if (Array.isArray(node.children)) {
    return node.children.map(extractTextFromLexical).join(" ");
  }
  return "";
}

export function experienceLevelLabel(
  level: JobPost["experienceLevel"],
): string {
  const map: Record<JobPost["experienceLevel"], string> = {
    entry: "Entry Level",
    mid: "Mid Level",
    senior: "Senior Level",
    lead: "Lead",
    executive: "Executive",
  };
  return map[level] || level;
}

// lib/job-utils.ts (additions)
import { JobPost } from "@/types/job";

export function formatFullLocation(
  job: Pick<
    JobPost,
    "jobLocationType" | "locations" | "applicantLocationRequirement"
  >,
): string {
  if (job.jobLocationType === "REMOTE") {
    return job.applicantLocationRequirement
      ? `Remote — ${job.applicantLocationRequirement}`
      : "Remote";
  }

  if (!job.locations || job.locations.length === 0) {
    return "Location not specified";
  }

  return job.locations
    .map((loc) => {
      const parts = [loc.city, loc.region, loc.country].filter(Boolean);
      return parts.join(", ");
    })
    .join(" • ");
}

export function formatExperienceLevel(
  level: JobPost["experienceLevel"],
): string {
  const map: Record<JobPost["experienceLevel"], string> = {
    entry: "Entry Level",
    mid: "Mid Level",
    senior: "Senior Level",
    lead: "Lead",
    executive: "Executive",
  };
  return map[level] ?? level;
}

export function getSalaryDisplay(salary: JobPost["salary"]): string {
  if (salary.type === "not_specified") return "Not disclosed";

  const symbols: Record<string, string> = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    PKR: "₨",
    INR: "₹",
    CAD: "C$",
    AUD: "A$",
  };
  const symbol = symbols[salary.currency] ?? `${salary.currency} `;

  const unitMap: Record<string, string> = {
    HOUR: "per hour",
    DAY: "per day",
    WEEK: "per week",
    MONTH: "per month",
    YEAR: "per year",
  };
  const unit = unitMap[salary.unit] ?? "";

  const fmt = (n: number) => n.toLocaleString("en-US");

  if (salary.type === "range" && salary.minAmount && salary.maxAmount) {
    return `${symbol}${fmt(salary.minAmount)} – ${symbol}${fmt(salary.maxAmount)} ${unit}`;
  }
  if ((salary.type === "fixed" || salary.type === "hourly") && salary.amount) {
    return `${symbol}${fmt(salary.amount)} ${unit}`;
  }
  return "Not disclosed";
}

export function isValidHttpUrl(value?: string): boolean {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
