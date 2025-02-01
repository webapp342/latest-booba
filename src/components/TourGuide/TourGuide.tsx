import React, { useState, useEffect } from 'react';
import Joyride, { CallBackProps, Step, STATUS } from 'react-joyride';
import { useTheme } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import {  useLocation } from 'react-router-dom';

interface TourGuideProps {
  isOpen: boolean;
  onComplete: () => void;
}

const tourSteps: Step[] = [
   
  {
    target: 'body',
    content: (
      <Box sx={{ p: 1 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>Welcome to Booba Blip! 🚀</Typography>
        <Typography>Let's explore the main navigation features of our platform together.</Typography>
      </Box>
    ),
    placement: 'center',
    disableBeacon: true,
  },
   {
    target: '[data-tour="play-nav"]',
    content: (
      <Box sx={{ p: 1, maxWidth: 280 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>1. Play 🎮</Typography>
        <Typography>Explore exciting games and entertainment options while earning rewards.</Typography>
      </Box>
    ),
    disableBeacon: true,
    spotlightClicks: true,
    placement: 'top',
    spotlightPadding: 0,
    floaterProps: {
      offset: 0
    }
  },
  {
    target: '[data-tour="stats-nav"]',
    content: (
      <Box sx={{ p: 1, maxWidth: 280 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>2. Stats 📊</Typography>
        <Typography>View platform statistics, including total locked TON, earnings distributed, and performance metrics.</Typography>
      </Box>
    ),
    disableBeacon: true,
    spotlightClicks: true,
    placement: 'top',
    spotlightPadding: 0,
    floaterProps: {
      offset: 0
    }
  },
  {
    target: '[data-tour="earn-nav"]',
    content: (
      <Box sx={{ p: 1, maxWidth: 280 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>3. Earn 💰</Typography>
        <Typography>Access staking options and investment opportunities to earn passive income with your tokens.</Typography>
      </Box>
    ),
    disableBeacon: true,
    spotlightClicks: true,
    placement: 'top-end',
    spotlightPadding: 0,
    floaterProps: {
      offset: 0
    }
  },
  {
    target: '[data-tour="tasks-nav"]',
    content: (
      <Box sx={{ p: 1, maxWidth: 280 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>4. Tasks 🎯</Typography>
        <Typography>Complete daily missions and tasks to earn additional rewards and bonuses.</Typography>
      </Box>
    ),
    disableBeacon: true,
    spotlightClicks: true,
    placement: 'top-end',
    spotlightPadding: 0,
    floaterProps: {
      offset: 0
    }
  },
  {
    target: '[data-tour="wallet-nav"]',
    content: (
      <Box sx={{ p: 1, maxWidth: 260 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>5. Wallet 💼</Typography>
        <Typography>Manage your assets, make deposits, and track your balances.</Typography>
      </Box>
    ),
    disableBeacon: true,
    spotlightClicks: true,
    placement: 'top-end',
    spotlightPadding: 0,
    floaterProps: {
      offset: 50
    }
  }

];

const TourGuide: React.FC<TourGuideProps> = ({ isOpen, onComplete }) => {
  const theme = useTheme();
  const location = useLocation();
  const [run, setRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (isOpen && location.pathname === '/latest-booba/') {
      setRun(true);
      setStepIndex(0);
    } else {
      setRun(false);
    }
  }, [isOpen, location.pathname]);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, index, type } = data;

    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      setRun(false);
      onComplete();
      return;
    }

    if (type === 'step:after') {
      setStepIndex(index + 1);
    }
  };

  // Only render if we're on the correct route
  if (location.pathname !== '/latest-booba/') {
    return null;
  }

  return (
    <Joyride
      callback={handleJoyrideCallback}
      continuous
      hideCloseButton
      run={run}
      scrollToFirstStep
      showProgress
      showSkipButton
      stepIndex={stepIndex}
      steps={tourSteps}
      disableScrollParentFix={true}
      spotlightPadding={4}
      styles={{
        options: {
          arrowColor: theme.palette.background.paper,
          backgroundColor: theme.palette.background.paper,
          overlayColor: 'rgba(0, 0, 0, 0.5)',
          primaryColor: '#6ed3ff',
          textColor: theme.palette.text.primary,
          zIndex: 10000
        },
        tooltipContainer: {
          textAlign: 'left'
        },
        buttonNext: {
          backgroundColor: '#6ed3ff',
          color: '#000'
        },
        buttonBack: {
          color: '#6ed3ff',
          marginRight: 10
        },
        buttonSkip: {
          color: '#6ed3ff'
        }
      }}
    />
  );
};

export default TourGuide; 