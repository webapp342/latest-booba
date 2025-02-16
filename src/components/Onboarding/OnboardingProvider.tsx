import React, { createContext, useContext, useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import OnboardingSlides from './OnboardingSlides';

interface OnboardingContextType {
  isFirstVisit: boolean;
  isTourActive: boolean;
  completeOnboarding: () => void;
  startTour: () => void;
  completeTour: () => void;
  restartTour: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};

interface OnboardingProviderProps {
  children: React.ReactNode;
}

export const OnboardingProvider: React.FC<OnboardingProviderProps> = ({ children }) => {
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const [isTourActive, setIsTourActive] = useState(false);

  useEffect(() => {
    const onboardingCompleted = localStorage.getItem('onboardingCompleted');
    if (onboardingCompleted === 'true') {
      setIsFirstVisit(false);
    }
  }, []);

  const completeOnboarding = () => {
    setIsFirstVisit(false);
    localStorage.setItem('onboardingCompleted', 'true');
    // Start tour automatically after onboarding
    setIsTourActive(true);
  };

  const startTour = () => {
    setIsTourActive(true);
  };

  const completeTour = () => {
    setIsTourActive(false);
    localStorage.setItem('tourCompleted', 'true');
  };

  const restartTour = () => {
    localStorage.removeItem('tourCompleted');
    setIsTourActive(true);
  };

  return (
    <OnboardingContext.Provider 
      value={{ 
        isFirstVisit, 
        isTourActive,
        completeOnboarding,
        startTour,
        completeTour,
        restartTour
      }}
    >
      <Box sx={{ position: 'relative', height: '100%' }}>
        <AnimatePresence>
          {isFirstVisit && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 9999,
                background: 'linear-gradient(180deg, rgba(26, 33, 38, 0.99) 0%, rgba(26, 33, 38, 0.95) 100%)',
              }}
            >
              <OnboardingSlides onComplete={completeOnboarding} />
            </motion.div>
          )}
        </AnimatePresence>
        {children}
      </Box>
    </OnboardingContext.Provider>
  );
}; 