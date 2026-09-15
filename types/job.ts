// types/job.ts
export interface JobLocation {
  id?: string;
  streetAddress?: string;
  city: string;
  region: string;
  postalCode?: string;
  country: string;
}

export interface JobSalary {
  type: "fixed" | "range" | "hourly" | "not_specified";
  currency: string;
  unit: "HOUR" | "DAY" | "WEEK" | "MONTH" | "YEAR";
  amount?: number;
  minAmount?: number;
  maxAmount?: number;
}

export interface JobPost {
  _id: string;
  title: string;
  contentJson: string;
  companyName: string;
  companyLogoUrl?: string;
  companyUrl?: string;
  jobLocationType: "ON_SITE" | "REMOTE" | "HYBRID";
  locations: JobLocation[];
  applicantLocationRequirement?: string;
  employmentType:
    | "FULL_TIME"
    | "PART_TIME"
    | "CONTRACTOR"
    | "TEMPORARY"
    | "INTERN"
    | "VOLUNTEER"
    | "PER_DIEM"
    | "OTHER";
  experienceLevel: "entry" | "mid" | "senior" | "lead" | "executive";
  skills: string[];
  salary: JobSalary;
  datePosted: string;
  validThrough?: string;
  applyUrl: string;
  aboutCompany?: string;
  metaDescription?: string;
  slug: string;
  status: "draft" | "published" | "archived";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
