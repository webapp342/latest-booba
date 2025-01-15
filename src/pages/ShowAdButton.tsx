import { useCallback, useEffect, useState, ReactElement } from 'react';
import { useAdsgram } from "./useAdsgram";
import { ShowPromiseResult } from "./adsgram";
import { updateUserBblip } from '../utils/database';
import { getFirestore, doc, onSnapshot } from 'firebase/firestore';

const db = getFirestore();

export function ShowAdButton(): ReactElement {
  const [lastRewardTime, setLastRewardTime] = useState<Date | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  // Firestore dinleyicisi ve localStorage güncellemesi
  useEffect(() => {
    const userId = localStorage.getItem('telegramUserId');
    if (!userId) {
      console.error('User ID localStorage\'da bulunamadı.');
      return;
    }

    const userRef = doc(db, 'users', userId);

    const unsubscribe = onSnapshot(userRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        if (data.lastRewardTime) {
          const rewardTime = data.lastRewardTime.toDate();
          setLastRewardTime(rewardTime);  // React state güncelleniyor
          localStorage.setItem('lastRewardTime', rewardTime.toISOString());  // localStorage güncelleniyor
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Zamanlayıcıyı çalıştırmak
  useEffect(() => {
    if (!lastRewardTime) return;

    const timer = setInterval(() => {
      const now = new Date();
      const diff = now.getTime() - lastRewardTime.getTime();
      const oneHour = 60 * 60 * 1000;
      if (diff >= oneHour) {
        setTimeLeft(0);
        clearInterval(timer);
      } else {
        setTimeLeft(oneHour - diff);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [lastRewardTime]);

  const onReward = useCallback(() => {
    alert('Congratulations, your reward has been added to your wallet');
    updateUserBblip(1000).catch((error) => {
      console.error('Bblip güncellenirken hata oluştu:', error);
      alert('Bblip güncellenirken bir hata oluştu.');
    });
  }, []);

  const onError = useCallback((result: ShowPromiseResult) => {
    alert(JSON.stringify(result, null, 4));
  }, []);

  /**
   * insert your-block-id
   */
  const showAd = useAdsgram({ blockId: "6760", onReward, onError });

  const formatTimeLeft = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <>
      {timeLeft > 0 ? (
        <div>
          <p>{formatTimeLeft(timeLeft)}</p>
        </div>
      ) : (
        <button onClick={showAd}>Show Ad</button>
      )}
    </>
  );
}
