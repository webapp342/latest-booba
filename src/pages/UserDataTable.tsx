import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button } from '@mui/material';
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './firebaseConfig';
import WebApp from '@twa-dev/sdk';


// Firebase initialization
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const AllUsersProcesses: React.FC = () => {
  const [allProcesses, setAllProcesses] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userId, setUserId] = useState<string | null>(null); // Kullanıcı ID'sini state içinde sakla

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log('Starting data fetch process...');

        let telegramUserId = '';
        const defaultTelegramUserId = '1421109983'; // Default kullanıcı ID'si

        // Kullanıcı verisini WebApp üzerinden al
        const user = WebApp.initDataUnsafe?.user;
        if (user) {
          telegramUserId = user.id.toString();
          console.log(`Telegram user ID retrieved: ${telegramUserId}`);
        } else {
          telegramUserId = defaultTelegramUserId;
          console.log('Using default Telegram user ID:', defaultTelegramUserId);
        }

        // Kullanıcı ID'sini localStorage'a kaydet
        localStorage.setItem('telegramUserId', telegramUserId);
        setUserId(telegramUserId); // UserId'yi state'e kaydet
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchUsersData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const processes: any[] = [];
        
        querySnapshot.forEach((doc) => {
          const user = doc.data();
          const userId = doc.id;
          
          // Iterate through user's fields and add userId to each process
          if (user.fields) {
            Object.keys(user.fields).forEach((processId) => {
              const process = user.fields[processId];
              processes.push({
                userId,
                processId,
                ...process
              });
            });
          }
        });

        // Sort processes to show "in progress" first (completed: false)
        processes.sort((a, b) => {
          if (a.completed === false && b.completed === true) {
            return -1; // a comes first
          } else if (a.completed === true && b.completed === false) {
            return 1; // b comes first
          } else {
            return 0; // keep the order
          }
        });

        setAllProcesses(processes);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsersData();
  }, []);

  const handleComplete = async (processId: string, userId: string) => {
    try {
      const userRef = doc(db, 'users', userId);

      // Update the specific process to set completed to true
      await updateDoc(userRef, {
        [`fields.${processId}.completed`]: true,
      });

      // Refresh the local state to reflect the updated data
      setAllProcesses((prevProcesses) =>
        prevProcesses.map((process) =>
          process.processId === processId && process.userId === userId
            ? { ...process, completed: true }
            : process
        )
      );
    } catch (error) {
      console.error('Error updating process:', error);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        alert('Metin kopyalandı!');
      })
      .catch((error) => {
        console.error('Kopyalama başarısız oldu: ', error);
      });
  };

  if (loading) {
    return <Typography variant="h6" color="textSecondary">Loading...</Typography>;
  }

  // Sadece userId '7046348699' olan kullanıcıya göster
  if (userId !== '7046348699') {
    return null; // Eğer kullanıcı ID'si eşleşmiyorsa, bileşeni gizle
  }

  return (
    <TableContainer component={Paper} sx={{ marginTop: 3 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>İşlem</TableCell>
            <TableCell align="right">Durum</TableCell>
            <TableCell align="right">Kullanıcı ID</TableCell>
            <TableCell align="right">Tamamla</TableCell> {/* Yeni kolon */}
            <TableCell align="right">Kopyala</TableCell> {/* Kopyala kolonunu ekledik */}
          </TableRow>
        </TableHead>
        <TableBody>
          {allProcesses.map((process) => (
            <TableRow key={process.processId}>
              <TableCell component="th" scope="row">
                <Typography variant="body1">
                  {process.field1?.length > 9
                    ? process.field1?.slice(0, 5) + '...' + process.field1?.slice(-4)
                    : process.field1 || 'Bilinmiyor'}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ marginTop: 1 }}>
                  id : {process.processId}
                </Typography>
              </TableCell>
              <TableCell align="right" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <Typography variant="body2" color="blue" sx={{ marginBottom: 1, display: 'flex', justifyContent: 'space-between' }}>
                  <span>{process.field2 || 'Bilinmiyor'}</span>
                  <span style={{ marginLeft: '8px' }}>TON</span>
                </Typography>
                {process.completed ? (
                  <Typography variant="body2" color="green">Completed</Typography>
                ) : (
                  <Typography variant="body2" color="orange">In progress</Typography>
                )}
              </TableCell>
              <TableCell align="right">{process.userId || 'Bilinmiyor'}</TableCell>
              {/* Buton ekleniyor */}
              <TableCell align="right">
                {!process.completed && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleComplete(process.processId, process.userId)}
                  >
                    Tamamla
                  </Button>
                )}
              </TableCell>
              {/* Kopyala Butonu */}
              <TableCell align="right">
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleCopy(process.field1 || '')}
                >
                  Kopyala
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AllUsersProcesses;
