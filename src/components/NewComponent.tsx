import React, { useState, useCallback, useEffect } from 'react';
import { Card,IconButton, CardContent, Typography,MenuItem, Grid,  Slider, Box, Button, Drawer, Accordion, AccordionSummary, AccordionDetails, TextField, Modal, LinearProgress, InputAdornment, Divider, ToggleButton, ToggleButtonGroup,  CircularProgress, CircularProgressProps, Menu } from '@mui/material';
import { AccessTime,  MonetizationOn } from '@mui/icons-material';
import SpeedIcon from '@mui/icons-material/Speed';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { doc,  getFirestore, setDoc, updateDoc, increment, arrayUnion, onSnapshot, getDoc } from 'firebase/firestore'; // Import Firestore functions
import { app } from '../pages/firebaseConfig'; // Import your Firebase app
import { v4 as uuidv4 } from 'uuid'; // Import UUID for generating unique IDs
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import tonLogo from '../assets/toncoin-ton-logo.png'; // Logo dosyasını import et
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { styled } from '@mui/material/styles';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SlotCounter from 'react-slot-counter'; // Kütüphaneyi içe aktar
import RecommendIcon from '@mui/icons-material/Recommend';
import WebApp from '@twa-dev/sdk';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SpaIcon from '@mui/icons-material/Spa'; 
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import "./text.css";
import Brand from './AiYield';



interface NewComponentProps {}


// Function to calculate APY based on the amount staked
const calculateAPY = (amount: number, period: string): number => {
    if (period === '1 D') {
        if (amount < 125) {
            return 7.89; // 12% APY for amounts less than 50
        } else if (amount < 500) {
            return 11.10; // 16% APY for amounts between 50 and 100
        } else {
            return 23.89; // 20% APY for amounts between 100 and 250
        } 
    } else if (period === '14 D') {
        if (amount < 50) {
            return 8.89; // 15% APY for amounts less than 100
        } else if (amount < 250) {
            return 14.02; // 20% APY for amounts between 100 and 300
        }
        else {
            return 22.12; // 20% APY for amounts between 100 and 250
        } 
    } else if (period === '30 D') {
        if (amount < 50) {
            return 8.99; // 18% APY for amounts less than 100
        } else if (amount < 250) {
            return 10.12; // 22% APY for amounts between 100 and 200
        }else {
            return 17.90; // 20% APY for amounts between 100 and 250
        } 
    } else if (period === '90 D') {
        if (amount < 50) {
            return 9.99; // 10% APY for amounts less than 25
        } else if (amount < 250) {
            return 10.19; // 15% APY for amounts between 25 and 100
        } else {
            return 13.12; // 20% APY for amounts between 100 and 250
        }
    }
    return 0; // Default return if no conditions are met
};

// Function to calculate leverage based on the amount staked and the period
const calculateLeverage = (amount: number, period: string): number => {
    if (period === '1 D') {
        if (amount < 50) {
            return 255; // 1. kademe
        } else if (amount < 150) {
            return 150; // 2. kademe
        } else  {
            return 175; // 3. kademe
        }
       
    } else if (period === '14 D') {
        if (amount < 50) {
            return 125; // 1. kademe
        } else if (amount < 250) {
            return 125; // 2. kademe
        }
       else {
            return 125; // 4. kademe
        }
    } else if (period === '30 D') {
        if (amount < 50) {
            return 125; // 1. kademe
        } else if (amount < 250) {
            return 150; // 2. kademe
        }
        else {
            return 200; // 4. kademe
        }
    } else if (period === '90 D') {
        if (amount < 50) {
            return 175; // 1. kademe
        } else if (amount < 250) {
            return 125; // 2. kademe
        }
        else {
            return 200; // 4. kademe
        }
    }
    return 0; // Default return if no conditions are met
};

