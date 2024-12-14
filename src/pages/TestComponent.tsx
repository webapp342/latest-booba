import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, CircularProgress } from '@mui/material';
import { getFirestore, doc, getDoc } from 'firebase/firestore'; // Firestore metodları
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './firebaseConfig'; // Firebase yapılandırma

// Firebase App başlat
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const DealsComponent: React.FC = () => {
  const [invitedUsers, setInvitedUsers] = useState<string[]>([]); // `invitedUsers` bir array olacak
  const [loading, setLoading] = useState(true); // Yüklenme durumu
  const [error, setError] = useState<string | null>(null); // Hata mesajı için state

  useEffect(() => {
    const fetchInvitedUsers = async () => {
      setLoading(true);
      setError(null); // Hata durumunu sıfırla

      try {
        // localStorage'den Telegram kullanıcı kimliğini al
        const telegramUserId = localStorage.getItem('telegramUserId');
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
          // `invitedUsers` dizisi varsa kontrol et
          if (userData.invitedUsers && Array.isArray(userData.invitedUsers)) {
            setInvitedUsers(userData.invitedUsers); // Davet edilen kullanıcıları ayarla
          } else {
            setInvitedUsers([]); // invitedUsers dizisi yoksa boş ayarla
          }
        } else {
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

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: 2,
        maxWidth: '100%',
        margin: '0 auto',
      }}
    >
      {/* Başlık */}
      <Typography variant="h5" sx={{ marginTop: 4, color: 'black', fontWeight: 'bold' }}>
        Davetlerim
      </Typography>

      {/* Açıklama */}
      <Typography variant="body1" sx={{ marginTop: 1, color: 'text.secondary' }}>
        Davet ettiğiniz kullanıcıları aşağıda görebilirsiniz.
      </Typography>

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
                <TableCell align="left">Davet Edilen Kullanıcı</TableCell>
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
    </Box>
  );
};

export default DealsComponent;
