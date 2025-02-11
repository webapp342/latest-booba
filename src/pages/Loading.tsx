import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { keyframes } from '@emotion/react';
import { styled } from '@mui/material/styles';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const LoadingContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  background: '#1a2126',
  color: '#fff',
});

const LoadingText = styled(Typography)({
  color: 'rgba(255, 255, 255, 0.7)',
  fontSize: '0.875rem',
  letterSpacing: '0.1em',
  fontWeight: 500,
  animation: `${fadeIn} 0.5s ease-out`,
});

interface LoadingProps {
  onLoadComplete: () => void;
}

const Loading: React.FC<LoadingProps> = ({ onLoadComplete }) => {
  React.useEffect(() => {
    // Sadece kritik servislerin başlatılmasını bekle
    const initApp = async () => {
      try {
        // Firebase veya diğer kritik servislerin başlatılması
        onLoadComplete();
      } catch (error) {
        console.error('Initialization error:', error);
        onLoadComplete(); // Hata durumunda da devam et
      }
    };

    initApp();
  }, [onLoadComplete]);

  return (
    <LoadingContainer>
      <LoadingText>Loading...</LoadingText>
    </LoadingContainer>
  );
};

export default Loading;