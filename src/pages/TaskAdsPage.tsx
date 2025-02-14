import React from 'react';
import { Box } from '@mui/material';
import { TaskAd } from '../components/TaskAd/TaskAd';


const DEMO_TASKS = [
  {
    id: '1',
    blockId: 'task-8197', // Replace with your actual block ID
    reward: '+10 BBLIP'
  },
  {
    id: '2',
    blockId: 'task-8197', // Replace with your actual block ID
    reward: '+20 BBLIP'
  },
  {
    id: '3',
    blockId: 'task-8197', // Replace with your actual block ID
    reward: '+0.1 TON'
  }
];

export const TaskAdsPage: React.FC = () => {
  const handleTaskComplete = (taskId: string) => {
    console.log(`Task ${taskId} completed`);
    // Here you can implement your reward logic
  };

  return (
    <Box //@ts-ignore
    sx={{ width: '100%' }}>
      {DEMO_TASKS.map((task) => (
        
          
          <TaskAd
            blockId={task.blockId}
            onTaskComplete={() => handleTaskComplete(task.id)}
            reward={task.reward}
          />
      ))}
    </Box>
  );
}; 