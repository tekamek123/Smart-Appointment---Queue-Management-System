"use client";

import { useAuth } from "@/hooks/useAuth";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  getAllOrganizations,
  activateOrganization,
  deactivateOrganization,
  getOrganizationStats,
  OrganizationStats,
} from "@/lib/organization";
import { Organization } from "@/types/organization";
import { useState, useEffect } from "react";

export default function OrganizationsPage() {
  const { user, loading: authLoading } = useAuth();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [stats, setStats] = useState<OrganizationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [orgsData, statsData] = await Promise.all([
          getAllOrganizations(),
          getOrganizationStats(),
        ]);
        setOrganizations(orgsData);
        setStats(statsData);
      } catch (error: any) {
        setError(error.message || "Failed to fetch organizations");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleToggleOrganizationStatus = async (
    orgId: string,
    currentStatus: boolean,
  ) => {
    setActionLoading(orgId);
    setError("");
    setSuccess("");

    try {
      if (currentStatus) {
        await deactivateOrganization(orgId);
        setOrganizations((prev) =>
          prev.map((org) =>
            org.id === orgId ? { ...org, isActive: false } : org,
          ),
        );
        setSuccess("✅ Organization deactivated successfully");
      } else {
        await activateOrganization(orgId);
        setOrganizations((prev) =>
          prev.map((org) =>
            org.id === orgId ? { ...org, isActive: true } : org,
          ),
        );
        setSuccess("✅ Organization activated successfully");
      }

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (error: any) {
      setError(error.message || "Failed to update organization status");
    } finally {
      setActionLoading(null);
    }
  };

  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case "free":
        return "bg-gray-100 text-gray-800";
      case "basic":
        return "bg-blue-100 text-blue-800";
      case "premium":
        return "bg-purple-100 text-purple-800";
      case "enterprise":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      case "suspended":
        return "bg-orange-100 text-orange-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredOrganizations = organizations.filter(
    (org) =>
      org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <DashboardLayout allowedRoles={["super_admin"]}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Organization Management
          </h1>
          <div className="text-gray-600">
            Manage all organizations using the system
          </div>
        </div>

        {/* Success/Error Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            {success}
          </div>
        )}

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold mb-2">
                Total Organizations
              </h3>
              <p className="text-3xl font-bold text-blue-600">
                {stats.totalOrganizations}
              </p>
              <p className="text-sm text-gray-500">All organizations</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold mb-2">Active</h3>
              <p className="text-3xl font-bold text-green-600">
                {stats.activeOrganizations}
              </p>
              <p className="text-sm text-gray-500">Currently active</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold mb-2">Inactive</h3>
              <p className="text-3xl font-bold text-red-600">
                {stats.inactiveOrganizations}
              </p>
              <p className="text-sm text-gray-500">Suspended or cancelled</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold mb-2">Total Users</h3>
              <p className="text-3xl font-bold text-purple-600">
                {stats.totalUsers}
              </p>
              <p className="text-sm text-gray-500">Across all orgs</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold mb-2">Total Branches</h3>
              <p className="text-3xl font-bold text-orange-600">
                {stats.totalBranches}
              </p>
              <p className="text-sm text-gray-500">Across all orgs</p>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-lg shadow">
          <input
            type="text"
            placeholder="Search by organization name, display name, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Organizations Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Organization
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Users/Branches
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrganizations.map((org) => (
                  <tr key={org.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {org.displayName}
                        </div>
                        <div className="text-sm text-gray-500">{org.email}</div>
                        <div className="text-xs text-gray-400">
                          ID: {org.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPlanBadgeColor(org.subscription.plan)}`}
                      >
                        {org.subscription.plan.charAt(0).toUpperCase() +
                          org.subscription.plan.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(org.subscription.status)}`}
                      >
                        {org.subscription.status.charAt(0).toUpperCase() +
                          org.subscription.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>
                        <span className="font-medium">
                          {org.subscription.maxUsers}
                        </span>{" "}
                        users
                      </div>
                      <div>
                        <span className="font-medium">
                          {org.subscription.maxBranches}
                        </span>{" "}
                        branches
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {org.createdAt?.toDate?.()
                        ? org.createdAt.toDate().toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() =>
                          handleToggleOrganizationStatus(org.id, org.isActive)
                        }
                        disabled={actionLoading === org.id}
                        className={`${
                          org.isActive
                            ? "text-red-600 hover:text-red-900"
                            : "text-green-600 hover:text-green-900"
                        } disabled:opacity-50 disabled:cursor-not-allowed mr-3`}
                      >
                        {actionLoading === org.id ? (
                          <span className="flex items-center">
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            {org.isActive ? "Deactivating..." : "Activating..."}
                          </span>
                        ) : org.isActive ? (
                          "Deactivate"
                        ) : (
                          "Activate"
                        )}
                      </button>
                      <button className="text-blue-600 hover:text-blue-900">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredOrganizations.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No organizations found</p>
            </div>
          )}
        </div>

        {/* Plan Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <h4 className="font-medium text-blue-900 mb-3">
            Subscription Plans:
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 mb-2">
                Free
              </span>
              <p className="text-sm text-blue-800">
                3 users, 1 branch, basic appointments
              </p>
            </div>
            <div>
              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 mb-2">
                Basic
              </span>
              <p className="text-sm text-blue-800">
                10 users, 3 branches, queue management
              </p>
            </div>
            <div>
              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800 mb-2">
                Premium
              </span>
              <p className="text-sm text-blue-800">
                50 users, 10 branches, SMS reminders
              </p>
            </div>
            <div>
              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 mb-2">
                Enterprise
              </span>
              <p className="text-sm text-blue-800">
                Unlimited users & branches, API access
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
