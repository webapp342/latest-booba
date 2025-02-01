import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import { SupportModal } from './SupportModal';
import { AdminSupportPanel } from './AdminSupportPanel';
import WebApp from '@twa-dev/sdk';

const ADMIN_ID = '1421109983';
const DEFAULT_USER_ID = '7046348699';

export const SupportButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userId, setUserId] = useState<string>(DEFAULT_USER_ID);
  const [userName, setUserName] = useState<string>('');
  const isAdmin = userId === ADMIN_ID;

  useEffect(() => {
    // Get user info from TWA
    const initData = WebApp.initData || '';
    if (initData) {
      try {
        const user = WebApp.initDataUnsafe.user;
        if (user) {
          setUserId(user.id.toString());
          setUserName(user.username || `User ${user.id}`);
        }
      } catch (error) {
        console.error('Error parsing TWA init data:', error);
        // Keep using default user ID
        setUserName(`User ${DEFAULT_USER_ID}`);
      }
    } else {
      // Use default user ID when TWA data is not available
      setUserName(`User ${DEFAULT_USER_ID}`);
    }
  }, []);

  return (
    <>
      <Button
        variant="contained"
        color={isAdmin ? 'error' : 'primary'}
        onClick={() => setIsOpen(true)}
        sx={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
        }}
      >
        {isAdmin ? 'Support Admin Panel' : 'Technical Support'}
      </Button>

      {isAdmin ? (
        <AdminSupportPanel
          open={isOpen}
          onClose={() => setIsOpen(false)}
          adminId={userId}
        />
      ) : (
        <SupportModal
          open={isOpen}
          onClose={() => setIsOpen(false)}
          userId={userId}
          userName={userName}
        />
      )}
    </>
  );
}; 