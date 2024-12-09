import React from 'react';
import { Drawer, Button } from '@mui/material';

interface DepositDrawerProps {
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  setSnackbarOpen: (open: boolean) => void;
}

const DepositDrawer: React.FC<DepositDrawerProps> = ({ drawerOpen, setDrawerOpen, setSnackbarOpen }) => (
  <Drawer anchor="bottom" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
    <div style={{ padding: '20px' }}>
      <h2>Deposit Information</h2>
      <p>
        Account Number: 123456789{' '}
        <Button
          onClick={() => {
            navigator.clipboard.writeText('123456789');
            setSnackbarOpen(true);
          }}
        >
          Copy
        </Button>
      </p>
      <p>
        Deposit Amount: 00.500{' '}
        <Button
          onClick={() => {
            navigator.clipboard.writeText('00.500');
            setSnackbarOpen(true);
          }}
        >
          Copy
        </Button>
      </p>
    </div>
  </Drawer>
);

export default DepositDrawer;
