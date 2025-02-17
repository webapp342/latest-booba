import React, { useState, useEffect } from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { Lock, AccessTime } from '@mui/icons-material';

interface GlassOverlayProps {
  children: React.ReactNode;
}

const GlassOverlay: React.FC<GlassOverlayProps> = ({ children }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const targetDate = new Date('2025-02-20T18:00:00Z');

    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Box sx={{ position: 'relative' }}>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(8px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 3,
          cursor: 'not-allowed',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <Lock sx={{ 
            fontSize: 40, 
            color: '#6ed3ff',
            mb: 2,
            opacity: 0.8
          }} />
          
          <Typography
            variant="h6"
            sx={{
              color: 'rgba(255, 255, 255, 0.8)',
              textAlign: 'center',
              px: 2,
              fontWeight: 600,
              fontSize: '1.5rem',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              background: 'linear-gradient(45deg, #6ed3ff 30%, #89d9ff 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1,
            }}
          >
            Coming Soon
          </Typography>

          <Chip
            label="Beta Access Only"
            color="primary"
            size="small"
            sx={{
              backgroundColor: 'rgba(110, 211, 255, 0.15)',
              color: '#6ed3ff',
              border: '1px solid rgba(110, 211, 255, 0.3)',
              fontWeight: 500,
              fontSize: '0.75rem',
            }}
          />
        </Box>

        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.2)',
          padding: '12px 20px',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <AccessTime sx={{ color: '#6ed3ff', fontSize: 18 }} />
          <Box sx={{ display: 'flex', gap: 2 }}>
            {Object.entries(timeLeft).map(([unit, value]) => (
              <Box
                key={unit}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  minWidth: '45px'
                }}
              >
                <Typography
                  sx={{
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    fontFamily: 'monospace'
                  }}
                >
                  {value.toString().padStart(2, '0')}
                </Typography>
                <Typography
                  sx={{
                    color: 'rgba(255,255,255,0.5)',
                    fontSize: '0.65rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}
                >
                  {unit}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        <Box sx={{ textAlign: 'center', maxWidth: '280px' }}>
          <Typography
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '0.85rem',
              lineHeight: 1.5,
              mb: 0.5
            }}
          >
            Currently in beta testing phase
          </Typography>
          <Typography
            sx={{
              color: 'rgba(255, 255, 255, 0.5)',
              fontSize: '0.75rem',
              lineHeight: 1.5
            }}
          >
            Public access will be available on February 20, 2025
          </Typography>
        </Box>
      </Box>

      <Box sx={{ 
        filter: 'blur(4px)',
        pointerEvents: 'none',
        opacity: 0.7,
        transition: 'all 0.3s ease',
      }}>
        {children}
      </Box>
    </Box>
  );
};

export default GlassOverlay; 