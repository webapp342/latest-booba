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
  Modal,
  CircularProgress,
} from "@mui/material";
import SwapVertRoundedIcon from '@mui/icons-material/SwapVertRounded';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import logo5 from '../assets/booba-logo.png';     
import ticket from '../assets/ticket.png'; 
import { doc, onSnapshot, getFirestore, updateDoc } from "firebase/firestore";
import { initializeApp } from 'firebase/app';

import CloseIcon from '@mui/icons-material/Close';
import { CheckCircleOutline } from '@mui/icons-material';
import { TransitionProps } from '@mui/material/transitions';
import { firebaseConfig } from "./firebaseConfig";
import BackspaceIcon from '@mui/icons-material/Backspace';
import { motion, AnimatePresence } from "framer-motion";
import DoneIcon from '@mui/icons-material/Done';

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

interface TokenSwapProps {
  defaultAmount?: number;
  onClose?: () => void;
}

// Styled Components
const TokenBox = styled(Box)({
  backgroundColor: 'rgba(18, 22, 25, 0.7)',
  backdropFilter: 'blur(20px)',
  borderRadius: '20px',
  padding: '20px',
  marginBottom: '4px',
  border: '1px solid rgba(110, 211, 255, 0.08)',
  transition: 'all 0.3s ease',
  '&:hover': {
    border: '1px solid rgba(110, 211, 255, 0.15)',
    backgroundColor: 'rgba(18, 22, 25, 0.8)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
  }
});

const TokenSelectButton = styled(Button)({
  color: 'white',
  padding: '8px 16px',
  borderRadius: '24px',
  backgroundColor: 'rgba(110, 211, 255, 0.08)',
  textTransform: 'none',
  minWidth: 'auto',
  '&:hover': {
    backgroundColor: 'rgba(110, 211, 255, 0.15)',
    boxShadow: '0 2px 12px rgba(110, 211, 255, 0.1)',
  },
  transition: 'all 0.3s ease',
});

const MaxButton = styled(Button)({
  color: '#6ed3ff',
  fontSize: '12px',
  padding: '3px 12px',
  minWidth: 'auto',
  borderRadius: '12px',
  textTransform: 'none',
  
  transition: 'all 0.3s ease',
});

const SwapIconButton = styled(IconButton)({
  position: 'relative',
  backgroundColor: 'rgba(18, 22, 25, 0.95)',
  padding: '10px',
  width: '36px',
  height: '36px',
  color: '#6ed3ff',
  border: '1px solid rgba(110, 211, 255, 0.15)',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
  transform: 'translateY(50%)',
  zIndex: 2,
  '&:hover': {
    backgroundColor: 'rgba(110, 211, 255, 0.08)',
    border: '1px solid rgba(110, 211, 255, 0.25)',
    boxShadow: '0 4px 15px rgba(110, 211, 255, 0.15)',
  },
  '&:active': {
    transform: 'translateY(50%) scale(0.95)',
  },
  transition: 'all 0.3s ease',
});

const SwapButton = styled(Button)({
  background: 'linear-gradient(135deg, #6ed3ff 0%, #89d9ff 100%)',
  color: '#1a2126',
  borderRadius: '16px',
  padding: '16px',
  fontSize: '16px',
  fontWeight: 'bold',
  textTransform: 'none',
  marginTop: '16px',
  boxShadow: '0 4px 15px rgba(110, 211, 255, 0.2)',
  '&:hover': {
    background: 'linear-gradient(135deg, #89d9ff 0%, #6ed3ff 100%)',
    boxShadow: '0 4px 20px rgba(110, 211, 255, 0.3)',
  },
  '&:disabled': {
    background: 'linear-gradient(135deg, rgba(110, 211, 255, 0.3) 0%, rgba(137, 217, 255, 0.3) 100%)',
    color: 'rgba(255, 255, 255, 0.3)',
  },
  transition: 'all 0.3s ease',
});

const TokenListDrawer = styled(SwipeableDrawer)({
  '& .MuiDrawer-paper': {
    background: 'linear-gradient(180deg, rgba(26, 33, 38, 0.99) 0%, rgba(26, 33, 38, 0.95) 100%)',
    borderRadius: '24px 24px 0 0',
    padding: '24px',
    maxHeight: '80vh',
        zIndex: 10999, // Yüksek z-index değeri ekledik

 },
  '& .MuiBackdrop-root': {
    zIndex: 10998, // Backdrop için de yüksek z-index
  }
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
  backdropFilter: 'blur(25px)',
  borderTop: '1px solid rgba(110, 211, 255, 0.08)',
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: 'rgba(26, 33, 38, 0.98)',
  zIndex: 1300,
  paddingBottom: 'env(safe-area-inset-bottom, 22px)',
  boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.2)',
});

