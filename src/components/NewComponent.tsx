import React, { useState, useCallback, useEffect } from 'react';
import { Card,CardContent, Typography, Grid,  Box, Button, Drawer, Accordion, AccordionSummary, AccordionDetails, TextField, Modal, LinearProgress, InputAdornment, ToggleButton, ToggleButtonGroup,  CircularProgress, CircularProgressProps } from '@mui/material';
import { AccessTime,  Lock, Shield, Security } from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { doc,  getFirestore, setDoc, updateDoc, increment, arrayUnion, onSnapshot, getDoc } from 'firebase/firestore'; // Import Firestore functions
import { app } from '../pages/firebaseConfig'; // Import your Firebase app
import { v4 as uuidv4 } from 'uuid'; // Import UUID for generating unique IDs
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import tonLogo from '../assets/toncoin-ton-logo.png'; // Logo dosyasını import et
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { styled } from '@mui/material/styles';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SlotCounter from 'react-slot-counter'; // Kütüphaneyi içe aktar
import WebApp from '@twa-dev/sdk';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import "./text.css";
import { Chip } from '@mui/material';

import { TrustIndicator } from './TrustIndicator'; // Import TrustIndicator component



interface NewComponentProps {}


// Function to calculate APY based on the amount staked and period
const calculateAPY = (amount: number, period: string): number => {
    if (period === '1 D') {
        // 1 günlük için en düşük getiri (yüksek min. yatırım)
        if (amount < 100) return 2487;
        if (amount < 250) return 2620;
        if (amount < 500) return 3163;
        if (amount < 1000) return 3901;
        return 6211;
    } 
    else if (period === '14 D') {
        // 14 günlük için orta seviye getiri
        if (amount < 100) return 15;
        if (amount < 250) return 18;
        if (amount < 500) return 21;
        if (amount < 1000) return 24;
        return 28;
    } 
    else if (period === '30 D') {
        // 30 günlük için yüksek getiri (14 günlükten en az %40 daha fazla)
        if (amount < 100) return 21;
        if (amount < 250) return 25;
        if (amount < 500) return 29;
        if (amount < 1000) return 34;
        return 39;
    } 
    else if (period === '90 D') {
        // 90 günlük için en yüksek getiri (30 günlükten en az %50 daha fazla)
        if (amount < 100) return 32;
        if (amount < 250) return 38;
        if (amount < 500) return 44;
        if (amount < 1000) return 51;
        return 59;
    }
    return 0;
};

// Function to calculate leverage based on amount and period
const calculateLeverage = (amount: number, period: string): number => {
    if (period === '1 D') {
        // 1 günlük için özel leverage değerleri (min yatırım 50 TON)
        if (amount < 100) return 25;
        if (amount < 250) return 20;
        if (amount < 500) return 15;
        if (amount < 1000) return 12;
        return 10;
    }
    else if (period === '14 D') {
        // 14 günlük için daha düşük leverage
        if (amount < 100) return 20;
        if (amount < 250) return 15;
        if (amount < 500) return 12;
        if (amount < 1000) return 10;
        return 8;
    }
    else if (period === '30 D') {
        // 30 günlük için yüksek leverage (en karlı seçeneklerden biri)
        if (amount < 100) return 45;
        if (amount < 250) return 35;
        if (amount < 500) return 30;
        if (amount < 1000) return 25;
        return 20;
    }
    else if (period === '90 D') {
        // 90 günlük için en yüksek leverage (en karlı seçenek)
        if (amount < 100) return 50;
        if (amount < 250) return 40;
        if (amount < 500) return 35;
        if (amount < 1000) return 30;
        return 25;
    }
    return 25; // Default değer
};

// Update staking options
const stakingOptions = [
    { 
        period: '1 D', 
        apy: calculateAPY(25, '1 D'),
        durations: [1],
        leverageOptions: [calculateLeverage(25, '1 D')],
        tonRange: { min: 50, max: 1500 }
    },
    { 
        period: '14 D', 
        apy: calculateAPY(100, '14 D'),
        durations: [14],
        leverageOptions: [calculateLeverage(100, '14 D')],
        tonRange: { min: 5, max: 1500 }
    },
    { 
        period: '30 D', 
        apy: calculateAPY(200, '30 D'),
        durations: [30],
        leverageOptions: [calculateLeverage(200, '30 D')],
        tonRange: { min: 1, max: 1500 }
    },
    { 
        period: '90 D', 
        apy: calculateAPY(300, '90 D'),
        durations: [90],
        leverageOptions: [calculateLeverage(300, '90 D')],
        tonRange: { min: 1, max: 1500 }
    },
];

// Yeni StakingCard bileşeni
interface StakingCardProps {
  option: { 
    period: string; 
    apy: number; 
    durations: number[]; 
    leverageOptions: number[]; 
    tonRange: { min: number; max: number } 
  };
  index: number;
  stakingData: {
    amount: number;
    duration: number;
    leverage: number;
  }[];
  handleAmountChange: (index: number, newAmount: number) => void;
  handleDurationChange: (index: number, newDuration: number) => void;
  calculateEarnings: (amount: number, duration: number, leverage: number, apy: number) => number;
  setSelectedOptionIndex: (index: number) => void;
  totalBalance: number | null;
  handleNavigate: () => void;
  children?: React.ReactNode;
  isCalculating: boolean;
  calculationComplete: boolean;
}

// Create a custom styled slider

// Add these new styled components for the StakingCard
const StakingCardWrapper = styled(Card)(({ }) => ({
  textAlign: 'center',
  borderRadius: '16px',
  backgroundColor: 'transparent',
  boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
  position: 'relative',
  overflow: 'visible',
  transition: 'transform 0.2s ease-in-out',
 
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '3px',
  }
}));

const AmountDisplay = styled(Box)({
  transition: 'all 0.3s ease',
 
});


// Önce yeni styled componentler ekleyelim
const StyledToggleButtonGroup = styled(ToggleButtonGroup)({
  display: 'flex',
  width: '100%',
  gap: "8px",
  backgroundColor: 'transparent',
  borderRadius: '12px',
  '& .MuiToggleButtonGroup-grouped': {
    margin: 0,
    border: 'none',
    transition: 'all 0.3s ease',
    flex: '0 1 auto', // Değiştirildi: içeriğe göre küçülsün
    minWidth: 0,
    padding: '6px 12px',
    '&:not(:first-of-type)': {
      borderRadius: '8px',
    },
    '&:first-of-type': {
      borderRadius: '8px',
    },
    '&.Mui-selected': {
      flex: '1 0 auto', // Değiştirildi: seçili olan büyüsün
      minWidth: '120px', // Seçili olan için minimum genişlik
    }
  },
});

const StyledToggleButton = styled(ToggleButton)({
  backgroundColor: 'rgba(110, 211, 255, 0.05)',
  border: '1px solid rgba(110, 211, 255, 0.1)',
  borderRadius: '8px',
  color: 'rgba(255,255,255,0.6)',
  transition: 'all 0.3s ease-in-out',
  transform: 'scale(1)',
  padding: '8px 12px',
 
  '&.Mui-selected': {
    backgroundColor: 'rgba(110, 211, 255, 0.15)',
    color: '#6ed3ff',
    borderColor: 'rgba(110, 211, 255, 0.3)',
    transform: 'scale(1.02)',
  },
});

// PeriodSelector için interface ekleyelim
interface PeriodSelectorProps {
  selectedPeriod: string;
  onPeriodChange: (event: React.MouseEvent<HTMLElement>, newPeriod: string | null) => void;
  handleAmountChange: (index: number, newAmount: number) => void;
  handleDurationChange: (index: number, newDuration: number) => void;
}

// Period seçimi için güncellenmiş component
const PeriodSelector: React.FC<PeriodSelectorProps> = ({ 
  selectedPeriod, 
  onPeriodChange,
  handleAmountChange,
  handleDurationChange
}) => {
  const handlePeriodChange = (event: React.MouseEvent<HTMLElement>, newPeriod: string | null) => {
    if (newPeriod !== null) {
      const newIndex = stakingOptions.findIndex(opt => opt.period === newPeriod);
      if (newIndex !== -1) {
        // Reset staking data for the new period
        const newStakingData = {
          amount: stakingOptions[newIndex].tonRange.min,
          duration: stakingOptions[newIndex].durations[0],
          leverage: calculateLeverage(stakingOptions[newIndex].tonRange.min, stakingOptions[newIndex].period),
        };
        
        // Call onPeriodChange with the new period and reset data
        onPeriodChange(event, newPeriod);
        
        // Update staking data with new values
        handleAmountChange(newIndex, newStakingData.amount);
        handleDurationChange(newIndex, newStakingData.duration);
      }
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      <StyledToggleButtonGroup
        value={selectedPeriod}
        exclusive
        onChange={handlePeriodChange}
        aria-label="lock period"
      >
        {stakingOptions.map((option) => (
          <StyledToggleButton 
            key={option.period} 
            value={option.period}
            aria-label={option.period}
            sx={{
              minHeight: '48px',
              ...(selectedPeriod === option.period ? {
                flex: '1 0 auto',
                minWidth: '120px',
              } : {
                flex: '0 1 auto',
                minWidth: '60px',
              })
            }}
          >
            {selectedPeriod === option.period ? (
              <Box sx={{ 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1.5,
                width: '100%',
              }}>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                }}>
                  <AccessTime sx={{ fontSize: 14 }} />
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {option.period}
                  </Typography>
                </Box>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  backgroundColor: 'rgba(110, 211, 255, 0.1)',
                  padding: '2px 8px',
                  borderRadius: '12px',
                }}>
                  <LocalFireDepartmentIcon sx={{ fontSize: 14, color: '#6ed3ff' }} />
                  <Typography 
                    variant="caption" 
                    className="text-gradient"
                    sx={{ 
                      fontWeight: 'bold',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {option.apy}%
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: 500,
                    fontSize: '0.8rem',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {option.period}
                </Typography>
              </Box>
            )}
          </StyledToggleButton>
        ))}
      </StyledToggleButtonGroup>
    </Box>
  );
};

