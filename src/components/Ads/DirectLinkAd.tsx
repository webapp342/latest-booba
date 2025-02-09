import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
} from '@mui/material';
import { ExternalLink } from 'lucide-react';

// Global type declaration for Adsterra
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

const DirectLinkAd: React.FC<DirectLinkAdProps> = ({ onAdComplete, disabled }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAdClick = async () => {
    setLoading(true);
    setError(null);

    try {
      // Yeni pencerede Direct Link'i aç
      window.open(ADSTERRA_DIRECT_LINK, '_blank');

      // İsteğe bağlı callback
      if (onAdComplete) {
        onAdComplete();
      }
    } catch (err) {
      setError('Failed to load advertisement. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      sx={{ 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        p: 2,
      }}
    >
      <Button
        variant="contained"
        onClick={handleAdClick}
        disabled={disabled || loading}
        startIcon={<ExternalLink size={18} />}
        sx={{
          backgroundColor: 'rgba(110, 211, 255, 0.1)',
          color: '#6ed3ff',
          '&:hover': {
            backgroundColor: 'rgba(110, 211, 255, 0.2)',
          },
          '&:disabled': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            color: 'rgba(255, 255, 255, 0.3)',
          },
          borderRadius: '12px',
          py: 1.5,
          px: 3,
          minWidth: '200px',
        }}
      >
        {loading ? (
          <CircularProgress size={24} sx={{ color: 'inherit' }} />
        ) : (
          'Watch Ad'
        )}
      </Button>

      {error && (
        <Typography color="error" variant="body2" textAlign="center">
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default DirectLinkAd; 