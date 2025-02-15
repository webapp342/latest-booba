import React, { FC, useState, useRef, useEffect, useCallback } from 'react';
import { generateSpinNumbers } from '../../utils/spinNumbers';
import SlotDisplay from './SlotDisplay';
import type { CounterRef } from './SlotDisplay';
import BalanceSelector from './BalanceSelector';
import SpinAndDepositButtons from './SpinAndDepositButtons';
import DepositDrawer from '../../components/WalletDrawers/DepositDrawer';
import SwapDrawer from '../../components/WalletDrawers/SwapDrawer';
import { keyframes } from "@emotion/react";
import StarIcon from '@mui/icons-material/Star';
import SnackbarComponent from './SnackbarComponent';
import {Box, Button,  Modal, Typography,  Paper } from '@mui/material';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { motion } from "framer-motion";
import { doc, onSnapshot,  getDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useWindowSize } from 'react-use';
import { useFirebaseSync } from '../../hooks/useFirebaseSync';
import WinNotifications from './WinNotifications';
import boobaLogo from '../../assets/booba-logo.png';
import ticketLogo from '../../assets/ticket.png';
import tonLogo from '../../assets/ton_symbol.png';
import { useNavigate } from 'react-router-dom';

const theme = createTheme({
  typography: {
    fontFamily: "monospace",
  },
});

// Memoize child components
const MemoizedSlotDisplay = React.memo(SlotDisplay);
const MemoizedBalanceSelector = React.memo(BalanceSelector);
const MemoizedSpinAndDepositButtons = React.memo(SpinAndDepositButtons);

// Game State Types
interface GameState {
  numbers: string;
  total: number;
  tickets: number;
  bblip: number;
  selectedSpinType: string;
  selectedBalance: string;
  winAmount: string;
}

interface UIState {
  drawerOpen: boolean;
  swapDrawerOpen: boolean;
  snackbarOpen: boolean;
  winModalOpen: boolean;
  winAmount: string;
  open: boolean;
  openWinningToken: boolean;
  isSpinning: boolean;
}

type GameAction = 
  | { type: 'SET_NUMBERS'; payload: string }
  | { type: 'UPDATE_BALANCES'; payload: { total?: number; bblip?: number; tickets?: number } }
  | { type: 'SET_SPIN_TYPE'; payload: string }
  | { type: 'SET_BALANCE'; payload: string }
  | { type: 'DECREASE_TICKETS'; payload: number }
  | { type: 'DECREASE_TOTAL'; payload: number }
  | { type: 'DECREASE_BBLIP'; payload: number }
  | { type: 'INCREASE_TOTAL'; payload: number }
  | { type: 'INCREASE_BBLIP'; payload: number }
  | { type: 'SET_WIN_AMOUNT'; payload: string };

type UIAction =
  | { type: 'SET_DRAWER'; payload: boolean }
  | { type: 'SET_SWAP_DRAWER'; payload: boolean }
  | { type: 'SET_SNACKBAR'; payload: boolean }
  | { type: 'SET_WIN_MODAL'; payload: boolean }
  | { type: 'SET_POWER'; payload: boolean }
  | { type: 'SET_WINNING_TOKEN'; payload: boolean }
  | { type: 'SET_SPINNING'; payload: boolean };

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'SET_NUMBERS':
      return { ...state, numbers: action.payload };
    case 'UPDATE_BALANCES':
      return {
        ...state,
        total: action.payload.total ?? state.total,
        bblip: action.payload.bblip ?? state.bblip,
        tickets: action.payload.tickets ?? state.tickets,
      };
    case 'SET_SPIN_TYPE':
      return { ...state, selectedSpinType: action.payload };
    case 'SET_BALANCE':
      return { ...state, selectedBalance: action.payload };
    case 'DECREASE_TICKETS':
      return { ...state, tickets: state.tickets - action.payload };
    case 'DECREASE_TOTAL':
      return { ...state, total: state.total - action.payload };
    case 'DECREASE_BBLIP':
      return { ...state, bblip: state.bblip - action.payload };
    case 'INCREASE_TOTAL':
      return { ...state, total: state.total + action.payload };
    case 'INCREASE_BBLIP':
      return { ...state, bblip: state.bblip + action.payload };
    case 'SET_WIN_AMOUNT':
      return { ...state, winAmount: action.payload };
    default:
      return state;
  }
};

