import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, Typography, Grid,  Slider, Box, Button, Drawer, Select, MenuItem, FormControl, InputLabel, Accordion, AccordionSummary, AccordionDetails, TextField, Modal, LinearProgress } from '@mui/material';
import { AccessTime, MonetizationOn } from '@mui/icons-material';
import SpeedIcon from '@mui/icons-material/Speed';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { doc,  getFirestore, setDoc, updateDoc, increment, arrayUnion, onSnapshot } from 'firebase/firestore'; // Import Firestore functions
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

// Add this function to calculate remaining days
const calculateRemainingDays = (timestamp: string, duration: number): number => {
    const stakeDate = new Date(timestamp);
    const endDate = new Date(stakeDate.getTime() + duration * 24 * 60 * 60 * 1000); // Add duration in milliseconds
    const currentDate = new Date();
    const remainingTime = endDate.getTime() - currentDate.getTime();
    return Math.max(0, Math.ceil(remainingTime / (1000 * 60 * 60 * 24))); // Return remaining days
};

// Add this function to calculate remaining time
const calculateRemainingTime = (timestamp: string, duration: number) => {
    const stakeDate = new Date(timestamp);
    const endDate = new Date(stakeDate.getTime() + duration * 24 * 60 * 60 * 1000); // Add duration in milliseconds
    const currentDate = new Date();
    const remainingTime = endDate.getTime() - currentDate.getTime();

    if (remainingTime <= 0) {
        return { days: 0, hours: 0, minutes: 0 };
    }

    const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));

    return { days, hours, minutes };
};

