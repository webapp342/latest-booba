import React, { useEffect, useState, useRef } from 'react';
import {
  Dialog,
  IconButton,
  Stack,
  TextField,
  Button,
  Box,
  Typography,
  Snackbar,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Badge,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { SupportChat } from '../../types/support';
import { sendSupportMessage, getAllChats } from '../../services/supportService';
import { Timestamp } from 'firebase/firestore';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import VideocamIcon from '@mui/icons-material/Videocam';
import CallIcon from '@mui/icons-material/Call';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import MicIcon from '@mui/icons-material/Mic';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { isSameDay } from 'date-fns';

interface AdminSupportPanelProps {
  open: boolean;
  onClose: () => void;
  adminId: string;
}

const convertToDate = (timestamp: Date | Timestamp): Date => {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate();
  }
  return timestamp;
};

const formatTimestamp = (timestamp: Date | Timestamp) => {
  const date = convertToDate(timestamp);
  const today = new Date();
  
  if (today.toDateString() === date.toDateString()) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  return date.toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatDateHeader = (timestamp: Date | Timestamp) => {
  const date = convertToDate(timestamp);
  const today = new Date();
  
  if (today.toDateString() === date.toDateString()) {
    return 'Today';
  }
  
  return date.toLocaleDateString([], {
    month: 'short',
    day: 'numeric'
  });
};

const formatMessageTime = (timestamp: Date | Timestamp) => {
  const date = convertToDate(timestamp);
  const today = new Date();
  
  if (today.toDateString() === date.toDateString()) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  return date.toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const AdminSupportPanel: React.FC<AdminSupportPanelProps> = ({
  open,
  onClose,
  adminId
}) => {
  const [chats, setChats] = useState<SupportChat[]>([]);
  const [selectedChat, setSelectedChat] = useState<SupportChat | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' as 'error' | 'success' });
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedChat?.messages]);

  const handleSendMessage = async () => {
    if (!selectedChat || !newMessage.trim()) return;

    try {
      const success = await sendSupportMessage(
        newMessage,
        adminId,
        selectedChat.userId
      );

      if (success) {
        setNewMessage('');
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
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      fullScreen
    >
      <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ 
          borderBottom: 1, 
          borderColor: 'divider',
          bgcolor: 'primary.dark',
          color: 'white',
          px: 2,
          py: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Typography variant="h6">Support Admin Panel</Typography>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{ color: 'white' }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Main Content */}
        <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* Chat List */}
          <Box sx={{ 
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            bgcolor: '#f6f6f6'
          }}>
            {/* Chat List Header */}
            <Box sx={{ 
              p: 2, 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid #e0e0e0'
            }}>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>Chats</Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button 
                  sx={{ 
                    color: '#007AFF',
                    textTransform: 'none',
                    fontSize: '16px'
                  }}
                >
                  Broadcast Lists
                </Button>
                <Button 
                  sx={{ 
                    color: '#007AFF',
                    textTransform: 'none',
                    fontSize: '16px'
                  }}
                >
                  New Group
                </Button>
              </Box>
            </Box>

            {/* Chat List */}
            <List sx={{ 
              flex: 1, 
              overflow: 'auto', 
              px: 0,
              '& .MuiListItem-root': {
                px: 2,
                py: 1.5,
                bgcolor: 'white',
                '&:hover': {
                  bgcolor: 'rgba(0, 0, 0, 0.04)'
                }
              }
            }}>
              {chats.map((chat) => (
                <React.Fragment key={chat.userId}>
                  <ListItem
                    button
                    selected={selectedChat?.userId === chat.userId}
                    onClick={() => setSelectedChat(chat)}
                    sx={{
                      '&.Mui-selected': {
                        bgcolor: 'rgba(0, 0, 0, 0.08)',
                      }
                    }}
                  >
                    <ListItemAvatar>
                      <Badge
                        badgeContent={chat.unreadCount > 0 ? chat.unreadCount : null}
                        color="primary"
                        sx={{
                          '& .MuiBadge-badge': {
                            bgcolor: '#007AFF',
                            color: 'white',
                            right: 5,
                            top: 5,
                            minWidth: '20px',
                            height: '20px',
                            borderRadius: '10px'
                          }
                        }}
                      >
                        <Avatar 
                          sx={{ 
                            width: 50, 
                            height: 50,
                            borderRadius: '50%'
                          }}
                        >
                          <AccountCircleIcon sx={{ width: 50, height: 50 }} />
                        </Avatar>
                      </Badge>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          mb: 0.5
                        }}>
                          <Typography 
                            sx={{ 
                              fontWeight: chat.unreadCount > 0 ? 600 : 400,
                              fontSize: '17px'
                            }}
                          >
                            {chat.userName}
                          </Typography>
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              color: chat.unreadCount > 0 ? '#007AFF' : '#8e8e93',
                              fontSize: '13px'
                            }}
                          >
                            {formatTimestamp(chat.lastMessageTimestamp)}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Typography
                          variant="body2"
                          sx={{ 
                            color: chat.unreadCount > 0 ? 'text.primary' : '#8e8e93',
                            fontWeight: chat.unreadCount > 0 ? 500 : 400,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            fontSize: '15px'
                          }}
                        >
                          {chat.lastMessage}
                        </Typography>
                      }
                    />
                  </ListItem>
                </React.Fragment>
              ))}
            </List>

            {/* Bottom Navigation */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-around',
              py: 1,
              borderTop: '1px solid #e0e0e0',
              bgcolor: 'white'
            }}>
              <Button 
                sx={{ 
                  color: '#8e8e93',
                  textTransform: 'none',
                  fontSize: '14px'
                }}
              >
                Archive
              </Button>
              <Button 
                sx={{ 
                  color: '#8e8e93',
                  textTransform: 'none',
                  fontSize: '14px'
                }}
              >
                Read All
              </Button>
              <Button 
                sx={{ 
                  color: '#8e8e93',
                  textTransform: 'none',
                  fontSize: '14px'
                }}
              >
                Delete
              </Button>
            </Box>
          </Box>

          {/* Chat Messages */}
          <Box sx={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column',
            bgcolor: '#efeae2',
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 50C50 50 50 50 50 50' stroke='%23e5e5e5' stroke-width='0.5'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat'
          }}>
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <Box sx={{ 
                  px: 2,
                  py: 1.5,
                  bgcolor: '#f6f6f6',
                  borderBottom: '1px solid #e0e0e0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  position: 'relative'
                }}>
                  <IconButton 
                    sx={{ color: '#007AFF' }}
                    onClick={() => setSelectedChat(null)}
                  >
                    <ArrowBackIosNewIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                  <Avatar sx={{ width: 35, height: 35 }}>
                    <AccountCircleIcon />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ 
                      fontSize: '17px',
                      fontWeight: 600,
                      color: '#000'
                    }}>
                      {selectedChat.userName}
                    </Typography>
                    <Typography sx={{ 
                      fontSize: '13px',
                      color: '#8e8e93'
                    }}>
                      tap here for contact info
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={2}>
                    <IconButton sx={{ color: '#007AFF' }}>
                      <VideocamIcon />
                    </IconButton>
                    <IconButton sx={{ color: '#007AFF' }}>
                      <CallIcon />
                    </IconButton>
                  </Stack>
                </Box>

                {/* Messages */}
                <Box sx={{ 
                  flex: 1, 
                  overflowY: 'auto', 
                  px: 2,
                  py: 1,
                  display: 'flex',
                  flexDirection: 'column-reverse'
                }}>
                  <div ref={messagesEndRef} />
                  {selectedChat.messages.slice().reverse().map((message, index, array) => {
                    const showDate = index === array.length - 1 || 
                      !isSameDay(convertToDate(message.timestamp), convertToDate(array[index + 1].timestamp));
                    
                    return (
                      <React.Fragment key={message.id}>
                        {showDate && (
                          <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            my: 2
                          }}>
                            <Typography sx={{
                              bgcolor: '#e1f2fb',
                              color: '#8e8e93',
                              px: 2,
                              py: 0.5,
                              borderRadius: 4,
                              fontSize: '13px'
                            }}>
                              {formatDateHeader(message.timestamp)}
                            </Typography>
                          </Box>
                        )}
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: message.isAdmin ? 'flex-end' : 'flex-start',
                            mb: 0.3
                          }}
                        >
                          <Box
                            sx={{
                              maxWidth: '70%',
                              bgcolor: message.isAdmin ? '#e1ffc7' : 'white',
                              px: 2,
                              py: 1.5,
                              borderRadius: 2,
                              position: 'relative',
                              '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                [message.isAdmin ? 'right' : 'left']: -8,
                                borderStyle: 'solid',
                                borderWidth: '0 8px 8px 0',
                                borderColor: `transparent ${message.isAdmin ? '#e1ffc7' : 'white'} transparent transparent`,
                                transform: message.isAdmin ? 'rotate(-45deg)' : 'rotate(135deg)'
                              }
                            }}
                          >
                            <Typography sx={{ 
                              fontSize: '16px',
                              color: '#000',
                              lineHeight: 1.4,
                              whiteSpace: 'pre-wrap'
                            }}>
                              {message.message}
                            </Typography>
                            <Typography 
                              sx={{ 
                                fontSize: '11px',
                                color: '#8e8e93',
                                mt: 0.5,
                                textAlign: 'right',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-end',
                                gap: 0.5
                              }}
                            >
                              {formatMessageTime(message.timestamp)}
                              {message.isAdmin && (
                                <DoneAllIcon sx={{ fontSize: 14, color: '#53bdeb' }} />
                              )}
                            </Typography>
                          </Box>
                        </Box>
                      </React.Fragment>
                    );
                  })}
                </Box>

                {/* Message Input */}
                <Box sx={{ 
                  p: 1.5, 
                  bgcolor: '#f6f6f6', 
                  borderTop: '1px solid #e0e0e0',
                  display: 'flex',
                  alignItems: 'flex-end',
                  gap: 1
                }}>
                  <IconButton sx={{ color: '#007AFF' }}>
                    <AddCircleIcon />
                  </IconButton>
                  <TextField
                    fullWidth
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Message"
                    onKeyPress={handleKeyPress}
                    multiline
                    maxRows={4}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        bgcolor: 'white',
                        borderRadius: 4,
                        '& fieldset': {
                          border: 'none'
                        },
                        '&:hover fieldset': {
                          border: 'none'
                        },
                        '&.Mui-focused fieldset': {
                          border: 'none'
                        }
                      },
                      '& .MuiOutlinedInput-input': {
                        p: 1.5,
                        fontSize: '16px'
                      }
                    }}
                  />
                  <IconButton sx={{ color: '#007AFF' }}>
                    <CameraAltIcon />
                  </IconButton>
                  <IconButton sx={{ color: '#007AFF' }}>
                    <MicIcon />
                  </IconButton>
                </Box>
              </>
            ) : (
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'white'
                }}
              >
                <Typography color="text.secondary">
                  Select a chat to start messaging
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Dialog>
  );
}; 