// Update the StakingCard component
const StakingCard: React.FC<StakingCardProps> = React.memo(({
  option,
  index,
  stakingData,
  handleAmountChange,
  handleDurationChange,
  calculateEarnings,
  setSelectedOptionIndex,
  totalBalance,
  handleNavigate,
  children,
  isCalculating,
  calculationComplete
}) => {
  // Add useEffect to reset values when option changes
  useEffect(() => {
    // Reset to minimum amount and default duration when period changes
    handleAmountChange(index, option.tonRange.min);
    handleDurationChange(index, option.durations[0]);
  }, [option.period]); // Only run when period changes

  const renderTotalRepayment = () => {
    if (isCalculating) {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
          <CircularProgress size={20} sx={{ color: '#6ed3ff' }} />
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            Calculating...
          </Typography>
        </Box>
      );
    }

    if (!calculationComplete) {
      return null;
    }

    const currentOption = stakingOptions[index];
    const currentStakingData = stakingData[index];
    
    const earnings = calculateEarnings(
      currentStakingData.amount,
      currentStakingData.duration,
      currentStakingData.leverage,
      currentOption.apy
    );
    
    const totalRepayment = earnings + currentStakingData.amount;

    return (
      <Typography 
        variant="h5" 
        className="text-gradient"
        sx={{ 
          fontWeight: 'bold',
          animation: 'fadeIn 0.3s ease-in'
        }}
      >
        {totalRepayment.toFixed(2)} TON
        <span style={{color:'gray', fontWeight:'lighter', fontSize:'0.6rem', marginLeft:5}}>
          ~ ({(totalRepayment * 5.20).toFixed(2)} USDT)
        </span>
      </Typography>
    );
  };

  return (
    <Grid item key={index}>
      <StakingCardWrapper>
        <CardContent sx={{ p: 1 }}>
          <PeriodSelector 
            selectedPeriod={option.period}
            onPeriodChange={(_event, newPeriod) => {
              if (newPeriod !== null) {
                const newIndex = stakingOptions.findIndex(opt => opt.period === newPeriod);
                if (newIndex !== -1) {
                  setSelectedOptionIndex(newIndex);
                  handleDurationChange(index, stakingOptions[newIndex].durations[0]);
                }
              }
            }}
            handleAmountChange={handleAmountChange}
            handleDurationChange={handleDurationChange}
          />
          
          {/* Header Section */}
      
          {/* Amount Display Section */}   
          <AmountDisplay>
            <Box 
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                mb: 1
              }}
            >
              <Box sx={{ width: '100%' }}>
                <TextField
                  value={stakingData[index].amount}
                  onChange={(e) => {
                    const newValue = parseFloat(e.target.value);
                    if (!isNaN(newValue)) {
                      handleAmountChange(index, Math.min(Math.max(newValue, option.tonRange.min), option.tonRange.max));
                    }
                  }}
                  type="number"
                  variant="standard"
                  inputMode="decimal"
                  onFocus={() => {
                    window.scrollTo({
                      top: window.scrollY - window.innerHeight * 0.1,
                      behavior: 'smooth'
                    });
                  }}
                  inputProps={{
                    inputMode: 'decimal',
                    pattern: '[0-9]*',
                    style: { 
                      textAlign: 'center',
                      padding: '4px',
                      fontSize: '1.5rem',
                    }
                  }}
                  InputProps={{
                    disableUnderline: true,
                    startAdornment: (
                      <InputAdornment position="start">
                        <Box sx={{ borderRadius: '50%' }}>
                          <img 
                            src={tonLogo} 
                            alt="TON" 
                            style={{ 
                              width: '24px', 
                              height: '24px',
                              filter: 'drop-shadow(0 4px 8px rgba(110,211,255,0.2))'
                            }} 
                          />
                        </Box>
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            size="small"
                            onClick={() => handleAmountChange(index, Math.max(stakingData[index].amount - 10, option.tonRange.min))}
                            sx={{
                              minWidth: '32px',
                              height: '32px',
                              p: 0,
                              borderRadius: '8px',
                              backgroundColor: 'rgba(110, 211, 255, 0.1)',
                              color: '#6ed3ff',
                              '&:hover': { 
                                backgroundColor: 'rgba(110, 211, 255, 0.2)',
                              }
                            }}
                          >
                            <RemoveCircleIcon sx={{ fontSize: 20 }} />
                          </Button>
                          <Button
                            size="small"
                            onClick={() => handleAmountChange(index, Math.min(stakingData[index].amount + 10, option.tonRange.max))}
                            sx={{
                              minWidth: '32px',
                              height: '32px',
                              p: 0,
                              borderRadius: '8px',
                              backgroundColor: 'rgba(110, 211, 255, 0.1)',
                              color: '#6ed3ff',
                              '&:hover': {
                                backgroundColor: 'rgba(110, 211, 255, 0.2)',
                              }
                            }}
                          >
                            <AddCircleIcon sx={{ fontSize: 20 }} />
                          </Button>
                        </Box>
                      </InputAdornment>
                    ),
                    sx: {
                      fontSize: '2rem',
                      fontWeight: 'bold',
                      color: 'white',
                      backgroundColor: 'rgba(110, 211, 255, 0.05)',
                      borderRadius: '12px',
                      padding: '8px 12px',
                      '& input': {
                        textAlign: 'center',
                        padding: '4px',
                        '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
                          '-webkit-appearance': 'none',
                          margin: 0,
                        },
                        '&[type=number]': {
                          '-moz-appearance': 'textfield',
                        },
                      },
                    }
                  }}
                />
              
                
                {/* Min-Max Range Indicator */}
            
          {/* Available Balance */}
          <Box mt={1} display={'flex'} alignItems="center">
            <Typography variant="body1" sx={{ color: 'white' }}>
              <span style={{color:"gray", fontSize: '0.8rem'}}>
                Available : </span> {totalBalance !== null ? `${totalBalance.toFixed(2)} TON` : 'Loading...'}
            </Typography>
            <AddCircleOutlineIcon onClick={handleNavigate} fontSize='small' sx={{ ml: 1, color:'#89d9ff' }} />
          </Box>
              </Box>
            </Box>
          </AmountDisplay>

          {/* Stats Section */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={6}>
              <Box sx={{ 
                p: 1.5, 
                borderRadius: 2,
                backgroundColor: 'rgba(110, 211, 255, 0.05)',
              }}>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                  APY
                </Typography>
                <Typography 
                  variant="h6" 
                  className="text-gradient"
                  sx={{ fontWeight: 'bold' }}
                >
                  {calculateAPY(stakingData[index].amount, option.period)}%
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ 
                p: 1.5, 
                borderRadius: 2,
                backgroundColor: 'rgba(110, 211, 255, 0.05)',
              }}>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                  Leverage
                </Typography>
                <Typography 
                  variant="h6" 
                  className="text-gradient"
                  sx={{ fontWeight: 'bold' }}
                >
                  {calculateLeverage(stakingData[index].amount, option.period)}x
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Total Repayment Section */}
          <Box sx={{ mt: 2, p: 2, borderRadius: 2, backgroundColor: 'rgba(110, 211, 255, 0.05)' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                Total Repayment
              </Typography>
              {!isCalculating && calculationComplete && (
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: '#4CAF50',
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontWeight: 'bold'
                  }}
                >
                  +{((calculateEarnings(
                    stakingData[index].amount,
                    stakingData[index].duration,
                    stakingData[index].leverage,
                    option.apy
                  ) / stakingData[index].amount) * 100).toFixed(2)}%
                </Typography>
              )}
            </Box>
            {renderTotalRepayment()}
          </Box>

          {children}
        </CardContent>
      </StakingCardWrapper>
    </Grid>
  );
});

// Add this new component for the card with icons




// Ensure you are using calculateRemainingSeconds instead
const calculateRemainingSeconds = (timestamp: string, duration: number): number => {
    const stakeDate = new Date(timestamp);
    const endDate = new Date(stakeDate.getTime() + duration * 24 * 60 * 60 * 1000); // Add duration in milliseconds
    const currentDate = new Date();
    const remainingTime = currentDate.getTime() - stakeDate.getTime(); // Calculate elapsed time

    console.log(`Stake Date: ${stakeDate}, End Date: ${endDate}, Current Date: ${currentDate}, Remaining Time: ${remainingTime}`);

    // If remaining time is less than or equal to zero, return 0
    if (remainingTime <= 0) {
        return 0; // Return 0 if the staking period is completed
    }

    // Return remaining time in seconds
    return Math.floor(remainingTime / 1000); // Return remaining time in seconds
};

// Add this function to calculate the total staked amount

// Accrued Earnings hesaplaması
const calculateAccruedEarnings = (stake: any) => {
    const totalEarnings = stake.earnings; // Toplam kazanç
    const durationInDays = stake.duration; // Staking süresi (gün cinsinden)

    // Toplam süreyi saniye cinsinden hesapla
    const totalStakeDurationSeconds = durationInDays * 24 * 60 * 60; 
    console.log(`Total Duration in Seconds: ${totalStakeDurationSeconds}`);

    // Geçen süreyi hesapla
    const elapsedSeconds = calculateRemainingSeconds(stake.timestamp, durationInDays); 
    console.log(`Elapsed Seconds: ${elapsedSeconds}`);

    // Bitiş tarihini kontrol et
    const currentTime = new Date().getTime();
    const stakeTime = new Date(stake.timestamp).getTime();
    const durationInMillis = durationInDays * 24 * 60 * 60 * 1000; // Süreyi milisaniyeye çevir
    const endTime = stakeTime + durationInMillis; // Bitiş zamanı

    // Eğer bitiş zamanı geçmişse, toplam kazancı döndür
    if (currentTime >= endTime) {
        console.log(`Staking period completed. Returning total earnings: ${totalEarnings}`);
        return totalEarnings; // Süre tamamlandıysa, toplam kazancı döndür
    }

    // Saniye başına kazancı hesapla
    const earningsPerSecond = totalEarnings / totalStakeDurationSeconds; 
    console.log(`Earnings Per Second: ${earningsPerSecond}`);

    // Geçen süreye göre kazancı hesapla
    const accruedEarnings = earningsPerSecond * elapsedSeconds; 
    console.log(`Accrued Earnings based on elapsed time: ${accruedEarnings}`);

    // Eğer hesaplanan kazanç toplam kazancı aşarsa, toplam kazancı döndür
    const finalEarnings = Math.min(accruedEarnings, totalEarnings);
    console.log(`Final Accrued Earnings (capped at total earnings): ${finalEarnings}`);
    
    return finalEarnings; // Hesaplanan kazancı döndür
};

// Yüzde hesaplama


