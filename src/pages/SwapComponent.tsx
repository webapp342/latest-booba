import React, { useState, useEffect } from "react";
import {
  Typography,
  SwipeableDrawer,
  ListItem,
  IconButton,
  Box,
  Avatar,
  Grid,
  Button,
  styled,
  Slide,
  Paper,
  Snackbar,
} from "@mui/material";
import SwapVertRoundedIcon from '@mui/icons-material/SwapVertRounded';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import axios from "axios";
import logo5 from '../assets/logo5.png';
import { doc, onSnapshot, getFirestore, updateDoc } from "firebase/firestore";
import { initializeApp } from 'firebase/app';

import CloseIcon from '@mui/icons-material/Close';
import { CheckCircleOutline } from '@mui/icons-material';
import { TransitionProps } from '@mui/material/transitions';
import { firebaseConfig } from "./firebaseConfig";
import BackspaceIcon from '@mui/icons-material/Backspace';
import WithTourSection from '../components/TourGuide/withTourSection';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const TICKET_TON_RATE = 2.5;

// Type definitions
type TokenType = "TON" | "USDT" | "TICKET" | "BBLIP";

interface TokenInfo {
  name: TokenType;
  icon: string;
}

// Styled Components
const TokenBox = styled(Box)({
  backgroundColor: 'rgba(18, 22, 25, 0.5)',
  backdropFilter: 'blur(10px)',
  borderRadius: '16px',
  padding: '12px',
  
  marginBottom: '4px',
  border: '1px solid rgba(110, 211, 255, 0.1)',
});


const TokenSelectButton = styled(Button)({
  color: 'white',
  padding: '6px 12px',
  borderRadius: '20px',
  backgroundColor: 'rgba(110, 211, 255, 0.1)',
  textTransform: 'none',
  minWidth: 'auto',
  '&:hover': {
    backgroundColor: 'rgba(110, 211, 255, 0.2)',
  },
});

const MaxButton = styled(Button)({
  color: '#6ed3ff',
  fontSize: '12px',
  padding: '2px 8px',
  minWidth: 'auto',
  borderRadius: '4px',
  backgroundColor: 'rgba(110, 211, 255, 0.1)',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: 'rgba(110, 211, 255, 0.2)',
  },
});

const SwapIconButton = styled(IconButton)({
  position: 'relative',
  backgroundColor: 'rgba(18, 22, 25, 0.95)',
  padding: '6px',
  width: '28px',
  height: '28px',
  color: '#6ed3ff',
  border: '1px solid rgba(110, 211, 255, 0.2)',
  boxShadow: '0 0 10px rgba(110, 211, 255, 0.1)',
  transform: 'translateY(50%)',
  zIndex: 2,
  '&:hover': {
    backgroundColor: 'rgba(110, 211, 255, 0.1)',
    border: '1px solid rgba(110, 211, 255, 0.3)',
    boxShadow: '0 0 15px rgba(110, 211, 255, 0.2)',
  },
  '&:active': {
    transform: 'translateY(50%) scale(0.95)',
  },
  transition: 'all 0.2s ease',
});

const SwapButton = styled(Button)({
  backgroundColor: '#6ed3ff',
  color: '#1a2126',
  borderRadius: '12px',
  padding: '16px',
  fontSize: '16px',
  fontWeight: 'bold',
  textTransform: 'none',
  marginTop: '16px',
  '&:hover': {
    backgroundColor: '#89d9ff',
  },
  '&:disabled': {
    backgroundColor: 'rgba(110, 211, 255, 0.3)',
    color: 'rgba(255, 255, 255, 0.3)',
  },
});

const TokenListDrawer = styled(SwipeableDrawer)({
  '& .MuiDrawer-paper': {
    background: 'linear-gradient(180deg, rgba(26, 33, 38, 0.99) 0%, rgba(26, 33, 38, 0.95) 100%)',
    borderRadius: '24px 24px 0 0',
    padding: '24px',
    maxHeight: '80vh',
  },
});

const TokenListItem = styled(ListItem)({
  borderRadius: '16px',
  margin: '4px 0',
  padding: '12px 16px',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: 'rgba(110, 211, 255, 0.1)',
  },
});

