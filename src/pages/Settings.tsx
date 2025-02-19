import React, { useEffect, useState } from 'react';
import { Box, Typography, Switch, List, ListItem, ListItemText, ListItemIcon, LinearProgress, Button, TextField, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import WebApp from "@twa-dev/sdk";
import NotificationsIcon from '@mui/icons-material/Notifications';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getFirestore, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { firebaseConfig } from './firebaseConfig';
import { initializeApp } from 'firebase/app';
import LockIcon from '@mui/icons-material/Lock';
import styled from 'styled-components';

// Firebase initialization
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Level thresholds (BBLIP amounts)
const LEVEL_THRESHOLDS = [
  { 
    level: 1, 
    name: "New Member", 
    description: "Welcome! Start by following us on X (Twitter)", 
    threshold: 0, 
    color: '#FFA726', 
    isUnlocked: true,
    requirements: []
  },
  { 
    level: 2, 
    name: "Community Member", 
    description: "Engage with our X posts to build trust", 
    threshold: 500, 
    color: '#66BB6A', 
    isUnlocked: false,
    requirements: ['5 Friends Invited', 'Like & Repost our X posts']
  },
  { 
    level: 3, 
    name: "Verified Trader", 
    description: "Active community member with trading history", 
    threshold: 2500, 
    color: '#42A5F5', 
    isUnlocked: false,
    requirements: ['Make your first deposit', '5 Friends Invited', 'Regular X engagement']
  },
  { 
    level: 4, 
    name: "Elite Trader", 
    description: "Trusted member with high platform engagement", 
    threshold: 10000, 
    color: '#AB47BC', 
    isUnlocked: false,
    requirements: ['Make your first deposit', '5 Friends Invited', 'Subscribe to AI Agent', 'Active X supporter']
  },
  { 
    level: 5, 
    name: "Master Provider", 
    description: "Top-tier member with maximum trust score", 
    threshold: 25000, 
    color: '#EF5350', 
    isUnlocked: false,
    requirements: ['Make your first deposit', '5 Friends Invited', 'Subscribe to AI Agent', 'Create New Pool', 'X Ambassador']
  }
];

interface LevelCardProps {
  isActive: boolean;
  isUnlocked: boolean;
}

const LevelCard = styled(Box)<LevelCardProps>`
  background: ${({ isActive }) => isActive ? 'rgba(110, 211, 255, 0.15)' : 'rgba(26, 33, 38, 0.5)'};
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 12px;
  border: ${({ isActive }) => isActive ? '1px solid rgba(110, 211, 255, 0.3)' : '1px solid rgba(110, 211, 255, 0.1)'};
  opacity: ${({ isUnlocked }) => isUnlocked ? 1 : 0.7};
  transition: all 0.3s ease;
`;

interface UserStats {
  depositsCount: number;
  invitedUsersCount: number;
  stakingCount: number;
  totalAmount: number;
  airdropAddress?: string;
  xUsername?: string;
}

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const [userBBLIP, setUserBBLIP] = useState<number>(0);
  const [currentLevel, setCurrentLevel] = useState<any>(LEVEL_THRESHOLDS[0]);
  const [progress, setProgress] = useState<number>(0);
  const [userStats, setUserStats] = useState<UserStats>({
    depositsCount: 0,
    invitedUsersCount: 0,
    stakingCount: 0,
    totalAmount: 0
  });
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('notificationsEnabled');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [showAirdropInputs, setShowAirdropInputs] = useState<boolean>(false);
  const [airdropAddress, setAirdropAddress] = useState<string>('');
  const [xUsername, setXUsername] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const backButton = WebApp.BackButton;
    backButton.show();
    backButton.onClick(() => {
      navigate("/spin");
    });

    return () => {
      backButton.hide();
      backButton.offClick(() => {
        navigate("/spin");
      });
    };
  }, [navigate]);

  // Handle notifications toggle
  const handleNotificationsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.checked;
    setNotificationsEnabled(newValue);
    localStorage.setItem('notificationsEnabled', JSON.stringify(newValue));
  };

  // Fetch user's BBLIP amount and referral count
  useEffect(() => {
    const telegramUserId = localStorage.getItem('telegramUserId');
    if (!telegramUserId) return;

    const userDocRef = doc(db, 'users', telegramUserId);
    const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const userData = docSnapshot.data();
        const bblipAmount = (userData.bblip || 0) / 1000;
        const totalAmount = (userData.total || 0) / 1000; // TON total amount
        setUserBBLIP(bblipAmount);

        // Get invited users count and deposits count
        const newStats = {
          invitedUsersCount: (userData.invitedUsers || []).length,
          depositsCount: (userData.deposits || []).length,
          stakingCount: (userData.stakingHistory || []).length,
          totalAmount: totalAmount
        };
        setUserStats(newStats);

        // Calculate current level and update unlocked states
        let currentLvl = LEVEL_THRESHOLDS[0];
        LEVEL_THRESHOLDS.forEach((level, index) => {
          if (level.level === 1) {
            LEVEL_THRESHOLDS[index].isUnlocked = true;
          } else if (level.level === 2) {
            // Level 2 requires both BBLIP threshold and 5 invited users
            LEVEL_THRESHOLDS[index].isUnlocked = bblipAmount >= level.threshold && newStats.invitedUsersCount >= 5;
          } else if (level.level === 3) {
            // Level 3 requires BBLIP threshold, deposit and invited users
            LEVEL_THRESHOLDS[index].isUnlocked = bblipAmount >= level.threshold && 
              newStats.depositsCount >= 1 && 
              newStats.invitedUsersCount >= 5;
          } else if (level.level === 4) {
            // Level 4 requires BBLIP threshold, deposit, invited users and staking
            LEVEL_THRESHOLDS[index].isUnlocked = bblipAmount >= level.threshold && 
              newStats.depositsCount >= 1 && 
              newStats.invitedUsersCount >= 5 && 
              newStats.stakingCount >= 1;
          } else {
            // Level 5 requires all previous requirements plus 100000 TON in total
            LEVEL_THRESHOLDS[index].isUnlocked = bblipAmount >= level.threshold && 
              newStats.depositsCount >= 1 && 
              newStats.invitedUsersCount >= 5 && 
              newStats.stakingCount >= 1 &&
              newStats.totalAmount >= 100000;
          }
          
          if (LEVEL_THRESHOLDS[index].isUnlocked) {
            currentLvl = level;
          }
        });

        setCurrentLevel(currentLvl);

        // Calculate progress to next level
        const nextLevelIndex = LEVEL_THRESHOLDS.findIndex(level => !level.isUnlocked);
        if (nextLevelIndex !== -1) {
          const nextLevel = LEVEL_THRESHOLDS[nextLevelIndex];
          const currentThreshold = currentLvl.threshold;

          // Calculate BBLIP progress first
          const bblipProgress = (bblipAmount / nextLevel.threshold) * 100;
          
          // If BBLIP threshold is met, show 100%
          if (bblipAmount >= nextLevel.threshold) {
            setProgress(100);
          } else {
            setProgress(Math.min(Math.max(bblipProgress, 0), 100));
          }

          // Add additional requirement warnings if BBLIP threshold is met
          if (bblipAmount >= nextLevel.threshold) {
            if (nextLevel.level === 2 && newStats.invitedUsersCount < 5) {
              // Show warning for friends requirement
              setProgress(100);
            } else if (nextLevel.level === 3) {
              if (newStats.depositsCount < 1 || newStats.invitedUsersCount < 5) {
                // Show warning for deposit and friends requirements
                setProgress(100);
              }
            } else if (nextLevel.level === 4) {
              if (newStats.depositsCount < 1 || newStats.invitedUsersCount < 5 || newStats.stakingCount < 1) {
                // Show warning for all requirements
                setProgress(100);
              }
            } else if (nextLevel.level === 5) {
              if (newStats.totalAmount < 100000) {
                // Show warning for total amount requirement
                setProgress(100);
              }
            }
          }
        } else {
          setProgress(100);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Validate and save airdrop details
  const handleAirdropSubmit = async () => {
    if (!airdropAddress || !xUsername) return;
    
    setIsSubmitting(true);
    try {
      const telegramUserId = localStorage.getItem('telegramUserId');
      if (!telegramUserId) return;

      const userDocRef = doc(db, 'users', telegramUserId);
      await updateDoc(userDocRef, {
        airdropAddress,
        xUsername: xUsername.startsWith('@') ? xUsername : '@' + xUsername
      });
      setShowAirdropInputs(false);
    } catch (error) {
      console.error('Error saving airdrop details:', error);
    }
    setIsSubmitting(false);
  };

  // Check if airdrop details exist
  useEffect(() => {
    const telegramUserId = localStorage.getItem('telegramUserId');
    if (!telegramUserId) return;

    const userDocRef = doc(db, 'users', telegramUserId);
    const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const userData = docSnapshot.data();
        setShowAirdropInputs(!userData.airdropAddress || !userData.xUsername);
        setAirdropAddress(userData.airdropAddress || '');
        setXUsername(userData.xUsername || '');
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <Box sx={{ p: 2, color: 'white', bgcolor: '#1a2126', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <ArrowBackIcon 
          sx={{ mr: 2, cursor: 'pointer' }} 
          onClick={() => navigate('/spin')}
        />
        <Typography variant="h6">Achievements</Typography>
      </Box>

      {/* Current Level Progress */}
      <Box sx={{ 
        bgcolor: 'rgba(110, 211, 255, 0.1)',
        borderRadius: '20px',
        p: 3,
        mb: 4,
        border: '1px solid rgba(110, 211, 255, 0.2)'
      }}>
        <Typography variant="h6" sx={{ color: currentLevel.color }}>
          Trust Level: {currentLevel.name}
        </Typography>
        <Typography variant="body2" color="gray" sx={{ mb: 2 }}>
          Complete tasks and engage with our X posts to increase your trust score
        </Typography>
        <LinearProgress 
          variant="determinate" 
          value={progress} 
          sx={{
            height: 6,
            borderRadius: 3,
            backgroundColor: 'rgba(110, 211, 255, 0.1)',
            '& .MuiLinearProgress-bar': {
              backgroundColor: currentLevel.color,
              borderRadius: 3,
            }
          }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Typography variant="caption" color="gray">
            {progress.toFixed(0)}% Complete
          </Typography>
          <Typography variant="caption" color="gray">
            {userBBLIP.toLocaleString()}/{LEVEL_THRESHOLDS[Math.min(currentLevel.level, LEVEL_THRESHOLDS.length - 1)].threshold.toLocaleString()} BBLIP
          </Typography>
        </Box>
      </Box>

      {/* Airdrop Registration Section */}
      {showAirdropInputs && (
        <Box sx={{ 
          bgcolor: 'rgba(110, 211, 255, 0.1)',
          borderRadius: '20px',
          p: 3,
          mb: 4,
          border: '1px solid rgba(239, 83, 80, 0.5)'
        }}>
          <Typography variant="h6" sx={{ color: '#EF5350', mb: 2 }}>
            🎯 Airdrop Registration Required
          </Typography>
          <Alert severity="warning" sx={{ mb: 2, bgcolor: 'rgba(255, 167, 38, 0.1)', color: 'white' }}>
            {currentLevel.level >= 2 
              ? "Register your SOL address and X username to be eligible for the airdrop. Missing this step will result in exclusion from the airdrop."
              : "You need to reach Community Member level (Level 2) to register for the airdrop. Complete the required tasks to unlock registration."}
          </Alert>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="SOL Address"
              value={airdropAddress}
              onChange={(e) => setAirdropAddress(e.target.value)}
              disabled={currentLevel.level < 2}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': {
                    borderColor: 'rgba(110, 211, 255, 0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(110, 211, 255, 0.5)',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'gray',
                }
              }}
            />
            <TextField
              fullWidth
              label="X (Twitter) Username"
              value={xUsername}
              onChange={(e) => setXUsername(e.target.value)}
              disabled={currentLevel.level < 2}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': {
                    borderColor: 'rgba(110, 211, 255, 0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(110, 211, 255, 0.5)',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'gray',
                }
              }}
            />
            <Button
              variant="contained"
              onClick={handleAirdropSubmit}
              disabled={!airdropAddress || !xUsername || isSubmitting || currentLevel.level < 2}
              sx={{
                bgcolor: '#EF5350',
                '&:hover': {
                  bgcolor: '#D32F2F',
                },
                '&:disabled': {
                  bgcolor: 'rgba(239, 83, 80, 0.5)',
                }
              }}
            >
              {isSubmitting ? 'Saving...' : currentLevel.level < 2 ? 'Reach Level 2 to Register' : 'Save Airdrop Details'}
            </Button>
          </Box>
        </Box>
      )}

      {/* Level Cards */}
      {LEVEL_THRESHOLDS.map((level, index) => (
        <LevelCard 
          key={level.level}
          isActive={currentLevel.level === level.level}
          isUnlocked={level.isUnlocked}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '8px',
                  backgroundColor: level.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2,
                  color: 'white',
                  fontWeight: 'bold'
                }}
              >
                {level.level}
              </Box>
              <Box>
                <Box>
                  <Typography variant="subtitle1" sx={{ color: level.isUnlocked ? 'white' : 'gray' }}>
                    {level.name}
                  </Typography>
                  <Typography variant="body2" color="gray">
                    {level.description}
                  </Typography>
                  {level.requirements.length > 0 && !level.isUnlocked && (
                    <Typography variant="caption" sx={{ color: '#ff3333' }}>
                      ⚠️ {level.requirements
                        .filter(req => {
                          if (req === '5 Friends Invited' && userStats.invitedUsersCount >= 5) return false;
                          if (req === '1 Deposit Transaction' && userStats.depositsCount >= 1) return false;
                          if (req === '1 Staking Transaction' && userStats.stakingCount >= 1) return false;
                          if (req === 'Create Pool with 100000 TON' && userStats.totalAmount >= 100000) return false;
                          return true;
                        })
                        .join(', ')}
                    </Typography>
                  )}
                  {!level.isUnlocked && level.level === 3 && userBBLIP >= level.threshold && (
                    <Typography variant="caption" sx={{ display: 'none' }}>
                    </Typography>
                  )}
                  {!level.isUnlocked && level.level === 4 && userBBLIP >= level.threshold && (
                    <Typography variant="caption" sx={{ display: 'none' }}>
                    </Typography>
                  )}
                  {!level.isUnlocked && level.level === 5 && userBBLIP >= level.threshold && (
                    <Typography variant="caption" sx={{ display: 'none' }}>
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>
            {!level.isUnlocked && (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                color: 'gray'
              }}>
                <LockIcon />
                <Typography variant="caption">Locked</Typography>
              </Box>
            )}
            {level.isUnlocked && (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                color: level.color
              }}>
                <Typography variant="caption">Unlocked</Typography>
              </Box>
            )}
          </Box>
        </LevelCard>
      ))}

      {/* Settings */}
      <List sx={{ mt: 4 }}>
        <ListItem sx={{ 
          backgroundColor: 'rgba(110, 211, 255, 0.05)',
          borderRadius: 2,
          '&:hover': {
            backgroundColor: 'rgba(110, 211, 255, 0.1)',
          }
        }}>
          <ListItemIcon>
            <NotificationsIcon sx={{ color: '#89d9ff' }} />
          </ListItemIcon>
          <ListItemText 
            primary="Notifications" 
            secondary="Manage your notifications"
            secondaryTypographyProps={{ sx: { color: 'gray' } }}
          />
          <Switch 
            checked={notificationsEnabled}
            onChange={handleNotificationsChange}
          />
        </ListItem>
      </List>
    </Box>
  );
};

export default Settings;