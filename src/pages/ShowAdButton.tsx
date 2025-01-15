import React, { useState } from 'react';
import { Button, CircularProgress } from '@mui/material';

// onAdWatched prop'unu tanımlıyoruz
interface ShowAdButtonProps {
  onAdWatched: () => void;
}

const ShowAdButton: React.FC<ShowAdButtonProps> = ({ onAdWatched }) => {
  const [loading, setLoading] = useState(false);

  const handleWatchAd = () => {
    setLoading(true);
    // Burada reklam API'si ile entegrasyon yapılmalıdır
    // Örneğin, reklam izlendikten sonra onAdWatched çağrılır
    // Aşağıdaki örnek, 3 saniye bekleyip reklamın bittiğini varsayar
    setTimeout(() => {
      setLoading(false);
      onAdWatched();
    }, 3000); // 3 saniye bekleme (örnek)
  };

  return (
    <Button 
      variant="contained" 
      color="primary" 
      onClick={handleWatchAd}
      disabled={loading}
      sx={{
        textTransform: 'none',
        borderRadius: '12px',
        backgroundColor: '#00c6ff',
        fontSize: { xs: '0.8rem', sm: '0.85rem' },
        fontWeight: 600,
        px: { xs: 2, sm: 3 },
        py: { xs: 0.5, sm: 0.75 },
        '&:hover': {
          backgroundColor: '#0072ff'
        },
        '&:disabled': {
          backgroundColor: 'rgba(0, 0, 0, 0.12)',
          color: 'rgba(0, 0, 0, 0.26)'
        }
      }}
    >
      {loading ? <CircularProgress size={16} color="inherit" /> : 'Watch Ad'}
    </Button>
  );
};

export default ShowAdButton;