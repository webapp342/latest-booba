import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Container, Grid, IconButton, CircularProgress, Drawer, Snackbar, Alert  } from '@mui/material';
import { motion } from 'framer-motion';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, updateDoc, increment, onSnapshot, getDoc } from 'firebase/firestore';
import { db } from '../../pages/firebase';
import { generateReward, BoxReward } from '../../utils/randomizer';
import BoxOpenAnimation from './BoxOpenAnimation';
import RewardDisplay from './RewardDisplay';
import KeyIcon from '@mui/icons-material/Key';
import { boxesData } from '../../data/boxesData';
import CloseIcon from '@mui/icons-material/Close';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import DepositDrawer from '../WalletDrawers/DepositDrawer';
import SwapDrawer from '../WalletDrawers/SwapDrawer';
import tonLogo from '../../assets/kucukTON.png';
import { PackageOpenIcon } from 'lucide-react';
const usdtLogo = 'https://cryptologos.cc/logos/tether-usdt-logo.png';

// Import all box images





interface UserStats {
  usdt: number;
  total: number;
  keys: number;
  keyParts: number;
  totalBoxes: number;
  distributedBoxes: number;
  giftBox: number;
  boxes: Record<string, number>;
  drops: Record<string, { code: string; amount: number; }[]>;
}

interface DisplayReward {
  code: string;
  name: string;
  image: string;
  price: string;
  rarity: number;
  amount: number;
}

// Renk değişiklikleri için stil güncellemeleri
const commonStyles = {
  primaryColor: '#6ed3ff',
  primaryGradient: 'linear-gradient(90deg, #6ed3ff, #8ee9ff)',
  bgGradient: 'linear-gradient(135deg, rgba(110, 211, 255, 0.3) 0%, rgba(110, 211, 255, 0.1) 100%)',
  borderColor: 'rgba(110, 211, 255, 0.2)',
  hoverBorderColor: 'rgba(110, 211, 255, 0.4)',
  buttonShadow: '0 4px 12px rgba(110, 211, 255, 0.3)',
  buttonHoverShadow: '0 6px 16px rgba(110, 211, 255, 0.4)',
};

