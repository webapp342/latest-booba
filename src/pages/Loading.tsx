import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';
import WebApp from '@twa-dev/sdk';
import { keyframes } from '@emotion/react';
import { styled } from '@mui/material/styles';

// Import images used in SlotMachine.tsx
import boobaLogo from '../assets/Artboard 2.png';
import ticketLogo from '../assets/ticket.png';
import tonSymbol from '../assets/ton_symbol.png';

// Import images used in Tasks.tsx
import task1Logo from '../assets/task1logo.png';
import instagramLogo from '../assets/instagram.png';
import tikTokLogo from '../assets/tik-tok.png';
import telegramLogo from '../assets/telegram.png';
import darkLogo from '../assets/darkLogo.png';
import adLogo from '../assets/ad.png';
import tonLogoDark from '../assets/ton_logo_dark_background.svg';

// Box cover images
import alienwareBoxImage from '../assets/boxes/ALIENWARE.png';
import amazonBoxImage from '../assets/boxes/Amazon.png';
import landRoverBoxImage from '../assets/boxes/06_LANDROVER-Box-mock_box_1_pmWxJoo.png';
import rolexSubmarinerBoxImage from '../assets/boxes/06_ROLEX_SUBMARINER-Box-mock_box_HyKP6Wz.png';
import donaldTrumpBoxImage from '../assets/boxes/06-DONALD_TRUMP-Box-mock_box_1_Mtw3P4X.png';
import rolexYachtmasterBoxImage from '../assets/boxes/07_ROLEX_YACHTMASTER-Box-mock_box_1_AWKQOtA.png';
import rolexBoxImage from '../assets/boxes/19_ROLEX-Box-mock_box_Mf79Eyz.png';
import chanelBoxImage from '../assets/boxes/22-CHANEL-Box-mock_box_1_LJJWWSE.png';
import louisVuittonBoxImage from '../assets/boxes/LOUIS_VUITTON-Deluxe-mock_box.png';
import bmwBoxImage from '../assets/boxes/05-BMW-Box-mock_box_1_tcGgWnJ.png';
import primeBoxImage from '../assets/boxes/PRIME-Box-BLUE-mock_box_1_1_i1bhp4C.png';
import sneakersBoxImage from '../assets/boxes/SNEAKERS-Box-mock_box_1_1_XJ6yoyi.png';
import rolexDaytonaBoxImage from '../assets/boxes/01_ROLEX_DAYTONA-Box-mock_box_tgFf3C6.png';
import corsairBoxImage from '../assets/boxes/02-CORSAIR-Box-mock_box_1_9ex9nau.png';
import versaceBoxImage from '../assets/boxes/02-VERSACE-Box-mock_box_1_Eh0sKbn.png';
import rollsRoyceBoxImage from '../assets/boxes/04_ROLLS_ROYCE-Box-mock_box_lEnAQxE.png';
import footballBoxImage from '../assets/boxes/08_FOOTBALL_FRENZY-Box-mock_box_xTGy6uS.png';
import maseratiBoxImage from '../assets/boxes/09_MASERATI-Box-mock_box_nNGuE9m.png';
import topgBoxImage from '../assets/boxes/09-TOPG-Box-mock_box_1_DYOk6ka.png';
import porscheBoxImage from '../assets/boxes/11_PORSCHE-Box-mock_box_GsB1OjI.png';
import ferrariBoxImage from '../assets/boxes/12_FERRARI-Box-mock_box_1_gxu1E5e.png';
import cartierBoxImage from '../assets/boxes/Cartier_lC54zo9.png';
import diamondBoxImage from '../assets/boxes/Diamond-Vault_1_rL3pUUO.png';
import hublotBoxImage from '../assets/boxes/Hublot_wua9Wr6.png';

// Other UI images and icons

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;


const LoadingContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  background: '#1a2126',
  color: '#fff',
  gap: '2rem',
  position: 'relative',
  overflow: 'hidden',
});

