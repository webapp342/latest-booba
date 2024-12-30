import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, CircularProgress, Button, Snackbar, Alert ,ThemeProvider, createTheme } from '@mui/material';
import { getFirestore, doc, getDoc } from 'firebase/firestore'; // Firestore metodları
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './firebaseConfig'; // Firebase yapılandırma
import Tasks from '../assets/tasks.png'; // PNG dosyasını import edin
import RandomWinner from './RandomWinner'; // RandomWinner bileşenini içeri aktarıyoruz

// Firebase App başlat
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const theme = createTheme({
  typography: {
    fontFamily: "monospace",
  },
});

const DealsComponent: React.FC = () => {
const [invitedUsers, setInvitedUsers] = useState<number[]>([]);
  const [inviteLink, setInviteLink] = useState<string>(''); // inviteLink state'i
  const [loading, setLoading] = useState(true); // Yüklenme durumu
  const [error, setError] = useState<string | null>(null); // Hata mesajı için state
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
          setError('Kullanıcı ID’si bulunamadı. Lütfen tekrar giriş yapın.');
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
        setSnackbarMessage('Link kopyalandı!');
        setSnackbarOpen(true);
      }).catch((err) => {
        setSnackbarMessage('Link kopyalanırken bir hata oluştu.');
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
        padding: 2,
              overflow: "hidden",

        maxWidth: '100%',
        margin: '0 auto',
      }}
    >

      <Box>
        <RandomWinner />
      </Box>

      {/* PNG Görseli */}
      <Box
        component="img"
        src={Tasks}
        alt="Deal Icon"
        sx={{
          mt: 4,
          width: '80px',
          maxWidth: '50%', // Ekranın %50'sini aşmayacak şekilde sınırla
        }}
      />
      {/* Başlık */}
      <Typography variant="h5" sx={{ marginTop: 4, color: 'black', fontWeight: 'bold' }}>
        Invite and Earn!
      </Typography>

      {/* Açıklama */}
      <Typography variant="body1" sx={{ marginTop: 1, color: 'text.secondary' }}>
        Invite friends, get up to 10 TON in rewards!
      </Typography>

      {/* Link Kopyalama ve Paylaşma Butonları */}
      <Box sx={{ display: 'flex', gap: 2, marginTop: 4 }}>
        {/* Copy Link Butonu */}
        <Button 
          variant="contained" 
          onClick={handleCopyLink}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Copy Link'}
        </Button>

        {/* Share Link Butonu */}
        <Button 
          variant="contained" 
          onClick={handleShareLink}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Share Link'}
        </Button>
      </Box>

      {/* İçerik */}
      <Box sx={{ mt: 4, width: '100%' }}>
        {loading ? (
          <CircularProgress /> // Yükleniyor animasyonu
        ) : error ? (
          <Typography color="error">{error}</Typography> // Hata mesajı
        ) : invitedUsers.length === 0 ? (
          <Typography>Henüz kimseyi davet etmediniz.</Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="left">#</TableCell>
                <TableCell align="left">Invited Users</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invitedUsers.map((userId, index) => (
                <TableRow key={index}>
                  <TableCell align="left">{index + 1}</TableCell>
                  <TableCell align="left">{userId}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Box>

      {/* Snackbar bildirimi */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Display on top

      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
            </ThemeProvider>
    
  );
};

export default DealsComponent;