const BoxDetail: React.FC = () => {
  const navigate = useNavigate();
  const { boxId } = useParams<{ boxId: string }>();
  const boxData = boxId ? boxesData[boxId] : null;
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [isOpening, setIsOpening] = useState(false);
  const [currentReward, setCurrentReward] = useState<DisplayReward | null>(null);
  const [showReward, setShowReward] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [tonPrice, setTonPrice] = useState<number | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<'TON' | 'USDT'>('TON');
  const [showDepositDrawer, setShowDepositDrawer] = useState(false);
  const [showSwapDrawer, setShowSwapDrawer] = useState(false);
  const [neededAmount, setNeededAmount] = useState<number>(0);
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const telegramUserId = localStorage.getItem("telegramUserId");
    if (!telegramUserId) {
      navigate('/latest-booba/spin');
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, 'users', telegramUserId),
      (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          // Initialize usdt with 0 if it doesn't exist
          setUserStats({
            ...data,
            usdt: data.usdt ?? 0,
          } as UserStats);
        } else {
          setError('Kullanıcı verisi bulunamadı');
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching user stats:', error);
        setError('Veriler yüklenirken hata oluştu');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const fetchTonPrice = async () => {
      try {
        const response = await axios.get(`https://api.binance.com/api/v3/ticker/price`, {
          params: { symbol: 'TONUSDT' },
        });
        const newTonPrice = parseFloat(response.data.price);
        setTonPrice(newTonPrice);
      } catch (error) {
        console.error('Error fetching TON price:', error);
      }
    };

    fetchTonPrice();
    const interval = setInterval(fetchTonPrice, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (canPurchase()) {
      setError(null);
      setNeededAmount(0);
    }
  }, [userStats, quantity, selectedPayment]);

  const updateUserStats = async (userId: string, reward: BoxReward) => {
    const userRef = doc(db, 'users', userId);
    
    const updates: any = {
      keys: increment(-1)
    };

    // Mystery Gift Box için özel güncelleme
    if (boxId === 'mystery-gift') {
      updates.giftBox = increment(-1);
      
      // Key parts için özel artış
      if (reward.code === '1key') {
        updates.keyParts = increment(1);
      } else if (reward.code === '5key') {
        updates.keyParts = increment(5);
      }
    } else {
      // Normal kutular için standart işlem
      updates[`boxes.${boxData?.title}`] = increment(-1);
      
      // Kullanıcının drops listesini güncelle
      const userDoc = await getDoc(doc(db, 'users', userId));
      const userData = userDoc.data() as UserStats;
      const existingDrops = userData.drops || {};
      const userDrops = existingDrops[boxData?.title || ''] || [];
      
      // Aynı koda sahip drop var mı kontrol et
      const existingDropIndex = userDrops.findIndex(drop => drop.code === reward.code);
      
      if (existingDropIndex !== -1) {
        // Varsa miktarını artır
        userDrops[existingDropIndex].amount += 1;
      } else {
        // Yoksa yeni ekle
        userDrops.push(reward);
      }
      
      updates[`drops.${boxData?.title}`] = userDrops;
    }
    
    await updateDoc(userRef, updates);
  };

  const getBoxOpeningStatus = (stats: UserStats | null) => {
    if (!stats) return { canOpen: false, message: 'Veriler yükleniyor...' };
    
    // Mystery Gift Box için özel kontrol
    if (boxId === 'mystery-gift') {
      const hasGiftBox = stats.giftBox > 0;
      const hasKeys = stats.keys > 0;

      if (!hasGiftBox && !hasKeys) {
        return { 
          canOpen: false, 
          message: 'Kutu açmak için Gift Box ve anahtarınız olması gerekiyor' 
        };
      }
      
      if (!hasGiftBox) {
        return { 
          canOpen: false, 
          message: `${stats.keys} anahtarınız var fakat Gift Box'ınız yok` 
        };
      }
      
      if (!hasKeys) {
        return { 
          canOpen: false, 
          message: `${stats.giftBox} Gift Box'ınız var fakat anahtarınız yok` 
        };
      }
      
      return { 
        canOpen: true, 
        message: `${stats.giftBox} Gift Box ve ${stats.keys} anahtarınız var` 
      };
    }

    // Diğer kutular için normal kontrol
    const boxCount = stats.boxes?.[boxData?.title || ''] || 0;
    const hasKeys = stats.keys > 0;

    if (boxCount === 0 && !hasKeys) {
      return { 
        canOpen: false, 
        message: 'Kutu açmak için kutunuz ve anahtarınız olması gerekiyor' 
      };
    }
    
    if (boxCount === 0) {
      return { 
        canOpen: false, 
        message: `${stats.keys} anahtarınız var fakat ${boxData?.title} kutunuz yok` 
      };
    }
    
    if (!hasKeys) {
      return { 
        canOpen: false, 
        message: `${boxCount} ${boxData?.title} kutunuz var fakat anahtarınız yok` 
      };
    }
    
    return { 
      canOpen: true, 
      message: `${boxCount} ${boxData?.title} kutu ve ${stats.keys} anahtarınız var` 
    };
  };

  const handleOpenBox = async () => {
    const telegramUserId = localStorage.getItem("telegramUserId");
    const status = getBoxOpeningStatus(userStats);
    
    if (!status.canOpen) {
      setError(status.message);
      return;
    }

    setError(null);
    setIsOpening(true);
    setShowReward(false);

    try {
      const reward = generateReward(boxId!);
      await updateUserStats(telegramUserId!, reward);
      
      // Ödül bilgilerini bul
      const drop = boxData?.drops.find(d => d.code === reward.code);
      if (!drop) throw new Error('Drop not found');
      
      setCurrentReward({
        code: reward.code,
        name: drop.name,
        image: drop.image,
        price: drop.price,
        rarity: drop.rarity,
        amount: reward.amount
      });
    } catch (error) {
      console.error('Error opening box:', error);
      setError('Kutu açılırken bir hata oluştu');
      setIsOpening(false);
    }
  };

  const handleBuyBox = () => {
    setShowPurchaseModal(true);
  };

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleConfirmPurchase = async () => {
    const telegramUserId = localStorage.getItem("telegramUserId");
    if (!telegramUserId || !userStats) {
      setError('User not found');
      return;
    }

    const totalPrice = parseFloat(calculateTotal());
    const userBalance = selectedPayment === 'TON' ? 
      (typeof userStats.total === 'number' ? userStats.total : 0) : 
      (typeof userStats.usdt === 'number' ? userStats.usdt : 0);
    const needed = totalPrice - userBalance;

    if (userBalance < totalPrice) {
      setNeededAmount(selectedPayment === 'USDT' ? needed : needed * (tonPrice || 0));
      setError(`You need ${needed.toFixed(2)} more ${selectedPayment} (≈ $${
        selectedPayment === 'TON' ? 
        (needed * (tonPrice || 0)).toFixed(2) : 
        needed.toFixed(2)
      })`);
      return;
    }

    try {
      setError(null);
      const userRef = doc(db, 'users', telegramUserId);
      const updates: any = {};

      if (selectedPayment === 'TON') {
        updates.total = increment(-totalPrice);
      } else {
        updates.usdt = increment(-totalPrice);
      }

      updates[`boxes.${boxData?.title}`] = increment(quantity);

      await updateDoc(userRef, updates);

      // Set success message and show snackbar
      setSuccessMessage(`Successfully purchased ${boxData?.title}!`);
      setShowSuccessSnackbar(true);
      
      // Close modal after delay
      setTimeout(() => {
        setShowPurchaseModal(false);
        setQuantity(1);
      }, 1000);

    } catch (error) {
      console.error('Error purchasing box:', error);
      setError('Error occurred while purchasing box. Please try again.');
    }
  };

  const calculateTotal = () => {
    const usdPrice = parseFloat(boxData?.salePrice || '0') * quantity;
    if (selectedPayment === 'TON' && tonPrice) {
      return (usdPrice / tonPrice).toFixed(2);
    }
    return usdPrice.toFixed(2);
  };

  const formatBalance = (value: number | undefined | null): string => {
    if (typeof value !== 'number') return '0.00';
    return value.toFixed(2);
  };

  const getUserBalance = (stats: UserStats | null, paymentType: 'TON' | 'USDT'): number => {
    if (!stats) return 0;
    return paymentType === 'TON' ? (stats.total || 0) : (stats.usdt || 0);
  };

  const canPurchase = () => {
    if (!userStats) return false;
    const totalPrice = parseFloat(calculateTotal());
    const userBalance = getUserBalance(userStats, selectedPayment);
    return userBalance >= totalPrice;
  };

  if (!boxData) {
    return (
      <Container maxWidth="lg">
        <Box //@ts-ignore
         sx={{ py: 4, textAlign: 'center' }}>
          <Typography variant="h4" sx={{ color: 'white' }}>
            Box not found
          </Typography>
          <Button
            onClick={() => navigate('/latest-booba/mystery-box')}
            sx={{ mt: 2, color: 'white' }}
          >
            Go Back
          </Button>
        </Box>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  const {
    title,
    image,
    description,
    normalPrice,
    salePrice,
    drops
  } = boxData;

  const status = getBoxOpeningStatus(userStats);

  return (
    <Container  maxWidth="lg">
      {/* Return Button */}
      <Box sx={{ py: 2 }}>
        <IconButton 
          onClick={() => navigate('/latest-booba/mystery-box')}
          sx={{ color: 'white' }}
        >
          <ArrowBackIcon /> 
          <Typography sx={{ ml: 1, color: 'white' }}>
            Return to Boxes
          </Typography>
        </IconButton>
      </Box>

      {/* Main Content */}
    
        {/* Box Info Section */}
        <Box sx={{ 
          background: commonStyles.bgGradient,
          borderRadius: '15px',
          p: 3,
      
          border: `1px solid ${commonStyles.borderColor}`,
          '&:hover': {
            border: `1px solid ${commonStyles.hoverBorderColor}`,
            boxShadow: commonStyles.buttonHoverShadow
          }
        }}>
          <Grid container spacing={4}>
            {/* Left Side - Image */}
            <Grid item xs={12} sx={{ textAlign: 'center' }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Box
                  component="img"
                  src={image}
                  alt={title}
                  sx={{
              
                    width: '50%',
                    height: 'auto',
                    margin: '0 auto',
                    display: 'block'
                  }}
                />
              </motion.div>
            </Grid>

            {/* Right Side - Info */}
            <Grid mt={-3} item xs={12}>
                <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
                  {title} 
                </Typography>

                <Typography sx={{ 
                  color: 'rgba(255,255,255,0.7)', 
                  textAlign: 'center', 
                  maxWidth: '800px', 
                  margin: '0 auto', 
                  px: 2,
                  fontSize: boxId === 'mystery-gift' ? '0.8rem' : '1rem',
                  lineHeight: boxId === 'mystery-gift' ? '1.6' : '1.5'
                }}>
                  {boxId === 'mystery-gift' 
                    ? "Deposit TON and collect FREE Mystery Box. Start collecting now and join thousands of winners." 
                    : description
                  }
                </Typography>

                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: 2,
                  height: '60px',
                  position: 'relative',
                  mt: 2
                }}>
                  <Typography
                    sx={{
                      color: 'rgba(255,255,255,0.5)',
                      textDecoration: 'line-through',
                      fontSize: '1.2rem',
                      position: 'relative',
                      zIndex: 1,
                      display: 'block'
                    }}
                  >
                    ${normalPrice}  
                  </Typography>
                  <Typography
                    sx={{
                      color: '#89d9ff',
                      fontWeight: 'bold',
                      fontSize: '2.5rem',
                      position: 'relative',
                    }}
                  >
                    ${salePrice}
                  </Typography>
                </Box>

                <Box sx={{ px:2 }}>
                  {error && (
                    <Typography sx={{ color: '#ff4444', mb: 2, textAlign: 'center' }}>
                      {error}
                    </Typography>
                  )}
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={handleOpenBox}
                    disabled={!status.canOpen || isOpening}
                    sx={{
                      textTransform: 'none',
                      background: commonStyles.primaryGradient,
                      color: 'black',
                     
                      '&.Mui-disabled': {
                        background: 'rgba(110, 211, 255, 0.1)',
                        color: 'rgba(255, 255, 255, 0.4)'
                      }
                    }}
                  >
                    {isOpening ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      <>
                        {!status.canOpen ? 'Open Box' : 'Open Box'}
                      </>
                    )}
                  </Button>

                  {!status.canOpen && (
                    <>
                      {boxId === 'mystery-gift' ? 
                        (userStats?.giftBox && userStats.giftBox > 0 && !userStats?.keys) ? (
                          <Button
                            variant="contained"
                            fullWidth
                            onClick={() => navigate('/latest-booba/mystery-box', { state: { defaultTab: 'craft' } })}
                            sx={{
                              mt: 1,
                              background: 'linear-gradient(90deg, #6C7BDC, #6C7BDC80)',
                              color: 'white',
                              textTransform: 'none',
                            }}
                          >
                            Craft Key
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
                            fullWidth
                            onClick={() => setShowDepositDrawer(true)}
                            sx={{
                              mt: 1,
                              background: 'linear-gradient(90deg, #0088CC, #00A3FF)',
                              color: 'white',
                              textTransform: 'none',
                            }}
                          >
                            Deposit Now
                          </Button>
                        )
                      : // Normal kutular için
                        ((userStats?.boxes?.[boxData?.title] || 0) > 0 && !userStats?.keys) ? (
                          <Button
                            variant="contained"
                            fullWidth
                            onClick={() => navigate('/latest-booba/mystery-box', { state: { defaultTab: 'craft' } })}
                            sx={{
                              mt: 1,
                              background: 'linear-gradient(90deg, #6C7BDC, #6C7BDC80)',
                              color: 'white',
                              textTransform: 'none',
                            }}
                          >
                            Craft Key
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
                            fullWidth
                            onClick={handleBuyBox}
                            sx={{
                              mt: 1,
                              background: 'linear-gradient(90deg, #4CAF50, #45a049)',
                              color: 'white',
                              textTransform: 'none',
                            }}
                          >
                            Buy Box
                          </Button>
                        )
                      }
                    </>
                  )}

                   <Typography sx={{ color: 'rgba(255,255,255,0.7)', mt: 1, textAlign: 'center' }}>
                    {status.message}
                  </Typography>
                  <Box
                    sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    gap: 2, 
                    mt: 1, mb:1
                  }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 0.5,
                      background: 'rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      px: 2,
                    }}>
                      <PackageOpenIcon />
                      <Typography color="white" fontSize="0.9rem">
                        {boxId === 'mystery-gift' ? userStats?.giftBox || 0 : userStats?.boxes?.[boxData?.title] || 0}
                      </Typography>
                    </Box>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 0.5,
                      background: 'rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      px: 2,
                      py: 1
                    }}>
                      <KeyIcon sx={{ color: 'white', fontSize: '1.2rem' }} />
                      <Typography color="white" fontSize="0.9rem">
                        {userStats?.keys || 0}
                      </Typography>
                    </Box>
                  </Box>
                 
                </Box>

                {/* Box Opening Animation Modal */}
                <BoxOpenAnimation 
                  isOpening={isOpening} 
                  onAnimationComplete={() => {
                    setIsOpening(false);
                    setShowReward(true);
                  }}
                  onClose={() => setIsOpening(false)}
                />

                {/* Reward Display Modal */}
                {currentReward && (
                  <RewardDisplay 
                    reward={currentReward} 
                    isVisible={showReward}
                    onClose={() => {
                      setShowReward(false);
                      setCurrentReward(null);
                    }}
                  />
                )}
             
            </Grid>
          </Grid>
        </Box>

        {/* Drops Section */}
        <Box sx={{ mt: 4, mb:14, borderRadius: '20px' }}>
          <Typography variant="h5" sx={{ color: '#6C7BDC',  fontWeight: 'bold' }}>
            Drops in {title} ({drops.length})
          </Typography>
          <Typography variant="subtitle1" sx={{ color: 'white', mb: 1 }}>
            Unbox to collect one of products below:
          </Typography>
          
          <Grid container spacing={1}>
            {drops.sort((a, b) => a.rarity - b.rarity).map((item, index) => (
              <Grid item xs={6} key={index}>
                <Box
                  sx={{
                    position: 'relative',
                    bgcolor: '#1a1b23',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    height: '30vh',
                    transition: 'transform 0.2s',
                    borderTop: '2px solid',
borderBottom:'2px solid',                    borderColor: () => {
                      const rarity = item.rarity;
                      if (rarity < 0.001) return '#e4c03d'; // Ultra Rare - Gold
                      if (rarity < 0.01) return '#ff4d4d'; // Very Rare - Red
                      if (rarity < 0.05) return '#9147ff'; // Rare - Purple
                      if (rarity < 0.1) return '#4287f5'; // Uncommon - Blue
                      return '#808080'; // Common - Gray
                    },
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      color: 'white',
                      fontWeight: 'bold',
                      p: 2,
                      pb: 0,
                      fontSize: {xs: '0.9rem', sm: '1.2rem'},
                    }}
                  >
                    {item.name}
                  </Typography>
           
                  <Box
                    component="img"
                    src={item.image}
                    alt={item.name}
                    sx={{
                      width: '100%',
                      height: {xs: '100px'},
                      objectFit: 'contain',
                      p: 1,
                  
                    }}
                  />
                  <Box sx={{  }}>
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: '30px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        bgcolor: '#6C7BDC',
                        borderRadius: '8px',
                        px: {xs: 2, sm: 4},
                        py: {xs: 1, sm: 1.5},
                        minWidth: {xs: '120px', sm: '200px'},
                        textAlign: 'center',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: {xs: '0.9rem', sm: '1.25rem'},
                        }}
                      >
                        ${item.price}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: '5px',
                        right: '10px',
                        color: 'rgba(255,255,255,0.6)',
                        fontSize: {xs: '0.8rem', sm: '1rem'},
                      }}
                    >
                      {(item.rarity * 100).toFixed(4)}%
                    </Box>
                  </Box>
                  <Box sx={{ height: {xs: '60px', sm: '70px'} }} />
                </Box>
              </Grid>
            ))}
          </Grid>
      
      </Box>

      {/* Purchase Drawer */}
      <Drawer
        anchor="bottom"
        open={showPurchaseModal}
        onClose={() => {
          setShowPurchaseModal(false);
          setQuantity(1);
          setError(null);
        }}
        sx={{
          '& .MuiDrawer-paper': {
            background: 'linear-gradient(145deg, rgba(26,27,35,0.95) 0%, rgba(26,27,35,0.98) 100%)',
            borderLeft: `1px solid ${commonStyles.borderColor}`,
            maxHeight: '80vh'
          }
        }}
      >
        <Box sx={{
          bgcolor: '#1a1b23',
          p: { xs: 2, sm: 4 },
          borderTop: '1px solid rgba(255,255,255,0.1)',
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px',
          position: 'relative',
          height: '80vh',
          overflowY: 'auto'
        }}>
          <IconButton
            onClick={() => {
              setShowPurchaseModal(false);
              setQuantity(1);
            }}
            sx={{
              position: 'absolute',
              right: { xs: 8, sm: 16 },
              top: { xs: 8, sm: 16 },
              color: 'white',
            }}
          >
            <CloseIcon />
          </IconButton>

          <Typography variant="h4" sx={{ 
            color: 'white', 
            textAlign: 'center', 
            mb: { xs: 2, sm: 4 },
            fontSize: { xs: '1.5rem', sm: '2rem' },
            fontWeight: 'bold'
          }}>
            Buy {title}
          </Typography>

          <Box
            component="img"
            src={image}
            alt={title}
            sx={{
              width: { xs: '150px', sm: '200px' },
              height: 'auto',
              display: 'block',
              margin: '0 auto',
              mb: { xs: 2, sm: 4 },
            }}
          />

          <Typography variant="h6" sx={{ 
            color: 'white', 
            textAlign: 'center', 
            mb: 2,
            fontSize: { xs: '1rem', sm: '1.25rem' },
            opacity: 0.9
          }}>
            Number of boxes to purchase
          </Typography>

          {/* Quantity Selection Buttons */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            gap: { xs: 1, sm: 2 },
            mb: { xs: 3, sm: 4 },
          }}>
            <IconButton 
              onClick={() => handleQuantityChange(-1)}
              sx={{ 
                color: 'white',
                background: 'rgba(110, 211, 255, 0.05)',
                border: '1px solid rgba(110, 211, 255, 0.1)',
                borderRadius: '12px',
                width: { xs: 40, sm: 48 },
                height: { xs: 40, sm: 48 },
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'rgba(110, 211, 255, 0.15)',
                  border: '1px solid rgba(110, 211, 255, 0.3)',
                  transform: 'scale(1.05)',
                  boxShadow: '0 8px 32px rgba(110, 211, 255, 0.15)'
                },
                '&:active': {
                  transform: 'scale(0.95)'
                }
              }}
            >
              <RemoveIcon sx={{ 
                fontSize: { xs: '1.2rem', sm: '1.5rem' },
                color: '#6ed3ff'
              }} />
            </IconButton>
            <Typography 
              sx={{ 
                color: '#6ed3ff',
                fontSize: { xs: '1.5rem', sm: '2rem' },
                minWidth: { xs: '120px', sm: '150px' },
                textAlign: 'center',
                background: 'rgba(110, 211, 255, 0.05)',
                borderRadius: '12px',
                py: { xs: 0.8, sm: 1 },
                border: '1px solid rgba(110, 211, 255, 0.1)',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'rgba(110, 211, 255, 0.08)',
                  border: '1px solid rgba(110, 211, 255, 0.2)',
                }
              }}
            >
              {quantity}
            </Typography>
            <IconButton 
              onClick={() => handleQuantityChange(1)}
              sx={{ 
                color: 'white',
                background: 'rgba(110, 211, 255, 0.05)',
                border: '1px solid rgba(110, 211, 255, 0.1)',
                borderRadius: '12px',
                width: { xs: 40, sm: 48 },
                height: { xs: 40, sm: 48 },
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'rgba(110, 211, 255, 0.15)',
                  border: '1px solid rgba(110, 211, 255, 0.3)',
                  transform: 'scale(1.05)',
                  boxShadow: '0 8px 32px rgba(110, 211, 255, 0.15)'
                },
                '&:active': {
                  transform: 'scale(0.95)'
                }
              }}
            >
              <AddIcon sx={{ 
                fontSize: { xs: '1.2rem', sm: '1.5rem' },
                color: '#6ed3ff'
              }} />
            </IconButton>
          </Box>

          {/* Payment Method Selection */}
          <Box sx={{ 
            display: 'flex',
            gap: 2,
            mb: 2
          }}>
            <Button
              onClick={() => setSelectedPayment('TON')}
              sx={{
                flex: 1,
                height: '64px',
                background: selectedPayment === 'TON' 
                  ? 'rgba(110, 211, 255, 0.15)'
                  : 'rgba(110, 211, 255, 0.05)',
                border: `1px solid ${selectedPayment === 'TON' ? 'rgba(110, 211, 255, 0.3)' : 'rgba(110, 211, 255, 0.1)'}`,
                borderRadius: '12px',
                transition: 'all 0.3s ease',
                transform: selectedPayment === 'TON' ? 'scale(1.02)' : 'scale(1)',
                boxShadow: selectedPayment === 'TON' ? '0 8px 32px rgba(110, 211, 255, 0.15)' : 'none',
                '&:hover': {
                  background: selectedPayment === 'TON'
                    ? 'rgba(110, 211, 255, 0.2)'
                    : 'rgba(110, 211, 255, 0.1)',
                  transform: 'scale(1.02)',
                  boxShadow: '0 8px 32px rgba(110, 211, 255, 0.2)'
                }
              }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <Typography sx={{ 
                  color: selectedPayment === 'TON' ? '#6ed3ff' : 'rgba(255,255,255,0.6)',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  mb: 0.5
                }}>
                  TON
                </Typography>
                <Typography sx={{ 
                  color: 'rgba(255,255,255,0.5)',
                  fontSize: '0.8rem',
                  textTransform: 'none'
                }}>
                  Balance: {formatBalance(userStats?.total)}
                </Typography>
              </Box>
            </Button>

            <Button
              onClick={() => setSelectedPayment('USDT')}
              sx={{
                flex: 1,
                height: '64px',
                background: selectedPayment === 'USDT' 
                  ? 'rgba(38, 161, 123, 0.15)'
                  : 'rgba(110, 211, 255, 0.05)',
                border: `1px solid ${selectedPayment === 'USDT' ? 'rgba(38, 161, 123, 0.3)' : 'rgba(110, 211, 255, 0.1)'}`,
                borderRadius: '12px',
                transition: 'all 0.3s ease',
                transform: selectedPayment === 'USDT' ? 'scale(1.02)' : 'scale(1)',
                boxShadow: selectedPayment === 'USDT' ? '0 8px 32px rgba(38, 161, 123, 0.15)' : 'none',
                '&:hover': {
                  background: selectedPayment === 'USDT'
                    ? 'rgba(38, 161, 123, 0.2)'
                    : 'rgba(110, 211, 255, 0.1)',
                  transform: 'scale(1.02)',
                  boxShadow: '0 8px 32px rgba(38, 161, 123, 0.2)'
                }
              }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <Typography sx={{ 
                  color: selectedPayment === 'USDT' ? '#26A17B' : 'rgba(255,255,255,0.6)',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  mb: 0.5
                }}>
                  USDT
                </Typography>
                <Typography sx={{ 
                  color: selectedPayment === 'USDT' ? 'rgba(38, 161, 123, 0.7)' : 'rgba(255,255,255,0.5)',
                  fontSize: '0.8rem',
                  textTransform: 'none'
                }}>
                  Balance: ${formatBalance(userStats?.usdt)}
                </Typography>
              </Box>
            </Button>
          </Box>

          {/* Total Amount Display - New Simple Design */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
            px: 1
          }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1.5 
            }}>
              <Box component="img"
                src={selectedPayment === 'TON' ? tonLogo : usdtLogo}
                alt={selectedPayment}
                sx={{
                  width: '24px',
                  height: '24px',
                  objectFit: 'contain'
                }}
              />
              <Typography sx={{ 
                color: 'rgba(255,255,255,0.6)',
                fontSize: '0.9rem',
                fontWeight: '500'
              }}>
                Total Amount
              </Typography>
            </Box>

            <Box sx={{ 
              display: 'flex', 
              alignItems: 'flex-end',
              flexDirection: 'column',
              gap: 0.5
            }}>
              <Typography sx={{ 
                color: selectedPayment === 'USDT' ? '#26A17B' : '#6ed3ff',
                fontSize: { xs: '1.8rem', sm: '2rem' },
                fontWeight: '700',
                lineHeight: 1,
                mt:2,
                letterSpacing: '0.5px'
              }}>
                {calculateTotal()} {selectedPayment}
              </Typography>
              {selectedPayment === 'TON' ? (
                tonPrice && (
                  <Typography sx={{ 
                    color: 'rgba(255,255,255,0.5)',
                    fontSize: '0.85rem'
                  }}>
                    ≈ ${(parseFloat(calculateTotal()) * tonPrice).toFixed(2)}
                  </Typography>
                )
              ) : (
                <Typography sx={{ 
                  color: 'rgba(255,255,255,0.5)',
                  fontSize: '0.85rem'
                }}>
                  ≈ ${parseFloat(calculateTotal()).toFixed(2)}
                </Typography>
              )}
            </Box>
          </Box>

          {/* Error Messages with improved design */}
          {error && !error.includes('Successfully') && (
            <Box sx={{ 
              width: '100%', 
              mb: 3,
              background: 'linear-gradient(135deg, rgba(244, 67, 54, 0.05), rgba(244, 67, 54, 0.02))',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(244, 67, 54, 0.2)',
              borderRadius: '16px',
              p: 3,
              boxShadow: '0 8px 32px rgba(244, 67, 54, 0.1)',
              animation: 'slideIn 0.3s ease',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2
            }}>
              <Typography sx={{ 
                color: '#ff4444',
                textAlign: 'center',
                fontSize: '1rem',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <Box component="span" sx={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'rgba(244, 67, 54, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px'
                }}>
                  !
                </Box>
                {error}
              </Typography>
              
              {neededAmount > 0 && (
                <Box sx={{ 
                  display: 'flex',
                  gap: 2,
                  width: '100%',
                  maxWidth: '400px'
                }}>
                  {selectedPayment === 'TON' ? (
                    <Button
                      fullWidth
                      onClick={() => setShowDepositDrawer(true)}
                      sx={{
                        background: 'linear-gradient(135deg, #0088CC, #00A3FF)',
                        color: 'white',
                        py: 1.5,
                        px: 4,
                        borderRadius: '12px',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        textTransform: 'none',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 15px rgba(0, 136, 204, 0.3)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #00A3FF, #0088CC)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 6px 20px rgba(0, 136, 204, 0.4)'
                        },
                        '&:active': {
                          transform: 'translateY(0)'
                        }
                      }}
                    >
                      Deposit TON
                    </Button>
                  ) : (
                    <Button
                      fullWidth
                      onClick={() => setShowSwapDrawer(true)}
                      sx={{
                        background: 'linear-gradient(135deg, #26A17B, #32D6A6)',
                        color: 'white',
                        py: 1.5,
                        px: 4,
                        borderRadius: '12px',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        textTransform: 'none',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 15px rgba(38, 161, 123, 0.3)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #32D6A6, #26A17B)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 6px 20px rgba(38, 161, 123, 0.4)'
                        },
                        '&:active': {
                          transform: 'translateY(0)'
                        }
                      }}
                    >
                      Get USDT
                    </Button>
                  )}
                </Box>
              )}
            </Box>
          )}

          <style>
            {`
              @keyframes slideIn {
                from {
                  opacity: 0;
                  transform: translateY(-20px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
              @keyframes pulse {
                0% {
                  opacity: 0.5;
                }
                50% {
                  opacity: 0.2;
                }
                100% {
                  opacity: 0.5;
                }
              }
            `}
          </style>

          {/* Confirm Purchase Button */}
          <Button
            variant="contained"
            fullWidth
            onClick={handleConfirmPurchase}
            disabled={!canPurchase()}
            sx={{
              position: 'relative',
              overflow: 'hidden',
              background: !canPurchase()
                ? 'rgba(110, 211, 255, 0.05)'
                : selectedPayment === 'USDT'
                  ? 'linear-gradient(135deg, #26A17B 0%, #32D6A6 100%)'
                  : 'linear-gradient(135deg, #6ed3ff 0%, #6ed3ff80 100%)',
              color: !canPurchase()
                ? 'rgba(255,255,255,0.3)'
                : 'white',
              fontSize: { xs: '1.2rem', sm: '1.4rem' },
              fontWeight: 'bold',
              py: { xs: 2, sm: 2.5 },
              borderRadius: '16px',
              textTransform: 'none',
              boxShadow: !canPurchase() 
                ? 'none' 
                : selectedPayment === 'USDT'
                  ? '0 8px 32px rgba(38, 161, 123, 0.2)'
                  : '0 8px 32px rgba(110, 211, 255, 0.2)',
              border: !canPurchase()
                ? '1px solid rgba(110, 211, 255, 0.1)'
                : 'none',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              mb: !canPurchase() ? 2 : 0,
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '200%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                transition: 'all 0.5s ease',
              },
              '&:hover': {
                background: !canPurchase()
                  ? 'rgba(110, 211, 255, 0.05)'
                  : selectedPayment === 'USDT'
                    ? 'linear-gradient(135deg, #32D6A6 0%, #26A17B 100%)'
                    : 'linear-gradient(135deg, #6ed3ff80 0%, #6ed3ff 100%)',
                boxShadow: !canPurchase() 
                  ? 'none' 
                  : selectedPayment === 'USDT'
                    ? '0 12px 40px rgba(38, 161, 123, 0.3)'
                    : '0 12px 40px rgba(110, 211, 255, 0.3)',
                transform: !canPurchase() ? 'none' : 'translateY(-2px)',
                '&::before': {
                  left: '100%'
                }
              }
            }}
          >
            {!canPurchase() ? (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: '-2px',
                  left: '-10px',
                  right: '-10px',
                  bottom: '-2px',
                  background: 'linear-gradient(90deg, transparent, rgba(110, 211, 255, 0.1), transparent)',
                  animation: 'pulse 2s infinite'
                }
              }}>
                <Box component="span" sx={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'rgba(110, 211, 255, 0.1)',
                  border: '1px solid rgba(110, 211, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  color: '#6ed3ff',
                  fontWeight: 'bold'
                }}>
                  !
                </Box>
                <Box component="span" sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: 0.2
                }}>
                  <Typography sx={{ 
                    fontSize: { xs: '1rem', sm: '1.1rem' },
                    color: 'rgba(255,255,255,0.5)',
                    fontWeight: 'normal'
                  }}>
                    Insufficient Balance
                  </Typography>
                 
                </Box>
              </Box>
            ) : (
              'Confirm Purchase'
            )}
          </Button>

          {/* Quick Action Button - Only show if balance is insufficient */}
          {!canPurchase() && (
            <Button
              fullWidth
              onClick={() => selectedPayment === 'TON' ? setShowDepositDrawer(true) : setShowSwapDrawer(true)}
              sx={{
                background: selectedPayment === 'TON' 
                  ? 'rgba(0, 136, 204, 0.1)'
                  : 'rgba(38, 161, 123, 0.1)',
                color: selectedPayment === 'TON' ? '#00A3FF' : '#32D6A6',
                py: 1.5,
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: 'bold',
                textTransform: 'none',
                border: `1px solid ${selectedPayment === 'TON' 
                  ? 'rgba(0, 136, 204, 0.2)' 
                  : 'rgba(38, 161, 123, 0.2)'}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: selectedPayment === 'TON'
                    ? 'rgba(0, 136, 204, 0.15)'
                    : 'rgba(38, 161, 123, 0.15)',
                  transform: 'translateY(-2px)',
                  boxShadow: selectedPayment === 'TON'
                    ? '0 8px 32px rgba(0, 136, 204, 0.2)'
                    : '0 8px 32px rgba(38, 161, 123, 0.2)'
                }
              }}
            >
              {selectedPayment === 'TON' ? 'Deposit TON' : 'Get USDT'}
            </Button>
          )}
        </Box>
      </Drawer>

      {/* Deposit Drawer */}
      <DepositDrawer
        open={showDepositDrawer}
        onClose={() => setShowDepositDrawer(false)}
      />

      {/* Swap Drawer */}
      <SwapDrawer
        open={showSwapDrawer}
        onClose={() => setShowSwapDrawer(false)}
        defaultAmount={neededAmount}
        onSwapComplete={() => {
          setShowSwapDrawer(false);
          setError(null);
        }}
      />

      {/* Add Snackbar at the end of the component */}
      <Snackbar
        open={showSuccessSnackbar}
        autoHideDuration={3000}
        onClose={() => setShowSuccessSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setShowSuccessSnackbar(false)}
          severity="success"
          sx={{ 
            background: 'linear-gradient(135deg, #4CAF50, #45a049)',
            color: 'white',
            '& .MuiAlert-icon': {
              color: 'white'
            }
          }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default BoxDetail; 