import {  Avatar,Drawer, Box, Typography, IconButton, useTheme, alpha } from '@mui/material';
import { X as CloseIcon, Bell, BellOff } from 'lucide-react';

import { format } from 'date-fns';
import bblipLogo from '../assets/logo5.jpg';
import tonLogo from '../assets/kucukTON.png';
import WebApp from '@twa-dev/sdk';
import { useEffect } from 'react';
import {  useNavigate } from 'react-router-dom';

interface Notification {
  id: string;
  timestamp: string;
  amount: number;
  balanceType: string;
}

interface NotificationDrawerProps {
  open: boolean;
  onClose: () => void;
  notifications: Notification[];
}

export default function NotificationDrawer({ open, onClose, notifications }: NotificationDrawerProps) {
  const theme = useTheme();
     const navigate = useNavigate();

  useEffect(() => {
        const backButton = WebApp.BackButton;
    
        // BackButton'u görünür yap ve tıklanma işlevi ekle
        backButton.show();
        backButton.onClick(() => {
          navigate("/latest-booba/spin");
        });
    
        // Cleanup: Bileşen unmount olduğunda butonu gizle ve event handler'ı kaldır
        return () => {
          backButton.hide();
          backButton.offClick(() => {
            navigate("/latest-booba/spin"); // Buraya tekrar aynı callback sağlanmalıdır.
          });
        };
      }, [navigate]);
  

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: '100%',
          maxWidth: { xs: '100%', sm: 360 },
          background: theme.palette.background.paper,
          borderLeft: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }
      }}
    >
      <Box sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <Box sx={{
          p: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Bell size={20} />
            <Typography variant="h6">
              Notifications
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon size={20} />
          </IconButton>
        </Box>

        {/* Notification List */}
        <Box sx={{ 
          flex: 1,
          overflowY: 'auto',
          p: 1.5,
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5
        }}>
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <Box 
                key={notification.id} 
                sx={{ 
                  p: 1, 
                
                  backgroundColor: notification.balanceType === 'BBLIP' 
                    ? alpha(theme.palette.success.main, 0.9) 
                    : alpha(theme.palette.primary.light, 0.1),
                  borderRadius: 1
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography 
                    variant="subtitle2" 
                    sx={{ 
                      color: theme.palette.primary.main,
                      fontWeight: 600 
                    }}
                  >
                    {notification.balanceType === 'bblip' ? 'BBLIP' : 'TON'} Balance Update
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: alpha(theme.palette.text.primary, 0.6)
                    }}
                  >
                    {format(new Date(notification.timestamp), 'MMM dd, HH:mm')}
                  </Typography>
                </Box>
                <Box display={'flex'} alignItems={'center'}>
                    
                <Typography variant="body2">
                  You received  
                </Typography>
                    <Avatar 
        alt={notification.balanceType}
            src={notification.balanceType === 'bblip' ? bblipLogo : tonLogo}
        sx={{ ml: 1, width: notification.balanceType === 'bblip' ? '7vw' : '6vw',
              height: notification.balanceType === 'bblip' ? 'auto' : 'auto', }}
      />
                <Typography fontSize={'1rem'} sx={{ml: 1,}}>
<strong>{notification.amount.toFixed(2)} </strong>
                </Typography>
                    
                 
                </Box>
              
              </Box>
            ))
          ) : (
            <Box sx={{ 
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
              color: alpha(theme.palette.text.primary, 0.5)
            }}>
              <BellOff size={40} />
              <Typography>No notifications yet</Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Drawer>
  );
}