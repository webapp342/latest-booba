import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, Typography, Grid,  Slider, Box, Button, Drawer, Accordion, AccordionSummary, AccordionDetails, TextField, Modal, LinearProgress, InputAdornment, Divider, ToggleButton, ToggleButtonGroup, Chip } from '@mui/material';
import { AccessTime, MonetizationOn } from '@mui/icons-material';
import SpeedIcon from '@mui/icons-material/Speed';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { doc,  getFirestore, setDoc, updateDoc, increment, arrayUnion, onSnapshot } from 'firebase/firestore'; // Import Firestore functions
import { app } from '../pages/firebaseConfig'; // Import your Firebase app
import { v4 as uuidv4 } from 'uuid'; // Import UUID for generating unique IDs
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import tonLogo from '../assets/toncoin-ton-logo.png'; // Logo dosyasını import et
import SwitchAccessShortcutAddIcon from '@mui/icons-material/SwitchAccessShortcutAdd';
import PaidIcon from '@mui/icons-material/Paid';
import DonutSmallSharpIcon from '@mui/icons-material/DonutSmallSharp';
import OutboundIcon from '@mui/icons-material/Outbound';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
interface NewComponentProps {}

const db = getFirestore(app); // Define the Firestore database instance

const stakingOptions = [
   
  { 
    period: '7 D', 
    apy: 13.44, 
    durations: [7],
    leverageOptions: [100],
    tonRange: { min: 25, max: 1000 }
  },
  { 
    period: '14 D', 
    apy: 31.42, 
    durations: [14],
    leverageOptions: [125],
    tonRange: { min: 5, max: 500 }
  },

  { 
    period: '30 D', 
    apy: 32.26, 
    durations: [30],
    leverageOptions: [175],
    tonRange: { min: 1, max: 500 }
  },
 
  { 
    period: '90 D', 
    apy: 32.72, 
    durations: [90],
    leverageOptions: [200],
    tonRange: { min: 1, max: 500 }
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
  children
}) => {
  const tonRange = option.tonRange;

  return (
    <Grid item xs={12} sm={6} md={4} key={index}>
      <Card 
        sx={{ 
          minWidth: 275, 
          textAlign: 'center', 
          padding: 0.5, 
          borderRadius: 2,
       
          backgroundColor:  '#3f3f3f',
        }}
      >
        <CardContent>
         
        
          {/* Miktar Seçici */}
          <Box sx={{  }}>
            <Box justifyContent={'space-between'} display={'flex'}>
              
                          <Box  mt={1} display={'flex'} alignItems={'center'}>
                            <OutboundIcon  sx={{color:"#90EE90",marginRight:'5px', width: '26px', height: '26px'  }}/>

              <Typography textAlign={'left'} variant="h4" component="div" sx={{  fontWeight: 'bold', color: 'white', fontSize: '1rem' }}>
             You stake
            </Typography>
  </Box>
          
            </Box>
          
                        <Box justifyContent={'space-between'} display={'flex'}>
                            <Box mb={2} mt={1} display={'flex'} alignItems={'center'}>

              <Typography textAlign={'left'} variant="h4" component="div" sx={{  fontWeight: 'bold', color: 'white', fontSize: '2rem' }}>
              {stakingData[index].amount} <span style={{color:'grey'}}> TON</span> 
            </Typography>
  </Box>
            <Box   mt={1} mb={2}>
              <Chip  
              icon={<SwitchAccessShortcutAddIcon sx={{color:'#b4e6ff ' }} />}
                label={`${option.apy}% APY`} 
                variant="outlined" 
                color='primary'
                sx={{color:"#b4e6ff ", fontSize: '0.9rem' }}
              />
            </Box>
     
              
               
                        </Box>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box>
                <Typography variant="body2" color="#B0BEC5" sx={{ mr: 2 }}>
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
                sx={{ color: '#00c6ff' }}
              />
            
              <Typography variant="body2" color="#B0BEC5" sx={{ ml: 2 }}>
                Max
              </Typography>
            </Box>
          </Box>


        
          {/* Leverage Seçici */}
         <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="#B0BEC5" sx={{  }}>
          Duration:   <span style={{color:'#FFFFFF', fontWeight:'bold',fontSize: '1rem'}}>  {stakingData[index].duration} {stakingData[index].duration > 30 ? 'Days' : 'Day'}</span> 
            </Typography>
            <Typography variant="body2" color="#B0BEC5" sx={{  }}>
              Leverage:  <span style={{color:'#FFFFFF', fontWeight:'bold',fontSize: '1rem'}}> {stakingData[index].leverage}x</span>
            </Typography>
          </Box>
         <Box sx={{ mt: 2,mb:-2,  textAlign:'left' }}>
              <Typography variant="body2" color="#B0BEC5" sx={{  }}>
              Multiplied Power :  <span style={{color:'#00c6ff', fontWeight:'bolder', fontSize:'1rem'}}>{stakingData[index].amount * stakingData[index].leverage} TON </span> 
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
    
    <Box sx={{ mt: 2, p: 2, border: '1px solid #575757', borderRadius: 2, backgroundColor: '#282828' }}>
        
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

// Add this function to calculate the total staked amount
const calculateTotalStakedAmount = (history: any[]): number => {
    return history.reduce((total, stake) => total + stake.amount, 0);
};

const NewComponent: React.FC<NewComponentProps> = () => {
  const navigate = useNavigate(); // Initialize useNavigate

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
  const [isUnstaking, setIsUnstaking] = useState(false); // New state for unstaking mode

  // New state to manage the selected action
  const [selectedAction, setSelectedAction] = useState<'stake' | 'unstake'>('stake');

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
    return ((amount * (apy / 100) * (duration / 365)) * leverage).toFixed(8);
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



  const handleUnstakeAction = (index: number) => {
    const stakeToUnstake = stakingHistory[index];
    // Implement your unstaking logic here, e.g., calling a function to update the database
    console.log(`Unstaking ${stakeToUnstake.amount} TON from stake index ${index}`);
    // You might want to show a confirmation modal or perform the unstaking operation here
  };

  const handleEarlyUnstakeAction = (index: number) => {
    const stakeToUnstake = stakingHistory[index];
    // Implement your early unstaking logic here, e.g., calling a function to update the database
    console.log(`Early unstaking ${stakeToUnstake.amount} TON from stake index ${index}`);
    // You might want to show a confirmation modal or perform the early unstaking operation here
  };

  // Function to handle button selection
  const handleActionChange = (_event: React.MouseEvent<HTMLElement> | null, newAction: 'stake' | 'unstake') => {
    if (newAction !== null) {
      setSelectedAction(newAction);
      setIsUnstaking(newAction === 'unstake'); // Update unstaking mode based on selection
    }
  };

  return (
    <Box style={{ marginBottom: '76px', backgroundColor: '#1E1E1E',  padding: 8 }}>
      <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} mb={2} mt={2}>
<Typography
  sx={{
    background: "linear-gradient(90deg, #1976d2, #00c6ff)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontFamily: "'Press Start 2P', sans-serif", // Pikselleştirilmiş retro font
    fontWeight: 700,

    fontSize: "20px",
    letterSpacing: "1px"
  }}
>
  Booba
</Typography>


      <Typography fontWeight={'bold'} color={'white'}>
       Leveraged staking for TON


      </Typography>

      </Box>
      
      {/* Button Group for Stake and Unstake */}
      <Box display={'flex'} justifyContent="space-between" mb={2}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={(e) => handleActionChange(e, 'stake')} 
          sx={{ 
            width: '48%', 
            backgroundColor: selectedAction === 'stake' ? '#b4e6ff' : '#e0e0e0', // Gray for unselected
            color: selectedAction === 'stake' ? 'black' : 'black', // Change text color based on selection
            boxShadow: selectedAction === 'stake' ? '0px 4px 10px rgba(0, 198, 255, 0.5)' : 'none' // Add shadow for selected
          }}
        >
          <AddCircleIcon sx={{ mr: 1 }} />
          Stake
        </Button>
        <Button 
          variant="contained" 
          color="secondary" 
          onClick={(e) => handleActionChange(e, 'unstake')} 
          sx={{ 
            width: '48%', 
            backgroundColor: selectedAction === 'unstake' ? '#b4e6ff' : '#e0e0e0', // Gray for unselected
            color: selectedAction === 'unstake' ? 'black' : 'black', // Change text color based on selection
            boxShadow: selectedAction === 'unstake' ? '0px 4px 10px rgba(0, 198, 255, 0.5)' : 'none' // Add shadow for selected
          }}
        >
          <RemoveCircleIcon sx={{ mr: 1 }} />
          Unstake
        </Button>
      </Box>

      {/* Conditionally render cards based on unstaking mode */}
      {isUnstaking ? (
        <Grid container spacing={2}>
          {[...Array(1)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ minWidth: 275, textAlign: 'center', padding: 1, boxShadow: 6, borderRadius: 2, backgroundColor: '#e3f2fd' }}>
                <CardContent>

                  <Box sx={{display:'flex', justifyContent:'space-between' }}>
                        <Typography mb={1} variant="body1" sx={{fontWeight: 'bold', color: '#1976d2' }}>
                    Ton Balance  
                    </Typography>
                   <Typography variant="body1" sx={{fontWeight: 'bold', color: '#1976d2' }}>
                   {totalBalance !== null ? `${totalBalance.toFixed(2)} TON` : 'Loading...'}
                    </Typography>
               
                  </Box>
               
                
                  
                  <Divider sx={{  }} />
                  <Box mt={1} sx={{display:'flex', justifyContent:'space-between' }}>
                       <Typography variant="body1" sx={{  }}>
                    Staking in progress 
                  </Typography>
                     <Typography variant="body1" sx={{ }}>
                 {calculateTotalStakedAmount(stakingHistory).toFixed(2)} TON
                  </Typography>

                  </Box>
                  <Box mb={-2} sx={{display:'flex', justifyContent:'space-between' }}>
                      <Typography variant="body2" sx={{  fontWeight: 'bold' }}>
                   lbTON Balance
                  </Typography>
                    <Typography variant="body2" sx={{  fontWeight: 'bold' }}>
                {lbBalance !== null ? `${lbBalance.toFixed(2)} lbTON` : 'Loading...'}
                  </Typography>
                    
                  </Box>
               
                   
                  
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <>
          
            
            <Grid item xs={12} sm={6}>
              <StakingCard
                key={selectedOptionIndex}
                option={stakingOptions[selectedOptionIndex]}
                index={selectedOptionIndex}
                stakingData={stakingData}
                handleAmountChange={handleAmountChange}
                handleDurationChange={handleDurationChange}
                handleLeverageChange={handleLeverageChange}
                calculateEarnings={calculateEarnings}
              />
            </Grid>
         

          {/* Earnings Display Outside of StakingCard */}
          <Box sx={{   
              minWidth: 275, 
              textAlign: 'center', 
              padding: 0.5, 
              boxShadow: 6,
              borderRadius: 2,
              transition: 'transform 0.3s, box-shadow 0.3s',
              backgroundColor:  '#282828',
              mt: 2, 
              p: 2,   
              display: 'flex', 
              flexDirection: 'column', 
            }}>
              <Box sx={{display:'flex', justifyContent:'space-between'}}>
                                            <Box  mt={1} display={'flex'} alignItems={'center'}>
                            <PaidIcon  sx={{color:"#90EE90",marginRight:'5px', width: '26px', height: '26px'  }}/>

              <Typography textAlign={'left'} variant="h4" component="div" sx={{  fontWeight: 'bold', color: 'white', fontSize: '1rem' }}>
             You earn
            </Typography>
  </Box>
                <ToggleButtonGroup
                color="primary"
                value={selectedOptionIndex}
                exclusive
                onChange={(_e, newValue) => setSelectedOptionIndex(newValue as number)}
                sx={{ minWidth: '20%' }}
              >
                {stakingOptions.map((option, index) => (
                    <ToggleButton key={index} value={index} sx={{border:"1px solid #575757",p:1, color: 'whitesmoke', bgcolor: '#3f3f3f', borderRadius: 2, fontWeight: 'bolder' , fontSize:'0.8rem'}}>
                        {option.period}
                    </ToggleButton>
                ))}
              </ToggleButtonGroup>
              </Box>
          
            <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} sx={{ width: '100%', mt: 1 }}>
              <Box display={'flex'} alignItems={'center'}>

  <Typography textAlign={'left'} variant="h6" sx={{ fontWeight: 'bold', fontSize: '2rem' }}> 
   <span style={{color: '#90EE90',}}>
              +    {(parseFloat(calculateEarnings(
                    stakingData[selectedOptionIndex].amount, 
                    stakingData[selectedOptionIndex].duration,
                    stakingData[selectedOptionIndex].leverage,
                    stakingOptions[selectedOptionIndex].apy
                  ))).toFixed(6)} 
                </span>
                <span style={{marginLeft:'7px ',fontSize:'1.2rem', color:"#90EE90"}}>TON</span>
              </Typography>
              </Box>
            

          
            </Box>

 <Typography textAlign={'left'} variant="h6" sx={{color:'secondary', fontWeight:'bold',fontSize: '1.2rem', mt:2 }}>
              Total of   <DonutSmallSharpIcon/>
            </Typography>
                              <Divider sx={{  }} />


            <Box display={'flex'} justifyContent={'space-between'} sx={{ width: '100%' }}>
              
              <Box>
                <Typography textAlign={'left'} variant="h6" sx={{color:'grey', fontWeight: 'bold', fontSize: '1rem' }}> 
                 <span style={{fontSize:'1rem'}}>Staking reward</span>                </Typography>

                                  <Typography textAlign={'left'} variant="h6" sx={{ fontWeight: 'bold', fontSize: '1rem' }}> 

                   <span style={{color: 'white',}}>
                    {((parseFloat(calculateEarnings(
                      stakingData[selectedOptionIndex].amount,
                      stakingData[selectedOptionIndex].duration,
                      stakingData[selectedOptionIndex].leverage,
                      stakingOptions[selectedOptionIndex].apy
                    )) * 0.16).toFixed(2))} 
                  </span> 
                   <span style={{color: 'grey',marginLeft:'5px'}}>
                   TON   </span>
                </Typography>
              </Box>

              <Box>
                <Typography textAlign={'left'} variant="h6" sx={{color:'grey', fontWeight: 'bold', fontSize: '1rem' }}> 
                  <span style={{fontSize:'1rem'}}>DeFi extra yield</span>                </Typography>

                                  <Typography textAlign={'left'} variant="h6" sx={{ fontWeight: 'bold', fontSize: '1rem' }}> 

                

                  
               +   <span style={{color: 'white',}}>
                    {((parseFloat(calculateEarnings(
                      stakingData[selectedOptionIndex].amount,
                      stakingData[selectedOptionIndex].duration,
                      stakingData[selectedOptionIndex].leverage,
                      stakingOptions[selectedOptionIndex].apy
                    )) * 0.84).toFixed(2))}  
                  </span>
                                     <span style={{color: 'grey',marginLeft:'5px'}}>
 TON                   </span>

                </Typography>
              </Box>
            </Box>
          </Box>

          
        </>
      )}

      {/* Conditionally render the Unstake Card only when in unstaking mode */}
      {isUnstaking && (
       <Box sx={{ mt: 2 }}>
        
         
            {stakingHistory.length > 0 ? (
              stakingHistory.map((stake, index) => {
                const currentTime = new Date().getTime();
                const stakeTime = new Date(stake.timestamp).getTime();
                const durationInMillis = stake.duration * 24 * 60 * 60 * 1000; // Convert duration to milliseconds
                const totalPotentialEarnings = (stake.amount * (stake.apy / 100) * (stake.duration / 365)); // Total potential earnings
                const elapsedTime = Math.min(currentTime - stakeTime, durationInMillis); // Time elapsed since stake
                const elapsedDays = elapsedTime / (1000 * 60 * 60 * 24); // Convert to days
                const accruedEarnings = (stake.amount * (stake.apy / 100) * (elapsedDays / 365)); // Earnings accrued so far

                // Calculate progress
                const progress = (accruedEarnings / totalPotentialEarnings) * 100;

                // Check if the duration has passed
                const isDurationPassed = currentTime >= (stakeTime + durationInMillis);

                // Calculate the activation time for the Unstake button
                const activationTime = new Date(stakeTime + durationInMillis);

                return (
                  <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1, backgroundColor: '#fff' }}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      Amount: <span style={{ color: '#1976d2' }}>{stake.amount} TON</span>
                    </Typography>
                    <Typography variant="body1">
                      Duration: <span style={{ fontWeight: 'bold' }}>{stake.duration} Days</span>
                    </Typography>
                    <Typography variant="body1">
                      Leverage: <span style={{ fontWeight: 'bold' }}>{stake.leverage}x</span>
                    </Typography>
                    <Typography variant="body1">
                      APY: <span style={{ fontWeight: 'bold' }}>{stake.apy}%</span>
                    </Typography>
                    <Typography variant="body1">
                      Earnings: <span style={{ color: '#1976d2', fontWeight: 'bold' }}>{stake.earnings} TON</span>
                    </Typography>
                    <Typography variant="body1">
                      Timestamp: <span style={{ fontStyle: 'italic' }}>{new Date(stake.timestamp).toLocaleString()}</span>
                    </Typography>
                    <Typography variant="body1">
                      Countdown: <span style={{ fontWeight: 'bold' }}>{calculateRemainingTime(stake.timestamp, stake.duration).days} days, {calculateRemainingTime(stake.timestamp, stake.duration).hours} hours, {calculateRemainingTime(stake.timestamp, stake.duration).minutes} minutes remaining</span>
                    </Typography>
                    <Typography variant="body1">
                      Days Remaining: <span style={{ fontWeight: 'bold' }}>{calculateRemainingDays(stake.timestamp, stake.duration)} days</span>
                    </Typography>
                    <Typography variant="body1">
                      Remaining Minutes: <span style={{ fontWeight: 'bold' }}>{calculateRemainingMinutes(stake.timestamp, stake.duration)} minutes</span>
                    </Typography>
                    <Typography variant="body1">
                      Accrued Earnings: <span style={{ fontWeight: 'bold' }}>{accruedEarnings.toFixed(12)} TON</span>
                    </Typography>
                    <LinearProgress variant="determinate" value={Math.min(100, progress)} sx={{ mt: 2 }} />
                    
                    {/* Early Unstake Button */}
                    {!isDurationPassed && (
                      <Button 
                        fullWidth
                        variant="outlined" 
                        color="warning" 
                        onClick={() => handleEarlyUnstakeAction(index)} // Implement this function to handle early unstaking
                        sx={{ mt: 2 }}
                      >
                        Early Unstake
                      </Button>
                    )}

                    {/* Unstake Button */}
                    <Button 
                      fullWidth
                      variant="contained" 
                      color="secondary" 
                      onClick={() => handleUnstakeAction(index)} // Implement this function to handle unstaking
                      sx={{ mt: 1 }}
                      disabled={!isDurationPassed} // Disable if duration has not passed
                    >
                      Unstake
                    </Button>

                    {/* Display activation time */}
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      This will be active on: <strong>{activationTime.toLocaleString()}</strong>
                    </Typography>
                  </Box>
                );
              })
            ) : (
              <Typography variant="body2" color="text.secondary">
                No staking history available.
              </Typography>
            )}
        </Box>
      )}

      {/* Unstake Button under all cards */}
    

      <Box sx={{     
      }}>
      {/* Conditionally render the Stake Now button based on unstaking mode */}
      {!isUnstaking && (
        <Button variant="contained"  sx={{backgroundColor:'#b4e6ff', borderRadius: 2, width: '100%', mt: 1, fontSize: '1rem',color:"black" }} onClick={() => handleOpenDrawer(selectedOptionIndex)}>
          Stake Now 
        </Button>
      )}
        <Typography 
          variant="body1" 
          align="center" 
          sx={{ mt: 1, color: 'grey', fontSize: '0.8rem' }}
        >
          By using the app, you confirm compliance 
        </Typography>
        <Typography 
          variant="body1" 
          align="center" 
          sx={{ mb: 1, color: 'grey', fontSize: '0.8rem' }}
        >
          with our Terms of Service.
        </Typography>
        {leveragedItems.map((item, index) => (
        <Accordion sx={{backgroundColor:'#282828',color:'whitesmoke', border:"1px solid #575757"}} key={index}>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{color:"#575757"}} />}>
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
        <Accordion sx={{backgroundColor:'#282828',color:'whitesmoke', border:"1px solid #575757"}} key={index}>
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

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ width: '100%' }}>
                    <TextField
                      label=""
          variant="outlined"                      value={selectedStaking.data.amount || '0'}
                      onChange={(e) => {
                        const newAmount = parseFloat(e.target.value);
                        handleAmountChange(selectedOptionIndex, newAmount);
                      }}
                      sx={{ mt: 2, width: '100%', fontSize:'2rem' // Alt köşeleri yuvarlak, üst köşeleri düz
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

              {/* Yeni kutu ekleniyor */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                mt: -2, 
                p: 1, 
                border: '1px solid #1976d2', 
                borderTop: 0, 
                borderRadius: '0 0 4px 4px', // Alt köşeleri yuvarlak, üst köşeleri düz
                backgroundColor: '#1E1E1E' 
              }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                  You will receive:
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                  {parseFloat(String(selectedStaking.data.amount * selectedStaking.data.leverage || '0')).toFixed(2)} lbTON
                </Typography>
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
    </Box>
  );
};

export default NewComponent; 