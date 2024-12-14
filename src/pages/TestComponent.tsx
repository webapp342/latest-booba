// src/components/DealsComponent.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import Deal from '../assets/deal.png'; // PNG dosyasını import edin

const DealsComponent: React.FC = () => {
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
        margin: '0 auto',
      }}
    >
      {/* PNG Görseli */}
      <Box
        component="img"
        src={Deal}
        alt="Deal Icon"
        sx={{
          mt: 4,
          width: '50%',
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
        Friends
      </Typography>
      {/* Açıklama */}
      <Typography
        variant="body1"
        sx={{
          marginTop: 1,
          color: 'text.secondary',
        }}
      >
        Invite your friends to earn more BBLIP
      </Typography>
    </Box>
  );
};

export default DealsComponent;
