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

// Kategori seçici stilini güncelliyorum
const CategorySelector = ({ category, isSelected, hasBadge, onClick }: {
  category: { id: number; name: string };
  isSelected: boolean;
  hasBadge: boolean;
  onClick: () => void;
}) => (
  <Badge
    color="success"
    badgeContent=" "
    invisible={!hasBadge}
    anchorOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    sx={{
      margin: '0 15px',
      '& .MuiBadge-badge': {
        height: '8px',
        minWidth: '8px',
        borderRadius: '4px',
        background: 'linear-gradient(45deg, #00c6ff, #0072ff)',
      },
    }}
  >
    <Typography
      onClick={onClick}
      sx={{
        fontSize: { xs: '0.9rem', sm: '1rem' },
        cursor: 'pointer',
        color: isSelected ? '#000' : 'rgba(0, 0, 0, 0.5)',
        fontWeight: isSelected ? 800 : 500,
        transition: 'all 0.3s ease',
        position: 'relative',
        padding: '6px 12px',
        borderRadius: '20px',
        backgroundColor: isSelected ? 'rgba(0, 198, 255, 0.1)' : 'transparent',
        '&:hover': {
          color: '#000',
          backgroundColor: 'rgba(0, 198, 255, 0.05)',
        },
        '&::after': isSelected ? {
          content: '""',
          position: 'absolute',
          bottom: '-4px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '20px',
          height: '2px',
          background: 'linear-gradient(45deg, #00c6ff, #0072ff)',
          borderRadius: '1px'
        } : {}
      }}
    >
      {category.name}
    </Typography>
  </Badge>
);

// Task kartı stilini güncelliyorum
const TaskCard = ({ task, index, status, loading, onStart, onClaim, invitedCount, requiredCount }: any) => (
  <Box
    sx={{
      backgroundColor: 'white',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
      borderRadius: '16px',
      p: { xs: 2, sm: 2.5 },
      mb: 2,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      transition: 'all 0.3s ease',
      border: '1px solid rgba(0, 0, 0, 0.05)',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.08)',
      }
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Box
        component="img"
        src={taskLogos[index]}
        alt={`Task ${index + 1} logo`}
        sx={{
          width: { xs: '32px', sm: '36px' },
          height: { xs: '32px', sm: '36px' },
          borderRadius: '10px',
          padding: '6px',
          backgroundColor: 'rgba(0, 198, 255, 0.05)',
          border: '1px solid rgba(0, 198, 255, 0.1)'
        }}
      />
      <Box>
        <Typography 
          variant="body1" 
          sx={{ 
            fontWeight: 700,
            color: '#1a1a1a',
            fontSize: { xs: '0.9rem', sm: '1rem' },
            mb: 0.5
          }}
        >
          {task.title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {index >= 4 && index <= 9 && (
            <Typography
              variant="body2"
              sx={{
                color: invitedCount >= requiredCount ? '#4caf50' : '#ff9800',
                fontSize: { xs: '0.75rem', sm: '0.8rem' },
                fontWeight: 600,
                backgroundColor: invitedCount >= requiredCount ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 152, 0, 0.1)',
                padding: '2px 8px',
                borderRadius: '12px',
                display: 'inline-flex',
                alignItems: 'center'
              }}
            >
              {invitedCount}/{requiredCount}
            </Typography>
          )}
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'rgba(0, 0, 0, 0.6)',
              fontSize: { xs: '0.75rem', sm: '0.8rem' }
            }}
          >
            {task.description}
          </Typography>
        </Box>
      </Box>
    </Box>

    {status?.completed && !status?.disabled ? (
      <Button
        variant="outlined"
        size="small"
        onClick={onClaim}
        sx={{
          textTransform: 'none',
          borderRadius: '12px',
          borderColor: '#4caf50',
          color: '#4caf50',
          fontSize: { xs: '0.8rem', sm: '0.85rem' },
          fontWeight: 600,
          px: { xs: 2, sm: 3 },
          py: { xs: 0.5, sm: 0.75 },
          '&:hover': {
            borderColor: '#43a047',
            backgroundColor: 'rgba(76, 175, 80, 0.05)'
          }
        }}
      >
        {loading ? (
          <CircularProgress size={20} sx={{ color: '#4caf50' }} />
        ) : (
          'Claim'
        )}
      </Button>
    ) : (
      <Button
        variant="outlined"
        size="small"
        onClick={onStart}
        disabled={status?.disabled || status?.completed || loading}
        sx={{
          textTransform: 'none',
          borderRadius: '12px',
          fontSize: { xs: '0.8rem', sm: '0.85rem' },
          fontWeight: 600,
          px: { xs: 2, sm: 3 },
          py: { xs: 0.5, sm: 0.75 },
          borderColor: status?.completed ? '#4caf50' : '#2196f3',
          color: status?.completed ? '#fff' : '#2196f3',
          backgroundColor: status?.completed ? '#4caf50' : 'transparent',
          '&:hover': {
            borderColor: status?.completed ? '#43a047' : '#1976d2',
            backgroundColor: status?.completed ? '#43a047' : 'rgba(33, 150, 243, 0.05)'
          },
          '&.Mui-disabled': {
            backgroundColor: status?.completed ? '#4caf50' : 'rgba(0, 0, 0, 0.05)',
            color: status?.completed ? '#fff' : 'rgba(0, 0, 0, 0.3)'
          }
        }}
      >
        {loading ? (
          <CircularProgress size={20} sx={{ color: status?.completed ? '#fff' : '#2196f3' }} />
        ) : status?.completed ? (
          'Done'
        ) : (
          'Start'
        )}
      </Button>
    )}
  </Box>
);

