import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Slider,
  InputAdornment,
  Grid,
  Chip,
  Card,
  CardContent,
  Stack,
  Divider,
  Fade,
  CircularProgress,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { X as CloseIconLucide } from 'lucide-react';
import { 
  Sparkles,
  DollarSign,
} from 'lucide-react';
import { styled } from '@mui/material/styles';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { doc, onSnapshot, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../pages/firebaseConfig';
import StarIcon from '@mui/icons-material/Star';
import SwapDrawer from '../WalletDrawers/SwapDrawer';

interface CreatePoolModalProps {
  open: boolean;
  onClose: () => void;
}

// Styled Components
const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    '& fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    '&:hover fieldset': {
      borderColor: '#6ed3ff',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#6ed3ff',
    },
  },
  '& .MuiInputBase-input': {
    color: '#ffffff',
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.7)',
    '&.Mui-focused': {
      color: '#6ed3ff',
    },
  },
});

const StyledSelect = styled(Select)({
  borderRadius: '12px',
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: '#6ed3ff',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#6ed3ff',
  },
  '& .MuiSelect-icon': {
    color: '#6ed3ff',
  }
});

const StyledCard = styled(Card)({
  background: 'rgba(255, 255, 255, 0.02)',
  backdropFilter: 'blur(10px)',
  borderRadius: '12px',
  padding: '16px',
  transition: 'all 200ms ease-in-out',
});

const StyledButton = styled(Button)(({ variant }) => ({
  borderRadius: '12px',
  textTransform: 'none',
  padding: '8px 24px',
  ...(variant === 'contained' && {
    backgroundColor: '#6ed3ff',
    color: '#1A2126',
    '&:hover': {
      backgroundColor: '#8edbff',
    },
    '&:disabled': {
      backgroundColor: 'rgba(110, 211, 255, 0.3)',
      color: 'rgba(255, 255, 255, 0.3)',
    }
  }),
  ...(variant === 'outlined' && {
    borderColor: 'rgba(110, 211, 255, 0.5)',
    color: '#6ed3ff',
    '&:hover': {
      borderColor: '#6ed3ff',
      backgroundColor: 'rgba(110, 211, 255, 0.1)',
    },
    '&:disabled': {
      borderColor: 'rgba(255, 255, 255, 0.1)',
      color: 'rgba(255, 255, 255, 0.3)',
    }
  })
}));