const KeyboardButton = styled(Button)({
  color: 'white',
  borderRadius: '12px',
  width: '100%',
  height: '48px',
  fontSize: '20px',
  fontWeight: '500',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: 'rgba(110, 211, 255, 0.08)',
  },
});

const SwapModal = styled(Modal)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const ModalContent = styled(Box)({
  backgroundColor: 'rgba(18, 22, 25, 0.95)',
  backdropFilter: 'blur(20px)',
  borderRadius: '24px',
  padding: '32px',
  width: '90%',
  maxWidth: '360px',
  border: '1px solid rgba(110, 211, 255, 0.1)',
  outline: 'none',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '24px',
});

const SwapLoadingCircle = styled(CircularProgress)({
  color: '#6ed3ff',
});

const SuccessCircle = styled(Box)({
  width: '64px',
  height: '64px',
  borderRadius: '50%',
  backgroundColor: 'rgba(110, 211, 255, 0.1)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#6ed3ff',
});

const TokenSwap: React.FC<TokenSwapProps> = ({ defaultAmount, onClose }) => {
  const [fromToken, setFromToken] = useState<TokenType>("TON");
  const [toToken, setToToken] = useState<TokenType>("TICKET");
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [tonPrice, setTonPrice] = useState<number>(0);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedTokenType, setSelectedTokenType] = useState<"from" | "to">("from");
  const [, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSwapping, setIsSwapping] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeInput] = useState<"from" | "to">("from");
  const [modalOpen, setModalOpen] = useState(false);
  const [swapStatus, setSwapStatus] = useState<'loading' | 'success'>('loading');
  const [, setUserData] = useState<{ level?: number } | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);

  const [balances, setBalances] = useState({
    bblip: 0,
    usdt: 0,
    ticket: 0,
    ton: 0
  });

  const tokens: TokenInfo[] = [
    { name: "TICKET", icon: ticket },
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
        setUserData({
          level: data.level || 0
        });
      }
    });

    return () => unsubscribe();
  }, []);

  // Initialize with defaultAmount
  useEffect(() => {
    if (defaultAmount && defaultAmount > 0) {
      const requiredTON = (defaultAmount * TICKET_TON_RATE).toFixed(2);
      setFromToken("TON");
      setToToken("TICKET");
      setFromAmount(requiredTON);
      setToAmount(defaultAmount.toString());
    }
  }, [defaultAmount]);

  // Cleanup when component unmounts or drawer closes
  useEffect(() => {
    if (!onClose) return;

    const cleanup = () => {
      setFromToken("TON");
      setToToken("TICKET");
      setFromAmount("");
      setToAmount("");
      setOpenDrawer(false);
      setSelectedTokenType("from");
      setError(null);
      setSuccess(null);
      setIsSwapping(false);
      setShowSuccess(false);
      setModalOpen(false);
      setSwapStatus('loading');
    };

    return cleanup;
  }, [onClose]);

  // Level requirement functions

  const validateInputs = () => {
    // 1. Boş input kontrolü
    if (!fromAmount || !toAmount) {
      return "Enter an amount";
    }

    const fromAmountNum = parseFloat(fromAmount);
    const toAmountNum = parseFloat(toAmount);

    // 2. Temel miktar kontrolleri
    if (isNaN(fromAmountNum) || isNaN(toAmountNum)) {
      return "Invalid amount";
    }

    if (fromAmountNum === 0 || toAmountNum === 0) {
      return "Amount cannot be zero";
    }

    if (fromAmountNum < 0 || toAmountNum < 0) {
      return "Amount cannot be negative";
    }

    // 3. TON -> TICKET işlemi kontrolleri
    if (fromToken === "TON" && toToken === "TICKET") {
      // TICKET miktarı tam sayı olmalı
      if (!Number.isInteger(toAmountNum)) {
        return "Ticket amount must be a whole number";
      }

      const requiredTON = toAmountNum * TICKET_TON_RATE;

      // TON miktarı kontrolü
      if (fromAmountNum < requiredTON) {
        return `Insufficient TON. Need ${requiredTON} TON`;
      }
      
      // Bakiye kontrolü
      if (balances.ton < requiredTON * 1000) {
        return "Insufficient TON balance";
      }

      return `This swap will use ${requiredTON} TON for ${toAmountNum} TICKET`;
    }

    // 4. TICKET -> TON işlemi kontrolleri
    if (fromToken === "TICKET" && toToken === "TON") {
      // TICKET miktarı tam sayı olmalı
      if (!Number.isInteger(fromAmountNum)) {
        return "Ticket amount must be a whole number";
      }

      // Bakiye kontrolü
      if (balances.ticket < fromAmountNum) {
        return "Insufficient TICKET balance";
      }
    }

    // 5. Genel bakiye kontrolleri
    if (fromToken === "TON" && balances.ton < fromAmountNum * 1000) {
      return "Insufficient TON balance";
    } else if (fromToken === "USDT" && balances.usdt < fromAmountNum) {
      return "Insufficient USDT balance";
    } else if (fromToken === "TICKET" && balances.ticket < fromAmountNum) {
      return "Insufficient TICKET balance";
    }

    return null;
  };

  const getSwapButtonText = () => {
    if (isSwapping) return 'Processing...';
    
    const validationError = validateInputs();
    if (!validationError) return 'Swap';
    if (validationError.startsWith('This swap will use')) return 'Swap';
    
    return validationError;
  };

  const isSwapDisabled = () => {
    const validationError = validateInputs();
    if (!validationError) return false;
    if (validationError.startsWith('This swap will use')) return false;
    return true;
  };

  const handleAmountChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    type: "from" | "to"
  ) => {
    const inputValue = e.target.value;

    // Negatif sayıları engelle
    if (inputValue.startsWith('-')) {
      return;
    }

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
        // TICKET için tam sayı hesaplama
        calculatedToAmount = Math.floor(amount / TICKET_TON_RATE).toString();
      } else if (fromToken === "TICKET" && toToken === "TON") {
        calculatedToAmount = (amount * TICKET_TON_RATE).toFixed(2);
      } else if (fromToken === "TICKET" && toToken === "USDT") {
        calculatedToAmount = (amount * TICKET_TON_RATE * tonPrice).toFixed(2);
      } else if (fromToken === "USDT" && toToken === "TICKET") {
        // TICKET için tam sayı hesaplama
        calculatedToAmount = Math.floor(amount / (TICKET_TON_RATE * tonPrice)).toString();
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
        // TICKET için tam sayı hesaplama
        calculatedFromAmount = Math.floor(amount / TICKET_TON_RATE).toString();
      } else if (fromToken === "TICKET" && toToken === "USDT") {
        calculatedFromAmount = (amount / (TICKET_TON_RATE * tonPrice)).toFixed(2);
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
    if (validationError && !validationError.startsWith('This swap will use')) {
      setError(validationError);
      return;
    }

    setError(null);
    setSuccess(null);
    setIsSwapping(true);
    setModalOpen(true);
    setSwapStatus('loading');

    try {
      const telegramUserId = localStorage.getItem("telegramUserId");
      if (!telegramUserId) {
        throw new Error("Telegram User ID not found!");
      }

      const fromAmountNum = parseFloat(fromAmount);
      const toAmountNum = parseFloat(toAmount);
      const docRef = doc(db, "users", telegramUserId);

      // İlk aşama - İşlem başlatılıyor
      await new Promise(resolve => setTimeout(resolve, 1500));
      setLoadingMessage("Preparing transaction...");

      // İkinci aşama - Kontrat kontrolü
      await new Promise(resolve => setTimeout(resolve, 2000));
      setLoadingMessage("Checking smart contract...");

      // Üçüncü aşama - İşlem onayı
      await new Promise(resolve => setTimeout(resolve, 2000));
      setLoadingMessage("Confirming transaction...");

      // Son aşama - İşlem tamamlanıyor
      await new Promise(resolve => setTimeout(resolve, 1500));

      // TON -> TICKET
      if (fromToken === "TON" && toToken === "TICKET") {
        const requiredTON = toAmountNum * TICKET_TON_RATE * 1000; // Convert to nanoTON
        await updateDoc(docRef, {
          total: balances.ton - requiredTON,
          tickets: (balances.ticket || 0) + toAmountNum,
        });
        setSuccess(`Successfully swapped ${requiredTON/1000} TON to ${toAmountNum} TICKET`);
      }
      // TICKET -> TON
      else if (fromToken === "TICKET" && toToken === "TON") {
        await updateDoc(docRef, {
          tickets: balances.ticket - fromAmountNum,
          total: balances.ton + (fromAmountNum * TICKET_TON_RATE * 1000),
        });
        setSuccess(`Successfully swapped ${fromAmountNum} TICKET to ${toAmountNum} TON`);
      }
      // TON -> USDT
      else if (fromToken === "TON" && toToken === "USDT") {
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

      setSwapStatus('success');
      
      // Başarılı durumunu göster ve sonra kapat
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setModalOpen(false);
      setFromAmount("");
      setToAmount("");
      if (onClose) {
        onClose();
      }

    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred during the swap");
      setModalOpen(false);
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

  const calculatePriceImpact = () => {
    if (!fromAmount || !toAmount) return null;
    
    // TICKET işlemleri için price impact gösterme
    if (fromToken === "TICKET" || toToken === "TICKET") {
      return null;
    }
    
    // Diğer işlemler için price impact hesapla
    return 0.1; // Placeholder for other token swaps
  };

  const calculateMinimumReceived = () => {
    if (!toAmount) return 0;
    const amount = parseFloat(toAmount);

    // TICKET işlemleri için minimum received hesaplanmayacak
    if (fromToken === "TICKET" || toToken === "TICKET") {
      return amount; // Sabit oran olduğu için aynı miktar
    }

    // Diğer token çiftleri için slippage hesaplaması
    return amount * 0.999; // 0.1% slippage
  };

  return (
      <ThemeProvider theme={theme}>
        <Box //@ts-ignore
        sx={{ 
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
         

            {/* From Token Box */}
            <TokenBox sx={{ mb: -4 }}>
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
                 Use Max
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
            
            {/* Details Section */}
            <Box sx={{ px: 1, mt: 1, opacity: 0.9 }}>
              <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
              }}>
                <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
                  Rate
                </Typography>
                <Typography sx={{ color: '#6ed3ff', fontSize: '14px' }}>
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
              {/* Price Impact sadece TICKET olmayan işlemlerde göster */}
              {fromToken !== "TICKET" && toToken !== "TICKET" && (
                <>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                  }}>
                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
                      Price Impact
                    </Typography>
                    <Typography sx={{ color: '#6ed3ff', fontSize: '14px' }}>
                      {calculatePriceImpact() === null ? '-' : `${calculatePriceImpact()}%`}
                    </Typography>
                  </Box>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                  }}>
                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
                      Minimum Received
                    </Typography>
                    <Typography sx={{ color: '#6ed3ff', fontSize: '14px' }}>
                      {calculateMinimumReceived().toFixed(4)} {toToken}
                    </Typography>
                  </Box>
                </>
              )}
              <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
              }}>
                <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
                  Protocol Fee
                </Typography>
                <Typography sx={{ 
                  color: '#6ed3ff', 
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5
                }}>
                  {(fromToken === "TICKET" && toToken === "TON") || (fromToken === "TON" && toToken === "TICKET") ? (
                    <Box component="span" sx={{ color: '#4CAF50' }}>Covered by Protocol</Box>
                  ) : (
                    "~0.0000011 TON"
                  )}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Custom Keyboard */}
          <KeyboardContainer>
            <Box //@ts-ignore
            sx={{ p: 1 }}>
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
                  disabled={isSwapDisabled() || isSwapping}
                  sx={{
                    backgroundColor: isSwapDisabled() ? 'rgba(110, 211, 255, 0.1)' : '#6ed3ff',
                    color: isSwapDisabled() ? 'rgba(255, 255, 255, 0.5)' : '#1a2126',
                    height: '48px',
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontWeight: '600',
                    marginTop: '16px',
                   
                    '&:disabled': {
                      backgroundColor: 'rgba(110, 211, 255, 0.1)',
                      color: 'rgba(255, 255, 255, 0.3)',
                    }
                  }}
                >
                  {getSwapButtonText()}
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
             sx={{
    zIndex: 9999,
    position: 'relative',
  }}
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

              <Box sx={{ maxHeight: '60vh', overflow: 'auto', mx:-2, }}>
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

          <SwapModal
            open={modalOpen}
            onClose={() => {
              if (swapStatus === 'success') {
                setModalOpen(false);
              }
            }}
          >
            <ModalContent>
              <AnimatePresence mode="wait">
                {swapStatus === 'loading' ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}
                  >
                    <SwapLoadingCircle size={64} />
                    <Typography sx={{ color: 'white', fontSize: '18px', fontWeight: '500' }}>
                      {loadingMessage || "Processing Swap"}
                    </Typography>
                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', textAlign: 'center' }}>
                      {fromAmount} {fromToken} → {toAmount} {toToken}
                    </Typography>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}
                  >
                    <SuccessCircle>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 10 }}
                      >
                        <DoneIcon sx={{ fontSize: 32 }} />
                      </motion.div>
                    </SuccessCircle>
                    <Typography sx={{ color: 'white', fontSize: '18px', fontWeight: '500' }}>
                      Swap Successful
                    </Typography>
                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', textAlign: 'center' }}>
                      You swapped {fromAmount} {fromToken} for {toAmount} {toToken}
                    </Typography>
                  </motion.div>
                )}
              </AnimatePresence>
            </ModalContent>
          </SwapModal>
        </Box>
      </ThemeProvider>
  );
};

export default TokenSwap;
