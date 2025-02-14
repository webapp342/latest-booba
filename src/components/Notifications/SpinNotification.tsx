import { useState, useCallback, useEffect } from 'react';
import { Snackbar, Alert } from '@mui/material';
import { Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const NOTIFICATION_INTERVAL = 5 * 60 * 1000; // 5 minutes in milliseconds
const LAST_NOTIFICATION_KEY = 'lastSpinNotification';
const LAST_CLAIM_KEY = 'lastAdClaim';

const GlobalStyle = styled.div`
  @keyframes slideInDown {
    from {
      transform: translateY(-100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes fadeOut {
    from {
      transform: translateY(0);
      opacity: 1;
    }
    to {
      transform: translateY(-100%);
      opacity: 0;
    }
  }
`;

const SpinNotification = () => {
  const [showNotification, setShowNotification] = useState(false);
  const navigate = useNavigate();

  // Check if we should show notification
  const checkAndShowNotification = useCallback(() => {
    const lastClaim = localStorage.getItem(LAST_CLAIM_KEY);
    const lastNotification = localStorage.getItem(LAST_NOTIFICATION_KEY);
    const now = Date.now();

    // If there's no active cooldown
    if (!lastClaim) {
      // Show notification if no previous notification or interval has passed
      if (!lastNotification || (now - parseInt(lastNotification)) >= NOTIFICATION_INTERVAL) {
        setShowNotification(true);
        localStorage.setItem(LAST_NOTIFICATION_KEY, now.toString());
      }
    }
  }, []);

  // Initial notification check
  useEffect(() => {
    checkAndShowNotification();
  }, [checkAndShowNotification]);

  // Set up recurring notification check
  useEffect(() => {
    const notificationTimer = setInterval(() => {
      checkAndShowNotification();
    }, NOTIFICATION_INTERVAL);

    return () => clearInterval(notificationTimer);
  }, [checkAndShowNotification]);

  const handleNotificationClose = () => {
    setShowNotification(false);
  };

  const handleNotificationClick = () => {
    navigate('/slot');
    handleNotificationClose();
  };

  return (
    <>
      <GlobalStyle />
      <Snackbar
        open={showNotification}
        onClose={handleNotificationClose}
        sx={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '95%',
          maxWidth: '400px',
          zIndex: 9999,
        }}
      >
        <Alert
          severity="info"
          variant="filled"
          onClose={handleNotificationClose}
          icon={<Sparkles size={24} />}
          onClick={handleNotificationClick}
          sx={{
            width: '100%',
            backgroundColor: 'rgba(26, 33, 38, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(110, 211, 255, 0.1)',
            color: '#fff',
            borderRadius: '16px',
            padding: '16px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            animation: 'slideInDown 0.5s ease-out forwards, fadeOut 0.5s ease-in forwards 2.5s',
            '& .MuiAlert-icon': {
              color: '#6ed3ff',
              opacity: 1,
              padding: 0,
              marginRight: 1
            },
            '& .MuiAlert-message': {
              padding: 0,
              fontSize: '0.95rem',
              fontWeight: 500
            },
            '& .MuiAlert-action': {
              padding: 0,
              alignItems: 'center'
            },
            '&:hover': {
              backgroundColor: 'rgba(26, 33, 38, 0.98)',
              transform: 'scale(1.02)',
            }
          }}
        >
          Free Spin is Ready !!! 
        </Alert>
      </Snackbar>
    </>
  );
};

export default SpinNotification; 