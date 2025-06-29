import { useState, useEffect } from 'react';
import { User, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { firebaseStorage } from '@/lib/firebaseStorage';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Ensure user exists in Firestore with proper field handling
        const userData = {
          id: firebaseUser.uid,
          email: firebaseUser.email || undefined,
          firstName: firebaseUser.displayName?.split(' ')[0] || undefined,
          lastName: firebaseUser.displayName?.split(' ')[1] || undefined,
          profileImageUrl: firebaseUser.photoURL || undefined,
        };
        
        try {
          await firebaseStorage.upsertUser(userData);
          setUser(firebaseUser);
        } catch (error) {
          console.error("Error creating user document:", error);
          setUser(firebaseUser); // Still set user even if Firestore fails
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    return await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email: string, password: string) => {
    return await createUserWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    return await signOut(auth);
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    signIn,
    signUp,
    logout,
  };
}