// Add this new component for Circular Progress with Label
function CircularProgressWithLabel(
  props: CircularProgressProps & { value: number },
) {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress variant="determinate" {...props} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
        
          component="div"
          sx={{ color: 'primary' }}
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

// Remove unused theme parameter from GradientBox
const GradientBox = styled(Box)(() => ({
  background: 'linear-gradient(180deg, rgba(110, 211, 255, 0.08) 0%, rgba(26, 33, 38, 0) 100%)',
  borderRadius: '24px',
  padding: '24px 16px',
  marginBottom: '24px',
  border: '1px solid rgba(110, 211, 255, 0.1)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
}));

// Add these new styled components at the top
const TrustBadge = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '6px 12px',
  borderRadius: '16px',
  backgroundColor: 'rgba(110, 211, 255, 0.1)',
  border: '1px solid rgba(110, 211, 255, 0.2)',
});

const PulsingDot = styled(Box)({
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  backgroundColor: '#4CAF50',
  animation: 'pulse 2s infinite',
  '@keyframes pulse': {
    '0%': {
      transform: 'scale(0.95)',
      boxShadow: '0 0 0 0 rgba(76, 175, 80, 0.7)',
    },
    '70%': {
      transform: 'scale(1)',
      boxShadow: '0 0 0 10px rgba(76, 175, 80, 0)',
    },
    '100%': {
      transform: 'scale(0.95)',
      boxShadow: '0 0 0 0 rgba(76, 175, 80, 0)',
    },
  },
});

// Add this new component for live stats
const LiveStats = () => {
  const [currentUsers, setCurrentUsers] = useState(1247);
  
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentUsers(prev => prev + Math.floor(Math.random() * 3));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <TrustBadge>
        <PulsingDot />
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
          {currentUsers.toLocaleString()} users active now
        </Typography>
      </TrustBadge>
      
   
    </Box>
  );
};

