import React, { useState, useEffect } from 'react';
import { Button, Tabs, Tab, AppBar, Typography, Box, IconButton } from '@mui/material';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import boobaLogo from '../../assets/booba-logo.png';
import ticketLogo from '../../assets/ticket.png';
import tonLogo from '../../assets/ton_symbol.png';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Task } from '../TaskAdsPage';

const theme = createTheme({
  typography: {
    fontFamily: "monospace",
  },
});

// Format amount function
const formatAmount = (amount: number) => {
  const paddedAmount = amount.toString().padStart(6, '0');
  const integerPart = paddedAmount.slice(0, 3);
  const decimalPart = paddedAmount.slice(3);
  return `${parseInt(integerPart, 10)}.${decimalPart}`;
};

interface SpinAmounts {
  total: number;
  bblip: number;
  ticket: number;
}

interface SpinAndDepositButtonsProps {
  total: number;
  tickets: number;
  bblip: number;
  selectedSpinType: string;
  handleSpin: (amount: number) => void;
  openDepositDrawer: () => void;
  handleSpinTypeChange: (event: React.ChangeEvent<{}>, value: string) => void;
  isSpinning: boolean;
  showTopUpButton: boolean;
  openSwapDrawer?: () => void;
  navigateToTasks?: () => void;
}

