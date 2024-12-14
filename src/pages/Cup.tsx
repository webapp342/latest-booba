// src/components/DealsComponent.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import Cup from '../assets/cup.png'; // PNG dosyasını import edin

const TopComponent: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: 2,
        maxWidth: '100%',
      }}
    >
      {/* PNG Görseli */}
      <Box
        component="img"
        src={Cup}
        alt="Deal Icon"
        sx={{
          mt: 4,
          width: '100%',
          maxWidth: '25%', // Ekranın %50'sini aşmayacak şekilde sınırla
        }}
      />
      {/* Başlık */}
      <Typography
        variant="h5"
        sx={{
   
          marginTop: 4,
          color: 'black',
          fontWeight: 'bold',
        }}
      >
        Leaderboard
      </Typography>
      {/* Açıklama */}
      <Typography
        variant="body1"
        sx={{
          marginTop: 1,
          color: 'text.secondary',
        }}
      >
        Get more BBLIP - Be the First.
      </Typography>
    </Box>
  );
};

export default TopComponent;
