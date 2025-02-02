import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';
import { useTheme } from '@mui/material/styles';

interface GuidedTourContextType {
  startTour: () => void;
  endTour: () => void;
  isActive: boolean;
}

const GuidedTourContext = createContext<GuidedTourContextType | undefined>(undefined);

interface GuidedTourProviderProps {
  children: ReactNode;
}

export const GuidedTourProvider: React.FC<GuidedTourProviderProps> = ({ children }) => {
  const [isActive, setIsActive] = useState(false);
  const theme = useTheme();

  const steps: Step[] = [
    {
      target: '.tour-step-1',
      content: 'Welcome to our app! Let\'s take a quick tour.',
      placement: 'center',
    },
    {
      target: '.deposit-button',
      content: 'Deposit TON to start trading and earning rewards',
      disableBeacon: true,
    },
    {
      target: '.withdraw-button',
      content: 'Withdraw your assets anytime with low fees',
      disableBeacon: true,
    },
    {
      target: '.swap-button',
      content: 'Swap between different tokens seamlessly',
      disableBeacon: true,
    },
    {
      target: '.history-button',
      content: 'Track all your transactions in one place',
      disableBeacon: true,
    },
  ];

  const handleJoyrideCallback = useCallback((data: CallBackProps) => {
    const { status } = data;
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      setIsActive(false);
      localStorage.setItem('guidedTourCompleted', 'true');
    }
  }, []);

  const startTour = useCallback(() => {
    setIsActive(true);
  }, []);

  const endTour = useCallback(() => {
    setIsActive(false);
  }, []);

  return (
    <GuidedTourContext.Provider value={{ startTour, endTour, isActive }}>
      <Joyride
        steps={steps}
        run={isActive}
        continuous
        showSkipButton
        showProgress
        styles={{
          options: {
            primaryColor: theme.palette.primary.main,
            textColor: theme.palette.text.primary,
            backgroundColor: theme.palette.background.paper,
          },
        }}
        callback={handleJoyrideCallback}
      />
      {children}
    </GuidedTourContext.Provider>
  );
};

export const useGuidedTour = () => {
  const context = useContext(GuidedTourContext);
  if (context === undefined) {
    throw new Error('useGuidedTour must be used within a GuidedTourProvider');
  }
  return context;
}; 