import React, { useEffect, useState } from 'react';
import { Box, Typography, Modal, Button } from '@mui/material';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { firebaseConfig } from './firebaseConfig';
import { useNavigate } from 'react-router-dom';
import gift from '../assets/gift.png';


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: 300, sm: 400 },
  bgcolor: '#282828',
  boxShadow: 24,
  p: 4,
  borderRadius: '8px',
  textAlign: 'center' as 'center',
};

const WelcomeBonus: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();


   const handleNavigate = () => {
    navigate('/latest-booba/spin');
  };



  useEffect(() => {
    const applyWelcomeBonus = async () => {
      try {
        const telegramUserId = localStorage.getItem('telegramUserId');
        if (!telegramUserId) {
          throw new Error('Kullanıcı kimliği bulunamadı. Lütfen tekrar giriş yapın.');
        }

        const userDocRef = doc(db, 'users', telegramUserId);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.wlcomePaided === undefined) {
            // wlcomePaided değeri yoksa false olarak ayarla
            await setDoc(userDocRef, { wlcomePaided: false }, { merge: true });
            // Güncellenmiş veriyi al
            const updatedUserDoc = await getDoc(userDocRef);
            const updatedUserData = updatedUserDoc.data();
            if (updatedUserData?.wlcomePaided === false) {
              // Bonus ekle
              await updateDoc(userDocRef, {
                bblip: increment(1000),
                wlcomePaided: true,
              });
              setOpen(true);
            }
          } else if (userData.wlcomePaided === false) {
            // Bonus ekle
            await updateDoc(userDocRef, {
              bblip: increment(1000),
              wlcomePaided: true,
            });
            setOpen(true);
          }
        } else {
          // Kullanıcı dokümanı yoksa hata ver
          throw new Error('Kullanıcı dokümanı bulunamadı.');
        }
      } catch (err) {
        console.error('Hoşgeldiniz bonusu uygulanırken hata oluştu:', err);
        setError((err as Error).message);
      }
    };

    applyWelcomeBonus();
  }, []);

  const handleClose = () => setOpen(false);

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="welcome-bonus-title"
        aria-describedby="welcome-bonus-description"
      >
        <Box sx={style}>
          
          <Typography id="welcome-bonus-title" variant="h6" component="h2" sx={{ mb: 0 }}>

          Welcome to Booba Blip!          </Typography>
        
          <Typography id="welcome-bonus-description" sx={{ }}>
          You have received welcome bonus.          </Typography>
        
  <Box display={'table-row' } justifyContent={'space-between'} >
    <Box textAlign={'right'} >
       <img src={gift} alt="" width={'50%'} height={'50%'} style={{marginLeft:"60%", marginBottom:'-50%'}} />
    </Box>
    <Box textAlign={'left'}>
  <Button  variant="contained" onClick={handleNavigate} sx={{border:'1px solid white', width:'55%'}}>
            Wallet
          </Button>
    </Box>
          </Box>
        

        </Box>
      </Modal>
      {error && (
        <Box sx={{ position: 'fixed', bottom: 16, right: 16 }}>
          <Typography color="error">Hata: {error}</Typography>
        </Box>
      )}
    </>
  );
};

export default WelcomeBonus; 