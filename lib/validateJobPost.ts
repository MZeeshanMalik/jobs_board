// lib/validateJobPost.ts

import { JobPostFormData } from "@/types/job-post-types";

export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Validates against Google for Jobs' required-field rules.
 * A silently-dropped listing (no Google-side warning) is worse than a
 * blocked form submission, so we enforce these client-side before saving.
 */
export function validateJobPost(data: JobPostFormData): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data.title.trim()) {
    errors.push({ field: "title", message: "Job title is required." });
  } else if (data.title.length > 100) {
    errors.push({
      field: "title",
      message:
        "Keep the title concise — under 100 characters works best for search results.",
    });
  }

  // if (!data.contentJson || data.contentJson.trim() === "") {
  //   errors.push({
  //     field: "contentJson",
  //     message: "Job description is required.",
  //   });
  // }

  if (!data.companyName.trim()) {
    errors.push({ field: "companyName", message: "Company name is required." });
  }

  if (data.jobLocationType !== "REMOTE" && data.locations.length === 0) {
    errors.push({
      field: "locations",
      message: "Add at least one location, or mark this job as fully remote.",
    });
  }

  if (
    data.jobLocationType === "REMOTE" &&
    !data.applicantLocationRequirement?.trim()
  ) {
    errors.push({
      field: "applicantLocationRequirement",
      message: "Specify which regions remote applicants may be based in.",
    });
  }

  data.locations.forEach((loc, i) => {
    if (!loc.city.trim() || !loc.country.trim()) {
      errors.push({
        field: `locations.${i}`,
        message: `Location ${i + 1}: city and country are required.`,
      });
    }
  });

  if (!data.datePosted) {
    errors.push({ field: "datePosted", message: "Date posted is required." });
  }

  if (
    data.validThrough &&
    data.datePosted &&
    new Date(data.validThrough) < new Date(data.datePosted)
  ) {
    errors.push({
      field: "validThrough",
      message: "Valid-through date must be after the post date.",
    });
  }

  if (data.salary.type === "fixed" || data.salary.type === "hourly") {
    if (!data.salary.amount || data.salary.amount <= 0) {
      errors.push({ field: "salary", message: "Enter a valid salary amount." });
    }
  }

  if (data.salary.type === "range") {
    if (!data.salary.minAmount || !data.salary.maxAmount) {
      errors.push({
        field: "salary",
        message: "Enter both minimum and maximum salary.",
      });
    } else if (data.salary.minAmount > data.salary.maxAmount) {
      errors.push({
        field: "salary",
        message: "Minimum salary cannot exceed maximum.",
      });
    }
  }

  if (!data.applyUrl.trim()) {
    errors.push({
      field: "applyUrl",
      message: "An application link or email is required.",
    });
  }

  return errors;
}
