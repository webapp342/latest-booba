import React, { useEffect, useState, useContext } from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Badge,
  
  Paper,
  Container,


} from '@mui/material';
import './slide.css'
import connectwallet from '../assets/connectwallet.png';

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Header } from './ConnectButton';
import TestComponent from '../pages/TestComponent';


import {
  getFirestore,
  doc,
  onSnapshot,
  updateDoc,
  increment,
} from 'firebase/firestore'; 
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './firebaseConfig';
import task1Logo from '../assets/task1logo.png';
import task4Logo from '../assets/www.png';
import task5Logo from '../assets/telegram.png';
import task8Logo from '../assets/booba-logo.png';

import watchad from '../assets/watchad.png';
import freespin from '../assets/freespin.png';
import firstdeposit from '../assets/firstdeposit.png';
import aiagent from '../assets/investment.png';



import task9Logo from '../assets/ton_logo_dark_background.svg';
import task19Logo from '../assets/income.png';

import comingSoonLogo from '../assets/task1logo.png';
import { ShowAdButton } from './ShowAdButton';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import DepositDrawer from '../components/WalletDrawers/DepositDrawer';
import { NotificationContext } from '../App';
import {  Task } from './AdTask';

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
          padding: 1.5,
          paddingRight: 5,
          paddingLeft: 5,
          letterSpacing: 1.1,
          '&:hover': {
            backgroundColor: 'transparent',
          },
          '&:active': {
            backgroundColor: 'transparent',
          },
          '&.MuiButton-contained': {
            backgroundColor: 'rgba(110, 211, 255, 0.1)',
           
            '&:active': {
              backgroundColor: 'transparent',
            },
          },
          '&.MuiButton-outlined': {
            '&:hover': {
              backgroundColor: 'transparent',
            },
            '&:active': {
              backgroundColor: 'transparent',
            },
          },
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
  { title: 'Like & Repost on X',label:'+5 BBLIP', description: '5 BBLIP', link: 'https://x.com/BoobaBlip/status/1891573592963400187', reward: 5000 },
  { title: 'Like & Repost on X',label:'+5 BBLIP', description: '5 BBLIP', link: 'https://x.com/BoobaBlip/status/1891699016510976424', reward: 5000 },
   
    { title: 'Visit bblip.io',label:'+5 BBLIP', description: '5 BBLIP', link: 'https://home.bblip.io', reward: 5000 },
      { title: 'Join Community',label:'+5 BBLIP', description: '5 BBLIP', link: 'https://t.me/BoobaBlipCommunity', reward: 5000 },


  { title: 'Invite 1 fren',label:'+5 BBLIP', description: '5 BBLIP', link: '', reward: 5000 },
  { title: 'Invite 5 fren',label:'+25 BBLIP', description: '25 BBLIP', link: '', reward: 25000 },
  { title: 'Invite 10 fren',label:'+50 BBLIP', description: '50 BBLIP', link: '', reward: 50000 },
  { title: 'Invite 15 fren',label:'+75 BBLIP', description: '75 BBLIP', link: '', reward: 75000 },
  { title: 'Invite 20 fren',label:'+100 BBLIP', description: '100 BBLIP', link: '', reward: 100000 },
  { title: 'Invite 25 fren',label:'+125 BBLIP', description: '125 BBLIP', link: '', reward: 125000 },
  { title: 'Invite 50 fren',label:'+250 BBLIP', description: '250 BBLIP', link: '', reward: 250000 },
  { title: 'Invite 75 fren',label:'+375 BBLIP', description: '375 BBLIP', link: '', reward: 375000 },
  { title: 'Invite 100 fren',label:'+10 TON', description: '10 TON', link: '', reward: 10000 },
  { title: 'Watch a Video',label:'+10 BBLIP', description: '10 BBLIP', link: 'https://example.com/watch-video', reward: 1000 },
  { title: 'Spin for Free',label:'+15 BBLIP', description: '15 BBLIP', link: '', reward: 15000 },
  { title: 'Make Your First Deposit',label:'+75 BBLIP', description: '75 BBLIP', link: '', reward: 75000 },
  { title: 'Subscribe to AI agent',label:'+25 BBLIP', description: '25 BBLIP', link: '', reward: 25000 },
  { title: '', description: 'Coming Soon...', link: '' , reward: 100},
];

