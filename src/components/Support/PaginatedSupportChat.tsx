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
  Alert,
  CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { SupportMessage } from '../../types/support';
import { sendSupportMessage, getUserMessages, markMessageAsRead} from '../../services/supportService';

interface PaginatedSupportChatProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
}

export const PaginatedSupportChat: React.FC<PaginatedSupportChatProps> = ({
  open,
  onClose,
  userId,
  userName
}) => {
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [displayedMessages, setDisplayedMessages] = useState<SupportMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' as 'error' | 'success' });
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const messagesPerPage = 10;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('Component mounted/updated with userId:', userId);
    if (open && userId) {
      const unsubscribe = getUserMessages(userId, (newMessages) => {
        console.log('Received new messages:', newMessages);
        if (newMessages && newMessages.length > 0) {
          setMessages(newMessages);
          
          // Initially display only the last 10 messages
          const lastMessages = newMessages.slice(0, messagesPerPage);
          console.log('Setting displayed messages:', lastMessages);
          setDisplayedMessages(lastMessages);
          
          // Mark unread messages as read
          newMessages.forEach(msg => {
            if (!msg.isRead && msg.isAdmin) {
              markMessageAsRead(msg.id);
            }
          });

          // Scroll to bottom after a short delay to ensure messages are rendered
          setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        } else {
          console.log('No messages received, clearing states');
          setMessages([]);
          setDisplayedMessages([]);
        }
      });

      return () => {
        console.log('Unsubscribing from messages');
        unsubscribe();
      };
    }
  }, [open, userId, messagesPerPage]);

  const handleLoadMore = () => {
    console.log('Loading more messages, current page:', page);
    setLoading(true);
    try {
      const nextPage = page + 1;
      const newDisplayedMessages = messages.slice(0, nextPage * messagesPerPage);
      console.log('New displayed messages:', newDisplayedMessages);
      setDisplayedMessages(newDisplayedMessages);
      setPage(nextPage);
    } catch (error) {
      console.error('Error loading more messages:', error);
      setSnackbar({
        open: true,
        message: 'Error loading more messages',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    console.log('Sending message:', { userId, userName, message: newMessage });
    setLoading(true);
    try {
      const success = await sendSupportMessage(newMessage, userId, userName);
      console.log('Message send result:', success);
      if (success) {
        setNewMessage('');
        // Scroll to bottom after sending
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        setSnackbar({
          open: true,
          message: 'Error sending message',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setSnackbar({
        open: true,
        message: 'Error sending message',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const today = new Date();
    const messageDate = new Date(timestamp);
    
    if (today.toDateString() === messageDate.toDateString()) {
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    return messageDate.toLocaleString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
          <Typography component="span" variant="h6">Support Chat</Typography>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{ color: (theme) => theme.palette.grey[500] }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ height: '500px' }}>
            <Box
              flex={1}
              sx={{
                overflowY: 'auto',
                bgcolor: 'grey.50',
                borderRadius: 1,
                p: 2
              }}
            >
              {messages.length > displayedMessages.length && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                  <Button
                    variant="text"
                    onClick={handleLoadMore}
                    disabled={loading}
                    startIcon={loading && <CircularProgress size={16} />}
                  >
                    Load Older Messages
                  </Button>
                </Box>
              )}
              
              {displayedMessages.slice().reverse().map((message) => (
                <Box
                  key={message.id}
                  sx={{
                    display: 'flex',
                    justifyContent: message.senderId === userId ? 'flex-end' : 'flex-start',
                    mb: 2
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: '70%',
                      bgcolor: message.senderId === userId ? 'primary.100' : 'primary.50',
                      p: 2,
                      borderRadius: 2,
                      position: 'relative',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        width: 0,
                        height: 0,
                        borderStyle: 'solid',
                        borderWidth: '8px',
                        borderColor: `transparent ${message.senderId === userId ? '#bbdefb transparent transparent transparent' : 'transparent transparent #e3f2fd'}`,
                        transform: message.senderId === userId ? 'rotate(45deg)' : 'rotate(-45deg)',
                        top: '15px',
                        [message.senderId === userId ? 'right' : 'left']: '-8px',
                      }
                    }}
                  >
                    <Typography variant="subtitle2" fontWeight="bold" color="primary.dark">
                      {message.senderId === userId ? 'You' : 'Support Team'}
                    </Typography>
                    <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
                      {message.message}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      color="text.secondary"
                      sx={{ 
                        display: 'block',
                        textAlign: message.senderId === userId ? 'right' : 'left',
                        mt: 0.5
                      }}
                    >
                      {formatTimestamp(message.timestamp)}
                    </Typography>
                  </Box>
                </Box>
              ))}
              <div ref={messagesEndRef} />
            </Box>
            
            <Stack direction="row" spacing={1} sx={{ p: 1 }}>
              <TextField
                fullWidth
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                onKeyPress={handleKeyPress}
                size="small"
                multiline
                maxRows={4}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
              <Button
                variant="contained"
                onClick={handleSendMessage}
                sx={{ 
                  minWidth: '100px',
                  borderRadius: 2,
                  textTransform: 'none'
                }}
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