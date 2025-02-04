import { 
  doc, 
  updateDoc, 
  increment, 
  onSnapshot,
  getDoc,
  FieldValue,
  WithFieldValue,
  DocumentData
} from 'firebase/firestore';
import { db } from '../pages/firebase';
import { BoxReward } from './randomizer';

export interface UserStats extends DocumentData {
  usdt: number;
  total: number;
  keys: number;
  keyParts: number;
  totalBoxes: number;
  distributedBoxes: number;
  boxes: Record<string, number>;
  drops: Record<string, { code: string; amount: number; }[]>;
}

type UpdateData = {
  [K in keyof UserStats]?: number | FieldValue;
};

export const updateUserStats = async (
  userId: string,
  reward: BoxReward,
  boxTitle: string
): Promise<void> => {
  const userRef = doc(db, 'users', userId);
  
  const updates: any = {
    keys: increment(-1),
    [`boxes.${boxTitle}`]: increment(-1)
  };

  // Kullanıcının drops listesini güncelle
  const userDoc = await getDoc(userRef);
  const userData = userDoc.data() as UserStats;
  const existingDrops = userData.drops || {};
  const userDrops = existingDrops[boxTitle] || [];
  
  // Aynı koda sahip drop var mı kontrol et
  const existingDropIndex = userDrops.findIndex(drop => drop.code === reward.code);
  
  if (existingDropIndex !== -1) {
    // Varsa miktarını artır
    userDrops[existingDropIndex].amount += 1;
  } else {
    // Yoksa yeni ekle
    userDrops.push(reward);
  }
  
  updates[`drops.${boxTitle}`] = userDrops;
  
  await updateDoc(userRef, updates);
};

export const craftKey = async (userId: string): Promise<void> => {
  const userRef = doc(db, 'users', userId);
  
  try {
    const userDoc = await getDoc(userRef);
    const userData = userDoc.data() as UserStats;
    
    if (!userData || userData.keyParts < 5) {
      throw new Error('Insufficient key parts');
    }
    
    const updates: WithFieldValue<UpdateData> = {
      keyParts: increment(-5),
      keys: increment(1),
    };
    
    await updateDoc(userRef, updates);
  } catch (error) {
    console.error('Error crafting key:', error);
    throw error;
  }
};

export const subscribeToUserStats = (
  userId: string,
  callback: (stats: UserStats) => void
): (() => void) => {
  const userRef = doc(db, 'users', userId);
  
  return onSnapshot(userRef, (doc) => {
    if (doc.exists()) {
      callback(doc.data() as UserStats);
    }
  });
};

export const initializeUserStats = async (
  userId: string
): Promise<void> => {
  const userRef = doc(db, 'users', userId);
  
  try {
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      const initialStats: WithFieldValue<UserStats> = {
        usdt: 0,
        total: 0,
        keys: 0,
        keyParts: 0,
        totalBoxes: 0,
        distributedBoxes: 0,
        boxes: {},
        drops: {}
      };
      
      await updateDoc(userRef, initialStats);
    }
  } catch (error) {
    console.error('Error initializing user stats:', error);
    throw error;
  }
}; 