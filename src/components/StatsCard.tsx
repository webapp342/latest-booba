import React from 'react';
import { Box, Card, Typography } from '@mui/material';
import { SvgIconProps } from '@mui/material/SvgIcon';

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactElement<SvgIconProps>;
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, change, icon }) => {
  const isPositive = change.startsWith('+');

  return (
    <Card sx={{
      p: 2,
      backgroundColor: 'rgba(110, 211, 255, 0.05)',
      borderRadius: 2,
      border: '1px solid rgba(110, 211, 255, 0.1)',
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <Box sx={{
          p: 1,
          borderRadius: '50%',
          backgroundColor: 'rgba(110, 211, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {React.cloneElement(icon, { 
            fontSize: "small",
            sx: { color: '#6ed3ff' }
          })}
        </Box>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
          {title}
        </Typography>
      </Box>
      
      <Typography variant="h5" className="text-gradient" sx={{ fontWeight: 'bold' }}>
        {value}
      </Typography>
      
      <Typography 
        variant="caption" 
        sx={{ 
          color: isPositive ? '#4CAF50' : '#f44336',
          display: 'flex',
          alignItems: 'center',
          gap: 0.5
        }}
      >
        {change}
      </Typography>
    </Card>
  );
}; 