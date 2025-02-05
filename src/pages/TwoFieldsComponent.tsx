import React, { useEffect, useState } from 'react';
import { Button, Typography, Box, TextField, Fade, Drawer, styled, Grid, Modal } from '@mui/material';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, onSnapshot, updateDoc, getDoc } from 'firebase/firestore';
import { firebaseConfig } from './firebaseConfig';
import ton from '../assets/kucukTON.png';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import BackspaceIcon from '@mui/icons-material/Backspace';
import CloseIcon from '@mui/icons-material/Close';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import StarIcon from '@mui/icons-material/Star';
import SwapDrawer from '../components/WalletDrawers/SwapDrawer';

// Firebase initialization
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const StyledDrawer = styled(Drawer)(({ }) => ({
  '& .MuiDrawer-paper': {
    background: 'linear-gradient(180deg, rgba(26, 33, 38, 0.99) 0%, rgba(26, 33, 38, 0.95) 100%)',
    borderRadius: '24px 24px 0 0',
  
    
     maxHeight: '80vh',
    minHeight: '60vh',
    height: 'auto',
    border: '1px solid rgba(110, 211, 255, 0.1)',
    overflow: 'visible',
  }
}));

const DrawerContent = styled(Box)({
  height: '100%',
  overflow: 'auto',
  paddingBottom: 'calc(320px + env(safe-area-inset-bottom, 16px))',
  width: '100%',
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  '&::-webkit-scrollbar': {
    display: 'none'
  },
  scrollbarWidth: 'none',
  msOverflowStyle: 'none'
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

const MinWithdrawModal = styled(Modal)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const MinWithdrawContent = styled(Box)({
  backgroundColor: 'rgba(18, 22, 25, 0.95)',
  backdropFilter: 'blur(20px)',
  borderRadius: '24px',
  padding: '32px',
  width: '90%',
  maxWidth: '360px',
  border: '1px solid rgba(255, 77, 77, 0.2)',
  outline: 'none',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '24px',
});

const StarsModal = styled(Modal)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const StarsModalContent = styled(Box)({
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
  position: 'relative',
  zIndex: 9999
});

interface TwoFieldsComponentProps {
  open: boolean;
  onClose: () => void;
}

interface TelegramWebApp {
  ready: () => void;
  MainButton: {
    text: string;
    show: () => void;
    hide: () => void;
    onClick: (callback: () => void) => void;
  };
  showInvoice: (params: {
    title: string;
    description: string;
    payload: string;
    currency: string;
    prices: Array<{
      label: string;
      amount: number;
    }>;
  }) => Promise<{
    status: 'paid' | 'failed' | 'cancelled';
    payload?: string;
  }>;
  initDataUnsafe?: {
    user?: {
      language_code?: string;
      id?: number;
      first_name?: string;
      last_name?: string;
      username?: string;
    };
    start_param?: string;
  };
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

const TwoFieldsComponent: React.FC<TwoFieldsComponentProps> = ({ open, onClose }) => {
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');
  const [userData, setUserData] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [] = useState<string>('');
  const [tonPrice, setTonPrice] = useState<number>(0);
  const [step, setStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showMinWithdrawModal, setShowMinWithdrawModal] = useState(false);
  const [showStarsModal, setShowStarsModal] = useState(false);
  const [isProcessingStars] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [showLevelUpSuccess, setShowLevelUpSuccess] = useState(false);
  const [showSwapDrawer, setShowSwapDrawer] = useState(false);
  const [ticketError, setTicketError] = useState<string>('');

  useEffect(() => {
    if (!open) {
      setAmount('');
      setAddress('');
      setErrorMessage('');
      setStep(1);
      setShowSuccess(false);
    }
  }, [open]);

  useEffect(() => {
    // Fetch the TON/USDT price from Binance API
    const fetchTonPrice = async () => {
      try {
        const response = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=TONUSDT');
        const data = await response.json();
        if (data && data.price) {
          setTonPrice(parseFloat(data.price));
        }
      } catch (error) {
        console.error("Error fetching TON price:", error);
      }
    };

    fetchTonPrice();

    // Fetch price every minute
    const interval = setInterval(fetchTonPrice, 60000);

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
        setUserData(docSnap.data());
      } else {
        console.log("No such document!");
      }
    });

    return () => unsubscribe();
  }, []);

  // Modify the useEffect for validation
  useEffect(() => {
    if (!amount || amount === '0') {
      setErrorMessage('');
      return;
    }

    const withdrawAmount = Number(amount);
    
    // Check if it's a valid number
    if (isNaN(withdrawAmount)) {
      setErrorMessage('Please enter a valid amount');
      return;
    }

    // Check if amount is less than or equal to 1
    if (withdrawAmount <= 1) {
      setErrorMessage('Minimum withdrawal amount is 1 TON');
      return;
    }

    const enteredAmount = withdrawAmount * 1000;
    
    // Check balance requirement
    if (userData?.total < enteredAmount) {
      setErrorMessage('Insufficient Balance');
      return;
    }

    // Clear error if all validations pass
    setErrorMessage('');
  }, [amount, userData?.total]);

  const handleNumberClick = (num: string) => {
    if (num === 'backspace') {
      setAmount(prev => prev.slice(0, -1));
      return;
    }
    
    if (num === '.' && amount.includes('.')) return;
    
    const newAmount = amount + num;
    if (newAmount.split('.')[1]?.length > 2) return;
    
    setAmount(newAmount);
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
      setAddress('');
    } else {
      onClose();
    }
  };

  const handleContinue = () => {
    if (!amount || isNaN(Number(amount))) {
      return;
    }

    if (errorMessage) {
      return;
    }

    setStep(2);
  };


  const getLevelRequirements = (amount: number): { requiredLevel: number, requiredTickets: number } => {
    if (amount <= 3) return { requiredLevel: 1, requiredTickets: 1 };
    if (amount <= 5) return { requiredLevel: 1, requiredTickets: 1 };
    if (amount <= 10) return { requiredLevel: 2, requiredTickets: 3 }; // 1 + 2
    if (amount <= 15) return { requiredLevel: 3, requiredTickets: 6 }; // 1 + 2 + 3
    if (amount <= 20) return { requiredLevel: 4, requiredTickets: 10 }; // 1 + 2 + 3 + 4
    if (amount <= 25) return { requiredLevel: 5, requiredTickets: 15 }; // 1 + 2 + 3 + 4 + 5
    if (amount <= 30) return { requiredLevel: 6, requiredTickets: 21 }; // 1 + 2 + 3 + 4 + 5 + 6
    if (amount <= 35) return { requiredLevel: 7, requiredTickets: 28 }; // 1 + 2 + 3 + 4 + 5 + 6 + 7
    if (amount <= 40) return { requiredLevel: 8, requiredTickets: 36 }; // 1 + 2 + 3 + 4 + 5 + 6 + 7 + 8
    if (amount <= 45) return { requiredLevel: 9, requiredTickets: 45 }; // 1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 + 9
    return { requiredLevel: 10, requiredTickets: 55 }; // 1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 + 9 + 10
  };


  const handleLevelUpgrade = async () => {
    setIsUpgrading(true);
    setTicketError('');

    const telegramUserId = localStorage.getItem("telegramUserId");
    if (!telegramUserId) {
      setTicketError('User ID not found');
      setIsUpgrading(false);
      return;
    }

    try {
      const userRef = doc(db, "users", telegramUserId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        setTicketError('User data not found');
        setIsUpgrading(false);
        return;
      }

      const userData = userDoc.data();
      const currentLevel = userData.level || 0;
      const nextLevel = currentLevel + 1;
      const requiredTickets = nextLevel;
      
      if (!userData.tickets || userData.tickets < requiredTickets) {
        setTicketError(`Not enough tickets. Need ${requiredTickets} tickets for level ${nextLevel}`);
        setIsUpgrading(false);
        return;
      }

      await updateDoc(userRef, {
        level: nextLevel,
        tickets: userData.tickets - requiredTickets,
        lastLevelUpgrade: new Date().toISOString(),
        upgradeTransaction: {
          amount: requiredTickets,
          timestamp: new Date().toISOString(),
          type: 'TICKET_UPGRADE',
          fromLevel: currentLevel,
          toLevel: nextLevel
        }
      });

      setShowStarsModal(false);
      setShowLevelUpSuccess(true);
      
      setTimeout(() => {
        setShowLevelUpSuccess(false);
      }, 2000);

    } catch (error) {
      console.error("Error processing level upgrade:", error);
      setTicketError('Failed to process upgrade. Please try again.');
    } finally {
      setIsUpgrading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!address) {
      setErrorMessage('Please enter a valid address');
      return;
    }

    if (address.length !== 48) {
      setErrorMessage('Please check your TON wallet address format');
      return;
    }

    const withdrawAmount = Number(amount);
    const enteredAmount = withdrawAmount * 1000;
    
    // Check balance requirement first
    if (userData?.total < enteredAmount) {
      setErrorMessage('Insufficient Balance');
      return;
    }

    // If balance is sufficient, then check level requirement
    const { requiredLevel } = getLevelRequirements(withdrawAmount);
    const currentLevel = userData?.level || 0;
    
    if (currentLevel < requiredLevel) {
      setShowStarsModal(true);
      return;
    }

    const telegramUserId = localStorage.getItem("telegramUserId");
    if (!telegramUserId) {
      console.error("Telegram User ID not found!");
      return;
    }

    const newTotal = userData.total - enteredAmount;
    const processId = new Date().getTime().toString();

    try {
      const userRef = doc(db, "users", telegramUserId);
      await updateDoc(userRef, {
        [`fields.${processId}`]: {
          field1: address,
          field2: amount,
          completed: false,
        },
        total: newTotal,
      });
      
      setShowSuccess(true);
      
      setTimeout(() => {
        setShowSuccess(false);
        setAmount('');
        setAddress('');
        setStep(1);
        onClose();
      }, 2000);
      
    } catch (error) {
      console.error("Error saving withdrawal request:", error);
      setErrorMessage('An error occurred during the withdrawal process');
    }
  };

  const usdValue = Number(amount) * tonPrice;

  const content = (
    <Box // @ts-ignore
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
      color: '#fff',
      position: 'relative',
      minHeight: '60vh',
 
    }}>
      <Box sx={{
        display: 'flex',
        width: '90%',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 3,    
        mt:3,
        position: 'relative',
      }}>
        <Button
          onClick={handleBack}
          sx={{
            color: 'rgba(255, 255, 255, 0.5)',
            '&:hover': { color: '#fff' },
            minWidth: '40px',
            padding: '8px'
          }}
        >
          {step === 2 ? <ArrowBackIosNewIcon /> : <CloseIcon fontSize="medium" />}
        </Button>
        <Typography 
          variant="h6" 
          sx={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            opacity: 0.7
          }}
        >
          Withdraw TON
        </Typography>
        <Box sx={{ width: 40 }} /> {/* Spacing için boş box */}
      </Box>

      <DrawerContent>
        <Fade in={showSuccess} timeout={500}>
          <Box sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(26, 33, 38, 0.98)',
            zIndex: 9999,
          }}>
            <CheckCircleOutlineIcon sx={{ 
              fontSize: 80, 
              color: '#4CAF50',
              mb: 2,
              animation: 'pop 0.3s ease-out',
              '@keyframes pop': {
                '0%': {
                  transform: 'scale(0.8)',
                  opacity: 0,
                },
                '100%': {
                  transform: 'scale(1)',
                  opacity: 1,
                },
              },
            }} />
            <Typography variant="h6" sx={{ 
              color: '#fff',
              animation: 'fadeIn 0.3s ease-out 0.2s both',
              '@keyframes fadeIn': {
                '0%': {
                  opacity: 0,
                  transform: 'translateY(10px)',
                },
                '100%': {
                  opacity: 1,
                  transform: 'translateY(0)',
                },
              },
            }}>
              Withdrawal Successful
            </Typography>
          </Box>
        </Fade>

        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          width: '90%',
          mb: 3,
        }}>
          <img 
            src={ton}
            alt="TON Logo" 
            style={{ 
              width: '48px',
              height: '48px',
            }} 
          />
          <Typography variant="h3" sx={{ 
            fontSize: '48px',
            fontWeight: 'bold',
          }}>
            {amount || '0'}
          </Typography>
        </Box>

        {step === 1 && (
          <>
            <Box sx={{
              width: '90%',
              mb: 2,
              display: 'flex',
              gap: 1,
              justifyContent: 'center',
            }}>
              <Button
                onClick={() => {
                  if (userData?.total) {
                    const maxAmount = userData.total / 1000;
                    setAmount((maxAmount * 0.25).toFixed(2));
                  }
                }}
                sx={{
                  color: '#6ed3ff',
                  fontSize: '0.75rem',
                  padding: '4px 12px',
                  minWidth: 'unset',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(110, 211, 255, 0.1)',
                  border: '1px solid rgba(110, 211, 255, 0.2)',
                  '&:hover': {
                    backgroundColor: 'rgba(110, 211, 255, 0.15)',
                  }
                }}
              >
                25%
              </Button>
              <Button
                onClick={() => {
                  if (userData?.total) {
                    const maxAmount = userData.total / 1000;
                    setAmount((maxAmount * 0.5).toFixed(2));
                  }
                }}
                sx={{
                  color: '#6ed3ff',
                  fontSize: '0.75rem',
                  padding: '4px 12px',
                  minWidth: 'unset',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(110, 211, 255, 0.1)',
                  border: '1px solid rgba(110, 211, 255, 0.2)',
                  '&:hover': {
                    backgroundColor: 'rgba(110, 211, 255, 0.15)',
                  }
                }}
              >
                50%
              </Button>
              <Button
                onClick={() => {
                  if (userData?.total) {
                    const maxAmount = userData.total / 1000;
                    setAmount((maxAmount * 0.75).toFixed(2));
                  }
                }}
                sx={{
                  color: '#6ed3ff',
                  fontSize: '0.75rem',
                  padding: '4px 12px',
                  minWidth: 'unset',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(110, 211, 255, 0.1)',
                  border: '1px solid rgba(110, 211, 255, 0.2)',
                  '&:hover': {
                    backgroundColor: 'rgba(110, 211, 255, 0.15)',
                  }
                }}
              >
                75%
              </Button>
              <Button
                onClick={() => setAmount(userData?.total ? (userData.total / 1000).toFixed(2) : '0')}
                sx={{
                  color: '#6ed3ff',
                  fontSize: '0.75rem',
                  padding: '4px 12px',
                  minWidth: 'unset',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(110, 211, 255, 0.1)',
                  border: '1px solid rgba(110, 211, 255, 0.2)',
                  '&:hover': {
                    backgroundColor: 'rgba(110, 211, 255, 0.15)',
                  }
                }}
              >
                Max
              </Button>
            </Box>

            {errorMessage && step === 1 && !showStarsModal && (
              <Typography 
                sx={{ 
                  color: '#ff4d4d',
                  fontSize: '0.85rem',
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 0.5,
                  padding: '8px 12px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255, 77, 77, 0.1)',
                  width: '90%',
                  textAlign: 'center',
                  position: 'relative',
                  zIndex: 1
                }}
              >
                {errorMessage}
              </Typography>
            )}

            <Typography sx={{ 
              fontSize: '0.85rem',
              color: 'rgba(255, 255, 255, 0.7)',
              mb: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              width: '90%'
            }}>
              <Box sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: '#6ed3ff'
              }} />
              Amount Details
            </Typography>
            <Box sx={{
              width: '90%',
              mb: 3,
      px: 2,
              py:1,              backgroundColor: 'rgba(110, 211, 255, 0.05)',
              borderRadius: '12px',
              border: '1px solid rgba(110, 211, 255, 0.1)',
            }}>
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 0.5
              }}>
                <Typography sx={{ 
                  fontSize: '1.2rem',
                  color: '#fff',
                  fontWeight: 500
                }}>
                  $ {usdValue.toFixed(2)}
                </Typography>
                <Typography sx={{ 
                  fontSize: '0.75rem',
                  color: 'rgba(255, 255, 255, 0.5)'
                }}>
                  1 TON ≈ ${tonPrice.toFixed(2)}
                </Typography>
              </Box>
            </Box>

            <Typography sx={{ 
              fontSize: '0.85rem',
              color: 'rgba(255, 255, 255, 0.7)',
              mb: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              width: '90%'
            }}>
              <Box sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: '#fff'
              }} />
              Available Balance
            </Typography>
            <Box sx={{
              width: '90%',
              mb: 3,
              px: 2,
              py:1,
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}>
              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <Typography sx={{ 
                  fontSize: '0.8rem',
                  color: 'rgba(255, 255, 255, 0.6)'
                }}>
                  Balance
                </Typography>
                <Box sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end'
                }}>
                  <Typography sx={{ 
                    fontSize: '0.8rem',
                    color: '#fff',
                    fontWeight: 500
                  }}>
                    {userData?.total ? (userData.total / 1000).toFixed(2) : '0'} TON
                  </Typography>
                  <Typography sx={{ 
                    fontSize: '0.75rem',
                    color: 'rgba(255, 255, 255, 0.5)'
                  }}>
                    ≈ ${((userData?.total ? userData.total / 1000 : 0) * tonPrice).toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </>
        )}

        {step === 2 && (
          <>
            <Typography sx={{ 
              fontSize: '0.85rem',
              color: 'rgba(255, 255, 255, 0.7)',
              mb: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              width: '90%'
            }}>
              <Box sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: '#6ed3ff'
              }} />
              Recipient Address
            </Typography>
            <Box sx={{
              width: '98%',
              mb: 3,
              backgroundColor: 'rgba(110, 211, 255, 0.05)',
              borderRadius: '12px',
              border: '1px solid rgba(110, 211, 255, 0.1)',
              position: 'relative'
            }}>
              <TextField
                fullWidth
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter TON wallet address"
                error={address.length > 0 && address.length !== 48}
                helperText={address.length > 0 && address.length !== 48 ? "TON address must be 48 characters long" : ""}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    height: '56px',
                    paddingRight: '56px',
                    '& fieldset': {
                      borderColor: 'transparent',
                      borderRadius: '12px',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(110, 211, 255, 0.2)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'rgba(110, 211, 255, 0.3)',
                    },
                    '& input': {
                      padding: '0 16px',
                      fontSize: '14px',
                      '&::placeholder': {
                        color: 'rgba(255, 255, 255, 0.5)',
                        opacity: 1,
                      },
                    },
                  },
                  '& .MuiFormHelperText-root': {
                    color: '#ff4d4d',
                    marginLeft: '4px',
                    marginTop: '4px',
                    fontSize: '12px',
                  },
                }}
              />
              <Button
                onClick={async () => {
                  try {
                    const text = await navigator.clipboard.readText();
                    setAddress(text);
                  } catch (err) {
                    console.error('Failed to read clipboard:', err);
                  }
                }}
                sx={{
                  position: 'absolute',
                  right: '8px',
                  top: '8px',
                  minWidth: 'unset',
                  height: '40px',
                  color: '#6ed3ff',
                  fontSize: '0.75rem',
                  padding: '4px 12px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(110, 211, 255, 0.1)',
                  border: '1px solid rgba(110, 211, 255, 0.2)',
              
                }}
              >
                Paste
              </Button>
            </Box>

            {errorMessage && step === 2 && !showStarsModal && (
              <Typography 
                sx={{ 
                  color: '#ff4d4d',
                  fontSize: '0.85rem',
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 0.5,
                  padding: '8px 12px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255, 77, 77, 0.1)',
                  width: '90%',
                  textAlign: 'center',
                  position: 'relative',
                  zIndex: 1
                }}
              >
                {errorMessage}
              </Typography>
            )}

            <Typography sx={{ 
              fontSize: '0.85rem',
              color: 'rgba(255, 255, 255, 0.7)',
              mb: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              width: '90%'
            }}>
              <Box sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: '#6ed3ff'
              }} />
              Transaction Details
            </Typography>
            <Box sx={{
              width: '90%',
              mb: 3,
              p: 2,
              backgroundColor: 'rgba(110, 211, 255, 0.05)',
              borderRadius: '12px',
              border: '1px solid rgba(110, 211, 255, 0.1)',
            }}>
              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 1
              }}>
                <Typography sx={{ 
                  fontSize: '0.8rem',
                  color: 'rgba(255, 255, 255, 0.6)'
                }}>
                  You Send
                </Typography>
                <Box sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end'
                }}>
                  <Typography sx={{ 
                    fontSize: '0.8rem',
                    color: '#fff',
                    fontWeight: 500
                  }}>
                    {amount} TON
                  </Typography>
                  <Typography sx={{ 
                    fontSize: '0.75rem',
                    color: 'rgba(255, 255, 255, 0.5)'
                  }}>
                    ≈ ${usdValue.toFixed(2)}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 1
              }}>
                <Typography sx={{ 
                  fontSize: '0.8rem',
                  color: 'rgba(255, 255, 255, 0.6)'
                }}>
                  Network Fee
                </Typography>
                <Box sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end'
                }}>
                  <Typography sx={{ 
                    fontSize: '0.8rem',
                    color: '#fff',
                    fontWeight: 500
                  }}>
                    ~0.05 TON
                  </Typography>
                  <Typography sx={{ 
                    fontSize: '0.75rem',
                    color: 'rgba(255, 255, 255, 0.5)'
                  }}>
                    ≈ ${(0.05 * tonPrice).toFixed(2)}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                pt: 1,
                mt: 1,
                borderTop: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <Typography sx={{ 
                  fontSize: '0.8rem',
                  color: 'rgba(255, 255, 255, 0.6)'
                }}>
                  Total Amount
                </Typography>
                <Box sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end'
                }}>
                  <Typography sx={{ 
                    fontSize: '0.8rem',
                    color: '#fff',
                    fontWeight: 600
                  }}>
                    {(Number(amount) + 0.05).toFixed(2)} TON
                  </Typography>
                  <Typography sx={{ 
                    fontSize: '0.75rem',
                    color: 'rgba(255, 255, 255, 0.5)'
                  }}>
                    ≈ ${((Number(amount) + 0.05) * tonPrice).toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Typography sx={{ 
              fontSize: '0.75rem',
              color: 'rgba(255, 255, 255, 0.5)',
              mb: 3,
              textAlign: 'center',
              width: '90%'
            }}>
              Please double-check the address before confirming the transaction
            </Typography>
          </>
        )}
      </DrawerContent>

      {step === 1 ? (
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

            <Box sx={{ mt: 1,    px: 1, }}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleContinue}
                sx={{
                  backgroundColor: '#6ed3ff',
                  color: '#1a2126',
                  height: '44px',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: '#89d9ff',
                  },
                  '&:disabled': {
                    backgroundColor: 'rgba(110, 211, 255, 0.3)',
                    color: 'rgba(255, 255, 255, 0.3)',
                  },
                }}
              >
                Continue
              </Button>
            </Box>
          </Box>
        </KeyboardContainer>
      ) : (
        <Box sx={{ 
          position: 'fixed', 
          bottom: 0, 
          left: 0, 
          right: 0,
          px: 1,
          pb: 'env(safe-area-inset-bottom, 22px)',
          backdropFilter: 'blur(20px)',
          zIndex: 1300,
        }}>
          <Button
            fullWidth
            variant="contained"
            onClick={handleWithdraw}
            sx={{
              backgroundColor: '#6ed3ff',
              color: '#1a2126',
              height: '44px',
              mb: 1,
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: '#89d9ff',
              },
              '&:disabled': {
                backgroundColor: 'rgba(110, 211, 255, 0.3)',
                color: 'rgba(255, 255, 255, 0.3)',
              },
            }}
          >
            Withdraw
          </Button>
        </Box>
      )}
    </Box>
  );

  return (
    <StyledDrawer
      anchor="bottom"
      open={open}
      onClose={onClose}
    >
      {content}
      <MinWithdrawModal
        open={showMinWithdrawModal}
        onClose={() => setShowMinWithdrawModal(false)}
      >
        <MinWithdrawContent>
          <Box sx={{ 
            width: '64px', 
            height: '64px', 
            borderRadius: '50%', 
            backgroundColor: 'rgba(255, 77, 77, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <ErrorOutlineIcon sx={{ fontSize: 32, color: '#ff4d4d' }} />
          </Box>
          <Typography sx={{ 
            color: 'white', 
            fontSize: '18px', 
            fontWeight: '500',
            textAlign: 'center'
          }}>
            Minimum Withdrawal Amount
          </Typography>
          <Typography sx={{ 
            color: 'rgba(255, 255, 255, 0.7)', 
            fontSize: '14px',
            textAlign: 'center'
          }}>
            The minimum withdrawal amount is 3 TON
          </Typography>
          <Button
            fullWidth
            onClick={() => setShowMinWithdrawModal(false)}
            sx={{
              backgroundColor: 'rgba(255, 77, 77, 0.1)',
              color: '#ff4d4d',
              height: '44px',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '500',
              '&:hover': {
                backgroundColor: 'rgba(255, 77, 77, 0.2)',
              },
            }}
          >
            Close
          </Button>
        </MinWithdrawContent>
      </MinWithdrawModal>
      <StarsModal
        open={showStarsModal}
        onClose={() => !isProcessingStars && setShowStarsModal(false)}
      >
        <StarsModalContent>
          <Box sx={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
            width: '100%'
          }}>
            {/* Header Section */}
            <Box sx={{ 
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2
            }}>
              <Box sx={{ 
                width: '64px', 
                height: '64px', 
                borderRadius: '50%', 
                backgroundColor: 'rgba(110, 211, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'pulse 2s infinite',
                '@keyframes pulse': {
                  '0%': {
                    boxShadow: '0 0 0 0 rgba(110, 211, 255, 0.4)',
                  },
                  '70%': {
                    boxShadow: '0 0 0 10px rgba(110, 211, 255, 0)',
                  },
                  '100%': {
                    boxShadow: '0 0 0 0 rgba(110, 211, 255, 0)',
                  },
                },
              }}>
                <StarIcon sx={{ 
                  fontSize: 32, 
                  color: '#6ed3ff',
                  animation: 'rotate 2s infinite linear',
                  '@keyframes rotate': {
                    '0%': {
                      transform: 'rotate(0deg)',
                    },
                    '100%': {
                      transform: 'rotate(360deg)',
                    },
                  },
                }} />
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography sx={{ 
                  color: 'white', 
                  fontSize: '20px', 
                  fontWeight: '600',
                  mb: 1
                }}>
                  Level Upgrade Required
                </Typography>
                <Typography sx={{ 
                  color: 'rgba(255, 255, 255, 0.7)', 
                  fontSize: '14px',
                  lineHeight: 1.5
                }}>
                  {(function() {
                    const currentLevel = userData?.level || 0;
                    const nextLevel = currentLevel + 1;
                    const withdrawAmount = Number(amount);
                    const { requiredLevel } = getLevelRequirements(withdrawAmount);
                    
                    if (currentLevel === 0) {
                      return `Upgrade to Level 1 to continue`;
                    } else if (currentLevel < requiredLevel) {
                      return `Upgrade to Level ${nextLevel} to continue.`;
                    }
                    return `Maximum level reached for this withdrawal amount`;
                  })()}
                </Typography>
              </Box>
            </Box>

            {/* Level Info Section */}
            <Box sx={{
              width: '100%',
              display: 'flex',
              gap: 2
            }}>
              <Box sx={{
                flex: 1,
                backgroundColor: 'rgba(110, 211, 255, 0.05)',
                borderRadius: '16px',
                padding: '16px',
                border: '1px solid rgba(110, 211, 255, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1
              }}>
                <Typography sx={{ 
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Current Level
                </Typography>
                <Typography sx={{ 
                  color: '#6ed3ff',
                  fontSize: '24px',
                  fontWeight: '600'
                }}>
                  {userData?.level || 0}
                </Typography>
              </Box>
              <Box sx={{
                flex: 1,
                backgroundColor: 'rgba(110, 211, 255, 0.05)',
                borderRadius: '16px',
                padding: '16px',
                border: '1px solid rgba(110, 211, 255, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1
              }}>
                <Typography sx={{ 
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Your Tickets
                </Typography>
                <Typography sx={{ 
                  color: '#6ed3ff',
                  fontSize: '24px',
                  fontWeight: '600'
                }}>
                  {userData?.tickets || 0}
                </Typography>
              </Box>
            </Box>

            {/* Error Message */}
            {ticketError && (
              <Typography sx={{ 
                color: '#ff4d4d', 
                fontSize: '14px',
                textAlign: 'center',
                padding: '8px 12px',
                backgroundColor: 'rgba(255, 77, 77, 0.1)',
                borderRadius: '8px',
                width: '100%'
              }}>
                {ticketError}
              </Typography>
            )}

            {/* Action Buttons */}
            <Box sx={{ 
              width: '100%', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 2 
            }}>
              <Button
                fullWidth
                onClick={handleLevelUpgrade}
                disabled={isUpgrading || !userData?.tickets || userData?.tickets < (userData?.level + 1 || 1)}
                sx={{
                  backgroundColor: 'rgba(110, 211, 255, 0.1)',
                  color: '#6ed3ff',
                  height: '48px',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '600',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: 'rgba(110, 211, 255, 0.2)',
                  },
                  '&:disabled': {
                    backgroundColor: 'rgba(110, 211, 255, 0.05)',
                    color: 'rgba(110, 211, 255, 0.3)',
                  }
                }}
              >
                {isUpgrading ? 'Processing...' : 'Use Upgrade Ticket'}
              </Button>

              {(!userData?.tickets || userData?.tickets < (userData?.level + 1 || 1)) && (
                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1 }}>
                 
                  <Button
                    fullWidth
                    onClick={() => {
                      const currentLevel = userData?.level || 0;
                      const nextLevel = currentLevel + 1;
                      const currentTickets = userData?.tickets || 0;
                      const neededTickets = nextLevel - currentTickets;
                      setShowStarsModal(false);
                      setShowSwapDrawer(true);
                      return neededTickets; // Bu değer SwapDrawer'a defaultAmount olarak geçecek
                    }}
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      color: '#fff',
                      height: '48px',
                      borderRadius: '12px',
                      fontSize: '16px',
                      fontWeight: '600',
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      }
                    }}
                  >
                    Get More Tickets
                  </Button>
                   <Typography sx={{ 
                    color: 'rgba(255, 255, 255, 0.7)', 
                    fontSize: '14px',
                    textAlign: 'center',
                    padding: '8px 12px',
                    borderRadius: '8px',
                  }}>
                    {(() => {
                      const currentLevel = userData?.level || 0;
                      const nextLevel = currentLevel + 1;
                      const currentTickets = userData?.tickets || 0;
                      const neededTickets = nextLevel - currentTickets;
                      return `You need ${neededTickets} more ticket${neededTickets > 1 ? 's' : ''} to reach Level ${nextLevel}`;
                    })()}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </StarsModalContent>
      </StarsModal>

      <Modal
        open={showLevelUpSuccess}
        onClose={() => setShowLevelUpSuccess(false)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box sx={{
          backgroundColor: 'rgba(18, 22, 25, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '32px',
          width: '90%',
          maxWidth: '360px',
          border: '1px solid rgba(110, 211, 255, 0.2)',
          outline: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px',
          animation: 'popIn 0.3s ease-out',
          '@keyframes popIn': {
            '0%': {
              transform: 'scale(0.9)',
              opacity: 0,
            },
            '100%': {
              transform: 'scale(1)',
              opacity: 1,
            },
          },
        }}>
          <Box sx={{ 
            width: '80px', 
            height: '80px', 
            borderRadius: '50%', 
            backgroundColor: 'rgba(110, 211, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'pulse 1s ease-out infinite'
          }}>
            <StarIcon sx={{ 
              fontSize: 40, 
              color: '#6ed3ff',
              animation: 'rotate 1s ease-out'
            }} />
          </Box>
          <Typography sx={{ 
            color: '#6ed3ff',
            fontSize: '24px',
            fontWeight: '500',
            textAlign: 'center'
          }}>
            Level Up!
          </Typography>
          <Typography sx={{ 
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '16px',
            textAlign: 'center'
          }}>
            {`You've reached Level ${userData?.level || 1}`}
          </Typography>
        </Box>
      </Modal>
      <SwapDrawer
        open={showSwapDrawer}
        onClose={() => setShowSwapDrawer(false)}
        defaultAmount={(() => {
          if (!showSwapDrawer) return undefined;
          const currentLevel = userData?.level || 0;
          const nextLevel = currentLevel + 1;
          const currentTickets = userData?.tickets || 0;
          return nextLevel - currentTickets;
        })()}
        onSwapComplete={() => {
          setShowSwapDrawer(false);
          setShowStarsModal(true);
        }}
      />
    </StyledDrawer>
  );
};

export default TwoFieldsComponent;
