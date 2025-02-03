import React, { useState } from 'react';
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
          <Box sx={{ 
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
                onClick={activeStep === steps.length - 1 ? onClose : handleNext}
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
  );
};

export default CreatePoolModal; 