import { doc, onSnapshot, getDoc, writeBatch } from 'firebase/firestore';
import { db } from '../pages/firebase';

interface UserData {
  bblip?: number;
  usdt?: number;
  tickets?: number;
  total?: number;
  lbTON?: number;
  stakingHistory?: any[];
  fields?: Record<string, any>;
  deposits?: Array<{
    amount: number;
    timestamp: number;
  }>;
  transaction_hashes?: string[];
  lastUpdate?: number;
  lastSync?: number;
  comment?: string;
  [key: string]: any;
}

interface CacheItem<T> {
  data: T;
  timestamp: number;
  lastFirestoreSync?: number;
  subscribers: Set<(data: T) => void>;
}

interface BatchUpdate {
  [key: string]: any;
}

interface StorageData<T> {
  data: T;
  timestamp: number;
  lastFirestoreSync: number;
}

class DataManager {
  private static instance: DataManager;
  private cache: Map<string, CacheItem<any>> = new Map();
  private listeners: Map<string, () => void> = new Map();
  private pendingUpdates: Map<string, BatchUpdate> = new Map();
  private updateTimeouts: Map<string, NodeJS.Timeout> = new Map();
  private syncTimeouts: Map<string, NodeJS.Timeout> = new Map();
  
  private readonly DEFAULT_TTL = 30 * 60 * 1000; // 30 minutes cache
  private readonly STORAGE_TTL = 12 * 60 * 60 * 1000; // 12 hours storage
  private readonly UPDATE_DELAY = 5000; // 5 seconds
  private readonly SYNC_INTERVAL = 5 * 60 * 1000; // 5 minutes sync

  private constructor() {
    window.addEventListener('unload', () => {
      this.processPendingUpdates();
    });

    // Periyodik olarak storage'ı temizle
    setInterval(this.cleanStorage.bind(this), 60 * 60 * 1000); // Her saat
  }

  static getInstance(): DataManager {
    if (!DataManager.instance) {
      DataManager.instance = new DataManager();
    }
    return DataManager.instance;
  }

  private getKey(type: string, userId: string): string {
    return `${type}_${userId}`;
  }

