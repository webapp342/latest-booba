import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Button, Snackbar, Alert, ThemeProvider, createTheme, Typography } from '@mui/material';
import { getFirestore, doc, getDoc } from 'firebase/firestore'; // Firestore metodları
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './firebaseConfig'; // Firebase yapılandırma
import { Copy, Share2, UserPlus } from 'lucide-react';
import task1Logo from '../assets/income.png';


// Firebase App başlat
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const theme = createTheme({
  typography: {
    fontFamily: "monospace",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontSize: '0.95rem',
          padding: '10px 20px',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          },
        },
      },
    },
  },
});

const TestComponent: React.FC = () => {
const [, setInvitedUsers] = useState<number[]>([]);
  const [inviteLink, setInviteLink] = useState<string>(''); // inviteLink state'i
  const [loading, setLoading] = useState(true); // Yüklenme durumu
  const [, setError] = useState<string | null>(null); // Hata mesajı için state
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar açık/kapalı durumu
  const [snackbarMessage, setSnackbarMessage] = useState(''); // Snackbar mesajı

  useEffect(() => {
    const fetchInvitedUsers = async () => {
      setLoading(true);
      setError(null); // Hata durumunu sıfırla

      try {
        // localStorage'den Telegram kullanıcı kimliğini al, bulamazsa varsayılan ID'yi kullan
        const telegramUserId = localStorage.getItem('telegramUserId') || '1421109983'; // Varsayılan ID
        if (!telegramUserId) {
          setError("Kullanıcı ID'si bulunamadı. Lütfen tekrar giriş yapın.");
          setInvitedUsers([]);
          setLoading(false);
          return;
        }

        // Firestore'dan kullanıcıya ait belgeyi getir
        const userDocRef = doc(db, 'users', telegramUserId);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          console.log('Firestore kullanıcı verisi:', userData); // Kullanıcı verisini logla
          
          // 'invitedUsers' dizisini doğru şekilde almak için boşlukları kaldırın
const invitedUsersArray = userData.invitedUsers || [];          console.log('Davet edilen kullanıcılar:', invitedUsersArray); // Davet edilen kullanıcıları logla
          
          if (Array.isArray(invitedUsersArray)) {
            setInvitedUsers(invitedUsersArray); // Davet edilen kullanıcıları ayarla
          } else {
            console.log('invitedUsers dizisi geçerli değil.'); // invitedUsers dizisinin geçerli olmadığı durumu logla
            setInvitedUsers([]); // invitedUsers dizisi geçerli değilse boş ayarla
          }

          // inviteLink değerini al
          const link = userData?.inviteLink || '';
          setInviteLink(link); // inviteLink'i state'e kaydet
        } else {
          console.log('Kullanıcı belgesi bulunamadı.'); // Kullanıcı belgesinin bulunamadığı durumu logla
          setError('Kullanıcı belgesi bulunamadı.');
          setInvitedUsers([]);
        }
      } catch (err) {
        setError('Bir hata oluştu. Lütfen tekrar deneyin.');
        console.error(err);
        setInvitedUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInvitedUsers();
  }, []);

  // Copy Link işlemi
  const handleCopyLink = () => {
    if (inviteLink) {
      navigator.clipboard.writeText(inviteLink).then(() => {
        setSnackbarMessage('Copied !');
        setSnackbarOpen(true);
      }).catch((err) => {
        setSnackbarMessage('ERROR');
        setSnackbarOpen(true);
        console.error(err);
      });
    }
  };

  // Share Link işlemi (Telegram API ile paylaşım)
  const handleShareLink = () => {
    if (inviteLink) {
      const url = `https://t.me/share/url?url=${encodeURIComponent(inviteLink)}`;
      window.open(url, '_blank');
    }
  };

  // Snackbar kapama
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          width: '100%',
          gap: 1,
        }}
      >
        {/* Header Section */}
        <Box sx={{ mb: 2 }}>
          <img src={task1Logo} alt="Task 1" width={80}  />
          <Typography variant="h6" sx={{ mt: 1, color: 'white', fontWeight: 600 }}>
            Invite Your Friends
          </Typography>
          <Typography variant="body2" sx={{ color: 'gray', mt: 0.5 }}>
            Share the link and earn rewards together
          </Typography>
        </Box>

        {/* Buttons Section */}
        <Box sx={{ 
          display: 'flex', 
          gap: 1.5, 
          mt:-2,
          width: '100%',
          maxWidth: '400px',
        }}>
          <Button 
            onClick={handleShareLink}
            disabled={loading}
            startIcon={<UserPlus size={20} />}
            sx={{ 
              flexGrow: 1,
              bgcolor: '#89d9ff',
              color: '#000',
              
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            {loading ? <CircularProgress size={24} /> : 'Invite Friends'}
          </Button>

          <Button 
            onClick={handleCopyLink}
            disabled={loading}
            sx={{ 
              border: '1px solid #89d9ff',
              color: '#89d9ff',
              minWidth: '50px',
              width: 'auto',
              '&:hover': {
                bgcolor: 'rgba(137, 217, 255, 0.1)',
              },
            }}
          >
            {loading ? <CircularProgress size={24} /> : <Copy size={20} />}
          </Button>

          <Button 
            onClick={handleShareLink}
            disabled={loading}
            sx={{ 
              border: '1px solid #89d9ff',
              color: '#89d9ff',
              minWidth: '50px',
              width: 'auto',
              '&:hover': {
                bgcolor: 'rgba(137, 217, 255, 0.1)',
              },
            }}
          >
            {loading ? <CircularProgress size={24} /> : <Share2 size={20} />}
          </Button>
        </Box>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity="success" 
            sx={{ 
              width: '100%',
              '& .MuiAlert-icon': {
                fontSize: '24px'
              }
            }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default TestComponent;
