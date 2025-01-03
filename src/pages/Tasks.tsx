import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Badge,
} from '@mui/material';
import WalletIcon from '@mui/icons-material/Wallet';
import './slide.css'

import RandomWinner from './RandomWinner'; // RandomWinner bileşenini içeri aktarıyoruz
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Header } from './ConnectButton';


import {
  getFirestore,
  doc,
  onSnapshot,
  updateDoc,
  increment,
} from 'firebase/firestore';
import AlertTitle from '@mui/material/AlertTitle';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './firebaseConfig';
import Tasks from '../assets/tasks.png';
import task1Logo from '../assets/task1logo.png';
import { useNavigate } from 'react-router-dom'; // React Router'ın navigate fonksiyonu
import task2Logo from '../assets/instagram.png';
import task4Logo from '../assets/tik-tok.png';
import task5Logo from '../assets/telegram.png';
import task7Logo from '../assets/logo5.png';
import task8Logo from '../assets/logo5.png';
import WebApp from "@twa-dev/sdk";

import task9Logo from '../assets/ton_logo_dark_background.svg';
import task10Logo from '../assets/ton_logo_dark_background.svg';
import task11Logo from '../assets/ton_logo_dark_background.svg';
import comingSoonLogo from '../assets/task1logo.png';
import UserDataTable from './UserDataTable';

// Firebase App initialization
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const theme = createTheme({
  typography: {
    fontFamily: "monospace",
  },
});

// Tasks metadata
const tasksMetadata = [

  { title: 'Follow Booba on X', description: '+5 BBLIP', link: 'https://x.com/BoobaBlip', reward: 5000 },
  { title: 'Follow Booba on Instagram', description: '+5 BBLIP', link: 'https://www.instagram.com/boobablip/profilecard/?igsh=MXUwMWQxNmJ1bzZhYg==', reward: 5000 },
  { title: 'Follow Booba on Tiktok', description: '+5 BBLIP', link: 'https://www.tiktok.com/@boobablip?_t=8scYCPf4zaQ&_r=1', reward: 5000 },
  { title: 'Join Booba Community', description: '+5 BBLIP', link: 'https://t.me/BoobaBlipCommunity', reward: 5000 },
  { title: 'Invite 1 fren', description: '+5 BBLIP', link: '', reward: 5000 },
  { title: 'Invite 10 fren', description: '+25 BBLIP', link: '', reward: 25000 },
  { title: 'Invite 25 fren', description: '+2.5 TON', link: '', reward: 2500 },
  { title: 'Invite 50 fren', description: '+5 TON', link: '', reward: 5000 },
  { title: 'Invite 100 fren', description: '+10 TON', link: '', reward: 10000 },


  { title: '', description: 'Coming Soon...', link: '' , reward: 100},
];

const taskLogos = [
  task1Logo,
  task2Logo,
  task4Logo,
  task5Logo,
  task7Logo,
  task8Logo,
  task9Logo,
  task10Logo,
  task11Logo,
  comingSoonLogo,
];

const categories = [
  { id: 1, name: 'New', tasks: [0, 1,2,3] },
  { id: 2, name: 'Socials', tasks: [0,1,2, 3] },
  { id: 3, name: 'Frens', tasks: [4,5,6,7,8] },
  { id: 4, name: 'Academy', tasks: [11] },
  { id: 5, name: 'On Chain', tasks: [11] },
  { id: 6, name: 'Farming', tasks: [11] },
];


