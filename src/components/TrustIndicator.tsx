import React from 'react';
import { Box, Typography } from '@mui/material';
import { SvgIconProps } from '@mui/material/SvgIcon';

interface TrustIndicatorProps {
  icon: React.ReactElement<SvgIconProps>;
  label: string;
  value: string;
}

export const TrustIndicator: React.FC<TrustIndicatorProps> = ({ icon, label, value }) => {
  return (
    <Box sx={{
      p: 2,
      borderRadius: 2,
      backgroundColor: 'rgba(110, 211, 255, 0.05)',
      border: '1px solid rgba(110, 211, 255, 0.1)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 1
    }}>
      <Box sx={{
        p: 1,
        borderRadius: '50%',
        backgroundColor: 'rgba(110, 211, 255, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {React.cloneElement(icon, { 
          fontSize: "medium",
          sx: { color: '#6ed3ff' }
        })}
      </Box>
      
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
          {label}
        </Typography>
        <Typography variant="body1" className="text-gradient" sx={{ fontWeight: 'bold' }}>
          {value}
        </Typography>
      </Box>
    </Box>
  );
}; 