// Update staking options to use the calculateAPY function
const stakingOptions = [
    { 
        period: '1 D', 
        apy: calculateAPY(25, '1 D'), // Example amount of 25
        durations: [1],
        leverageOptions: [320],
        tonRange: { min: 50, max: 1500 }
    },
    { 
        period: '14 D', 
        apy: calculateAPY(100, '14 D'), // Example amount of 100
        durations: [14],
        leverageOptions: [125],
        tonRange: { min: 5, max: 1500 }
    },
    { 
        period: '30 D', 
        apy: calculateAPY(200, '30 D'), // Example amount of 200
        durations: [30],
        leverageOptions: [175],
        tonRange: { min: 1, max: 1500 }
    },
    { 
        period: '90 D', 
        apy: calculateAPY(300, '90 D'), // Example amount of 300
        durations: [90],
        leverageOptions: [180],
        tonRange: { min: 1, max: 1500 }
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
    totalBalance: number | null; 
}

// Create a custom styled slider
const CustomSlider = styled(Slider)(({  }) => ({
  color: '#00c6ff', // Change the color to match the design
  height:6,
  '& .MuiSlider-track': {
    border: 'none',
    borderRadius: 4, // Rounded corners for the track
    backgroundColor: '#00c6ff', // Track color
  },
  '& .MuiSlider-thumb': {
    height: 18,
    width: 18,
    border: 'none', // Remove the border
    backgroundColor: '#b0bec5', // Make the background transparent
    // Use the arrows_14999158.png as a background image
    backgroundImage: 'url(../assets/arrows_14999158.png)', // Path to your icon
    backgroundSize: 'cover', // Ensure the icon covers the thumb area
    cursor: 'pointer', // Change cursor to pointer
  },
  '& .MuiSlider-rail': {
    height: 6,
    borderRadius: 4, // Rounded corners for the rail
    backgroundColor: '#b0bec5', // Rail color
  },
}));


const StakingCard: React.FC<StakingCardProps> = React.memo(({
  option, 
  index,
  stakingData,
  handleAmountChange,
  children
}) => {
  const tonRange = option.tonRange;

  // State for animated leverage
  const [displayedLeverage, setDisplayedLeverage] = useState(calculateLeverage(stakingData[index].amount, option.period));
  
  // New state for animation

  useEffect(() => {
    // Animate the leverage value change
    const targetLeverage = calculateLeverage(stakingData[index].amount, option.period);
    let start = displayedLeverage;
    const end = targetLeverage;
    const duration = 500; // Duration of the animation in milliseconds
    const stepTime = 50; // Time between each step in milliseconds
    const steps = Math.ceil(duration / stepTime);
    const increment = (end - start) / steps;

    const interval = setInterval(() => {
      start += increment;
      if ((increment > 0 && start >= end) || (increment < 0 && start <= end)) {
        start = end; // Ensure we don't overshoot
        clearInterval(interval);
      }
      setDisplayedLeverage(Math.round(start)); // Update the displayed leverage
    }, stepTime);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [stakingData[index].amount, option.period]); // Re-run effect when amount or period changes

  // Effect to trigger fade-in animation when amount changes

  return (
    <Grid item xs={12} sm={6} md={4} key={index}>
      <Card 
        sx={{ 
          
          textAlign: 'center', 
          
          borderRadius: 2,
          backgroundColor:  '#2f363a',
        }}
      >
        <CardContent>
         
        
          {/* Miktar Seçici */}
          <Box sx={{  }}>
            <Box justifyContent={'space-between'} display={'flex'}>
              
                          <Box   display={'flex'} alignItems={'center'}>

              <Typography textAlign={'left'}  sx={{  mt:-1, color: 'gray', fontSize: '1.2rem' }}>
            Amount
            </Typography>
            
  </Box>
          
            </Box>
           
                        <Box justifyContent={'space-between'} display={'flex'}>
                            <Box  display={'flex'} alignItems={'center'}>

              <Typography textAlign={'left'} variant="h4" component="div" sx={{  fontWeight: 'bold', color: 'white', fontSize: '2rem', transition: 'opacity 0.5s' }}>
              {stakingData[index].amount} <span className='text-gradient'> TON</span> 
            </Typography>
  </Box>
            <Box   >
                            <img src={tonLogo} alt="TON Logo" style={{ width: '32px', height: '32px' }} />
      
            </Box>
            

          
         
              
               
                        </Box>

            <Box sx={{ display: 'flex', alignItems: 'center' , mt:-1, mb:-4}}>
             
              <CustomSlider
              
                value={stakingData[index].amount}
                onChange={(_e, newValue) => handleAmountChange(index, newValue as number)}
                aria-labelledby="amount-slider"
                valueLabelDisplay="off" // Disable default label display
                step={1}
                min={tonRange.min}
                max={tonRange.max}
              />
              
            
            
            </Box>
            

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
    
    <Box sx={{ mt: 2, p: 2,  borderRadius: 2, backgroundColor: '#2f363a' }}>
        
      <Grid container spacing={2}>
        <Grid item xs={4} display="flex" flexDirection="column" alignItems="center">
          <AccessTime sx={{ fontSize: 40, color: '#89d9ff' }} />
          <Typography textAlign={'center'} variant="body2" fontSize={'0.8rem'}>Withdraw</Typography>
                    <Typography textAlign={'center'} variant="body2" fontSize={'0.8rem'}>at any time</Typography>

        </Grid>
        <Grid item xs={4} display="flex" flexDirection="column" alignItems="center">
          <SpeedIcon sx={{ fontSize: 40, color: '#89d9ff' }} />
          <Typography textAlign={'center'} variant="body2" fontSize={'0.8rem'}>Rewards</Typography>
                    <Typography textAlign={'center'} variant="body2" fontSize={'0.8rem'}>every 18h</Typography>

        </Grid>
        <Grid item xs={4} display="flex" flexDirection="column" alignItems="center">
          <MonetizationOn sx={{ fontSize: 40, color: '#89d9ff' }} />
          <Typography textAlign={'center'} variant="body2" fontSize={'0.8rem'}>Min stake</Typography>
                    <Typography textAlign={'center'} variant="body2" fontSize={'0.8rem'}>of 1 TON</Typography>

          
        </Grid>
      </Grid>
    </Box>
  );
};


const DetailsCard: React.FC = () => { 
  return (
    
    <Box sx={{ mt: 2, p: 2,  borderRadius: 2, backgroundColor: '#2f363a' }}>
        
      <Grid container spacing={2}>
        <Grid item xs={4} display="flex" flexDirection="column" alignItems="center">
                    <Typography color={'#b4e6ff'} fontWeight={'bold'}  textAlign={'center'} variant="body2" fontSize={'1.2rem'}>$275.9M</Typography>
                              <Typography textAlign={'center'} variant="body2" fontSize={'0.8rem'}>TVL</Typography>


        </Grid>
        <Grid item xs={4} display="flex" flexDirection="column" alignItems="center">
                    <Typography color={'#b4e6ff'} fontWeight={'bold'}  textAlign={'center'} variant="body2" fontSize={'1.2rem'}>76822</Typography>
                              <Typography textAlign={'center'} variant="body2" fontSize={'0.8rem'}>Stakers now</Typography>


        </Grid>
        <Grid item xs={4} display="flex" flexDirection="column" alignItems="center">
          <Typography color={'#b4e6ff'} fontWeight={'bold'} textAlign={'center'} variant="body2" fontSize={'1.2rem'}>~ 320x</Typography>
                    <Typography textAlign={'center'} variant="body2" fontSize={'0.8rem'}>Leverage</Typography>

          
        </Grid>
      </Grid>
    </Box>
  );
};

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
const calculateTotalStakedAmount = (history: any[]): number => {
    return history.reduce((total, stake) => total + stake.amount, 0);
};

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
  const [, setIsSelectionEnabled] = useState(true);

  // Add state for early unstake drawer visibility
  const [earlyUnstakeDrawerOpen, setEarlyUnstakeDrawerOpen] = useState(false);
  const [selectedEarlyUnstake, setSelectedEarlyUnstake] = useState<any | null>(null); // State to hold the selected stake for early unstaking

 const [UnstakeDrawerOpen, setUnstakeDrawerOpen] = useState(false);
  const [selectedUnstake, setSelectedUnstake] = useState<any | null>(null); // State to hold the selected stake for early unstaking


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

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open2, setOpen] = useState(false);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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
            )).toFixed(2);  // Kazancı iki ondalık basamağa yuvarla
          

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

  const handleSelectionChange = (newValue: number) => {
    // Check if the new value is the same as the currently selected value
    if (newValue === selectedOptionIndex) {
        return; // Do nothing if the same option is clicked
    }

    // Ensure the new value is within the bounds of stakingOptions
    const validOptions = [0, 1, 2, 3]; // 0: 7D, 1: 14D, 2: 30D, 3: 90D
    if (validOptions.includes(newValue)) {
        setSelectedOptionIndex(newValue);
        setIsSelectionEnabled(false); // Disable selection temporarily

        // Re-enable selection after 2 seconds
        setTimeout(() => {
            setIsSelectionEnabled(true);
        }, 2000);
    }
  };

  const renderStakingData = () => {
    if (!stakingData || stakingData.length === 0) {
        return <div>No staking data available.</div>; // Hata mesajı
    }

    if (selectedOptionIndex < 0 || selectedOptionIndex >= stakingData.length) {
        return <div>Invalid selection.</div>; // Geçersiz seçim mesajı
    }


    // Use the data variable to render relevant information
    return (
        <div>
         
        </div>
    );
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
    <Box mt={"17%"} style={{ marginBottom: '76px', backgroundColor: '#1a2126', padding: 8 ,}}>
      {renderStakingData()}
    
      <Brand/>
     
<Box textAlign={'center'} justifyContent={'center'} fontFamily={'monospace'} position="relative">
  {/* Yuvarlak Gradient Arka Plan */}
  <Box
    top="80%"
    left="50%"
    width="200px"
    height="200px"
    borderRadius="50%"
    zIndex={-1} // Arka plana almak için
    sx={{
      transform: 'translate(-50%, -50%)',
      filter: 'blur(40px)',
    }}
  />

  {/* Başlık */}
  <Typography mt={-28}   className="text-gradient" fontSize={'1.9rem'} fontWeight={'bold'}>
    Smart Liquidity Pool
  </Typography>

  {/* Açıklama Metni */}
  <Typography mb={2} fontSize={'0.7rem'}>
    Join the ranks of liquidity providers to earn higher returns with{' '}
    <span className="text-gradient">lower risks</span>
  </Typography>
</Box>


      
      
      {/* Button Group for Stake and Unstake */}
      <Box className="total-equity" display={'flex'} justifyContent="space-between" mb={2}>
      
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
          Subscribe
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
          Redeem
        </Button>
      </Box>
      


      {/* Conditionally render cards based on unstaking mode */}
      {isUnstaking ? (
        <Grid container spacing={2}>
          {[...Array(1)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{  textAlign: 'center', padding: 0.5, boxShadow: 6, borderRadius: 2, backgroundColor: '#e3f2fd' }}>
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
                    Locked Balance 
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
                        totalBalance={totalBalance} 
                handleAmountChange={handleAmountChange}
                handleDurationChange={handleDurationChange}
                handleLeverageChange={handleLeverageChange}
                calculateEarnings={calculateEarnings}
              />
            </Grid>

            

<Box mt={1} display={'flex'}>
     <Typography  variant="body1" sx={{ color: 'white' }}>
               <span style={{color:"gray "  , fontSize: ' 0.8rem'}}>
                Available : </span> {totalBalance !== null ? `${totalBalance.toFixed(2)} TON` : 'Loading...'}
                        </Typography>
                          <AddCircleOutlineIcon       onClick={handleNavigate}         
 fontSize='small' sx={{ ml: 1, color:'#89d9ff' }} />

            

</Box>
            


               <Typography  variant="body1" sx={{ color: 'gray'  , fontSize: ' 0.8rem'}}>
               Min Investment Size:    {stakingOptions[selectedOptionIndex].tonRange.min } TON ~ {stakingOptions[selectedOptionIndex].tonRange.min * 5.20} USDT

                    </Typography>

                     <Box display={'flex'} justifyContent={'space-between'}>
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

               <Typography   sx={{ color: 'white' , fontSize: ' 0.8rem'}}>
                                                            {parseFloat(String(stakingData[selectedOptionIndex].amount * stakingData[selectedOptionIndex].leverage || '0')).toFixed(2)} lbTON

                      </Typography>
                    </Box>

                    <Box display={'flex'} justifyContent={'space-between'}>
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

               <Typography   sx={{ color: 'white' , fontSize: ' 0.8rem'}}>
                        30 Days
                      </Typography>
                    </Box>
         


          
          {/* Earnings Display Outside of StakingCard */}
          <Box sx={{   
              textAlign: 'center', 
              borderRadius: 2,
              transition: 'transform 0.3s, box-shadow 0.3s',
               mt:2,
              display: 'flex', 
              flexDirection: 'column', 
            }}>
              <Box >
                 
                

                
           <Box bgcolor={"#2f363a"} borderRadius={2}  display="flex" alignItems="center" justifyContent="space-between">
      {/* Sağda ikon */}
   <Box p={1}>
   
<Box display="flex" alignItems="center">
  <Typography fontWeight={'bold'} textAlign={'left'} onClick={handleClick}>
    {stakingData[selectedOptionIndex].duration} day
  </Typography>
  {stakingData[selectedOptionIndex].duration === 30 && (
    <Box
      component="span"
      sx={{
        display: 'flex', // Flex kullanarak yatayda hizalama
        alignItems: 'center', // İkon ve yazıyı dikeyde ortalamak için
        backgroundColor: '#282828', // Kutu arka plan rengi
        borderRadius: 1, // Köşe yuvarlama
        padding: '1px 3px', // İç boşluk
        marginLeft: 1, // Sol taraf boşluğu
        fontSize: '0.6rem', // Yazı boyutu
        color: 'white', // Yazı rengi
        border:' 1px solid #4dccff'
      }}
    >
      <RecommendIcon sx={{   color:'#4dccff'   ,     fontSize: '1rem', // Yazı boyutu
 marginRight: '4px' }} /> {/* İkon */}
      Recommended
    </Box>
    
  )}
    {stakingData[selectedOptionIndex].duration === 30 && (
    <Box
      component="span"
      sx={{
        display: 'flex', // Flex kullanarak yatayda hizalama
        alignItems: 'center', // İkon ve yazıyı dikeyde ortalamak için
        backgroundColor: '#282828', // Kutu arka plan rengi
        borderRadius: 1, // Köşe yuvarlama
        padding: '1px 3px', // İç boşluk
        marginLeft: 1, // Sol taraf boşluğu
        fontSize: '0.6rem', // Yazı boyutu
        color: 'white', // Yazı rengi
                border:' 1px solid #98d974'

      }}
    >
      <SpaIcon sx={{ color:'#98d974',    fontSize: '1rem', // Yazı boyutu
 marginRight: '4px' }} /> {/* İkon */}
    %78.53 
    </Box>
    
  )}
   {stakingData[selectedOptionIndex].duration === 1 && (
    <Box
      component="span"
      sx={{
        display: 'flex', // Flex kullanarak yatayda hizalama
        alignItems: 'center', // İkon ve yazıyı dikeyde ortalamak için
        backgroundColor: '#282828', // Kutu arka plan rengi
        borderRadius: 1, // Köşe yuvarlama
        padding: '1px 3px', // İç boşluk
        marginLeft: 1, // Sol taraf boşluğu
        fontSize: '0.6rem', // Yazı boyutu
        color: 'white', // Yazı rengi
                border:' 1px solid  #d13207'

      }}
    >
      <LocalFireDepartmentIcon sx={{ color:' #d13207'   ,       fontSize: '1rem', // Yazı boyutu
 marginRight: '4px' }} /> {/* İkon */}
     175x Leverage
    </Box>
    
  )} 
    {stakingData[selectedOptionIndex].duration === 1 && (
    <Box
      component="span"
      sx={{
        display: 'flex', // Flex kullanarak yatayda hizalama
        alignItems: 'center', // İkon ve yazıyı dikeyde ortalamak için
        backgroundColor: '#282828', // Kutu arka plan rengi
        borderRadius: 1, // Köşe yuvarlama
        padding: '1px 3px', // İç boşluk
        marginLeft: 1, // Sol taraf boşluğu
        fontSize: '0.6rem', // Yazı boyutu
        color: 'white', // Yazı rengi
        border:' 1px solid #98d974'
      }}
    >
      <SpaIcon sx={{color:'#98d974'  ,   fontSize: '1rem', // Yazı boyutu
 marginRight: '4px' }} /> {/* İkon */}
     % 43.14
    </Box>
    
  )}
  {stakingData[selectedOptionIndex].duration === 14 && (
    <Box
      component="span"
      sx={{
        display: 'flex', // Flex kullanarak yatayda hizalama
        alignItems: 'center', // İkon ve yazıyı dikeyde ortalamak için
        backgroundColor: '#282828', // Kutu arka plan rengi
        borderRadius: 1, // Köşe yuvarlama
        padding: '1px 3px', // İç boşluk
        marginLeft: 1, // Sol taraf boşluğu
        fontSize: '0.6rem', // Yazı boyutu
        color: 'white', // Yazı rengi
                border:' 1px solid #d13207'

      }}
    >
      <LocalFireDepartmentIcon sx={{ color:'#d13207'   ,       fontSize: '1rem', // Yazı boyutu
 marginRight: '4px' }} /> {/* İkon */}
      250x Leverage
    </Box>
    
  )}
    {stakingData[selectedOptionIndex].duration === 14 && (
    <Box
      component="span"
      sx={{
        display: 'flex', // Flex kullanarak yatayda hizalama
        alignItems: 'center', // İkon ve yazıyı dikeyde ortalamak için
        backgroundColor: '#282828', // Kutu arka plan rengi
        borderRadius: 1, // Köşe yuvarlama
        padding: '1px 3px', // İç boşluk
        marginLeft: 1, // Sol taraf boşluğu
        fontSize: '0.6rem', // Yazı boyutu
        color: 'white', // Yazı rengi
        border:' 1px solid #98d974' 
      }}
    >
      <SpaIcon sx={{ color:'#98d974',    fontSize: '1rem', // Yazı boyutu
 marginRight: '4px' }} /> {/* İkon */}
     % 52.86
    </Box>
    
  )}
  {stakingData[selectedOptionIndex].duration === 90 && (
    <Box
      component="span"
      sx={{
        display: 'flex', // Flex kullanarak yatayda hizalama
        alignItems: 'center', // İkon ve yazıyı dikeyde ortalamak için
        backgroundColor: '#282828', // Kutu arka plan rengi
        borderRadius: 1, // Köşe yuvarlama
        padding: '1px 3px', // İç boşluk
        marginLeft: 1, // Sol taraf boşluğu
        fontSize: '0.6rem', // Yazı boyutu
        color: 'white', // Yazı rengi
                border:' 1px solid #FF5A00'

      }}
    >
      <LocalFireDepartmentIcon sx={{ color:'#FF5A00'   ,       fontSize: '1rem', // Yazı boyutu
 marginRight: '4px' }} /> {/* İkon */}
      +320x Leverage
    </Box>
    
  )}
    {stakingData[selectedOptionIndex].duration === 90 && (
    <Box
      component="span"
      sx={{
        display: 'flex', // Flex kullanarak yatayda hizalama
        alignItems: 'center', // İkon ve yazıyı dikeyde ortalamak için
        backgroundColor: '#282828', // Kutu arka plan rengi
        borderRadius: 1, // Köşe yuvarlama
        padding: '1px 3px', // İç boşluk
        marginLeft: 1, // Sol taraf boşluğu
        fontSize: '0.6rem', // Yazı boyutu
        color: 'white', // Yazı rengi
        border:' 1px solid #98d974'
      }}
    >
      <SpaIcon sx={{ color:'#98d974',    fontSize: '1rem', // Yazı boyutu
 marginRight: '4px' }} /> {/* İkon */}
     %102.86
    </Box>
    
  )}
</Box>
 
  <Typography color={'gray'} fontSize={'0.6rem'} textAlign={'left'} onClick={handleClick}>
    {
      stakingData[selectedOptionIndex].duration === 1 ? 'You will earn over the next 24 Hours' :
      stakingData[selectedOptionIndex].duration === 14 ? 'You will earn over the next 14 Day' :
      stakingData[selectedOptionIndex].duration === 30 ? 'You will earn over the next 30 Day' :
      stakingData[selectedOptionIndex].duration === 90 ? 'You will earn over the next 90 Day' :
      'default description'
    }
  </Typography>
</Box>

 <Box borderRadius={1} mr={1} bgcolor={'#1a2126'}>
      <IconButton onClick={handleClick} color="primary">
        {/* Menü açıldığında veya kapandığında ikon değiştirme */}
        {open2 ? <ExpandLessIcon sx={{color:'#89d9ff'}} /> : <ExpandMoreIcon sx={{color:'#89d9ff'}} />}
      </IconButton>
    </Box>
    
   <Menu
    anchorEl={anchorEl}
    open={open2} 
    onClose={handleClose}
    sx={{
      '& .MuiPaper-root': {
        boxShadow: 'none', // Gölgeyi kaldırıyoruz
      },
    }}
    PaperProps={{
      style: {
        backgroundColor: 'transparent', // Menü arka planını şeffaf yapıyoruz
        boxShadow: 'none', // Gölgeyi de kaldırmak isterseniz
        width: '100%',
      },
    }}
  >
  <MenuItem sx={{ backgroundColor: 'transparent' }}>
                  <ToggleButtonGroup
                fullWidth
                color='primary'
                value={selectedOptionIndex} 
                exclusive
                onChange={(_e, newValue) => handleSelectionChange(newValue as number)}
                sx={{backgroundColor:'black', fontSize:'2rem',borderRadius:2}} 
              >
                {stakingOptions.map((option, index) => (
                    <ToggleButton key={index} value={index} sx={{border:"1px solid #575757",p:1, color: 'whitesmoke', bgcolor: '#3f3f3f', borderRadius: 2, fontWeight: 'bolder' , fontSize:'0.8rem'}}>
                        {option.period}
                    </ToggleButton>
                ))}
              </ToggleButtonGroup> 
               </MenuItem>
      </Menu>
      
    </Box>
     
              </Box>
         
              <Box sx={{display:'flex', justifyContent:'space-between'}}>
                                            <Box   display={'flex'} alignItems={'center'}>
                                              
                                              <Box mt={2.5} mb={-2} >
                                                <Typography sx={{color:'gray', fontWeight:'lighter', textAlign:'left', fontSize:'0.9rem' }}>
 Estimated earnings in <span style={{color:'white', fontWeight:'bold'}}> {stakingData[selectedOptionIndex].duration} Days
  </span>  :       
                                                </Typography>

              
              <Typography textAlign={'left'} variant="h4" component="div" sx={{  fontWeight: 'bold', color: 'white', fontSize: '1.8rem', transition: 'opacity 0.5s' }}>
 +<span style={{color:'white'}}>{(parseFloat(calculateEarnings(
                      stakingData[selectedOptionIndex].amount, 
                      stakingData[selectedOptionIndex].duration,
                      stakingData[selectedOptionIndex].leverage,
                      stakingOptions[selectedOptionIndex].apy
                    ))).toFixed(2)}
 </span>
<span className='text-gradient'> TON</span> 
 
  <span style={{color:'gray', fontWeight:'lighter',fontSize:'0.6rem', marginLeft:5}}>
          ~ ({ (parseFloat(calculateEarnings(
                      stakingData[selectedOptionIndex].amount, 
                      stakingData[selectedOptionIndex].duration, 
                      stakingData[selectedOptionIndex].leverage,
                      stakingOptions[selectedOptionIndex].apy
                    )) * 5.20).toFixed(2)} USDT)
    </span>   
            
           
            </Typography>
                                              </Box>

            
  </Box>
              
              </Box>
          
            <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} sx={{ width: '100%', mt: 1 }}>
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
    

      <Box sx={{     
      }}>
      {/* Conditionally render the Stake Now button based on unstaking mode */}
      {!isUnstaking && (
        <Button variant="contained"  sx={{backgroundColor:'#6ed3ff', borderRadius: 2, width: '100%', mt: 1, fontSize: '1rem',color:"#121212", fontWeight:'bold' }} onClick={() => handleOpenDrawer(selectedOptionIndex)}>
          Subscribe
        </Button>
      )}
        <Typography 
          variant="body1" 
          align="center" 
          sx={{mt:1, mb: 1, color: 'grey', fontSize: '0.6rem' }}
        >
          By using the app, you confirm compliance 
      
          with our Terms of Service.
        </Typography>
      
       
      </Box>


        

 <Typography 
        variant="h3" 
        component="h3" 
        align="left" 
        sx={{ mb: 1,mt:4,textAlign:'left', fontWeight: 'bold', textTransform: 'uppercase' , fontSize:'1.1rem'}}
      >
        Overview
      </Typography>

      <DetailsCard />

      <Typography 
        variant="h3" 
        component="h3" 
        align="left" 
        sx={{ mb: 1,mt:4,textAlign:'left', fontWeight: 'bold', textTransform: 'uppercase' , fontSize:'1.1rem'}}
      >
        Protocol details
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

             

              {/* Yeni kutu ekleniyor */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                mt: -2, 
           
                borderTop: 0, 
                borderRadius: '0 0 4px 4px', // Alt köşeleri yuvarlak, üst köşeleri düz
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
                    {parseFloat(calculateEarnings(
                      selectedStaking.data.amount,
                      selectedStaking.data.duration,
                      selectedStaking.data.leverage,
                      selectedStaking.option.apy
                    )).toFixed(2)} TON
                  </Typography>
                </Box>
                                    <Box sx={{ width:'49%', p: 2, border: '1px solid #1976d2', borderRadius: 2, backgroundColor: '#e3f2fd'}}>

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