import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { UserRole } from "./auth";

export interface UserStats {
  totalUsers: number;
  customers: number;
  admins: number;
  superAdmins: number;
  activeUsers: number;
}

export const getUserStats = async (): Promise<UserStats> => {
  try {
    const usersCollection = collection(db, "users");
    const snapshot = await getDocs(usersCollection);

    const stats: UserStats = {
      totalUsers: 0,
      customers: 0,
      admins: 0,
      superAdmins: 0,
      activeUsers: 0,
    };

    snapshot.forEach((doc) => {
      const userData = doc.data();
      stats.totalUsers++;

      if (userData.isActive) {
        stats.activeUsers++;
      }

      switch (userData.role) {
        case "customer":
          stats.customers++;
          break;
        case "admin":
          stats.admins++;
          break;
        case "super_admin":
          stats.superAdmins++;
          break;
      }
    });

    return stats;
  } catch (error) {
    console.error("Error fetching user stats:", error);
    throw error;
  }
};

export const getUsersByRole = async (role: UserRole) => {
  try {
    const usersCollection = collection(db, "users");
    const q = query(usersCollection, where("role", "==", role));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error(`Error fetching ${role} users:`, error);
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    const usersCollection = collection(db, "users");
    const snapshot = await getDocs(usersCollection);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw error;
  }
};

export const activateUser = async (userId: string): Promise<void> => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      isActive: true,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error activating user:", error);
    throw error;
  }
};

export const deactivateUser = async (userId: string): Promise<void> => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      isActive: false,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error deactivating user:", error);
    throw error;
  }
};

export const updateUserRole = async (
  userId: string,
  newRole: UserRole,
): Promise<void> => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      role: newRole,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    throw error;
  }
};