const CustomAlert = styled(Paper)({
  backgroundColor: 'rgba(46, 125, 50, 0.1)',
  color: '#81c784',
  borderRadius: '12px',
  padding: '12px 16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '12px',
  border: '1px solid rgba(129, 199, 132, 0.2)',
  backdropFilter: 'blur(10px)',
  minWidth: '300px',
  maxWidth: '90vw',
  '& .MuiSvgIcon-root': {
    cursor: 'pointer',
    fontSize: '20px',
    opacity: 0.8,
    '&:hover': {
      opacity: 1,
    },
  },
});

const SlideTransition = React.forwardRef((
  props: TransitionProps & {
    children: React.ReactElement<any>;
  },
  ref: React.Ref<unknown>
) => {
  return (
    <Slide direction="left" ref={ref} {...props}>
      {props.children}
    </Slide>
  );
});

const KeyboardContainer = styled(Box)({
  backdropFilter: 'blur(20px)',
  borderTop: '1px solid rgba(110, 211, 255, 0.1)',
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: 'rgba(26, 33, 38, 0.98)',
  zIndex: 1300,
  paddingBottom: 'env(safe-area-inset-bottom, 22px)',
});


const KeyboardButton = styled(Button)({
  color: 'white',
  borderRadius: '8px',
  width: '100%',
  height: '42px',
  fontSize: '20px',
  fontWeight: '500',

});

