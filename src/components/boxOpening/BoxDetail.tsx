import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Container, Grid, IconButton, CircularProgress, Drawer, ButtonGroup } from '@mui/material';
import { motion } from 'framer-motion';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, updateDoc, increment, onSnapshot, getDoc } from 'firebase/firestore';
import { db } from '../../pages/firebase';
import { generateReward, BoxReward } from '../../utils/randomizer';
import BoxOpenAnimation from './BoxOpenAnimation';
import RewardDisplay from './RewardDisplay';
import LockIcon from '@mui/icons-material/Lock';
import KeyIcon from '@mui/icons-material/Key';
import { boxesData } from '../../data/boxesData';
import CloseIcon from '@mui/icons-material/Close';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import RefreshIcon from '@mui/icons-material/Refresh';
import DepositDrawer from '../WalletDrawers/DepositDrawer';
import SwapDrawer from '../WalletDrawers/SwapDrawer';

// Import all box images





interface UserStats {
  usdt: number;
  total: number;
  keys: number;
  keyParts: number;
  totalBoxes: number;
  distributedBoxes: number;
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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showDepositDrawer, setShowDepositDrawer] = useState(false);
  const [showSwapDrawer, setShowSwapDrawer] = useState(false);
  const [neededAmount, setNeededAmount] = useState<number>(0);

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
          setUserStats(doc.data() as UserStats);
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

  const updateUserStats = async (userId: string, reward: BoxReward) => {
    const userRef = doc(db, 'users', userId);
    
    const updates: any = {
      keys: increment(-1),
      [`boxes.${boxData?.title}`]: increment(-1)
    };

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
    
    await updateDoc(userRef, updates);
  };

  const getBoxOpeningStatus = (stats: UserStats | null) => {
    if (!stats) return { canOpen: false, message: 'Veriler yükleniyor...' };
    
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
    const userBalance = selectedPayment === 'TON' ? userStats.total : userStats.usdt;
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

      setError(`Successfully purchased ${quantity} ${boxData?.title}!`);
      setTimeout(() => {
        setShowPurchaseModal(false);
        setQuantity(1);
        setError(null);
      }, 2000);

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

  const handleRefreshTonPrice = async () => {
    setIsRefreshing(true);
    try {
      const response = await axios.get(`https://api.binance.com/api/v3/ticker/price`, {
        params: { symbol: 'TONUSDT' },
      });
      const newTonPrice = parseFloat(response.data.price);
      setTonPrice(newTonPrice);
    } catch (error) {
      console.error('Error fetching TON price:', error);
    } finally {
      setTimeout(() => setIsRefreshing(false), 1000); // Keep animation for 1 second
    }
  };

  if (!boxData) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4, textAlign: 'center' }}>
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
          background: 'linear-gradient(145deg, rgba(26,27,35,0.9) 0%, rgba(26,27,35,0.95) 100%)',
          borderRadius: '20px',
          overflow: 'hidden',
    
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          backdropFilter: 'blur(10px)',
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

                <Typography sx={{ color: 'rgba(255,255,255,0.7)', textAlign: 'center', maxWidth: '800px', margin: '0 auto', px: 2 }}>
                  {description}
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
                      color: '#6C5DD3',
                      fontWeight: 'bold',
                      fontSize: '2.5rem',
                      position: 'relative',
                      zIndex: 1
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
                      background: status.canOpen ? 'linear-gradient(90deg, #6C5DD3, #8677E3)' : 'rgba(108, 93, 211, 0.15)',
                      color: 'white',
                      fontSize: '1.2rem',
                      fontWeight: 'bold',
                      '&.Mui-disabled': {
                        background: 'rgba(108, 93, 211, 0.15)',
                        color: 'rgba(255,255,255,0.3)',
                        border: '2px dashed rgba(108, 93, 211, 0.3)',
                        backdropFilter: 'blur(4px)',
                        cursor: 'not-allowed'
                      },
                      '&:not(.Mui-disabled):hover': {
                        background: 'linear-gradient(90deg, #5a4ec0, #7566d0)',
                      }
                    }}
                  >
                    {isOpening ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      <>
                        {!status.canOpen ? 'LOCKED' : 'OPEN BOX'}
                      </>
                    )}
                  </Button>

                  {!status.canOpen && (
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={handleBuyBox}
                      sx={{
                        mt: 1,
                        background: 'linear-gradient(90deg, #4CAF50, #45a049)',
                        color: 'white',
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        '&:hover': {
                          background: 'linear-gradient(90deg, #45a049, #3d8b40)',
                        }
                      }}
                    >
                      BUY BOX
                    </Button>
                  )}

                   <Typography sx={{ color: 'rgba(255,255,255,0.7)', mt: 1, textAlign: 'center' }}>
                    {status.message}
                  </Typography>
                  <Box sx={{ 
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
                      <LockIcon sx={{ color: 'white', fontSize: '1.2rem' }} />
                      <Typography color="white" fontSize="0.9rem">
                        {userStats?.boxes?.[boxData?.title] || 0}
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
      >
        <Box sx={{
          bgcolor: '#1a1b23',
          p: { xs: 2, sm: 4 },
          borderTop: '1px solid rgba(255,255,255,0.1)',
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px',
          position: 'relative',
          minHeight: { xs: '85vh', sm: '80vh' }
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
                border: '2px solid #6C5DD3',
                borderRadius: 2,
                width: { xs: 40, sm: 48 },
                height: { xs: 40, sm: 48 },
              }}
            >
              <RemoveIcon sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
            </IconButton>
            <Typography 
              sx={{ 
                color: 'white',
                fontSize: { xs: '1.5rem', sm: '2rem' },
                minWidth: { xs: '120px', sm: '150px' },
                textAlign: 'center',
                bgcolor: 'rgba(108, 93, 211, 0.1)',
                borderRadius: 2,
                py: { xs: 0.8, sm: 1 },
              }}
            >
              {quantity}
            </Typography>
            <IconButton 
              onClick={() => handleQuantityChange(1)}
              sx={{ 
                color: 'white',
                border: '2px solid #6C5DD3',
                borderRadius: 2,
                width: { xs: 40, sm: 48 },
                height: { xs: 40, sm: 48 },
              }}
            >
              <AddIcon sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
            </IconButton>
          </Box>

          <Box sx={{ mb: { xs: 3, sm: 4 } }}>
            <Typography variant="h6" sx={{ 
              color: 'white', 
              textAlign: 'center',
              mb: { xs: 1.5, sm: 2 },
              fontSize: { xs: '1rem', sm: '1.25rem' },
              opacity: 0.9
            }}>
              Select payment method
            </Typography>

            <ButtonGroup 
              variant="contained" 
              fullWidth 
              sx={{ 
                mb: { xs: 2, sm: 3 },
                '& .MuiButton-root': {
                  py: { xs: 1, sm: 1.5 },
                  fontSize: { xs: '1rem', sm: '1.1rem' },
                  fontWeight: 'bold',
                }
              }}
            >
              <Button 
                onClick={() => setSelectedPayment('TON')}
                sx={{ 
                  background: selectedPayment === 'TON' 
                    ? 'linear-gradient(90deg, #0088CC, #0099FF)'
                    : 'rgba(0,136,204,0.3)',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #0077BB, #0088EE)',
                  }
                }}
              >
                TON
              </Button>
              <Button 
                onClick={() => setSelectedPayment('USDT')}
                sx={{ 
                  background: selectedPayment === 'USDT'
                    ? 'linear-gradient(90deg, #26A17B, #2DC69D)'
                    : 'rgba(38,161,123,0.3)',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #219069, #25B58C)',
                  }
                }}
              >
                USDT
              </Button>
            </ButtonGroup>

            <Typography variant="h6" sx={{ 
              color: 'white', 
              mb: 1,
              fontSize: { xs: '1rem', sm: '1.25rem' },
              opacity: 0.9,
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}>
              Total price in {selectedPayment}
              {selectedPayment === 'TON' && tonPrice && (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  color: 'rgba(255,255,255,0.5)',
                }}>
                  <motion.div
                    animate={{ 
                      scale: isRefreshing ? [1, 1.1, 1] : 1,
                      opacity: isRefreshing ? [1, 0.7, 1] : 1 
                    }}
                    transition={{ duration: 1 }}
                  >
                    <Typography component="span" sx={{ 
                      fontSize: { xs: '0.8rem', sm: '0.9rem' },
                    }}>
                      (1 TON = ${tonPrice.toFixed(2)})
                    </Typography>
                  </motion.div>
                  <IconButton
                    onClick={handleRefreshTonPrice}
                    size="small"
                    sx={{ 
                      color: 'rgba(255,255,255,0.5)',
                      padding: 0.5,
                      '&:hover': {
                        color: 'rgba(255,255,255,0.8)',
                      }
                    }}
                  >
                    <RefreshIcon 
                      sx={{ 
                        fontSize: { xs: '0.9rem', sm: '1rem' },
                        animation: isRefreshing ? 'spin 1s linear infinite' : 'none'
                      }} 
                    />
                  </IconButton>
                </Box>
              )}
            </Typography>
            
            <style>
              {`
                @keyframes spin {
                  from {
                    transform: rotate(0deg);
                  }
                  to {
                    transform: rotate(360deg);
                  }
                }
              `}
            </style>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <Typography sx={{ 
                color: 'white', 
                fontSize: { xs: '1.2rem', sm: '1.5rem' },
                opacity: 0.9
              }}>
                Total
              </Typography>
              <Box>
                <Typography sx={{ 
                  color: '#6C5DD3', 
                  fontSize: { xs: '1.5rem', sm: '2rem' }, 
                  fontWeight: 'bold',
                  lineHeight: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  {calculateTotal()} {selectedPayment}
                  {selectedPayment === 'TON' && (
                    <Typography component="span" sx={{ 
                      color: 'rgba(255,255,255,0.4)', 
                      fontSize: { xs: '0.8rem', sm: '0.9rem' },
                      fontWeight: 'normal'
                    }}>
                      (${(parseFloat(calculateTotal()) * (tonPrice || 0)).toFixed(2)})
                    </Typography>
                  )}
                </Typography>
              </Box>
            </Box>
          </Box>

          {error && !error.includes('Successfully') && (
            <Box sx={{ width: '100%', mb: 2 }}>
              <Typography sx={{ 
                color: '#f44336',
                textAlign: 'center',
                fontSize: { xs: '0.9rem', sm: '1rem' },
                mb: 2
              }}>
                {error}
              </Typography>
              
              {neededAmount > 0 && selectedPayment === 'TON' && (
                <Button
                  fullWidth
                  onClick={() => setShowDepositDrawer(true)}
                  sx={{
                    background: 'linear-gradient(90deg, #0088CC, #0099FF)',
                    color: 'white',
                    py: 1.5,
                    borderRadius: 2,
                    fontSize: '1rem',
                    mb: 1
                  }}
                >
                  Deposit TON
                </Button>
              )}

              {neededAmount > 0 && selectedPayment === 'USDT' && (
                <Button
                  fullWidth
                  onClick={() => setShowSwapDrawer(true)}
                  sx={{
                    background: 'linear-gradient(90deg, #26A17B, #2DC69D)',
                    color: 'white',
                    py: 1.5,
                    borderRadius: 2,
                    fontSize: '1rem',
                    mb: 1
                  }}
                >
                  Swap to USDT
                </Button>
              )}
            </Box>
          )}

          <Button
            variant="contained"
            fullWidth
            onClick={handleConfirmPurchase}
            disabled={!!error && !error.includes('Successfully')}
            sx={{
              background: error && !error.includes('Successfully')
                ? 'rgba(76, 175, 80, 0.15)'
                : 'linear-gradient(90deg, #4CAF50, #45a049)',
              color: error && !error.includes('Successfully')
                ? 'rgba(255,255,255,0.3)'
                : 'white',
              fontSize: { xs: '1.2rem', sm: '1.5rem' },
              fontWeight: 'bold',
              py: { xs: 1.5, sm: 2 },
              borderRadius: 2,
              border: error && !error.includes('Successfully')
                ? '2px dashed rgba(76, 175, 80, 0.3)'
                : 'none',
              '&:hover': {
                background: error && !error.includes('Successfully')
                  ? 'rgba(76, 175, 80, 0.15)'
                  : 'linear-gradient(90deg, #45a049, #3d8b40)',
              },
              '&.Mui-disabled': {
                background: 'rgba(76, 175, 80, 0.15)',
                color: 'rgba(255,255,255,0.3)',
                border: '2px dashed rgba(76, 175, 80, 0.3)',
              }
            }}
          >
            CONFIRM PURCHASE
          </Button>
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
    </Container>
  );
};

export default BoxDetail; 