const SpinAndDepositButtons: React.FC<SpinAndDepositButtonsProps> = ({
  total,
  tickets,
  bblip,
  selectedSpinType,
  handleSpin,
  openDepositDrawer,
  handleSpinTypeChange,
  isSpinning,
  showTopUpButton,
  openSwapDrawer,
}): React.ReactElement => {
  const [prevTotal, setPrevTotal] = useState<number>(total);
  const [prevTickets, setPrevTickets] = useState<number>(tickets);
  const [prevBblip, setPrevBblip] = useState<number>(bblip);
  const [amountStyle, setAmountStyle] = useState<Record<string, string>>({});
  const [spinAmount, setSpinAmount] = useState<SpinAmounts>({
    total: 200, // 0.2 TON in total
    bblip: 25000, // 25 BBLIP
    ticket: 1
  });

  // Balance change effects
  useEffect(() => {
    if (total > prevTotal) {
      setAmountStyle({ color: '#4CAF50' });
      setTimeout(() => setAmountStyle({}), 500);
    } else if (total < prevTotal) {
      setAmountStyle({ color: '#FF6B6B' });
      setTimeout(() => setAmountStyle({}), 500);
    }
    setPrevTotal(total);
  }, [total, prevTotal]);

  useEffect(() => {
    if (tickets > prevTickets) {
      setAmountStyle({ color: '#4CAF50' });
      setTimeout(() => setAmountStyle({}), 500);
    } else if (tickets < prevTickets) {
      setAmountStyle({ color: '#FF6B6B' });
      setTimeout(() => setAmountStyle({}), 500);
    }
    setPrevTickets(tickets);
  }, [tickets, prevTickets]);

  useEffect(() => {
    if (bblip > prevBblip) {
      setAmountStyle({ color: '#4CAF50' });
      setTimeout(() => setAmountStyle({}), 500);
    } else if (bblip < prevBblip) {
      setAmountStyle({ color: '#FF6B6B' });
      setTimeout(() => setAmountStyle({}), 500);
    }
    setPrevBblip(bblip);
  }, [bblip, prevBblip]);

  const handleSpinClick = () => {
    const amount = selectedSpinType === 'total' ? spinAmount.total :
                  selectedSpinType === 'bblip' ? spinAmount.bblip :
                  1; // for tickets
    handleSpin(amount);
  };

  // Format available amount text
  const getAvailableAmount = () => {
    switch (selectedSpinType) {
      case 'total':
        return `Balance: ${formatAmount(total)} TON`;
      case 'ticket':
        return `Balance: ${tickets} Tickets`;
      case 'bblip':
        return `Balance: ${formatAmount(bblip)} BBLIP`;
      default:
        return '';
    }
  };

  // Get current spin amount display
  const getCurrentSpinAmount = () => {
    switch (selectedSpinType) {
      case 'total':
        return (spinAmount.total / 1000).toFixed(1);
      case 'bblip':
        return Math.floor(spinAmount.bblip / 1000).toString();
      default:
        return '1';
    }
  };

  // Get minimum required amount text
  const getMinimumRequired = () => {
    switch (selectedSpinType) {
      case 'total':
        return '0.2 TON';
      case 'ticket':
        return '1 Ticket';
      case 'bblip':
        return '25 BBLIP';
      default:
        return '';
    }
  };

  // Get maximum allowed amount based on selected type
  const getMaxAmount = () => {
    switch (selectedSpinType) {
      case 'total':
        return total; // Full balance in total
      case 'ticket':
        return tickets;
      case 'bblip':
        return bblip; // Full balance in bblip
      default:
        return 0;
    }
  };

  // Handle increment and decrement
  const handleIncrement = () => {
    const maxAmount = getMaxAmount();
    
    switch (selectedSpinType) {
      case 'total':
        const nextTotalAmount = spinAmount.total + 100; // +0.1 TON
        if (nextTotalAmount <= maxAmount) {
          setSpinAmount(prev => ({ ...prev, total: nextTotalAmount }));
        }
        break;
      case 'bblip':
        const nextBblipAmount = spinAmount.bblip + (5 * 1000); // +5 BBLIP
        if (nextBblipAmount <= maxAmount) {
          setSpinAmount(prev => ({ ...prev, bblip: nextBblipAmount }));
        }
        break;
    }
  };

  const handleDecrement = () => {
    switch (selectedSpinType) {
      case 'total':
        if (spinAmount.total > 200) { // Min 0.2 TON
          setSpinAmount(prev => ({ ...prev, total: prev.total - 100 })); // -0.1 TON
        }
        break;
      case 'bblip':
        if (spinAmount.bblip > 25000) { // Min 25 BBLIP
          setSpinAmount(prev => ({ ...prev, bblip: prev.bblip - (5 * 1000) })); // -5 BBLIP
        }
        break;
    }
  };

  // Check if amount controls should be shown
  const shouldShowAmountControls = () => {
    return !showTopUpButton && selectedSpinType !== 'ticket';
  };

  return (
    <ThemeProvider theme={theme}>
      <Box //@ts-ignore
        sx={{
          margin: '0',
          borderRadius: 2,
          textAlign: 'center',
        }}
      >
        <AppBar 
          position="static" 
          sx={{
            backgroundColor: 'rgba(26,31,46,0.9)',
            borderRadius: 2,
            boxShadow: 'none',
          }}
        >
          <Tabs
            value={selectedSpinType}
            onChange={handleSpinTypeChange}
            variant="fullWidth"
            sx={{
              minHeight: '50px',
              '& .MuiTabs-indicator': {
                backgroundColor: '#FFD700',
                height: '2px',
              },
              '& .MuiTabs-flexContainer': {
                gap: '4px',
                padding: '4px',
              },
              '& .MuiTab-root': {
                minHeight: '50px',
                borderRadius: '8px',
                color: 'rgba(255, 255, 255, 0.7)',
                transition: 'all 0.2s ease',
                '&.Mui-selected': {
                  color: '#FFD700',
                  background: 'rgba(13,15,23,0.8)',
                },
              },
            }}
          >
            <Tab
              value="ticket"
              icon={
                <img
                  src={ticketLogo}
                  alt="Ticket"
                  style={{ width: '24px', height: '24px' }}
                />
              }
            />
            <Tab
              value="total"
              icon={
                <img
                  src={tonLogo}
                  alt="TON"
                  style={{ width: '24px', height: '24px' }}
                />
              }
            />
            <Tab
              value="bblip"
              icon={
                <img
                  src={boobaLogo}
                  alt="BBLIP"
                  style={{ width: '24px', height: '24px', borderRadius: '50%' }}
                />
              }
            />
          </Tabs>
        </AppBar>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2,
            mt: 1.5,
            mb: 1.5,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: showTopUpButton ? '#FF6B6B' : 'white',
              fontSize: '0.8rem',
              fontWeight: 500,
              ...(!showTopUpButton && amountStyle),
              transition: 'color 0.3s ease',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {showTopUpButton ? (
              <>
                <Box
                  sx={{ 
                    width: '4px',
                    height: '4px',
                    backgroundColor: '#FF6B6B',
                    borderRadius: '50%',
                    mr: 1,
                  }}
                />
                You need at least {getMinimumRequired()} to spin
              </>
            ) : (
              getAvailableAmount()
            )}
          </Typography>

          {shouldShowAmountControls() && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton
                size="small"
                onClick={handleDecrement}
                disabled={
                  (selectedSpinType === 'total' && spinAmount.total <= 200) ||
                  (selectedSpinType === 'bblip' && spinAmount.bblip <= 25000) ||
                  isSpinning
                }
                sx={{
                  color: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' },
                  '&.Mui-disabled': { color: 'rgba(255,255,255,0.3)' },
                }}
              >
                <RemoveIcon fontSize="small" />
              </IconButton>
              <Typography
                sx={{
                  color: 'white',
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                  minWidth: '45px',
                  textAlign: 'center',
                }}
              >
                {getCurrentSpinAmount()}
              </Typography>
              <IconButton
                size="small"
                onClick={handleIncrement}
                disabled={
                  (selectedSpinType === 'total' && spinAmount.total + 100 > total) ||
                  (selectedSpinType === 'bblip' && spinAmount.bblip + (5 * 1000) > bblip) ||
                  isSpinning
                }
                sx={{
                  color: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' },
                  '&.Mui-disabled': { color: 'rgba(255,255,255,0.3)' },
                }}
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
        </Box>

        {showTopUpButton ? (
          <Box>
            {selectedSpinType === 'bblip' ? (
                <Task 
                        blockId="task-8197"
                        debug={false}
                      />
            ) : (
              <Button
                onClick={() => {
                  switch (selectedSpinType) {
                    case 'ticket':
                      if (openSwapDrawer) { 
                        openSwapDrawer();
                      }
                      break;
                    default:
                      openDepositDrawer();
                  }
                }}
                variant="contained"
                sx={{
                  width: '100%',
                  py: 1.5,
                  backgroundColor: 'rgba(110, 211, 255, 0.1)',
                  color: '#6ed3ff',
                  border: '1px solid rgba(110, 211, 255, 0.2)',
                  '&:hover': {
                    backgroundColor: 'rgba(110, 211, 255, 0.2)',
                    border: '1px solid rgba(110, 211, 255, 0.3)',
                  },
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  transition: 'all 0.2s ease'
                }}
              >
                {selectedSpinType === 'ticket' ? 'Get Tickets' : 'Deposit TON'}
              </Button>
            )}
          </Box>
        ) : (
          <Button
            onClick={handleSpinClick}
            disabled={isSpinning}
            variant="contained"
            sx={{
              width: '100%',
              py: 1.5,
              background: isSpinning 
                ? 'rgba(102,102,102,0.9)'
                : 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
              color: isSpinning ? '#999999' : '#000000',
              fontSize: '1rem',
              fontWeight: 'bold',
              borderRadius: '8px',
              textTransform: 'none',
              opacity: isSpinning ? 0.7 : 1,
              '&:disabled': {
                background: 'rgba(102,102,102,0.9)',
                color: '#999999',
                opacity: 0.7,
              },
            }}
          >
            {isSpinning ? (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTop: '2px solid #ffffff',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    '@keyframes spin': {
                      '0%': { transform: 'rotate(0deg)' },
                      '100%': { transform: 'rotate(360deg)' },
                    },
                  }}
                />
                Spinning...
              </Box>
            ) : (
              'Spin Now'
            )}
          </Button>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default SpinAndDepositButtons;
