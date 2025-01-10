import { db } from '../firebase';
import { collection, query, where, getDocs, doc, updateDoc, runTransaction,  getDoc } from 'firebase/firestore';

interface MatchData {
  liveData?: {
    goals?: {
      home: number;
      away: number;
    };
    status?: string;
    halftimeScore?: {
      home: number;
      away: number;
    };
  };
  firstGoalScorer?: string;
  matchStarted?: boolean;
  matchEnded?: boolean;
}

interface BetSelection {
  matchId: string;
  betType: string;
  selection: string;
}

interface Coupon {
  userId: string;
  selections: BetSelection[];
  currency: string;
  potentialWin: number;
  status: 'active' | 'won' | 'lost';
  paid: boolean;
}

// Bahis sonuçlarını kontrol eden fonksiyonlar
const checkMatch1x2Result = (match: MatchData, selection: string): boolean => {
  const homeGoals = match.liveData?.goals?.home ?? 0;
  const awayGoals = match.liveData?.goals?.away ?? 0;

  if (selection === 'home' && homeGoals > awayGoals) return true;
  if (selection === 'away' && awayGoals > homeGoals) return true;
  if (selection === 'draw' && homeGoals === awayGoals) return true;
  return false;
};

const checkOverUnderResult = (match: MatchData, selection: string): boolean => {
  const homeGoals = match.liveData?.goals?.home ?? 0;
  const awayGoals = match.liveData?.goals?.away ?? 0;
  const totalGoals = homeGoals + awayGoals;

  const limit = parseFloat(selection.replace(/[^0-9.]/g, ''));
  const isOver = selection.startsWith('over');

  return isOver ? totalGoals > limit : totalGoals < limit;
};

const checkFirstGoalResult = (match: MatchData, selection: string): boolean => {
  return match.firstGoalScorer === selection;
};

// Ana kontrol fonksiyonu
export const checkCoupons = async (): Promise<void> => {
  try {
    const couponsRef = collection(db, 'coupons');
    const q = query(couponsRef, where('status', '==', 'active'));
    const querySnapshot = await getDocs(q);

    for (const couponDoc of querySnapshot.docs) {
      const coupon = couponDoc.data() as Coupon;
      let allSelectionsWon = true;

      for (const selection of coupon.selections) {
        const matchRef = doc(db, 'matches', selection.matchId);
        const matchDoc = await getDoc(matchRef);
        
        if (!matchDoc.exists()) {
          console.error(`Match not found: ${selection.matchId}`);
          continue;
        }

        const match = matchDoc.data() as MatchData;

        if (match.liveData?.status !== 'finished') {
          allSelectionsWon = false;
          break;
        }

        let selectionWon = false;
        switch (selection.betType) {
          case '1x2':
            selectionWon = checkMatch1x2Result(match, selection.selection);
            break;
          case 'total':
            selectionWon = checkOverUnderResult(match, selection.selection);
            break;
          case 'firstGoal':
            selectionWon = checkFirstGoalResult(match, selection.selection);
            break;
          default:
            console.warn(`Unknown bet type: ${selection.betType}`);
            allSelectionsWon = false;
        }

        if (!selectionWon) {
          allSelectionsWon = false;
          break;
        }
      }

      if (allSelectionsWon) {
        await runTransaction(db, async (transaction) => {
          const userRef = doc(db, 'users', coupon.userId);
          const userDoc = await transaction.get(userRef);

          if (!userDoc.exists()) {
            throw new Error(`User not found: ${coupon.userId}`);
          }

          const userData = userDoc.data();
          const currentBalance = userData[coupon.currency.toLowerCase()] || 0;

          transaction.update(userRef, {
            [coupon.currency.toLowerCase()]: currentBalance + coupon.potentialWin
          });

          transaction.update(doc(db, 'coupons', couponDoc.id), {
            status: 'won',
            paid: true,
            paidAt: new Date().toISOString()
          });
        });
      } else {
        await updateDoc(doc(db, 'coupons', couponDoc.id), {
          status: 'lost',
          updatedAt: new Date().toISOString()
        });
      }
    }
  } catch (error) {
    console.error('Error checking coupons:', error);
  }
};

// Bu fonksiyon belirli aralıklarla çalıştırılmalı
// Örneğin: setInterval(checkCoupons, 5 * 60 * 1000); // Her 5 dakikada bir 