'use client';

import { useAuth } from '@/hooks/useAuth';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { UserList } from '@/components/admin/UserList';

export default function UsersPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <DashboardLayout allowedRoles={['super_admin']}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            User Management
          </h1>
          <div className="text-gray-600">
            Manage all system users
          </div>
        </div>

        <UserList />
      </div>
    </DashboardLayout>
  );
}