// Stats ve Güven Göstergeleri bileşeni
const StatsAndTrust = () => {
  return (
    <Box sx={{ mt: 3, mb: 4 }}>
      {/* Platform İstatistikleri */}
     

      {/* Güven Göstergeleri */}
      <Typography variant="h6" className="text-gradient" sx={{ mt: 4, mb: 2 }}>
        Security & Trust
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <TrustIndicator 
            icon={<Shield />}
            label="Audited"
            value="CertiK"
          />
        </Grid>
        <Grid item xs={4}> 
          <TrustIndicator 
            icon={<Security />}
            label="Covers"
            value="$275M+"
          />
        </Grid>
        <Grid item xs={4}>
          <TrustIndicator 
            icon={<Lock />}
            label="TVL"
            value="$1.2B+"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

// LiveStats bileşenini kaldır ve yerine RecentStakes bileşenini ekle
const RecentStakes = () => {
  const [usedAddresses, setUsedAddresses] = useState(new Set<string>());
  const [newActivityKey, setNewActivityKey] = useState<string | null>(null);

  // Helper function to generate unique TON address with different prefixes
  const generateUniqueTONAddress = () => {
    const prefixes = ['EQ', 'UQ', 'kQ', 'Ef', 'Uf', 'EQ', 'kf', 'PQ', 'MQ', 'LQ'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const chars = '0123456789abcdefABCDEFghijklmnopqrstuvwxyzKLMNOPQRSTUVWXYZ';
    let address: string;
    
    const generateUniqueString = () => {
      let result = '';
      const usedChars = new Set<string>();
      
      while (result.length < 48) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        if (!usedChars.has(char)) {
          result += char;
          usedChars.add(char);
        }
      }
      return result;
    };
    
    do {
      const randomPart = generateUniqueString();
      address = `${prefix}${randomPart}`;
    } while (usedAddresses.has(address));
    
    setUsedAddresses(prev => new Set(prev).add(address));
    return address;
  };

  // Helper function to generate random amount between min and max
  const generateRandomAmount = (isSubscribe: boolean) => {
    const random = Math.random();
    
    if (isSubscribe) {
      // Subscribe amounts
      if (random < 0.9) {
        // 90% chance for 20-320 TON
        return (Math.random() * (320 - 20) + 20).toFixed(2);
      } else {
        // 10% chance for 321-1500 TON
        return (Math.random() * (1500 - 321) + 321).toFixed(2);
      }
    } else {
      // Reward Claimed amounts
      if (random < 0.9) {
        // 90% chance for 5-430 TON
        return (Math.random() * (430 - 5) + 5).toFixed(2);
      } else {
        // 10% chance for 431-1500 TON
        return (Math.random() * (1500 - 431) + 431).toFixed(2);
      }
    }
  };

  // Get time display based on index
  const getTimeDisplay = (_index: number) => {
    return 'just now';
  };

  // Generate initial activities
  const generateActivity = () => {
    const isSubscribe = Math.random() < 0.7; // 70% chance of subscribe
    return {
      type: isSubscribe ? 'Subscribe' : 'Reward Claimed',
      amount: generateRandomAmount(isSubscribe),
      address: generateUniqueTONAddress(),
      leverage: isSubscribe ? Math.floor(Math.random() * 4 + 1) * 25 : undefined,
      isNewest: false
    };
  };

  const [activities, setActivities] = useState(() => {
    return Array.from({ length: 6 }, generateActivity);
  });

  // Update activities every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const newActivity = { ...generateActivity(), isNewest: true };
      setNewActivityKey(newActivity.address);
      
      setActivities(prev => {
        const updatedPrev = prev.map(activity => ({
          ...activity,
          isNewest: false
        }));
        
        return [newActivity, ...updatedPrev.slice(0, -1)];
      });

      setTimeout(() => {
        setNewActivityKey(null);
      }, 1000);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{ 
      mt: 2,
      p: 2,
      borderRadius: 2,
      backgroundColor: 'rgba(110, 211, 255, 0.05)',
      border: '1px solid rgba(110, 211, 255, 0.1)',
      overflow: 'hidden',
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="subtitle2" sx={{ color: '#6ed3ff' }}>
          Live Activities
        </Typography>
        <PulsingDot />
      </Box>
      {activities.map((activity, index) => (
        <Box 
          key={activity.address}
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 0.5,
            p: 1,
            borderRadius: 1,
            backgroundColor: activity.isNewest ? 
              'rgba(110, 211, 255, 0.08)' : 
              'rgba(110, 211, 255, 0.02)',
            '&:hover': {
              backgroundColor: 'rgba(110, 211, 255, 0.05)',
            },
            animation: newActivityKey === activity.address ? 
              'slideIn 0.5s ease-out forwards' : undefined,
            '@keyframes slideIn': {
              '0%': {
                transform: 'translateX(100%)',
                opacity: 0,
              },
              '100%': {
                transform: 'translateX(0)',
                opacity: 1,
              }
            },
            transition: 'all 0.3s ease',
            position: 'relative',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {activity.type === 'Subscribe' ? 
              <AddCircleOutlineIcon sx={{ fontSize: 16, color: '#4CAF50' }} /> :
              <LocalFireDepartmentIcon sx={{ fontSize: 16, color: '#ff9800' }} />
            }
            <Box>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.9)', display: 'block' }}>
                {activity.type === 'Subscribe' ? '+' : ''}{activity.amount} TON
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.65rem' }}>
                {activity.address.slice(0, 6)}...{activity.address.slice(-4)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <Chip 
                label={activity.type}
                size="small"
                sx={{ 
                  height: '16px',
                  fontSize: '0.65rem',
                  backgroundColor: activity.type === 'Subscribe' ? 'rgba(76,175,80,0.1)' : 'rgba(255,152,0,0.1)',
                  color: activity.type === 'Subscribe' ? '#4CAF50' : '#ff9800',
                }}
              />
              {activity.leverage && (
                <Chip 
                  label={`${activity.leverage}x`}
                  size="small"
                  sx={{ 
                    height: '16px',
                    fontSize: '0.65rem',
                    backgroundColor: 'rgba(110, 211, 255, 0.1)',
                    color: '#6ed3ff',
                  }}
                />
              )}
            </Box>
          </Box>
          <Typography 
            variant="caption" 
            sx={{ 
              color: activity.isNewest ? '#6ed3ff' : 'rgba(255,255,255,0.5)',
              fontWeight: activity.isNewest ? 'bold' : 'normal',
              animation: newActivityKey === activity.address ? 
                'fadeInRight 0.5s ease-out' : undefined,
              '@keyframes fadeInRight': {
                '0%': {
                  opacity: 0,
                  transform: 'translateX(20px)',
                },
                '100%': {
                  opacity: 1,
                  transform: 'translateX(0)',
                }
              }
            }}
          >
            {getTimeDisplay(index)}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

const NewComponent: React.FC<NewComponentProps> = () => {
  const navigate = useNavigate(); // Initialize useNavigate()
  

   const db = getFirestore(app); // Define the Firestore database instance
  const [totalBalance, setTotalBalance] = useState<number | null>(null);

// Fetch total balance and staking history from Firestore when the component mounts
  useEffect(() => {
    const telegramUserId = localStorage.getItem("telegramUserId");
    if (!telegramUserId) {
      console.error("Telegram User ID not found!");
      return;
    }

    const userDocRef = doc(db, 'users', telegramUserId); // Adjust the path as necessary

    // Set up a real-time listener
    const unsubscribe = onSnapshot(userDocRef, (userDoc) => {
      if (userDoc.exists()) {
        const data = userDoc.data();
        setTotalBalance(data.total / 1000); // Divide the total by 1000 before setting
        setlbBalance(data.lbTON ); // Divide the total by 1000 before setting
        setStakingHistory(data.stakingHistory || []); // Set staking history
      } else {
        console.error("No such document!");
      }
    });

    // Cleanup function to unsubscribe from the listener
    return () => unsubscribe();
  }, []);
  // Staking verilerini tutan state
  const [stakingData, setStakingData] = useState(
    stakingOptions.map(option => ({
        amount: option.tonRange.max, // Default to maximum amount
        duration: Math.max(...option.durations), // Maximum duration for each card
        leverage: Math.max(...option.leverageOptions), // Maximum leverage for each card
        earnings: option.apy, // Add earnings property (assuming apy represents earnings)
        timestamp: new Date().toISOString() // Add timestamp property (current time)
    }))
  );

  // Yeni state: Seçilen staking kartı
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(2); // Varsayılan olarak 7D seçili

  // Kazanç state'i
  const [, setAccruedEarnings] = useState(0);

  // Drawer state'i eklendi
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedStaking, setSelectedStaking] = useState<{
    option: typeof stakingOptions[0];
    data: { 
      amount: number;
      duration: number;
      leverage: number;
    };
  } | null>(null);

  // Add a new state to hold the total balance
  const [lbBalance, setlbBalance] = useState<number | null>(null);

  const [errorMessage, setErrorMessage] = useState<string | null>(null); // New state for error message
  const [successModalOpen, setSuccessModalOpen] = useState(false); // New state for modal visibility
  const [isLoading, setIsLoading] = useState(false); // New state for loading animation
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0); // New state for current message index
  const [progress, setProgress] = useState(0); // New state for progress
  const messages = [
    "⏳ Processing your stake...",
    "We are verifying your request.",
    "🔄 Sending transaction to the blockchain...",
    "Your stake is being recorded on the network.",
    "⚡ Finalizing your stake...",
    "Almost done! Confirming transaction status.",
    "🎉 Staking Successful!",
    "Your stake has been processed successfully."
  ]; // Array of messages

  const [stakingHistory, setStakingHistory] = useState<any[]>([]); // New state for staking history
  const [isUnstaking, setIsUnstaking] = useState(false); // New state for unstaking mode

  // New state to manage the selected action
  const [selectedAction, setSelectedAction] = useState<'stake' | 'unstake'>('stake');

  // New state to manage selection enablement
  const [] = useState(true);

  // Add state for early unstake drawer visibility
  const [earlyUnstakeDrawerOpen, setEarlyUnstakeDrawerOpen] = useState(false);
  const [selectedEarlyUnstake, setSelectedEarlyUnstake] = useState<any | null>(null); // State to hold the selected stake for early unstaking

 const [UnstakeDrawerOpen, setUnstakeDrawerOpen] = useState(false);
  const [selectedUnstake, setSelectedUnstake] = useState<any | null>(null); // State to hold the selected stake for early unstaking

  // Add these new states at the top of the component
  const [isCalculating] = useState(false);
  const [calculationComplete] = useState(true);

  // Kazancı güncellemek için useEffect
  useEffect(() => {
    const interval = setInterval(() => {
      const elapsedSeconds = calculateRemainingSeconds(stakingData[selectedOptionIndex].timestamp, stakingData[selectedOptionIndex].duration);
      const earningsPerSecond = stakingData[selectedOptionIndex].earnings / (stakingData[selectedOptionIndex].duration * 24 * 60 * 60);
      const newAccruedEarnings = earningsPerSecond * elapsedSeconds;

      setAccruedEarnings(newAccruedEarnings);
    }, 1000); // Her saniye güncelle

    return () => clearInterval(interval); // Cleanup on unmount
  }, [stakingData, selectedOptionIndex]);

  

  // Event handler fonksiyonlarını useCallback ile memoize et
  const handleAmountChange = useCallback((index: number, newAmount: number) => {
    setStakingData(prevData => {
      const updatedData = [...prevData];
      updatedData[index].amount = newAmount;

      // Check min and max values for amount
      const tonRange = stakingOptions[index].tonRange;
      if (newAmount < tonRange.min || newAmount > tonRange.max) {
        setErrorMessage(`Amount must be  (Min ${tonRange.min} ~ Max ${tonRange.max} TON)`); // Set error message
      } else {
        setErrorMessage(null); // Clear error message if valid
      }

      return updatedData;
    });
  }, []);

  const handleDurationChange = useCallback((index: number, newDuration: number) => {
    setStakingData(prevData => {
      const updatedData = [...prevData];
      updatedData[index].duration = newDuration;

      // Automatically set leverage based on duration
      if (newDuration === 121) {
        updatedData[index].leverage = 5; // Automatically set to 5x
      } else if (newDuration === 152) {
        updatedData[index].leverage = 10; // Automatically set to 10x
        
      } else if (newDuration === 30) {
        updatedData[index].leverage = 25; // Automatically set to 10x
        
      }else if (newDuration === 60) {
        updatedData[index].leverage = 50; // Automatically set to 10x
        
      }else if (newDuration === 90) {
        updatedData[index].leverage = 75; // Automatically set to 10x
        
      } else if (newDuration === 7) {
        updatedData[index].leverage = 150; // Automatically set to 10x
        
      }else if (newDuration === 365) {
        updatedData[index].leverage = 15; // Automatically set to 10x
        
      }else if (newDuration === 21) {
        updatedData[index].leverage = 200; // Automatically set to 10x
        
      }else if (newDuration === 14) {
        updatedData[index].leverage = 175; // Automatically set to 15x
      } else {
        updatedData[index].leverage = 0; // Reset leverage if duration is not one of the specified
      }

      // Check min and max values for amount
      const tonRange = stakingOptions[index].tonRange;
      if (updatedData[index].amount < tonRange.min) {
        updatedData[index].amount = tonRange.min;
      } else if (updatedData[index].amount > tonRange.max) {
        updatedData[index].amount = tonRange.max;
      }
      return updatedData;
    });
  }, []);


  // Function to calculate earnings based on amount and period
  const calculateEarnings = useCallback((amount: number, duration: number, leverage: number, apy: number): number => {
    // 1 günlük stake için özel VIP hesaplama (miktar bazlı kademeli kazanç)
    if (duration === 1) {
        if (amount >= 500 && amount <= 1500) {
            return Number((amount * 0.293).toFixed(2)); // 500-1500 TON arası günlük %23
        } else if (amount > 150) {
            return Number((amount * 0.13).toFixed(2)); // 150 TON üzeri günlük %13
        } else {
            return Number((amount * 0.276).toFixed(2)); // Normal miktar için günlük %2
        }
    }
    
    // Diğer süreler için normal hesaplama
    const dailyRate = (apy / 100) / 365;
    const adjustedLeverage = Math.sqrt(leverage);
    const durationBonus = 1 + (duration / 90);
    
    const earnings = amount * dailyRate * duration * adjustedLeverage * durationBonus;
    return Number(earnings.toFixed(2));
}, []);

  // Drawer açma fonksiyonu eklendi
  const handleOpenDrawer = (index: number) => {
    setSelectedStaking({
      option: stakingOptions[index],
      data: stakingData[index],
    });
    setDrawerOpen(true);
  };

  // Drawer kapama fonksiyonu eklendi  
  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedStaking(null);
  };

    const [] = useState<null | HTMLElement>(null);
  const [] = useState(false);



  // Update the FAQ items to include details about the staking system, leverage, and duration
  const leveragedStakingItems = [
    {
      question: "What is Leveraged Staking?",
      answer: "Leveraged Staking allows you to amplify your staking rewards by using borrowed funds. This means you can stake more than you own, increasing your potential returns."
    },
    {
      question: "How does Leveraged Staking work?",
      answer: "In Leveraged Staking, you can borrow funds to increase your staking amount. For example, if you have 100 TON and borrow an additional 100 TON, you can stake 200 TON, thus maximizing your rewards."
    },
  
    {
      question: "Who should consider Leveraged Staking?",
      answer: "Leveraged Staking is generally recommended for experienced users who understand the risks involved. It is important to have a solid understanding of market dynamics and risk management."
    },
    {
      question: "How can I get started with Leveraged Staking?",
      answer: "To start, select a staking option in the app, choose your leverage level, and follow the prompts to stake your assets. Make sure to review the terms and conditions before proceeding."
    },
   
    {
      question: "Are there any fees associated with Leveraged Staking?",
      answer: "Yes, there may be fees for borrowing funds, as well as transaction fees for staking. Always check the fee structure in the app before proceeding."
    },
    {
      question: "What is the staking duration?",
      answer: "You can choose from various staking periods, ranging from 7 days to 365 days. Each duration offers different Annual Percentage Yields (APY). Longer durations typically provide higher APYs."
    },
    {
      question: "About Our Staking System",
      answer: "Our staking system allows users to earn rewards by locking their TON coins for a specified duration. You can choose from various staking periods, ranging from 7 days to 365 days, each offering different Annual Percentage Yields (APY)."
    },
 
  ];

 
 


  const handleStartStaking = async () => {
    if (selectedStaking) {
        const stakingAmount = selectedStaking.data.amount;
        const telegramUserId = localStorage.getItem("telegramUserId");
 
        if (telegramUserId) {
            const uniqueId = uuidv4(); // Generate a unique ID for the staking transaction
            const earnings = calculateEarnings( // Kazancı hesapla
                stakingAmount,
                selectedStaking.data.duration,
                selectedStaking.data.leverage,
                selectedStaking.option.apy
            );  // Kazancı iki ondalık basamağa yuvarla
          

            try {
                // Show loading animation
                setIsLoading(true);
                setProgress(0); // Reset progress

                // Create a new document for the staking process
                const stakingDocRef = doc(db, 'staking', uniqueId); // Use unique ID for the document
                await setDoc(stakingDocRef, {
                    userId: telegramUserId, // Store the user ID
                    amount: stakingAmount,
                    duration: selectedStaking.data.duration,
                    leverage: selectedStaking.data.leverage,
                    apy: stakingOptions[selectedOptionIndex].apy,
                    lbTON: (String(selectedStaking.data.amount * selectedStaking.data.leverage || '0')), // New field for lbTON
                    earnings: earnings, // Kazancı ekle
                    timestamp: new Date().toISOString(), // Store as ISO string
                                            claimed: false,

                });

                // Update the user's total balance and lbTON
                const userDocRef = doc(db, 'users', telegramUserId);
                await updateDoc(userDocRef, {
                    total: increment(-stakingAmount * 1000), // Deduct the amount multiplied by 1000 from total balance
                    lbTON: increment((selectedStaking.data.amount * selectedStaking.data.leverage )), // Add to lbTON balance
                    stakingHistory: arrayUnion({ // Add the staking details to the user's staking history
                        id: uniqueId,
                        amount: stakingAmount,
                        duration: selectedStaking.data.duration,
                        leverage: selectedStaking.data.leverage,
                        apy: stakingOptions[selectedOptionIndex].apy,
                        lbTON: (String(selectedStaking.data.amount * selectedStaking.data.leverage || '0')),
                        earnings: earnings, // Kazancı ekle
                        timestamp: new Date().toISOString(), // Store as ISO string
                                                claimed: false, // Add claimed boolean set to false in staking history
                    })
                });

                console.log("Staking process saved successfully.");

                // Show success modal and start message sequence
                setSuccessModalOpen(true);
                setCurrentMessageIndex(0); // Reset to the first message

                // Start the message sequence
                const messageInterval = setInterval(() => {
                  setCurrentMessageIndex(prevIndex => {
                    if (prevIndex < messages.length - 1) {
                      return prevIndex + 1;
                    } else {
                      clearInterval(messageInterval); // Clear interval after last message
                      setIsLoading(false); // Stop loading animation
                      return prevIndex; // Keep the last index
                    }
                  });
                }, 2000); // Change message every 2 seconds

                // Update progress
                const progressInterval = setInterval(() => {
                  setProgress(prev => {
                    if (prev < 100) {
                      return prev + (100 / (2000 * messages.length / 100)); // Update progress based on message duration
                    } else {
                      clearInterval(progressInterval);
                      return 100; // Ensure it reaches 100%
                    }
                  });
                }, 100); // Update progress every 100ms

            } catch (error) {
                console.error("Error saving staking process:", error);
                setIsLoading(false); // Stop loading animation on error
            }
        } else {
            console.error("Telegram User ID not found!");
        }
    }
  };




  // Function to handle  UNSTAKE action and open the drawer

  const handleUnstakeAction = (index: number) => {
    const stakeToUnstake = stakingHistory[index];


        setSelectedUnstake(stakeToUnstake); // Set the selected stake
            setUnstakeDrawerOpen(true); // Open the early unstake drawer


    // Implement your unstaking logic here, e.g., calling a function to update the database
    console.log(`Unstaking ${stakeToUnstake.amount} TON from stake index ${index}`);
    // You might want to show a confirmation modal or perform the unstaking operation here
  }; 



  // Function to handle early unstake action and open the drawer
  const handleEarlyUnstakeAction = (index: number) => {
    const stakeToUnstake = stakingHistory[index];
    setSelectedEarlyUnstake(stakeToUnstake); // Set the selected stake
    setEarlyUnstakeDrawerOpen(true); // Open the early unstake drawer
  };




const handleEarlyUnstake = async (amount: number): Promise<void> => {
    const telegramUserId = localStorage.getItem("telegramUserId");
    const penalty = amount * 0.04;
    const amountAfterPenalty = amount - penalty;
    const amountToAdd = amountAfterPenalty * 1000;

    if (telegramUserId) {
        try {
            // Step 1: Retrieve the user's document
            const userDocRef = doc(db, 'users', telegramUserId);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const userData = userDoc.data();
                const stakingHistory = userData.stakingHistory;

                // Step 2: Find the selected stake
                if (selectedEarlyUnstake) {
                    const stakeId = selectedEarlyUnstake.id; // Get the ID of the selected stake
                    const stakeToRemove = stakingHistory.find((stake: { id: any; }) => stake.id === stakeId);

                    if (stakeToRemove) {
                        const lbTONAmount = stakeToRemove.lbTON; // Get the lbTON amount from the stake

                        // Step 3: Update the user's lbTON balance
                        const updatedLbTON = userData.lbTON - lbTONAmount;

                        // Step 4: Update the user's total balance
                        await updateDoc(userDocRef, {
                            total: increment(amountToAdd), // Increment total balance
                            lbTON: updatedLbTON, // Update lbTON balance
                        });

                        // Step 5: Remove the stake from staking history
                        const updatedStakingHistory = stakingHistory.filter((stake: { id: any; }) => stake.id !== stakeId);

                        // Step 6: Save the updated staking history back to Firestore
                        await updateDoc(userDocRef, {
                            stakingHistory: updatedStakingHistory,
                        });

                        console.log(`Successfully unstaked ${amount} TON. Added ${amountToAdd} to total, removed stake ${stakeId} from staking history, and updated lbTON.`);
                    } else {
                        console.error("Selected stake not found in staking history.");
                    }
                } else {
                    console.error("No stake selected for unstaking.");
                }
            } else {
                console.error("User  document not found!");
            }
        } catch (error) {
            console.error("Error updating user total or removing stake:", error);
        } 
    } else {
        console.error("User  ID not found!");
    }
};


const handleUnstake = async (amount: number): Promise<void> => { 
    const telegramUserId = localStorage.getItem("telegramUserId");

    const penalty2 = parseFloat(selectedUnstake.earnings) * 0.055;

    const amountAfterPenalty2 = amount - penalty2;

    const lastAmount = parseFloat(selectedUnstake.earnings) * 1000
    const total2 = amountAfterPenalty2 * 1000;
    const amountToAdd2 = lastAmount  +   total2;
    
    if (telegramUserId) {
        try {
            // Step 1: Retrieve the user's document
            const userDocRef = doc(db, 'users', telegramUserId);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const userData = userDoc.data();
                const stakingHistory = userData.stakingHistory;

                // Step 2: Find the selected stake
                if (selectedUnstake) {
                    const stakeId = selectedUnstake.id; // Get the ID of the selected stake
                    const stakeToRemove = stakingHistory.find((stake: { id: any; }) => stake.id === stakeId);

                    if (stakeToRemove) {
                        const lbTONAmount = stakeToRemove.lbTON; // Get the lbTON amount from the stake

                        // Step 3: Update the user's lbTON balance
                        const updatedLbTON = userData.lbTON - lbTONAmount;

                        // Step 4: Update the user's total balance
                        await updateDoc(userDocRef, {
                            total: increment(amountToAdd2), // Increment total balance
                            lbTON: updatedLbTON, // Update lbTON balance
                        });

                        // Step 5: Remove the stake from staking history
                        const updatedStakingHistory = stakingHistory.filter((stake: { id: any; }) => stake.id !== stakeId);

                        // Step 6: Save the updated staking history back to Firestore
                        await updateDoc(userDocRef, {
                            stakingHistory: updatedStakingHistory,
                        });

                        console.log(`Successfully unstaked ${amount} TON. Added ${amountToAdd2} to total, removed stake ${stakeId} from staking history, and updated lbTON.`);
                    } else {
                        console.error("Selected stake not found in staking history.");
                    }
                } else {
                    console.error("No stake selected for unstaking.");
                }
            } else {
                console.error("User  document not found!");
            }
        } catch (error) {
            console.error("Error updating user total or removing stake:", error);
        }
    } else {
        console.error("User  ID not found!");
    }
};
  // Function to handle button selection
  const handleActionChange = (_event: React.MouseEvent<HTMLElement> | null, newAction: 'stake' | 'unstake') => {
    if (newAction !== null) {
      setSelectedAction(newAction);
      setIsUnstaking(newAction === 'unstake'); // Update unstaking mode based on selection
    }
  };



  // APY ve leverage seviyelerini hesapla
  const currentAPYLevel = calculateAPY(stakingData[selectedOptionIndex].amount, stakingOptions[selectedOptionIndex].period);

  // Log the current APY level whenever it changes
  useEffect(() => {
    console.log(`Current APY Level: ${currentAPYLevel}`);
  }, [currentAPYLevel]); // Dependency array to log when currentAPYLevel changes


  

  useEffect(() => {
    const backButton = WebApp.BackButton;

    // Sadece drawer açıkken geri butonunu göster
    if (drawerOpen) {
        backButton.show();
        backButton.onClick(() => {
            navigate("/latest-booba/stake");
        });
    } else {
        backButton.hide(); // Drawer kapalıysa butonu gizle
    }

    // Cleanup: Bileşen unmount olduğunda butonu gizle ve event handler'ı kaldır
    return () => {
        backButton.hide();
        backButton.offClick(() => {
            navigate("/latest-booba/stake"); // Buraya tekrar aynı callback sağlanmalıdır.
        });
    };
  }, [navigate, drawerOpen]); // drawerOpen'i bağımlılıklar listesine ekleyin

    const handleNavigate = () => {
    navigate('/latest-booba/spin');
  };



    const [open3, setOpen3] = useState(false);

  return (
    <Box mt={"12%"} sx={{ 
  marginBottom: '76px', 
  backgroundColor: '#1a2126', 
  padding: 1,
  position: 'relative'
}}>
      <GradientBox>
        <Box textAlign={'center'} position="relative">
          {/* Live Stats Badge */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <LiveStats />
          </Box>

          <Typography 
            className="text-gradient" 
            fontFamily={'Montserrat'} 
            fontSize={'1.6rem'} 
            fontWeight={'bold'}
            sx={{
              animation: 'fadeIn 0.5s ease-in',
              mb: 2,
              background: 'linear-gradient(90deg, #6ED3FF 0%, #89D9FF 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Smart Liquidity Pool
          </Typography>

          <Typography 
            mb={3} 
            fontSize={'0.9rem'}
            sx={{ 
              color: 'rgba(255,255,255,0.85)',
              maxWidth: '320px',
              margin: '0 auto',
              fontWeight: 500
            }}
          >
            Join to elite pools of liquidity providers earning 
            <span className="text-gradient" style={{
              fontWeight: 'bold',
              padding: '0 4px'
            }}>
               Premium Yields
            </span> 
          </Typography>
<Typography 
       
            fontSize={'0.9rem'}
            sx={{ 
              color: 'rgba(255,255,255,0.85)',
              maxWidth: '320px',
              margin: '0 auto',
              lineHeight: 1.6,
              fontWeight: 500
            }}
          >                 with institutional-grade protection
     </Typography>

          {/* Enhanced trust indicators */}
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={4}>
              <Box sx={{
                textAlign: 'center',
                p: 2,
                borderRadius: 2,
                backgroundColor: 'rgba(110, 211, 255, 0.05)',
              }}>
                <Typography 
                  variant="h5" 
                  className="text-gradient"
                  sx={{ fontWeight: 'bold' }}
                >
                  $275.9M
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{
                    color: 'rgba(255,255,255,0.7)',
                    display: 'block',
                    mt: 0.5
                  }}
                >
                  TVL
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={4}>
              <Box sx={{
                textAlign: 'center',
                p: 2,
                borderRadius: 2,
                backgroundColor: 'rgba(110, 211, 255, 0.05)',
              }}>
                <Typography 
                  variant="h5" 
                  className="text-gradient"
                  sx={{ fontWeight: 'bold' }}
                >
                  76,822
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{
                    color: 'rgba(255,255,255,0.7)',
                    display: 'block',
                    mt: 0.5
                  }}
                >
                  Users
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={4}>
              <Box sx={{
                textAlign: 'center',
                p: 2,
                borderRadius: 2,
                backgroundColor: 'rgba(110, 211, 255, 0.05)',
              }}>
                <Typography 
                  variant="h5" 
                  className="text-gradient"
                  sx={{ fontWeight: 'bold' }}
                >
                  320x
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{
                    color: 'rgba(255,255,255,0.7)',
                    display: 'block',
                    mt: 0.5
                  }}
                >
                  Leverage
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </GradientBox>

      {/* Stats ve Güven Göstergelerini ekleyin */}

     

    
     


      
      
      {/* Button Group for Stake and Unstake */}
      <Box className="total-equity" sx={{ 
        borderRadius: 2, 
        p: 1.5,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        mb: 2
      }}>
        <Box sx={{ 
          width: '100%',
          minHeight: { xs: '48px', sm: '48px' },
          position: 'relative',
          zIndex: 2,
          '& .MuiTab-root': { 
            color: '#6B7280',
            minHeight: { xs: '48px', sm: '48px' },
            padding: { xs: '12px 16px', sm: '12px 24px' },
            minWidth: { xs: '120px', sm: '160px' },
            fontSize: { xs: '0.875rem', sm: '0.9rem' },
            '&.Mui-selected': { 
              color: '#fff',
              fontWeight: 600
            }
          },
          '& .MuiTabs-indicator': {
            backgroundColor: '#6ed3ff'
          }
        }}>
          <Box sx={{
            display: 'flex',
            width: '100%',
            borderRadius: 2,
            padding: '4px'
          }}>
            <Button
              onClick={(e) => handleActionChange(e, 'stake')}
              sx={{
                flex: 1,
                color: selectedAction === 'stake' ? '#fff' : '#6B7280',
                minHeight: { xs: '48px', sm: '48px' },
                padding: { xs: '12px 16px', sm: '12px 24px' },
                textTransform: 'none',
                fontSize: { xs: '0.875rem', sm: '0.9rem' },
                fontWeight: selectedAction === 'stake' ? 600 : 400,
                position: 'relative',
                zIndex: 2,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.05)'
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AddCircleIcon sx={{ fontSize: '20px' }} />
                Subscribe
              </Box>
            </Button>
            <Button
              onClick={(e) => handleActionChange(e, 'unstake')}
              sx={{
                flex: 1,
                color: selectedAction === 'unstake' ? '#fff' : '#6B7280',
                minHeight: { xs: '48px', sm: '48px' },
                padding: { xs: '12px 16px', sm: '12px 24px' },
                textTransform: 'none',
                fontSize: { xs: '0.875rem', sm: '0.9rem' },
                fontWeight: selectedAction === 'unstake' ? 600 : 400,
                position: 'relative',
                zIndex: 2,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.05)'
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <RemoveCircleIcon sx={{ fontSize: '20px' }} />
                Redeem
              </Box>
            </Button>
          </Box>
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: selectedAction === 'stake' ? '0%' : '50%',
              width: '50%',
              height: '2px',
              backgroundColor: '#6ed3ff',
              transition: 'left 0.3s ease'
            }}
          />
        </Box>
      </Box>
      


      {/* Conditionally render cards based on unstaking mode */}
      {isUnstaking ? (
        <Grid container spacing={2}>
          {[...Array(1)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
           
            </Grid>
          ))}
        </Grid>
      ) : (
        <>
          
            
            <Box 
  sx={{ 
    position: 'relative',
    minHeight: 'auto', // 100vh yerine auto kullanalım
    paddingBottom: '16px', // 60px yerine daha az padding
  }}
>
  <Grid item xs={12} sm={6} md={4} key={selectedOptionIndex}>
    <StakingCard
      key={selectedOptionIndex}
      option={stakingOptions[selectedOptionIndex]}
      index={selectedOptionIndex} 
      stakingData={stakingData}
      handleAmountChange={handleAmountChange}
      handleDurationChange={handleDurationChange}
      calculateEarnings={calculateEarnings}
      setSelectedOptionIndex={setSelectedOptionIndex}
      totalBalance={totalBalance}
      handleNavigate={handleNavigate}
      isCalculating={isCalculating}
      calculationComplete={calculationComplete}
    />
  </Grid>
 
</Box>

            


         


          
          {/* Earnings Display Outside of StakingCard */}
          <Box sx={{   
              textAlign: 'center', 
              borderRadius: 2,
              transition: 'transform 0.3s, box-shadow 0.3s',
              display: 'flex', 
              flexDirection: 'column'
          }}>
              <Box mb={1} sx={{display:'flex', justifyContent:'space-between'}}>
                  <Box display={'flex'} alignItems={'center'}>
                  </Box>
              </Box>
          </Box>
 
          
        </>
      )}


      

    {isUnstaking && (
  <Box sx={{ mt: 2 }}>
    {stakingHistory.filter(stake => !stake.claimed).length > 0 ? (
      stakingHistory
        .filter(stake => !stake.claimed) // claimed: false olanları filtrele
        .map((stake, index) => {
          const currentTime = new Date().getTime();
          const stakeTime = new Date(stake.timestamp).getTime();
          const durationInMillis = stake.duration * 24 * 60 * 60 * 1000; 
          const elapsedTime = Math.min(currentTime - stakeTime, durationInMillis); 
          const accruedEarnings = calculateAccruedEarnings(stake); 

          const progress = Math.min((elapsedTime / durationInMillis) * 100, 100);
          const isDurationPassed = currentTime >= (stakeTime + durationInMillis);
          const activationTime = new Date(stakeTime + durationInMillis);
          const totalRepay = (Number(stake.earnings) + Number(stake.amount)).toFixed(2);
          const formattedEarnings = (typeof accruedEarnings === 'number' ? accruedEarnings : 0).toFixed(2);

          return (
            <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1, backgroundColor: '#3f3f3f' }}>
              {/* Stake Info */}
              <Box mb={1} alignItems={'center'} display={'flex'} justifyContent={'space-between'}>
                <Typography variant="body1">
                  <span style={{ fontWeight: 'bold' }}>{stake.duration} Day </span> 

                  <span style={{color:"#b4e6ff"}}>Staking</span>
                </Typography>
                <Typography fontSize={'0.7rem'} variant="body1">
                  <span style={{ fontStyle: 'italic' }}>{new Date(stake.timestamp).toLocaleString()}</span>
                </Typography>
              </Box>

              {/* Progress and Earnings */}
              <Box sx={{ border: '1px solid #1976d2', borderRadius: 2, padding: 2, backgroundColor: '#282828', marginBottom: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Typography variant="h6" sx={{ color: '#b4e6ff', fontWeight: 'bold' }}>
                    Process <CircularProgress color="success" size="15px" />
                  </Typography>
                  <Typography textAlign={'left'} variant="h6" sx={{ fontWeight: 'bold', fontSize: '1rem' }}> 
                    <span style={{color: '#90EE90'}}> 
                      <SlotCounter delay={1} sequentialAnimationMode useMonospaceWidth value={parseFloat(formattedEarnings)} /> <span>TON</span>  
                    </span>
                    <span style={{marginLeft:'5px', color: 'gray',fontSize:'0.7rem'}}> 
                      ({(parseFloat(formattedEarnings) * 5.20).toFixed(2)} USD)
                    </span>
                  </Typography>
                </Box>
                <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <CircularProgressWithLabel value={progress} size={40} sx={{ color: '#00c6ff' }} />
                </Box>
              </Box>

              {/* APY & Leverage */}
              <Box display={'flex'} justifyContent={'space-between'}>
                <Typography variant="body1">
                  APY: <span style={{ fontWeight: 'bold' }}>{stake.apy}%</span>
                </Typography>
                <Typography variant="body1">
                  Leverage: <span style={{ fontWeight: 'bold' }}>{stake.leverage}x</span>
                </Typography>
              </Box>

              {/* Total Repay */}
              <Box mb={-1} mt={2} display={'flex'} justifyContent={'center'}>
                <Typography textAlign={'center'} variant="body1">
                  <span style={{color:'gray', marginRight:'5px'}}>Total Repay: </span>
                  <span style={{color:'#00c6ff'}}>{totalRepay} TON </span>
                  +
                  <span style={{color:'#67f177'}}> {(stake.amount * (stake.apy) * (2))} BBLIP</span>
                </Typography>
              </Box>

              {/* Unstake Buttons */}
              {!isDurationPassed && (
                <Button 
                  fullWidth
                  variant="outlined" 
                  color="warning" 
                  onClick={() => handleEarlyUnstakeAction(index)}   
                  sx={{ mt: 2 }}
                >
                  Early Unstake
                </Button>
              )}


              


              <Button 
                fullWidth
                variant="contained" 
                color="secondary" 
                sx={{
                  mt: 1,
                  backgroundColor: !isDurationPassed ? 'gray !important' : '#89d9ff !important',
                  color: !isDurationPassed ? 'white !important' : 'black !important',
                  opacity: !isDurationPassed ? 0.6 : 1,
                  filter: !isDurationPassed ? 'blur(1px)' : 'none',
                }}
                onClick={() => handleUnstakeAction(index)}
                disabled={!isDurationPassed}
              >
                Unstake
              </Button>

              {/* Unlock Date */}
              <Box display={'flex'} justifyContent={'space-between'}>
                <Typography textAlign={'center'} variant="body2" color="gray" sx={{ mt: 1 }}>
                  Unlock Date 
                </Typography>
                <Typography textAlign={'center'} variant="body2" color="PRIMARY" sx={{ mt: 1 }}>
                  <strong>{activationTime.toLocaleString()}</strong>
                </Typography>
              </Box>
            </Box>
          );
        })
    ) : (
      <Box sx={{ borderRadius: 2, p: 2, gap: 1, bgcolor: "#282828", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <SentimentVeryDissatisfiedIcon />
        <Typography variant="body2" color="error">
          You don't have any active process 
        </Typography>
      </Box>
    )}
  </Box>
)}


      {/* Unstake Button under all cards */}
    

      <Box sx={{  p:1   
      }}>
      {/* Conditionally render the Stake Now button based on unstaking mode */}
      {!isUnstaking && (
        <Button
          variant="contained"
          onClick={() => handleOpenDrawer(selectedOptionIndex)}
          sx={{
            backgroundColor: '#6ed3ff',
            borderRadius: 2,
            width: '100%',
            mb: 1,
            mt:-5,
            fontSize: '1rem',
            color: "#121212",
            fontWeight: 'bold',
            padding: '12px',
            textTransform: 'none',
            boxShadow: '0 8px 32px rgba(110,211,255,0.2)',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: '#89d9ff',
              transform: 'translateY(-2px)',
              boxShadow: '0 12px 40px rgba(110,211,255,0.3)'
            },
            '&:active': {
              transform: 'translateY(0)'
            }
          }}
        >
          <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
            <AddCircleIcon sx={{fontSize: 20}} />
            Subscribe Now
          </Box>
        </Button>
        
        
      )}

      {!isUnstaking && (

      <><Typography variant="body1" sx={{ color: 'gray', fontSize: ' 0.8rem' }}>
              Min Investment Size:    {stakingOptions[selectedOptionIndex].tonRange.min} TON ~ {stakingOptions[selectedOptionIndex].tonRange.min * 5.20} USDT

            </Typography><Box display={'flex'} justifyContent={'space-between'}>
              <Typography
                sx={{
                  color: "gray",
                  fontSize: "0.8rem",
                  cursor: "pointer",
                  textDecoration: "underline dotted", // NOKTALI ALT ÇİZGİ
                  textUnderlineOffset: "3px", // Çizgiyi biraz aşağı kaydır
                }}
                onClick={() => setOpen3(true)} // Tıklandığında drawer aç
              >
                Est. Position Size:
              </Typography>

              {/* Alttan Açılan Drawer */}
              <Drawer
                anchor="bottom" // Alttan açılmasını sağlar
                open={open3}
                onClose={() => setOpen3(false)} // Drawer dışına tıklayınca kapanır
                PaperProps={{
                  sx: {
                    borderTopLeftRadius: "16px", // Sol üst köşe yuvarlak
                    borderTopRightRadius: "16px", // Sağ üst köşe yuvarlak
                    overflow: "hidden", // Köşelerin düzgün görünmesi için
                  },
                }}
              >
                <Box
                  sx={{
                    p: 3,
                    height: "200px", // Yüksekliği ihtiyaca göre ayarla
                    display: "flex",

                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Typography fontSize="1.2rem" fontWeight="bold">
                    Minimum Holding Period
                  </Typography>
                  <Typography fontSize="0.9rem" mt={1} textAlign="center">
                    We recommend holding your assets for at least 30 days to maximize
                    returns and minimize risks.
                  </Typography>
                </Box>
              </Drawer>

              <Typography sx={{ color: 'white', fontSize: ' 0.8rem' }}>
                {parseFloat(String(stakingData[selectedOptionIndex].amount * stakingData[selectedOptionIndex].leverage || '0')).toFixed(2)} lbTON

              </Typography>
            </Box><Box display={'flex'} justifyContent={'space-between'}>
              <Typography
                sx={{
                  color: "gray",
                  fontSize: "0.8rem",
                  cursor: "pointer",
                  textDecoration: "underline dotted", // NOKTALI ALT ÇİZGİ
                  textUnderlineOffset: "3px", // Çizgiyi biraz aşağı kaydır
                }}
                onClick={() => setOpen3(true)} // Tıklandığında drawer aç
              >
                Recommended min holding period:
              </Typography>

              {/* Alttan Açılan Drawer */}
              <Drawer
                anchor="bottom" // Alttan açılmasını sağlar
                open={open3}
                onClose={() => setOpen3(false)} // Drawer dışına tıklayınca kapanır
                PaperProps={{
                  sx: {
                    borderTopLeftRadius: "16px", // Sol üst köşe yuvarlak
                    borderTopRightRadius: "16px", // Sağ üst köşe yuvarlak
                    overflow: "hidden", // Köşelerin düzgün görünmesi için
                  },
                }}
              >
                <Box
                  sx={{
                    p: 3,
                    height: "200px", // Yüksekliği ihtiyaca göre ayarla
                    display: "flex",

                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Typography fontSize="1.2rem" fontWeight="bold">
                    Minimum Holding Period
                  </Typography>
                  <Typography fontSize="0.9rem" mt={1} textAlign="center">
                    We recommend holding your assets for at least 30 days to maximize
                    returns and minimize risks.
                  </Typography>
                </Box>
              </Drawer>

              <Typography sx={{ color: 'white', fontSize: ' 0.8rem' }}>
                30 Days
              </Typography>
            </Box></>
      
      )}

        {/* Add a trust message below the CTA */}
        <Typography 
          variant="body2" 
          align="center" 
          sx={{
            mt: 2,
            color: 'rgba(255,255,255,0.5)',
            fontSize: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0.5
          }}
        >
          <Lock sx={{fontSize: 14}} />
          Secure, audited, and institutional-grade
        </Typography>
      </Box>


           <RecentStakes />


       <StatsAndTrust />


      {/* FAQ Section */}
      <Typography 
        variant="h3" 
        component="h3" 
        align="left" 
        sx={{ mb: 2, mt: 4, textAlign: 'left', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '1.1rem' }}
      >
        FAQ
      </Typography>

      {leveragedStakingItems.map((item, index) => (
        <Accordion sx={{backgroundColor:'#2f363a',color:'whitesmoke'}} key={index}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{color:"#575757"}} />}>
            <Typography variant="h6">{item.question}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>{item.answer}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}


      
 
      {/* Drawer bileşeni eklendi */}
      <Drawer
        anchor="bottom"
        open={drawerOpen}
        onClose={handleCloseDrawer}
        sx={{ backgroundColor: '#1E1E1E', transition: 'transform 0.3s ease-in-out' }} // Smooth transition
      >
        <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2,backgroundColor:"#1E1E1E" }}>

          
      

          {selectedStaking && (
            <>
              {/* Total Balance Card */}
              <Card sx={{ p: 2, boxShadow: 1, borderRadius: 2, backgroundColor:"#282828" }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'grey' }}>
                      TON Balance
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                      {totalBalance !== null ? `${totalBalance.toFixed(2)} TON` : 'Loading...'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'grey', textAlign: 'right' }}>
                      lbTON Balance
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#1976d2', textAlign: 'right' }}>
                      {lbBalance !== null ? `${lbBalance.toFixed(2)} TON` : 'Loading...'}
                    </Typography>
                  </Grid>
                </Grid>
              </Card>

              {/* Staking Details Card */}
               <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                  Details
                </Typography>
              <Card sx={{  p: 2,backgroundColor:"#282828", boxShadow: 1, borderRadius: 2 }}>
             
              <Grid container  spacing={1}>
                
                  <Grid item xs={6}>
                    <Typography sx={{color:"gray"}}>Duration: <span style={{color:"white",fontWeight: 'bold'}}> {selectedStaking.data.duration} {selectedStaking.data.duration > 30 ? 'Days' : 'Day'}</span> </Typography>
                   
                  </Grid>
                  <Grid item xs={6}>
                    <Typography sx={{color:"gray"}}>Leverage: <span style={{color:"white",fontWeight: 'bold'}}>{selectedStaking.data.leverage}x</span> </Typography>
                  </Grid>
                </Grid>
              </Card>


              
              {/* Input Field Card */}
                <Typography  sx={{ fontWeight: 'bold', color: '#1976d2', mb:-2 }}>
                                Adjust Staking Amount</Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ width: '100%' }}>
                    <TextField
                      label=""
                          value={selectedStaking.data.amount || '0'}
                      onChange={(e) => {
                        const newAmount = parseFloat(e.target.value);
                        handleAmountChange(selectedOptionIndex, newAmount);
                      }}
                      sx={{ 
                        mt: 2, 
                        width: '100%', 
                        backgroundColor: '#282828', // Set background color
                        color: 'white', // Set text color
                        fontSize: '2rem',
                        borderRadius: 2,
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'transparent', // Set border color to transparent
                        },
                        '& .MuiInputBase-input': {
                          color: 'white', // Ensure input text is white
                        },
                      }}
                      error={!!errorMessage}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <img src={tonLogo} alt="TON Logo" style={{ width: '25px', height: '25px' }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <Button
                            variant="outlined"
                            color="primary"
                            sx={{ ml: 1, fontSize: '1rem' }}
                            onClick={() => { 
                              if (totalBalance !== null) {
                                handleAmountChange(selectedOptionIndex, totalBalance);
                              }
                            }}
                          >
                           Max
                          </Button>
                        ),
                      }}
                    />
                  </Box>
                </Box>

                <Box mt={1} display={'flex'}>
                  <Typography variant="body1" sx={{ color: 'white' }}>
                    <span style={{color:"gray", fontSize: '0.8rem'}}>
                      Available : </span> {totalBalance !== null ? `${totalBalance.toFixed(2)} TON` : 'Loading...'}
                  </Typography>
                  <AddCircleOutlineIcon onClick={handleNavigate} fontSize='small' sx={{ ml: 1, color:'#89d9ff' }} />
                </Box>

                {/* Yeni kutu ekleniyor */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  mt: -2, 
                  borderTop: 0, 
                  borderRadius: '0 0 4px 4px',
                  backgroundColor: '#1E1E1E' 
                }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'gray' }}>
                    Est. Position Size:
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#1976d2' }}>

                   
                    {parseFloat(String(selectedStaking.data.amount * selectedStaking.data.leverage || '0')).toFixed(2)} lbTON



                  </Typography>
                </Box>

                 {/* Add this section to display the error message */}
                <Box sx={{  }}>
                  {errorMessage && (
                    <Typography variant="body2" color="error" sx={{ textAlign: 'center' }}>
                      {errorMessage}
                    </Typography>
                  )}
                </Box>

                {/* Earnings Breakdown Section */}
                  <Typography  sx={{ fontWeight: 'bold', color: '#1976d2', mt:-2 }}>
                    Estimated Earnings
                  </Typography>
                  <Box display={'flex'} justifyContent={'space-between'} gap={1}>
                  <Box sx={{width:'49%', p: 2, border: '1px solid #1976d2', borderRadius: 2 }}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                     Earnings:
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                      {calculateEarnings(
                        selectedStaking.data.amount,
                        selectedStaking.data.duration,
                        selectedStaking.data.leverage,
                        selectedStaking.option.apy
                      ).toFixed(2)} TON
                    </Typography>
                  </Box>
                                      <Box sx={{ width:'49%', p: 2, border: '1px solid #1976d2', borderRadius: 2, backgroundColor: '#e3f2fd'}}>

                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      Total to Repay:
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                      {(
                        calculateEarnings(
                          selectedStaking.data.amount,
                          selectedStaking.data.duration,
                          selectedStaking.data.leverage,
                          selectedStaking.option.apy
                        ) + selectedStaking.data.amount
                      ).toFixed(2)} TON
                    </Typography>
                  </Box>
                  </Box>
                
                


                {/* Start Staking Button */}
                <Box sx={{gap:1, display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                  <Button
                    variant="outlined"
                    color="error"
                    sx={{ width: '25%', borderRadius: 2 }}
                    onClick={handleCloseDrawer} // Close the drawer on click
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{
                      width: '75%',
                      borderRadius: 2,
                      backgroundColor: selectedStaking === null ||
                        selectedStaking.data.amount < stakingOptions[selectedOptionIndex].tonRange.min || 
                        selectedStaking.data.amount > stakingOptions[selectedOptionIndex].tonRange.max ||
                        (totalBalance !== null && selectedStaking.data.amount > totalBalance)
                        ? 'gray !important' // Background color when disabled
                        : '#89d9ff !important', // Background color when enabled
                      color: selectedStaking === null ||
                        selectedStaking.data.amount < stakingOptions[selectedOptionIndex].tonRange.min ||
                        selectedStaking.data.amount > stakingOptions[selectedOptionIndex].tonRange.max ||
                        (totalBalance !== null && selectedStaking.data.amount > totalBalance)
                        ? 'white !important' // Text color when disabled
                        : 'black !important', // Text color when enabled
                      opacity: selectedStaking === null ||
                        selectedStaking.data.amount < stakingOptions[selectedOptionIndex].tonRange.min ||
                        selectedStaking.data.amount > stakingOptions[selectedOptionIndex].tonRange.max ||
                        (totalBalance !== null && selectedStaking.data.amount > totalBalance)
                        ? 0.6 // Reduced opacity when disabled
                        : 1, // Full opacity when enabled
                      filter: selectedStaking === null ||
                        selectedStaking.data.amount < stakingOptions[selectedOptionIndex].tonRange.min ||
                        selectedStaking.data.amount > stakingOptions[selectedOptionIndex].tonRange.max ||
                        (totalBalance !== null && selectedStaking.data.amount > totalBalance)
                        ? 'blur(2px)' // Blur effect when disabled
                        : 'none', // No blur when enabled
                    }} 
                    onClick={handleStartStaking} 
                    disabled={
                      selectedStaking === null ||
                      selectedStaking.data.amount < stakingOptions[selectedOptionIndex].tonRange.min ||
                      selectedStaking.data.amount > stakingOptions[selectedOptionIndex].tonRange.max ||
                      (totalBalance !== null && selectedStaking.data.amount > totalBalance)
                    }
                  >
                    Confirm & Complete
                  </Button>
                </Box>

                {/* Deposit Button and Message */}
                {totalBalance !== null && selectedStaking && selectedStaking.data.amount > totalBalance && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2" color="error" align="center" sx={{ mb: 1 }}>
                      You do not have enough balance
                    </Typography>
         
                    <Button
                      variant="outlined"
                      color="error"
                      fullWidth
                      onClick={() => {
                        navigate("/latest-booba/spin"); // Redirect to the specified path
                      }}
                    >
                      Deposit
                    </Button>
                  </Box>
                )}
            </>
          )}
        </Box>
      </Drawer>

      {/* Success Modal */}
      <Modal
        open={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        aria-labelledby="success-modal-title"
        aria-describedby="success-modal-description"
      >
        <Box sx={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)', 
          width: 300, 
          bgcolor: 'background.paper', 
          boxShadow: 24, 
          p: 4, 
          borderRadius: 2,
          textAlign: 'center' // Center align text
        }}>
          <Typography id="success-modal-title" variant="h6" component="h2">
            {messages[currentMessageIndex]} {/* Display current message */}
          </Typography>
          {isLoading && (
            <Box sx={{ mt: 2 }}>
              <LinearProgress variant="determinate" value={progress} /> {/* Loading progress bar */}
            </Box>
          )}
          {currentMessageIndex === messages.length - 1 && ( // Show close button after last message
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => setSuccessModalOpen(false)} 
              sx={{ mt: 2 }}
            >
              Close
            </Button>
          )}
        </Box>
      </Modal>

      {/* Early Unstake Drawer */}
      <Drawer
        anchor="bottom"
        open={earlyUnstakeDrawerOpen}
        onClose={() => setEarlyUnstakeDrawerOpen(false)}
        sx={{ backgroundColor: '#1E1E1E', transition: 'transform 0.3s ease-in-out' }} // Smooth transition
      >
        <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2, backgroundColor: "#1E1E1E" }}>
          {selectedEarlyUnstake && (
            <>
            <Box display={'flex'} justifyContent={'space-between'}>

                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#b4e6ff' }}>
                    Early Unstake Details
                </Typography>

              {/* Calculate remaining time */}
                {(() => {
                    const currentTime = new Date().getTime();
                    const stakeTime = new Date(selectedEarlyUnstake.timestamp).getTime();
                    const durationInMillis = selectedEarlyUnstake.duration * 24 * 60 * 60 * 1000; // Convert duration to milliseconds
                    const remainingTime = stakeTime + durationInMillis - currentTime; // Calculate remaining time

                    if (remainingTime > 0) {
                        const remainingDays = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
                        const remainingHours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                        const remainingMinutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));

                        if (remainingDays >= 1) {
                            return (
                                <Typography variant="body1" sx={{ color: 'white' }}>
                                  <CircularProgress color="error" size={'15px'} />  {remainingDays} D , {remainingHours} H
                                </Typography>
                            );
                        } else {
                            return (
                                <Typography variant="body1" sx={{ color: 'white' }}>
                                     <CircularProgress color="error" size={'15px'} />  {remainingHours} H ,{remainingMinutes} Min
                                </Typography>
                            );
                        }
                    } else {
                        return (
                            <Typography variant="body1" sx={{ color: 'white' }}>
                                Staking period has ended.
                            </Typography>
                        );
                    }
                })()}
                
              
          
            </Box>
           
            <Box border={'1px solid red'} borderRadius={2} bgcolor={'#282828'} p={1} display={'flex'} justifyContent={'space-between'}>
                <Typography variant="body1" sx={{ color: 'white' }}>
                    Penalty:  
                    <span style={{color:'red', marginLeft:'5px'}}>
                    -{(selectedEarlyUnstake.earnings)} TON </span> 
                </Typography>

                    <Typography variant="body1" sx={{ color: 'white' }}>
                    Fee: 
                    <span style={{color:'red', marginLeft:'5px'}}>
                  -{(selectedEarlyUnstake.amount * 0.04).toFixed(2)} TON   </span> 
                </Typography> 

            </Box>
                 <Box display={'flex'} justifyContent={'center'}>
                        <Typography variant="body1" sx={{ color: 'gray' }}>
                          Total Repay:    
                          <span style={{color:"#b4e6ff", marginLeft:'5px', fontSize:'1.2rem'}}>
                      {(selectedEarlyUnstake.amount - selectedEarlyUnstake.amount * 0.04).toFixed(2)} TON

                          </span>
                </Typography>

            </Box>
             
            
                  
                
              
             
              
          
           
              <Button
    variant="contained"
    color="primary"
    onClick={() => { 
        // Call the handleEarlyUnstake function with the selected amount
        handleEarlyUnstake(selectedEarlyUnstake.amount);
 
        // Close the drawer after action
        setEarlyUnstakeDrawerOpen(false);
    }}
