import { useEffect, useState } from "react";
import {
  onAuthStateChanged,
  User as FirebaseUser,
  signOut,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth } from "@/lib/firebase";
import { db } from "@/lib/firebase";
import { User } from "@/types";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          try {
            // Fetch user data from Firestore
            const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));

            if (userDoc.exists()) {
              const userData = userDoc.data();

              // Check if user is active
              if (!userData.isActive) {
                // Sign out the user immediately if they're deactivated
                await signOut(auth);
                setUser(null);
              } else {
                setUser({
                  uid: firebaseUser.uid,
                  email: firebaseUser.email!,
                  displayName:
                    userData.displayName || firebaseUser.displayName || "",
                  role: userData.role,
                  isActive: userData.isActive,
                  createdAt: userData.createdAt?.toDate() || new Date(),
                });
              }
            } else {
              // User exists in Firebase Auth but not in Firestore
              setUser(null);
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
            setUser(null);
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      },
    );

    return unsubscribe;
  }, []);

  return { user, loading };
}