const TokenSwap: React.FC = () => {
  const [fromToken, setFromToken] = useState<TokenType>("TON");
  const [toToken, setToToken] = useState<TokenType>("TICKET");
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [tonPrice, setTonPrice] = useState<number>(0);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedTokenType, setSelectedTokenType] = useState<"from" | "to">("from");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSwapping, setIsSwapping] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeInput] = useState<"from" | "to">("from");

  const [balances, setBalances] = useState({
    bblip: 0,
    usdt: 0,
    ticket: 0,
    ton: 0
  });

  const tokens: TokenInfo[] = [
    { name: "TICKET", icon: "https://cryptologos.cc/logos/telcoin-tel-logo.png?v=040" },
    { name: "TON", icon: "https://s3-symbol-logo.tradingview.com/crypto/XTVCTON--big.svg" },
    { name: "USDT", icon: "https://s3-symbol-logo.tradingview.com/crypto/XTVCUSDT--big.svg" },
    { name: "BBLIP", icon: logo5 },
  ];

  const theme = createTheme({
    typography: {
      fontFamily: "monospace",
    },
  });

  // Fetch TON price from Binance API
  const fetchTonPrice = async () => {
    try {
      const response = await axios.get(`https://api.binance.com/api/v3/ticker/price`, {
        params: { symbol: 'TONUSDT' },
      });
      setTonPrice(parseFloat(response.data.price));
    } catch (error) {
      console.error("Error fetching TON price:", error);
    }
  };

 
     

  useEffect(() => {
    fetchTonPrice();
    const interval = setInterval(fetchTonPrice, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const telegramUserId = localStorage.getItem("telegramUserId");
    if (!telegramUserId) {
      console.error("Telegram User ID not found!");
      return;
    }

    const docRef = doc(db, "users", telegramUserId);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setBalances({
          bblip: data.bblip || 0,
          usdt: data.usdt || 0,
          ticket: data.tickets || 0,
          ton: data.total || 0
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const validateInputs = () => {
    if (!fromAmount || !toAmount) return null;

    const fromAmountNum = parseFloat(fromAmount);
    const toAmountNum = parseFloat(toAmount);

    if (isNaN(fromAmountNum) || isNaN(toAmountNum) || fromAmountNum === 0 || toAmountNum === 0) {
      return "Invalid amount";
    }

    // Check for whole number requirement when dealing with TICKET
    if ((toToken === "TICKET" && !Number.isInteger(toAmountNum)) || 
        (fromToken === "TICKET" && !Number.isInteger(fromAmountNum))) {
      return "Ticket amount must be a whole number";
    }

    if (fromToken === "TON" && balances.ton < fromAmountNum * 1000) {
      return "Insufficient balance";
    } else if (fromToken === "USDT" && balances.usdt < fromAmountNum) {
      return "Insufficient balance";
    } else if (fromToken === "TICKET" && balances.ticket < fromAmountNum) {
      return "Insufficient balance";
    }

    return null;
  };

  const handleAmountChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    type: "from" | "to"
  ) => {
    const inputValue = e.target.value;

    if (inputValue === "") {
      setFromAmount("");
      setToAmount("");
      setError(null);
      return;
    }

    const amount = parseFloat(inputValue);
    if (isNaN(amount)) {
      setError("Please enter a valid number");
      return;
    }

    let calculatedToAmount: string = "";
    let calculatedFromAmount: string = "";

    if (type === "from") {
      setFromAmount(inputValue);

      // Calculate toAmount based on conversion rates
      if (fromToken === "TON" && toToken === "USDT") {
        calculatedToAmount = (amount * tonPrice).toFixed(2);
      } else if (fromToken === "USDT" && toToken === "TON") {
        calculatedToAmount = (amount / tonPrice).toFixed(2);
      } else if (fromToken === "TON" && toToken === "TICKET") {
        calculatedToAmount = Math.floor(amount / TICKET_TON_RATE).toString(); // Round down for TICKET
      } else if (fromToken === "TICKET" && toToken === "TON") {
        calculatedToAmount = (amount * TICKET_TON_RATE).toFixed(2);
      } else if (fromToken === "TICKET" && toToken === "USDT") {
        calculatedToAmount = (amount * TICKET_TON_RATE * tonPrice).toFixed(2);
      } else if (fromToken === "USDT" && toToken === "TICKET") {
        calculatedToAmount = Math.floor(amount / (TICKET_TON_RATE * tonPrice)).toString(); // Round down for TICKET
      }

      setToAmount(calculatedToAmount || "");
    } else {
      setToAmount(inputValue);

      // Calculate fromAmount based on conversion rates
      if (fromToken === "TON" && toToken === "USDT") {
        calculatedFromAmount = (amount / tonPrice).toFixed(2);
      } else if (fromToken === "USDT" && toToken === "TON") {
        calculatedFromAmount = (amount * tonPrice).toFixed(2);
      } else if (fromToken === "TON" && toToken === "TICKET") {
        calculatedFromAmount = (amount * TICKET_TON_RATE).toFixed(2);
      } else if (fromToken === "TICKET" && toToken === "TON") {
        calculatedFromAmount = Math.floor(amount / TICKET_TON_RATE).toString(); // Round down for TICKET
      } else if (fromToken === "TICKET" && toToken === "USDT") {
        calculatedFromAmount = Math.floor(amount / (TICKET_TON_RATE * tonPrice)).toString(); // Round down for TICKET
      } else if (fromToken === "USDT" && toToken === "TICKET") {
        calculatedFromAmount = (amount * (TICKET_TON_RATE * tonPrice)).toFixed(2);
      }

      setFromAmount(calculatedFromAmount || "");
    }

    setTimeout(() => {
      const validationError = validateInputs();
      setError(validationError);
    }, 0);
  };

  const handleTokenSelect = (token: TokenInfo) => {
    if (selectedTokenType === "from") {
      if (token.name === toToken) {
        setToToken(fromToken);
      }
      setFromToken(token.name);
    } else {
      if (token.name === fromToken) {
        setFromToken(toToken);
      }
      setToToken(token.name);
    }
    setFromAmount("");
    setToAmount("");
    setOpenDrawer(false);
  };

  const handleCloseSuccess = (_event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setShowSuccess(false);
    setSuccess(null);
  };

  const handleSwap = async () => {
    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setSuccess(null);
    setIsSwapping(true);

    try {
      const telegramUserId = localStorage.getItem("telegramUserId");
      if (!telegramUserId) {
        throw new Error("Telegram User ID not found!");
      }

      const fromAmountNum = parseFloat(fromAmount);
      const toAmountNum = parseFloat(toAmount);
      const docRef = doc(db, "users", telegramUserId);

      // TON -> USDT
      if (fromToken === "TON" && toToken === "USDT") {
        await updateDoc(docRef, {
          total: balances.ton - fromAmountNum * 1000,
          usdt: (balances.usdt || 0) + toAmountNum,
        });
        setSuccess(`Successfully swapped ${fromAmountNum} TON to ${toAmountNum} USDT`);
      }
      // USDT -> TON
      else if (fromToken === "USDT" && toToken === "TON") {
        await updateDoc(docRef, {
          usdt: balances.usdt - fromAmountNum,
          total: balances.ton + toAmountNum * 1000,
        });
        setSuccess(`Successfully swapped ${fromAmountNum} USDT to ${toAmountNum} TON`);
      }
      // TON -> TICKET
      else if (fromToken === "TON" && toToken === "TICKET") {
        await updateDoc(docRef, {
          total: balances.ton - fromAmountNum * 1000,
          tickets: (balances.ticket || 0) + toAmountNum,
        });
        setSuccess(`Successfully swapped ${fromAmountNum} TON to ${toAmountNum} TICKET`);
      }
      // TICKET -> TON
      else if (fromToken === "TICKET" && toToken === "TON") {
        await updateDoc(docRef, {
          tickets: balances.ticket - fromAmountNum,
          total: balances.ton + toAmountNum * 1000,
        });
        setSuccess(`Successfully swapped ${fromAmountNum} TICKET to ${toAmountNum} TON`);
      }
      // TICKET -> USDT
      else if (fromToken === "TICKET" && toToken === "USDT") {
        await updateDoc(docRef, {
          tickets: balances.ticket - fromAmountNum,
          usdt: balances.usdt + toAmountNum,
        });
        setSuccess(`Successfully swapped ${fromAmountNum} TICKET to ${toAmountNum} USDT`);
      }
      // USDT -> TICKET
      else if (fromToken === "USDT" && toToken === "TICKET") {
        await updateDoc(docRef, {
          usdt: balances.usdt - fromAmountNum,
          tickets: balances.ticket + toAmountNum,
        });
        setSuccess(`Successfully swapped ${fromAmountNum} USDT to ${toAmountNum} TICKET`);
      } else {
        throw new Error("Unsupported token swap");
      }

      setShowSuccess(true);
      setFromAmount("");
      setToAmount("");
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred during the swap");
    } finally {
      setIsSwapping(false);
    }
  };

  const handleTokenSwapInline2 = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  const getBalanceForToken = (tokenName: string) => {
    switch (tokenName) {
      case 'TON':
        return balances.ton;
      case 'USDT':
        return balances.usdt;
      case 'BBLIP':
        return balances.bblip;
      case 'TICKET':
        return balances.ticket;
      default:
        return 0;
    }
  };

  const formatDisplayAmount = (amount: number, symbol: string) => {
    if (symbol === "BBLIP" || symbol === "TON") {
      return (amount / 1000).toFixed(2);
    }
    return amount.toFixed(2);
  };

  // Calculate and display equivalent prices

  const handleMaxClick = (type: "from") => {
    const token = type === "from" ? fromToken : toToken;
    let maxAmount = "0";

    switch (token) {
      case "TON":
        maxAmount = (balances.ton / 1000).toFixed(2);
        break;
      case "USDT":
        maxAmount = balances.usdt.toFixed(2);
        break;
      case "TICKET":
        maxAmount = balances.ticket.toFixed(2);
        break;
      case "BBLIP":
        maxAmount = (balances.bblip / 1000).toFixed(2);
        break;
    }

    if (type === "from") {
      setFromAmount(maxAmount);
      handleAmountChange({ target: { value: maxAmount } } as React.ChangeEvent<HTMLInputElement>, "from");
    }
  };

  const calculateUSDValue = (amount: string, tokenType: TokenType): number => {
    const numAmount = parseFloat(amount || "0");
    
    switch (tokenType) {
      case "TON":
        return numAmount * tonPrice;
      case "TICKET":
        return numAmount * (TICKET_TON_RATE * tonPrice);
      case "USDT":
        return numAmount;
      default:
        return 0;
    }
  };

  const handleNumberClick = (num: string) => {
    if (!activeInput) return;
    
    let currentValue = activeInput === "from" ? fromAmount : toAmount;
    let newValue = currentValue;

    if (num === "backspace") {
      newValue = currentValue.slice(0, -1);
    } else if (num === ".") {
      if (!currentValue.includes(".")) {
        newValue = currentValue + ".";
      }
    } else {
      newValue = currentValue + num;
    }

    const e = {
      target: { value: newValue }
    } as React.ChangeEvent<HTMLInputElement>;
    
    handleAmountChange(e, activeInput);
  };

  return (
    <WithTourSection sectionId="swap-section">
      <ThemeProvider theme={theme}>
        <Box sx={{ 
          color: 'white', 
          display: 'flex',
          flexDirection: 'column',
          minHeight: '60vh',
          position: 'relative',
        }}>
          {/* Content Area */}
          <Box sx={{ 
          
            pt: 1,
            pb: 'calc(320px + env(safe-area-inset-bottom, 16px))',
            height: '80%',
            overflow: 'auto',
            '&::-webkit-scrollbar': {
              display: 'none'
            },
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}>
            {/* Header */}
            <Box sx={{mx:1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
              <Typography variant="h6" sx={{ fontWeight: '500', fontSize: '18px', color: '#6ed3ff' }}>
                Swap
              </Typography>
              <IconButton size="small" sx={{ color: '#6ed3ff' }}>
                <TuneRoundedIcon fontSize="small" />
              </IconButton>
            </Box>

            {/* From Token Box */}
            <TokenBox sx={{ mb: -3 }}>
              {/* Main Row */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {/* Input */}
                <Typography sx={{ 
                  fontSize: '28px', 
                  fontWeight: '500',
                  color: fromAmount ? '#6ed3ff' : 'rgba(255, 255, 255, 0.3)',
                  flex: 1
                }}>
                  {fromAmount || '0'}
                </Typography>
                
                {/* Token Select */}
                <TokenSelectButton
                  onClick={() => {
                    setSelectedTokenType("from");
                    setOpenDrawer(true);
                  }}
                >
                  <Avatar
                    src={tokens.find(t => t.name === fromToken)?.icon}
                    sx={{ width: 20, height: 20, mr: 0.5 }}
                  />
                  {fromToken}
                </TokenSelectButton>
              </Box>

              {/* Sub Row */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                {/* USD Value */}
                <Typography sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '12px' }}>
                  ${calculateUSDValue(fromAmount, fromToken).toFixed(2)}
                </Typography>

                {/* Balance and Max */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '12px' }}>
                    {formatDisplayAmount(getBalanceForToken(fromToken), fromToken)} 
                  </Typography>
                  <MaxButton onClick={() => handleMaxClick("from")}>
                    Max
                  </MaxButton>
                </Box>
              </Box>
            </TokenBox>

            {/* Swap Icon */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              position: 'relative',
            
            }}>
              <SwapIconButton
                size="small"
                onClick={handleTokenSwapInline2}
              >
                <SwapVertRoundedIcon sx={{ fontSize: 16 }} />
              </SwapIconButton>
            </Box>

            {/* To Token Box */}
            <TokenBox sx={{  }}>
              {/* Main Row */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {/* Input */}
                <Typography sx={{ 
                  fontSize: '28px', 
                  fontWeight: '500',
                  color: toAmount ? '#6ed3ff' : 'rgba(255, 255, 255, 0.3)',
                  flex: 1
                }}>
                  {toAmount || '0'}
                </Typography>
                
                {/* Token Select */}
                <TokenSelectButton
                  onClick={() => {
                    setSelectedTokenType("to");
                    setOpenDrawer(true);
                  }}
                >
                  <Avatar
                    src={tokens.find(t => t.name === toToken)?.icon}
                    sx={{ width: 20, height: 20, mr: 0.5 }}
                  />
                  {toToken}
                </TokenSelectButton>
              </Box>

              {/* Sub Row - Only USD Value */}
              <Box sx={{ mt: 0.5 }}>
                <Typography sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '12px' }}>
                  ${calculateUSDValue(toAmount, toToken).toFixed(2)}
                </Typography>
              </Box>
            </TokenBox>
                {/* Conversion Rate Display */}
              <Typography 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.7)', 
                  fontSize: '12px',
                  mt: 2,
                  textAlign: 'center',
                  backgroundColor: 'rgba(110, 211, 255, 0.1)',
                  padding: '4px 12px',
                  borderRadius: '12px',
                  maxWidth: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {(() => {
                  if (fromToken === "TON" && toToken === "USDT") {
                    return `1 TON = ${tonPrice.toFixed(2)} USDT`;
                  } else if (fromToken === "USDT" && toToken === "TON") {
                    return `1 USDT = ${(1 / tonPrice).toFixed(4)} TON`;
                  } else if (fromToken === "TON" && toToken === "TICKET") {
                    return `1 TICKET = ${TICKET_TON_RATE} TON`;
                  } else if (fromToken === "TICKET" && toToken === "TON") {
                    return `1 TICKET = ${TICKET_TON_RATE} TON`;
                  } else if (fromToken === "TICKET" && toToken === "USDT") {
                    return `1 TICKET = ${(TICKET_TON_RATE * tonPrice).toFixed(2)} USDT`;
                  } else if (fromToken === "USDT" && toToken === "TICKET") {
                    return `1 TICKET = ${(TICKET_TON_RATE * tonPrice).toFixed(2)} USDT`;
                  }
                  return "";
                })()}
              </Typography>
          </Box>

          {/* Custom Keyboard */}
          <KeyboardContainer>
            <Box sx={{ p: 1 }}>
              <Grid container spacing={0.5}>
              <Grid item xs={4}><KeyboardButton onClick={() => handleNumberClick("1")}>1</KeyboardButton></Grid>
              <Grid item xs={4}><KeyboardButton onClick={() => handleNumberClick("2")}>2</KeyboardButton></Grid>
              <Grid item xs={4}><KeyboardButton onClick={() => handleNumberClick("3")}>3</KeyboardButton></Grid>
              <Grid item xs={4}><KeyboardButton onClick={() => handleNumberClick("4")}>4</KeyboardButton></Grid>
              <Grid item xs={4}><KeyboardButton onClick={() => handleNumberClick("5")}>5</KeyboardButton></Grid>
              <Grid item xs={4}><KeyboardButton onClick={() => handleNumberClick("6")}>6</KeyboardButton></Grid>
              <Grid item xs={4}><KeyboardButton onClick={() => handleNumberClick("7")}>7</KeyboardButton></Grid>
              <Grid item xs={4}><KeyboardButton onClick={() => handleNumberClick("8")}>8</KeyboardButton></Grid>
              <Grid item xs={4}><KeyboardButton onClick={() => handleNumberClick("9")}>9</KeyboardButton></Grid>
              <Grid item xs={4}><KeyboardButton onClick={() => handleNumberClick(".")}>.</KeyboardButton></Grid>
              <Grid item xs={4}><KeyboardButton onClick={() => handleNumberClick("0")}>0</KeyboardButton></Grid>
              <Grid item xs={4}><KeyboardButton onClick={() => handleNumberClick("backspace")}><BackspaceIcon /></KeyboardButton></Grid>
            </Grid>
              
              {/* Swap Button */}
              <Box sx={{ mt: 1, mb: 1 }}>
                <SwapButton
                  fullWidth
                  onClick={handleSwap}
                  disabled={!fromAmount || !toAmount || isSwapping}
                  sx={{ height: '44px' }}
                >
                  {error ? error : isSwapping ? 'Swapping...' : 'Swap'}
                </SwapButton>
              </Box>
            </Box>
          </KeyboardContainer>

          {/* Token Selection Drawer */}
          <TokenListDrawer
            anchor="bottom"
            open={openDrawer}
            onClose={() => setOpenDrawer(false)}
            onOpen={() => setOpenDrawer(true)}
          >
            <Box sx={{ mx:-1 }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                mb: 3,
              }}>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                  Select Asset
                </Typography>
                <IconButton 
                  onClick={() => setOpenDrawer(false)}
                  sx={{ color: 'rgba(255, 255, 255, 0.5)' }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>

              <Box sx={{ maxHeight: '60vh', overflow: 'auto' }}>
                {tokens.map((token) => (
                  <TokenListItem
                    key={token.name}
                    onClick={() => handleTokenSelect(token)}
                    disabled={token.name === 'BBLIP'}
                    sx={{
                      opacity: token.name === 'BBLIP' ? 0.5 : 1,
                    }}
                  >
                    <Avatar
                      src={token.icon}
                      sx={{ width: 36, height: 36, mr: 2 }}
                    />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle1" sx={{ color: 'white' }}>
                        {token.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                        Balance: {formatDisplayAmount(getBalanceForToken(token.name), token.name)}
                      </Typography>
                    </Box>
                    {token.name === 'BBLIP' && (
                      <Typography variant="caption" sx={{ color: '#6ed3ff' }}>
                        Coming Soon
                      </Typography>
                    )}
                  </TokenListItem>
                ))}
              </Box>
            </Box>
          </TokenListDrawer>

          {/* Success Snackbar */}
          <Snackbar
            open={showSuccess && !!success}
            autoHideDuration={4000}
            onClose={handleCloseSuccess}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            TransitionComponent={SlideTransition}
            sx={{
              '& .MuiSnackbar-root': {
                minWidth: 'auto',
              },
            }}
          >
            <CustomAlert>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircleOutline sx={{ color: '#81c784' }} />
                <Typography variant="body2">{success}</Typography>
              </Box>
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleCloseSuccess}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </CustomAlert>
          </Snackbar>
        </Box>
      </ThemeProvider>
    </WithTourSection>
  );
};

export default TokenSwap;
