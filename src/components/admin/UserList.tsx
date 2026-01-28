"use client";

import { useState, useEffect } from "react";
import {
  getAllUsers,
  activateUser,
  deactivateUser,
  updateUserRole,
} from "@/lib/userStats";
import { getAllOrganizations } from "@/lib/organization";
import { UserRole } from "@/lib/auth";

interface User {
  id: string;
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  organizationId?: string;
  createdAt: any;
  isActive: boolean;
}

export function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<UserRole | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching users and organizations...");
        const [userData, orgsData] = await Promise.all([
          getAllUsers(),
          getAllOrganizations(),
        ]);
        console.log("Users fetched:", userData.length);
        console.log("Organizations fetched:", orgsData.length);

        setUsers(userData as User[]);
        const activeOrgs = orgsData.filter((org) => org.isActive);
        console.log("Active organizations:", activeOrgs.length);
        setOrganizations(activeOrgs);
      } catch (error: any) {
        console.error("Error fetching data:", error);
        setError(error.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleToggleUserStatus = async (
    userId: string,
    currentStatus: boolean,
  ) => {
    setActionLoading(userId);
    try {
      if (currentStatus) {
        await deactivateUser(userId);
        setUsers((prev) =>
          prev.map((user) =>
            user.id === userId ? { ...user, isActive: false } : user,
          ),
        );
      } else {
        await activateUser(userId);
        setUsers((prev) =>
          prev.map((user) =>
            user.id === userId ? { ...user, isActive: true } : user,
          ),
        );
      }
    } catch (error: any) {
      setError(error.message || "Failed to update user status");
    } finally {
      setActionLoading(null);
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setEditModalOpen(true);
  };

  const handleUpdateUser = async (updatedData: Partial<User>) => {
    if (!editingUser) return;

    setActionLoading(editingUser.id);
    try {
      // Update role if changed
      if (updatedData.role && updatedData.role !== editingUser.role) {
        await updateUserRole(editingUser.id, updatedData.role);
      }

      // Update local state
      setUsers((prev) =>
        prev.map((user) =>
          user.id === editingUser.id ? { ...user, ...updatedData } : user,
        ),
      );

      setEditModalOpen(false);
      setEditingUser(null);
      setError("");
    } catch (error: any) {
      setError(error.message || "Failed to update user");
    } finally {
      setActionLoading(null);
    }
  };

  const getOrganizationName = (organizationId?: string) => {
    if (!organizationId) return "No Organization";
    const org = organizations.find((o) => o.id === organizationId);
    return org ? org.displayName : "Unknown Organization";
  };

  const filteredUsers = users.filter((user) => {
    const matchesFilter = filter === "all" || user.role === filter;
    const matchesSearch =
      user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

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

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Loading users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as UserRole | "all")}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Roles</option>
              <option value="customer">Customers</option>
              <option value="admin">Admins</option>
              <option value="super_admin">Super Admins</option>
            </select>
          </div>
        </div>
      </div>

      {/* User Count */}
      <div className="bg-white p-4 rounded-lg shadow">
        <p className="text-sm text-gray-600">
          Showing {filteredUsers.length} of {users.length} users
        </p>
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
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
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
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {user.displayName}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {getOrganizationName(user.organizationId)}
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEditUser(user)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() =>
                        handleToggleUserStatus(user.id, user.isActive)
                      }
                      disabled={actionLoading === user.id}
                      className={`${
                        user.isActive
                          ? "text-red-600 hover:text-red-900"
                          : "text-green-600 hover:text-green-900"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {actionLoading === user.id ? (
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
                          {user.isActive ? "Deactivating..." : "Activating..."}
                        </span>
                      ) : user.isActive ? (
                        "Deactivate"
                      ) : (
                        "Activate"
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit User Modal */}
      {editModalOpen && editingUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Edit User: {editingUser.displayName}
              </h3>

              {/* Debug info - remove in production */}
              {process.env.NODE_ENV === "development" && (
                <div className="mb-4 p-2 bg-gray-100 text-xs">
                  <div>Organizations loaded: {organizations.length}</div>
                  <div>
                    Current org ID: {editingUser.organizationId || "none"}
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={editingUser.displayName}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        displayName: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editingUser.email}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Email cannot be changed
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <select
                    value={editingUser.role}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        role: e.target.value as UserRole,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="customer">Customer</option>
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Organization
                  </label>
                  <select
                    value={editingUser.organizationId || ""}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        organizationId: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">No Organization</option>
                    {organizations.length > 0 ? (
                      organizations.map((org) => (
                        <option key={org.id} value={org.id}>
                          {org.displayName} ({org.subscription.plan})
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>
                        No organizations available
                      </option>
                    )}
                  </select>
                  {organizations.length === 0 && (
                    <p className="text-xs text-red-500 mt-1">
                      No organizations loaded. Please refresh the page.
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="userStatus"
                      checked={editingUser.isActive}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          isActive: e.target.checked,
                        })
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="userStatus"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      Active
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setEditModalOpen(false);
                    setEditingUser(null);
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleUpdateUser(editingUser)}
                  disabled={actionLoading === editingUser.id}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {actionLoading === editingUser.id
                    ? "Saving..."
                    : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
