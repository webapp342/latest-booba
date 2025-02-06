import { useState, useEffect, useRef, useCallback } from 'react';
import { doc, onSnapshot, writeBatch, Firestore } from 'firebase/firestore';
import { debounce } from 'lodash';

interface UserData {
  total: number;
  bblip: number;
  tickets: number;
}

interface UserCache extends UserData {
  lastUpdate: number;
}

export const useFirebaseSync = (db: Firestore, userId: string | null) => {
  const [localCache, setLocalCache] = useState<UserCache | null>(null);
  const pendingUpdates = useRef<{[key: string]: number}>({});
  const updateTimeout = useRef<NodeJS.Timeout | null>(null);

  // Batch update function
  const batchUpdateFirestore = useCallback(async () => {
    if (!userId || Object.keys(pendingUpdates.current).length === 0) return;

    const batch = writeBatch(db);
    const userRef = doc(db, 'users', userId);

    try {
      batch.update(userRef, pendingUpdates.current);
      await batch.commit();
      pendingUpdates.current = {};
    } catch (error) {
      console.error('Error updating Firestore:', error);
    }
  }, [db, userId]);

  // Update function
  const updateBalance = useCallback((field: keyof UserData, value: number) => {
    if (!userId) return;

    // Update local cache immediately
    if (localCache) {
      const newCache = {
        ...localCache,
        [field]: value,
        lastUpdate: Date.now()
      };
      setLocalCache(newCache);
      localStorage.setItem(`user_data_${userId}`, JSON.stringify(newCache));
    }

    // Queue update
    pendingUpdates.current[field] = value;

    // Clear existing timeout
    if (updateTimeout.current) {
      clearTimeout(updateTimeout.current);
    }

    // Set new timeout for batch update
    updateTimeout.current = setTimeout(() => {
      batchUpdateFirestore();
    }, 5000);
  }, [userId, localCache, batchUpdateFirestore]);

  // Firebase listener with caching
  useEffect(() => {
    if (!userId) return;

    // Try to get from localStorage first
    const cachedData = localStorage.getItem(`user_data_${userId}`);
    if (cachedData) {
      const parsed = JSON.parse(cachedData);
      if (Date.now() - parsed.lastUpdate < 5 * 60 * 1000) { // 5 minutes cache
        setLocalCache(parsed);
      }
    }

    const userRef = doc(db, 'users', userId);
    const unsubscribe = onSnapshot(userRef, 
      debounce((docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data() as UserData;
          const cacheData = {
            ...data,
            lastUpdate: Date.now()
          };
          setLocalCache(cacheData);
          localStorage.setItem(`user_data_${userId}`, JSON.stringify(cacheData));
        }
      }, 1000)
    );

    return () => {
      unsubscribe();
      if (updateTimeout.current) {
        clearTimeout(updateTimeout.current);
      }
    };
  }, [db, userId]);

  return {
    localCache,
    updateBalance
  };
}; 