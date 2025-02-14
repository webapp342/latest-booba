import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Sparkles } from 'lucide-react';

const NOTIFICATION_INTERVAL = 5 * 60 * 1000; // 5 minutes in milliseconds
const LAST_NOTIFICATION_KEY = 'lastSpinNotification';
const LAST_CLAIM_KEY = 'lastAdClaim';

const SpinNotification = () => {
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
        showSpinNotification();
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

  const showSpinNotification = () => {
    toast(
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Sparkles size={24} color="#6ed3ff" />
        <span>Free Spin is Ready !!!</span>
      </div>,
      {
        position: "bottom-left",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        onClick: () => navigate('/slot'),
        style: {
          background: 'rgba(26, 33, 38, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(110, 211, 255, 0.1)',
          color: '#fff',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
          fontSize: '0.95rem',
          fontWeight: 500
        },
        theme: "dark"
      }
    );
  };

  return <ToastContainer transition={Slide} closeButton={false} />;
};

export default SpinNotification; 