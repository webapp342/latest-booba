import { useState, useEffect } from 'react';
import { 
  getAuth, 
  onAuthStateChanged, 
  User as FirebaseUser 
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '.././pages/firebaseConfig';

export interface UserData {
  id: string;
  bblip: number;
  ton: number;
  keys: number;
  keyParts: number;
  totalBoxes: number;
  distributedBoxes: number;
}

export function useAuth() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            setUserData({
              id: firebaseUser.uid,
              ...userDoc.data() as Omit<UserData, 'id'>
            });
          } else {
            setError('User data not found');
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to fetch user data');
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return {
    user,
    userData,
    loading,
    error,
    isAuthenticated: !!user
  };
} 