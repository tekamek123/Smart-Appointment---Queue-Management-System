import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  serverTimestamp,
  orderBy,
  limit 
} from 'firebase/firestore';
import { db } from './firebase';
import { Organization, CreateOrganizationData, UpdateOrganizationData } from '@/types/organization';

// Organization management functions
export const createOrganization = async (
  data: CreateOrganizationData,
  createdBy: string
): Promise<string> => {
  try {
    const organizationData: Omit<Organization, 'id'> = {
      name: data.name,
      displayName: data.displayName,
      description: data.description || '',
      email: data.email,
      phone: data.phone || '',
      address: data.address || {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
      },
      settings: {
        timezone: 'UTC',
        currency: 'USD',
        dateFormat: 'MM/DD/YYYY',
        timeFormat: '12h',
        language: 'en'
      },
      subscription: {
        plan: data.plan,
        status: 'active',
        maxUsers: getMaxUsersForPlan(data.plan),
        maxBranches: getMaxBranchesForPlan(data.plan)
      },
      branding: {
        primaryColor: '#3B82F6',
        secondaryColor: '#10B981'
      },
      features: getFeaturesForPlan(data.plan),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      isActive: true,
      createdBy
    };

    const docRef = await addDoc(collection(db, 'organizations'), organizationData);
    return docRef.id;
  } catch (error) {
    console.error('Error creating organization:', error);
    throw error;
  }
};

export const getOrganization = async (organizationId: string): Promise<Organization | null> => {
  try {
    const docRef = doc(db, 'organizations', organizationId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Organization;
    }
    return null;
  } catch (error) {
    console.error('Error fetching organization:', error);
    throw error;
  }
};

export const getAllOrganizations = async (): Promise<Organization[]> => {
  try {
    const q = query(
      collection(db, 'organizations'),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Organization[];
  } catch (error) {
    console.error('Error fetching organizations:', error);
    throw error;
  }
};

export const updateOrganization = async (
  organizationId: string,
  data: UpdateOrganizationData
): Promise<void> => {
  try {
    const docRef = doc(db, 'organizations', organizationId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating organization:', error);
    throw error;
  }
};

export const deleteOrganization = async (organizationId: string): Promise<void> => {
  try {
    const docRef = doc(db, 'organizations', organizationId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting organization:', error);
    throw error;
  }
};

export const activateOrganization = async (organizationId: string): Promise<void> => {
  try {
    const docRef = doc(db, 'organizations', organizationId);
    await updateDoc(docRef, {
      isActive: true,
      subscription: {
        status: 'active'
      },
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error activating organization:', error);
    throw error;
  }
};

export const deactivateOrganization = async (organizationId: string): Promise<void> => {
  try {
    const docRef = doc(db, 'organizations', organizationId);
    await updateDoc(docRef, {
      isActive: false,
      subscription: {
        status: 'suspended'
      },
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error deactivating organization:', error);
    throw error;
  }
};

export const getOrganizationsByCreator = async (creatorId: string): Promise<Organization[]> => {
  try {
    const q = query(
      collection(db, 'organizations'),
      where('createdBy', '==', creatorId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Organization[];
  } catch (error) {
    console.error('Error fetching organizations by creator:', error);
    throw error;
  }
};

// Helper functions for plan-based features
function getMaxUsersForPlan(plan: string): number {
  switch (plan) {
    case 'free': return 3;
    case 'basic': return 10;
    case 'premium': return 50;
    case 'enterprise': return 999;
    default: return 3;
  }
}

function getMaxBranchesForPlan(plan: string): number {
  switch (plan) {
    case 'free': return 1;
    case 'basic': return 3;
    case 'premium': return 10;
    case 'enterprise': return 999;
    default: return 1;
  }
}

function getFeaturesForPlan(plan: string) {
  const baseFeatures = {
    appointments: true,
    queueManagement: false,
    smsReminders: false,
    emailReminders: false,
    reports: false,
    multiBranch: false,
    customBranding: false,
    apiAccess: false
  };

  switch (plan) {
    case 'free':
      return baseFeatures;
    case 'basic':
      return {
        ...baseFeatures,
        queueManagement: true,
        emailReminders: true,
        reports: true
      };
    case 'premium':
      return {
        ...baseFeatures,
        queueManagement: true,
        smsReminders: true,
        emailReminders: true,
        reports: true,
        multiBranch: true,
        customBranding: true
      };
    case 'enterprise':
      return {
        appointments: true,
        queueManagement: true,
        smsReminders: true,
        emailReminders: true,
        reports: true,
        multiBranch: true,
        customBranding: true,
        apiAccess: true
      };
    default:
      return baseFeatures;
  }
}

export interface OrganizationStats {
  totalOrganizations: number;
  activeOrganizations: number;
  inactiveOrganizations: number;
  totalUsers: number;
  totalBranches: number;
}

export const getOrganizationStats = async (): Promise<OrganizationStats> => {
  try {
    const snapshot = await getDocs(collection(db, 'organizations'));
    
    const stats: OrganizationStats = {
      totalOrganizations: snapshot.size,
      activeOrganizations: 0,
      inactiveOrganizations: 0,
      totalUsers: 0,
      totalBranches: 0
    };

    snapshot.forEach((doc) => {
      const org = doc.data();
      if (org.isActive) {
        stats.activeOrganizations++;
      } else {
        stats.inactiveOrganizations++;
      }
      // TODO: Calculate actual users and branches per organization
      // This would require additional queries to users and branches collections
    });

    return stats;
  } catch (error) {
    console.error('Error fetching organization stats:', error);
    throw error;
  }
};
