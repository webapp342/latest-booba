import React from 'react';
import {
  Box,
  Typography,
  Drawer,
  styled,
  Button,
} from '@mui/material';
import TokenSwap from '../../pages/SwapComponent';

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    background: 'linear-gradient(180deg, rgba(26, 33, 38, 0.99) 0%, rgba(26, 33, 38, 0.95) 100%)',
    borderRadius: '24px 24px 0 0',
    padding: '24px',
    height: '80vh',
    border: '1px solid rgba(110, 211, 255, 0.1)',
  }
}));

const DrawerHeader = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '24px',
});

interface SwapDrawerProps {
  open: boolean;
  onClose: () => void;
}

const SwapDrawer: React.FC<SwapDrawerProps> = ({ open, onClose }) => {
  return (
    <StyledDrawer
      anchor="bottom"
      open={open}
      onClose={onClose}
    >
      <DrawerHeader>
        <Button
          onClick={onClose}
          sx={{
            color: 'rgba(255, 255, 255, 0.5)',
            '&:hover': { color: '#fff' }
          }}
        >
          ✖
        </Button>
        <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>
          Swap Assets
        </Typography>
        <Box sx={{ width: 40 }} /> {/* Spacing için boş box */}
      </DrawerHeader>
      <TokenSwap />
    </StyledDrawer>
  );
};

export default SwapDrawer; 