const taskLogos = [
  task1Logo,
  task1Logo,
  task4Logo,
  task5Logo,
  task19Logo, // Invite 5
  task19Logo, // Invite 5
  task19Logo, // Invite 10
  task19Logo, // Invite 15
  task19Logo, // Invite 20
  task19Logo, // Invite 25
  task19Logo, // Invite 50
  task19Logo, // Invite 75
  task19Logo, // Invite 100
  task8Logo, // Watch video
  freespin, // Spin task
  firstdeposit, // Deposit task
    aiagent, // Deposit task

  comingSoonLogo,
];

const currencyLogo = [
  task8Logo, // Follow X
  task8Logo, // Follow Instagram
  task8Logo, // Follow Tiktok
  task8Logo, // Join Community
  task8Logo, // Invite 1
  task8Logo, // Invite 1
  task8Logo, // Follow X
  task8Logo, // Follow X
  task8Logo, // Follow X
  task8Logo, // Follow X
  task8Logo, // Follow X
  task8Logo, // Follow X
  task9Logo, // Invite 100
  task8Logo, // Watch video
  task8Logo, // Follow X
  task8Logo, // Follow X
  task8Logo, // Follow X

  comingSoonLogo,
];


const categories = [
  { id: 1, name: 'New', tasks: [9, 14, 15, 16] },
  { id: 2, name: 'Socials', tasks: [0,1,2,3] },
  { id: 3, name: 'Frens', tasks: [4,5,6,7,8,10,11,12] },
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
       
      }}
    >
      {category.name}
    </Button>
  </Badge>
);

// Task kartı stilini güncelliyorum
const TaskCard = ({ task, index, status, loading, onStart, onClaim, invitedCount, requiredCount, hasSpinned, deposits, stakingHistory }: {
  task: typeof tasksMetadata[0];
  index: number;
  status?: { completed: boolean; disabled: boolean };
  loading: boolean;
  onStart: () => void;
  onClaim: () => void;
  invitedCount: number;
  requiredCount: number;
  hasSpinned?: boolean;
  deposits?: Record<string, any[]>;
  stakingHistory?: any[];
}) => {
  const navigate = useNavigate();
  const [isDepositDrawerOpen, setIsDepositDrawerOpen] = useState(false);

  const handleDepositClick = () => {
    setIsDepositDrawerOpen(true);
  };

  const hasDeposits = deposits && Object.keys(deposits).length > 0;
  const hasStakingHistory = stakingHistory && stakingHistory.length > 0;

  const renderButton = () => {
    if (index === 15) { // Deposit task
      if (hasDeposits) {
        if (status?.disabled) {
          return (
            <Button
              disabled
              sx={{
                mr: 1,
                opacity: 0.7,
                '&:disabled': {
                  color: '#fff',
                },
              }}
            >
              Completed
            </Button>
          );
        }
        return (
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
        );
      }
      return (
        <Button
          variant="contained"
          onClick={handleDepositClick}
          sx={{
            p: 1,
            backgroundColor: 'rgba(110, 211, 255, 0.1)',
            color: '#6ed3ff',
           
          }}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : 'Earn'}
        </Button>
      );
    }

    if (index === 14) { // Spin task
      if (hasSpinned) {
        if (status?.disabled) {
          return ( 
            <Button
              disabled
              sx={{
                mr: 1,
                opacity: 0.7,
                '&:disabled': {
                  color: '#fff',
                },
              }}
            >
              Completed
            </Button>
          );
        }
        return (
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
        );
      }
      return (
        <Button
          variant="contained"
          onClick={() => navigate('/slot')}
          sx={{
            p: 1,
            backgroundColor: 'rgba(110, 211, 255, 0.1)',
            color: '#6ed3ff',
           
          }}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : 'Earn'}
        </Button>
      );
    }

     if (index === 16) { // AI agent subscription task
      if (hasStakingHistory) {
        if (status?.disabled) {
          return (
            <Button
              disabled
              sx={{
                mr: 1,
                opacity: 0.7,
                '&:disabled': {
                  color: '#fff',
                },
              }}
            >
              Completed
            </Button>
          );
        }
        return (
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
        );
      }
      return (
        <Button
          variant="contained"
          onClick={() => navigate('/stake')}
          sx={{
            p: 1,
            backgroundColor: 'rgba(110, 211, 255, 0.1)',
            color: '#6ed3ff',
          }}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : 'Earn'}
        </Button>
      );
    }

    // Default task button
    if (status?.completed) {
      if (status.disabled) {
        return (
          <Button
            disabled
            sx={{
              mr: 1,
              opacity: 0.7,
              '&:disabled': {
                color: '#fff',
              },
            }}
          >
            Completed
          </Button>
        );
      }
      return (
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
      );
    }

    return (
      <Button
        variant="contained"
        onClick={onStart}
        disabled={index >= 4 && index <= 12 && invitedCount < requiredCount}
        component={index <= 3 ? 'a' : 'button'}
        href={index <= 3 ? task.link : undefined}
        target={index <= 3 ? "_blank" : undefined}
        rel={index <= 3 ? "noopener noreferrer" : undefined}
        sx={{
          p: 1,
          backgroundColor: 'rgba(110, 211, 255, 0.1)',
          color: '#6ed3ff',
          '&:disabled': {
            background: '#2f363a',
            color: 'rgba(255, 255, 255, 0.3)',
          },
        }}
      >
        {loading ? <CircularProgress size={20} color="inherit" /> : 'Earn'}
      </Button>
    );
  };

  return (
    <>
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
        <Box //@ts-ignore
        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
              {index >= 4 && index <= 12 && (
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
                    color: task.description.includes('TON') ? '#89d9ff' : '#98d974',
                    fontWeight: 600,
                  }}
                >
                  {task.label}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {renderButton()}
      </Paper>
      <DepositDrawer open={isDepositDrawerOpen} onClose={() => setIsDepositDrawerOpen(false)} />
    </>
  );
};

