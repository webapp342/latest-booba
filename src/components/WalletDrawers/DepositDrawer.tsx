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
import { CheckCircleOutline } from '@mui/icons-material';
import QRCode from 'qrcode';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { app } from '../../pages/firebaseConfig';

const db = getFirestore(app);

const StyledDrawer = styled(Drawer)(({ }) => ({
  '& .MuiDrawer-paper': {
    background: 'linear-gradient(180deg, rgba(26, 33, 38, 0.99) 0%, rgba(26, 33, 38, 0.95) 100%)',
    borderRadius: '24px 24px 0 0',
    padding: '24px',
    height: '80vh',
    border: '1px solid rgba(110, 211, 255, 0.1)',
  }
}));

const DrawerHeader = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '24px',
  textAlign: 'center',

});

const QRContainer = styled(Box)({
  backgroundColor: 'white',
  borderRadius: '16px',
  padding: '5px',
  width: '75%',
  margin: '24px auto',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const InfoBox = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '12px 16px',
  marginBottom: '12px',
  backgroundColor: 'rgba(110, 211, 255, 0.05)',
  borderRadius: '12px',
  border: '1px solid rgba(110, 211, 255, 0.1)',
});

interface DepositDrawerProps {
  open: boolean;
  onClose: () => void;
}

const DepositDrawer: React.FC<DepositDrawerProps> = ({ open, onClose }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [comment, setComment] = useState('Loading...');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

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
          const qrCode = await QRCode.toDataURL(uri);
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
        <DrawerHeader>
           <Button
            onClick={onClose}
            sx={{
              color: 'rgba(255, 255, 255, 0.5)',
              
            }}
          >
                           ✖

          </Button>
            <Typography variant="h6" sx={{  opacity: 0.7 }}>

            Deposit TON
          </Typography>
         
        </DrawerHeader>

        <QRContainer>
          {qrCodeUrl ? (
            <img src={qrCodeUrl} alt="QR Code" style={{ width: '100%', height: 'auto' }} />
          ) : (
            <Typography>Loading QR Code...</Typography>
          )}
        </QRContainer>

        <InfoBox>
          <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>
            Address: <span style={{ color: '#fff', fontWeight: 500 }}>UQDppAs...BNn2</span>
          </Typography>
          <Button
            onClick={() => handleCopy('UQDppAsjyioMu23LIEaFBm5g5o5oNjRft99oe4gfv-c9BNn2')}
            sx={{ color: '#6ed3ff' }}
          >
            Copy
          </Button>
        </InfoBox>

        <InfoBox>
          <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>
            Comment: <span style={{ color: '#fff', fontWeight: 500 }}>{comment}</span>
          </Typography>
          <Button
            onClick={() => handleCopy(comment)}
            sx={{ color: '#6ed3ff' }}
          >
            Copy
          </Button>
        </InfoBox>

        <Typography
          sx={{
            color: 'rgba(255, 255, 255, 0.5)',
            textAlign: 'center',
            fontSize: '0.875rem',
            mt: 2
          }}
        >
          Please carefully send your $TON to these exact addresses
        </Typography>
      </StyledDrawer>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <SnackbarContent
          sx={{
            backgroundColor: '#4caf50',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            padding: '12px 24px',
          }}
          message={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircleOutline />
              <Typography>Copied to clipboard!</Typography>
            </Box>
          }
        />
      </Snackbar>
    </>
  );
};

export default DepositDrawer; 