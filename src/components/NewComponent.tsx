import React, { useState, useCallback } from 'react';
import { Card, CardContent, Typography, Grid,  Slider, Box, Button, Drawer, Select, MenuItem, FormControl, InputLabel, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { AccessTime, MonetizationOn } from '@mui/icons-material';
import SpeedIcon from '@mui/icons-material/Speed';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface NewComponentProps {}

const stakingOptions = [
   { 
    period: '7 Days', 
    apy: 28.20, 
    durations: [7],
    leverageOptions: [150],
    tonRange: { min: 25, max: 125 }
  },
  { 
    period: '14 Days', 
    apy: 26.44, 
    durations: [14],
    leverageOptions: [175],
    tonRange: { min: 25, max: 125 }
  },
  { 
    period: '21 Days', 
    apy: 16, 
    durations: [21],
    leverageOptions: [200],
    tonRange: { min: 25, max: 125 }
  },
  { 
    period: '30 Days', 
    apy: 28, 
    durations: [30],
    leverageOptions: [25],
    tonRange: { min: 10, max: 250 }
  },
  { 
    period: '60 Days', 
    apy: 17.4, 
    durations: [60],
    leverageOptions: [50],
    tonRange: { min: 1, max: 250 }
  },
  { 
    period: '90 Days', 
    apy: 13.87, 
    durations: [90],
    leverageOptions: [75],
    tonRange: { min: 1, max: 250 }
  },
  { 
    period: '121 Days', 
    apy: 15, 
    durations: [121],
    leverageOptions: [5],
    tonRange: { min: 1, max: 250 }
  },
  { 
    period: '152 Days', 
    apy: 12, 
    durations: [152],
    leverageOptions: [10],
    tonRange: { min: 1, max: 250 }
  },
  { 
    period: '365 Days', 
    apy: 10, 
    durations: [365],
    leverageOptions: [15],
    tonRange: { min: 1, max: 250 }
  },
 
];

// Yeni StakingCard bileşeni
interface StakingCardProps {
  option: { period: string; apy: number; durations: number[]; leverageOptions: number[]; tonRange: { min: number; max: number } };
  index: number;
  stakingData: {
    amount: number;
    duration: number;
    leverage: number;
  }[];
  handleAmountChange: (index: number, newAmount: number) => void;
  handleDurationChange: (index: number, newDuration: number) => void;
  handleLeverageChange: (index: number, newLeverage: number) => void;
  calculateEarnings: (amount: number, duration: number, leverage: number, apy: number) => string;
  children?: React.ReactNode;
}

const StakingCard: React.FC<StakingCardProps> = React.memo(({
  option,
  index,
  stakingData,
  handleAmountChange,
  calculateEarnings,
  children
}) => {
  const tonRange = option.tonRange;

  return (
    <Grid item xs={12} sm={6} md={4} key={index}>
      <Card 
        sx={{ 
          minWidth: 275, 
          textAlign: 'center', 
          padding: 1, 
          boxShadow: 6,
          borderRadius: 2,
          transition: 'transform 0.3s, box-shadow 0.3s',
       
          backgroundColor: index % 2 === 0 ? '#f0f4ff' : '#e3f2fd',
        }}
      >
        <CardContent>
         
        
          {/* Miktar Seçici */}
          <Box sx={{  }}>
            <Box justifyContent={'space-between'} display={'flex'}>
                   <Typography textAlign={'left'} variant="body2" color="text.secondary" sx={{ fontSize: '1rem' }}>
            You stake 
            </Typography>
          
            </Box>
          
                        <Box justifyContent={'space-between'} display={'flex'}>

              <Typography textAlign={'left'} variant="h4" component="div" sx={{ mb: 2, fontWeight: 'bold', color: '#1976d2', fontSize: '1.8rem' }}>
              {stakingData[index].amount} <span style={{color:'grey'}}>TON </span> 
            </Typography>
                <Typography textAlign={'left'} variant="body2" color="text.secondary" sx={{mt:1.5, fontSize: '0.9rem' }}>
                {option.apy}% APY
            </Typography>
                        </Box>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                {tonRange.min} 
              </Typography>
              <Slider
                value={stakingData[index].amount}
                onChange={(_e, newValue) => handleAmountChange(index, newValue as number)}
                aria-labelledby="amount-slider"
                valueLabelDisplay="off" // Disable default label display
                step={1}
                marks
                min={tonRange.min}
                max={tonRange.max}
                sx={{ color: '#1976d2' }}
              />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                {tonRange.max} 
              </Typography>
            </Box>
          </Box>

          {/* Leverage Seçici */}
         <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.9rem' }}>
              Duration: {stakingData[index].duration} {stakingData[index].duration > 30 ? 'Days' : 'Day'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.9rem' }}>
              Leverage: {stakingData[index].leverage}x
            </Typography>
          </Box>

          {/* Tahmini Kazanç */}
          <Box sx={{ mt: 3 , mb:-2 }}>
            <Typography textAlign={'left'} variant="h6" sx={{ fontWeight: 'bold', fontSize: '1.3rem' }}>
              You could earn 
            </Typography>
            <Typography textAlign={'left'} variant="h6" sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}> 
                <span style={{color: '#1976d2',}}>
 {(parseFloat(calculateEarnings(
                stakingData[index].amount,
                stakingData[index].duration,
                stakingData[index].leverage,
                option.apy
              ))).toFixed(2)} TON 
                </span>
                <span style={{marginLeft:'15px ',fontSize:'1rem'}}>in</span>
                <span style={{fontSize:'1.5rem'}}> {stakingData[index].duration} Days</span>
              
            </Typography>



          </Box>

          {/* Buton yerleştirme */}
          {children}
        </CardContent>
      </Card>
    </Grid>
  );
});

// Add this new component for the card with icons
const InfoCard: React.FC = () => {
  return (
    
    <Box sx={{ mt: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 2, backgroundColor: '#f9f9f9' }}>
        
      <Grid container spacing={2}>
        <Grid item xs={4} display="flex" flexDirection="column" alignItems="center">
          <AccessTime sx={{ fontSize: 40, color: '#1976d2' }} />
          <Typography textAlign={'center'} variant="body2" fontSize={'0.8rem'}>Withdraw at any time</Typography>
        </Grid>
        <Grid item xs={4} display="flex" flexDirection="column" alignItems="center">
          <SpeedIcon sx={{ fontSize: 40, color: '#1976d2' }} />
          <Typography textAlign={'center'} variant="body2" fontSize={'0.8rem'}>Rewards every 18h</Typography>
        </Grid>
        <Grid item xs={4} display="flex" flexDirection="column" alignItems="center">
          <MonetizationOn sx={{ fontSize: 40, color: '#1976d2' }} />
          <Typography textAlign={'center'} variant="body2" fontSize={'0.8rem'}>Min stake of 1 TON</Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

// Add this new component for the statistics card
const StatsCard: React.FC = () => {
  return (
    <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 2, backgroundColor: '#f9f9f9', mb: 2 }}>
      <Grid container spacing={2} justifyContent="space-between" alignItems="center">
        <Grid item xs={4} textAlign="center">
          <Typography variant="subtitle2" color={'#0072ff'}  fontWeight="bold">#3</Typography>
          <Typography variant="subtitle2" fontSize={'0.8rem'}>Staking on TON</Typography>
        </Grid>
        <Grid item xs={4} textAlign="center">
          <Typography variant="subtitle2" fontWeight="bold" color={'#0072ff'}>$182.21M</Typography>
          <Typography variant="subtitle2">TVL</Typography>
        </Grid>
        <Grid item xs={4} textAlign="center">
          <Typography variant="subtitle2" fontWeight="bold" color={'#0072ff'}>19652</Typography>
          <Typography variant="subtitle2">Stakers now</Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

const NewComponent: React.FC<NewComponentProps> = () => {
  // Staking verilerini tutan state
  const [stakingData, setStakingData] = useState(
    stakingOptions.map(option => ({
      amount: option.tonRange.max, // Varsayılan olarak maksimum miktar
      duration: Math.max(...option.durations), // Her kart için maksimum süre
      leverage: Math.max(...option.leverageOptions), // Her kart için maksimum leverage
    }))
  );

  // Yeni state: Seçilen staking kartı
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0); // Varsayılan olarak ilk kartı seç

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

  // Event handler fonksiyonlarını useCallback ile memoize et
  const handleAmountChange = useCallback((index: number, newAmount: number) => {
    setStakingData(prevData => {
      const updatedData = [...prevData];
      updatedData[index].amount = newAmount;
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

  const handleLeverageChange = useCallback((_index: number, _newLeverage: number) => {
    // This function is no longer needed
  }, []);

  const calculateEarnings = useCallback((amount: number, duration: number, leverage: number, apy: number) => {
    // Basit faiz formülü: E = P * (apy / 100) * (duration / 365) * leverage
    return ((amount * (apy / 100) * (duration / 365)) * leverage).toFixed(2);
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

   const leveragedItems = [
    {
      question: "About Our Staking System",
      answer: "Our staking system allows users to earn rewards by locking their TON coins for a specified duration. You can choose from various staking periods, ranging from 7 days to 365 days, each offering different Annual Percentage Yields (APY)"
    },
    {
      question: "**Leverage**",
      answer: "By using leverage, you can increase your staking amount beyond what you own. For instance, if you have 100 TON and choose to leverage 2x, you can stake 200 TON. This amplifies your potential rewards but also increases your risk"
    },
  
    {
      question: "**Duration**",
      answer: "The duration you select for staking affects your rewards. Longer durations typically offer higher APYs, but they also lock your funds for a longer period. Make sure to choose a duration that aligns with your investment strategy"
    },
 
 
  ];

  return (
    <Box  style={{ marginBottom: '76px', backgroundColor: '#f0f4ff', borderRadius: '8px', padding: '20px' }}>
      {/* Add StatsCard here */}

      <Typography 
        variant="h4" 
        component="h4" 
        align="center" 
        sx={{ mb: 1, fontWeight: 'bold', color: '#0072ff', textTransform: 'uppercase', fontSize: '1.2rem' }}
      >
        Leveraged Staking
      </Typography>
      
      <Typography 
        variant="body1" 
        align="center" 
        sx={{ mb: 1, color: 'black', fontSize: '0.8rem', fontWeight:'bold' }}
      >
        Explore various staking options with different durations and leverage levels. 
      </Typography>
    
    

      <StatsCard />

     
        <FormControl  fullWidth sx={{borderRadius:3, mb: 1, mt:2 }}>
        <InputLabel id="staking-select-label">Staking Option</InputLabel>
        <Select
          labelId="staking-select-label"
          label="Staking Option"
          
          value={selectedOptionIndex}
          onChange={(e) => setSelectedOptionIndex(e.target.value as number)}
        >
          {stakingOptions.map((option, index) => (
            <MenuItem key={index} value={index}>
              {option.period}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Sadece Seçilen Kartı Göster */}
      <StakingCard
        key={selectedOptionIndex}
        option={stakingOptions[selectedOptionIndex]}
        index={selectedOptionIndex}
        stakingData={stakingData}
        handleAmountChange={handleAmountChange}
        handleDurationChange={handleDurationChange}
        handleLeverageChange={handleLeverageChange}
        calculateEarnings={calculateEarnings}
      >
        {/* Buton eklendi */}
       
      </StakingCard>
       <Box sx={{     
 }}>
          <Button  variant="contained" color="primary" sx={{          borderRadius: 2,
width:'100%', mt: 1,  fontSize: '1rem' }} onClick={() => handleOpenDrawer(selectedOptionIndex)}>
            Stake Now 
          </Button>
            <Typography 
        variant="body1" 
        align="center" 
        sx={{ mt: 1, color: 'grey', fontSize: '0.8rem' }}
      >
      By using the app, you confirm compliance 
      </Typography>
       <Typography 
        variant="body1" 
        align="center" 
        sx={{ mb: 1, color: 'grey', fontSize: '0.8rem' }}
      >
      with our Terms of Service.
      </Typography>
       {leveragedItems.map((item, index) => (
        <Accordion key={index}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">{item.question}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>{item.answer}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
        </Box>


        

 <Typography 
        variant="h3" 
        component="h3" 
        align="left" 
        sx={{ mb: 1,mt:4,textAlign:'left', fontWeight: 'bold', textTransform: 'uppercase' , fontSize:'1.1rem'}}
      >
        Overview
      </Typography>


      <InfoCard />

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
        <Accordion key={index}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
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
        sx={{ backgroundColor: '#ffffff' }}
      >
        <Box sx={{ p: 4 }}>
          {selectedStaking && (
            <>
              <Typography variant="h5" gutterBottom sx={{ color: '#1976d2', fontSize: '1.5rem' }}>
                {selectedStaking.option.period} Details
              </Typography>
              <Typography>Miktar: {selectedStaking.data.amount} TON</Typography>
              <Typography>Süre: {selectedStaking.data.duration} {selectedStaking.data.duration > 30 ? 'Days' : 'Days'}</Typography>
              <Typography>Leverage: {selectedStaking.data.leverage}x</Typography>
              <Typography>
                You could earn { ( parseFloat(calculateEarnings(
                  selectedStaking.data.amount,
                  selectedStaking.data.duration,
                  selectedStaking.data.leverage,
                  selectedStaking.option.apy
                ))).toFixed(2) } TON in {selectedStaking.data.duration} Days
              </Typography>
            </>
          )}
        </Box>
      </Drawer>
    </Box>
  );
};

export default NewComponent; 