// Ana bileşeni güncelliyorum
const DealsComponent: React.FC = () => {
  const [taskStatus, setTaskStatus] = useState<{ [key: number]: { completed: boolean; disabled: boolean } }>({});
  const [selectedCategory, setSelectedCategory] = useState(1);
  const [loadingTaskIndex, setLoadingTaskIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [invitedUsersCount, setInvitedUsersCount] = useState(0);
  const [hasSpinned, setHasSpinned] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deposits, setDeposits] = useState<Record<string, any[]>>({});
  const [stakingHistory, setStakingHistory] = useState<any[]>([]);
  const { showNotification } = useContext(NotificationContext);

  useEffect(() => {
    const telegramUserId = localStorage.getItem('telegramUserId');
    if (!telegramUserId) {
      setLoading(false);
      return;
    }

    const userDocRef = doc(db, 'users', telegramUserId);
    const unsubscribe = onSnapshot(userDocRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setTaskStatus(data.tasks || {});
        setInvitedUsersCount(data.invitedUsers?.length || 0);
        setHasSpinned(!!data.hasSpinned);
        setDeposits(data.deposits || {});
        setStakingHistory(data.stakingHistory || []);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleTaskCompletion = async (taskIndex: number) => {
    try {
      const telegramUserId = localStorage.getItem('telegramUserId');
      if (!telegramUserId) throw new Error('User ID not found.');

      setLoadingTaskIndex(taskIndex);

      const userDocRef = doc(db, 'users', telegramUserId);
      if (taskIndex === 14) {
        await updateDoc(userDocRef, {
          hasSpinned: true,
        });
      } else {
        await updateDoc(userDocRef, {
          [`tasks.${taskIndex}.completed`]: true,
          [`tasks.${taskIndex}.completedAt`]: new Date().toISOString()
        });
      }

      setLoadingTaskIndex(null);
    } catch (err) {
      console.error('Error completing task:', err);
      setError('An error occurred. Please try again.');
      setLoadingTaskIndex(null);
    }
  };

  const handleClaimTask = async (taskIndex: number) => {
    try {
      const telegramUserId = localStorage.getItem('telegramUserId');
      if (!telegramUserId) throw new Error('User ID not found.');

      if (!taskStatus[taskIndex]) {
        setError('Task status not found.');
        return;
      }

      if (!taskStatus[taskIndex].completed || taskStatus[taskIndex].disabled) {
        setError('This task cannot be claimed. Make sure you have completed it and haven\'t claimed it before.');
        return;
      }

      if (taskIndex === 14 && !hasSpinned) {
        setError('Please spin first before claiming the reward.');
        return;
      }

      if (taskIndex >= 4 && taskIndex <= 12) {
        const inviteRequirements: Record<number, number> = {
          4: 1, 5: 5, 6: 10, 7: 15, 8: 20, 9: 25, 10: 50, 11: 75, 12: 100
        };
        const requiredInvites = inviteRequirements[taskIndex];
        
        if (typeof requiredInvites === 'number' && invitedUsersCount < requiredInvites) {
          setError(`You need ${requiredInvites} invites to claim this reward. Current: ${invitedUsersCount}`);
          return;
        }
      }

      if (taskIndex === 15 && (!deposits || Object.keys(deposits).length === 0)) {
        setError('You need to make a deposit first to claim this reward.');
        return;
      }

      if (taskIndex === 16 && (!stakingHistory || stakingHistory.length === 0)) {
        setError('You need to subscribe to AI agent first to claim this reward.');
        return;
      }

      setLoadingTaskIndex(taskIndex);

      const reward = tasksMetadata[taskIndex].description;
      const isTON = reward.includes('TON');
      const rewardAmount = isTON 
        ? parseFloat(reward.split(' ')[0]) * 1000
        : tasksMetadata[taskIndex].reward;

      const userDocRef = doc(db, 'users', telegramUserId);
      
      await updateDoc(userDocRef, {
        [`tasks.${taskIndex}.disabled`]: true,
        [`tasks.${taskIndex}.claimedAt`]: new Date().toISOString(),
        [isTON ? 'total' : 'bblip']: increment(rewardAmount)
      });

      showNotification(`Successfully claimed ${tasksMetadata[taskIndex].description}!`);
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
    
      <ThemeProvider theme={theme}>

        <Container  maxWidth="lg" sx={{px:1, py:5,  mt:-9,  }}>

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
            <Box 
            sx={{ 
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
                  75 <span style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.9rem' }}>TON</span>
                </Typography>
              </Box>
              </Box>
            </Box>

          
          </Box>
        </GradientBox>
    
       

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
              {selectedCategory === 4 ? (
                <Box sx={{ 
                  width: '100%', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  gap: 2
                }}>
              
                </Box>
              ) : (
                <>
                  {selectedCategory === 1 ? (
                    // New category tasks
                    <>
                      {/* Watch Ad */}
                      <Paper
                        key="watch-ad"
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
                                +10 BBLIP
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                        <ShowAdButton />
                      </Paper>

                      {/* Spin for Free */}
                      <TaskCard
                        key={14}
                        task={tasksMetadata[14]}
                        index={14}
                        status={taskStatus[14]}
                        loading={loadingTaskIndex === 14}
                        onStart={() => handleTaskCompletion(14)}
                        onClaim={() => handleClaimTask(14)}
                        invitedCount={invitedUsersCount}
                        requiredCount={0}
                        hasSpinned={hasSpinned}
                        deposits={deposits}
                        stakingHistory={stakingHistory}
                      />

                      {/* Make Your First Deposit */}
                      <TaskCard
                        key={15}
                        task={tasksMetadata[15]}
                        index={15}
                        status={taskStatus[15]}
                        loading={loadingTaskIndex === 15}
                        onStart={() => handleTaskCompletion(15)}
                        onClaim={() => handleClaimTask(15)}
                        invitedCount={invitedUsersCount}
                        requiredCount={0}
                        hasSpinned={hasSpinned}
                        deposits={deposits}
                        stakingHistory={stakingHistory}
                      />

                      {/* Subscribe to AI agent */}
                      <TaskCard
                        key={16}
                        task={tasksMetadata[16]}
                        index={16}
                        status={taskStatus[16]}
                        loading={loadingTaskIndex === 16}
                        onStart={() => handleTaskCompletion(16)}
                        onClaim={() => handleClaimTask(16)}
                        invitedCount={invitedUsersCount}
                        requiredCount={0}
                        hasSpinned={hasSpinned}
                        deposits={deposits}
                        stakingHistory={stakingHistory}
                      />

                      {/* Connect Wallet */}
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
                            <img src={connectwallet} alt="" width={22} />
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

                      {/* Partners Section */}
                    

                      {/* AdsGram Task */}
                      <Task 
                        blockId="task-8200"
                        debug={false}
                      />
                    
                    </>
                  ) : (
                    // Other categories
                    <>
                      {selectedCategory === 3 && (
                        <Box key="test-component" sx={{ mb: 2 }}>
                          <TestComponent />
                        </Box>
                      )}
                      {categories
                        .find((category) => category.id === selectedCategory)
                        ?.tasks.map((taskIndex) => (
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
                              taskIndex === 5 ? 5 :
                              taskIndex === 6 ? 10 :
                              taskIndex === 7 ? 15 :
                              taskIndex === 8 ? 20 :
                              taskIndex === 9 ? 25 :
                              taskIndex === 10 ? 50 :
                              taskIndex === 11 ? 75 :
                              taskIndex === 12 ? 100 : 0
                            }
                            hasSpinned={taskIndex === 14 && hasSpinned}
                            deposits={deposits}
                            stakingHistory={stakingHistory}
                          />
                        ))}
                    </>
                  )}
                </>
              )}
            </Box>
          )}

        

        
        </Container>
      </ThemeProvider>
  );
};

export default DealsComponent;