const Logo = styled('img')({
  width: '120px',
  height: '120px',
  animation: `${fadeIn} 1s ease-out, ${pulse} 2s ease-in-out infinite`,
  marginBottom: '1rem',
});

const LoadingBar = styled(Box)({
  width: '200px',
  height: '3px',
  background: 'rgba(255, 255, 255, 0.1)',
  borderRadius: '4px',
  overflow: 'hidden',
  position: 'relative',
  marginBottom: '1rem',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '30%',
    background: 'linear-gradient(90deg, #3B82F6, #60A5FA)',
    borderRadius: '4px',
    animation: 'loading 1s ease-in-out infinite',
  },
  '@keyframes loading': {
    '0%': {
      left: '-30%',
    },
    '100%': {
      left: '100%',
    },
  },
});

const FeatureText = styled(Typography)({
  fontSize: '1.1rem',
  color: 'rgba(255, 255, 255, 0.9)',
  fontWeight: 500,
  letterSpacing: '0.05em',
  textAlign: 'center',
  opacity: 0,
  animation: `${fadeIn} 0.8s ease-out forwards`,
  animationDelay: '0.3s',
});

const LoadingText = styled(Typography)({
  color: 'rgba(255, 255, 255, 0.7)',
  fontSize: '0.875rem',
  letterSpacing: '0.1em',
  fontWeight: 500,
  marginTop: '0.5rem',
  animation: `${fadeIn} 1s ease-out`,
});

// Array of UI images to preload (small images)
const uiImagesToCache = [
  // SlotMachine images
  { url: boobaLogo, key: 'boobaLogo' },
  { url: ticketLogo, key: 'ticketLogo' },
  { url: tonSymbol, key: 'tonSymbol' },
  
  // Tasks images
  { url: task1Logo, key: 'task1Logo' },
  { url: instagramLogo, key: 'instagramLogo' },
  { url: tikTokLogo, key: 'tikTokLogo' },
  { url: telegramLogo, key: 'telegramLogo' },
  { url: darkLogo, key: 'darkLogo' },
  { url: adLogo, key: 'adLogo' },
  { url: tonLogoDark, key: 'tonLogoDark' }
];

// Array of box images to preload
const boxImagesToCache = [
  { url: alienwareBoxImage, key: 'alienware' },
  { url: amazonBoxImage, key: 'amazon' },
  { url: landRoverBoxImage, key: 'landRover' },
  { url: rolexSubmarinerBoxImage, key: 'rolexSubmarine' },
  { url: donaldTrumpBoxImage, key: 'donaldTrump' },
  { url: rolexYachtmasterBoxImage, key: 'rolexYachtmaster' },
  { url: rolexBoxImage, key: 'rolex' },
  { url: chanelBoxImage, key: 'chanel' },
  { url: louisVuittonBoxImage, key: 'louisVuitton' },
  { url: bmwBoxImage, key: 'bmw' },
  { url: primeBoxImage, key: 'prime' },
  { url: sneakersBoxImage, key: 'sneakers' },
  { url: rolexDaytonaBoxImage, key: 'rolexDaytona' },
  { url: corsairBoxImage, key: 'corsair' },
  { url: versaceBoxImage, key: 'versace' },
  { url: rollsRoyceBoxImage, key: 'rollsRoyce' },
  { url: footballBoxImage, key: 'football' },
  { url: maseratiBoxImage, key: 'maserati' },
  { url: topgBoxImage, key: 'topg' },
  { url: porscheBoxImage, key: 'porsche' },
  { url: ferrariBoxImage, key: 'ferrari' },
  { url: cartierBoxImage, key: 'cartier' },
  { url: diamondBoxImage, key: 'diamond' },
  { url: hublotBoxImage, key: 'hublot' }
];

interface LoadingProps {
  onLoadComplete: () => void;
}

