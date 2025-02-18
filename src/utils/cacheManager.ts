import { dataManager } from './dataManager';

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

interface CacheConfig {
  [key: string]: number; // TTL in milliseconds
}

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
}

const CACHE_TTL: CacheConfig = {
  userData: 5 * 60 * 1000, // 5 minutes for user data
  transactions: 2 * 60 * 1000, // 2 minutes for transactions
  stakingHistory: 10 * 60 * 1000, // 10 minutes for staking history
  default: 1 * 60 * 1000 // 1 minute default
};

export const cacheManager = {
  set: <T>(key: string, data: T): void => {
    const cacheItem: CacheItem<T> = {
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(key, JSON.stringify(cacheItem));
  },

  get: <T>(key: string, ttl?: number): T | null => {
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    const cacheItem: CacheItem<T> = JSON.parse(cached);
    const now = Date.now();
    const ttlValue = ttl || CACHE_TTL[key] || CACHE_TTL.default;

    if (now - cacheItem.timestamp > ttlValue) {
      localStorage.removeItem(key);
      return null;
    }

    return cacheItem.data;
  },

  clear: (key: string): void => {
    localStorage.removeItem(key);
  },

  clearAll: (): void => {
    localStorage.clear();
  }
};

export const getUserData = async (userId: string): Promise<UserData | null> => {
  return dataManager.getUserData(userId);
};

interface TransactionData {
  fields: Record<string, any>;
  deposits: Array<{
    amount: number;
    timestamp: number;
  }>;
}

export const getTransactionData = async (userId: string): Promise<TransactionData> => {
  const userData = await dataManager.getUserData(userId);
  if (userData) {
    return {
      fields: userData.fields || {},
      deposits: userData.deposits || []
    };
  }
  return { fields: {}, deposits: [] };
};

interface StakingData {
  stakingHistory: any[];
  total: number;
  lbTON: number;
}

export const getStakingData = async (userId: string): Promise<StakingData> => {
  const userData = await dataManager.getUserData(userId);
  if (userData) {
    return {
      stakingHistory: userData.stakingHistory || [],
      total: userData.total || 0,
      lbTON: userData.lbTON || 0
    };
  }
  return { stakingHistory: [], total: 0, lbTON: 0 };
}; 