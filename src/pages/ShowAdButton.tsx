import { useCallback, useEffect, useState, ReactElement } from 'react';
import { useAdsgram } from './useAdsgram';
import { ShowPromiseResult } from './adsgram';
import { updateUserBblip } from '../utils/database';
import { getFirestore, doc, onSnapshot } from 'firebase/firestore';
import { Button } from '@mui/material';

const db = getFirestore();

export function ShowAdButton(): ReactElement {
  const [lastRewardTime, setLastRewardTime] = useState<Date | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  // Veritabanından veya Local Storage'dan lastRewardTime'ı çekiyoruz
  useEffect(() => {
    const userId = localStorage.getItem('telegramUserId');
    if (!userId) {
      console.error('User ID localStorage\'da bulunamadı.');
      return;
    }

    // Veritabanından lastRewardTime'ı almak için onSnapshot kullanıyoruz
    const userRef = doc(db, 'users', userId);
    const unsubscribe = onSnapshot(userRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        if (data.lastRewardTime) {
          const rewardTime = data.lastRewardTime.toDate();
          setLastRewardTime(rewardTime);
          localStorage.setItem('lastRewardTime', rewardTime.toISOString()); // Veriyi Local Storage'a kaydedelim
        }
      }
    });

    return () => unsubscribe(); // Cleanup: Abonelikten çıkmak
  }, []);

  // lastRewardTime değiştiğinde zaman kalan süreyi hesapla
  useEffect(() => {
    if (!lastRewardTime) return;

    const calculateTimeLeft = () => {
      const now = new Date();
      const diff = now.getTime() - lastRewardTime.getTime();
      const oneHour = 60 * 60 * 1000;
      if (diff >= oneHour) {
        setTimeLeft(0); // 1 saat geçti, butonu göster
      } else {
        setTimeLeft(oneHour - diff); // Kalan süreyi hesapla
      }
    };

    // İlk hesaplamayı yap
    calculateTimeLeft();

    // Zamanı güncellemek için bir defa timeout ile işlem yap
    const timer = setTimeout(calculateTimeLeft, 1000);

    return () => clearTimeout(timer); // Cleanup: Timer'ı temizle
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
  const showAd = useAdsgram({ blockId: '6760', onReward, onError });

  // Kalan süreyi formatla (HH:MM:SS)
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
        <Button onClick={showAd}  sx={{
      textTransform: 'none',
      borderRadius: '12px',
      color:'black',
      backgroundColor: '#b4e6ff',
      fontSize: { xs: '0.8rem', sm: '0.85rem' },
      fontWeight: 600,
      px: { xs: 2, sm: 3 },
      py: { xs: 0.5, sm: 0.75 },
     
    }}>Watch Now</Button>
      )}
    </>
  );
}
