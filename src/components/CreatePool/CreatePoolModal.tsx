import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  
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
  Paper,
  Checkbox,
} from '@mui/material';
import { X as CloseIconLucide } from 'lucide-react';
import { 
  Sparkles,
  DollarSign,
  ShieldCheck,
  Activity,
  Rocket,
  Brain,
  Network,
  Cpu,
  Clock1,
  Calendar,
  CalendarDays,
  CalendarRange,
  Mail,
  Bell,
  Send,
  MessageCircle,
} from 'lucide-react';
import { styled } from '@mui/material/styles';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { doc, onSnapshot, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../pages/firebaseConfig';
import StarIcon from '@mui/icons-material/Star';
import SwapDrawer from '../WalletDrawers/SwapDrawer';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DepositDrawer from '../WalletDrawers/DepositDrawer';

interface CreatePoolModalProps {
  open: boolean;
  onClose: () => void;
}

// Add type definitions
type RiskLevel = 'conservative' | 'moderate' | 'aggressive';
type AIModel = 'conservative' | 'balanced' | 'aggressive';
type RebalancingFrequency = 'hourly' | 'daily' | 'weekly' | 'monthly';
type NotificationChannel = 'email' | 'push' | 'telegram' | 'discord';
type TradingStrategy = 'momentum' | 'balanced' | 'value';

// Update the formData interface
type FormData = {
  investmentAmount: string;
  riskLevel: RiskLevel;
  tradingStrategy: TradingStrategy;
  aiModel: AIModel;
  rebalancingFrequency: RebalancingFrequency;
  stopLoss: string;
  takeProfit: string;
  maxDrawdown: string;
  maxLeverage: string;
  automatedReporting: boolean;
  notificationPreferences: NotificationChannel[];
  profitSharing: {
    poolCreator: number;
    investors: number;
  };
  poolName: string;
  poolDescription: string;
  selectedDuration: '1d' | '7d' | '14d' | '30d';
  acknowledgments: {
    investment: boolean;
    strategy: boolean;
    rebalancing: boolean;
    riskManagement: boolean;
    leverage: boolean;
    reporting: boolean;
    profitSharing: boolean;
  };
};

// Add new interface for form errors
interface FormErrors {
  investmentAmount?: string;
  riskLevel?: string;
  tradingStrategy?: string;
  aiModel?: string;
  rebalancingFrequency?: string;
  stopLoss?: string;
  takeProfit?: string;
  maxDrawdown?: string;
  maxLeverage?: string;
  notificationPreferences?: string;
  acknowledgment?: string;
}

// Add new interface for estimated earnings
interface EstimatedEarnings {
  amount: number;
  percentage: number;
  dailyAmount: number;
  dailyPercentage: number;
}

// Add new interface for selected percentages
interface SelectedPercentages {
  duration: number;
  risk: number;
  strategy: number;
  aiModel: number;
  leverage: number;
}


// Styled Components
const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: 'rgba(26, 33, 38, 0.6)',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.2s ease-in-out',
    '& fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.1)',
      transition: 'all 0.2s ease-in-out',
    },
    '&:hover fieldset': {
      borderColor: '#6ed3ff',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#6ed3ff',
      borderWidth: '1px',
    },
    '&:hover': {
      backgroundColor: 'rgba(26, 33, 38, 0.8)',
    },
  },
  '& .MuiInputBase-input': {
    color: '#ffffff',
    padding: '16px',
    fontSize: '0.95rem',
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '0.95rem',
    '&.Mui-focused': {
      color: '#6ed3ff',
    },
  },
  '& .MuiInputAdornment-root': {
    '& .MuiSvgIcon-root': {
      color: '#6ed3ff',
    }
  }
});

const StyledSelect = styled(Select)({
  borderRadius: '12px',
  backgroundColor: 'rgba(26, 33, 38, 0.6)',
  backdropFilter: 'blur(10px)',
  transition: 'all 0.2s ease-in-out',
  height: '56px',
  '& .MuiOutlinedInput-notchedOutline': {
    border: '1px solid rgba(255, 255, 255, 0.1)',
    transition: 'all 0.2s ease-in-out',
  },
  '&:hover': {
    backgroundColor: 'rgba(26, 33, 38, 0.8)',
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#6ed3ff',
    },
  },
  '&.Mui-focused': {
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#6ed3ff',
      borderWidth: '1px',
    },
  },
  '& .MuiSelect-select': {
    padding: '16px',
    color: '#ffffff',
    fontSize: '0.95rem',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  '& .MuiSelect-icon': {
    color: '#6ed3ff',
    transition: 'transform 0.2s ease-in-out',
    right: '16px',
  },
  '&.Mui-focused .MuiSelect-icon': {
    transform: 'rotate(180deg)',
  },
  '& + .MuiFormLabel-root': {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '0.95rem',
    top: '-6px',
    '&.Mui-focused': {
      color: '#6ed3ff',
    },
    '&.MuiFormLabel-filled': {
      color: 'rgba(255, 255, 255, 0.7)',
    }
  },
  '& .MuiPaper-root': {
    backgroundColor: 'transparent !important'
  },
  '& .MuiMenu-paper': {
    backgroundColor: 'rgba(18, 22, 25, 0.98) !important',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(110, 211, 255, 0.1)',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
  },
  '& .MuiList-root': {
    backgroundColor: 'transparent !important',
    padding: '8px',
  },
  '& .MuiMenuItem-root': {
    backgroundColor: 'rgba(26, 33, 38, 0.95)',
    '&:hover': {
      backgroundColor: 'rgba(110, 211, 255, 0.1)',
    },
    '&.Mui-selected': {
      backgroundColor: 'rgba(110, 211, 255, 0.15)',
      '&:hover': {
        backgroundColor: 'rgba(110, 211, 255, 0.25)',
      }
    }
  }
});