const uiReducer = (state: UIState, action: UIAction): UIState => {
  switch (action.type) {
    case 'SET_DRAWER':
      return { ...state, drawerOpen: action.payload };
    case 'SET_SWAP_DRAWER':
      return { ...state, swapDrawerOpen: action.payload };
    case 'SET_SNACKBAR':
      return { ...state, snackbarOpen: action.payload };
    case 'SET_WIN_MODAL':
      return { ...state, winModalOpen: action.payload };
    case 'SET_POWER':
      return { ...state, open: action.payload };
    case 'SET_WINNING_TOKEN':
      return { ...state, openWinningToken: action.payload };
    case 'SET_SPINNING':
      return { ...state, isSpinning: action.payload };
    default:
      return state;
  }
};

// Add cache interface


// Add these new animations

const pulseAnimation = keyframes`
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.9;
  }
`;



// Update the border animation

// Update the border gradient animation
const gradientBorder = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

// Add continuous hover animation


// Add getTokenLogo function
const getTokenLogo = (token: string) => {
  switch (token) {
    case 'total':
      return tonLogo;
    case 'bblip':
      return boobaLogo;
    case 'ticket':
      return ticketLogo;
    default:
      return tonLogo;
  }
};

export const SlotMachine: FC = () => {
  const navigate = useNavigate();
  // Local state for UI
  const [gameState, dispatch] = React.useReducer(gameReducer, {
    numbers: '000000',
    total: 0,
    tickets: 5,
    bblip: 10000,
    selectedSpinType: 'total',
    selectedBalance: 'total',
    winAmount: '',
  });

  const [uiState, setUiState] = React.useReducer(uiReducer, {
    drawerOpen: false,
    swapDrawerOpen: false,
    snackbarOpen: false,
    winModalOpen: false,
    winAmount: '',
    open: false,
    openWinningToken: false,
    isSpinning: false,
  });

  const [telegramUserId, setTelegramUserId] = useState<string | null>(null);
  const {  updateBalance } = useFirebaseSync(db, telegramUserId);

  // Initialize telegramUserId from localStorage
  useEffect(() => {
    const storedId = localStorage.getItem("telegramUserId");
    if (!storedId) {
      console.error("Telegram User ID not found in localStorage!");
      return;
    }
    setTelegramUserId(storedId);
  }, []);

  // Initial data fetch from Firestore
  useEffect(() => {
    const initializeData = async () => {
      if (!telegramUserId) return;

      try {
        const userRef = doc(db, 'users', telegramUserId);
        const docSnap = await getDoc(userRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          // Update local state with Firestore data
          dispatch({
            type: 'UPDATE_BALANCES',
            payload: {
              total: data.total,
              bblip: data.bblip,
              tickets: data.tickets
            }
          });
        }
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };

    initializeData();
  }, [telegramUserId]);

  // Listen to Firestore changes - update local state with ALL changes
  useEffect(() => {
    if (!telegramUserId) return;

    const userRef = doc(db, 'users', telegramUserId);
    const unsubscribe = onSnapshot(userRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        
        // Always update local state with Firebase values
        dispatch({
          type: 'UPDATE_BALANCES',
          payload: {
            total: data.total,
            bblip: data.bblip,
            tickets: data.tickets
          }
        });
      }
    });

    return () => unsubscribe();
  }, [telegramUserId]);

  // Update ref with proper typing
  const displayRef = useRef<Array<CounterRef>>(Array(6).fill(null));

  // Add event handlers with proper typing
  const handleBalanceChange = useCallback((_event: React.ChangeEvent<{}>, value: string) => {
    dispatch({ type: 'SET_BALANCE', payload: value });
  }, []);

  const handleSpinTypeChange = useCallback((_event: React.ChangeEvent<{}>, value: string) => {
    dispatch({ type: 'SET_SPIN_TYPE', payload: value });
  }, []);

  // Handle spin with both local and Firestore updates
  const handleSpin = useCallback(async (spinAmount: number) => {
    console.log('=== SPIN BAŞLADI ===');
    console.log('Spin Amount:', spinAmount);
    
    try {
      // 1. ADIM: Firebase'den kullanıcı bilgilerini al
      const userRef = doc(db, 'users', telegramUserId!);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) throw new Error('User not found');
      const userData = userSnap.data();

      // İlk spin kontrolü
      const isFirstSpin = !userData.hasSpinned;
      console.log('İlk spin mi?:', isFirstSpin);

      // Bakiye kontrolü
      if (gameState.selectedSpinType === 'total' && userData.total < spinAmount) {
        setUiState({ type: 'SET_DRAWER', payload: true });
        return;
      } else if (gameState.selectedSpinType === 'bblip' && userData.bblip < spinAmount) {
        setUiState({ type: 'SET_DRAWER', payload: true });
        return;
      } else if (gameState.selectedSpinType === 'ticket' && userData.tickets < 1) {
        setUiState({ type: 'SET_DRAWER', payload: true });
        return;
      }

      // 2. ADIM: Direkt Firebase'den ücreti düş
      if (gameState.selectedSpinType === 'total') {
        await updateDoc(userRef, {
          total: increment(-spinAmount),
          hasSpinned: true // İlk spin işaretini güncelle
        });
      } else if (gameState.selectedSpinType === 'bblip') {
        await updateDoc(userRef, {
          bblip: increment(-spinAmount),
          hasSpinned: true
        });
      } else if (gameState.selectedSpinType === 'ticket') {
        await updateDoc(userRef, {
          tickets: increment(-1),
          hasSpinned: true
        });
      }

      // 3. ADIM: Animasyonları başlat
      setUiState({ type: 'SET_SPINNING', payload: true });
      setUiState({ type: 'SET_WIN_MODAL', payload: false });
      dispatch({ type: 'SET_WIN_AMOUNT', payload: '000000' });
      dispatch({ type: 'SET_NUMBERS', payload: '000000' });

      // Kazanç hesaplama
      const newNumbers = generateSpinNumbers(gameState.selectedBalance, gameState.selectedSpinType, isFirstSpin);
      const winningNumber = newNumbers.join('');
      console.log('Üretilen kazanç:', winningNumber, isFirstSpin ? '(İlk spin bonusu!)' : '');
      
      // Animation timing
      const baseSpinDuration = 2.5;
      const spinVariation = 0.3;
      const delayBetweenDigits = 0.15;
      const minSpinDuration = 1.5;

      // Start animations
      displayRef.current.forEach((ref, index) => {
        if (!ref) return;
        
        const isRed = (gameState.selectedSpinType === 'total' && index === 0) ||
                     (gameState.selectedSpinType === 'bblip' && index === 0);
        
        if (isRed) {
          ref.startAnimation({
            duration: 0,
            dummyCharacterCount: 0,
            direction: 'none',
            value: newNumbers[index],
          });
          return;
        }

        const randomVariation = Math.random() * spinVariation;
        const spinDelay = index * delayBetweenDigits;
        const duration = Math.max(minSpinDuration, baseSpinDuration + randomVariation + (index * 0.15));
        
        setTimeout(() => {
          ref.startAnimation({
            duration: duration,
            dummyCharacterCount: Math.floor(duration * 25),
            direction: 'top-down',
            value: newNumbers[index],
            easingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
          });

          // 4. ADIM: En son kazancı direkt Firebase'e ekle
          if (index === 5) {
            setTimeout(async () => {
              const winValue = Number(winningNumber);
              dispatch({ type: 'SET_NUMBERS', payload: winningNumber });
              dispatch({ type: 'SET_WIN_AMOUNT', payload: winningNumber });
              
              if (winValue > 0) {
                try {
                  if (gameState.selectedBalance === 'total') {
                    await updateDoc(userRef, {
                      total: increment(winValue)
                    });
                  } else if (gameState.selectedBalance === 'bblip') {
                    await updateDoc(userRef, {
                      bblip: increment(winValue)
                    });
                  }
                } catch (error) {
                  console.error('Error updating win balance:', error);
                }
              }
            }, duration * 1000);
          }
        }, spinDelay * 1000);
      });

    } catch (error) {
      console.error('Error during spin:', error);
      setUiState({ type: 'SET_SPINNING', payload: false });
    }
  }, [gameState, updateBalance, setUiState, dispatch, telegramUserId]);

  // İlk spin için özel kazanç hesaplama fonksiyonu
 

  // Modal close handler
  const handleCloseModal = useCallback(() => {
    setUiState({ type: 'SET_WIN_MODAL', payload: false });
    setUiState({ type: 'SET_SPINNING', payload: false }); // Enable spin button
    dispatch({ type: 'SET_WIN_AMOUNT', payload: '000000' });
    dispatch({ type: 'SET_NUMBERS', payload: '000000' });
  }, [setUiState, dispatch]);

  // Animasyon tamamlandığında çağrılacak fonksiyon
  const handleAnimationComplete = useCallback(() => {
    console.log('handleAnimationComplete çağrıldı');
    
    // Eğer modal zaten açıksa işlemi tekrarlama
    if (uiState.winModalOpen) {
      console.log('Modal zaten açık, işlem iptal edildi');
      return;
    }

    // Modalı aç
    setUiState({ type: 'SET_WIN_MODAL', payload: true });
    // Modal açıldıktan sonra spinning state'ini false yap
    setUiState({ type: 'SET_SPINNING', payload: false });
    
    console.log('Modal açıldı, son durum:', {
      kazanilanSayi: gameState.numbers,
      bakiyeler: {
        total: gameState.total,
        bblip: gameState.bblip
      }
    });
  }, [gameState, setUiState, uiState.winModalOpen]);

  // Animasyon keyframe tanımı
