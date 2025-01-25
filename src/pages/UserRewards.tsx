import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { firebaseConfig } from './firebaseConfig'; // Firebase yapılandırması
import { initializeApp } from 'firebase/app';  // Firebase uygulaması başlatmak için
import { getFirestore } from 'firebase/firestore';  // Firestore veritabanına bağlanmak için
import { Box, Typography, CircularProgress, Modal, Button } from '@mui/material';
import gift from '../assets/dailygift.png';

// Firebase'i Başlatma
const app = initializeApp(firebaseConfig);  // Firebase'i başlat
const db = getFirestore(app);  // Firestore'a bağlan

const UserRewards = () => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);  // Modal'ı göstermek için state
  const [, setError] = useState<string | null>(null);  // Hata mesajı için state

  // Kullanıcının Telegram User ID'sini localStorage'dan al
  const telegramUserId = localStorage.getItem('telegramUserId') || '1421109983'; // Varsayılan ID

  useEffect(() => {
    const fetchUserData = async () => {
      if (!telegramUserId) {
        setError("Telegram User ID not found!");
        setLoading(false);
        return;
      }

      // Kullanıcı verisini Firestore'dan al
      const docRef = doc(db, "users", telegramUserId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUserData(docSnap.data());
      } else {
        // Kullanıcı verisi yoksa, yeni kullanıcıyı oluştur
        const newUserData = {
          rewardShown: false,
          lastLogin: new Date().toISOString(),
        };
        await setDoc(docRef, newUserData);
        setUserData(newUserData);
      }

      setLoading(false);
    };

    fetchUserData();
  }, [telegramUserId]);

  useEffect(() => {
    const handleReward = async () => {
      if (!userData) return;

      const currentTime = new Date().getTime();
      const lastLogin = new Date(userData.lastLogin).getTime();
      const timeDifference = currentTime - lastLogin;

      // Eğer 24 saat geçmişse, rewardShown'ı false yap
      if (timeDifference >= 24 * 60 * 60 * 1000) {
        const docRef = doc(db, "users", telegramUserId);
        await updateDoc(docRef, { rewardShown: false });
        setUserData((prevData: any) => ({ ...prevData, rewardShown: false }));
        
        // 3 saniye bekle ve flag'ı kontrol et
        setTimeout(() => {
          if (!userData.rewardShown) {
            setShowModal(true);  // Modal'ı göster
          }
        }, 3000); // 3 saniye bekleme
      }
    };

    if (userData) {
      handleReward();
    }
  }, [userData]);

  const claimReward = async () => {
    if (!userData) return;

    const currentTime = new Date().toISOString();
    const docRef = doc(db, "users", telegramUserId);
    
    // Firestore'da güncelleme yap
    await updateDoc(docRef, {
      bblip: userData.bblip + 5000,
      lastLogin: currentTime,
      rewardShown: true
    });

    // State'i güncelle
    setUserData((prevData: any) => ({ ...prevData, rewardShown: true, lastLogin: currentTime }));
    setShowModal(false);  // Modal'ı kapat
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{}}>
      {/* Modal */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
      >
        <Box sx={{
          position: 'absolute' as 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: 320, sm: 400 },
          bgcolor: '#282828',
          boxShadow: 24,
          p: 1,
          borderRadius: '8px',
          textAlign: 'center' as 'center',
        }}>
          <Typography id="welcome-bonus-title" variant="h6" component="h2" sx={{ mb: 0 }}>
            Congratulations!
          </Typography>
          <Typography>
            Come back every day to get surprises!
          </Typography>

          <Box display={'flexbox'} justifyContent={'space-between'}>
            <Box textAlign={'right'}>
              <Button onClick={claimReward} variant="contained" sx={{ border: '1px solid white', width: '50%', mb: -18 }}>
                Claim
              </Button>
            </Box>

            <Box textAlign={'left'}>
              <img src={gift} alt="" width={'40%'} height={'50%'} style={{ marginRight: "70%", marginBottom: '-15%' }} />
            </Box>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default UserRewards;
