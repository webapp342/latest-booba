import  { useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { doc, getFirestore, updateDoc } from 'firebase/firestore';
import { tasks } from '../pages/Tasks/tasks';
import { categories } from '../pages/Tasks/categories';
import { useTaskStatus } from '../pages/Tasks/useTaskStatus';
import { useButtonStates } from '../pages/Tasks/useButtonStates';
import { TaskButton } from '../pages/Tasks/TaskButton';
import { CategoryTabs } from '../pages/Tasks/CategoryTabs';

const db = getFirestore();

export function TasksComponent() {
  const [selectedCategory, setSelectedCategory] = useState<number>(1);
  const { taskStatus, setTaskStatus, loading, error } = useTaskStatus();
  const { buttonStates, setButtonStates } = useButtonStates();

  const handleTaskStart = async (taskIndex: number) => {
    const telegramUserId = localStorage.getItem('telegramUserId');
    if (!telegramUserId) return;

    const newState = {
      loading: true,
      claimLoading: false,
      startTime: Date.now()
    };

    setButtonStates(prev => ({
      ...prev,
      [taskIndex]: newState
    }));

    localStorage.setItem('buttonStates', JSON.stringify({
      ...buttonStates,
      [taskIndex]: newState
    }));

    try {
      const userDocRef = doc(db, 'users', telegramUserId);
      await updateDoc(userDocRef, {
        [`tasks.${taskIndex}.completed`]: true
      });

      const newTaskStatus = [...taskStatus];
      if (newTaskStatus[taskIndex]) {
        newTaskStatus[taskIndex] = { ...newTaskStatus[taskIndex], completed: true };
        setTaskStatus(newTaskStatus);
      }

      window.location.href = tasks[taskIndex].link;

      setTimeout(() => {
        setButtonStates(prev => {
          const newStates = { ...prev };
          delete newStates[taskIndex];
          return newStates;
        });
        
        const currentStates = JSON.parse(localStorage.getItem('buttonStates') || '{}');
        delete currentStates[taskIndex];
        localStorage.setItem('buttonStates', JSON.stringify(currentStates));
      }, 15000);
    } catch (error) {
      console.error('Error handling task start:', error);
      setButtonStates(prev => {
        const newStates = { ...prev };
        delete newStates[taskIndex];
        return newStates;
      });
    }
  };

  const handleClaim = async (taskIndex: number) => {
    const telegramUserId = localStorage.getItem('telegramUserId');
    if (!telegramUserId) return;

    setButtonStates(prev => ({
      ...prev,
      [taskIndex]: { 
        ...(prev[taskIndex] || {}), 
        claimLoading: true 
      }
    }));

    try {
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      const userDocRef = doc(db, 'users', telegramUserId);
      await updateDoc(userDocRef, {
        [`tasks.${taskIndex}.disabled`]: true
      });

      const newTaskStatus = [...taskStatus];
      if (newTaskStatus[taskIndex]) {
        newTaskStatus[taskIndex] = { ...newTaskStatus[taskIndex], disabled: true };
        setTaskStatus(newTaskStatus);
      }

      setButtonStates(prev => {
        const newStates = { ...prev };
        delete newStates[taskIndex];
        return newStates;
      });

      const currentStates = JSON.parse(localStorage.getItem('buttonStates') || '{}');
      delete currentStates[taskIndex];
      localStorage.setItem('buttonStates', JSON.stringify(currentStates));
    } catch (error) {
      console.error('Error handling claim:', error);
      setButtonStates(prev => {
        const newStates = { ...prev };
        delete newStates[taskIndex];
        return newStates;
      });
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        margin: '0 auto',
      }}
    >
      <Box
        component="img"
        src="/tasks.png"
        alt="Deal Icon"
        sx={{
          mt: 4,
          width: '80px',
          maxWidth: '50%',
        }}
      />
      <Typography variant="h5" sx={{ marginTop: 4, color: 'black', fontWeight: 'bold' }}>
        Tasks
      </Typography>
      <Typography variant="body1" sx={{ marginTop: 1, color: 'text.secondary' }}>
        Get rewards for completing tasks.
      </Typography>

      <CategoryTabs
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <Box sx={{ width: '100%', mt: 4 }}>
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          categories
            .find((category) => category.id === selectedCategory)
            ?.tasks.map((taskIndex) => (
              <Box
                key={taskIndex}
                sx={{
                  backgroundColor: 'white',
                  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                  borderRadius: 2,
                  padding: 2,
                  margin: '8px auto',
                  textAlign: 'left',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'black' }}>
                    {tasks[taskIndex].title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {tasks[taskIndex].description}
                  </Typography>
                </Box>
                {taskStatus[taskIndex] && (
                  <TaskButton
                    task={taskStatus[taskIndex]}
                    buttonState={buttonStates[taskIndex]}
                    onStart={() => handleTaskStart(taskIndex)}
                    onClaim={() => handleClaim(taskIndex)}
                    
                  />
                )}
              </Box>
            ))
        )}
      </Box>
    </Box>
  );
}