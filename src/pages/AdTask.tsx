import { useEffect, useRef, useState } from "react";
import styles from "./task.module.css";
import { Box, Drawer, Typography, Button } from "@mui/material";
import { getFirestore, doc, updateDoc, increment } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './firebaseConfig';
import bblip from '../assets/booba-logo.png';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const COOLDOWN_DURATION = 5 * 1000; // 1 hour in milliseconds

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
  const [lastClaimTime, setLastClaimTime] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [isTaskAvailable, setIsTaskAvailable] = useState(true);

  useEffect(() => {
    // Load last claim time from localStorage
    const storedTime = localStorage.getItem('lastAdTaskClaimTime');
    if (storedTime) {
      setLastClaimTime(parseInt(storedTime));
    }
  }, []);

  useEffect(() => {
    if (lastClaimTime) {
      const timer = setInterval(() => {
        const now = Date.now();
        const elapsed = now - lastClaimTime;
        if (elapsed >= COOLDOWN_DURATION) {
          setLastClaimTime(null);
          localStorage.removeItem('lastAdTaskClaimTime');
          setTimeRemaining('');
        } else {
          const remaining = COOLDOWN_DURATION - elapsed;
          const minutes = Math.floor(remaining / (60 * 1000));
          const seconds = Math.floor((remaining % (60 * 1000)) / 1000);
          setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, '0')}`);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [lastClaimTime]);

  const handleClaim = async () => {
    try {
      setLoading(true);
      const telegramUserId = localStorage.getItem('telegramUserId');
      if (!telegramUserId) throw new Error('User ID not found');

      const userDocRef = doc(db, 'users', telegramUserId);
      await updateDoc(userDocRef, {
        bblip: increment(5000)
      });

      const now = Date.now();
      setLastClaimTime(now);
      localStorage.setItem('lastAdTaskClaimTime', now.toString());
      setIsDrawerOpen(false);
    } catch (error) {
      console.error('Error claiming reward:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const rewardHandler = (_event: CustomEvent<string>) => {
      if (!lastClaimTime || Date.now() - lastClaimTime >= COOLDOWN_DURATION) {
        setIsDrawerOpen(true);
      }
    };

    const bannerNotFoundHandler = () => {
      setIsTaskAvailable(false);
    };

    const task = taskRef.current;

    if (task) {
      task.addEventListener("reward", rewardHandler);
      task.addEventListener("onBannerNotFound", bannerNotFoundHandler);
    }

    return () => {
      if (task) {
        task.removeEventListener("reward", rewardHandler);
        task.removeEventListener("onBannerNotFound", bannerNotFoundHandler);
      }
    };
  }, [lastClaimTime]);

  if (!customElements.get("adsgram-task") || !isTaskAvailable) {
    return null;
  }

  if (lastClaimTime && Date.now() - lastClaimTime < COOLDOWN_DURATION) {
    return (
      <Box
        sx={{
          width: '92%',
          padding: '16px',
          borderRadius: '12px',
          backgroundColor: 'rgba(0, 198, 255, 0.05)',
          color: 'rgba(255, 255, 255, 0.7)',
          textAlign: 'center',
          border: '1px solid rgba(110, 211, 255, 0.1)',
        }}
      >
        <Typography>
          Task will be available in {timeRemaining}
        </Typography>
      </Box>
    );
  }

  return (
    <>
        <>
          <Typography
            sx={{
              fontSize: '1.1rem',
              fontWeight: 600,
              color: '#fff',
              mt: 4,
              mb: 2,
              textAlign: 'left',
              width: '95%'
            }}
          >
            Partners
          </Typography>
          <adsgram-task
            className={styles.task}
            data-block-id={blockId}
            data-debug={debug}
            ref={taskRef}
          >
            <span slot="reward" className={styles.reward1}>
              <img src={bblip} alt="" style={{width: '16px', borderRadius: '50%' , marginBottom: '-4px', marginRight: '4px'}} /> +5 BBLIP
            </span>
            <div slot="button" className={styles.button}>
              Go
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
                You've earned 5 BBLIP for completing this task !
              </Typography>
              <Typography
                sx={{
                  color: 'rgba(255,255,255,0.7)',
                  mb: 3
                }}
              >
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
    </>
  );
};