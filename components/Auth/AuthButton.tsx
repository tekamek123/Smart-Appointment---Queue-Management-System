'use client';

import { useAuth } from '@/hooks/useAuth';
import { signInWithPopup, signOut, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';

export function AuthButton() {
  const { user, loading } = useAuth();

  const handleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {user ? (
        <div className="flex items-center gap-4">
          <span>Welcome, {user.displayName || user.email}</span>
          <Button onClick={handleSignOut}>Sign Out</Button>
        </div>
      ) : (
        <Button onClick={handleSignIn}>Sign In with Google</Button>
      )}
    </div>
  );
}