  private cleanStorage(): void {
    const now = Date.now();
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('userData_')) {
        try {
          const stored = JSON.parse(localStorage.getItem(key) || '');
          if (now - stored.timestamp > this.STORAGE_TTL) {
            localStorage.removeItem(key);
          }
        } catch (error) {
          console.warn('Failed to parse storage item:', error);
        }
      }
    }
  }

  private async processPendingUpdates(): Promise<void> {
    for (const [userId, updates] of this.pendingUpdates.entries()) {
      if (Object.keys(updates).length === 0) continue;

      try {
        const batch = writeBatch(db);
        const userRef = doc(db, 'users', userId);
        
        const updateData = {
          ...updates,
          lastUpdate: Date.now(),
          lastSync: Date.now()
        };
        
        batch.update(userRef, updateData);
        await batch.commit();

        // Update cache and storage after successful commit
        const key = this.getKey('userData', userId);
        const cacheItem = this.cache.get(key);
        if (cacheItem) {
          const updatedData = { ...cacheItem.data, ...updateData };
          this.updateCache(key, updatedData, true);
        }

        this.pendingUpdates.delete(userId);
      } catch (error) {
        console.error(`Error processing updates for user ${userId}:`, error);
      }
    }
  }

  private setupListener(userId: string): void {
    const key = this.getKey('userData', userId);
    
    if (this.listeners.has(key)) return;

    const userRef = doc(db, 'users', userId);
    const unsubscribe = onSnapshot(
      userRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data() as UserData;
          this.updateCache(key, { ...data, lastSync: Date.now() }, true);
        }
      },
      (error) => {
        console.error('Error in Firestore listener:', error);
        setTimeout(() => this.setupListener(userId), 5000);
      }
    );

    this.listeners.set(key, unsubscribe);

    // Set up periodic sync
    const syncTimeout = setInterval(() => {
      this.syncWithFirestore(userId);
    }, this.SYNC_INTERVAL);

    this.syncTimeouts.set(key, syncTimeout);
  }

  private async syncWithFirestore(userId: string): Promise<void> {
    const key = this.getKey('userData', userId);
    const cacheItem = this.cache.get(key);

    if (!cacheItem || !cacheItem.lastFirestoreSync || 
        Date.now() - cacheItem.lastFirestoreSync > this.SYNC_INTERVAL) {
      try {
        const userRef = doc(db, 'users', userId);
        const snapshot = await getDoc(userRef);
        
        if (snapshot.exists()) {
          const data = snapshot.data() as UserData;
          this.updateCache(key, { ...data, lastSync: Date.now() }, true);
        }
      } catch (error) {
        console.error('Error syncing with Firestore:', error);
      }
    }
  }

  private updateCache<T>(key: string, data: T, updateStorage: boolean = false): void {
    const now = Date.now();
    const cacheItem = this.cache.get(key);
    
    if (cacheItem) {
      cacheItem.data = data;
      cacheItem.timestamp = now;
      cacheItem.lastFirestoreSync = updateStorage ? now : cacheItem.lastFirestoreSync;
      cacheItem.subscribers.forEach(callback => callback(data));
    } else {
      this.cache.set(key, {
        data,
        timestamp: now,
        lastFirestoreSync: updateStorage ? now : undefined,
        subscribers: new Set()
      });
    }

    if (updateStorage) {
      try {
        const storageData: StorageData<T> = {
          data,
          timestamp: now,
          lastFirestoreSync: now
        };
        localStorage.setItem(key, JSON.stringify(storageData));
      } catch (error) {
        console.warn('Failed to update localStorage:', error);
      }
    }
  }

  async getUserData(userId: string): Promise<UserData | null> {
    const key = this.getKey('userData', userId);
    const now = Date.now();

    // Check memory cache first
    const cacheItem = this.cache.get(key);
    if (cacheItem && now - cacheItem.timestamp < this.DEFAULT_TTL) {
      return cacheItem.data;
    }

    // Check localStorage
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        const { data, timestamp, lastFirestoreSync }: StorageData<UserData> = JSON.parse(stored);
        
        // If storage data is fresh enough, use it
        if (now - timestamp < this.STORAGE_TTL) {
          this.cache.set(key, {
            data,
            timestamp,
            lastFirestoreSync,
            subscribers: new Set()
          });

          // If it's been too long since last Firestore sync, trigger background sync
          if (now - lastFirestoreSync > this.SYNC_INTERVAL) {
            this.syncWithFirestore(userId);
          }

          return data;
        }
      } catch (error) {
        console.warn('Failed to parse localStorage data:', error);
      }
    }

    // If cache miss, fetch from Firestore
    try {
      const userRef = doc(db, 'users', userId);
      const snapshot = await getDoc(userRef);
      
      if (snapshot.exists()) {
        const data = snapshot.data() as UserData;
        const updatedData = { ...data, lastSync: now };
        this.updateCache(key, updatedData, true);
        return updatedData;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  }

  async updateUserData(userId: string, updates: Partial<UserData>): Promise<void> {
    if (!userId) return;

    const currentUpdates = this.pendingUpdates.get(userId) || {};
    const newUpdates = { ...currentUpdates, ...updates };
    this.pendingUpdates.set(userId, newUpdates);

    const key = this.getKey('userData', userId);
    const cacheItem = this.cache.get(key);
    if (cacheItem) {
      const updatedData = { ...cacheItem.data, ...updates, lastUpdate: Date.now() };
      this.updateCache(key, updatedData);
    }

    const existingTimeout = this.updateTimeouts.get(userId);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    const timeout = setTimeout(() => {
      this.processPendingUpdates();
      this.updateTimeouts.delete(userId);
    }, this.UPDATE_DELAY);

    this.updateTimeouts.set(userId, timeout);
  }

  subscribeToUserData(userId: string, callback: (data: UserData) => void): () => void {
    const key = this.getKey('userData', userId);
    
    this.setupListener(userId);

    let cacheItem = this.cache.get(key);
    if (!cacheItem) {
      cacheItem = {
        data: null,
        timestamp: 0,
        subscribers: new Set()
      };
      this.cache.set(key, cacheItem);
    }
    cacheItem.subscribers.add(callback);

    if (cacheItem.data) {
      callback(cacheItem.data);
    }

    return () => {
      const item = this.cache.get(key);
      if (item) {
        item.subscribers.delete(callback);
        
        if (item.subscribers.size === 0) {
          const unsubscribe = this.listeners.get(key);
          if (unsubscribe) {
            unsubscribe();
            this.listeners.delete(key);
          }

          const syncTimeout = this.syncTimeouts.get(key);
          if (syncTimeout) {
            clearInterval(syncTimeout);
            this.syncTimeouts.delete(key);
          }
        }
      }
    };
  }

  clearCache(): void {
    this.processPendingUpdates().then(() => {
      this.listeners.forEach(unsubscribe => unsubscribe());
      this.listeners.clear();
      
      this.syncTimeouts.forEach(timeout => clearInterval(timeout));
      this.syncTimeouts.clear();
      
      this.updateTimeouts.forEach(timeout => clearTimeout(timeout));
      this.updateTimeouts.clear();
      
      this.cache.clear();
      this.pendingUpdates.clear();
      localStorage.clear();
    });
  }
}

export const dataManager = DataManager.getInstance(); 