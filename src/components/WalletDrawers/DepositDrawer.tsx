import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Drawer,
  Snackbar,
  SnackbarContent,
  styled,
} from '@mui/material';
import { CheckCircleOutline, ContentCopy } from '@mui/icons-material';
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
    height: 'auto',
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

const QRContainer = styled(Box)({
  borderRadius: '16px',
  padding: '20px',
  width: '100%',
  maxWidth: '280px',
  margin: '8px auto',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
  '@media (max-width: 600px)': {
    padding: '16px',
    maxWidth: '240px',
  }
});



interface DepositDrawerProps {
  open: boolean;
  onClose: () => void;
}

const DepositDrawer: React.FC<DepositDrawerProps> = ({ open, onClose }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [comment, setComment] = useState('Loading...');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

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

  const handleTelegramShare = () => {
    if (shareUrl) {
      const telegramUrl = `tg://msg_url?url=${encodeURIComponent(shareUrl)}`;
      window.location.href = telegramUrl;
    }
  };

  return (
    <>
      <StyledDrawer
        anchor="bottom"
        open={open}
        onClose={onClose}
      >
        <Box sx={{ position: 'relative', height: '100%' }}>
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={2000}
            onClose={() => setSnackbarOpen(false)}
            sx={{
              position: 'absolute',
              top: '-90%',
              right: '16px',
              transform: 'none',
              width: 'auto',
              '& .MuiSnackbarContent-root': {
                minWidth: 'unset',
                backgroundColor: '#4caf50',
                borderRadius: '12px',
                padding: '12px 24px',
              }
            }}
          >
            <SnackbarContent
              sx={{
                backgroundColor: '#4caf50 !important',
                display: 'flex',
                alignItems: 'center',
              }}
              message={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleOutline />
                  <Typography>Kopyalandı!</Typography>
                </Box>
              }
            />
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
              Ton Adresi
            </Typography>
            <Box sx={{ width: 40 }} />
          </DrawerHeader>

          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            gap: { xs: 2, sm: 3 },
            width: '100%',
            maxWidth: '600px',
        
          }}>
            <QRContainer>
              {qrCodeUrl && (
                <>
                  <img 
                    src={qrCodeUrl} 
                    alt="QR Code" 
                    style={{ 
                      width: '100%', 
                      height: 'auto',
                      display: 'block'
                    }} 
                  />
                 
                </>
              )}
            </QRContainer>

            <Box sx={{ width: '100%' }}>
              <Box sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '12px 16px',
                width: '90%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <Typography sx={{ 
                  color: '#fff', 
                  fontSize: '0.9rem',
                  flex: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  UQCHHbMAASLfzfSaMhuNcN_CYV4V-9gek7djHixvW5gBfVhJ
                </Typography>
                <Button
                  onClick={() => handleCopy('UQCHHbMAASLfzfSaMhuNcN_CYV4V-9gek7djHixvW5gBfVhJ')}
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.7)',
                    minWidth: 'auto',
                    padding: '8px',
                    '&:hover': {
                      color: '#fff',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  <ContentCopy sx={{ fontSize: 20 }} />
                </Button>
              </Box>
            </Box>

            <Box sx={{ width: '100%' }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '4px',
                mb: 1
              }}>
                <Typography sx={{ 
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '0.85rem'
                }}>
                  Transfer Notu
                </Typography>
                <Box component="span" sx={{ 
                  color: '#FF5F5F',
                  fontSize: '0.85rem',
                  lineHeight: 1,
                  mb: '2px'
                }}>
                  *
                </Box>
              </Box>

              <Box sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '12px 16px',
                width: '90%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <Typography sx={{ 
                  color: '#fff', 
                  fontSize: '0.9rem',
                  flex: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {comment}
                </Typography>
                <Button
                  onClick={() => handleCopy(comment)}
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.7)',
                    minWidth: 'auto',
                    padding: '8px',
                    '&:hover': {
                      color: '#fff',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  <ContentCopy sx={{ fontSize: 20 }} />
                </Button>
              </Box>
            </Box>

            <Typography
              sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                textAlign: 'center',
                fontSize: '0.875rem',
                width: '100%'
              }}
            >
              Bu adres yalnızca TON varlıklarını almak için kullanılabilir.
            </Typography>

            <Button
              fullWidth
              onClick={handleTelegramShare}
              sx={{
                backgroundColor: '#2AABEE',
                color: '#fff',
                borderRadius: '12px',
                padding: '14px',
                marginTop: '16px',
                width: '100%',
                fontSize: '0.95rem',
                fontWeight: 500,
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: '#229ED9'
                }
              }}
            >
              Telegram Kişisiyle Paylaş
            </Button>
          </Box>
        </Box>
      </StyledDrawer>
    </>
  );
};

export default DepositDrawer; 