const DealsComponent: React.FC = () => {
  const [taskStatus, setTaskStatus] = useState<Record<number, { completed: boolean; disabled: boolean }>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
     const navigate = useNavigate(); // Navigate fonksiyonunu tanımlayın

  const [selectedCategory, setSelectedCategory] = useState<number>(1);
  const [loadingTaskIndex, setLoadingTaskIndex] = useState<number | null>(null); // Track the task being processed
  const [openSnackbar, setOpenSnackbar] = useState(false); // Snackbar state
  const [rewardMessage, setRewardMessage] = useState<string>(''); // Reward message for snackbar
  
  

  const [invitedUsersCount, setInvitedUsersCount] = useState(0); // Davet edilen kullanıcı sayısı

  
  useEffect(() => {
    const backButton = WebApp.BackButton;

    // BackButton'u görünür yap ve tıklanma işlevi ekle
    backButton.show();
    backButton.onClick(() => {
      navigate("/latest-booba/");
    });

    // Cleanup: Bileşen unmount olduğunda butonu gizle ve event handler'ı kaldır
    return () => {
      backButton.hide();
      backButton.offClick(() => {
        navigate("/latest-booba/"); // Buraya tekrar aynı callback sağlanmalıdır.
      });
    };
  }, [navigate]);

  useEffect(() => {
    const fetchUserTasks = async () => {
      try {
        setLoading(true);
        const telegramUserId = localStorage.getItem('telegramUserId');

        if (!telegramUserId) {
          throw new Error('User ID not found. Please log in again.');
        }

        const userDocRef = doc(db, 'users', telegramUserId);
        
        // Using onSnapshot for real-time updates
        const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
          if (docSnapshot.exists()) {
            const userData = docSnapshot.data();
            setTaskStatus(userData.tasks || {});
             const invitedUsers = userData.invitedUsers || [];
          setInvitedUsersCount(invitedUsers.length);
          } else {
            setError('User document not found.');
          }
        });

        // Cleanup function to stop the real-time listener when the component unmounts
        return () => unsubscribe();

      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserTasks();
  }, []);

  const handleTaskCompletion = async (taskIndex: number) => {
    try {
      const telegramUserId = localStorage.getItem('telegramUserId');
      if (!telegramUserId) throw new Error('User ID not found.');

      setLoadingTaskIndex(taskIndex); // Show loading spinner for the task

      // Immediately update task status before redirection (Only set completed to true)
      const updatedTasks = {
        ...taskStatus,
        [taskIndex]: { ...taskStatus[taskIndex], completed: true },
      };

      setTaskStatus(updatedTasks);

      // Update Firestore with only the completed field
      const userDocRef = doc(db, 'users', telegramUserId);
      await updateDoc(userDocRef, {
        [`tasks.${taskIndex}.completed`]: true,
      });

      // Redirect the user immediately
      window.location.href = tasksMetadata[taskIndex].link;

      // Wait for 5 seconds before hiding the loading spinner
      setTimeout(() => {
        setLoadingTaskIndex(null); // Hide the spinner after 5 seconds
      }, 5000); // Wait for 5 seconds before hiding the spinner
    } catch (err) {
      console.error('Error completing task:', err);
      setError('An error occurred. Please try again.');
      setLoadingTaskIndex(null); // Hide the spinner in case of error
    }
  };

  const handleClaimTask = async (taskIndex: number) => {
  try {
    const telegramUserId = localStorage.getItem('telegramUserId');
    if (!telegramUserId) throw new Error('User ID not found.');

    setLoadingTaskIndex(taskIndex); // Show loading spinner for the claim action

    // Immediately update task as claimed (set completed and disabled fields)
    const updatedTasks = {
      ...taskStatus,
      [taskIndex]: { ...taskStatus[taskIndex], disabled: true },
    };

    setTaskStatus(updatedTasks);

    // Update Firestore with the claim action (set disabled to true)
    const userDocRef = doc(db, 'users', telegramUserId);
    await updateDoc(userDocRef, {
      [`tasks.${taskIndex}.disabled`]: true,
    });

    // Get the reward and description for the selected task
    const reward = tasksMetadata[taskIndex].reward;
    const description = tasksMetadata[taskIndex].description;

    // Check if the description includes 'BBLIP' or 'TON' to determine the reward type
    const isBblipReward = description.includes('BBLIP'); // If description contains 'BBLIP', it's BBLIP
    const isTonReward = description.includes('TON'); // If description contains 'TON', it's TON

    // Add the reward amount to the appropriate field (bblip or total)
    if (isBblipReward) {
      await updateDoc(userDocRef, {
        bblip: increment(reward), // Add the reward amount to the bblip field
      });
    } else if (isTonReward) {
      await updateDoc(userDocRef, {
        total: increment(reward), // Add the reward amount to the total field
      });
    }

    // Set the reward message for the snackbar
    setRewardMessage(`You have claimed ${description} for completing the task: "${tasksMetadata[taskIndex].title}"`);

    // Wait for 5 seconds for circular progress before showing Snackbar
    setTimeout(() => {
      setOpenSnackbar(true); // Show Snackbar after 5 seconds
      setLoadingTaskIndex(null); // Hide the spinner after 5 seconds
    }, 5000);
  } catch (err) {
    console.error('Error claiming task:', err);
    setError('An error occurred while claiming the task. Please try again.');
    setLoadingTaskIndex(null); // Hide the spinner in case of error
  }
};





  return (
        <ThemeProvider theme={theme}>
    
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      
      <Box>
 
              
        <RandomWinner />
                      <UserDataTable />

        
      </Box>
      <Box component="img" src={Tasks} alt="Tasks" sx={{ mt: 4, width: '80px' }} />

      <Typography variant="h5" sx={{ mt: 4, fontWeight: 'bold', color: 'black' }}>
        Tasks
      </Typography>
      

      <Typography variant="body1" sx={{ mt: 1, color: 'text.secondary' }}>
        Get rewards for completing tasks.
      </Typography>
      <Box>


  

      </Box>
      <Box>
      </Box>

            


      {/* Kategori Seçici */}
      <Box
        sx={{
          display: 'flex',
          overflowX: 'auto',
          marginTop: 4,
          padding: 2,
          ml: -3,
          width: '100%',
          whiteSpace: 'nowrap',
          scrollbarWidth: 'none',
          '-ms-overflow-style': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        }}
      >
        {categories.map((category) => (
          <Badge
            key={category.id}
            color="success"
            badgeContent=" "
            invisible={![1, 2, 3].includes(category.id)}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            sx={{
              margin: '0 15px',
              '& .MuiBadge-badge': {
                height: '12px',
                minWidth: '12px',
                borderRadius: '6px',
              },
            }}
          >
            <Typography
              onClick={() => setSelectedCategory(category.id)}
              sx={{
                fontSize: '1.1rem',
                cursor: 'pointer',
                color: selectedCategory === category.id ? 'black' : 'gray',
                fontWeight: selectedCategory === category.id ? 'bold' : 'normal',
                textDecoration: 'none',
              }}
            >
              {category.name}
            </Typography>
          </Badge>
        ))}
      </Box>

      {loading ? (
        <CircularProgress sx={{ mt: 4 }} />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Box sx={{ width: '100%', mt: 4 }}>
         {categories
  .find((category) => category.id === selectedCategory)
  ?.tasks.map((taskIndex) => {
    // Task 11 için "Coming Soon" mesajını göster
    if (taskIndex === 11) {
      return (
        <Box
          key={taskIndex}
          sx={{
            backgroundColor: 'white',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
            borderRadius: 2,
            p: 2,
            mb: 2,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
     
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'gray' }}>
            Coming Soon ...
          </Typography>
        </Box>
      );
    }

    return (
      <Box
        key={taskIndex}
        sx={{
          backgroundColor: 'white',
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
          borderRadius: 2,
          p: 2,
          mb: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box
            component="img"
            src={taskLogos[taskIndex]} // Task logosunu kullan
            alt={`Task ${taskIndex + 1} logo`}
            sx={{ maxWidth: '30px', maxHeight: '30px', marginRight: 2 }}
          />
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'black' }}>
              {tasksMetadata[taskIndex].title}
            </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
  {
    taskIndex >= 4 && taskIndex <= 9 &&
      ` ${invitedUsersCount}/${taskIndex === 4 ? 1 : taskIndex === 5 ? 10 : taskIndex === 6 ? 25 : taskIndex === 7 ? 50 : 100} ,   `
  }

    {tasksMetadata[taskIndex].description}

</Typography>


          </Box>
        </Box>

        {taskStatus[taskIndex]?.completed && !taskStatus[taskIndex]?.disabled ? (
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleClaimTask(taskIndex)}
            sx={{ textTransform: 'none', borderRadius: 2 , borderColor: 'green',color: 'green' }}
          >
            {loadingTaskIndex === taskIndex ? (
              <CircularProgress size={24} sx={{ color: 'gray' }} />
            ) : (
              'Claim'
            )}
          </Button>
        ) : (
         <Button
  variant="outlined"
  size="small"
  onClick={() => handleTaskCompletion(taskIndex)}
  disabled={
    taskStatus[taskIndex]?.disabled ||
    taskStatus[taskIndex]?.completed ||
    loadingTaskIndex === taskIndex ||
    (taskIndex >= 4 && taskIndex <= 9 && invitedUsersCount < (taskIndex === 4 ? 1 : taskIndex === 5 ? 10 : taskIndex === 6 ? 25 : taskIndex === 7 ? 50 : 100))
  }
          sx={{
    textTransform: 'none',
    borderRadius: 2,
    borderColor: taskStatus[taskIndex]?.completed ? 'green' : 'default',
    color: taskStatus[taskIndex]?.completed ? 'white' : 'default',
    backgroundColor: taskStatus[taskIndex]?.completed ? 'green' : 'transparent',
    '&:hover': {
      borderColor: taskStatus[taskIndex]?.completed ? 'green' : 'default',
      backgroundColor: taskStatus[taskIndex]?.completed ? 'green' : 'transparent',
    },
    '&.Mui-disabled': {
      color: taskStatus[taskIndex]?.completed ? 'white' : 'default',
      borderColor: taskStatus[taskIndex]?.completed ? 'green' : 'default',
      backgroundColor: taskStatus[taskIndex]?.completed ? 'green' : 'transparent',
    },
  }}
          >
            {loadingTaskIndex === taskIndex ? (
              <CircularProgress size={24} sx={{ color: 'white' }} />
            ) : taskStatus[taskIndex]?.completed ? (
              'Done'
            ) : (
              'Start'
            )}
          </Button>
        )}
      </Box>
    );
  })}

        </Box>
      )}
    {selectedCategory === 1 || selectedCategory === 2 ? (
       <Box
      sx={{
        backgroundColor: 'white',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        borderRadius: 2,
        p: 2,
        mb: 2,
                width: '90%',

        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <WalletIcon sx={{fontSize:'2rem', mr:1.5}}/>
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'black' }}>
            Connect Wallet
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          +5 BBLIP
          </Typography>
        </Box>
      </Box>
                 <Header  />

    </Box>
    ) : null}
   {/* Snackbar to show after claiming */}
<Snackbar
  open={openSnackbar}
  autoHideDuration={3000}
  onClose={() => setOpenSnackbar(false)}
  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
>
  <Alert severity="success">
    <AlertTitle>Success</AlertTitle>
    {rewardMessage} {/* Dynamic reward message */}
  </Alert>
</Snackbar>

    </Box>
        </ThemeProvider>
    
  );
};

export default DealsComponent;
