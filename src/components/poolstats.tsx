import React from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import tonLogo from '../assets/kucukTON.png';

interface PoolStatsProps {
  poolName: string;
  totalPools: number;
  apy: number;
  fillPercentage: number;
  tvl: string;
  leverage: number;
  badgeText: string;
}

const PoolStats: React.FC<PoolStatsProps> = ({

  totalPools,
  apy,
  fillPercentage,
  tvl,
    leverage,

  badgeText
}) => {
  const isFull = fillPercentage === 100;

  return (
    <Box
      sx={{
        backgroundColor: '#2f363a',
        borderRadius: '16px',
        p: 1,
    
        height: '100%',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        position: 'relative',
        opacity: isFull ? 0.7 : 1,
      
      }}
    >
      {isFull && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            borderRadius: '8px',
            padding: '8px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
           
            zIndex: 2,
          }}
        >
          <LockIcon sx={{ color: '#fff' }} />
          <Typography sx={{ color: '#fff', fontWeight: 600 }}>
            Pool is Full
          </Typography>
        </Box>
      )}

      {/* Badge */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Box
          sx={{
            backgroundColor: isFull ? 'rgba(239, 68, 68, 0.1)' : 'rgba(54, 162, 235, 0.1)',
            color: isFull ? '#EF4444' : '#36A2EB',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '0.85rem',

            fontWeight: 600,
          }}
        >
          {badgeText}
        </Box>
        <Typography
          sx={{
            color: isFull ? '#EF4444' : '#36A2EB',
            fontSize: '1rem',
            fontWeight: 700,
          }}
        >
          {apy}%
          <Typography component="span" sx={{             fontSize: '0.75rem',
 color: '#6B7280', ml: 0.5 }}>
            APY
          </Typography>
        </Typography>
      </Box>

      {/* TVL Section */}
      <Box sx={{ mb: 1 }}>
        <Typography
          sx={{
            color: '#6B7280',
            fontSize: '0.75rem',
          }}
        >
          Total Value Locked
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            component="img"
            src={tonLogo}
            sx={{
              width: 16,
              height: 16,
              objectFit: 'contain'
            }}
          />
          <Typography
            sx={{
              color: '#ffffff',
              fontSize: '1rem',
              fontWeight: 600,
            }}
          >
            {tvl} 
          </Typography>
        </Box>
      </Box>

      {/* Progress Bar */}
      <Box sx={{ mb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography sx={{ color: '#6B7280', fontSize: '0.75rem' }}>
            Pool Capacity
          </Typography>
          <Typography sx={{ color: isFull ? '#EF4444' : '#ffffff', fontSize: '0.85rem', fontWeight: isFull ? 600 : 400 }}>
            {fillPercentage}%
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={fillPercentage}
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: 'rgba(54, 162, 235, 0.1)',
            position: 'relative',
            overflow: 'hidden',
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
              transform: 'translateX(-100%)',
              animation: 'shimmer 2s infinite',
            },
            '& .MuiLinearProgress-bar': {
              background: fillPercentage > 85
                ? 'linear-gradient(90deg, #ff4d4d, #ff6b6b)'
                : 'linear-gradient(90deg, #36A2EB, #4dc9ff)',
              borderRadius: 4,
              transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
              animation: fillPercentage > 85 ? 'warningPulse 2s infinite' : 'progressAnimation 2s infinite',
              boxShadow: fillPercentage > 85 
                ? '0 0 10px rgba(255, 77, 77, 0.5)'
                : '0 0 10px rgba(54, 162, 235, 0.3)',
            },
            '@keyframes shimmer': {
              '0%': {
                transform: 'translateX(-100%)',
              },
              '100%': {
                transform: 'translateX(100%)',
              },
            },
            '@keyframes warningPulse': {
              '0%': {
                boxShadow: '0 0 5px rgba(255, 77, 77, 0.5)',
              },
              '50%': {
                boxShadow: '0 0 15px rgba(255, 77, 77, 0.8)',
              },
              '100%': {
                boxShadow: '0 0 5px rgba(255, 77, 77, 0.5)',
              },
            },
            '@keyframes progressAnimation': {
              '0%': {
                backgroundPosition: '0% 50%',
              },
              '50%': {
                backgroundPosition: '100% 50%',
              },
              '100%': {
                backgroundPosition: '0% 50%',
              },
            },
          }}
        />
      </Box>

      {/* Total Pools */}
      <Box display={'flex'} justifyContent={'space-between'}sx={{ mt: 1 }}>
        <Box>
           <Typography
          sx={{
            color: '#6B7280',
            fontSize: '0.75rem',
          }}
        >
          Tier
        </Typography>
        <Typography
          sx={{
            mb:-2,
            color: '#ffffff',
            fontSize: '1rem',
            fontWeight: 500,
          }}
        >
          {totalPools}%
        </Typography>

        </Box>

            <Box>
           <Typography
          sx={{
            color: '#6B7280',
            fontSize: '0.75rem',
          }}
        >
          Leverage
        </Typography>
        <Typography
        align='right'
          sx={{
            mb:-2,
            color: '#ffffff',
            fontSize: '1rem',
            fontWeight: 500,
          }}
        >
          {leverage}x
        </Typography>

        </Box>
       
      </Box>
    </Box>
  );
};

export default PoolStats;