// Ana bileşeni güncelliyorum
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
          p: { xs: 2, sm: 3 },
          mb: 10,
          maxWidth: '1200px',
          mx: 'auto'
        }}
      >
        <Box sx={{ width: '100%' }}>
          <RandomWinner />
          <UserDataTable />
        </Box>

        <Box 
          component="img" 
          src={Tasks} 
          alt="Tasks" 
          sx={{ 
            mt: 4, 
            width: { xs: '70px', sm: '80px' },
            filter: 'drop-shadow(0 4px 12px rgba(0, 198, 255, 0.2))'
          }} 
        />

        <Typography 
          variant="h4" 
          sx={{ 
            mt: 3,
            fontWeight: 800,
            color: '#1a1a1a',
            fontSize: { xs: '1.75rem', sm: '2rem' },
            textAlign: 'center',
            background: 'linear-gradient(45deg, #00c6ff, #0072ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          Tasks
        </Typography>

        <Typography 
          variant="body1" 
          sx={{ 
            mt: 1,
            color: 'rgba(0, 0, 0, 0.6)',
            textAlign: 'center',
            maxWidth: '600px',
            fontSize: { xs: '0.9rem', sm: '1rem' }
          }}
        >
          Get rewards for completing tasks.
        </Typography>

        <Box
          sx={{
            display: 'flex',
            overflowX: 'auto',
            mt: 4,
            p: 2,
            width: '100%',
            justifyContent: 'center',
            '&::-webkit-scrollbar': {
              height: '4px'
            },
            '&::-webkit-scrollbar-track': {
              background: 'rgba(0, 0, 0, 0.05)',
              borderRadius: '2px'
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(0, 198, 255, 0.3)',
              borderRadius: '2px',
              '&:hover': {
                background: 'rgba(0, 198, 255, 0.5)'
              }
            }
          }}
        >
          {categories.map((category) => (
            <CategorySelector
              key={category.id}
              category={category}
              isSelected={selectedCategory === category.id}
              hasBadge={[1, 2, 3].includes(category.id)}
              onClick={() => setSelectedCategory(category.id)}
            />
          ))}
        </Box>

        {loading ? (
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <CircularProgress sx={{ color: '#00c6ff' }} />
          </Box>
        ) : error ? (
          <Typography color="error" sx={{ mt: 4 }}>{error}</Typography>
        ) : (
          <Box sx={{ width: '100%', mt: 4 }}>
            {categories
              .find((category) => category.id === selectedCategory)
              ?.tasks.map((taskIndex) => {
                if (taskIndex === 11) {
                  return (
                    <Box
                      key={taskIndex}
                      sx={{
                        backgroundColor: 'white',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                        borderRadius: '16px',
                        p: { xs: 2, sm: 2.5 },
                        mb: 2,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        border: '1px solid rgba(0, 0, 0, 0.05)',
                        minHeight: '80px'
                      }}
                    >
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          fontWeight: 600,
                          color: 'rgba(0, 0, 0, 0.4)',
                          fontSize: { xs: '0.9rem', sm: '1rem' }
                        }}
                      >
                        Coming Soon ...
                      </Typography>
                    </Box>
                  );
                }

                return (
                  <TaskCard
                    key={taskIndex}
                    task={tasksMetadata[taskIndex]}
                    index={taskIndex}
                    status={taskStatus[taskIndex]}
                    loading={loadingTaskIndex === taskIndex}
                    onStart={() => handleTaskCompletion(taskIndex)}
                    onClaim={() => handleClaimTask(taskIndex)}
                    invitedCount={invitedUsersCount}
                    requiredCount={
                      taskIndex === 4 ? 1 :
                      taskIndex === 5 ? 10 :
                      taskIndex === 6 ? 25 :
                      taskIndex === 7 ? 50 :
                      taskIndex === 8 ? 100 : 0
                    }
                  />
                );
              })}

            {(selectedCategory === 1 || selectedCategory === 2) && (
              <Box
                sx={{
                  backgroundColor: 'white',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                  borderRadius: '16px',
                  p: { xs: 2, sm: 2.5 },
                  mb: 2,
                  width: '90%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  border: '1px solid rgba(0, 0, 0, 0.05)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.08)',
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: { xs: '32px', sm: '36px' },
                      height: { xs: '32px', sm: '36px' },
                      borderRadius: '10px',
                      backgroundColor: 'rgba(0, 198, 255, 0.05)',
                      border: '1px solid rgba(0, 198, 255, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <WalletIcon sx={{ 
                      fontSize: { xs: '1.25rem', sm: '1.5rem' },
                      color: '#00c6ff'
                    }}/>
                  </Box>
                  <Box>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        fontWeight: 700,
                        color: '#1a1a1a',
                        fontSize: { xs: '0.9rem', sm: '1rem' },
                        mb: 0.5
                      }}
                    >
                      Connect Wallet
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: 'rgba(0, 0, 0, 0.6)',
                        fontSize: { xs: '0.75rem', sm: '0.8rem' }
                      }}
                    >
                      +5 BBLIP
                    </Typography>
                  </Box>
                </Box>
                <Header />
              </Box>
            )}
          </Box>
        )}

        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert 
            severity="success"
            sx={{
              backgroundColor: '#4caf50',
              color: '#fff',
              '& .MuiAlert-icon': {
                color: '#fff'
              }
            }}
          >
            <AlertTitle sx={{ fontWeight: 600 }}>Success</AlertTitle>
            {rewardMessage}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default DealsComponent;