const Loading: React.FC<LoadingProps> = ({ onLoadComplete }) => {
  const [error, setError] = useState<string | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [, setImagesLoaded] = useState(0);
  const [startTime] = useState(Date.now()); // Add start time tracking

  const finishLoading = () => {
    const elapsedTime = Date.now() - startTime;
    const minimumTime = 3000; // 3 seconds minimum

    if (elapsedTime >= minimumTime) {
      onLoadComplete();
    } else {
      const remainingTime = minimumTime - elapsedTime;
      setTimeout(() => onLoadComplete(), remainingTime);
    }
  };

  // Function to preload images using browser cache
  const preloadImages = async () => {
    const allImages = [...uiImagesToCache, ...boxImagesToCache];
    const totalImages = allImages.length;

    // Preload image function that uses browser cache
    const preloadImage = (imageUrl: string): Promise<void> => {
      return new Promise((resolve) => {
        const img = new Image();
        
        img.onload = () => {
          setImagesLoaded(prev => {
            const newValue = prev + 1;
            const progress = Math.min((newValue / totalImages) * 100, 100);
            setLoadingProgress(progress);
            if (progress === 100) {
              finishLoading(); // Use finishLoading instead of direct onLoadComplete
            }
            return newValue;
          });
          resolve();
        };

        img.onerror = () => {
          console.warn('Error loading image:', imageUrl);
          setImagesLoaded(prev => {
            const newValue = prev + 1;
            const progress = Math.min((newValue / totalImages) * 100, 100);
            setLoadingProgress(progress);
            if (progress === 100) {
              finishLoading(); // Use finishLoading instead of direct onLoadComplete
            }
            return newValue;
          });
          resolve();
        };

        img.src = imageUrl;
      });
    };

    // Load all images in parallel
    await Promise.all(allImages.map(img => preloadImage(img.url)));
  };

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Start preloading images first
        await preloadImages();

        // Then fetch user data
        let telegramUserId = '';
        const defaultTelegramUserId = '7046348699';

        const user = WebApp.initDataUnsafe?.user;
        if (user) {
          telegramUserId = user.id.toString();
        } else {
          telegramUserId = defaultTelegramUserId;
        }

        localStorage.setItem('telegramUserId', telegramUserId);

        // Fetch transaction_hashes data
        const transactionHashesDocRef = doc(db, 'transaction_hashes', telegramUserId);
        const transactionHashesDocSnap = await getDoc(transactionHashesDocRef);

        if (transactionHashesDocSnap.exists()) {
          const transactionHashesData = transactionHashesDocSnap.data();
          localStorage.setItem(`transaction_hashes_${telegramUserId}`, JSON.stringify(transactionHashesData));
        }

        // Fetch comment data
        const commentDocRef = doc(db, 'comments', telegramUserId);
        const commentDocSnap = await getDoc(commentDocRef);

        if (commentDocSnap.exists()) {
          const commentData = commentDocSnap.data();
          localStorage.setItem(`comment_${telegramUserId}`, JSON.stringify(commentData));
        }

        // Fetch invitedUsers data
        const invitedUsersDocRef = doc(db, 'invitedUsers', telegramUserId);
        const invitedUsersDocSnap = await getDoc(invitedUsersDocRef);

        if (invitedUsersDocSnap.exists()) {
          const invitedUsersData = invitedUsersDocSnap.data();
          localStorage.setItem(`invitedUsers_${telegramUserId}`, JSON.stringify(invitedUsersData));
        } else {
          localStorage.setItem(`invitedUsers_${telegramUserId}`, 'null');
        }
      } catch (error) {
        console.error('Error during initialization:', error);
        setError('An error occurred while loading');
      }
    };

    initializeApp();
  }, []);

  if (error) {
    return (
      <LoadingContainer>
        <Typography variant="h6" sx={{ color: '#EF4444' }}>
          {error}
        </Typography>
      </LoadingContainer>
    );
  }

  return (
    <LoadingContainer>
      <Logo src={boobaLogo} alt="Booba" />
      <LoadingBar />
      <FeatureText>
        Fun. Freedom. Future.
      </FeatureText>
      <LoadingText>
        Loading... {Math.round(loadingProgress)}%
      </LoadingText>
    </LoadingContainer>
  );
};

export default Loading;
