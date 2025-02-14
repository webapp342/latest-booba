import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { TaskAd } from '../components/TaskAd/TaskAd';
import task8Logo from '../assets/booba-logo.png';
import task9Logo from '../assets/ton_logo_dark_background.svg';

const DEMO_TASKS = [
  {
    id: '1',
    blockId: 'task-8197', // Replace with your actual block ID
    title: 'Watch Video Ad',
    reward: '+10 BBLIP'
  },
  {
    id: '2',
    blockId: 'task-8197', // Replace with your actual block ID
    title: 'Complete Survey',
    reward: '+20 BBLIP'
  },
  {
    id: '3',
    blockId: 'task-8197', // Replace with your actual block ID
    title: 'Play Mini-Game',
    reward: '+0.1 TON'
  }
];

export const TaskAdsPage: React.FC = () => {
  const handleTaskComplete = (taskId: string) => {
    console.log(`Task ${taskId} completed`);
    // Here you can implement your reward logic
  };

  return (
    <Box sx={{ width: '100%' }}>
      {DEMO_TASKS.map((task) => (
        <Paper
          key={task.id}
          elevation={0}
          sx={{
            borderRadius: 2,
            mb: 1,
            width: '95%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            transition: 'all 0.2s ease',
            backgroundColor: 'rgba(110, 211, 255, 0.1)',
            p: 2
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
              <img 
                src={task.reward.includes('TON') ? task9Logo : task8Logo} 
                alt="" 
                width={22} 
                style={{ borderRadius: task.reward.includes('TON') ? '0' : '50%' }}
              />
            </Box>
            <Box>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 400,
                  color: '#FFFFFF',
                }}
              >
                {task.title}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <img 
                  src={task.reward.includes('TON') ? task9Logo : task8Logo} 
                  alt="" 
                  width={16} 
                  style={{ borderRadius: task.reward.includes('TON') ? '0' : '50%' }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    color: task.reward.includes('TON') ? '#89d9ff' : '#98d974',
                    fontWeight: 600,
                  }}
                >
                  {task.reward}
                </Typography>
              </Box>
            </Box>
          </Box>
          <TaskAd
            blockId={task.blockId}
            onTaskComplete={() => handleTaskComplete(task.id)}
            buttonText="Start"
          />
        </Paper>
      ))}
    </Box>
  );
}; 