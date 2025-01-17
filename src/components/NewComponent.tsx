import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, Typography, Grid,  Slider, Box, Button, Drawer, Select, MenuItem, FormControl, InputLabel, Accordion, AccordionSummary, AccordionDetails, TextField } from '@mui/material';
import { AccessTime, MonetizationOn } from '@mui/icons-material';
import SpeedIcon from '@mui/icons-material/Speed';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { doc, getDoc, getFirestore, setDoc, updateDoc, increment, arrayUnion } from 'firebase/firestore'; // Import Firestore functions
import { app } from '../pages/firebaseConfig'; // Import your Firebase app
import { v4 as uuidv4 } from 'uuid'; // Import UUID for generating unique IDs

interface NewComponentProps {}

const db = getFirestore(app); // Define the Firestore database instance

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
             
              
                 <Box>
                
 <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                Min
              </Typography>
                </Box>
             
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
               Max
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

  // Add a new state to hold the total balance
  const [totalBalance, setTotalBalance] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // New state for error message

  // Fetch total balance from Firestore when the component mounts
  useEffect(() => {
    const fetchTotalBalance = async () => {
        const telegramUserId = localStorage.getItem("telegramUserId");
        if (!telegramUserId) {
            console.error("Telegram User ID not found!");
            return;
        }

        const userDocRef = doc(db, 'users', telegramUserId); // Adjust the path as necessary
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            const data = userDoc.data();
            setTotalBalance(data.total / 1000); // Divide the total by 1000 before setting
        } else {
            console.error("No such document!");
        }
    };

    fetchTotalBalance();
  }, []);

  // Event handler fonksiyonlarını useCallback ile memoize et
  const handleAmountChange = useCallback((index: number, newAmount: number) => {
    setStakingData(prevData => {
      const updatedData = [...prevData];
      updatedData[index].amount = newAmount;

      // Check min and max values for amount
      const tonRange = stakingOptions[index].tonRange;
      if (newAmount < tonRange.min || newAmount > tonRange.max) {
        setErrorMessage(`Amount must be between ${tonRange.min} and ${tonRange.max}.`); // Set error message
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

  const handleStartStaking = async () => {
    if (selectedStaking) {
        const stakingAmount = selectedStaking.data.amount;
        const telegramUserId = localStorage.getItem("telegramUserId");

        if (telegramUserId) {
            const uniqueId = uuidv4(); // Generate a unique ID for the staking transaction
            const earnings = parseFloat(calculateEarnings( // Kazancı hesapla
                stakingAmount,
                selectedStaking.data.duration,
                selectedStaking.data.leverage,
                selectedStaking.option.apy
            )).toFixed(2); // Kazancı iki ondalık basamağa yuvarla

            try {
                // Create a new document for the staking process
                const stakingDocRef = doc(db, 'staking', uniqueId); // Use unique ID for the document
                await setDoc(stakingDocRef, {
                    userId: telegramUserId, // Store the user ID
                    amount: stakingAmount,
                    duration: selectedStaking.data.duration,
                    leverage: selectedStaking.data.leverage,
                    apy: stakingOptions[selectedOptionIndex].apy,
                    lbTON: stakingAmount * 1000, // New field for lbTON
                    earnings: earnings, // Kazancı ekle
                    timestamp: new Date(), // Add a timestamp for the transaction
                });

                // Update the user's total balance and lbTON
                const userDocRef = doc(db, 'users', telegramUserId);
                await updateDoc(userDocRef, {
                    total: increment(-stakingAmount * 1000), // Deduct the amount multiplied by 1000 from total balance
                    lbTON: increment(stakingAmount * 1000), // Add to lbTON balance
                    stakingHistory: arrayUnion({ // Add the staking details to the user's staking history
                        id: uniqueId,
                        amount: stakingAmount,
                        duration: selectedStaking.data.duration,
                        leverage: selectedStaking.data.leverage,
                        apy: stakingOptions[selectedOptionIndex].apy,
                        lbTON: stakingAmount * 1000,
                        earnings: earnings, // Kazancı ekle
                        timestamp: new Date() // Include the timestamp
                    })
                });

                console.log("Staking process saved successfully.");
            } catch (error) {
                console.error("Error saving staking process:", error);
            }
        } else {
            console.error("Telegram User ID not found!");
        }
    }
  };

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
        sx={{ 
            backgroundColor: '#ffffff', 
            transition: 'transform 0.3s ease-in-out', // Smooth opening animation
            padding: 2,
        }}
      >
        <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2', textAlign: 'center' }}>
                Staking Summary
            </Typography>
            
            {selectedStaking && (
                <>
                    <Box sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 2, backgroundColor: '#f9f9f9' }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Total Balance:</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#1976d2', fontSize: '1.2rem' }}>
                            {totalBalance !== null ? `${totalBalance} TON` : 'Loading...'}
                        </Typography>
                    </Box>
                    
                    <Typography variant="h6" gutterBottom sx={{ color: '#1976d2', fontSize: '1.5rem', fontWeight: 'bold', textAlign: 'center' }}>
                        {selectedStaking.option.period} Details
                    </Typography>
                    
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid item xs={6}>
                            <Typography variant="body1">Amount: <strong>{selectedStaking.data.amount || stakingOptions[selectedOptionIndex].tonRange.min} TON</strong></Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1">Duration: <strong>{selectedStaking.data.duration} {selectedStaking.data.duration > 1 ? 'Days' : 'Day'}</strong></Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1">Leverage: <strong>{selectedStaking.data.leverage}x</strong></Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1">
                                You could earn <strong>{(parseFloat(calculateEarnings(
                                    selectedStaking.data.amount,
                                    selectedStaking.data.duration,
                                    selectedStaking.data.leverage,
                                    selectedStaking.option.apy
                                ))).toFixed(2)} TON</strong> in <strong>{selectedStaking.data.duration} Days</strong>
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1">
                                Total to repay: <strong>{(
                                    parseFloat(calculateEarnings(
                                        selectedStaking.data.amount,
                                        selectedStaking.data.duration,
                                        selectedStaking.data.leverage,
                                        selectedStaking.option.apy
                                    )) + selectedStaking.data.amount
                                ).toFixed(2)} TON</strong>
                            </Typography>
                        </Grid>
                    </Grid>

                    {/* Input field for amount */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                        <TextField
                            label="Amount"
                            variant="outlined"
                            value={selectedStaking.data.amount || stakingOptions[selectedOptionIndex].tonRange.min} // Set default value to min if empty
                            onChange={(e) => {
                                const newAmount = parseFloat(e.target.value);
                                handleAmountChange(selectedOptionIndex, newAmount); // Update amount in state
                            }}
                            sx={{ flexGrow: 1 }} // Make the input field grow to fill space
                            error={!!errorMessage} // Show error state if there's an error
                            helperText={errorMessage || `Min: ${stakingOptions[selectedOptionIndex].tonRange.min}`} // Display the error message or min value
                        />
                        <Button
                            variant="outlined"
                            color="primary"
                            sx={{ ml: 1 }} // Add some margin to the left
                            onClick={() => {
                                if (totalBalance !== null) {
                                    handleAmountChange(selectedOptionIndex, totalBalance); // Set input to total balance
                                }
                            }}
                        >
                            Use Max
                        </Button>
                    </Box>
                </>
            )}
            
            <Button
                variant="contained"
                color="primary"
                fullWidth // Make the button full width
                sx={{ mt: 2 }} // Add some margin to the top
                onClick={handleStartStaking} // Call the new function
                disabled={
                    selectedStaking === null || // Disable if no staking is selected
                    selectedStaking.data.amount < stakingOptions[selectedOptionIndex].tonRange.min || // Check if amount is less than min
                    selectedStaking.data.amount > stakingOptions[selectedOptionIndex].tonRange.max || // Check if amount is greater than max
                    (totalBalance !== null && selectedStaking.data.amount > totalBalance) // Disable if total balance is less than amount
                }
            >
                Confirm & Complete
            </Button>

            {/* Add Deposit Button and Message */}
            {totalBalance !== null && selectedStaking && selectedStaking.data.amount > totalBalance && (
                <Box sx={{ mt: 1 }}>
                    <Typography variant="body2" color="error" align="center" sx={{ mb: 1 }}>
                        You do not have enough balance to stake this amount. Please deposit more funds.
                    </Typography>
                    <Button
                        variant="outlined"
                        color="secondary"
                        fullWidth
                        onClick={() => {
                            // Handle deposit logic here
                            console.log("Redirecting to deposit page...");
                        }}
                    >
                        Deposit
                    </Button>
                </Box>
            )}
        </Box>
      </Drawer>
    </Box>
  );
};

export default NewComponent; 