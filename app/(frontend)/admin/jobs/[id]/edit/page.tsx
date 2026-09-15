// app/admin/jobs/[id]/edit/page.tsx
"use client";

import React, { useState, useEffect } from "react";
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
import JobArticleEditor from "@/components/admin/editor/JobArticleEditor";
import { withAdminAuth } from "@/components/admin/AdminAuth";

function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = React.use(params);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState<JobPostFormData | null>(null);
  const [contentRef, setContentRef] = useState<string>("");
  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      const response = await fetch(`/api/admin/jobs/${id}`);
      const data = await response.json();

      if (data.success) {
        const job = data.data;
        setFormData({
          title: job.title,
          contentJson: job.contentJson,
          companyName: job.companyName,
          companyLogoUrl: job.companyLogoUrl,
          companyUrl: job.companyUrl,
          aboutCompany: job.aboutCompany,
          jobLocationType: job.jobLocationType,
          locations: job.locations || [],
          applicantLocationRequirement: job.applicantLocationRequirement,
          employmentType: job.employmentType,
          experienceLevel: job.experienceLevel,
          salary: job.salary,
          datePosted: job.datePosted,
          validThrough: job.validThrough,
          skills: job.skills || [],
          applyUrl: job.applyUrl,
          metaDescription: job.metaDescription,
          slug: job.slug,
        });
        setContentRef(job.contentJson);
      } else {
        setError(data.message || "Failed to load job");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleEditorSave = (jsonString: string) => {
    setContentRef(jsonString);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const data = {
        ...formData,
        contentJson: contentRef,
      };

      const response = await fetch(`/api/admin/jobs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess("Job updated successfully!");
        setTimeout(() => router.push("/admin/jobs"), 1500);
      } else {
        setError(result.message || "Failed to update job");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  if (!formData) {
    return <div className="p-6 text-center text-red-600">Job not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Job</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Basic Information
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Name *
            </label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) =>
                setFormData({ ...formData, companyName: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Employment Type
              </label>
              <select
                value={formData.employmentType}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    employmentType: e.target.value as EmploymentType,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Experience Level
              </label>
              <select
                value={formData.experienceLevel}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    experienceLevel: e.target.value as ExperienceLevel,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Application URL *
            </label>
            <input
              type="url"
              value={formData.applyUrl}
              onChange={(e) =>
                setFormData({ ...formData, applyUrl: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        {/* Job Description */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Job Description
          </h2>
          <JobArticleEditor
            onSave={handleEditorSave}
            // initialContent={formData.contentJson}
          />
        </div>

        {/* Location */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Location</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location Type
              </label>
              <div className="flex gap-2">
                {(["ON_SITE", "HYBRID", "REMOTE"] as JobLocationType[]).map(
                  (type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, jobLocationType: type })
                      }
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                        formData.jobLocationType === type
                          ? "bg-pink-600 text-white border-pink-600"
                          : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {type}
                    </button>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/jobs")}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default withAdminAuth(EditJobPage);
