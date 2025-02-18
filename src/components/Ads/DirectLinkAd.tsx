import React, { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
} from '@mui/material';
import { Hourglass } from 'lucide-react';
import { getFirestore, doc, updateDoc, increment } from 'firebase/firestore';
import { app } from '../../pages/firebaseConfig';
import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import watchad from '../../assets/watchad.png'


const db = getFirestore(app);

const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const RotatingIcon = styled(Box)`
  animation: ${rotate} 2s steps(2) infinite;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// Only declare atOptions here since Telegram types are in telegram.d.ts
declare global {
  interface Window {
    atOptions?: {
      key: string;
      format: string;
      params: Record<string, unknown>;
    };
  }
}

interface DirectLinkAdProps {
  onAdComplete?: () => void;
  disabled?: boolean;
}

const ADSTERRA_DIRECT_LINK = 'https://www.effectiveratecpm.com/rfzqpxh9b5?key=363850befc2ce02b0f1173157255afe8';
const TOTAL_REQUIRED_VIEWS = 2;
const VIEW_COUNT_KEY = 'adViewCount';
const LAST_CLAIM_KEY = 'lastAdClaim';
const REWARD_AMOUNT = 25000;
const COOLDOWN_TIME = 60 * 60 * 1000; // 60 minutes in milliseconds

const DirectLinkAd: React.FC<DirectLinkAdProps> = ({ onAdComplete, disabled }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewCount, setViewCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  // Load initial view count and check cooldown
  useEffect(() => {
    const lastClaim = localStorage.getItem(LAST_CLAIM_KEY);
    if (lastClaim) {
      const lastClaimTime = parseInt(lastClaim);
      const now = Date.now();
      const timePassed = now - lastClaimTime;
      
      if (timePassed < COOLDOWN_TIME) {
        setTimeLeft(COOLDOWN_TIME - timePassed);
        // Reset view count during cooldown
        localStorage.removeItem(VIEW_COUNT_KEY);
        setViewCount(0);
      } else {
        // Cooldown expired, clean up everything
        localStorage.removeItem(LAST_CLAIM_KEY);
        localStorage.removeItem(VIEW_COUNT_KEY);
        setViewCount(0);
        setTimeLeft(null);
      }
    } else {
      // No last claim, load saved view count if exists
      const savedCount = localStorage.getItem(VIEW_COUNT_KEY);
      if (savedCount) {
        setViewCount(parseInt(savedCount));
      }
    }
  }, []);

  // Handle countdown timer
  useEffect(() => {
    if (timeLeft === null) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === null || prev <= 1000) {
          clearInterval(timer);
          // Clean up everything when timer ends
          localStorage.removeItem(LAST_CLAIM_KEY);
          localStorage.removeItem(VIEW_COUNT_KEY);
          setViewCount(0);
          return null;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAdClick = useCallback(() => {
    setLoading(true);
    setError(null);

    try {
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.openLink(ADSTERRA_DIRECT_LINK);
      } else {
        window.open(ADSTERRA_DIRECT_LINK, '_blank');
      }

      // Increment view count
      const newCount = viewCount + 1;
      setViewCount(newCount);
      localStorage.setItem(VIEW_COUNT_KEY, newCount.toString());

      // Call onAdComplete when all views are completed
      if (newCount >= TOTAL_REQUIRED_VIEWS && onAdComplete) {
        onAdComplete();
      }
    } catch (err) {
      setError('Failed to load advertisement. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [onAdComplete, viewCount]);

  const handleClaim = async () => {
    try {
      setLoading(true);
      const telegramUserId = localStorage.getItem('telegramUserId');
      if (!telegramUserId) {
        throw new Error('User ID not found');
      }

      const now = Date.now();
      const userDocRef = doc(db, 'users', telegramUserId);
      await updateDoc(userDocRef, {
        bblip: increment(REWARD_AMOUNT),
        lastAdReward: now
      });

      // Reset view count and set cooldown timestamp
      localStorage.removeItem(VIEW_COUNT_KEY);
      setViewCount(0);
      
      localStorage.setItem(LAST_CLAIM_KEY, now.toString());
      setTimeLeft(COOLDOWN_TIME);

      if (onAdComplete) {
        onAdComplete();
      }
    } catch (err) {
      setError('Failed to claim reward. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  const formatTimeLeft = (ms: number) => {
    const minutes = Math.floor(ms / (60 * 1000));
    const seconds = Math.ceil((ms % (60 * 1000)) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  return (
    <Box //@ts-ignore
      sx={{ 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      
      }}
    >
      <Button
      fullWidth
        variant="contained"
        onClick={viewCount >= TOTAL_REQUIRED_VIEWS ? handleClaim : handleAdClick}
        disabled={disabled || loading || timeLeft !== null}
        startIcon={viewCount >= TOTAL_REQUIRED_VIEWS ? null :   <img src={watchad} alt="" width={32} />}
        sx={{
          backgroundColor: viewCount >= TOTAL_REQUIRED_VIEWS 
            ? 'rgba(76, 175, 80, 0.1)' 
            : 'rgba(110, 211, 255, 0.1)',
          color: viewCount >= TOTAL_REQUIRED_VIEWS ? '#4caf50' : '#6ed3ff',
          border: viewCount >= TOTAL_REQUIRED_VIEWS 
            ? '1px solid rgba(76, 175, 80, 0.5)' 
            : '1px solid rgba(110, 211, 255, 0.2)',
          '&:hover': {
            backgroundColor: viewCount >= TOTAL_REQUIRED_VIEWS 
              ? 'rgba(76, 175, 80, 0.2)' 
              : 'rgba(110, 211, 255, 0.2)',
            border: viewCount >= TOTAL_REQUIRED_VIEWS 
              ? '1px solid rgba(76, 175, 80, 0.7)' 
              : '1px solid rgba(110, 211, 255, 0.3)',
          },
          '&:disabled': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            color: 'rgba(255, 255, 255, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            opacity: 0.7,
            cursor: 'not-allowed'
          },
          borderRadius: '12px',
          py: 1.5,
          px: 3,
          minWidth: '200px',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          textTransform: 'none',
          fontSize: '0.95rem',
          fontWeight: 600,
          transition: 'all 0.2s ease'
        }}
      >
        {loading ? (
          <CircularProgress size={24} sx={{ color: 'inherit' }} />
        ) : timeLeft !== null ? (
          <>
                     

           Earn Free Spin
          </>
        ) : viewCount >= TOTAL_REQUIRED_VIEWS ? (
          <>
            <Box component="img" 
              src="/booba-logo.png" 
              sx={{ width: 20, height: 20, borderRadius: '50%', mr: 1 }} 
            />
            Claim 25,000 BBLIP
          </>
        ) : (
          <>
           Earn Free Spin
            {viewCount > 0 && (
              <Box //@ts-ignore
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  px: 1,
                  py: 0.5,
                  fontSize: '0.85rem',
                  ml: 1,
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                {viewCount}/{TOTAL_REQUIRED_VIEWS}
              </Box>
            )}
          </>
        )}
      </Button>

      {timeLeft !== null && (
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'rgba(255, 255, 255, 0.5)',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            fontSize: '0.85rem',
         mt:0.2,
          }}
        >
          <RotatingIcon>
            <Hourglass size={14} color="rgba(255, 255, 255, 0.5)" />
          </RotatingIcon>
          {`Free Spin in ${formatTimeLeft(timeLeft)}`}
        </Typography>
      )}

      {error && (
        <Typography color="error" variant="body2" textAlign="center">
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default DirectLinkAd;