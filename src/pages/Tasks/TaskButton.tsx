import { Box, Button, CircularProgress, Snackbar } from '@mui/material';
import { Task, ButtonState } from './task';
import { useState } from 'react';

interface TaskButtonProps {
  task: Task;
  buttonState?: ButtonState;
  onStart: () => void;
  onClaim: () => Promise<void>; // Ensure onClaim is a promise
}

export function TaskButton({ task, buttonState, onStart, onClaim }: TaskButtonProps) {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isClaimed, setIsClaimed] = useState(false); // State to track if claimed

  const handleClaim = async () => {
    await onClaim(); // Assuming onClaim is an async function
    setIsClaimed(true); // Set claimed state to true
    setSnackbarOpen(true); // Show Snackbar after claiming
  };

  // If the task is completed and disabled, show "Done" button
  if (task.completed && task.disabled) {
    return (
      <>
        <Button
          variant="outlined"
          size="small"
          disabled
          sx={{
            textTransform: 'none',
            backgroundColor: 'transparent',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
            borderRadius: 2,
          }}
        >
          Done
        </Button>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          message="Claim completed!"
        />
      </>
    );
  }

  // Loading state check
  if (buttonState?.loading || buttonState?.claimLoading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  // If the task is completed but not disabled, show "Claim" button or "Done" button if claimed
  if (task.completed && !task.disabled) {
    return (
      <>
        {isClaimed ? ( // Check if claimed
          <Button
            variant="outlined"
            size="small"
            disabled
            sx={{
              textTransform: 'none',
              backgroundColor: 'transparent',
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
              borderRadius: 2,
            }}
          >
            Done
          </Button>
        ) : (
          <Button
            variant="outlined"
            size="small"
            onClick={handleClaim} // Use the new handleClaim function
            sx={{
              textTransform: 'none',
              backgroundColor: 'transparent',
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
              borderRadius: 2,
            }}
          >
            Claim
          </Button>
        )}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          message="Claim completed!"
        />
      </>
    );
  }

  // If the task has not started, show "Start" button
  return (
    <Button
      variant="outlined"
      size="small"
      onClick={onStart}
      sx={{
        textTransform: 'none',
        backgroundColor: 'transparent',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
        borderRadius: 2,
      }}
    >
      Start
    </Button>
  );
}