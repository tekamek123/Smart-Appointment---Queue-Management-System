import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  getAuth,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./firebase";
import { User } from "@/types";

export type UserRole = "customer" | "admin" | "super_admin";

export interface AuthUser extends User {
  role: UserRole;
}

// Authentication functions
export const signInWithEmail = async (
  email: string,
  password: string,
): Promise<AuthUser> => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );

    // Check if user is active
    const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
    if (!userDoc.exists()) {
      throw new Error("User profile not found. Please contact support.");
    }

    const userData = userDoc.data();
    if (!userData.isActive) {
      // Sign out the user immediately if they're deactivated
      await firebaseSignOut(auth);
      throw new Error(
        "Your account has been deactivated. Please contact an administrator.",
      );
    }

    return {
      uid: userCredential.user.uid,
      email: userCredential.user.email!,
      displayName:
        userData.displayName || userCredential.user.displayName || "",
      role: userData.role,
      isActive: userData.isActive,
      createdAt: userData.createdAt?.toDate() || new Date(),
    };
  } catch (error) {
    console.error("Sign in error:", error);
    throw error;
  }
};

export const signUpWithEmail = async (
  email: string,
  password: string,
  displayName: string,
): Promise<AuthUser> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

    // Create user profile in Firestore
    const userData: User = {
      uid: userCredential.user.uid,
      email: userCredential.user.email!,
      displayName,
      role: "customer", // Default role for new registrations
      createdAt: new Date(),
      isActive: true,
    };

    await setDoc(doc(db, "users", userCredential.user.uid), userData);

    return {
      ...userCredential.user,
      ...userData,
    } as AuthUser;
  } catch (error) {
    console.error("Email sign up error:", error);
    throw error;
  }
};

export const signInWithGoogle = async (): Promise<AuthUser> => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);

    // Check if user exists and is active
    const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
    if (!userDoc.exists()) {
      throw new Error("User profile not found. Please register first.");
    }

    const userData = userDoc.data();
    if (!userData.isActive) {
      // Sign out the user immediately if they're deactivated
      await firebaseSignOut(auth);
      throw new Error(
        "Your account has been deactivated. Please contact an administrator.",
      );
    }

    return {
      uid: userCredential.user.uid,
      email: userCredential.user.email!,
      displayName:
        userData.displayName || userCredential.user.displayName || "",
      role: userData.role,
      isActive: userData.isActive,
      createdAt: userData.createdAt?.toDate() || new Date(),
    };
  } catch (error) {
    console.error("Google sign in error:", error);
    throw error;
  }
};

export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error("Sign out error:", error);
    throw error;
  }
};

export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error("Password reset error:", error);
    throw error;
  }
};

// User management functions (for super admin)
export const createUser = async (
  email: string,
  password: string,
  displayName: string,
  role: UserRole,
): Promise<void> => {
  try {
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

    // Create user profile in Firestore with specified role
    await setDoc(doc(db, "users", userCredential.user.uid), {
      uid: userCredential.user.uid,
      email: userCredential.user.email!,
      displayName,
      role,
      createdAt: serverTimestamp(),
      isActive: true,
    });

    // Note: Firebase Auth automatically signs in the new user
    // This is a limitation of the client-side SDK
    // The Super Admin will need to log back in
  } catch (error) {
    console.error("Create user error:", error);
    throw error;
  }
};

export const updateUserRole = async (
  uid: string,
  role: UserRole,
): Promise<void> => {
  try {
    const userRef = doc(db, "users", uid);
    await setDoc(userRef, { role }, { merge: true });
  } catch (error) {
    console.error("Update user role error:", error);
    throw error;
  }
};

export const deactivateUser = async (uid: string): Promise<void> => {
  try {
    const userRef = doc(db, "users", uid);
    await setDoc(userRef, { isActive: false }, { merge: true });
  } catch (error) {
    console.error("Deactivate user error:", error);
    throw error;
  }
};

// Role-based access control helpers
export const canAccessCustomerData = (
  user: AuthUser | null,
  targetUserId: string,
): boolean => {
  if (!user) return false;

  // Users can access their own data
  if (user.uid === targetUserId) return true;

  // Admins and super admins can access customer data
  return user.role === "admin" || user.role === "super_admin";
};

export const canManageBranch = (
  user: AuthUser | null,
  branchId: string,
): boolean => {
  if (!user) return false;

  // Super admins can manage all branches
  if (user.role === "super_admin") return true;

  // Admins can only manage their assigned branches (would need to check assignment)
  // This would require additional user data for branch assignments
  return user.role === "admin";
};

export const canManageUsers = (user: AuthUser | null): boolean => {
  if (!user) return false;
  return user.role === "super_admin";
};

export const canAccessAdminPanel = (user: AuthUser | null): boolean => {
  if (!user) return false;
  return user.role === "admin" || user.role === "super_admin";
};

export const canAccessSuperAdminPanel = (user: AuthUser | null): boolean => {
  if (!user) return false;
  return user.role === "super_admin";
};
