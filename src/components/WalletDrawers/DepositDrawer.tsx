import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Drawer,
  Snackbar,
  styled,
  Slide,
  Alert,
} from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import QRCode from 'qrcode';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { app } from '../../pages/firebaseConfig';

const db = getFirestore(app);

const StyledDrawer = styled(Drawer)(({  }) => ({
  '& .MuiDrawer-paper': {
    background: 'linear-gradient(180deg, rgba(26, 33, 38, 0.99) 0%, rgba(26, 33, 38, 0.95) 100%)',
    borderRadius: '24px 24px 0 0',
    padding: '20px 16px',
    maxHeight: '90vh',
    minHeight: '60vh',
    border: '1px solid rgba(110, 211, 255, 0.1)',
    '@media (max-width: 600px)': {
      padding: '16px 12px',
      borderRadius: '16px 16px 0 0',
    }
  }
}));

const DrawerHeader = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '24px',
  position: 'relative',
});





interface DepositDrawerProps {
  open: boolean;
  onClose: () => void;
}

const DepositDrawer: React.FC<DepositDrawerProps> = ({ open, onClose }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [comment, setComment] = useState('Loading...');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [, setShareUrl] = useState('');

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        const telegramUserId = localStorage.getItem('telegramUserId');
        if (!telegramUserId) {
          console.error('Telegram User ID not found!');
          setComment('Error: User ID not found');
          return;
        }

        const docRef = doc(db, 'users', telegramUserId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const fetchedComment = docSnap.data().comment || 'No comment available';
          setComment(fetchedComment);
          const address = 'UQDppAsjyioMu23LIEaFBm5g5o5oNjRft99oe4gfv-c9BNn2';
          const encodedComment = encodeURIComponent(fetchedComment);
          const uri = `https://app.tonkeeper.com/transfer/${address}?text=${encodedComment}`;
          setShareUrl(uri);
          const qrCode = await QRCode.toDataURL(uri, {
            color: {
              dark: '#ffffff',
              light: '#00000000'
            },
            width: 240,
            margin: 1
          });
          setQrCodeUrl(qrCode);
        }
      } catch (error) {
        console.error('Error generating QR code:', error);
        setComment('Error fetching comment');
      }
    };

    if (open) {
      generateQRCode();
    }
  }, [open]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setSnackbarOpen(true);
  };


  return (
    <>
      <StyledDrawer
        anchor="bottom"
        open={open}
        onClose={onClose}
      >
        <Box // @ts-ignore
         sx={{  height: '100%' }}>
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={2000}
            onClose={() => setSnackbarOpen(false)}
            TransitionComponent={Slide}
            sx={{
              '& .MuiSnackbar-root': {
                width:'100%'
              }
            }}
          >
            <Alert
              severity="success"
              variant="filled"
              onClose={() => setSnackbarOpen(false)}
              icon={<CheckCircle />}
              sx={{
                backgroundColor: 'rgba(26, 33, 38, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(110, 211, 255, 0.1)',
                color: '#fff',
                borderRadius: '16px',
                padding: '16px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                display: 'flex',
                width:'100%',
                alignItems: 'center',
                gap: 1.5,
                '& .MuiAlert-icon': {
                  color: '#6ed3ff',
                  opacity: 1,
                  padding: 0,
                  marginRight: 1
                },
                '& .MuiAlert-message': {
                  padding: 0,
                  fontSize: '0.95rem',
                  fontWeight: 500
                },
                '& .MuiAlert-action': {
                  padding: 0,
                  alignItems: 'center'
                }
              }}
            >
              Copied !
            </Alert>
          </Snackbar>
          <DrawerHeader>
            <Button
              onClick={onClose}
              sx={{
                color: 'rgba(255, 255, 255, 0.5)',
                '&:hover': { color: '#fff' },
                minWidth: '40px',
                padding: '8px',
                '@media (max-width: 600px)': {
                  padding: '6px',
                }
              }}
            >
              <CloseIcon fontSize="medium" />
            </Button>
            <Typography 
              variant="h6" 
              sx={{ 
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
                color: '#fff',
                textAlign: 'center',
                whiteSpace: 'nowrap',
                fontSize: {
                  xs: '1.25rem',
                  sm: '1.5rem'
                },
                fontWeight: 500
              }}
            >
               Deposit
            </Typography>
            <Box sx={{ width: 40 }} />
          </DrawerHeader>

          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            width: '100%',
            color: '#fff',
            position: 'relative',
            minHeight: '70vh',
          }}>
   

            <Box 
            //@ts-ignore
            sx={{
              width: '90%',
              mb: 3,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              {qrCodeUrl && (
                <Box sx={{
                  width: '100%',
                  maxWidth: '280px',
                  maxHeight: '220px',
                  aspectRatio: '1',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  p: 0,
                  borderRadius: '12px',
                }}>
                  <img 
                    src={qrCodeUrl} 
                    alt="QR Code" 
                    style={{ 
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain'
                    }} 
                  />
                </Box>
              )}
            </Box>

            <Typography sx={{ 
              fontSize: '0.85rem',
              color: 'rgba(255, 255, 255, 0.7)',
              mb: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              width: '90%'
            }}>
              <Box //@ts-ignore
              sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: '#6ed3ff'
              }} />
              Deposit Address
            </Typography>
            <Box sx={{
              width: '90%',
              mb: 1,
              p: 2,
              backgroundColor: 'rgba(110, 211, 255, 0.05)',
              borderRadius: '12px',
              border: '1px solid rgba(110, 211, 255, 0.1)',
            }}>
              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 2
              }}>
                <Typography sx={{ 
                  color: '#fff', 
                  fontSize: '0.85rem',
                  flex: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  fontFamily: 'monospace'
                }}>
                  UQDppAsjyioMu23LIEaFBm5g5o5oNjRft99oe4gfv-c9BNn2
                </Typography>
                <Button
                  onClick={() => handleCopy('UQDppAsjyioMu23LIEaFBm5g5o5oNjRft99oe4gfv-c9BNn2')}
                  sx={{ 
                    color: '#6ed3ff',
                    fontSize: '0.75rem',
                    padding: '4px 12px',
                    minWidth: 'unset',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(110, 211, 255, 0.1)',
                    border: '1px solid rgba(110, 211, 255, 0.2)',
                    
                  }}
                >
                  Copy
                </Button>
              </Box>
            </Box>

            <Typography sx={{ 
              fontSize: '0.85rem',
              color: 'rgba(255, 255, 255, 0.7)',
              mb: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              width: '90%'
            }}>
              <Box sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: '#6ed3ff'
              }} />
              Comment (Important)
            </Typography>
            <Box sx={{
              width: '90%',
              mb: 1,
              p: 2,
              backgroundColor: 'rgba(110, 211, 255, 0.05)',
              borderRadius: '12px',
              border: '1px solid rgba(110, 211, 255, 0.1)',
            }}>
              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 2
              }}>
                <Typography sx={{ 
                  color: '#fff', 
                  fontSize: '0.85rem',
                  flex: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  fontFamily: 'monospace'
                }}>
                  {comment}
                </Typography>
                <Button
                  onClick={() => handleCopy(comment)}
                  sx={{ 
                    color: '#6ed3ff',
                    fontSize: '0.75rem',
                    padding: '4px 12px',
                    minWidth: 'unset',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(110, 211, 255, 0.1)',
                    border: '1px solid rgba(110, 211, 255, 0.2)',
                    '&:hover': {
                      backgroundColor: 'rgba(110, 211, 255, 0.15)',
                    }
                  }}
                >
                  Copy
                </Button>
              </Box>
            </Box>
          <Typography sx={{ 
                fontSize: '0.8rem',
                color: 'rgba(255, 255, 255, 0.5)',
              }}>
                • Only send TON to this deposit address
              </Typography>
            <Box sx={{
              width: '90%',
              mt: 2,
              p: 2,
              mb:4,
              backgroundColor: 'rgba(255, 193, 7, 0.1)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 193, 7, 0.2)',
            }}>
              
              <Typography sx={{ 
                fontSize: '0.8rem',
                color: 'rgba(255, 193, 7, 0.9)',
                lineHeight: 1.5
              }}>
                Important: Please make sure to include the comment when depositing. Deposits without the correct comment cannot be credited to your account.
              </Typography>
            </Box>

            <Box sx={{
              width: '90%',
              mt: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 1
            }}>
          
         
            </Box>

          
          </Box>
        </Box>
      </StyledDrawer>
    </>
  );
};

export default DepositDrawer; 