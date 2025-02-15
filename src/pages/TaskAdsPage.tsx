import { useEffect, useRef, useState } from "react";
import styles from "./task.module.css";
import { Box, Drawer, Typography, Button } from "@mui/material";
import { getFirestore, doc, updateDoc, increment } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './firebaseConfig';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const COOLDOWN_PERIOD = 60 * 60 * 1000; // 1 hour in milliseconds

/**
  * Check Typescript section
  * and add types for <adsgram-task> typing
*/

interface TaskProps {
  debug: boolean;
  blockId: string;
}

export const Task = ({ debug, blockId }: TaskProps) => {
  const taskRef = useRef<AdsgramTaskElement>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const lastRewardTime = localStorage.getItem(`lastRewardTime_${blockId}`);
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
  }, [blockId]);

  const formatTimeLeft = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleClaim = async () => {
    try {
      setLoading(true);
      const telegramUserId = localStorage.getItem('telegramUserId');
      if (!telegramUserId) throw new Error('User ID not found');

      const userDocRef = doc(db, 'users', telegramUserId);
      await updateDoc(userDocRef, {
        bblip: increment(5000)
      });

      localStorage.setItem(`lastRewardTime_${blockId}`, new Date().toISOString());
      setIsDrawerOpen(false);
    } catch (error) {
      console.error('Error claiming reward:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handler = (_event: CustomEvent<string>) => {
      setIsDrawerOpen(true);
    };
    const task = taskRef.current;

    if (task) {
      task.addEventListener("reward", handler);
    }

    return () => {
      if (task) {
        task.removeEventListener("reward", handler);
      }
    };
  }, []);

  if (!customElements.get("adsgram-task")) {
    return null;
  }

  return (
    <>
      {timeLeft > 0 ? (
        <Box
          sx={{
            p: 2,
            backgroundColor: 'rgba(110, 211, 255, 0.1)',
            borderRadius: '12px',
            border: '1px solid rgba(110, 211, 255, 0.1)',
            color: '#6ed3ff',
            fontSize: '0.9rem',
            fontWeight: 500,
            textAlign: 'center',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1
          }}
        >
          <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>Next reward in:</Typography>
          {formatTimeLeft(timeLeft)}
        </Box>
      ) : (
        <>
          <adsgram-task
            className={styles.task}
            data-block-id={blockId}
            data-debug={debug}
            ref={taskRef}
          >
            <span slot="reward" className={styles.reward}>
              +15 Bblip
            </span>
            <div slot="button" className={styles.button}>
              Earn
            </div>
            <div slot="done" className={styles.button_done}>
              Done
            </div>
          </adsgram-task>

          <Drawer
            anchor="bottom"
            open={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            PaperProps={{
              sx: {
                backgroundColor: '#1A2126',
                borderTopLeftRadius: '16px',
                borderTopRightRadius: '16px',
                border: '1px solid rgba(110, 211, 255, 0.1)',
              }
            }}
          >
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography
                variant="h6"
                sx={{
                  color: '#fff',
                  fontWeight: 600,
                  mb: 1
                }}
              >
                Congratulations! 🎉
              </Typography>
              <Typography
                sx={{
                  color: 'rgba(255,255,255,0.7)',
                  mb: 3
                }}
              >
                You've earned 5 BBLIP for completing this task!
              </Typography>
              <Button
                variant="contained"
                onClick={handleClaim}
                disabled={loading}
                sx={{
                  backgroundColor: 'rgba(110, 211, 255, 0.1)',
                  color: '#6ed3ff',
                  '&:hover': {
                    backgroundColor: 'rgba(110, 211, 255, 0.2)',
                  },
                  minWidth: 120,
                }}
              >
                {loading ? 'Claiming...' : 'Claim Reward'}
              </Button>
            </Box>
          </Drawer>
        </>
      )}
    </>
  );
};