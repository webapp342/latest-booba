import React, { useState, useEffect } from 'react';
import { Button, Tabs, Tab, AppBar, Typography, Box } from '@mui/material';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import boobaLogo from '../../assets/booba-logo.png';
import ticketLogo from '../../assets/ticket.png';
import tonLogo from '../../assets/ton_symbol.png';

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

interface SpinAndDepositButtonsProps {
  total: number;
  tickets: number;
  bblip: number;
  selectedSpinType: string;
  handleSpin: () => void;
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
  navigateToTasks
}) => {
  const [prevTotal, setPrevTotal] = useState(total);
  const [prevTickets, setPrevTickets] = useState(tickets);
  const [prevBblip, setPrevBblip] = useState(bblip);
  const [amountStyle, setAmountStyle] = useState({});

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
    handleSpin();
  };

  // Format available amount text
  const getAvailableAmount = () => {
    switch (selectedSpinType) {
      case 'total':
        return `Available: ${formatAmount(total)} TON`;
      case 'ticket':
        return `Available: ${tickets} Tickets`;
      case 'bblip':
        return `Available: ${formatAmount(bblip)} BBLIP`;
      default:
        return '';
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
        return '5 BBLIP';
      default:
        return '';
    }
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

        <Typography
          variant="body2"
          sx={{
            color: showTopUpButton ? '#FF6B6B' : 'white',
            fontSize: '0.8rem',
            mt: 1.5,
            mb: 1.5,
            fontWeight: 500,
            ...(!showTopUpButton && amountStyle),
            transition: 'color 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
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

        {showTopUpButton ? (
          <Button
            onClick={() => {
              switch (selectedSpinType) {
                case 'ticket':
                  if (openSwapDrawer) { 
                    openSwapDrawer();
                  }
                  break;
                case 'bblip':
                  if (navigateToTasks) {
                    navigateToTasks();
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
              background: selectedSpinType === 'total' 
                ? 'linear-gradient(135deg, #FF4B4B 0%, #FF0000 100%)'
                : selectedSpinType === 'bblip'
                ? 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)'
                : 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
              color: '#ffffff',
              fontSize: '1rem',
              fontWeight: 'bold',
              borderRadius: '8px',
              textTransform: 'none',
            }}
          >
            {selectedSpinType === 'ticket' 
              ? 'Buy Ticket'
              : selectedSpinType === 'bblip'
              ? 'Earn BBLIP'
              : 'Deposit TON'}
          </Button>
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
