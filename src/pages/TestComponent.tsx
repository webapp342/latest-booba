// src/components/DealsComponent.tsx
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
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
      {/* Buton */}
      <Button
        variant="contained"
        color="primary"
        sx={{
          mt: 4, // Yukarıdan boşluk bırak
          width: '95%', // Sayfa genişliğinin %90'ını kapla
          position: 'fixed', // Sayfanın altına sabitle
          bottom: 16, // Sayfanın altından 16px yukarıda
          left: '50%', // Sayfanın ortasına hizala
          transform: 'translateX(-50%)', // Ortalamayı sağla
          mb: 9, // Alt boşluk bırak
        }}
      >
        Invite Friends
      </Button>
    </Box>
  );
};

export default DealsComponent;
