import React, { useEffect, useState, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Stack,
  TextField,
  Button,
  Box,
  Typography,
  Snackbar,
  Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { SupportMessage } from '../../types/support';
import { sendSupportMessage, getUserMessages, markMessageAsRead } from '../../services/supportService';

interface SupportModalProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
}

export const SupportModal: React.FC<SupportModalProps> = ({
  open,
  onClose,
  userId,
  userName
}) => {
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' as 'error' | 'success' });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      const unsubscribe = getUserMessages(userId, (newMessages) => {
        setMessages(newMessages.sort((a, b) => 
          a.timestamp.getTime() - b.timestamp.getTime()
        ));
        
        // Mark unread messages as read
        newMessages.forEach(msg => {
          if (!msg.isRead && msg.isAdmin) {
            markMessageAsRead(msg.id);
          }
        });
      });

      return () => unsubscribe();
    }
  }, [open, userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const success = await sendSupportMessage(newMessage, userId, userName);
    if (success) {
      setNewMessage('');
    } else {
      setSnackbar({
        open: true,
        message: 'Error sending message',
        severity: 'error'
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography component="span" variant="h6">Technical Support</Typography>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{ color: (theme) => theme.palette.grey[500] }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ height: '400px' }}>
            <Box
              flex={1}
              sx={{
                overflowY: 'auto',
                bgcolor: 'grey.100',
                borderRadius: 1,
                p: 2
              }}
            >
              {messages.map((message) => (
                <Box
                  key={message.id}
                  sx={{
                    display: 'flex',
                    justifyContent: message.isAdmin ? 'flex-start' : 'flex-end',
                    mb: 1
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: '80%',
                      bgcolor: message.isAdmin ? 'primary.light' : 'success.light',
                      p: 1,
                      borderRadius: 1
                    }}
                  >
                    <Typography variant="subtitle2" fontWeight="bold">
                      {message.isAdmin ? 'Support Team' : 'You'}
                    </Typography>
                    <Typography>{message.message}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {message.timestamp.toLocaleTimeString()}
                    </Typography>
                  </Box>
                </Box>
              ))}
              <div ref={messagesEndRef} />
            </Box>
            <Stack direction="row" spacing={1}>
              <TextField
                fullWidth
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                onKeyPress={handleKeyPress}
                size="small"
              />
              <Button
                variant="contained"
                onClick={handleSendMessage}
                sx={{ minWidth: '100px' }}
              >
                Send
              </Button>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}; 