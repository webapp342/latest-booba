import React from 'react';
import {
  Box,
  Typography,
  Drawer,
  styled,
  Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { AccessTime } from '@mui/icons-material';

const StyledDrawer = styled(Drawer)(({ }) => ({
  '& .MuiDrawer-paper': {
    background: 'linear-gradient(180deg, rgba(26, 33, 38, 0.99) 0%, rgba(26, 33, 38, 0.95) 100%)',
    borderRadius: '24px 24px 0 0',
    padding: '24px',
    maxHeight: '100vh',
    minHeight: '60vh',
    border: '1px solid rgba(110, 211, 255, 0.1)',
  }
}));

const DrawerHeader = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '24px',
});

interface ComingSoonDrawerProps {
  open: boolean;
  onClose: () => void;
}

const ComingSoonDrawer: React.FC<ComingSoonDrawerProps> = ({ open, onClose }) => {
  return (
    <StyledDrawer
      anchor="bottom"
      open={open}
      onClose={onClose}
    >
      <DrawerHeader mx={-2}>
        <Button
          onClick={onClose}
          sx={{
            color: 'rgba(255, 255, 255, 0.5)',
            '&:hover': { color: '#fff' },
            minWidth: '40px',
            padding: '8px'
          }}
        >
          <CloseIcon fontSize="medium" />
        </Button>
        <Typography 
          variant="h6" 
          sx={{ 
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            color: '#fff',
            opacity: 0.7,
            textAlign: 'center',
            whiteSpace: 'nowrap'
          }}
        >
          Withdraw
        </Typography>
        <Box sx={{ width: 40 }} />
      </DrawerHeader>

      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        height: '50vh',
        gap: 2
      }}>
        <AccessTime sx={{ fontSize: 64, color: '#6ed3ff' }} />
        <Typography variant="h5" sx={{ color: '#fff', textAlign: 'center' }}>
          Coming Soon
        </Typography>
        <Typography sx={{ color: 'rgba(255, 255, 255, 0.6)', textAlign: 'center' }}>
          Withdraw functionality will be available soon. Stay tuned!
        </Typography>
      </Box>
    </StyledDrawer>
  );
};

export default ComingSoonDrawer; 