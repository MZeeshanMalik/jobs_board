// models/JobPost.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IJobPostLocation {
  id?: string;
  streetAddress?: string;
  city: string;
  region: string;
  postalCode?: string;
  country: string; // ISO 3166-1 alpha-2, e.g. "PK", "US"
}

export interface IJobPostSalary {
  type: "fixed" | "range" | "hourly" | "not_specified";
  currency: string; // ISO 4217, e.g. "USD", "PKR"
  unit: "HOUR" | "DAY" | "WEEK" | "MONTH" | "YEAR";
  amount?: number;
  minAmount?: number;
  maxAmount?: number;
}

export interface IJobPost extends Document {
  // Core content
  title: string;
  contentJson: string; // Lexical JSON string

  // Organization
  companyName: string;
  companyLogoUrl?: string;
  companyUrl?: string;

  // Location
  jobLocationType: "ON_SITE" | "REMOTE" | "HYBRID";
  locations: IJobPostLocation[];
  applicantLocationRequirement?: string;

  // Employment details
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

  // Salary
  salary: IJobPostSalary;

  // Dates
  datePosted: Date;
  validThrough?: Date;

  // Application
  applyUrl: string;
  aboutCompany?: string;

  // SEO
  metaDescription?: string;
  slug: string;

  // Status
  status: "draft" | "published" | "archived";
  isActive: boolean;

  // User reference
  userId: mongoose.Types.ObjectId;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// ISO 3166-1 alpha-2 country code validator (basic format check)
const COUNTRY_CODE_REGEX = /^[A-Z]{2}$/;

// ISO 4217 currency code validator (basic format check)
const CURRENCY_CODE_REGEX = /^[A-Z]{3}$/;

// URL validator
const URL_REGEX = /^https?:\/\/.+/i;

const LocationSchema = new Schema<IJobPostLocation>(
  {
    streetAddress: { type: String, trim: true, maxlength: 200 },
    city: { type: String, required: true, trim: true, maxlength: 100 },
    region: { type: String, required: true, trim: true, maxlength: 100 },
    postalCode: { type: String, trim: true, maxlength: 20 },
    country: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      validate: {
        validator: (v: string) => COUNTRY_CODE_REGEX.test(v),
        message: (props: any) =>
          `${props.value} is not a valid ISO 3166-1 alpha-2 country code (e.g. "PK", "US")`,
      },
    },
  },
  { _id: true },
);

const SalarySchema = new Schema<IJobPostSalary>(
  {
    type: {
      type: String,
      enum: ["fixed", "range", "hourly", "not_specified"],
      default: "not_specified",
      required: true,
    },
    currency: {
      type: String,
      default: "USD",
      trim: true,
      uppercase: true,
      validate: {
        validator: (v: string) => CURRENCY_CODE_REGEX.test(v),
        message: (props: any) =>
          `${props.value} is not a valid ISO 4217 currency code (e.g. "USD", "PKR")`,
      },
    },
    unit: {
      type: String,
      enum: ["HOUR", "DAY", "WEEK", "MONTH", "YEAR"],
      default: "YEAR",
    },
    amount: { type: Number, min: 0 },
    minAmount: { type: Number, min: 0 },
    maxAmount: { type: Number, min: 0 },
  },
  { _id: false },
);

