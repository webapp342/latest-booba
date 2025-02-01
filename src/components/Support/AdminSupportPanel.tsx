import React, { useEffect, useState } from 'react';
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

} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { SupportChat, SupportMessage } from '../../types/support';
import { sendSupportMessage, getAllChats } from '../../services/supportService';

interface AdminSupportPanelProps {
  open: boolean;
  onClose: () => void;
  adminId: string;
}

export const AdminSupportPanel: React.FC<AdminSupportPanelProps> = ({
  open,
  onClose,
  adminId
}) => {
  const [chats, setChats] = useState<SupportChat[]>([]);
  const [selectedChat, setSelectedChat] = useState<SupportChat | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' as 'error' | 'success' });

  useEffect(() => {
    if (open) {
      const unsubscribe = getAllChats((newChats) => {
        setChats(newChats);
        if (selectedChat) {
          const updatedSelectedChat = newChats.find(
            chat => chat.userId === selectedChat.userId
          );
          if (updatedSelectedChat) {
            setSelectedChat(updatedSelectedChat);
          }
        }
      });

      return () => unsubscribe();
    }
  }, [open, selectedChat]);

  const handleSendMessage = async () => {
    if (!selectedChat || !newMessage.trim()) return;

    const success = await sendSupportMessage(
      newMessage,
      adminId,
      'Support Team'
    );

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
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography component="span" variant="h6">Support Admin Panel</Typography>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{ color: (theme) => theme.palette.grey[500] }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', height: '600px' }}>
            {/* Chat List */}
            <Box sx={{ width: 250, borderRight: 1, borderColor: 'divider', pr: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
                Active Chats
              </Typography>
              <Stack spacing={1}>
                {chats.map((chat) => (
                  <Box
                    key={chat.userId}
                    sx={{
                      p: 1,
                      bgcolor: selectedChat?.userId === chat.userId ? 'primary.light' : 'grey.100',
                      borderRadius: 1,
                      cursor: 'pointer',
                      position: 'relative'
                    }}
                    onClick={() => setSelectedChat(chat)}
                  >
                    <Typography variant="subtitle2" fontWeight="bold">
                      {chat.userName}
                    </Typography>
                    <Typography variant="body2" noWrap>
                      {chat.lastMessage}
                    </Typography>
                    {chat.unreadCount > 0 && (
                      <Box
                        sx={{
                          position: 'absolute',
                          right: 8,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          bgcolor: 'error.main',
                          color: 'white',
                          borderRadius: '50%',
                          width: 20,
                          height: 20,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 12
                        }}
                      >
                        {chat.unreadCount}
                      </Box>
                    )}
                  </Box>
                ))}
              </Stack>
            </Box>

            {/* Chat Messages */}
            <Box sx={{ flex: 1, pl: 2 }}>
              {selectedChat ? (
                <Stack spacing={2} sx={{ height: '100%' }}>
                  <Box
                    sx={{
                      flex: 1,
                      overflowY: 'auto',
                      bgcolor: 'grey.100',
                      borderRadius: 1,
                      p: 2
                    }}
                  >
                    {selectedChat.messages.map((message: SupportMessage) => (
                      <Box
                        key={message.id}
                        sx={{
                          display: 'flex',
                          justifyContent: message.isAdmin ? 'flex-end' : 'flex-start',
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
                            {message.isAdmin ? 'You' : message.userName}
                          </Typography>
                          <Typography>{message.message}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {message.timestamp.toLocaleString()}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                  <Stack direction="row" spacing={1}>
                    <TextField
                      fullWidth
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your response..."
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
              ) : (
                <Box
                  sx={{
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'grey.100',
                    borderRadius: 1
                  }}
                >
                  <Typography color="text.secondary">
                    Select a chat to start messaging
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
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