import React, { useEffect, useState } from 'react';
import { TextField, Button, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { firebaseConfig } from './firebaseConfig';

// Firebase initialization
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const TwoFieldsComponent: React.FC = () => {
  const [field1, setField1] = useState('');
  const [field2, setField2] = useState('');
  const [userData, setUserData] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const telegramUserId = localStorage.getItem("telegramUserId");
    if (!telegramUserId) {
      console.error("Telegram User ID not found!");
      return;
    }

    // Firestore real-time listener for user data
    const docRef = doc(db, "users", telegramUserId);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserData(data);

        // Set the field1 (address) to the user's address from the Firestore data
        if (data?.address) {
          setField1(data.address);
        }
      } else {
        console.log("No such document!");
      }
    });

    return () => unsubscribe(); // Cleanup listener on component unmount
  }, []);

  const handleProcess = async () => {
    const telegramUserId = localStorage.getItem("telegramUserId");
    if (!telegramUserId) {
      console.error("Telegram User ID not found!");
      return;
    }

    // Adresin 48 karakter olduğunu kontrol et
    if (field1.length !== 48) {
      setErrorMessage('Invalid TON address');
      return;
    }

    if (!field2 || isNaN(Number(field2))) {
      setErrorMessage('Please enter a valid amount');
      return;
    }

    // Girilen miktarı 1000 ile çarp
    const enteredAmount = Number(field2) * 1000;

    // Toplam bakiyenin yeterli olup olmadığını kontrol et
    if (userData?.total < enteredAmount) {
      setErrorMessage('Yetersiz Bakiye!'); // Yetersiz Bakiye
      return;
    }

    // Girilen miktarı toplam bakiyeden çıkar
    const newTotal = userData.total - enteredAmount;

    // Her işlem için benzersiz bir ID oluştur
    const processId = new Date().getTime().toString();

    const userRef = doc(db, "users", telegramUserId);

    // Alanları ve sonucu işleyip Firestore'a kaydet
    try {
      // Veri ve işlem sonucunu tek bir güncelleme ile kaydet
      await updateDoc(userRef, {
        [`fields.${processId}`]: {
          field1,
          field2,
          completed: false,
        },
        total: newTotal, // Yeni bakiye
      });
      console.log("Data successfully saved!");
      setErrorMessage(''); // İşlem başarılıysa hata mesajını temizle
    } catch (error) {
      console.error("Error saving data:", error);
      setErrorMessage('An error occurred during the operation.');
    }
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 2, 
        width: '85vw', 
        margin: '0 auto', 
        padding: 3, 
        borderRadius: 2, 
        boxShadow: 3,
        backgroundColor: '#fff'
      }}
    >
      {/* Title Section */}
      <Typography variant="h6" align="center" sx={{ marginBottom: 2, fontWeight: 'bold' }}>
        Withdraw TON
      </Typography>

      {/* Input Fields */}
      <TextField
        label="TON Address"
        variant="outlined"
        value={field1}
        onChange={(e) => setField1(e.target.value)}
        sx={{ marginBottom: 2 }}
      />
      <TextField
        label="Amount (TON)"
        variant="outlined"
        value={field2}
        onChange={(e) => setField2(e.target.value)}
        sx={{ marginBottom: 2 }}
      />

      {/* Available balance */}
      {userData && userData.total !== undefined && (
        <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 2 }}>
          Available: {userData.total / 1000} TON
        </Typography>
      )}

      {/* Display error message if balance is insufficient */}
      {errorMessage && (
        <Typography variant="body2" color="error" textAlign="center" sx={{ marginBottom: 2 }}>
          {errorMessage}
        </Typography>
      )}

      {/* Process Button */}
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleProcess}
        sx={{
          padding: '10px 0',
          fontWeight: 'bold',
        }}
      >
        Withdraw
      </Button>

      {/* Table to show process status and result */}
     {userData && userData.fields && Object.keys(userData.fields).length > 0 && (
  <Box sx={{ marginTop: 3 }}>
    {/* Latest Transactions Title */}
    <Typography textAlign={'center'} variant="h6" sx={{ marginBottom: 2 }}>
      Latest Withdrawls
    </Typography>
    
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>İşlem</TableCell>
            <TableCell align="right">Durum</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.keys(userData.fields)
            .sort((a, b) => {
              // Sort by completed status, false first
              const processA = userData.fields[a];
              const processB = userData.fields[b];
              return (processA.completed ? 1 : 0) - (processB.completed ? 1 : 0);
            })
            .map((processId) => {
              const process = userData.fields[processId];
              return (
                <TableRow key={processId}>
                  <TableCell component="th" scope="row">
                    <Typography variant="body1">
                      {process.field1?.length > 9 ? process.field1?.slice(0, 5) + '...' + process.field1?.slice(-4) : process.field1 || 'Bilinmiyor'}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ marginTop: 1 }}>
                      ID: {processId}
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
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </TableContainer>
  </Box>
)}
      
    </Box>
  );
};

export default TwoFieldsComponent;
