// app/admin/jobs/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { withAdminAuth } from "@/components/admin/AdminAuth";

interface Job {
  _id: string;
  title: string;
  slug: string;
  companyName: string;
  employmentType: string;
  experienceLevel: string;
  jobLocationType: string;
  locations: Array<{ city: string; region: string; country: string }>;
  status: "draft" | "published" | "archived";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

function AdminJobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    fetchJobs();
  }, [pagination.page, statusFilter, searchTerm]);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(statusFilter !== "all" && { status: statusFilter }),
        ...(searchTerm && { search: searchTerm }),
      });

      const response = await fetch(`/api/admin/jobs?${params}`);
      const data = await response.json();

      if (data.success) {
        setJobs(data.data);
        setPagination(data.pagination);
      } else {
        setError(data.message || "Failed to load jobs");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm("Are you sure you want to delete this job?")) return;

    try {
      const response = await fetch(`/api/admin/jobs/${jobId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        setJobs(jobs.filter((job) => job._id !== jobId));
        setShowDeleteModal(false);
        setJobToDelete(null);
      } else {
        setError(data.message || "Failed to delete job");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedJobs.length === 0) {
      alert("Please select at least one job");
      return;
    }

    if (
      !confirm(
        `Are you sure you want to ${action} ${selectedJobs.length} job(s)?`,
      )
    ) {
      return;
    }

    try {
      const response = await fetch("/api/admin/jobs/bulk", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobIds: selectedJobs,
          action,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSelectedJobs([]);
        fetchJobs();
      } else {
        setError(data.message || "Failed to perform bulk action");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    }
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      published: "bg-green-100 text-green-700",
      draft: "bg-yellow-100 text-yellow-700",
      archived: "bg-gray-100 text-gray-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  const getEmploymentLabel = (type: string) => {
    const labels: Record<string, string> = {
      FULL_TIME: "Full-time",
      PART_TIME: "Part-time",
      CONTRACTOR: "Contract",
      TEMPORARY: "Temporary",
      INTERN: "Internship",
      VOLUNTEER: "Volunteer",
    };
    return labels[type] || type;
  };

  if (loading && jobs.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Jobs</h1>
          <p className="text-sm text-gray-500 mt-1">
            {pagination.total} total jobs found
          </p>
        </div>
        <Link
          href="/admin/jobs/new"
          className="px-4 py-2 bg-pink-600 text-white rounded-lg font-semibold hover:bg-pink-700 transition-colors"
        >
          + Post New Job
        </Link>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search jobs by title or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedJobs.length > 0 && (
        <div className="bg-pink-50 border border-pink-200 rounded-xl p-4 mb-6 flex flex-wrap items-center gap-4">
          <span className="text-sm font-medium text-pink-800">
            {selectedJobs.length} job(s) selected
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => handleBulkAction("publish")}
              className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
            >
              Publish
            </button>
            <button
              onClick={() => handleBulkAction("archive")}
              className="px-3 py-1 bg-yellow-600 text-white rounded-lg text-sm hover:bg-yellow-700"
            >
              Archive
            </button>
            <button
              onClick={() => handleBulkAction("delete")}
              className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
            >
              Delete
            </button>
          </div>
          <button
            onClick={() => setSelectedJobs([])}
            className="text-sm text-pink-700 hover:text-pink-900"
          >
            Clear selection
          </button>
        </div>
      )}

      {/* Jobs Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={
                      selectedJobs.length === jobs.length && jobs.length > 0
                    }
                    onChange={() => {
                      if (selectedJobs.length === jobs.length) {
                        setSelectedJobs([]);
                      } else {
                        setSelectedJobs(jobs.map((j) => j._id));
                      }
                    }}
                    className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                  />
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Title
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Company
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Location
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {jobs.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No jobs found
                  </td>
                </tr>
              ) : (
                jobs.map((job) => (
                  <tr
                    key={job._id}
                    className="hover:bg-pink-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedJobs.includes(job._id)}
                        onChange={() => {
                          if (selectedJobs.includes(job._id)) {
                            setSelectedJobs(
                              selectedJobs.filter((id) => id !== job._id),
                            );
                          } else {
                            setSelectedJobs([...selectedJobs, job._id]);
                          }
                        }}
                        className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/jobs/${job.slug}`}
                        className="text-pink-600 hover:text-pink-700 font-medium"
                      >
                        {job.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {job.companyName}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {getEmploymentLabel(job.employmentType)}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {job.jobLocationType === "REMOTE"
                        ? "🌍 Remote"
                        : job.locations[0]?.city || "N/A"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(job.status)}`}
                      >
                        {job.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/jobs/${job._id}/edit`}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => {
                            setJobToDelete(job._id);
                            setShowDeleteModal(true);
                          }}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
              of {pagination.total} jobs
            </p>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
                }
                disabled={pagination.page === 1}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="px-3 py-1 text-sm text-gray-700">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() =>
                  setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
                }
                disabled={pagination.page === pagination.totalPages}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && jobToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Confirm Delete
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this job? This action cannot be
              undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setJobToDelete(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteJob(jobToDelete)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default withAdminAuth(AdminJobsPage);