const bounceAnimation = keyframes`
0%, 100% {
  transform: translateY(0);
}
50% {
  transform: translateY(10px);
}
`;

const [, setShowConfetti] = useState(false);
useWindowSize(); // Pencere boyutlarını almak için

useEffect(() => {
  if (!uiState.winModalOpen) return;

  const winAmount = gameState.winAmount;
  console.log('Modal açılıyor, kazanç miktarı:', winAmount);
  
  const targetValue = parseInt(winAmount, 10);
  const duration = 2000;
  const steps = 60;
  const increment = targetValue / steps;

  let currentValue = 0;
  setShowConfetti(true);
  
  const interval = setInterval(() => {
    currentValue += increment;
    if (currentValue >= targetValue) {
      currentValue = targetValue;
      clearInterval(interval);
      setTimeout(() => setShowConfetti(false), 2000);
    }
  }, duration / steps);

  return () => clearInterval(interval);
}, [uiState.winModalOpen, gameState.winAmount]);

  // Formatlama fonksiyonunu güncelleyelim
  const formatWinAmount = (amount: number): string => {
    // Sayıyı string'e çevirip 6 haneli yap
    const numString = String(amount).padStart(6, '0');

    // Son 3 haneyi decimal olarak ayır
    const integerPart = numString.slice(0, -3);
    const decimalPart = numString.slice(-3);

    // Başındaki sıfırları kaldır ama en az bir rakam kalsın
    const cleanIntegerPart = integerPart.replace(/^0+/, '') || '0';
  
    // Formatı oluştur
    return `${cleanIntegerPart}.${decimalPart}`;
  };

  // Aktif kutulara göre stil belirleme

  return (
    <ThemeProvider theme={theme}>
      <Box //@ts-ignore
        sx={{ 
          
          mt:-7,
   
          width: "100vw",
          mb:14,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
      position: "relative",
          top: 0,
          left: 0,
                minHeight: "100vh",

          overflow: "auto",
          willChange: "transform",
          backdropFilter: "blur(10px)",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 0,
          }
        }}
      >
        <Box
          sx={{
            width: "100%",
            minWidth: "320px",
            maxWidth: "420px",
            minHeight: "100%",
            position: "relative",
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            pt: 2,
            px: 2,
            pb: 4,
            overflowX: "hidden",
          }}
        >
          {/* Max Win Display - Moved to top */}
          <Paper
            elevation={24}
            sx={{
              boxShadow:'none',
              background: 'transparent',
              borderRadius: '20px',
              p: 2,
              mb: -3,
              width: '100%',
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: '50%',
                  left: 0,
                  right: 0,
                  height: '2px',
                  transform: 'translateY(-50%)',
                  zIndex: 0,
                }
              }}
            >
              {[16, 20, 24].map((size, index) => (
                <StarIcon
                  key={`left-star-${index}`}
                  sx={{
                    fontSize: size * 0.8,
                    color: "#FFD700",
                    filter: "drop-shadow(0 0 5px rgba(255,215,0,0.5))",
                    animation: `${bounceAnimation} ${1 + index * 0.2}s infinite`,
                    zIndex: 1,
                  }}
                />
              ))}

              <Typography
                variant="h4"
                sx={{
                  color: "#fff",
                  fontWeight: "900",
                  mx: 1,
                  fontSize: '1.8rem',
                  textShadow: '0 0 20px rgba(255,215,0,0.5)',
                  zIndex: 1,
                  position: 'relative',
                }}
              >
                999 TON
              </Typography>

              {[24, 20, 16].map((size, index) => (
                <StarIcon
                  key={`right-star-${index}`}
                  sx={{
                    fontSize: size * 0.8,
                    color: "#FFD700",
                    filter: "drop-shadow(0 0 5px rgba(255,215,0,0.5))",
                    animation: `${bounceAnimation} ${1 + index * 0.2}s infinite`,
                    zIndex: 1,
                  }}
                />
              ))}
            </Box>
          </Paper>

          {/* Main Game Container */}
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            {/* Slot Display */}
            <Box
              sx={{
                borderRadius: '20px',
             
              }}
            >
              <MemoizedSlotDisplay 
                ref={displayRef}
                numbers={gameState.numbers}
                selectedSpinType={gameState.selectedSpinType}
                onAnimationComplete={handleAnimationComplete}
              />
            </Box>

            {/* Controls */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                width: '100%',
              }}
            >
              {/* Game Controls Container */}
              <Paper
                elevation={24}
                sx={{
                  background: 'linear-gradient(145deg, rgba(26,31,46,0.9) 0%, rgba(13,15,23,0.9) 100%)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  border: '1px solid rgba(255,215,0,0.1)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                }}
              >
                {/* Winning Token Section */}
                <Box
                  sx={{
                    position: 'relative',
                    p: 2,
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '1px',
                      background: 'linear-gradient(90deg, transparent, rgba(255,215,0,0.2), transparent)',
                    },
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '1px',
                      background: 'linear-gradient(90deg, transparent, rgba(255,215,0,0.1), transparent)',
                    }
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <StarIcon sx={{ color: '#FFD700', fontSize: '0.9rem' }} />
                    <Typography
                      sx={{
                        color: "#FFD700",
                        fontSize: '1.1rem',
                        fontWeight: "bold",
                        textAlign: "center",
                        textShadow: '0 0 10px rgba(255,215,0,0.3)',
                        letterSpacing: '1px',
                        textTransform: 'uppercase',
                      }}
                    >
                      Winning Token
                    </Typography>
                    <StarIcon sx={{ color: '#FFD700', fontSize: '0.9rem' }} />
                  </Box>

                  <MemoizedBalanceSelector 
                    selectedBalance={gameState.selectedBalance} 
                    onChange={handleBalanceChange}
                  />
                </Box>

                {/* Spin Power Section */}
                <Box
                  sx={{
                    position: 'relative',
                    p: 2,
                    background: 'linear-gradient(180deg, rgba(26,31,46,0) 0%, rgba(13,15,23,0.5) 100%)',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <StarIcon sx={{ color: '#FFD700', fontSize: '0.9rem' }} />
                    <Typography
                      sx={{
                        color: "#FFD700",
                        fontSize: '1.1rem',
                        fontWeight: "bold",
                        textAlign: "center",
                        textShadow: '0 0 10px rgba(255,215,0,0.3)',
                        letterSpacing: '1px',
                        textTransform: 'uppercase',
                      }}
                    >
                      Spin Power
                    </Typography>
                    <StarIcon sx={{ color: '#FFD700', fontSize: '0.9rem' }} />
                  </Box>

                  <Box
                    sx={{
                      position: 'relative',
                      mt: -1,
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: -5,
                        left: 0,
                        right: 0,
                        height: '1px',
                        background: 'linear-gradient(90deg, transparent, rgba(255,215,0,0.1), transparent)',
                      }
                    }}
                  >
                    <MemoizedSpinAndDepositButtons
                      total={gameState.total}
                      tickets={gameState.tickets}
                      bblip={gameState.bblip}
                      selectedSpinType={gameState.selectedSpinType}
                      handleSpin={handleSpin}
                      openDepositDrawer={() => setUiState({ type: 'SET_DRAWER', payload: true })}
                      openSwapDrawer={() => setUiState({ type: 'SET_SWAP_DRAWER', payload: true })}
                      navigateToTasks={() => {
                        // Navigate to tasks tab using useNavigate
                        navigate('/tasks');
                      }}
                      handleSpinTypeChange={handleSpinTypeChange}
                      isSpinning={uiState.isSpinning}
                      showTopUpButton={
                        (gameState.selectedSpinType === 'ticket' && gameState.tickets === 0) ||
                        (gameState.selectedSpinType === 'total' && gameState.total < 200) ||
                        (gameState.selectedSpinType === 'bblip' && gameState.bblip < 25000)
                      }
                    />

                    {/* Win Notifications */}
                    <Box sx={{ mt: 2 }}>
                      <WinNotifications />
                    </Box>
                  </Box>
                </Box>
              </Paper>
            </Box>
          </Box>
        </Box>

        {/* Win Modal */}
        <Modal 
          open={uiState.winModalOpen} 
          onClose={handleCloseModal}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 2,
            '& .MuiBackdrop-root': {
              backgroundColor: 'rgba(0, 0, 0, 0.85)',
            },
          }}
        >
          <Box
            component={motion.div}
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 50 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            sx={{
              width: "100%",
              maxWidth: "340px",
              background: 'linear-gradient(145deg, rgba(26,31,46,0.95) 0%, rgba(13,15,23,0.95) 100%)',
              backdropFilter: "blur(20px)",
              borderRadius: "20px",
              p: 3,
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                inset: '-2px',
                borderRadius: '22px',
                padding: '2px',
                background: 'linear-gradient(90deg, #FFD700, #FFA500, #FFD700)',
                backgroundSize: '200% 100%',
                animation: `${gradientBorder} 4s linear infinite`,
                WebkitMask: 
                  'linear-gradient(#fff 0 0) content-box, ' +
                  'linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
              },
              boxShadow: '0 0 30px rgba(0,0,0,0.5)',
              outline: 'none',
              overflow: 'hidden',
            }}
          >
            {/* Header Section */}
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              mb: 2.5,
              pb: 2.5,
              borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}>
              {/* Token Icon */}
           

              {/* Win Text */}
              <Typography
                sx={{
                  color: "rgba(255,255,255,0.7)",
                  fontSize: '0.85rem',
                  fontWeight: "500",
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  mb: 0.5,
                }}
              >
                Congratulations
              </Typography>
              <Typography
                sx={{
                  color: "#FFD700",
                  fontSize: '1.2rem',
                  fontWeight: "700",
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                }}
              >
                You Won
              </Typography>
            </Box>

            {/* Win Amount Section */}
            <Box
              sx={{
                background: 'linear-gradient(145deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 100%)',
                borderRadius: '16px',
                p: 3,
                mb: 3,
                border: '1px solid rgba(255,215,0,0.15)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Win Amount Display */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 2,
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                <Box
                  sx={{
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: gameState.selectedBalance === 'bblip' ? '50%' : '0',
                    overflow: 'hidden',
                  }}
                >
                  <img
                    src={getTokenLogo(gameState.selectedBalance)}
                    alt="Token"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: gameState.selectedBalance === 'bblip' ? '50%' : '0',
                    }}
                  />
                </Box>

                <Typography
                  variant="h3"
                  sx={{
                    color: "#FFD700",
                    fontWeight: "900",
                    fontSize: '2.4rem',
                    textShadow: '0 0 20px rgba(255,215,0,0.5)',
                    lineHeight: 1.2,
                    fontFamily: "'Digital-7', monospace",
                    letterSpacing: '1px',
                    animation: `${pulseAnimation} 1.5s ease-in-out infinite`,
                  }}
                >
                  {formatWinAmount(parseInt(gameState.winAmount, 10))}
                </Typography>
              </Box>

              {/* Lucky Message */}
              <Typography
                sx={{
                  color: "rgba(255,255,255,0.6)",
                  fontSize: '0.8rem',
                  fontWeight: "500",
                  textAlign: 'center',
                  fontStyle: 'italic',
                  mt: 2,
                }}
              >
                Your lucky spin paid off! 
              </Typography>
            </Box>

            {/* Play Again Button */}
            <Button
              onClick={handleCloseModal}
              variant="contained"
              sx={{
                width: "100%",
                py: 1.5,
                background: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
                color: "#000",
                fontSize: '0.95rem',
                fontWeight: "700",
                borderRadius: "10px",
                textTransform: "uppercase",
                letterSpacing: '1px',
                transition: 'all 0.3s ease',
                "&:active": {
                  transform: 'translateY(1px)',
                }
              }}
            >
              Continue Playing
            </Button>
          </Box>
        </Modal>

        <DepositDrawer
          open={uiState.drawerOpen}
          onClose={() => setUiState({ type: 'SET_DRAWER', payload: false })}
        />

        <SwapDrawer
          open={uiState.swapDrawerOpen}
          onClose={() => setUiState({ type: 'SET_SWAP_DRAWER', payload: false })}
        />

        <SnackbarComponent 
          snackbarOpen={uiState.snackbarOpen} 
          setSnackbarOpen={(value) => setUiState({ type: 'SET_SNACKBAR', payload: value })} 
        />
      </Box>
    </ThemeProvider>
  );
};
