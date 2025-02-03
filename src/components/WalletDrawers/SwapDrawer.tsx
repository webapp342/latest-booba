import React from 'react';
import {
  Box,
  Typography,
  Drawer,
  styled,
  Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import TokenSwap from '../../pages/SwapComponent';

const StyledDrawer = styled(Drawer)(({  }) => ({
  '& .MuiDrawer-paper': {
    background: 'linear-gradient(180deg, rgba(26, 33, 38, 0.99) 0%, rgba(26, 33, 38, 0.95) 100%)',
    borderRadius: '24px 24px 0 0',
    padding: '24px',
    maxHeight: '85vh',
    height: 'auto',
    border: '1px solid rgba(110, 211, 255, 0.1)',
    overflow: 'visible',
  }
}));

const DrawerHeader = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '24px',
  
});

const DrawerContent = styled(Box)({
  height: '100%',
  
  overflow: 'auto',
  paddingBottom: 'calc(320px + env(safe-area-inset-bottom, 16px))',
  '&::-webkit-scrollbar': {
    display: 'none'
  },
  scrollbarWidth: 'none',
  msOverflowStyle: 'none'
});

interface SwapDrawerProps {
  open: boolean;
  onClose: () => void;
  defaultAmount?: number;
  onSwapComplete?: () => void;
}

const SwapDrawer: React.FC<SwapDrawerProps> = ({ open, onClose, defaultAmount, onSwapComplete }) => {
  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <StyledDrawer
      anchor="bottom"
      open={open}
      onClose={handleClose}
    >
      <DrawerHeader mx={-2}>
        <Button
          onClick={handleClose}
          sx={{
            color: 'rgba(255, 255, 255, 0.5)',
            minWidth: '40px',
            padding: '8px'
          }}
        >
          <CloseIcon fontSize="medium" sx={{color:''}} />
        </Button>
        <Typography 
          variant="h6" 
          sx={{ 
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            color: '#fff',
            opacity: 0.7
          }}
        >
          Swap Assets
        </Typography>
        <Box sx={{ width: 40 }} />
      </DrawerHeader>
      <DrawerContent m={-2}>
        <TokenSwap 
          key={defaultAmount} 
          defaultAmount={defaultAmount} 
          onClose={() => {
            if (onSwapComplete) {
              onSwapComplete();
            }
            handleClose();
          }} 
        />
      </DrawerContent>
    </StyledDrawer>
  );
};

export default SwapDrawer; 