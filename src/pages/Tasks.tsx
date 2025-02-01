import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Badge,
  Slide,

  Paper,
  Container,


} from '@mui/material';
import WalletIcon from '@mui/icons-material/Wallet';
import './slide.css'

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Header } from './ConnectButton';


import {
  getFirestore,
  doc,
  onSnapshot,
  updateDoc,
  increment,
} from 'firebase/firestore'; 
import TestComponent from '../pages/TestComponent';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './firebaseConfig';
import task1Logo from '../assets/task1logo.png';
import task2Logo from '../assets/instagram.png';
import task4Logo from '../assets/tik-tok.png';
import task5Logo from '../assets/telegram.png';
import task7Logo from '../assets/darkLogo.png';
import task8Logo from '../assets/darkLogo.png';

import watchad from '../assets/ad.png';


import task9Logo from '../assets/ton_logo_dark_background.svg';
import task10Logo from '../assets/ton_logo_dark_background.svg';
import task11Logo from '../assets/ton_logo_dark_background.svg';
import comingSoonLogo from '../assets/task1logo.png';
import UserDataTable from './UserDataTable';
import { ShowAdButton } from './ShowAdButton';
import styled from 'styled-components';
import WithTourSection from '../components/TourGuide/withTourSection';

// Firebase App initialization
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const theme = createTheme({
  typography: {
    fontFamily: "Inter, system-ui, -apple-system, sans-serif",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: 'none',
                                        color: '#6ed3ff',

          padding:1.5,
          paddingRight:5,
          paddingLeft:5,
          letterSpacing:1.1,
        
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
             backgroundColor: 'rgba(110, 211, 255, 0.1)',
                    padding: '8px',
                    borderRadius: '12px',
                             },
      },
    },
  },
});

