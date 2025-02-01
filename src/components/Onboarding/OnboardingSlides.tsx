import React, { useState } from 'react';
import { Box, Typography, Button, IconButton } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import SwapHorizontalCircleIcon from '@mui/icons-material/SwapHorizontalCircle';
import WalletIcon from '@mui/icons-material/Wallet';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import styled from '@emotion/styled';

interface OnboardingSlidesProps {
  onComplete: () => void;
}

const slides = [
  {
    title: "Welcome to Booba Blip",
    description: "Your gateway to next-level DeFi experience",
    icon: <WalletIcon sx={{ fontSize: 48, color: '#6ed3ff' }} />,
    highlight: "Secure • Fast • Rewarding"
  },
  {
    title: "Swap & Earn",
    description: "Trade tokens seamlessly with our intuitive swap interface",
    icon: <SwapHorizontalCircleIcon sx={{ fontSize: 48, color: '#6ed3ff' }} />,
    highlight: "Low fees • Best rates • Instant swaps"
  },
  {
    title: "Complete Tasks",
    description: "Earn rewards by completing simple tasks and inviting friends",
    icon: <TaskAltIcon sx={{ fontSize: 48, color: '#6ed3ff' }} />,
    highlight: "Daily rewards • Social tasks • Referral bonuses"
  }
];

const SlideContainer = styled(Box)({
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '24px',
  textAlign: 'center',
  color: 'white',
});

interface DotProps {
  active: boolean;
}

const ProgressDots = styled(Box)({
  display: 'flex',
  gap: '8px',
  marginTop: '32px',
});

const Dot = styled(Box)<DotProps>(({ active }) => ({
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  backgroundColor: active ? '#6ed3ff' : 'rgba(110, 211, 255, 0.3)',
  transition: 'all 0.3s ease',
}));

const NavigationButton = styled(IconButton)({
  color: '#6ed3ff',
  backgroundColor: 'rgba(110, 211, 255, 0.1)',
  '&:hover': {
    backgroundColor: 'rgba(110, 211, 255, 0.2)',
  },
});

const GetStartedButton = styled(Button)({
  backgroundColor: '#6ed3ff',
  color: '#1a2126',
  padding: '12px 32px',
  borderRadius: '12px',
  fontSize: '16px',
  fontWeight: 'bold',
  textTransform: 'none',
  marginTop: '32px',
  '&:hover': {
    backgroundColor: '#89d9ff',
  },
});

const OnboardingSlides: React.FC<OnboardingSlidesProps> = ({ onComplete }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide === slides.length - 1) {
      onComplete();
    } else {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <Box sx={{ overflow: 'hidden', height: '100vh' }}>
      <AnimatePresence initial={false} custom={currentSlide}>
        <motion.div
          key={currentSlide}
          custom={currentSlide}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%'
          }}
        >
          <SlideContainer>
            <Box sx={{ mb: 4 }}>
              {slides[currentSlide].icon}
            </Box>
            
            <Typography 
              variant="h4" 
              sx={{ 
                mb: 2,
                fontWeight: 'bold',
                background: 'linear-gradient(90deg, #6ED3FF 0%, #89D9FF 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              {slides[currentSlide].title}
            </Typography>
            
            <Typography 
              variant="body1" 
              sx={{ 
                mb: 2,
                color: 'rgba(255, 255, 255, 0.7)',
                maxWidth: '280px'
              }}
            >
              {slides[currentSlide].description}
            </Typography>
            
            <Typography 
              variant="caption" 
              sx={{ 
                color: '#6ed3ff',
                opacity: 0.8
              }}
            >
              {slides[currentSlide].highlight}
            </Typography>

            <Box sx={{ 
              position: 'fixed',
              bottom: 'env(safe-area-inset-bottom, 32px)',
              left: 0,
              right: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              px: 3
            }}>
              <Box sx={{ 
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                mb: 3
              }}>
                <NavigationButton 
                  onClick={handlePrevious}
                  disabled={currentSlide === 0}
                >
                  <ArrowBackIcon />
                </NavigationButton>
                
                <ProgressDots>
                  {slides.map((_, index) => (
                    <Dot key={index} active={currentSlide === index} />
                  ))}
                </ProgressDots>
                
                <NavigationButton onClick={handleNext}>
                  <ArrowForwardIcon />
                </NavigationButton>
              </Box>

              {currentSlide === slides.length - 1 && (
                <GetStartedButton
                  fullWidth
                  onClick={onComplete}
                  variant="contained"
                >
                  Get Started
                </GetStartedButton>
              )}
            </Box>
          </SlideContainer>
        </motion.div>
      </AnimatePresence>
    </Box>
  );
};

export default OnboardingSlides; 