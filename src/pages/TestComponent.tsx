import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import Deal from '../assets/deal.png'; // PNG dosyasını import edin
import { getFirestore, doc, getDoc } from 'firebase/firestore'; // Firestore metodları
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './firebaseConfig'; // Firebase yapılandırma

// Firebase App başlat
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const DealsComponent: React.FC = () => {
  const [invitedUsers, setInvitedUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvitedUsers = async () => {
      setLoading(true);
      try {
        // localStorage'den Telegram kullanıcı kimliğini al
        const telegramUserId = localStorage.getItem('telegramUserId');
        if (!telegramUserId) {
          console.error('No telegramUserId found in localStorage');
          setInvitedUsers([]);
          setLoading(false);
          return;
        }

        // Firestore'dan kullanıcıya ait belgeyi getir
        const docRef = doc(db, 'invitedUsers', telegramUserId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          // `invitedUsers` alanını kontrol et
          if (data.invitedUsers && Array.isArray(data.invitedUsers) && data.invitedUsers.length > 0) {
            setInvitedUsers(data.invitedUsers); // Davet edilen kullanıcıları ayarla
          } else {
            console.log('No invitedUsers field or field is empty');
            setInvitedUsers([]);
          }
        } else {
          console.log('Document does not exist');
          setInvitedUsers([]);
        }
      } catch (error) {
        console.error('Error fetching invited users:', error);
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
      {/* PNG Görseli */}
      <Box
        component="img"
        src={Deal}
        alt="Deal Icon"
        sx={{
          mt: 4,
          width: '50%',
          maxWidth: '25%', // Ekranın %50'sini aşmayacak şekilde sınırla
        }}
      />
      {/* Başlık */}
      <Typography
        variant="h5"
        sx={{
          marginTop: 4,
          color: 'black',
          fontWeight: 'bold',
        }}
      >
        Friends
      </Typography>
      {/* Açıklama */}
      <Typography
        variant="body1"
        sx={{
          marginTop: 1,
          color: 'text.secondary',
        }}
      >
        Invite your friends to earn more BBLIP
      </Typography>

      {/* Davetli Kullanıcılar */}
      <Box sx={{ mt: 4, width: '100%' }}>
        {loading ? (
          <Typography>Loading...</Typography>
        ) : invitedUsers.length === 0 ? (
          <Typography>You don't have invites yet</Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="left">User</TableCell>
                <TableCell align="left">Invite Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invitedUsers.map((user, index) => (
                <TableRow key={index}>
                  <TableCell align="left">{user.username || 'Unknown'}</TableCell>
                  <TableCell align="left">{user.inviteDate || 'N/A'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Box>

      {/* Buton */}
      <Button
        variant="contained"
        color="primary"
        sx={{
          mt: 4, // Yukarıdan boşluk bırak
          width: '95%', // Sayfa genişliğinin %90'ını kapla
          position: 'fixed', // Sayfanın altına sabitle
          bottom: 16, // Sayfanın altından 16px yukarıda
          left: '50%', // Sayfanın ortasına hizala
          transform: 'translateX(-50%)', // Ortalamayı sağla
          mb: 9, // Alt boşluk bırak
        }}
      >
        Invite Friends
      </Button>
    </Box>
  );
};

export default DealsComponent;