const StyledCard = styled(Card)({
  background: 'linear-gradient(180deg, rgba(26, 33, 38, 0.8) 0%, rgba(26, 33, 38, 0.6) 100%)',
  backdropFilter: 'blur(10px)',
  borderRadius: '16px',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  padding: '16px',
  transition: 'all 200ms ease-in-out',
  '&:hover': {
    border: '1px solid rgba(110, 211, 255, 0.2)',
  }
});

const StyledButton = styled(Button)(({ variant }) => ({
  borderRadius: '12px',
  textTransform: 'none',
  padding: '8px 24px',
  ...(variant === 'contained' && {
    backgroundColor: '#6ed3ff',
    color: '#ffffff',
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
  width: 54,
  height: 32,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 4,
    '&.Mui-checked': {
      transform: 'translateX(22px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: '#6ed3ff',
        opacity: 1,
        border: 0,
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#6ed3ff',
      border: '6px solid #fff',
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color: 'rgba(255, 255, 255, 0.3)',
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: 0.3,
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 24,
    height: 24,
    color: '#fff',
    transition: 'transform 0.2s ease-in-out',
  },
  '& .MuiSwitch-track': {
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    opacity: 1,
    transition: 'background-color 0.2s ease-in-out',
  },
});

const StyledSlider = styled(Slider)({
  height: 8,
  borderRadius: 4,
  '& .MuiSlider-rail': {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    opacity: 1,
  },
  '& .MuiSlider-track': {
    background: 'linear-gradient(90deg, #6ed3ff 0%, #89d9ff 100%)',
    border: 'none',
    height: 8,
  },
  '& .MuiSlider-thumb': {
    height: 24,
    width: 24,
    backgroundColor: '#fff',
    border: '2px solid #6ed3ff',
    boxShadow: '0 0 10px rgba(110, 211, 255, 0.3)',
    '&:focus, &:hover, &.Mui-active': {
      boxShadow: '0 0 15px rgba(110, 211, 255, 0.5)',
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      backgroundColor: '#6ed3ff',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    }
  },
  '& .MuiSlider-valueLabel': {
    backgroundColor: '#6ed3ff',
    borderRadius: '8px',
    padding: '4px 8px',
    fontSize: '0.85rem',
    fontWeight: 600,
    '&::before': {
      borderBottom: '8px solid #6ed3ff',
    }
  },
  '& .MuiSlider-mark': {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    height: 8,
    width: 2,
    '&.MuiSlider-markActive': {
      backgroundColor: '#fff',
    }
  }
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

const StyledMenuItem = styled(MenuItem)({
  padding: '12px 16px',
  color: '#ffffff',
  fontSize: '0.95rem',
  transition: 'all 0.2s ease-in-out',
  backgroundColor: 'rgba(26, 33, 38, 0.95) !important',
  backdropFilter: 'blur(10px)',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  minHeight: '48px',
  borderRadius: '8px',
  marginBottom: '4px',
  '&:last-child': {
    marginBottom: 0
  },
  '&:hover': {
    backgroundColor: 'rgba(110, 211, 255, 0.1) !important',
  },
  '&.Mui-selected': {
    backgroundColor: 'rgba(110, 211, 255, 0.15) !important',
    color: '#6ed3ff',
    fontWeight: 500,
    '&:hover': {
      backgroundColor: 'rgba(110, 211, 255, 0.25) !important',
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      right: '16px',
      width: '6px',
      height: '6px',
      borderRadius: '50%',
      backgroundColor: '#6ed3ff',
    }
  }
});

const StyledFormControlLabel = styled(FormControlLabel)({
  '& .MuiFormControlLabel-label': {
    color: '#fff',
    fontSize: '0.95rem',
  }
});

const StyledChip = styled(Chip)({
  backgroundColor: 'rgba(110, 211, 255, 0.1)',
  color: '#6ed3ff',
  borderRadius: '8px',
  height: '32px',
  fontSize: '0.9rem',
  fontWeight: 500,
  border: '1px solid rgba(110, 211, 255, 0.2)',
  '& .MuiChip-label': {
    padding: '0 12px',
  },
  '& .MuiChip-deleteIcon': {
    color: '#6ed3ff',
    '&:hover': {
      color: '#89d9ff',
    }
  },
  '&:hover': {
    backgroundColor: 'rgba(110, 211, 255, 0.2)',
  }
});

// Update StyledPaper styles
const StyledPaper = styled(Paper)({
  backgroundColor: 'rgba(18, 22, 25, 0.98) !important',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(110, 211, 255, 0.1)',
  borderRadius: '12px',
  marginTop: '8px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
  '& .MuiList-root': {
    padding: '8px',
    backgroundColor: 'transparent !important',
  },
  '& .MuiMenuItem-root + .MuiMenuItem-root': {
    marginTop: '4px',
  }
});

// Add styled component for DepositDrawer
const StyledDepositDrawer = styled(DepositDrawer)({
  '& .MuiDrawer-root': {
    zIndex: 9999
  }
});

const CreatePoolModal: React.FC<CreatePoolModalProps> = ({ open, onClose }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [userBalance, setUserBalance] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    investmentAmount: '1500', // Default investment amount
    riskLevel: 'moderate',
    tradingStrategy: 'balanced',
    aiModel: 'conservative',
    rebalancingFrequency: 'daily',
    stopLoss: '10',
    takeProfit: '20',
    maxDrawdown: '15',
    maxLeverage: '10',
    automatedReporting: true,
    notificationPreferences: ['email'],
    profitSharing: {
      poolCreator: 55,
      investors: 45
    },
    poolName: '',
    poolDescription: '',
    selectedDuration: '1d', // Default duration
    acknowledgments: {
      investment: false,
      strategy: false,
      rebalancing: false,
      riskManagement: false,
      leverage: false,
      reporting: false,
      profitSharing: false
    }
  });
  const [showStarsModal, setShowStarsModal] = useState(false);
  const [showLevelUpSuccess, setShowLevelUpSuccess] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [userData, setUserData] = useState<any>(null);
  const [showSwapDrawer, setShowSwapDrawer] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [estimatedEarnings, setEstimatedEarnings] = useState<EstimatedEarnings>({
    amount: 0,
    percentage: 0,
    dailyAmount: 0,
    dailyPercentage: 0
  });

  // Add state for selected percentages
  const [selectedPercentages, setSelectedPercentages] = useState<SelectedPercentages>({
    duration: 5,     // Default 7d percentage (45%)
    risk: 2,        // Default moderate percentage
    strategy: 3,    // Default balanced percentage
    aiModel: 4,     // Default conservative percentage
    leverage: 1      // Default leverage percentage (10x = 1%)
  });

  // Update risk level multipliers for daily returns
  const riskPercentages = {
    conservative: 4,
    moderate: 8,
    aggressive: 9
  };

  // Update risk multipliers with strategy and model combinations
  const strategyPercentages = {
    momentum: 15,
    balanced: 3,
    value: 5
  };

  const aiModelPercentages = {
    conservative: 5,
    balanced: 4,
    aggressive: 3
  };

  // Add duration percentages mapping
  const durationPercentages = {
    '1d': 0.18,      // 5% daily
    '7d': 43.26,     // 5% daily
    '14d': 104.83,    // 5% daily
    '30d': 182.19    // 5% daily
  } as const;

  const [showDepositDrawer, setShowDepositDrawer] = useState(false);

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
        setUserBalance(docSnap.data().usdt || 0); // Set user balance
      } else {
        console.log("No such document!");
      }
    });

    return () => unsubscribe();
  }, []);

    // Initial calculation effect
    useEffect(() => {
      calculateEstimatedEarnings();
    }, []); // Run once on component mount

  // Update handleChange to track percentages
  const handleChange = (field: string) => (event: any) => {
    const newFormData = {
      ...formData,
      [field]: event.target.value
    };
    setFormData(newFormData);

    // Update selected percentages based on the field
    if (field === 'riskLevel') {
      setSelectedPercentages(prev => {
        const newPercentages = {
          ...prev,
          risk: riskPercentages[event.target.value as RiskLevel]
        };
        calculateEstimatedEarnings(newPercentages);
        return newPercentages;
      });
    } else if (field === 'tradingStrategy') {
      setSelectedPercentages(prev => {
        const newPercentages = {
          ...prev,
          strategy: strategyPercentages[event.target.value as TradingStrategy]
        };
        calculateEstimatedEarnings(newPercentages);
        return newPercentages;
      });
    } else if (field === 'aiModel') {
      setSelectedPercentages(prev => {
        const newPercentages = {
          ...prev,
          aiModel: aiModelPercentages[event.target.value as AIModel]
        };
        calculateEstimatedEarnings(newPercentages);
        return newPercentages;
      });
    } else if (field === 'maxLeverage') {
      const leverageValue = parseFloat(event.target.value) || 0;
      setSelectedPercentages(prev => {
        const newPercentages = {
          ...prev,
          leverage: leverageValue / 10 // Convert leverage to percentage (10x = 1%)
        };
        calculateEstimatedEarnings(newPercentages);
        return newPercentages;
      });
    } else if (field === 'investmentAmount') {
      // Direkt olarak mevcut yüzdelerle hesaplama yap
      const investment = parseFloat(event.target.value) || 0;
      const totalPercentage = Object.values(selectedPercentages).reduce((sum, percentage) => sum + percentage, 0);
      const earnings = investment * (totalPercentage / 100);
      const totalRepay = investment + earnings;
      
      setEstimatedEarnings({
        amount: earnings,
        percentage: totalPercentage,
        dailyAmount: totalRepay,
        dailyPercentage: totalPercentage
      });
    }
  };

  const handleStepClick = (step: number) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveStep(step);
      setIsTransitioning(false);
    }, 300);
  };

  const validateCurrentStep = (): boolean => {
    const errors: FormErrors = {};
    let isValid = true;

    const scrollToError = (elementId: string) => {
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };

    switch (activeStep) {
      case 0: // Investment
        const investmentAmount = parseFloat(formData.investmentAmount);
        
        // First check if amount is entered
        if (!formData.investmentAmount) {
          errors.investmentAmount = 'Please enter investment amount';
          isValid = false;
          scrollToError('investment-amount-field');
        }
        // Then check balance
        else if (investmentAmount > userBalance) {
          errors.investmentAmount = `Insufficient balance`;
          isValid = false;
          scrollToError('investment-amount-field');
        }
        // Only if balance is sufficient, check minimum amounts
        else {
          if (investmentAmount < 50) {
            errors.investmentAmount = 'Minimum investment amount is $50';
            isValid = false;
            scrollToError('investment-amount-field');
          }
          else if (formData.selectedDuration === '1d' && investmentAmount < 2500) {
            errors.investmentAmount = 'Min investment amount is $2,500';
            isValid = false;
            scrollToError('investment-amount-field');
          }
        }

        if (!formData.riskLevel) {
          errors.riskLevel = 'Please select a risk level';
          isValid = false;
          scrollToError('risk-level-field');
        }
        if (!formData.acknowledgments.investment) {
          errors.acknowledgment = 'Please acknowledge the investment terms';
          isValid = false;
          scrollToError('investment-acknowledgment');
        }
        break;

      case 1: // AI Strategy
        if (!formData.tradingStrategy) {
          errors.tradingStrategy = 'Please select a trading strategy';
          isValid = false;
          scrollToError('trading-strategy-field');
        }
        if (!formData.aiModel) {
          errors.aiModel = 'Please select an AI model';
          isValid = false;
          scrollToError('ai-model-field');
        }
        if (!formData.acknowledgments.strategy) {
          errors.acknowledgment = 'Please acknowledge the strategy terms';
          isValid = false;
          scrollToError('strategy-acknowledgment');
        }
        break;

      case 2: // Rebalancing
        if (!formData.rebalancingFrequency) {
          errors.rebalancingFrequency = 'Please select a rebalancing frequency';
          isValid = false;
          scrollToError('rebalancing-frequency-field');
        }
        if (!formData.acknowledgments.rebalancing) {
          errors.acknowledgment = 'Please acknowledge the rebalancing terms';
          isValid = false;
          scrollToError('rebalancing-acknowledgment');
        }
        break;

      case 3: // Risk Management
        if (!formData.stopLoss || parseFloat(formData.stopLoss) > 1) {
          errors.stopLoss = 'Stop loss must be between 0.1% and 1%';
          isValid = false;
          scrollToError('stop-loss-field');
        } else if (parseFloat(formData.stopLoss) < 0.1) {
          errors.stopLoss = 'Stop loss cannot be less than 0.1%';
          isValid = false;
          scrollToError('stop-loss-field');
        }

        if (!formData.takeProfit || parseFloat(formData.takeProfit) <= 0) {
          errors.takeProfit = 'Take profit must be greater than 0%';
          isValid = false;
          scrollToError('take-profit-field');
        } else if (parseFloat(formData.takeProfit) < parseFloat(formData.stopLoss)) {
          errors.takeProfit = 'Take profit must be greater than stop loss';
          isValid = false;
          scrollToError('take-profit-field');
        }

        if (!formData.maxDrawdown || parseFloat(formData.maxDrawdown) <= 0) {
          errors.maxDrawdown = 'Maximum drawdown must be greater than 0%';
          isValid = false;
          scrollToError('max-drawdown-field');
        } else if (parseFloat(formData.maxDrawdown) > 50) {
          errors.maxDrawdown = 'Maximum drawdown cannot exceed 50%';
          isValid = false;
          scrollToError('max-drawdown-field');
        }

        if (!formData.acknowledgments.riskManagement) {
          errors.acknowledgment = 'Please acknowledge that you understand the risk management parameters';
          isValid = false;
          scrollToError('risk-management-acknowledgment');
        }
        break;

      case 4: // Leverage
        const leverage = parseFloat(formData.maxLeverage);
        if (!leverage || leverage < 10 || leverage > 120) {
          errors.maxLeverage = 'Leverage must be between 10x and 120x';
          isValid = false;
          scrollToError('leverage-field');
        }
        if (!formData.acknowledgments.leverage) {
          errors.acknowledgment = 'Please acknowledge the leverage trading terms';
          isValid = false;
          scrollToError('leverage-acknowledgment');
        }
        break;

      case 5: // Reporting
        if (formData.notificationPreferences.length === 0) {
          errors.notificationPreferences = 'Please select at least one notification channel';
          isValid = false;
          scrollToError('notification-preferences-field');
        }
        if (!formData.acknowledgments.reporting) {
          errors.acknowledgment = 'Please acknowledge the reporting terms';
          isValid = false;
          scrollToError('reporting-acknowledgment');
        }
        break;

      case 6: // Profit Sharing
        if (!formData.acknowledgments.profitSharing) {
          errors.acknowledgment = 'Please acknowledge the profit sharing terms';
          isValid = false;
          scrollToError('profit-sharing-acknowledgment');
        }
        break;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (activeStep < steps.length - 1) {
        handleStepClick(activeStep + 1);
      }
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

  const handleProfitSharingChange = (_event: Event, newValue: number | number[]) => {
    const creatorShare = Math.max(55, newValue as number);
    setFormData({
      ...formData,
      profitSharing: {
        poolCreator: creatorShare,
        investors: 100 - creatorShare
      }
    });
  };

  // Update earnings calculation function to accept percentages parameter
  const calculateEstimatedEarnings = (percentages: SelectedPercentages = selectedPercentages) => {
    const investment = parseFloat(formData.investmentAmount) || 0;
    
    // Calculate total percentage from all selections
    const totalPercentage = Object.values(percentages).reduce((sum, percentage) => sum + percentage, 0);
    
    // Calculate earnings based on total percentage
    const earnings = investment * (totalPercentage / 100);
    
    // Calculate total repay (initial investment + earnings)
    const totalRepay = investment + earnings;
    
    setEstimatedEarnings({
      amount: earnings,
      percentage: totalPercentage,
      dailyAmount: totalRepay,
      dailyPercentage: totalPercentage
    });
  };

  // Update duration button click handler
  const handleDurationClick = (duration: '1d' | '7d' | '14d' | '30d', percentage: number) => {
    setFormData(prev => ({ ...prev, selectedDuration: duration }));
    setSelectedPercentages(prev => {
      const newPercentages = {
        ...prev,
        duration: percentage
      };
      calculateEstimatedEarnings(newPercentages);
      return newPercentages;
    });
  };

  // Update EstimatedEarningsDisplay component
  const EstimatedEarningsDisplay: React.FC = () => {
    return (
      <Box //@ts-ignore
       sx={{ mb: 2 }}>
        <Stack spacing={2}>
          <Box>
            <Typography sx={{ 
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '0.9rem',
              mb: 1
            }}>
              Duration
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              gap: 1,
              '& button': {
                flex: 1,
                padding: '8px',
                borderRadius: '8px',
                border: '1px solid rgba(110, 211, 255, 0.2)',
                backgroundColor: 'rgba(26, 33, 38, 0.6)',
                color: 'rgba(255, 255, 255, 0.7)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  backgroundColor: 'rgba(110, 211, 255, 0.1)',
                },
                '&.selected': {
                  backgroundColor: 'rgba(110, 211, 255, 0.2)',
                  borderColor: '#6ed3ff',
                  color: '#6ed3ff',
                } as any
              }
            }}>
              {Object.entries(durationPercentages).map(([duration, percentage]) => (
                <button
                  key={duration}
                  type="button"
                  className={formData.selectedDuration === duration ? 'selected' : ''}
                  onClick={() => handleDurationClick(duration as '1d' | '7d' | '14d' | '30d', percentage)}
                >
                  <Typography sx={{ fontSize: '0.9rem', fontWeight: 500 }}>
                    {duration}
                  </Typography>
                  <Typography sx={{ fontSize: '0.8rem', opacity: 0.8 }}>
                    {percentage}%
                  </Typography>
                </button>
              ))}
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography sx={{ 
              color: '#6ed3ff',
              fontSize: '0.9rem'
            }}>
              Total Repay:
            </Typography>
            <Box sx={{ textAlign: 'right' }}>
              <Typography sx={{ 
                color: '#22C55E',
                fontSize: '1.1rem',
                fontWeight: 600
              }}>
                ${estimatedEarnings.dailyAmount.toFixed(2)}
              </Typography>
              <Typography sx={{ 
                color: 'rgba(34, 197, 94, 0.7)',
                fontSize: '0.8rem'
              }}>
               +{estimatedEarnings.percentage.toFixed(2)}%
              </Typography>
            </Box>
          </Box>
        </Stack>
      </Box>
    );
  };


  const handleNavigateToDeposit = () => {
    onClose(); // Close the main modal first
    setTimeout(() => {
      setShowDepositDrawer(true); // Open deposit drawer after a small delay
    }, 100);
  };

  const steps = [
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
                      id="investment-amount-field"
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
                        inputProps: { min: 50 }
                      }}
                      label="Initial Investment "
                      error={!!formErrors.investmentAmount}
                      helperText={formErrors.investmentAmount}
                    />
                    
            {/* Update Balance Display */}
            <Box sx={{
              position: 'absolute',
              borderRadius: '12px',
              zIndex: 1
            }}>
              <Box display={'flex'} alignItems="center">
                <Typography variant="body1" sx={{ color: 'white', fontSize: '0.8rem' }}>
                  <span style={{color:"gray", fontSize: '0.8rem'}}>
                    Available: </span> {userBalance !== null ? `${userBalance.toFixed(2)} USDT` : 'Loading...'}
                </Typography>
                <AddCircleOutlineIcon 
                  onClick={handleNavigateToDeposit} 
                  fontSize='small' 
                  sx={{ 
                    ml: 1, 
                    color:'#89d9ff',
                    cursor: 'pointer',
                 
                  }} 
                />
              </Box>
            </Box>
                  </Box>

                  <FormControl id="risk-level-field" fullWidth error={!!formErrors.riskLevel}>
                    <Typography sx={{ 
                      color: formErrors.riskLevel ? '#ff4d4d' : 'rgba(255, 255, 255, 0.7)',
                      fontSize: '0.9rem',
                      mb: 1,
                      ml: 0.5,
                      fontWeight: 500
                    }}>
                      Risk Level
                    </Typography>
                    <StyledSelect
                      value={formData.riskLevel}
                      onChange={handleChange('riskLevel')}
                      MenuProps={{
                        PaperProps: {
                          component: StyledPaper
                        }
                      }}
                      renderValue={(value) => (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {(value as RiskLevel) === 'conservative' && <ShieldCheck size={20} />}
                          {(value as RiskLevel) === 'moderate' && <Activity size={20} />}
                          {(value as RiskLevel) === 'aggressive' && <Rocket size={20} />}
                          {String(value).charAt(0).toUpperCase() + String(value).slice(1)}
                        </Box>
                      )}
                    >
                      <StyledMenuItem value="conservative">
                        <ShieldCheck size={20} />
                        Conservative
                      </StyledMenuItem>
                      <StyledMenuItem value="moderate">
                        <Activity size={20} />
                        Moderate
                      </StyledMenuItem>
                      <StyledMenuItem value="aggressive">
                        <Rocket size={20} />
                        Aggressive
                      </StyledMenuItem>
                    </StyledSelect>
                    {formErrors.riskLevel && (
                      <Typography sx={{ 
                        color: '#ff4d4d',
                        fontSize: '0.75rem',
                        mt: 0.5,
                        ml: 1
                      }}>
                        {formErrors.riskLevel}
                      </Typography>
                    )}
                  </FormControl>

                  <Box id="investment-acknowledgment" sx={{ mt: 2 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.acknowledgments.investment}
                          onChange={(e) => setFormData({
                            ...formData,
                            acknowledgments: {
                              ...formData.acknowledgments,
                              investment: e.target.checked
                            }
                          })}
                          sx={{
                            color: 'rgba(110, 211, 255, 0.5)',
                            '&.Mui-checked': {
                              color: '#6ed3ff',
                            },
                          }}
                        />
                      }
                      label={
                        <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>
                          I understand the investment terms and associated risks
                        </Typography>
                      }
                    />
                    {formErrors.acknowledgment && (
                      <Typography sx={{ color: '#ff4d4d', fontSize: '0.75rem', mt: 1, ml: 1 }}>
                        {formErrors.acknowledgment}
                      </Typography>
                    )}
                  </Box>
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
                    <Typography sx={{ 
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '0.9rem',
                      mb: 1,
                      ml: 0.5,
                      fontWeight: 500
                    }}>
                      Trading Strategy
                    </Typography>
                    <StyledSelect
                      value={formData.tradingStrategy}
                      onChange={handleChange('tradingStrategy')}
                      MenuProps={{
                        PaperProps: {
                          component: StyledPaper
                        }
                      }}
                    >
                      <StyledMenuItem value="momentum">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Activity size={20} />
                          <Box>
                            <Typography>Momentum Trading</Typography>
                            <Typography sx={{ fontSize: '0.75rem', color: '#6ed3ff' }}>
                              +40% Extra Returns
                            </Typography>
                          </Box>
                        </Box>
                      </StyledMenuItem>
                      <StyledMenuItem value="balanced">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Network size={20} />
                          <Box>
                            <Typography>Balanced Growth</Typography>
                            <Typography sx={{ fontSize: '0.75rem', color: '#6ed3ff' }}>
                              +20% Extra Returns
                            </Typography>
                          </Box>
                        </Box>
                      </StyledMenuItem>
                      <StyledMenuItem value="value">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <ShieldCheck size={20} />
                          <Box>
                            <Typography>Value Investing</Typography>
                            <Typography sx={{ fontSize: '0.75rem', color: '#6ed3ff' }}>
                              +10% Extra Returns
                            </Typography>
                          </Box>
                        </Box>
                      </StyledMenuItem>
                    </StyledSelect>
                  </FormControl>

                  <FormControl id="trading-strategy-field" fullWidth error={!!formErrors.tradingStrategy}>
                    {/* ... existing trading strategy code ... */}
                  </FormControl>

                  <FormControl fullWidth>
                    <Typography sx={{ 
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '0.9rem',
                      mb: 1,
                      ml: 0.5,
                      fontWeight: 500
                    }}>
                      AI Model Type
                    </Typography>
                    <StyledSelect
                      value={formData.aiModel}
                      onChange={handleChange('aiModel')}
                      MenuProps={{
                        PaperProps: {
                          component: StyledPaper
                        }
                      }}
                      renderValue={(value) => (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {(value as AIModel) === 'conservative' && <Brain size={20} />}
                          {(value as AIModel) === 'balanced' && <Network size={20} />}
                          {(value as AIModel) === 'aggressive' && <Cpu size={20} />}
                          {String(value).split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </Box>
                      )}
                    >
                      <StyledMenuItem value="conservative">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Brain size={20} />
                          <Box>
                            <Typography>Conservative ML</Typography>
                            <Typography sx={{ fontSize: '0.75rem', color: '#6ed3ff' }}>
                              +15% Extra Returns
                            </Typography>
                          </Box>
                        </Box>
                      </StyledMenuItem>
                      <StyledMenuItem value="balanced">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Network size={20} />
                          <Box>
                            <Typography>Balanced Neural Network</Typography>
                            <Typography sx={{ fontSize: '0.75rem', color: '#6ed3ff' }}>
                              +35% Extra Returns
                            </Typography>
                          </Box>
                        </Box>
                      </StyledMenuItem>
                      <StyledMenuItem value="aggressive">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Cpu size={20} />
                          <Box>
                            <Typography>Aggressive Deep Learning</Typography>
                            <Typography sx={{ fontSize: '0.75rem', color: '#6ed3ff' }}>
                              +60% Extra Returns
                            </Typography>
                          </Box>
                        </Box>
                      </StyledMenuItem>
                    </StyledSelect>
                  </FormControl>

                  <FormControl id="ai-model-field" fullWidth error={!!formErrors.aiModel}>
                    {/* ... existing AI model code ... */}
                  </FormControl>

                  <Box id="strategy-acknowledgment" sx={{ mt: 2 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.acknowledgments.strategy}
                          onChange={(e) => setFormData({
                            ...formData,
                            acknowledgments: {
                              ...formData.acknowledgments,
                              strategy: e.target.checked
                            }
                          })}
                          sx={{
                            color: 'rgba(110, 211, 255, 0.5)',
                            '&.Mui-checked': {
                              color: '#6ed3ff',
                            },
                          }}
                        />
                      }
                      label={
                        <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>
                          I understand that AI strategies may vary in performance and risk levels
                        </Typography>
                      }
                    />
                    {formErrors.acknowledgment && (
                      <Typography sx={{ color: '#ff4d4d', fontSize: '0.75rem', mt: 1, ml: 1 }}>
                        {formErrors.acknowledgment}
                      </Typography>
                    )}
                  </Box>
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
                    <Typography sx={{ 
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '0.9rem',
                      mb: 1,
                      ml: 0.5,
                      fontWeight: 500
                    }}>
                      Rebalancing Frequency
                    </Typography>
                    <StyledSelect
                      value={formData.rebalancingFrequency}
                      onChange={handleChange('rebalancingFrequency')}
                      MenuProps={{
                        PaperProps: {
                          component: StyledPaper
                        }
                      }}
                    >
                      <StyledMenuItem value="hourly">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Clock1 size={20} />
                          <Box>
                            <Typography>Hourly Rebalancing</Typography>
                            <Typography sx={{ fontSize: '0.75rem', color: '#6ed3ff' }}>
                              +45% Extra Returns
                            </Typography>
                          </Box>
                        </Box>
                      </StyledMenuItem>
                      <StyledMenuItem value="daily">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Calendar size={20} />
                          <Box>
                            <Typography>Daily Rebalancing</Typography>
                            <Typography sx={{ fontSize: '0.75rem', color: '#6ed3ff' }}>
                              +30% Extra Returns
                            </Typography>
                          </Box>
                        </Box>
                      </StyledMenuItem>
                      <StyledMenuItem value="weekly">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CalendarDays size={20} />
                          <Box>
                            <Typography>Weekly Rebalancing</Typography>
                            <Typography sx={{ fontSize: '0.75rem', color: '#6ed3ff' }}>
                              +20% Extra Returns
                            </Typography>
                          </Box>
                        </Box>
                      </StyledMenuItem>
                      <StyledMenuItem value="monthly">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CalendarRange size={20} />
                          <Box>
                            <Typography>Monthly Rebalancing</Typography>
                            <Typography sx={{ fontSize: '0.75rem', color: '#6ed3ff' }}>
                              +10% Extra Returns
                            </Typography>
                          </Box>
                        </Box>
                      </StyledMenuItem>
                    </StyledSelect>
                  </FormControl>

                  <FormControl id="rebalancing-frequency-field" fullWidth error={!!formErrors.rebalancingFrequency}>
                    {/* ... existing rebalancing frequency code ... */}
                  </FormControl>

                  <Box id="rebalancing-acknowledgment" sx={{ mt: 2 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.acknowledgments.rebalancing}
                          onChange={(e) => setFormData({
                            ...formData,
                            acknowledgments: {
                              ...formData.acknowledgments,
                              rebalancing: e.target.checked
                            }
                          })}
                          sx={{
                            color: 'rgba(110, 211, 255, 0.5)',
                            '&.Mui-checked': {
                              color: '#6ed3ff',
                            },
                          }}
                        />
                      }
                      label={
                        <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>
                          I understand that rebalancing frequency affects returns and may incur additional fees
                        </Typography>
                      }
                    />
                    {formErrors.acknowledgment && (
                      <Typography sx={{ color: '#ff4d4d', fontSize: '0.75rem', mt: 1, ml: 1 }}>
                        {formErrors.acknowledgment}
                      </Typography>
                    )}
                  </Box>
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
                    error={!!formErrors.stopLoss}
                    helperText={formErrors.stopLoss}
                    InputProps={{
                      inputProps: { 
                        min: 0.1,
                        max: 1,
                        step: 0.1
                      }
                    }}
                  />

                  <StyledTextField
                    fullWidth
                    type="number"
                    label="Take Profit (%)"
                    value={formData.takeProfit}
                    onChange={handleChange('takeProfit')}
                    error={!!formErrors.takeProfit}
                    helperText={formErrors.takeProfit}
                    InputProps={{
                      inputProps: { 
                        min: 0.1,
                        step: 0.1
                      }
                    }}
                  />

                  <StyledTextField
                    fullWidth
                    type="number"
                    label="Maximum Drawdown (%)"
                    value={formData.maxDrawdown}
                    onChange={handleChange('maxDrawdown')}
                    error={!!formErrors.maxDrawdown}
                    helperText={formErrors.maxDrawdown}
                    InputProps={{
                      inputProps: { 
                        min: 0.1,
                        max: 50,
                        step: 0.1
                      }
                    }}
                  />

                  <Box sx={{ mt: 2 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.acknowledgments.riskManagement}
                          onChange={(e) => setFormData({
                            ...formData,
                            acknowledgments: {
                              ...formData.acknowledgments,
                              riskManagement: e.target.checked
                            }
                          })}
                          sx={{
                            color: 'rgba(110, 211, 255, 0.5)',
                            '&.Mui-checked': {
                              color: '#6ed3ff',
                            },
                          }}
                        />
                      }
                      label={
                        <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>
                          I acknowledge the risk management parameters and their implications
                        </Typography>
                      }
                    />
                    {formErrors.acknowledgment && (
                      <Typography sx={{ color: '#ff4d4d', fontSize: '0.75rem', mt: 1, ml: 1 }}>
                        {formErrors.acknowledgment}
                      </Typography>
                    )}
                  </Box>
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
                      Configure leverage options (Required: 10x-120x)
                    </Typography>
                  </Box>

                  <StyledTextField
                    fullWidth
                    type="number"
                    label="Leverage (x)"
                    value={formData.maxLeverage}
                    onChange={handleChange('maxLeverage')}
                    error={!!formErrors.maxLeverage}
                    helperText={formErrors.maxLeverage}
                    InputProps={{
                      inputProps: { min: 10, max: 120 }
                    }}
                  />

                  <Box sx={{ mt: 2 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.acknowledgments.leverage}
                          onChange={(e) => setFormData({
                            ...formData,
                            acknowledgments: {
                              ...formData.acknowledgments,
                              leverage: e.target.checked
                            }
                          })}
                          sx={{
                            color: 'rgba(110, 211, 255, 0.5)',
                            '&.Mui-checked': {
                              color: '#6ed3ff',
                            },
                          }}
                        />
                      }
                      label={
                        <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>
                          I understand the risks associated with leveraged trading
                        </Typography>
                      }
                    />
                    {formErrors.acknowledgment && (
                      <Typography sx={{ color: '#ff4d4d', fontSize: '0.75rem', mt: 1, ml: 1 }}>
                        {formErrors.acknowledgment}
                      </Typography>
                    )}
                  </Box>
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

                  <StyledFormControlLabel
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
                    <Typography sx={{ 
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '0.9rem',
                      mb: 1,
                      ml: 0.5,
                      fontWeight: 500
                    }}>
                      Notification Preferences
                    </Typography>
                    <StyledSelect
                      multiple
                      value={formData.notificationPreferences}
                      onChange={handleChange('notificationPreferences')}
                      MenuProps={{
                        PaperProps: {
                          component: StyledPaper
                        }
                      }}
                      renderValue={(value) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {(value as NotificationChannel[]).map((channel) => (
                            <StyledChip
                              key={channel}
                              label={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  {channel === 'email' && <Mail size={16} />}
                                  {channel === 'push' && <Bell size={16} />}
                                  {channel === 'telegram' && <Send size={16} />}
                                  {channel === 'discord' && <MessageCircle size={16} />}
                                  {channel}
                                </Box>
                              }
                              onDelete={() => handleChange('notificationPreferences')(channel)}
                            />
                          ))}
                        </Box>
                      )}
                    >
                      <StyledMenuItem value="email">
                        <Mail size={20} />
                        Email
                      </StyledMenuItem>
                      <StyledMenuItem value="push">
                        <Bell size={20} />
                        Push Notifications
                      </StyledMenuItem>
                      <StyledMenuItem value="telegram">
                        <Send size={20} />
                        Telegram
                      </StyledMenuItem>
                      <StyledMenuItem value="discord">
                        <MessageCircle size={20} />
                        Discord
                      </StyledMenuItem>
                    </StyledSelect>
                  </FormControl>

                  <FormControl id="notification-preferences-field" fullWidth error={!!formErrors.notificationPreferences}>
                    {/* ... existing notification preferences code ... */}
                  </FormControl>

                  <Box sx={{ mt: 2 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.acknowledgments.reporting}
                          onChange={(e) => setFormData({
                            ...formData,
                            acknowledgments: {
                              ...formData.acknowledgments,
                              reporting: e.target.checked
                            }
                          })}
                          sx={{
                            color: 'rgba(110, 211, 255, 0.5)',
                            '&.Mui-checked': {
                              color: '#6ed3ff',
                            },
                          }}
                        />
                      }
                      label={
                        <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>
                          I agree to receive notifications and reports as per my selected preferences
                        </Typography>
                      }
                    />
                    {formErrors.acknowledgment && (
                      <Typography sx={{ color: '#ff4d4d', fontSize: '0.75rem', mt: 1, ml: 1 }}>
                        {formErrors.acknowledgment}
                      </Typography>
                    )}
                  </Box>
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
                      Pool Creator Share (Minimum 55%)
                    </Typography>
                    <StyledSlider
                      value={formData.profitSharing.poolCreator}
                      onChange={handleProfitSharingChange}
                      min={55}
                      max={100}
                      step={1}
                      valueLabelDisplay="auto"
                      valueLabelFormat={(value) => `${value}%`}
                      marks={[
                        { value: 55, label: '55%' },
                        { value: 100, label: '100%' }
                      ]}
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
                          color: 'rgba(255, 255, 255, 0.5)',
                          fontSize: '0.75rem',
                        }
                      }}
                    />
                    <Typography sx={{ color: '#fff', textAlign: 'center', mt: 1 }}>
                      {formData.profitSharing.poolCreator}%
                    </Typography>
                  </Box>

                  <Box>
                    <Typography sx={{ color: 'grey.400', mb: 1 }}>
                      Investors Share
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#fff', textAlign: 'center' }}>
                      {formData.profitSharing.investors}%
                    </Typography>
                  </Box>

                  <Box sx={{ mt: 2 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.acknowledgments.profitSharing}
                          onChange={(e) => setFormData({
                            ...formData,
                            acknowledgments: {
                              ...formData.acknowledgments,
                              profitSharing: e.target.checked
                            }
                          })}
                          sx={{
                            color: 'rgba(110, 211, 255, 0.5)',
                            '&.Mui-checked': {
                              color: '#6ed3ff',
                            },
                          }}
                        />
                      }
                      label={
                        <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>
                          I understand and agree to the profit sharing arrangement
                        </Typography>
                      }
                    />
                    {formErrors.acknowledgment && (
                      <Typography sx={{ color: '#ff4d4d', fontSize: '0.75rem', mt: 1, ml: 1 }}>
                        {formErrors.acknowledgment}
                      </Typography>
                    )}
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
                    {Object.entries(formData).map(([key, value]) => {
                      // Skip rendering acknowledgments in review
                      if (key === 'acknowledgments') return null;
                      
                      return (
                        <Box key={key}>
                          <Typography sx={{ color: 'grey.400', fontSize: '0.9rem' }}>
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </Typography>
                          <Typography sx={{ color: '#fff' }}>
                            {typeof value === 'object' ? JSON.stringify(value) : value.toString()}
                          </Typography>
                          <Divider sx={{ mt: 1 }} />
                        </Box>
                      );
                    })}
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
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(4px)'
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
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
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
              background: 'linear-gradient(180deg, rgba(26, 33, 38, 0.99) 0%, rgba(26, 33, 38, 0.95) 100%)',
              backdropFilter: 'blur(10px)',
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
                  fontSize: '1.1rem',
                  fontWeight: 600,
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
                width: '8px',
              },
              '&::-webkit-scrollbar-track': {
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: 'rgba(110, 211, 255, 0.1)',
                borderRadius: '4px',
                '&:hover': {
                  background: 'rgba(110, 211, 255, 0.2)',
                }
              }
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
            <Box sx={{ 
              p: 3,
              borderTop: '1px solid rgba(255, 255, 255, 0.05)',
              background: 'linear-gradient(180deg, rgba(26, 33, 38, 0.95) 0%, rgba(26, 33, 38, 0.99) 100%)',
              backdropFilter: 'blur(10px)',
            }}>
              {(formData.investmentAmount && parseFloat(formData.investmentAmount) > 0) && 
                <EstimatedEarningsDisplay />
              }
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

      <StyledDepositDrawer
        open={showDepositDrawer}
        onClose={() => setShowDepositDrawer(false)}
      />
    </>
  );
};

export default CreatePoolModal; 
