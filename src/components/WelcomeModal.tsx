import React, { useEffect, useState, useRef } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogTitle, 
  IconButton,
  Box,
  Typography,
  Snackbar,
  Alert,
  LinearProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { doc, getDoc, setDoc, updateDoc, increment, getFirestore } from 'firebase/firestore';
import WebApp from "@twa-dev/sdk";
import { keyframes } from '@mui/system';
import { boxesData } from '../data/boxesData';
import { useNavigate } from 'react-router-dom';
import { PackageOpenIcon  } from 'lucide-react';

// Box ID'lerini bir array'e al
const boxIds = Object.keys(boxesData).filter(id => id !== 'mystery-gift');
console.log('Available box IDs:', boxIds);

// Sola kayma animasyonu - daha hızlı
const slideLeft = keyframes`
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
`;

// Parıltı animasyonu
const shine = keyframes`
  0% {
    background-position: -100% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

interface WelcomeModalProps {
  onClose: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ onClose }) => {
  const [open, setOpen] = useState(false);
  const [currentBoxIndex, setCurrentBoxIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  const [finalBoxId, setFinalBoxId] = useState<string | null>(null);
  const [currentTitle, setCurrentTitle] = useState<string>('Welcome to Booba!');
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const db = getFirestore();
  const animationRef = useRef<NodeJS.Timeout>();
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserWelcomeStatus = async () => {
      try {
        let telegramUserId = WebApp.initDataUnsafe.user?.id?.toString();
        
        const localStorageId = localStorage.getItem("telegramUserId");
        if (!telegramUserId && localStorageId) {
          telegramUserId = localStorageId;
        }

        if (!telegramUserId) {
          console.error("Telegram User ID not found in both WebApp and localStorage!");
          return;
        }

        const userDocRef = doc(db, "users", telegramUserId);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists() || !userDoc.data()?.welcomeModal) {
          setOpen(true);
          
          const userData: {
            welcomeModal: boolean;
            updatedAt: Date;
            telegramInfo?: {
              id: number;
              firstName?: string;
              lastName?: string;
              username?: string;
            };
          } = {
            welcomeModal: true,
            updatedAt: new Date(),
          };

          const telegramUser = WebApp.initDataUnsafe.user;
          if (telegramUser) {
            userData.telegramInfo = {
              id: telegramUser.id,
              firstName: telegramUser.first_name,
              lastName: telegramUser.last_name,
              username: telegramUser.username,
            };
          }

          await setDoc(userDocRef, userData, { merge: true });
        }
      } catch (error) {
        console.error("Error checking welcome status:", error);
      }
    };

    checkUserWelcomeStatus();
  }, [db]);

  useEffect(() => {
    if (open && isAnimating && boxIds.length > 0) {
      // Her 50ms'de bir box'ı değiştir
      const interval = setInterval(() => {
        setCurrentBoxIndex((prev) => {
          const nextIndex = (prev + 1) % boxIds.length;
          const currentBoxId = boxIds[nextIndex];
          const currentBox = boxesData[currentBoxId];
          setCurrentTitle(currentBox.title);
          return nextIndex;
        });
        
        // Progress bar'ı güncelle
        setProgress((prev) => Math.min(prev + 2, 100));
      }, 50);

      // 3 saniye sonra dur
      animationRef.current = setTimeout(() => {
        clearInterval(interval);
        setIsAnimating(false);
        const randomIndex = Math.floor(Math.random() * boxIds.length);
        const selectedBoxId = boxIds[randomIndex];
        setFinalBoxId(selectedBoxId);
        setCurrentTitle(boxesData[selectedBoxId].title);
        setProgress(100);
      }, 3000);

      return () => {
        clearInterval(interval);
        if (animationRef.current) {
          clearTimeout(animationRef.current);
        }
      };
    }
  }, [open, isAnimating]);

  const handleClose = async () => {
    if (isProcessing) return;
    
    try {
      setIsProcessing(true);
      const telegramUserId = localStorage.getItem("telegramUserId");
      if (!telegramUserId || !finalBoxId) {
        setOpen(false);
        onClose();
        navigate('/latest-booba/mystery-box');
        return;
      }

      // Seçilen box'ın datasını al
      const selectedBox = boxesData[finalBoxId];
      if (!selectedBox) {
        setOpen(false);
        onClose();
        navigate('/latest-booba/mystery-box');
        return;
      }

      // Firestore'da kullanıcı dökümanını güncelle
      const userRef = doc(db, "users", telegramUserId);
      const updates: any = {
        [`boxes.${selectedBox.title}`]: increment(1),
        welcomeBonus: true,
        
      };

      await updateDoc(userRef, updates);

      // Başarı mesajını göster
      setSuccessMessage(`Welcome bonus: You received 1 ${selectedBox.title} box ! 🎉`);
      setShowSuccessSnackbar(true);

      // Kısa bir süre bekleyip modal'ı kapat ve yönlendir
      setTimeout(() => {
        setOpen(false);
        onClose();
        navigate('/latest-booba/mystery-box');
      }, 2000);

    } catch (error) {
      console.error("Error giving welcome bonus:", error);
      setOpen(false);
      onClose();
      navigate('/latest-booba/mystery-box');
    } finally {
      setIsProcessing(false);
    }
  };

  const getCurrentImage = () => {
    if (!boxIds.length) return '';
    const currentBoxId = finalBoxId !== null ? finalBoxId : boxIds[currentBoxIndex];
    return boxesData[currentBoxId].image;
  };

  return (
    <>
      <Dialog 
        open={open} 
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: '#1A1B1F',
            color: '#fff',
            borderRadius: 2,
            backgroundImage: 'linear-gradient(145deg, rgba(26,27,35,0.9) 0%, rgba(26,27,35,0.95) 100%)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            border: '1px solid rgba(255,255,255,0.1)',
          }
        }}
      >
        <DialogTitle sx={{ 
          m: 0, 
          p: 2, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          background: 'linear-gradient(90deg, rgba(110,211,255,0.1), rgba(142,233,255,0.05))',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
          <Box //@ts-ignore
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6" sx={{ 
              background: 'linear-gradient(90deg, #6ed3ff, #8ee9ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold',
              animation: isAnimating ? `${shine} 2s linear infinite` : 'none',
              backgroundSize: '200% 100%',
            }}>
              {currentTitle}
            </Typography>
          </Box>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            disabled={isProcessing}
            sx={{
              color: 'rgba(255,255,255,0.5)',
              
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <LinearProgress 
          variant="determinate" 
          value={progress}
          sx={{
            height: 2,
            backgroundColor: 'rgba(255,255,255,0.1)',
            '& .MuiLinearProgress-bar': {
              backgroundColor: '#6ed3ff',
            }
          }}
        />

        <DialogContent 
          dividers 
          sx={{ 
            bgcolor: 'transparent',
            overflow: 'hidden',
            position: 'relative',
            height: '300px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderTop: 'none',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          {/* Arka plan efekti */}
          <Box 
           sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at center, rgba(110,211,255,0.1) 0%, rgba(110,211,255,0) 70%)',
            opacity: isAnimating ? 0.5 : 1,
            transition: 'opacity 0.3s ease',
          }} />

          <Box
            sx={{
              width: '200px',
              height: '200px',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                animation: isAnimating ? `${slideLeft} 0.15s linear` : 'none',
              }}
            >
              <img
                src={getCurrentImage()}
                alt="Box"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  borderRadius: '8px',
                  filter: 'drop-shadow(0 4px 12px rgba(110,211,255,0.3))',
                }}
              />
            </Box>
          </Box>
        </DialogContent>

        {/* Bonus bilgisi */}
        <Box //@ts-ignore
        sx={{ 
          p: 2, 
          display: 'flex', 
          gap: 2,
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(90deg, rgba(110,211,255,0.05), rgba(142,233,255,0.02))'
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '8px',
            px: 2,
            py: 1
          }}>
            <PackageOpenIcon size={16} />
            <Typography sx={{ color: '#6ed3ff', fontWeight: 'bold' }}>
              +1 Box
            </Typography>
          </Box>
        
        </Box>
      </Dialog>

      <Snackbar
        open={showSuccessSnackbar}
        autoHideDuration={3000}
        onClose={() => setShowSuccessSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowSuccessSnackbar(false)} 
          severity="success"
          sx={{ 
            width: '100%', 
            background: 'linear-gradient(90deg, #4CAF50, #45a049)',
            color: 'white',
            '& .MuiAlert-icon': {
              color: 'white'
            }
          }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default WelcomeModal; 