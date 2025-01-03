import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { firebaseConfig } from './firebaseConfig'; // Firebase yapılandırması
import { initializeApp } from 'firebase/app';  // Firebase uygulaması başlatmak için
import { getFirestore } from 'firebase/firestore';  // Firestore veritabanına bağlanmak için
import { Box, Typography, CircularProgress, Modal, Button } from '@mui/material';

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
          lastLogin: new Date().getTime(),
          rewardShown: false,
          bblip: 0,  // Başlangıçta 0
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
      const lastLogin = userData.lastLogin || 0;
      const timeDifference = currentTime - lastLogin;

      // Eğer 24 saatten fazla geçmişse ve ödül daha önce gösterilmediyse, ödül ver
      if (timeDifference >= 24 * 60 * 60 * 1000 && !userData.rewardShown) {
        // Firestore'da kullanıcı verisini güncelle
        const docRef = doc(db, "users", telegramUserId);
        await updateDoc(docRef, {
          bblip: userData.bblip + 5000,  // BBilp ödülünü artır
          lastLogin: currentTime,        // Son giriş zamanını güncelle
          rewardShown: true               // Ödülün gösterildiğini işaretle
        });

        setShowModal(true);  // Modal'ı göster
      }
    };

    if (userData) {
      handleReward(); // Kullanıcı verisi yüklendikten sonra ödül kontrolü yapılır
    }
  }, [userData]);

  const closeModal = () => {
    setShowModal(false);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 2, textAlign: 'center' }}>
      {/* Modal */}
      <Modal
        open={showModal}
        onClose={closeModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={{
          width: 300,
          margin: 'auto',
          backgroundColor: 'white',
          padding: 2,
          borderRadius: 2,
          textAlign: 'center',
          marginTop: '20%',
          boxShadow: 24,
        }}>
          <Typography id="modal-title" variant="h6" component="h2">
            Tebrikler!
          </Typography>
          <Typography id="modal-description" sx={{ mt: 2 }}>
            Bugün günlük ödülünüzü kazandınız. +5000 BBLIP hesabınıza eklendi!
          </Typography>
          <Button onClick={closeModal} sx={{ mt: 2 }} variant="contained">Tamam</Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default UserRewards;
