import React, { useState, useEffect } from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';
import tonLogo from '../assets/kucukTON.png';

interface PoolStatsProps {
  poolName: string;
  totalPools: number;
  apy: number;
  fillPercentage: number;
  tvl: string;
  leverage: number;
  badgeText: string;
  endTime?: Date; // Optional end time for countdown
}

const PoolStats: React.FC<PoolStatsProps> = ({
  apy,
  fillPercentage,
  tvl,
  leverage,
  badgeText,
  endTime
}) => {
  const isFull = fillPercentage === 100;
  const [timeLeft, setTimeLeft] = useState<string>('');
  const isNotStarted = endTime !== undefined;

  useEffect(() => {
    if (!endTime) return;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const end = new Date(endTime).getTime();
      const difference = end - now;

      if (difference <= 0) {
        setTimeLeft('Opening Now');
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  const getStatusColor = () => {
    if (isNotStarted) return '#6ed3ff';
    if (isFull) return '#ff4d4d';
    if (fillPercentage > 85) return '#ffa726';
    return '#6ed3ff';
  };

  return (
    <Box
      sx={{
        backgroundColor: 'rgba(47, 54, 58, 0.95)',
        borderRadius: '16px',
        p: { xs: 1.5, sm: 2 },
        border: '1px solid rgba(255, 255, 255, 0.1)',
        position: 'relative',
        opacity: isFull || isNotStarted ? 0.7 : 1,
      }}
    >
      {(isFull || isNotStarted) && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            borderRadius: '12px',
            padding: '8px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            zIndex: 2,
            border: `1px solid ${isNotStarted ? 'rgba(110, 211, 255, 0.2)' : 'rgba(255, 77, 77, 0.2)'}`,
          }}
        >
          <LockIcon sx={{ color: isNotStarted ? '#6ed3ff' : '#ff4d4d', fontSize: 20 }} />
          <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>
            {isNotStarted ? 'Upcoming' : 'Full'}
          </Typography>
        </Box>
      )}

      {/* Top Section */}
      <Box sx={{ mb: 1.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          {/* Status Badge */}
          <Box
            sx={{
              backgroundColor: `${getStatusColor()}20`,
              color: getStatusColor(),
              padding: '4px 12px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 600,
              border: `1px solid ${getStatusColor()}40`,
            }}
          >
            {badgeText}
          </Box>
          {/* APY */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography sx={{ color: '#6ed3ff', fontSize: '1.1rem', fontWeight: 700 }}>
              {apy}%
            </Typography>
          </Box>
        </Box>

        {/* Status Text */}
        <Typography
          sx={{
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '0.8rem',
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
          }}
        >
          {isNotStarted ? (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 0.5,
              color: '#6ed3ff',
              fontWeight: 500
            }}>
              <TimerOutlinedIcon sx={{ fontSize: 14 }} />
              {timeLeft}
            </Box>
          ) : (
            <>
              <InfoOutlinedIcon sx={{ fontSize: 14 }} />
              {isFull ? 'Pool is currently full' : fillPercentage > 85 ? 'Pool is almost full' : 'Pool is open'}
            </>
          )}
        </Typography>
      </Box>

      {/* Stats Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 1.5,
          mb: 1.5,
        }}
      >
        {/* TVL */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Box>
            <Typography sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.75rem' }}>
              TVL
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box component="img" src={tonLogo} sx={{ width: 16, height: 16 }} />
              <Typography sx={{ color: '#fff', fontSize: '1.1rem', fontWeight: 600 }}>
                {isNotStarted ? '---' : tvl}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Leverage */}
        <Box sx={{ textAlign: 'right' }}>
          <Typography sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.75rem' }}>
            Leverage
          </Typography>
          <Typography sx={{ 
            color: '#fff', 
            fontSize: '1.1rem', 
            fontWeight: 700,
            opacity: isNotStarted ? 0.5 : 1
          }}>
            {leverage}x
          </Typography>
        </Box>
      </Box>

      {/* Progress Bar */}
      <Box>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          mb: 0.5,
          alignItems: 'center'
        }}>
          <Typography sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.75rem' }}>
            Pool Capacity
          </Typography>
          <Typography sx={{ color: getStatusColor(), fontSize: '0.75rem', fontWeight: 600 }}>
            {isNotStarted ? '0%' : `${fillPercentage}%`}
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={isNotStarted ? 0 : fillPercentage}
          sx={{
            height: 6,
            borderRadius: 3,
            backgroundColor: 'rgba(54, 162, 235, 0.1)',
            '& .MuiLinearProgress-bar': {
              background: fillPercentage > 85
                ? 'linear-gradient(90deg, #ffa726, #ffb74d)'
                : 'linear-gradient(90deg, #6ed3ff, #89d9ff)',
              borderRadius: 3,
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default PoolStats;