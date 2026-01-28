"use client";

import { useAuth } from "@/hooks/useAuth";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { getAllUsers, updateUserRole } from "@/lib/userStats";
import { getAllOrganizations } from "@/lib/organization";
import { UserRole } from "@/lib/auth";
import { useState, useEffect } from "react";

export default function ManageRolesPage() {
  const { user: currentUser, loading: authLoading } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersData, orgsData] = await Promise.all([
          getAllUsers(),
          getAllOrganizations(),
        ]);
        setUsers(usersData);
        setOrganizations(orgsData.filter((org) => org.isActive));
      } catch (error: any) {
        setError(error.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getOrganizationName = (organizationId: string) => {
    const org = organizations.find((o) => o.id === organizationId);
    return org ? org.displayName : "Unknown Organization";
  };

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    setActionLoading(userId);
    setError("");
    setSuccess("");

    try {
      await updateUserRole(userId, newRole);

      // Update local state
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user,
        ),
      );

      const updatedUser = users.find((u) => u.id === userId);
      setSuccess(
        `✅ Successfully updated role for "${updatedUser?.displayName}" to "${newRole}"`,
      );

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (error: any) {
      setError(error.message || "Failed to update user role");
    } finally {
      setActionLoading(null);
    }
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case "customer":
        return "bg-blue-100 text-blue-800";
      case "admin":
        return "bg-green-100 text-green-800";
      case "super_admin":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleDescription = (role: UserRole) => {
    switch (role) {
      case "customer":
        return "Can book appointments and manage own data";
      case "admin":
        return "Can manage appointments, queues, and branches";
      case "super_admin":
        return "Full system access including user management";
      default:
        return "";
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
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
            Manage User Roles
          </h1>
          <div className="text-gray-600">
            Update user permissions and access levels
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

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-lg shadow">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Role Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <h4 className="font-medium text-blue-900 mb-3">Role Permissions:</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 mb-2">
                Customer
              </span>
              <p className="text-sm text-blue-800">
                {getRoleDescription("customer")}
              </p>
            </div>
            <div>
              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 mb-2">
                Admin
              </span>
              <p className="text-sm text-blue-800">
                {getRoleDescription("admin")}
              </p>
            </div>
            <div>
              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800 mb-2">
                Super Admin
              </span>
              <p className="text-sm text-blue-800">
                {getRoleDescription("super_admin")}
              </p>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Organization
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    New Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {user.displayName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {user.organizationId
                          ? getOrganizationName(user.organizationId)
                          : "No Organization"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}
                      >
                        {user.role.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.id === currentUser?.uid ? (
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}
                        >
                          {user.role.replace("_", " ")} (You)
                        </span>
                      ) : (
                        <select
                          value={user.role}
                          onChange={(e) =>
                            handleRoleChange(
                              user.id,
                              e.target.value as UserRole,
                            )
                          }
                          disabled={actionLoading === user.id || !user.isActive}
                          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                          <option value="customer">Customer</option>
                          <option value="admin">Admin</option>
                          <option value="super_admin">Super Admin</option>
                        </select>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {actionLoading === user.id ? (
                        <span className="flex items-center text-blue-600">
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
                          Updating...
                        </span>
                      ) : !user.isActive ? (
                        <span className="text-gray-400">User inactive</span>
                      ) : user.id === currentUser?.uid ? (
                        <span className="text-gray-400">
                          Cannot change own role
                        </span>
                      ) : (
                        <span className="text-green-600">Ready to update</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No users found</p>
            </div>
          )}
        </div>

        {/* Important Notes */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <h4 className="font-medium text-yellow-900 mb-2">Important Notes:</h4>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• You cannot change your own role</li>
            <li>• Inactive users cannot have their roles changed</li>
            <li>• Super Admin role should be assigned carefully</li>
            <li>• Role changes take effect immediately</li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}