>
    Confirm Early Unstake
</Button>
            </>
          )} 
        </Box>
      </Drawer>


   
      
      {/* Unstake Drawer */}
      <Drawer
        anchor="bottom"
        open={ UnstakeDrawerOpen
}
        onClose={() => setUnstakeDrawerOpen(false)}
        sx={{ backgroundColor: '#1E1E1E', transition: 'transform 0.3s ease-in-out' }} // Smooth transition
      >
        <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2, backgroundColor: "#1E1E1E" }}>
          {selectedUnstake && ( 
            <>
            <Box display={'flex'} justifyContent={'space-between'}>

                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#b4e6ff' }}>
                    Unstake Details
                </Typography>

              {/* Calculate remaining time */}
                {(() => {
                    const currentTime = new Date().getTime();
                    const stakeTime = new Date(selectedUnstake.timestamp).getTime();
                    const durationInMillis = selectedUnstake.duration * 24 * 60 * 60 * 1000; // Convert duration to milliseconds
                    const remainingTime = stakeTime + durationInMillis - currentTime; // Calculate remaining time

                    if (remainingTime > 0) {
                        const remainingDays = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
                        const remainingHours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                        const remainingMinutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));

                        if (remainingDays >= 1) {
                            return (
                                <Typography variant="body1" sx={{ color: 'white' }}>
                                  <CircularProgress color="error" size={'15px'} />  {remainingDays} D , {remainingHours} H
                                </Typography>
                            );
                        } else {
                            return (
                                <Typography variant="body1" sx={{ color: 'white' }}>
                                     <CircularProgress color="error" size={'15px'} />  {remainingHours} H ,{remainingMinutes} Min
                                </Typography>
                            );
                        }
                    } else {
                        return (
                            <Typography variant="body1" sx={{ color: 'white' }}>
                                Staking period has ended.
                            </Typography>
                        );
                    }
                })()}
                
              
          
            </Box>
           
            <Box border={'1px solid red'} borderRadius={2} bgcolor={'#282828'} p={1} display={'flex'} justifyContent={'space-between'}>
                <Typography variant="body1" sx={{ color: 'white' }}>
                    Earnings:  
                    <span style={{color:'green', marginLeft:'5px'}}>
                    {(selectedUnstake.earnings)} TON </span> 
                </Typography>

                    <Typography variant="body1" sx={{ color: 'white' }}>
                    Fee: 
                    <span style={{color:'red', marginLeft:'5px'}}>
                  -{(parseFloat(selectedUnstake.earnings) * 0.055).toFixed(2)} TON   </span> 
                </Typography> 

            </Box>
           
            
                  
                
              
             
              
          
           
              <Button
    variant="contained"
    color="primary"
    onClick={() => {
        // Call the handleUnstake function with the selected amount
        handleUnstake(selectedUnstake.amount);

        // Close the drawer after action
        setUnstakeDrawerOpen(false);
    }}
>
    Claim   {(
        (parseFloat(selectedUnstake.earnings) + selectedUnstake.amount) - (parseFloat(selectedUnstake.earnings) * 0.055)
      ).toFixed(2)} TON  
</Button>
            </>
          )}
           <Typography variant="body1" sx={{ color: 'gray' }}>
             
                          <span style={{ textAlign:'center'}}>
The fees vary depending on the system's load !!!     </span>
                </Typography>
        </Box>
               
      </Drawer>

    </Box>
  );
};

export default NewComponent;  