// Add this function to calculate remaining minutes
const calculateRemainingMinutes = (timestamp: string, duration: number): number => {
    const stakeDate = new Date(timestamp);
    const endDate = new Date(stakeDate.getTime() + duration * 24 * 60 * 60 * 1000); // Add duration in milliseconds
    const currentDate = new Date();
    const remainingTime = endDate.getTime() - currentDate.getTime();
    
    return Math.max(0, Math.floor(remainingTime / (1000 * 60))); // Return remaining minutes
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
        setlbBalance(data.lbTON / 1000); // Divide the total by 1000 before setting
        setStakingHistory(data.stakingHistory || []); // Set staking history
      } else {
        console.error("No such document!");
      }
    });

    // Cleanup function to unsubscribe from the listener
    return () => unsubscribe();
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
                    lbTON: stakingAmount * 1000, // New field for lbTON
                    earnings: earnings, // Kazancı ekle
                    timestamp: new Date().toISOString(), // Store as ISO string
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
                        timestamp: new Date().toISOString() // Store as ISO string
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
        sx={{ backgroundColor: '#ffffff', transition: 'transform 0.3s ease-in-out' }} // Smooth transition
      >
        <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
      

          {selectedStaking && (
            <>
              {/* Total Balance Card */}
              <Card sx={{ p: 2, boxShadow: 1, borderRadius: 2 }}>
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
              <Card sx={{  p: 2, boxShadow: 1, borderRadius: 2 }}>
             
                <Grid container spacing={1}>
                
                  <Grid item xs={6}>
                    <Typography>Duration: <span style={{fontWeight: 'bold'}}> {selectedStaking.data.duration} {selectedStaking.data.duration > 30 ? 'Days' : 'Day'}</span> </Typography>
                   
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>Leverage: <span style={{fontWeight: 'bold'}}>{selectedStaking.data.leverage}x</span> </Typography>
                  </Grid>
                </Grid>
              </Card>


              
              {/* Input Field Card */}
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                                Adjust Staking Amount</Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent:'space-between', }}>
                  <Box sx={{width:'75%'}}>
  <TextField
                    label="Amount"
                    variant="outlined"
                    value={selectedStaking.data.amount || '0'}
                    onChange={(e) => {
                      const newAmount = parseFloat(e.target.value);
                      handleAmountChange(selectedOptionIndex, newAmount);
                    }}
                    sx={{ mt: 2,width:'100%' }}
                    error={!!errorMessage}
                    helperText={errorMessage || `Min: ${stakingOptions[selectedOptionIndex].tonRange.min}`}
                  />
                  </Box>
                <Box>
  <Button
                    variant="outlined"
                    color="primary"
                    sx={{ ml: 1, fontSize:'0.8rem' , p:1.9 , mb:1 }}
                    onClick={() => {
                      if (totalBalance !== null) {
                        handleAmountChange(selectedOptionIndex, totalBalance);
                      }
                    }}
                  >
                    Use Max
                  </Button>
                </Box>
                
                </Box>

              {/* Earnings Breakdown Section */}
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                  Estimated Earnings
                </Typography>
                <Box display={'flex'} justifyContent={'space-between'} gap={1}>
                    <Box sx={{ width:'49%', p: 2, border: '1px solid #1976d2', borderRadius: 2, backgroundColor: '#e3f2fd'}}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                    Projected Earnings:
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                    {parseFloat(calculateEarnings(
                      selectedStaking.data.amount,
                      selectedStaking.data.duration,
                      selectedStaking.data.leverage,
                      selectedStaking.option.apy
                    )).toFixed(2)} TON
                  </Typography>
                </Box>
                <Box sx={{width:'49%', p: 2, border: '1px solid #1976d2', borderRadius: 2 }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    Total to Repay:
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                    {(
                      parseFloat(calculateEarnings(
                        selectedStaking.data.amount,
                        selectedStaking.data.duration,
                        selectedStaking.data.leverage,
                        selectedStaking.option.apy
                      )) + selectedStaking.data.amount
                    ).toFixed(2)} TON
                  </Typography>
                </Box>
                </Box>
              
              


              {/* Start Staking Button */}
              <Box sx={{gap:1, display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Button
                  variant="outlined"
                  color="secondary"
                  sx={{ width: '25%', borderRadius: 2 }}
                  onClick={handleCloseDrawer} // Close the drawer on click
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ width: '75%', borderRadius: 2 }}
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
                  <Typography variant="body2" color="grey" align="center" sx={{ mb: 1 }}>
                    You do not have enough balance
                  </Typography>
                    <Typography variant="body2" color="error" align="center" sx={{ mb: 1 }}>
                   Please deposit more funds to start
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

      {/* Unstake Card */}
      <Card sx={{ mt: 4, p: 2, boxShadow: 1, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', mb: 2 }}>
            Unstake
          </Typography>
          {stakingHistory.length > 0 ? (
            stakingHistory.map((stake, index) => (
              <Box key={index} sx={{ mb: 1, p: 1, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                <Typography variant="body1">
                  Amount: {stake.amount} TON
                </Typography>
                <Typography variant="body1">
                  Duration: {stake.duration} Days
                </Typography>
                <Typography variant="body1">
                  Leverage: {stake.leverage}x
                </Typography>
                <Typography variant="body1">
                  APY: {stake.apy}%
                </Typography>
                <Typography variant="body1">
                  Earnings: {stake.earnings} TON
                </Typography>
                <Typography variant="body1">
                  Timestamp: {new Date(stake.timestamp).toLocaleString()}
                </Typography>
                <Typography variant="body1">
                  Countdown: {calculateRemainingTime(stake.timestamp, stake.duration).days} days, {calculateRemainingTime(stake.timestamp, stake.duration).hours} hours, {calculateRemainingTime(stake.timestamp, stake.duration).minutes} minutes remaining
                </Typography>
                <Typography variant="body1">
                  Days Remaining: {calculateRemainingDays(stake.timestamp, stake.duration)} days
                </Typography>
                <Typography variant="body1">
                  Remaining Minutes: {calculateRemainingMinutes(stake.timestamp, stake.duration)} minutes
                </Typography>
                <Typography variant="body1">
                  Earnings Increase Per Minute: {calculateRemainingMinutes(stake.timestamp, stake.duration) > 0 ? (stake.earnings / calculateRemainingMinutes(stake.timestamp, stake.duration)).toFixed(2) : 0} TON
                </Typography>
              </Box>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              No staking history available.
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default NewComponent; 