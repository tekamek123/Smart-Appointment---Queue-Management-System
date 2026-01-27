"use client";

import { useAuth } from "@/hooks/useAuth";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useState } from "react";
import { createUser, updateUserRole, deactivateUser } from "@/lib/auth";
import { UserRole } from "@/lib/auth";

export default function SuperAdminDashboard() {
  const { user, loading } = useAuth();
  const [showCreateUser, setShowCreateUser] = useState(false);

  if (loading) {
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
            Super Admin Dashboard
          </h1>
          <div className="text-gray-600">
            Welcome back, {user?.displayName || user?.email}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold mb-2">Total Users</h3>
            <p className="text-3xl font-bold text-blue-600">0</p>
            <p className="text-sm text-gray-500">All roles</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold mb-2">Admins</h3>
            <p className="text-3xl font-bold text-green-600">0</p>
            <p className="text-sm text-gray-500">Active admins</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold mb-2">Customers</h3>
            <p className="text-3xl font-bold text-orange-600">0</p>
            <p className="text-sm text-gray-500">Registered</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold mb-2">System Status</h3>
            <p className="text-3xl font-bold text-green-600">OK</p>
            <p className="text-sm text-gray-500">All systems</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">User Management</h3>
              <button
                onClick={() => setShowCreateUser(!showCreateUser)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                {showCreateUser ? "Hide Form" : "Create User"}
              </button>
            </div>

            {showCreateUser && (
              <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-semibold">Create New User</h4>
                  <button
                    onClick={() => setShowCreateUser(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <CreateUserForm onClose={() => setShowCreateUser(false)} />
              </div>
            )}

            <div className="space-y-3">
              <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      View All Users
                    </h4>
                    <p className="text-sm text-gray-600">
                      Browse and manage all system users
                    </p>
                  </div>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    0 users
                  </span>
                </div>
              </div>

              <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Manage User Roles
                    </h4>
                    <p className="text-sm text-gray-600">
                      Update user permissions and access levels
                    </p>
                  </div>
                  <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                    Admin
                  </span>
                </div>
              </div>

              <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Deactivate Users
                    </h4>
                    <p className="text-sm text-gray-600">
                      Disable user accounts temporarily
                    </p>
                  </div>
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                    Security
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">System Settings</h3>
            <div className="space-y-4">
              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-left transition-colors">
                Branch Management
              </button>
              <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-left transition-colors">
                Service Configuration
              </button>
              <button className="w-full bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-md text-left transition-colors">
                System Analytics
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <p className="text-gray-700">Super admin dashboard accessed</p>
              <p className="text-sm text-gray-500">Just now</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function CreateUserForm({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    displayName: "",
    role: "customer" as UserRole,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Basic validation
    if (!formData.displayName.trim()) {
      setError("Display name is required");
      setLoading(false);
      return;
    }

    if (!formData.email.includes("@")) {
      setError("Valid email is required");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      await createUser(
        formData.email,
        formData.password,
        formData.displayName,
        formData.role,
      );
      setSuccess(
        `✅ User "${formData.displayName}" created successfully with role "${formData.role}"`,
      );

      // Show message about session limitation
      setTimeout(() => {
        setSuccess(
          (prev) =>
            prev +
            "\n\n⚠️ Note: Due to Firebase limitations, you may need to refresh the page or log back in as Super Admin to continue managing users.",
        );
      }, 1000);

      // Reset form after 4 seconds to allow user to read the message
      setTimeout(() => {
        setFormData({
          email: "",
          password: "",
          displayName: "",
          role: "customer",
        });
        setSuccess("");
        onClose();
      }, 4000);
    } catch (error: any) {
      setError(error.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  const getRoleDescription = (role: UserRole) => {
    switch (role) {
      case "customer":
        return "Can book appointments and manage own data";
      case "admin":
        return "Can manage appointments and assigned branches";
      case "super_admin":
        return "Full system access and user management";
      default:
        return "";
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.displayName}
          onChange={(e) =>
            setFormData({ ...formData, displayName: e.target.value })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="John Doe"
          required
          disabled={loading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email Address <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="user@example.com"
          required
          disabled={loading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password <span className="text-red-500">*</span>
        </label>
        <input
          type="password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Min. 6 characters"
          required
          disabled={loading}
        />
        <p className="text-xs text-gray-500 mt-1">
          Password must be at least 6 characters long
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          User Role <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.role}
          onChange={(e) =>
            setFormData({ ...formData, role: e.target.value as UserRole })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        >
          <option value="customer">Customer</option>
          <option value="admin">Admin</option>
          <option value="super_admin">Super Admin</option>
        </select>
        <p className="text-xs text-gray-500 mt-1">
          {getRoleDescription(formData.role)}
        </p>
      </div>

      <div className="flex space-x-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
              Creating...
            </span>
          ) : (
            "Create User"
          )}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md transition-colors"
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