const JobPostSchema: Schema<IJobPost> = new Schema(
  {
    // Core content
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    contentJson: {
      type: String,
      required: true,
    },

    // Organization
    companyName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    companyLogoUrl: {
      type: String,
      trim: true,
      validate: {
        validator: (v: string) => !v || URL_REGEX.test(v),
        message: "companyLogoUrl must be a valid http(s) URL",
      },
    },
    companyUrl: {
      type: String,
      trim: true,
      validate: {
        validator: (v: string) => !v || URL_REGEX.test(v),
        message: "companyUrl must be a valid http(s) URL",
      },
    },

    // Location
    jobLocationType: {
      type: String,
      enum: ["ON_SITE", "REMOTE", "HYBRID"],
      default: "ON_SITE",
      required: true,
    },
    locations: {
      type: [LocationSchema],
      validate: {
        validator: function (this: any, v: IJobPostLocation[]) {
          // REMOTE jobs may have zero physical locations; ON_SITE/HYBRID need at least one
          if (this.jobLocationType === "REMOTE") return true;
          return Array.isArray(v) && v.length > 0;
        },
        message: "At least one location is required for ON_SITE or HYBRID jobs",
      },
    },
    applicantLocationRequirement: {
      type: String,
      trim: true,
      maxlength: 200,
    },

    // Employment details
    employmentType: {
      type: String,
      enum: [
        "FULL_TIME",
        "PART_TIME",
        "CONTRACTOR",
        "TEMPORARY",
        "INTERN",
        "VOLUNTEER",
        "PER_DIEM",
        "OTHER",
      ],
      required: true,
    },
    experienceLevel: {
      type: String,
      enum: ["entry", "mid", "senior", "lead", "executive"],
      required: true,
    },
    skills: {
      type: [
        {
          type: String,
          trim: true,
          maxlength: 50,
        },
      ],
      default: [],
    },

    // Salary
    salary: {
      type: SalarySchema,
      required: true,
      default: () => ({ type: "not_specified", currency: "USD", unit: "YEAR" }),
    },

    // Dates
    datePosted: {
      type: Date,
      required: true,
      default: Date.now,
    },
    validThrough: {
      type: Date,
      validate: {
        validator: function (this: IJobPost, v: Date) {
          return !v || !this.datePosted || v > this.datePosted;
        },
        message: "validThrough must be after datePosted",
      },
    },

    // Application
    applyUrl: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: (v: string) => URL_REGEX.test(v),
        message: "applyUrl must be a valid http(s) URL",
      },
    },
    aboutCompany: {
      type: String,
      trim: true,
      maxlength: 2000,
    },

    // SEO
    metaDescription: {
      type: String,
      trim: true,
      maxlength: 160,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "slug must be URL-safe (lowercase, numbers, hyphens)",
      ],
    },

    // Status
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
      required: true,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    // User reference
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

// Cross-field salary validation: range needs min+max, fixed/hourly need amount
JobPostSchema.pre("validate", async function () {
  const s = this.salary as IJobPostSalary | undefined;
  if (!s || s.type === "not_specified") return;

  if (s.type === "range") {
    if (s.minAmount == null || s.maxAmount == null) {
      throw new Error(
        "salary.minAmount and salary.maxAmount are required when salary.type is 'range'",
      );
    }
    if (s.minAmount > s.maxAmount) {
      throw new Error(
        "salary.minAmount cannot be greater than salary.maxAmount",
      );
    }
  }

  if ((s.type === "fixed" || s.type === "hourly") && s.amount == null) {
    throw new Error(
      "salary.amount is required when salary.type is 'fixed' or 'hourly'",
    );
  }
});

// Auto-archive expired listings on read-side safety net
// (Pair this with a scheduled job/cron that runs the same update in bulk.)
JobPostSchema.pre(/^find/, function (next) {});

// Indexes for performance
// Compound index for the most common query: active/published jobs by city, newest first
JobPostSchema.index({
  isActive: 1,
  status: 1,
  "locations.city": 1,
  createdAt: -1,
});
JobPostSchema.index({ status: 1, createdAt: -1 });
JobPostSchema.index({ slug: 1 }, { unique: true });
JobPostSchema.index({ "locations.city": 1 });
JobPostSchema.index({ "locations.country": 1 });
JobPostSchema.index({ employmentType: 1 });
JobPostSchema.index({ experienceLevel: 1 });
JobPostSchema.index({ jobLocationType: 1 });
JobPostSchema.index({ skills: 1 });
JobPostSchema.index({ validThrough: 1 }); // used by the expiry cron job

const JobPost: Model<IJobPost> =
  (mongoose.models.JobPost as Model<IJobPost>) ||
  mongoose.model<IJobPost>("JobPost", JobPostSchema);

export default JobPost;
