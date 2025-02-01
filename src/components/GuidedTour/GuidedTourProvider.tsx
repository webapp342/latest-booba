import React, { createContext, useContext, useState, useEffect } from 'react';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';
import { useTheme } from '@mui/material/styles';

interface GuidedTourContextType {
  startTour: () => void;
  endTour: () => void;
  isActive: boolean;
}

const GuidedTourContext = createContext<GuidedTourContextType | undefined>(undefined);

export const useGuidedTour = () => {
  const context = useContext(GuidedTourContext);
  if (!context) {
    throw new Error('useGuidedTour must be used within a GuidedTourProvider');
  }
  return context;
};

const steps: Step[] = [
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

interface GuidedTourProviderProps {
  children: React.ReactNode;
}

export const GuidedTourProvider: React.FC<GuidedTourProviderProps> = ({ children }) => {
  const [isActive, setIsActive] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    // During testing, we'll show the tour after a short delay
    const timer = setTimeout(() => {
      setIsActive(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setIsActive(false);
      // In production, we'll update Firebase here
      localStorage.setItem('guidedTourCompleted', 'true');
    }
  };

  const startTour = () => setIsActive(true);
  const endTour = () => setIsActive(false);

  return (
    <GuidedTourContext.Provider value={{ startTour, endTour, isActive }}>
      <Joyride
        callback={handleJoyrideCallback}
        continuous
        hideCloseButton
        hideBackButton
        showProgress
        showSkipButton
        steps={steps}
        run={isActive}
        styles={{
          options: {
            arrowColor: theme.palette.background.paper,
            backgroundColor: theme.palette.background.paper,
            overlayColor: 'rgba(0, 0, 0, 0.85)',
            primaryColor: '#6ed3ff',
            textColor: theme.palette.text.primary,
            zIndex: 10000,
          },
          tooltipContainer: {
            textAlign: 'left',
            padding: '20px',
          },
          buttonNext: {
            backgroundColor: '#6ed3ff',
            color: '#1a2126',
            padding: '12px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 'bold',
            border: 'none',
          },
          buttonBack: {
            color: '#6ed3ff',
            marginRight: 10,
          },
          buttonSkip: {
            color: 'rgba(255, 255, 255, 0.5)',
          },
        }}
      />
      {children}
    </GuidedTourContext.Provider>
  );
}; 