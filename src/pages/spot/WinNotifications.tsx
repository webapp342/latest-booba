import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { keyframes } from '@emotion/react';
import boobaLogo from '../../assets/booba-logo.png';
import ticketLogo from '../../assets/ticket.png';
import tonLogo from '../../assets/ton_symbol.png';

// Animation keyframes
const slideDown = keyframes`
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const glow = keyframes`
  0% {
    box-shadow: 0 0 5px rgba(255,215,0,0.5);
    background: rgba(255,215,0,0.1);
  }
  50% {
    box-shadow: 0 0 20px rgba(255,215,0,0.3);
    background: rgba(255,215,0,0.2);
  }
  100% {
    box-shadow: 0 0 5px rgba(255,215,0,0.5);
    background: rgba(255,215,0,0.1);
  }
`;

interface WinNotification {
  id: number;
  spinToken: 'TON' | 'TICKET' | 'BBLIP'; // What user spins with
  winToken: 'TON' | 'BBLIP';             // What user wins
  amount: string;
  timestamp: Date;
  isNew?: boolean;
  walletAddress: string;
}

const WinNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<WinNotification[]>([]);

  // Generate random TON wallet address
  const generateWalletAddress = (): string => {
    const chars = '123456789ABCDEF'; // Characters for the random part
    let address = 'UQ'; // TON addresses start with UQ
    
    // Generate 2 more characters for first part (total 4 with UQ)
    for (let i = 0; i < 2; i++) {
      address += chars[Math.floor(Math.random() * chars.length)];
    }
    
    // Add *** and last character for total length of 7
    address += '***' + chars[Math.floor(Math.random() * chars.length)];
    
    return address; // Format: UQxx***x (total 7 chars)
  };

  // Format amount based on spin type and max limit
  const formatAmountBasedOnSpin = (spinToken: string, winToken: string): string => {
    let minAmount = 0;
    let maxAmount;
    
    // Set amount limits based on spin type
    switch (spinToken) {
      case 'TICKET':
        maxAmount = 99.99;
        // Set minimum amounts for TICKET spins
        if (winToken === 'TON') {
          minAmount = 28.99;
          // 25% chance for high TON win (500-999.99)
          if (Math.random() < 0.25) {
            minAmount = 500.00;
          }
        } else if (winToken === 'BBLIP') {
          minAmount = 165.99;
        }
        break;
      case 'TON':
        maxAmount = 99.99;
        break;
      case 'BBLIP':
        maxAmount = 9.99;
        break;
      default:
        maxAmount = 9.99;
    }

    // Generate random amount between min and max
    const amount = minAmount + (Math.random() * (maxAmount - minAmount));
    return amount.toFixed(2);
  };

  // Generate random notification with weighted spin types
  const generateRandomNotification = (isNew: boolean = false, customTimestamp?: Date): WinNotification => {
    // Weighted spin type selection (55% TICKET, 25% TON, 20% BBLIP)
    const random = Math.random() * 100;
    let spinToken: 'TON' | 'TICKET' | 'BBLIP';
    
    if (random < 55) {
      spinToken = 'TICKET';
    } else if (random < 80) { // 55 + 25 = 80
      spinToken = 'TON';
    } else {
      spinToken = 'BBLIP';
    }
    
    // Random win token (TON or BBLIP)
    const winTokens = ['TON', 'BBLIP'] as const;
    const winToken = winTokens[Math.floor(Math.random() * winTokens.length)];
    
    // Generate amount based on spin type
    const amount = formatAmountBasedOnSpin(spinToken, winToken);

    return {
      id: Date.now() + Math.random(),
      spinToken,
      winToken,
      amount,
      timestamp: customTimestamp || new Date(),
      isNew,
      walletAddress: generateWalletAddress()
    };
  };

  // Initialize with 10 notifications with realistic timestamps
  useEffect(() => {
    const tempNotifications: WinNotification[] = [];
    
    // Generate 10 notifications
    for (let i = 0; i < 10; i++) {
      // Create timestamps from newest to oldest
      const timestamp = new Date();
      timestamp.setSeconds(timestamp.getSeconds() - (i * Math.floor(Math.random() * 15 + 5))); // 5-20 seconds apart randomly
      
      // Generate initial notification
      let notification = generateRandomNotification(false, timestamp);
      
      // Check against previous notification if exists
      if (i > 0) {
        const prevNotification = tempNotifications[i - 1];
        // If same spin type as previous, regenerate until different
        let attempts = 0;
        while (prevNotification && notification.spinToken === prevNotification.spinToken && attempts < 3) {
          notification = generateRandomNotification(false, timestamp);
          attempts++;
        }
        
        // If same win amount range as previous, regenerate
        if (prevNotification && 
            notification.winToken === prevNotification.winToken && 
            Math.abs(parseFloat(notification.amount) - parseFloat(prevNotification.amount)) < 100) {
          notification = generateRandomNotification(false, timestamp);
        }
      }
      
      tempNotifications.push(notification);
    }
    
    // Ensure we don't have more than 2 high amounts (>500) in the initial set
    let highAmountCount = tempNotifications.filter(n => parseFloat(n.amount) > 100).length;
    if (highAmountCount > 2) {
      tempNotifications.forEach((notif, idx) => {
        if (parseFloat(notif.amount) > 500 && highAmountCount > 2) {
          tempNotifications[idx] = generateRandomNotification(false, notif.timestamp);
          highAmountCount--;
        }
      });
    }
    
    // Sort and set notifications
    setNotifications(tempNotifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));
  }, []);

  // Add new notification with random interval
  useEffect(() => {
    const scheduleNextNotification = () => {
      // Random interval between 1 and 60 seconds
      const randomInterval = Math.floor(Math.random() * 60000) + 1000;
      
      const timeoutId = setTimeout(() => {
        const newNotification = generateRandomNotification(true);
        setNotifications(prev => {
          const updated = [newNotification, ...prev.slice(0, 9)];
          return updated.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()); // Sort newest first
        });
        
        // Remove isNew flag after animation
        setTimeout(() => {
          setNotifications(current =>
            current.map(notif => ({
              ...notif,
              isNew: false
            }))
          );
        }, 1000);
        
        // Schedule next notification
        scheduleNextNotification();
      }, randomInterval);

      return timeoutId;
    };

    const timeoutId = scheduleNextNotification();
    return () => clearTimeout(timeoutId);
  }, []);

  // Format time ago
  const getTimeAgo = (timestamp: Date) => {
    const seconds = Math.floor((new Date().getTime() - timestamp.getTime()) / 1000);
    
    if (seconds < 60) {
      return `${seconds}s ago`;
    }
    
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ago`;
  };

  // Get token logo URL
  const getTokenLogo = (token: string) => {
    switch (token) {
      case 'TON':
        return tonLogo;
      case 'TICKET':
        return ticketLogo;
      case 'BBLIP':
        return boobaLogo;
      default:
        return "";
    }
  };

  return (
    <Box
      sx={{
        mt: 2,
        p: 2,
        backgroundColor: 'rgba(26,31,46,0.9)',
        borderRadius: 2,
        maxHeight: '300px',
        overflowY: 'auto',
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'rgba(0,0,0,0.1)',
          borderRadius: '3px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'rgba(255,215,0,0.3)',
          borderRadius: '3px',
        },
      }}
    >
      <Typography
        sx={{
          color: '#FFD700',
          fontSize: '0.9rem',
          fontWeight: 'bold',
          mb: 1,
          textAlign: 'center',
        }}
      >
        Recent Wins
      </Typography>

      {notifications.map((notification) => (
        <Box
          key={notification.id}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            py: 1,
            px: 1,
            borderRadius: '8px',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            animation: notification.isNew ? `${slideDown} 0.5s ease-out, ${glow} 2s ease-in-out` : 'none',
            transition: 'all 0.3s ease',
            '&:last-child': {
              borderBottom: 'none',
            },
            ...(notification.isNew && {
              backgroundColor: 'rgba(255,215,0,0.1)',
              boxShadow: '0 0 10px rgba(255,215,0,0.3)',
            }),
          }}
        >
          <Typography
            sx={{
              color: 'rgba(255,255,255,0.7)',
              fontSize: '0.75rem',
              fontFamily: 'monospace',
              mr: 1,
            }}
          >
            {notification.walletAddress}
          </Typography>
          <Box
            sx={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              filter: notification.isNew ? 'brightness(1.2)' : 'none',
              transition: 'all 0.3s ease',
            }}
          >
            <img
              src={getTokenLogo(notification.spinToken)}
              alt={notification.spinToken}
              style={{ 
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </Box>
          <ArrowRightAltIcon sx={{ 
            color: notification.isNew ? 'rgba(255,215,0,0.8)' : 'rgba(255,255,255,0.5)', 
            fontSize: '1rem',
            transition: 'color 0.3s ease',
          }} />
          <Box
            sx={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              filter: notification.isNew ? 'brightness(1.2)' : 'none',
              transition: 'all 0.3s ease',
            }}
          >
            <img
              src={getTokenLogo(notification.winToken)}
              alt={notification.winToken}
              style={{ 
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </Box>
          <Typography
            sx={{
              color: notification.isNew ? '#FFD700' : '#4CAF50',
              fontSize: '0.8rem',
              fontWeight: 'bold',
              flex: 1,
              transition: 'color 0.3s ease',
            }}
          >
            +{notification.amount} {notification.winToken}
          </Typography>
          <Typography
            sx={{
              color: notification.isNew ? 'rgba(255,215,0,0.8)' : 'rgba(255,255,255,0.5)',
              fontSize: '0.75rem',
              transition: 'color 0.3s ease',
            }}
          >
            {getTimeAgo(notification.timestamp)}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default WinNotifications; 