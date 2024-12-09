import React from 'react';
import { Snackbar, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface SnackbarComponentProps {
  snackbarOpen: boolean;
  setSnackbarOpen: (open: boolean) => void;
}

const SnackbarComponent: React.FC<SnackbarComponentProps> = ({ snackbarOpen, setSnackbarOpen }) => (
  <Snackbar
    open={snackbarOpen}
    autoHideDuration={3000}
    onClose={() => setSnackbarOpen(false)}
    message="Copied to clipboard"
    action={
      <IconButton size="small" onClick={() => setSnackbarOpen(false)}>
        <CloseIcon />
      </IconButton>
    }
  />
);

export default SnackbarComponent;
