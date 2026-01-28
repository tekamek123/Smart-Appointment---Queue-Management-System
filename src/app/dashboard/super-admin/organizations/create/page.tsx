'use client';

import { useAuth } from '@/hooks/useAuth';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { createOrganization } from '@/lib/organization';
import { CreateOrganizationData } from '@/types/organization';
import { useState } from 'react';

export default function CreateOrganizationPage() {
  const { user, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState<CreateOrganizationData>({
    name: '',
    displayName: '',
    description: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    plan: 'free'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.displayName || !formData.email) {
      setError('Please fill in all required fields');
      return;
    }

    // Validate organization name (no spaces, lowercase, alphanumeric)
    if (!/^[a-z0-9-]+$/.test(formData.name)) {
      setError('Organization name must contain only lowercase letters, numbers, and hyphens');
      return;
    }

    // Validate email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!user?.uid) {
        throw new Error('User not authenticated');
      }

      const organizationId = await createOrganization(formData, user.uid);
      setSuccess(`✅ Organization "${formData.displayName}" created successfully!`);
      setSuccess(prev => prev + `\n\nOrganization ID: ${organizationId}`);
      setSuccess(prev => prev + `\n\nPlan: ${formData.plan.charAt(0).toUpperCase() + formData.plan.slice(1)}`);
      
      // Reset form after 4 seconds
      setTimeout(() => {
        setFormData({
          name: '',
          displayName: '',
          description: '',
          email: '',
          phone: '',
          address: {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: ''
          },
          plan: 'free'
        });
        setSuccess('');
      }, 4000);
      
    } catch (error: any) {
      setError(error.message || 'Failed to create organization');
    } finally {
      setLoading(false);
    }
  };

  const getPlanDescription = (plan: string) => {
    switch (plan) {
      case 'free':
        return '3 users, 1 branch, basic appointments';
      case 'basic':
        return '10 users, 3 branches, queue management';
      case 'premium':
        return '50 users, 10 branches, SMS reminders';
      case 'enterprise':
        return 'Unlimited users & branches, API access';
      default:
        return '';
    }
  };

  const getPlanFeatures = (plan: string) => {
    switch (plan) {
      case 'free':
        return ['Basic appointments', '1 branch', '3 users'];
      case 'basic':
        return ['Queue management', 'Email reminders', '3 branches', '10 users'];
      case 'premium':
        return ['SMS reminders', 'Multi-branch', 'Custom branding', '10 branches', '50 users'];
      case 'enterprise':
        return ['API access', 'Unlimited everything', 'Priority support', 'Custom integrations'];
      default:
        return [];
    }
  };

  if (authLoading) {
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
            Create New Organization
          </h1>
          <div className="text-gray-600">
            Add a new organization to the system
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded whitespace-pre-line">
                {success}
              </div>
            )}

            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                Basic Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Organization Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="organization-name"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Lowercase, letters, numbers, and hyphens only
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Display Name *
                  </label>
                  <input
                    type="text"
                    value={formData.displayName}
                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Organization Display Name"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    The public name shown to users
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="contact@organization.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Brief description of the organization..."
                />
              </div>
            </div>

            {/* Address Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                Address Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={formData.address?.street || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      address: { 
                        ...formData.address, 
                        street: e.target.value,
                        city: formData.address?.city || '',
                        state: formData.address?.state || '',
                        zipCode: formData.address?.zipCode || '',
                        country: formData.address?.country || ''
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="123 Main Street"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.address?.city || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      address: { 
                        ...formData.address, 
                        street: formData.address?.street || '',
                        city: e.target.value,
                        state: formData.address?.state || '',
                        zipCode: formData.address?.zipCode || '',
                        country: formData.address?.country || ''
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="New York"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State/Province
                  </label>
                  <input
                    type="text"
                    value={formData.address?.state || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      address: { 
                        ...formData.address, 
                        street: formData.address?.street || '',
                        city: formData.address?.city || '',
                        state: e.target.value,
                        zipCode: formData.address?.zipCode || '',
                        country: formData.address?.country || ''
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="NY"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ZIP/Postal Code
                  </label>
                  <input
                    type="text"
                    value={formData.address?.zipCode || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      address: { 
                        ...formData.address, 
                        street: formData.address?.street || '',
                        city: formData.address?.city || '',
                        state: formData.address?.state || '',
                        zipCode: e.target.value,
                        country: formData.address?.country || ''
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="10001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    value={formData.address?.country || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      address: { 
                        ...formData.address, 
                        street: formData.address?.street || '',
                        city: formData.address?.city || '',
                        state: formData.address?.state || '',
                        zipCode: formData.address?.zipCode || '',
                        country: e.target.value
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="United States"
                  />
                </div>
              </div>
            </div>

            {/* Subscription Plan */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                Subscription Plan
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {(['free', 'basic', 'premium', 'enterprise'] as const).map((plan) => (
                  <div key={plan} className="relative">
                    <input
                      type="radio"
                      id={plan}
                      name="plan"
                      value={plan}
                      checked={formData.plan === plan}
                      onChange={(e) => setFormData({ ...formData, plan: e.target.value as any })}
                      className="sr-only"
                    />
                    <label
                      htmlFor={plan}
                      className={`block p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        formData.plan === plan
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-center">
                        <div className="font-semibold text-lg capitalize mb-1">
                          {plan}
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          {getPlanDescription(plan)}
                        </div>
                        <ul className="text-xs text-gray-500 space-y-1">
                          {getPlanFeatures(plan).map((feature, index) => (
                            <li key={index} className="flex items-center">
                              <svg className="w-3 h-3 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Important Notes */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h4 className="font-medium text-blue-900 mb-2">Important Notes:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Organization name cannot be changed after creation</li>
                <li>• Plan can be upgraded later from organization settings</li>
                <li>• User and branch limits are enforced per plan</li>
                <li>• Organization will be created with active status</li>
                <li>• You will be assigned as the organization creator</li>
              </ul>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setFormData({
                  name: '',
                  displayName: '',
                  description: '',
                  email: '',
                  phone: '',
                  address: {
                    street: '',
                    city: '',
                    state: '',
                    zipCode: '',
                    country: ''
                  },
                  plan: 'free'
                })}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Clear Form
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Creating Organization...' : 'Create Organization'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
