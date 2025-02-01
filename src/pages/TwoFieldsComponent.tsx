import React, { useEffect, useState } from 'react';
import { Button, Typography, Box, TextField, Fade, Drawer, styled, Grid } from '@mui/material';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { firebaseConfig } from './firebaseConfig';
import ton from '../assets/kucukTON.png';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import BackspaceIcon from '@mui/icons-material/Backspace';

// Firebase initialization
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const StyledDrawer = styled(Drawer)(({ }) => ({
  '& .MuiDrawer-paper': {
    background: 'linear-gradient(180deg, rgba(26, 33, 38, 0.99) 0%, rgba(26, 33, 38, 0.95) 100%)',
    borderRadius: '24px 24px 0 0',
    padding: '24px',
    height: '80vh',
    border: '1px solid rgba(110, 211, 255, 0.1)',
  }
}));
const KeyboardContainer = styled(Box)({
  backdropFilter: 'blur(20px)',
  borderTop: '1px solid rgba(110, 211, 255, 0.1)',
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  paddingBottom: 'env(safe-area-inset-bottom, 16px)',
});


const KeyboardButton = styled(Button)({
  color: 'white',
  borderRadius: '8px',
  width: '100%',
  height: '42px',
  fontSize: '20px',
  fontWeight: '500',

});

interface TwoFieldsComponentProps {
  open: boolean;
  onClose: () => void;
}

const TwoFieldsComponent: React.FC<TwoFieldsComponentProps> = ({ open, onClose }) => {
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');
  const [userData, setUserData] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [tonPrice, setTonPrice] = useState<number>(0);
  const [step, setStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);

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
      setErrorMessage('Please enter a valid amount');
      return;
    }

    const enteredAmount = Number(amount) * 1000;

    if (userData?.total < enteredAmount) {
      setErrorMessage('Insufficient Balance');
      return;
    }

    setStep(2);
    setErrorMessage('');
  };

  const handleWithdraw = async () => {
    if (!address) {
      setErrorMessage('Please enter a valid address');
      return;
    }

    // TON address validation
    if (address.length !== 48) {
      setErrorMessage('Please check your TON wallet address format');
      return;
    }

    const telegramUserId = localStorage.getItem("telegramUserId");
    if (!telegramUserId) {
      console.error("Telegram User ID not found!");
      return;
    }

    const enteredAmount = Number(amount) * 1000;
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
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
      color: '#fff',
      position: 'relative',
      maxHeight: '80vh',
      pb: 'calc(320px + env(safe-area-inset-bottom, 16px))',
    }}>
      <Box sx={{
        display: 'flex',
        width: '100%',
        justifyContent: 'flex-start',
        mb: 3,
      }}>
        <Button
          onClick={handleBack}
          sx={{
            color: 'rgba(255, 255, 255, 0.5)',
            '&:hover': { color: '#fff' }
          }}
        >
          {step === 2 ? <ArrowBackIosNewIcon /> : '✖'}
        </Button>
      </Box>

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

      <Typography variant="h6" sx={{mb:4, mt: -6, opacity: 0.7 }}>
        Withdraw TON
      </Typography>

      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <img 
          src={ton}
          alt="TON Logo" 
          style={{ 
            width: '48px',
            height: '48px',
            marginBottom: '8px'
          }} 
        />
        <Typography sx={{ opacity: 0.7 }}>
          {step === 1 ? 'Enter Amount' : 'Enter Address'}
        </Typography>
      </Box>

      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        mb: 3,
      }}>
        <Typography variant="h3" sx={{ 
          fontSize: '48px',
          fontWeight: 'bold',
          mb: 1,
        }}>
          {amount || '0'}
        </Typography>
        <Typography sx={{ opacity: 0.7 }}>
          $ {usdValue.toFixed(2)}
        </Typography>
      </Box>

      <Box sx={{
        width: '100%',
        mb: 2,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
      }}>
        <Typography sx={{ opacity: 0.7 }}>
          Remaining Balance
        </Typography>
        <Typography>
          {userData?.total ? (userData.total / 1000).toFixed(2) : '0'} TON
        </Typography>
      </Box>

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

            <Box sx={{ mt: 1, px: 0.5 }}>
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
        <Box sx={{ width: '100%', mb: 3 }}>
          <TextField
            fullWidth
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter TON address"
            error={address.length > 0 && address.length !== 48}
            helperText={address.length > 0 && address.length !== 48 ? "TON address must be 48 characters long" : ""}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#fff',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.23)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#0066FF',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.7)',
              },
              '& .MuiFormHelperText-root': {
                color: 'error.main',
                marginLeft: 0,
              },
            }}
          />

          <Box sx={{ 
            position: 'fixed', 
            bottom: 0, 
            left: 0, 
            right: 0, 
           px: 1,
            pb: 'env(safe-area-inset-bottom, 16px)',
            backgroundColor: 'rgba(18, 22, 25, 0.95)',
            backdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(110, 211, 255, 0.1)',
          }}>
            <Button
              fullWidth
              
              variant="contained"
              onClick={handleWithdraw}
              sx={{
                backgroundColor: '#6ed3ff',
                color: '#1a2126',
                height: '44px',
                mb:1,                borderRadius: '12px',
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
        </Box>
      )}

      {errorMessage && (
        <Typography color="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Typography>
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
    </StyledDrawer>
  );
};

export default TwoFieldsComponent;
