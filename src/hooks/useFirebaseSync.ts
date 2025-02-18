import { useState, useEffect, useCallback } from 'react';
import { dataManager } from '../utils/dataManager';

interface UserData {
  total: number;
  bblip: number;
  tickets: number;
  lastUpdate?: number;
}

interface UserCache extends UserData {
  lastUpdate: number;
}

export const useFirebaseSync = (_db: unknown, userId: string | null) => {
  const [localCache, setLocalCache] = useState<UserCache | null>(null);

  // Update function
  const updateBalance = useCallback((field: keyof UserData, value: number) => {
    if (!userId) return;

    const updates = {
      [field]: value,
      lastUpdate: Date.now()
    };

    // Update through data manager
    dataManager.updateUserData(userId, updates);
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    // Subscribe to user data changes
    const unsubscribe = dataManager.subscribeToUserData(userId, (data) => {
      setLocalCache({
        ...data,
        lastUpdate: data.lastUpdate || Date.now()
      } as UserCache);
    });

    return () => {
      unsubscribe();
    };
  }, [userId]);

  return {
    localCache,
    updateBalance
  };
}; 