import { useCallback, useEffect, useState, ReactElement } from 'react';
import { useAdsgram } from './useAdsgram';
import { ShowPromiseResult } from './adsgram';
import { updateUserBblip } from '../utils/database';
import { Button } from '@mui/material';

const COOLDOWN_PERIOD = 15 * 60 * 1000; // 1 hour in milliseconds

export function ShowAdButton(): ReactElement {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const lastRewardTime = localStorage.getItem('lastRewardTime');
      if (!lastRewardTime) {
        setTimeLeft(0);
        return;
      }

      const now = new Date().getTime();
      const lastTime = new Date(lastRewardTime).getTime();
      const diff = now - lastTime;

      if (diff >= COOLDOWN_PERIOD) {
        setTimeLeft(0);
      } else {
        setTimeLeft(COOLDOWN_PERIOD - diff);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const onReward = useCallback(() => {
    localStorage.setItem('lastRewardTime', new Date().toISOString());
    updateUserBblip(10000).catch((error) => {
      console.error('Bblip güncellenirken hata oluştu:', error);
      alert('Bblip güncellenirken bir hata oluştu.');
    });
    alert('Congratulations, your reward has been added to your wallet');
  }, []);

  const onError = useCallback((result: ShowPromiseResult) => {
    alert(JSON.stringify(result, null, 4));
  }, []);

  const showAd = useAdsgram({ blockId: '8216', onReward, onError });

  const formatTimeLeft = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return timeLeft > 0 ? (
    <div style={{ color: '#6ed3ff', fontSize: '1rem' }}>
      {formatTimeLeft(timeLeft)}
    </div>
  ) : (
    <Button 
      onClick={showAd} 
      sx={{
        p: 1,
        backgroundColor: 'rgba(110, 211, 255, 0.1)',
        color: '#6ed3ff',
        '&:disabled': {
          background: '#2f363a',
          color: 'rgba(255, 255, 255, 0.3)',
        },
      }}
    >
      Earn
    </Button>
  );
}