const StyledSwitch = styled(Switch)({
  '& .MuiSwitch-switchBase': {
    '&.Mui-checked': {
      color: '#6ed3ff',
      '& + .MuiSwitch-track': {
        backgroundColor: '#6ed3ff',
        opacity: 0.5,
      },
    },
  },
  '& .MuiSwitch-track': {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
});

const StyledSlider = styled(Slider)({
  color: '#6ed3ff',
  '& .MuiSlider-thumb': {
    '&:hover, &.Mui-focusVisible': {
      boxShadow: '0 0 0 8px rgba(110, 211, 255, 0.2)',
    },
  },
  '& .MuiSlider-rail': {
    opacity: 0.3,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  '& .MuiSlider-track': {
    backgroundColor: '#6ed3ff',
  },
});

const StyledStarsModal = styled(Modal)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const StyledStarsModalContent = styled(Box)({
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

const StyledSwapDrawer = styled(SwapDrawer)({
  '& .MuiDrawer-root': {
    zIndex: 9999
  }
});

const CreatePoolModal: React.FC<CreatePoolModalProps> = ({ open, onClose }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [formData, setFormData] = useState({
    investmentAmount: '',
    riskLevel: 'moderate',
    tradingStrategy: 'balanced',
    aiModel: 'conservative',
    rebalancingFrequency: 'daily',
    stopLoss: '10',
    takeProfit: '20',
    maxDrawdown: '15',
    leverageEnabled: false,
    maxLeverage: '2',
    automatedReporting: true,
    notificationPreferences: ['email'],
    profitSharing: {
      poolCreator: 20,
      investors: 80
    },
    poolName: '',
    poolDescription: '',
  });
  const [showStarsModal, setShowStarsModal] = useState(false);
  const [showLevelUpSuccess, setShowLevelUpSuccess] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [userData, setUserData] = useState<any>(null);
  const [showSwapDrawer, setShowSwapDrawer] = useState(false);

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

  const handleChange = (field: string) => (event: any) => {
    setFormData({
      ...formData,
      [field]: event.target.value
    });
  };

  const handleStepClick = (step: number) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveStep(step);
      setIsTransitioning(false);
    }, 300);
  };

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      handleStepClick(activeStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      handleStepClick(activeStep - 1);
    }
  };

  const handleLevelUpgrade = async () => {
    setIsUpgrading(true);
    setErrorMessage('');

    const telegramUserId = localStorage.getItem("telegramUserId");
    if (!telegramUserId) {
      setErrorMessage('User ID not found');
      setIsUpgrading(false);
      return;
    }

    try {
      const userRef = doc(db, "users", telegramUserId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        setErrorMessage('User data not found');
        setIsUpgrading(false);
        return;
      }

      const userData = userDoc.data();
      const currentLevel = userData.level || 0;
      const nextLevel = currentLevel + 1;
      const requiredTickets = nextLevel;
      
      if (!userData.tickets || userData.tickets < requiredTickets) {
        setErrorMessage(`Not enough tickets. Need ${requiredTickets} tickets for level ${nextLevel}`);
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
      setErrorMessage('Failed to process upgrade. Please try again.');
    } finally {
      setIsUpgrading(false);
    }
  };

  const handleCreatePool = () => {
    const currentLevel = userData?.level || 0;
    const requiredLevel = 200; // Pool oluşturmak için gereken minimum level

    if (currentLevel < requiredLevel) {
      setShowStarsModal(true);
      return;
    }

    // Pool creation logic here
    // ...
  };

  const handleGetMoreTickets = () => {
    onClose(); // Close the CreatePoolModal
    setShowStarsModal(false);
    setShowSwapDrawer(true);
  };

  const steps = [
    {
      label: 'Basic Info',
      content: (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <StyledCard>
              <CardContent>
                <Stack spacing={4}>
                  <Box>
                    <Typography variant="h5" sx={{ 
                      color: '#6ed3ff',
                      fontWeight: 600,
                      mb: 1,
                      textAlign: 'center'
                    }}>
                      Pool Information
                    </Typography>
                    <Typography sx={{ 
                      color: 'rgba(255, 255, 255, 0.6)',
                      textAlign: 'center',
                      fontSize: '0.95rem'
                    }}>
                      Set up your AI fund manager pool
                    </Typography>
                  </Box>

                  <Stack spacing={3}>
                    <StyledTextField
                      fullWidth
                      label="Pool Name"
                      value={formData.poolName}
                      onChange={handleChange('poolName')}
                      placeholder="Enter a unique name for your pool"
                    />
                    <StyledTextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Pool Description"
                      value={formData.poolDescription}
                      onChange={handleChange('poolDescription')}
                      placeholder="Describe your pool's investment strategy and goals"
                    />
                  </Stack>
                </Stack>
              </CardContent>
            </StyledCard>
          </Grid>
        </Grid>
      )
    },
    {
      label: 'Investment',
      content: (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <StyledCard>
              <CardContent>
                <Stack spacing={4}>
                  <Box>
                    <Typography variant="h5" sx={{ 
                      color: '#6ed3ff',
                      fontWeight: 600,
                      mb: 1,
                      textAlign: 'center'
                    }}>
                      Investment Parameters
                    </Typography>
                    <Typography sx={{ 
                      color: 'rgba(255, 255, 255, 0.6)',
                      textAlign: 'center',
                      fontSize: '0.95rem'
                    }}>
                      Set your investment amount and risk preferences
                    </Typography>
                  </Box>

                  <Box sx={{ position: 'relative' }}>
                    <StyledTextField
                      fullWidth
                      type="number"
                      value={formData.investmentAmount}
                      onChange={handleChange('investmentAmount')}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <DollarSign size={24} style={{ color: '#6ed3ff' }} />
                          </InputAdornment>
                        ),
                      }}
                      label="Initial Investment"
                    />
                  </Box>

                  <FormControl fullWidth>
                    <InputLabel>Risk Level</InputLabel>
                    <StyledSelect
                      value={formData.riskLevel}
                      onChange={handleChange('riskLevel')}
                    >
                      <MenuItem value="conservative">Conservative</MenuItem>
                      <MenuItem value="moderate">Moderate</MenuItem>
                      <MenuItem value="aggressive">Aggressive</MenuItem>
                    </StyledSelect>
                  </FormControl>
                </Stack>
              </CardContent>
            </StyledCard>
          </Grid>
        </Grid>
      )
    },
    {
      label: 'AI Strategy',
      content: (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <StyledCard>
              <CardContent>
                <Stack spacing={4}>
                  <Box>
                    <Typography variant="h5" sx={{ 
                      color: '#6ed3ff',
                      fontWeight: 600,
                      mb: 1,
                      textAlign: 'center'
                    }}>
                      AI Trading Strategy
                    </Typography>
                    <Typography sx={{ 
                      color: 'rgba(255, 255, 255, 0.6)',
                      textAlign: 'center',
                      fontSize: '0.95rem'
                    }}>
                      Configure your AI fund manager's trading approach
                    </Typography>
                  </Box>

                  <FormControl fullWidth>
                    <InputLabel>Trading Strategy</InputLabel>
                    <Select
                      value={formData.tradingStrategy}
                      onChange={handleChange('tradingStrategy')}
                      label="Trading Strategy"
                    >
                      <MenuItem value="momentum">Momentum Trading</MenuItem>
                      <MenuItem value="balanced">Balanced Growth</MenuItem>
                      <MenuItem value="value">Value Investing</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel>AI Model Type</InputLabel>
                    <Select
                      value={formData.aiModel}
                      onChange={handleChange('aiModel')}
                      label="AI Model Type"
                    >
                      <MenuItem value="conservative">Conservative ML</MenuItem>
                      <MenuItem value="balanced">Balanced Neural Network</MenuItem>
                      <MenuItem value="aggressive">Aggressive Deep Learning</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
              </CardContent>
            </StyledCard>
          </Grid>
        </Grid>
      )
    },
    {
      label: 'Rebalancing',
      content: (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <StyledCard>
              <CardContent>
                <Stack spacing={4}>
                  <Box>
                    <Typography variant="h5" sx={{ 
                      color: '#6ed3ff',
                      fontWeight: 600,
                      mb: 1,
                      textAlign: 'center'
                    }}>
                      Portfolio Rebalancing
                    </Typography>
                    <Typography sx={{ 
                      color: 'rgba(255, 255, 255, 0.6)',
                      textAlign: 'center',
                      fontSize: '0.95rem'
                    }}>
                      Set up automated portfolio rebalancing preferences
                    </Typography>
                  </Box>

                  <FormControl fullWidth>
                    <InputLabel>Rebalancing Frequency</InputLabel>
                    <Select
                      value={formData.rebalancingFrequency}
                      onChange={handleChange('rebalancingFrequency')}
                      label="Rebalancing Frequency"
                    >
                      <MenuItem value="hourly">Hourly</MenuItem>
                      <MenuItem value="daily">Daily</MenuItem>
                      <MenuItem value="weekly">Weekly</MenuItem>
                      <MenuItem value="monthly">Monthly</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
              </CardContent>
            </StyledCard>
          </Grid>
        </Grid>
      )
    },
    {
      label: 'Risk Management',
      content: (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <StyledCard>
              <CardContent>
                <Stack spacing={4}>
                  <Box>
                    <Typography variant="h5" sx={{ 
                      color: '#6ed3ff',
                      fontWeight: 600,
                      mb: 1,
                      textAlign: 'center'
                    }}>
                      Risk Management Settings
                    </Typography>
                    <Typography sx={{ 
                      color: 'rgba(255, 255, 255, 0.6)',
                      textAlign: 'center',
                      fontSize: '0.95rem'
                    }}>
                      Configure risk management parameters
                    </Typography>
                  </Box>

                  <StyledTextField
                    fullWidth
                    type="number"
                    label="Stop Loss (%)"
                    value={formData.stopLoss}
                    onChange={handleChange('stopLoss')}
                  />

                  <StyledTextField
                    fullWidth
                    type="number"
                    label="Take Profit (%)"
                    value={formData.takeProfit}
                    onChange={handleChange('takeProfit')}
                  />

                  <StyledTextField
                    fullWidth
                    type="number"
                    label="Maximum Drawdown (%)"
                    value={formData.maxDrawdown}
                    onChange={handleChange('maxDrawdown')}
                  />
                </Stack>
              </CardContent>
            </StyledCard>
          </Grid>
        </Grid>
      )
    },
    {
      label: 'Leverage',
      content: (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <StyledCard>
              <CardContent>
                <Stack spacing={4}>
                  <Box>
                    <Typography variant="h5" sx={{ 
                      color: '#6ed3ff',
                      fontWeight: 600,
                      mb: 1,
                      textAlign: 'center'
                    }}>
                      Leverage Settings
                    </Typography>
                    <Typography sx={{ 
                      color: 'rgba(255, 255, 255, 0.6)',
                      textAlign: 'center',
                      fontSize: '0.95rem'
                    }}>
                      Configure leverage options for the AI manager
                    </Typography>
                  </Box>

                  <FormControlLabel
                    control={
                      <StyledSwitch
                        checked={formData.leverageEnabled}
                        onChange={(e) => setFormData({
                          ...formData,
                          leverageEnabled: e.target.checked
                        })}
                      />
                    }
                    label="Enable Leverage Trading"
                  />

                  {formData.leverageEnabled && (
                    <StyledTextField
                      fullWidth
                      type="number"
                      label="Maximum Leverage (x)"
                      value={formData.maxLeverage}
                      onChange={handleChange('maxLeverage')}
                    />
                  )}
                </Stack>
              </CardContent>
            </StyledCard>
          </Grid>
        </Grid>
      )
    },
    {
      label: 'Reporting',
      content: (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <StyledCard>
              <CardContent>
                <Stack spacing={4}>
                  <Box>
                    <Typography variant="h5" sx={{ 
                      color: '#6ed3ff',
                      fontWeight: 600,
                      mb: 1,
                      textAlign: 'center'
                    }}>
                      Reporting Preferences
                    </Typography>
                    <Typography sx={{ 
                      color: 'rgba(255, 255, 255, 0.6)',
                      textAlign: 'center',
                      fontSize: '0.95rem'
                    }}>
                      Configure automated reporting and notifications
                    </Typography>
                  </Box>

                  <FormControlLabel
                    control={
                      <StyledSwitch
                        checked={formData.automatedReporting}
                        onChange={(e) => setFormData({
                          ...formData,
                          automatedReporting: e.target.checked
                        })}
                      />
                    }
                    label="Enable Automated Reporting"
                  />

                  <FormControl fullWidth>
                    <InputLabel>Notification Preferences</InputLabel>
                    <Select
                      multiple
                      value={formData.notificationPreferences}
                      onChange={handleChange('notificationPreferences')}
                      label="Notification Preferences"
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => (
                            <Chip
                              key={value}
                              label={value}
                              sx={{
                                bgcolor: '#6ed3ff15',
                                color: '#6ed3ff',
                                borderRadius: '8px',
                                '& .MuiChip-label': {
                                  px: 1.5,
                                },
                                '&:hover': {
                                  bgcolor: '#6ed3ff25',
                                }
                              }}
                            />
                          ))}
                        </Box>
                      )}
                    >
                      <MenuItem value="email">Email</MenuItem>
                      <MenuItem value="push">Push Notifications</MenuItem>
                      <MenuItem value="telegram">Telegram</MenuItem>
                      <MenuItem value="discord">Discord</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
              </CardContent>
            </StyledCard>
          </Grid>
        </Grid>
      )
    },
    {
      label: 'Profit Sharing',
      content: (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <StyledCard>
              <CardContent>
                <Stack spacing={4}>
                  <Box>
                    <Typography variant="h5" sx={{ 
                      color: '#6ed3ff',
                      fontWeight: 600,
                      mb: 1,
                      textAlign: 'center'
                    }}>
                      Profit Distribution
                    </Typography>
                    <Typography sx={{ 
                      color: 'rgba(255, 255, 255, 0.6)',
                      textAlign: 'center',
                      fontSize: '0.95rem'
                    }}>
                      Configure profit sharing between pool creator and investors
                    </Typography>
                  </Box>

                  <Box>
                    <Typography sx={{ color: 'grey.400', mb: 1 }}>
                      Pool Creator Share
                    </Typography>
                    <StyledSlider
                      value={formData.profitSharing.poolCreator}
                      onChange={handleChange('profitSharing.poolCreator')}
                      sx={{
                        '& .MuiSlider-thumb': {
                          '&:hover, &.Mui-focusVisible': {
                            boxShadow: '0 0 0 8px rgba(110, 211, 255, 0.2)',
                          },
                        },
                        '& .MuiSlider-rail': {
                          opacity: 0.3,
                        },
                        '& .MuiSlider-mark': {
                          backgroundColor: '#64748b',
                        },
                        '& .MuiSlider-markLabel': {
                          color: 'gray',
                        }
                      }}
                    />
                  </Box>

                  <Box>
                    <Typography sx={{ color: 'grey.400', mb: 1 }}>
                      Investors Share
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#fff', textAlign: 'center' }}>
                      {formData.profitSharing.investors}%
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </StyledCard>
          </Grid>
        </Grid>
      )
    },
    {
      label: 'Review',
      content: (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <StyledCard>
              <CardContent>
                <Stack spacing={4}>
                  <Box>
                    <Typography variant="h5" sx={{ 
                      color: '#6ed3ff',
                      fontWeight: 600,
                      mb: 1,
                      textAlign: 'center'
                    }}>
                      Review Configuration
                    </Typography>
                    <Typography sx={{ 
                      color: 'rgba(255, 255, 255, 0.6)',
                      textAlign: 'center',
                      fontSize: '0.95rem'
                    }}>
                      Review your AI fund manager configuration
                    </Typography>
                  </Box>

                  <Stack spacing={2}>
                    {Object.entries(formData).map(([key, value]) => (
                      <Box key={key}>
                        <Typography sx={{ color: 'grey.400', fontSize: '0.9rem' }}>
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </Typography>
                        <Typography sx={{ color: '#fff' }}>
                          {typeof value === 'object' ? JSON.stringify(value) : value.toString()}
                        </Typography>
                        <Divider sx={{ mt: 1 }} />
                      </Box>
                    ))}
                  </Stack>
                </Stack>
              </CardContent>
            </StyledCard>
          </Grid>
        </Grid>
      )
    },
    {
      label: 'Confirm',
      content: (
        <Grid container spacing={3}>
          <Grid item xs={12}>
              <CardContent>
                <Stack spacing={4}>
                  <Box>
                    <Typography variant="h5" sx={{ 
                      color: '#6ed3ff',
                      fontWeight: 600,
                      mb: 1,
                      textAlign: 'center'
                    }}>
                      Create AI Fund Manager Pool
                    </Typography>
                    <Typography sx={{ 
                      color: 'rgba(255, 255, 255, 0.6)',
                      textAlign: 'center',
                      fontSize: '0.95rem'
                    }}>
                      Confirm and create your AI-managed investment pool
                    </Typography>
                  </Box>

                  <Box sx={{ textAlign: 'center' }}>
                    <StyledButton
                      variant="contained"
                      size="large"
                      startIcon={<Sparkles />}
                      onClick={handleCreatePool}
                      sx={{
                        bgcolor: '#6ed3ff',
                        px: 4,
                        py: 1.5,
                        borderRadius: '12px'
                      }}
                    >
                      Create Pool
                    </StyledButton>
                  </Box>
                </Stack>
              </CardContent>
          </Grid>
        </Grid>
      )
    }
  ];

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="create-pool-modal"
        closeAfterTransition
        sx={{
          display: 'flex',
          alignItems: 'flex-end',
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
          }
        }}
      >
        <Fade in={open}>
          <Box
            sx={{
              width: '100%',
              height: '85vh',
              borderRadius: '24px 24px 0 0',
              background: 'linear-gradient(180deg, rgba(26, 33, 38, 0.99) 0%, rgba(26, 33, 38, 0.95) 100%)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Header */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              p: 3,
              borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
            }}>
              <Button
                onClick={onClose}
                sx={{
                  color: 'rgba(255, 255, 255, 0.5)',
                  '&:hover': { color: '#fff' },
                  minWidth: '40px',
                  padding: '8px'
                }}
              >
                <CloseIconLucide />
              </Button>
              <Typography 
                variant="h6" 
                sx={{ 
                  position: 'absolute',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  color: '#fff',
                  opacity: 0.7,
                  textAlign: 'center',
                  whiteSpace: 'nowrap'
                }}
              >
                Create New Pool
              </Typography>
              <Box sx={{ width: 40 }} />
            </Box>

            {/* Scrollable Content */}
            <Box sx={{ 
              flex: 1,
              overflow: 'auto',
              p: 3,
              '&::-webkit-scrollbar': {
                display: 'none'
              },
            }}>
              {isTransitioning ? (
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%'
                }}>
                  <CircularProgress sx={{ color: '#6ed3ff' }} />
                </Box>
              ) : (
                steps[activeStep].content
              )}
            </Box>

            {/* Fixed Bottom Buttons */}
            <Box // @ts-ignore
            sx={{ 
              p: 3,
              borderTop: '1px solid rgba(255, 255, 255, 0.05)',
              background: 'linear-gradient(180deg, rgba(26, 33, 38, 0.95) 0%, rgba(26, 33, 38, 0.99) 100%)',
            }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                gap: 2,
              }}>
                <StyledButton
                  variant="outlined"
                  onClick={handleBack}
                  disabled={activeStep === 0}
                  startIcon={<KeyboardArrowLeft />}
                  sx={{ flex: 1 }}
                >
                  Back
                </StyledButton>
                <StyledButton
                  variant="contained"
                  onClick={activeStep === steps.length - 1 ? handleCreatePool : handleNext}
                  endIcon={activeStep === steps.length - 1 ? <Sparkles /> : <KeyboardArrowRight />}
                  sx={{ flex: 1 }}
                >
                  {activeStep === steps.length - 1 ? 'Create Pool' : 'Next'}
                </StyledButton>
              </Box>
            </Box>
          </Box>
        </Fade>
      </Modal>

      <StyledStarsModal
        open={showStarsModal}
        onClose={() => !isUpgrading && setShowStarsModal(false)}
      >
        <StyledStarsModalContent>
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
              <Box // @ts-ignore
               sx={{ 
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
            {errorMessage && (
              <Typography sx={{ 
                color: '#ff4d4d', 
                fontSize: '14px',
                textAlign: 'center',
                padding: '8px 12px',
                backgroundColor: 'rgba(255, 77, 77, 0.1)',
                borderRadius: '8px',
                width: '100%'
              }}>
                {errorMessage}
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
                    onClick={handleGetMoreTickets}
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
        </StyledStarsModalContent>
      </StyledStarsModal>

      <Modal
        open={showLevelUpSuccess}
        onClose={() => setShowLevelUpSuccess(false)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box // @ts-ignore
          sx={{
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
            animation: 'pulse 1s ease-out'
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

      <StyledSwapDrawer
        open={showSwapDrawer}
        onClose={() => {
          setShowSwapDrawer(false);
          onClose(); // Keep the main modal closed
        }}
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
          open && onClose(); // Keep the main modal closed if it was open
        }}
      />
    </>
  );
};

export default CreatePoolModal; 