// Tasks metadata
const tasksMetadata = [

  { title: 'Follow on X',label:'+5 BBLIP', description: '5 BBLIP', link: 'twitter://user?screen_name=BoobaBlip', reward: 5000 },
  { title: 'Follow on Instagram',label:'+5 BBLIP', description: '5 BBLIP', link: 'https://www.instagram.com/boobablip', reward: 5000 },
  { title: 'Follow on Tiktok',label:'+5 BBLIP', description: '5 BBLIP', link: 'https://www.tiktok.com/@boobablip?_t=8scYCPf4zaQ&_r=1', reward: 5000 },
  { title: 'Join Community',label:'+5 BBLIP', description: '5 BBLIP', link: 'https://t.me/BoobaBlipCommunity', reward: 5000 },
  { title: 'Invite 1 fren',label:'+5 BBLIP', description: '5 BBLIP', link: '', reward: 5000 },
  { title: 'Invite 10 fren',label:'+25 BBLIP', description: '25 BBLIP', link: '', reward: 25000 },
  { title: 'Invite 25 fren',label:'+2.5 TON', description: '2.5 TON', link: '', reward: 2500 },
  { title: 'Invite 50 fren',label:'+5 TON', description: '5 TON', link: '', reward: 5000 },
  { title: 'Invite 100 fren',label:'+10 TON', description: '10 TON', link: '', reward: 10000 },
    { title: 'Watch a Video',label:'+10 BBLIP', description: '10 BBLIP', link: 'https://example.com/watch-video', reward: 1000 },



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

const currencyLogo = [
  task8Logo,
  task8Logo,
  task8Logo,
  task8Logo,
  task8Logo,
  task8Logo,
  task9Logo,
  task10Logo,
  task11Logo,
  comingSoonLogo,
];


const categories = [

  { id: 1, name: 'New', tasks: [9,0, 1,2,3] },

  { id: 2, name: 'Socials', tasks: [0,1,2, 3] },

  { id: 3, name: 'Frens', tasks: [4,5,6,7,8] },


];




// Kategori seçici stilini güncelliyorum
const CategorySelector = ({ category, isSelected, hasBadge, onClick }: {
  category: { id: number; name: string };
  isSelected: boolean;
  hasBadge: boolean;
  onClick: () => void;
}) => (
  <Badge
    color="primary"
    variant="dot"
    invisible={!hasBadge}
    sx={{ mx: 1 }}
  >
    <Button
      onClick={onClick}
      variant={isSelected ? "contained" : "text"}
      size="small"
      sx={{
        minWidth: 'auto',
        px: 2,
        py: 1,
        backgroundColor: isSelected ? 'rgba(0, 198, 255, 0.1)' : 'transparent',
        color: isSelected ? '#00c6ff' : 'rgba(255, 255, 255, 0.6)',
        '&:hover': {
          backgroundColor: isSelected ? 'rgba(0, 198, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)',
        },
      }}
    >
      {category.name}
    </Button>
  </Badge>
);

// Task kartı stilini güncelliyorum
const TaskCard = ({ task, index, status, loading, onStart, onClaim, invitedCount, requiredCount }: any) => (
  <Paper
    elevation={0}
    sx={{
      borderRadius: 2,
      
      mb: 1,
      width: '95%',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      transition: 'all 0.2s ease',
   
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Box
        component="img"
        src={taskLogos[index]}
        alt={`Task ${index + 1} logo`}
        sx={{
          width: 20,
          height: 20,
          borderRadius: '12px',
          p: 1,
      
          backgroundColor: 'rgba(0, 198, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      />
      <Box>
        <Typography 
         textAlign={'left'}
          sx={{ 
            color: '#FFFFFF',
                fontsize:'0.85rem',
      
          }}
        >
          {task.title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {index >= 4 && index <= 9 && (
            <Box
              sx={{
                px: 1.5,
                py: 0.5,
                backgroundColor: invitedCount >= requiredCount ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 152, 0, 0.1)',
                borderRadius: '6px',
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: invitedCount >= requiredCount ? '#4caf50' : '#ff9800',
                  fontWeight: 600,
                }}
              >
                {invitedCount}/{requiredCount}
              </Typography>
            </Box>
          )}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              component="img"
              src={currencyLogo[index]}
              alt=""
              sx={{
                width: 16,
                height: 16,
                borderRadius: '50%',
              }}
            />
            <Typography
              variant="caption"
              sx={{
                color: index >= 6 && index <= 9 ? '#89d9ff' : '#98d974',
                fontWeight: 600,
              }}
            >
              {task.label}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>

    {status?.completed ? (
      status?.disabled ? (
        <Button
        
          variant="contained"
          disabled
          sx={{
            mr:1,
            backgroundColor: '#4caf50',
            opacity: 0.7,
            '&:disabled': {
              color: '#fff',
            },
          }}
        >
          Completed
        </Button>
      ) : (
        <Button
          variant="outlined"
          onClick={onClaim}
          sx={{
            borderColor: '#4caf50',
         
            color: '#4caf50',
          
          }}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : 'Claim'}
        </Button>
      )
    ) : (
      <Button
        variant="contained"
        onClick={onStart}
        disabled={index >= 4 && index <= 9 && invitedCount < requiredCount}
        component={index <= 3 ? 'a' : 'button'}
        href={index <= 3 ? task.link : undefined}
        target={index <= 3 ? "_blank" : undefined}
        rel={index <= 3 ? "noopener noreferrer" : undefined}
        sx={{
       p:1,
                              backgroundColor: 'rgba(110, 211, 255, 0.1)',
                                      color: '#6ed3ff'
,
         
          '&:disabled': {
            background: '#2f363a',
            color: 'rgba(255, 255, 255, 0.3)',
          },
        }}
      >
        {loading ? <CircularProgress size={20} color="inherit" /> : 'Start'}
      </Button>
    )}
  </Paper>
);


// Ana bileşeni güncelliyorum
const DealsComponent: React.FC = () => {
  const [taskStatus, setTaskStatus] = useState<Record<number, { completed: boolean; disabled: boolean }>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<number>(1);
  const [loadingTaskIndex, setLoadingTaskIndex] = useState<number | null>(null); // Track the task being processed
  const [openSnackbar, setOpenSnackbar] = useState(false); // Snackbar state
  const [rewardMessage, setRewardMessage] = useState<string>(''); // Reward message for snackbar
  
  

  const [invitedUsersCount, setInvitedUsersCount] = useState(0); // Davet edilen kullanıcı sayısı

  
  

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



      // Wait for 5 seconds before hiding the loading spinner
      setTimeout(() => {
        setLoadingTaskIndex(null); // Hide the spinner after 5 seconds
      }, 15000); // Wait for 5 seconds before hiding the spinner
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

      // Get the reward and description for the selected task
      const reward = tasksMetadata[taskIndex].reward;
      const description = tasksMetadata[taskIndex].description;

      // Update Firestore with the claim action and reward
      const userDocRef = doc(db, 'users', telegramUserId);
      
      if (description.includes('BBLIP')) {
        await updateDoc(userDocRef, {
          [`tasks.${taskIndex}.disabled`]: true,
          bblip: increment(reward)
        });
      } else if (description.includes('TON')) {
        await updateDoc(userDocRef, {
          [`tasks.${taskIndex}.disabled`]: true,
          total: increment(reward)
        });
      }

      // Update local state
      const updatedTasks = {
        ...taskStatus,
        [taskIndex]: { ...taskStatus[taskIndex], disabled: true },
      };
      setTaskStatus(updatedTasks);

      // Set the reward message for the snackbar
      setRewardMessage(`${description} claimed succesfully`);

      // Show success message  
      setOpenSnackbar(true);
      setLoadingTaskIndex(null);
    } catch (err) {
      console.error('Error claiming task:', err);
      setError('An error occurred while claiming the task. Please try again.');
      setLoadingTaskIndex(null);
    }
  };


const GradientBox = styled(Box)(() => ({
  background: 'linear-gradient(180deg, rgba(110, 211, 255, 0.08) 0%, rgba(26, 33, 38, 0) 100%)',
  borderRadius: '24px',
  padding: '24px 16px',
  marginBottom: '24px',
  border: '1px solid rgba(110, 211, 255, 0.1)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
}));



  return (
    <WithTourSection sectionId="tasks-section">
      <ThemeProvider theme={theme}>
        <Container maxWidth="lg" sx={{px:1, py: 8, mb:8}}>


            <GradientBox>
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center',
              gap: { xs: 2, sm: 3 },
            }}
          >
    

            {/* Main Title */}
            <Typography 
              className="text-gradient" 
              fontFamily={'Montserrat'} 
              sx={{
                fontSize: { xs: '1.4rem', sm: '1.6rem' },
                fontWeight: 800,
                letterSpacing: '-0.02em',
                textAlign: 'center',
                lineHeight: 1.2,
                maxWidth: '280px',
                animation: 'fadeIn 0.5s ease-in',
                background: 'linear-gradient(90deg, #6ED3FF 0%, #89D9FF 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Complete Tasks
            </Typography>
                <Typography 
              className="text-gradient" 
              fontFamily={'Montserrat'} 
              sx={{
                fontSize: { xs: '1.4rem', sm: '1.6rem' },
                fontWeight: 800,
                letterSpacing: '-0.02em',
                textAlign: 'center',
                mt:-2,
                lineHeight: 1.2,
                maxWidth: '280px',
                animation: 'fadeIn 0.5s ease-in',
                background: 'linear-gradient(90deg,rgb(240, 245, 247) 0%,rgb(99, 122, 133) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
             Earn Rewards
            </Typography>

            {/* Description */}
            <Box sx={{ 
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}>
              <Typography 
                sx={{ 
                  fontSize: { xs: '0.875rem', sm: '0.9rem' },
                  color: 'rgba(255,255,255,0.85)',
                  textAlign: 'center',
                  fontWeight: 600,
                  lineHeight: 1.6
                }}
              >
Earn rewards by completing tasks, invite friends, watching ads, and more in our next-level DeFi experience!              <span className="text-gradient" style={{
                  fontWeight: 700,
                  padding: '0 4px',
                  whiteSpace: 'nowrap'
                }}>
                  next-level DeFi experience!
                </span>
              </Typography>

              {/* Sub Description with Icon */}
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                padding: '8px 16px',
                borderRadius: '12px',
                border: '1px solid rgba(110, 211, 255, 0.1)',
                              backgroundColor: 'rgba(110, 211, 255, 0.05)'

              }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <img src={task8Logo} alt="" width={24} style={{ borderRadius: '50%' }} />
                <Typography color="white" variant="h6" sx={{ fontWeight: 600 }}>
                  125.000 <span style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.9rem' }}>BBLIP</span>
                </Typography>
              </Box>
              +
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <img src={task9Logo} alt="" width={24} />
                <Typography color="white" variant="h6" sx={{ fontWeight: 600 }}>
                  50 <span style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.9rem' }}>TON</span>
                </Typography>
              </Box>
              </Box>
            </Box>

          
          </Box>
        </GradientBox>
    
          <Box sx={{ width: '100%', mb: 4 }}>
            <UserDataTable />
          </Box>

          <Box
            sx={{
              display: 'flex',
              overflowX: 'auto',
              py: 2,
              px: 1,
              mb: 3,
              justifyContent: 'center',
              '&::-webkit-scrollbar': {
                display: 'none'
              },
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
            }}
          >
            {categories.map((category) => (
              <CategorySelector
                key={category.id}
                category={category}
                isSelected={selectedCategory === category.id}
                hasBadge={[3].includes(category.id)}
                onClick={() => setSelectedCategory(category.id)}
              />
            ))}
          </Box>

          {loading ? (
            <Box sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
              <CircularProgress sx={{ color: '#00c6ff' }} />
            </Box>
          ) : error ? (
            <Typography color="error" sx={{ py: 8, textAlign: 'center' }}>{error}</Typography>
          ) : (
            <Box sx={{ width: '100%' }}>
              {categories
                .find((category) => category.id === selectedCategory)
                ?.tasks.map((taskIndex) => {
                  if (taskIndex === 9) {
                    return (
                     <Paper
       elevation={0}
       sx={{
         borderRadius: 2,
         
         mb: 1,
         width: '95%',
         display: 'flex',
         justifyContent: 'space-between',
         alignItems: 'center',
         transition: 'all 0.2s ease',
      
       }}
     >
                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                           <Box
                             component="img"
                             src={watchad}
                             alt="Watch Ads"
                             sx={{
                               width: 30,
                               height: 30,
                               borderRadius: '12px',
                               p: 0.4,
                       
                               backgroundColor: 'rgba(0, 198, 255, 0.05)',
                               border: '1px solid rgba(255, 255, 255, 0.08)',
                             }}
                           />
                           <Box>
                             <Typography 
                               variant="subtitle1"
                               textAlign={'left'}
                               sx={{
                                 fontWeight: 400,
                                 color: '#FFFFFF',
                               }}
                             > Watch Ad
                             </Typography>
                             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                               <img src={task8Logo} alt="" width={16} style={{ borderRadius: '50%' }} />
                               <Typography
                                 variant="caption"
                                 sx={{
                                   color: '#98d974',
                                   fontWeight: 600,
                                 }}
                               >
                                 +5 BBLIP
                               </Typography>
                             </Box>
                           </Box>
                         </Box>
                         <ShowAdButton />
                       </Paper>
                    );
                  }

                  if (selectedCategory === 3 && taskIndex === 4) {
                    return (
                      <Box key="test-component" sx={{ mb: 2 }}>
                        <TestComponent />
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

              {(selectedCategory === 1) && (
              <Paper
       elevation={0}
       sx={{
         borderRadius: 2,
         
         mb: 1,
         width: '95%',
         display: 'flex',
         justifyContent: 'space-between',
         alignItems: 'center',
         transition: 'all 0.2s ease',
      
       }}
     >
                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                   <Box
                     sx={{
                       width: 35,
                       height: 35,
             
                       backgroundColor: 'rgba(0, 198, 255, 0.05)',
                       border: '1px solid rgba(255, 255, 255, 0.08)',
                       borderRadius: '12px',
                       display: 'flex',
                       alignItems: 'center',
                       justifyContent: 'center'
                     }}
                   >
                     <WalletIcon sx={{ color: '#00c6ff' }} />
                   </Box>
                   <Box>
                     <Typography 
                       variant="subtitle1"
                       sx={{ 
                         fontWeight: 400,
                         color: '#FFFFFF',
            
                       }}
                     >
                       Connect Wallet
                     </Typography>
                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                       <img src={task8Logo} alt="" width={16} style={{ borderRadius: '50%' }} />
                       <Typography
                         variant="caption"
                         sx={{
                           color: '#98d974',
                           fontWeight: 600,
                         }}
                       >
                         +5 BBLIP
                       </Typography>
                     </Box>
                   </Box>
                 </Box>
                 <Header />
               </Paper>
              )}
            </Box>
          )}

        

          <Snackbar
            open={openSnackbar}
            autoHideDuration={3000}
            onClose={() => setOpenSnackbar(false)}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            TransitionComponent={Slide}
          >
            <Alert
              severity="success"
              variant="filled"
              sx={{
                backgroundColor: '#4caf50',
                color: '#fff',
                borderRadius: '8px',
                '& .MuiAlert-icon': {
                  color: '#fff'
                }
              }}
            >
              {rewardMessage}
            </Alert>
          </Snackbar>
        </Container>
      </ThemeProvider>
    </WithTourSection>
  );
};

export default DealsComponent;
