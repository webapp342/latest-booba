import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Button, CircularProgress, Grid, Card, TextField, InputAdornment, Tabs, Tab, Modal } from '@mui/material';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import BoxOpenAnimation from './BoxOpenAnimation';
import RewardDisplay from './RewardDisplay';
import KeyCrafting from './KeyCrafting';
import { useNavigate, useLocation } from 'react-router-dom';
import { db } from '../../pages/firebase';
import { doc, updateDoc, increment, onSnapshot, getDoc } from 'firebase/firestore';
import { boxesData } from '../../data/boxesData';
import SearchIcon from '@mui/icons-material/Search';
import { PackageOpenIcon } from 'lucide-react';
import StarIcon from '@mui/icons-material/Star';
import SwapDrawer from '../WalletDrawers/SwapDrawer';
import ticketImage from '../../assets/ticket.png';

// Import all box images
import alienwareImage from '../../assets/boxes/ALIENWARE.png';
import amazonImage from '../../assets/boxes/Amazon.png';
import landRoverImage from '../../assets/boxes/06_LANDROVER-Box-mock_box_1_pmWxJoo.png';
import rolexSubmarinerImage from '../../assets/boxes/06_ROLEX_SUBMARINER-Box-mock_box_HyKP6Wz.png';
import donaldTrumpImage from '../../assets/boxes/06-DONALD_TRUMP-Box-mock_box_1_Mtw3P4X.png';
import rolexYachtmasterImage from '../../assets/boxes/07_ROLEX_YACHTMASTER-Box-mock_box_1_AWKQOtA.png';
import rolexImage from '../../assets/boxes/19_ROLEX-Box-mock_box_Mf79Eyz.png';
import chanelImage from '../../assets/boxes/22-CHANEL-Box-mock_box_1_LJJWWSE.png';
import louisVuittonImage from '../../assets/boxes/LOUIS_VUITTON-Deluxe-mock_box.png';
import bmwImage from '../../assets/boxes/05-BMW-Box-mock_box_1_tcGgWnJ.png';
import primeImage from '../../assets/boxes/PRIME-Box-BLUE-mock_box_1_1_i1bhp4C.png';
import sneakersImage from '../../assets/boxes/SNEAKERS-Box-mock_box_1_1_XJ6yoyi.png';
import rolexDaytonaImage from '../../assets/boxes/01_ROLEX_DAYTONA-Box-mock_box_tgFf3C6.png';
import corsairImage from '../../assets/boxes/02-CORSAIR-Box-mock_box_1_9ex9nau.png';
import versaceImage from '../../assets/boxes/02-VERSACE-Box-mock_box_1_Eh0sKbn.png';
import footballImage from '../../assets/boxes/08_FOOTBALL_FRENZY-Box-mock_box_xTGy6uS.png';
import maseratiImage from '../../assets/boxes/09_MASERATI-Box-mock_box_nNGuE9m.png';
import topgImage from '../../assets/boxes/09-TOPG-Box-mock_box_1_DYOk6ka.png';
import porscheImage from '../../assets/boxes/11_PORSCHE-Box-mock_box_GsB1OjI.png';
import ferrariImage from '../../assets/boxes/12_FERRARI-Box-mock_box_1_gxu1E5e.png';
import oldMoneyImage from '../../assets/boxes/28_OLD_MONEY-Box-mock_box_1_NbdcPuo.png';
import cartierImage from '../../assets/boxes/Cartier_lC54zo9.png';
import diamondImage from '../../assets/boxes/Diamond-Vault_1_rL3pUUO.png';
import hublotImage from '../../assets/boxes/Hublot_wua9Wr6.png';
import giftboxImage from '../../assets/giftbox.png';

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
  level: number;
  tickets: number;
}

interface GameCard {
  id: string;
  image: string;
  title: string;
  normalPrice: string;
  salePrice: string;
  description: string;
  brand: string;
}

interface DisplayReward {
  code: string;
  name: string;
  image: string;
  price: string;
  rarity: number;
  amount: number;
}

const gameCards: GameCard[] = [
  {
    id: 'mystery-gift',
    image: giftboxImage,
    title: 'Mystery Gift Box',
    normalPrice: 'FREE',
    salePrice: 'FREE',
    description: 'Get free boxes for every deposits',
    brand: 'Special'
  },
  {
    id: 'alienware',
    image: alienwareImage,
    title: 'ALIENWARE',
    normalPrice: '16.89',
    salePrice: '14.49',
    description: 'Gaming gear from Alienware',
    brand: 'Tech'
  },
  {
    id: 'amazon',
    image: amazonImage,
    title: 'Amazon',
    normalPrice: '10.49',
    salePrice: '8.89',
    description: 'Amazon mystery box with various items',
    brand: 'Retail'
  },
  {
    id: 'landrover',
    image: landRoverImage,
    title: 'Land Rover',
    normalPrice: '199.99',
    salePrice: '169.99',
    description: 'Luxury SUV themed box with exclusive Land Rover items',
    brand: 'Automotive'
  },
  {
    id: 'rolex-submariner',
    image: rolexSubmarinerImage,
    title: 'Submariner',
     normalPrice: '89.99',
    salePrice: '85.45',
    description: 'Luxury diving watch themed box',
    brand: 'Luxury'
  },
  {
    id: 'donald-trump',
    image: donaldTrumpImage,
    title: 'Donald Trump',
    normalPrice: '6.99',
    salePrice: '5.45',
    description: 'Political memorabilia box',
    brand: 'Politics'
  },
  {
    id: 'rolex-yachtmaster',
    image: rolexYachtmasterImage,
    title: 'Yachtmaster',
    normalPrice: '199.99',
    salePrice: '149.99',
    description: 'Luxury yacht watch themed box',
    brand: 'Luxury'
  },
  {
    id: 'rolex',
    image: rolexImage,
    title: 'Rolex Collection',
 normalPrice: '299.99',
    salePrice: '249.99',
    description: 'Premium Rolex collection box',
    brand: 'Luxury'
  },


  {
    id: 'chanel',
    image: chanelImage,
    title: 'Chanel',
    normalPrice: '199.99',
    salePrice: '169.99',
    description: 'Luxury fashion box featuring Chanel items',
    brand: 'Luxury'
  },

  {
    id: 'louis-vuitton',
    image: louisVuittonImage,
    title: 'Louis Vuitton',
    normalPrice: '99.99',
    salePrice: '95.45',
    description: 'Premium Louis Vuitton fashion items',
    brand: 'Luxury'
  },

  {
    id: 'bmw',
    image: bmwImage,
    title: 'BMW Box',
    normalPrice: '189.99',
    salePrice: '159.99',
    description: 'BMW themed luxury automotive box',
    brand: 'Automotive'
  },
  {
    id: 'prime',
    image: primeImage,
    title: 'Prime Box',
    normalPrice: '39.99',
    salePrice: '34.99',
    description: 'Premium selection mystery box',
    brand: 'Various'
  },
  {
    id: 'sneakers',
    image: sneakersImage,
    title: 'Sneakers Box',
    normalPrice: '29.99', 
    salePrice: '19.99',
    description: 'Premium sneaker collection box',
    brand: 'Fashion'
  },


  {
    id: 'rolex-daytona',
    image: rolexDaytonaImage,
    title: 'Rolex Daytona',
    normalPrice: '299.99',
    salePrice: '249.99',
    description: 'Luxury racing watch themed box',
    brand: 'Luxury'
  },
  {
    id: 'corsair',
    image: corsairImage,
    title: 'Corsair Gaming',
    normalPrice: '49.99',
    salePrice: '45.99',
    description: 'Premium gaming gear box',
    brand: 'Tech'
  },
  {
    id: 'versace',
    image: versaceImage,
    title: 'Versace',
    normalPrice: '149.99',
    salePrice: '119.99',
    description: 'Luxury Italian fashion box',
    brand: 'Luxury'
  },


  {
    id: 'football-frenzy',
    image: footballImage,
    title: 'Football Frenzy',
    normalPrice: '9.99',
    salePrice: '7.45',
    description: 'Football themed mystery box',
    brand: 'Sports'
  },
  {
    id: 'maserati',
    image: maseratiImage,
    title: 'Maserati',
    normalPrice: '299.99',
    salePrice: '249.99',
    description: 'Italian luxury automotive box',
    brand: 'Automotive'
  },

  {
    id: 'topg',
    image: topgImage,
    title: 'Top G',
    normalPrice: '49.99',
    salePrice: '45.50',
    description: 'Premium lifestyle box',
    brand: 'Lifestyle'
  },
  {
    id: 'porsche',
    image: porscheImage,
    title: 'Porsche',
    normalPrice: '149.99',
    salePrice: '125.45',
    description: 'Sports car themed luxury box',
    brand: 'Automotive'
  },
  {
    id: 'ferrari',
    image: ferrariImage,
    title: 'Ferrari',
    normalPrice: '199.99',
    salePrice: '149.99',
    description: 'Italian supercar themed box',
    brand: 'Automotive'
  },


  {
    id: 'old-money',
    image: oldMoneyImage,
    title: 'Old Money',
    normalPrice: '29.99',
    salePrice: '24.99',
    description: 'Classic luxury lifestyle box',
    brand: 'Lifestyle'
  },


  {
    id: 'cartier',
    image: cartierImage,
    title: 'Cartier',
    normalPrice: '199.99',
    salePrice: '149.99',
    description: 'Luxury jewelry themed box',
    brand: 'Luxury'
  },
  {
    id: 'diamond-vault',
    image: diamondImage,
    title: 'Diamond Vault',
    normalPrice: '199.99',
    salePrice: '159.99',
    description: 'Premium diamond jewelry box',
    brand: 'Luxury'
  },
  {
    id: 'hublot',
    image: hublotImage,
    title: 'Hublot',
    normalPrice: '99.99',
    salePrice: '89.99',
    description: 'Luxury Swiss watch themed box',
    brand: 'Luxury'
  }

];

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

// Tab değerlerini enum olarak tanımla
type TabType = 'boxes' | 'drops' | 'craft';

const BoxOpening: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [isOpening, setIsOpening] = useState(false);
  const [currentReward, setCurrentReward] = useState<DisplayReward | null>(null);
  const [showReward, setShowReward] = useState(false);
  const [isCrafting, setIsCrafting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortByPrice, setSortByPrice] = useState<'asc' | 'desc'>('asc');
  const [currentTab, setCurrentTab] = useState<TabType>('boxes');
  const [dropsSortBy, setDropsSortBy] = useState<'price' | 'rarity'>('price');
  const [showLevelModal, setShowLevelModal] = useState(false);
  const [ 
    , setSelectedDrop] = useState<any>(null);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [ticketError, setTicketError] = useState('');
  const [showLevelUpSuccess, setShowLevelUpSuccess] = useState(false);
  const [showSwapDrawer, setShowSwapDrawer] = useState(false);

  // Box title mapping cache
  const boxTitleMapping = React.useMemo(() => {
    return Object.values(boxesData).reduce((acc, box) => {
      acc[box.title.toLowerCase()] = box.title;
      return acc;
    }, {} as Record<string, string>);
  }, []);

  // Get box count helper function
  const getBoxCount = React.useCallback((card: GameCard) => {
    if (card.id === 'mystery-gift') {
      return userStats?.giftBox || 0;
    }
    const boxTitle = boxTitleMapping[card.title.toLowerCase()];
    return userStats?.boxes?.[boxTitle] || 0;
  }, [userStats, boxTitleMapping]);

  useEffect(() => {
    // defaultTab state'i geldiğinde currentTab'i güncelle
    if (location.state?.defaultTab) {
      setCurrentTab(location.state.defaultTab);
      // State'i temizle ki geri geldiğinde yine boxes tab'inde başlasın
      navigate(location.pathname, { replace: true });
    }
  }, [location.state]);

  useEffect(() => {
    const telegramUserId = localStorage.getItem("telegramUserId");
    if (!telegramUserId) {
      navigate('/latest-booba/spin');
      return;
    }

    const docRef = doc(db, "users", telegramUserId);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setUserStats(docSnap.data() as UserStats);
      } else {
        setError('User data not found');
      }
      setLoading(false);
    }, (error) => {
      console.error('Error fetching user stats:', error);
      setError('Error loading data');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleCardClick = (cardId: string) => {
    navigate(`/latest-booba/box/${cardId}`);
  };

  const handleCloseReward = () => {
    setShowReward(false);
    setCurrentReward(null);
  };


  const handleCraftKey = async () => {
    const telegramUserId = localStorage.getItem("telegramUserId");
    if (!userStats || userStats.keyParts < 5) {
      setError('Yetersiz anahtar parçası');
      return;
    }

    setError(null);
    setIsCrafting(true);

    try {
      const userRef = doc(db, 'users', telegramUserId!);
      await updateDoc(userRef, {
        keyParts: increment(-5),
        keys: increment(1),
      });

      gsap.to(document.body, {
        duration: 0.2,
        scale: 1.02,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut"
      });
    } catch (error) {
      console.error('Error crafting key:', error);
      setError('Anahtar oluşturulurken bir hata oluştu');
    } finally {
      setIsCrafting(false);
    }
  };

  const renderMyDrops = () => {
    // Drops verilerinin varlığını kontrol et
    if (!userStats?.drops || Object.keys(userStats.drops).length === 0) {
      return (
        <Box //@ts-ignore
          sx={{
            textAlign: 'center',
            py: 3,
            px: 3,
            background: commonStyles.bgGradient,
            borderRadius: '15px',
            border: `1px solid ${commonStyles.borderColor}`,
            maxWidth: '600px', 
            margin: '0 auto'
          }}
        >
          <Typography variant="h5" sx={{ 
            color: 'white',
            fontWeight: 'bold',
       mt:-1,
          }}>
            No Items Found
          </Typography>
          
          <Typography sx={{ 
            color: 'rgba(255,255,255,0.7)',
            fontSize: '1rem',
            mb: 3,
            maxWidth: '400px',
            margin: '0 auto'
          }}>
            Start your collection by opening mystery boxes and discover amazing rewards!
          </Typography>

          <Box sx={{ 
            display: 'flex', 
         
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <Button
              onClick={() => setCurrentTab('boxes')}
              variant="contained"
              sx={{
                background: commonStyles.primaryGradient,
                color: 'black',
                py: 1.5,
                
                fontSize: '0.95rem',
                fontWeight: 'bold',
                textTransform: 'none',
                borderRadius: '8px',
                boxShadow: commonStyles.buttonShadow,
                mt:2,
              }}
            >
              Open Boxes
            </Button>
          </Box>
        </Box>
      );
    }

    let allDrops = Object.entries(userStats.drops).flatMap(([boxTitle, drops]) =>
      drops.map(drop => {
        // Find the box data using the exact title
        const boxData = Object.values(boxesData).find(box => box.title === boxTitle);
        const dropData = boxData?.drops.find(d => d.code === drop.code);
        
        return {
          ...drop,
          boxTitle,
          name: dropData?.name || 'Unknown Item',
          image: dropData?.image || '',
          price: dropData?.price || '0',
          rarity: dropData?.rarity || 0
        };
      })
    );

    // Filter and sort drops...
    allDrops = allDrops.filter(drop => {
      const searchString = searchTerm.toLowerCase();
      return (
        drop.name.toLowerCase().includes(searchString) ||
        drop.boxTitle.toLowerCase().includes(searchString)
      );
    });

    allDrops.sort((a, b) => {
      switch (dropsSortBy) {
        case 'price':
          return sortByPrice === 'asc' 
            ? parseFloat(a.price) - parseFloat(b.price)
            : parseFloat(b.price) - parseFloat(a.price);
        case 'rarity':
          return sortByPrice === 'asc'
            ? a.rarity - b.rarity
            : b.rarity - a.rarity;
        default:
          return 0;
      }
    });

    return (
      <Box>
        {/* Drops Summary */}
        <Box sx={{ 
          mb: 3, 
          p: 3, 
          borderRadius: '15px', 
          background: 'rgba(110, 211, 255, 0.05)',
          border: `1px solid ${commonStyles.borderColor}`
        }}>
          <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
            My Collection Summary
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                  Total Items
                </Typography>
                <Typography sx={{ color: commonStyles.primaryColor, fontWeight: 'bold', fontSize: '1.5rem' }}>
                  {allDrops.length}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                  Total Value
                </Typography>
                <Typography sx={{ color: commonStyles.primaryColor, fontWeight: 'bold', fontSize: '1.5rem' }}>
                  ${allDrops.reduce((sum, drop) => sum + parseFloat(drop.price) * drop.amount, 0).toFixed(2)}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                  Uniques
                </Typography>
                <Typography sx={{ color: commonStyles.primaryColor, fontWeight: 'bold', fontSize: '1.5rem' }}>
                  {new Set(allDrops.map(drop => drop.boxTitle)).size}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Sort Controls */}
        <Box sx={{ 
          mb: 3, 
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          width: '100%'
        }}>
          <Box sx={{ 
            display: 'flex', 
            gap: 1, 
            flex: 2
          }}>
            {['price', 'rarity'].map((sortType) => (
              <Button
                key={sortType}
                onClick={() => setDropsSortBy(sortType as 'price' | 'rarity')}
                variant={dropsSortBy === sortType ? 'contained' : 'outlined'}
                size="small"
                fullWidth
                sx={{
                  color: dropsSortBy === sortType ? 'white' : 'rgba(255,255,255,0.7)',
                  borderColor: commonStyles.borderColor,
                  backgroundColor: dropsSortBy === sortType ? commonStyles.primaryColor : 'transparent',
                  '&:hover': {
                    backgroundColor: dropsSortBy === sortType ? '#8ee9ff' : 'rgba(110, 211, 255, 0.1)'
                  },
                  fontSize: '0.8rem',
                  letterSpacing: 0.1,
                  textTransform: 'none',
                  height: '36px'
                }}
              >
                {sortType.charAt(0).toUpperCase() + sortType.slice(1)}
              </Button>
            ))}
          </Box>
          <Button
            onClick={() => setSortByPrice(prev => prev === 'asc' ? 'desc' : 'asc')}
            variant="outlined"
            size="small"
            fullWidth
            sx={{
              flex: 1,
              color: 'white',
              borderColor: commonStyles.borderColor,
              fontSize: '0.8rem',
              letterSpacing: 0.1,
              textTransform: 'none',
              height: '36px'
            }}
          >
            {sortByPrice === 'asc' ? '↑ Ascending' : '↓ Descending'}
          </Button>
        </Box>

        {/* Drops Grid */}
        <Grid container spacing={2}>
          {allDrops.map((drop, index) => (
            <Grid item xs={12} sm={6} md={4} key={`${drop.code}-${index}`}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card sx={{
                  position: 'relative',
                  background: 'linear-gradient(145deg, rgba(26,27,35,0.9) 0%, rgba(26,27,35,0.95) 100%)',
                  borderRadius: '15px',
                  overflow: 'hidden',
                  border: `1px solid ${commonStyles.borderColor}`,
                  height: '100%',
                  transition: 'transform 0.2s',
                  minHeight: '420px',
                }}>
                  {/* Image Container */}
                  <Box sx={{ 
                    position: 'relative', 
                    pt: '75%',
                    background: 'linear-gradient(45deg, rgba(108,93,211,0.1) 0%, rgba(108,93,211,0.05) 100%)'
                  }}>
                    <Box
                      component="img"
                      src={drop.image}
                      alt={drop.name}
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        mb:1,
                        objectFit: 'contain',
                        p: 0.5
                      }}
                    />
                    {/* Rarity Badge */}
                    <Box //ts-ignore
                    sx={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      background: 'rgba(108,93,211,0.9)',
                      borderRadius: '12px',
                      px: 1.5,
                      py: 0.5
                    }}>
                      <Typography sx={{ color: 'white', fontSize: '0.8rem', fontWeight: 'bold' }}>
                        {(drop.rarity * 100).toFixed(2)}% Rare
                      </Typography>
                    </Box>
                  </Box>

                  {/* Content */}
                  <Box //ts-ignore
                  sx={{ p: 2 }}>
                    {/* Title and Source */}
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="h6" sx={{ 
                        color: 'white', 
                        fontWeight: 'bold', 
                        fontSize: '1.1rem',
                        mb: 0.5
                      }}>
                        {drop.name}
                      </Typography>
                      <Typography sx={{ 
                        color: 'rgba(255,255,255,0.7)', 
                        fontSize: '0.85rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5
                      }}>
                        From: {drop.boxTitle}
                      </Typography>
                    </Box>

                    {/* Price and Amount */}
                    <Box //ts-ignore
                     sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: 'rgba(108,93,211,0.1)',
                      borderRadius: '12px',
                      p: 1.5,
                      mb: 2
                    }}>
                      <Box>
                        <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>
                          Value
                        </Typography>
                        <Typography sx={{ color: commonStyles.primaryColor, fontWeight: 'bold', fontSize: '1.2rem' }}>
                          ${drop.price}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>
                          Amount
                        </Typography>
                        <Typography sx={{ color: commonStyles.primaryColor, fontWeight: 'bold', fontSize: '1.2rem' }}>
                          {drop.amount}x
                        </Typography>
                      </Box>
                    </Box>

                    {/* Sell Item Button */}
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSellItem(drop);
                      }}
                      sx={{
                        background: 'linear-gradient(90deg, #6ed3ff, #8ee9ff)',
                        color: 'black',
                        py: 1.5,
                        fontSize: '0.95rem',
                        fontWeight: 'bold',
                        textTransform: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(110,211,255,0.3)',
                        '&:hover': {
                          background: 'linear-gradient(90deg, #8ee9ff, #6ed3ff)',
                          boxShadow: '0 6px 16px rgba(110,211,255,0.4)',
                        }
                      }}
                    >
                      Sell Item for ${(parseFloat(drop.price) * drop.amount).toFixed(2)}
                    </Button>
                  </Box>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };

  // Update getLevelRequirements function

  // Update handleLevelUpgrade function
  const handleLevelUpgrade = async () => {
    setIsUpgrading(true);
    setTicketError('');

    const telegramUserId = localStorage.getItem("telegramUserId");
    if (!telegramUserId) {
      setTicketError('User ID not found');
      setIsUpgrading(false);
      return;
    }

    try {
      const userRef = doc(db, "users", telegramUserId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        setTicketError('User data not found');
        setIsUpgrading(false);
        return;
      }

      const userData = userDoc.data();
      const currentLevel = userData.level || 0;
      const nextLevel = currentLevel + 1;
      const requiredTickets = nextLevel;
      
      if (!userData.tickets || userData.tickets < requiredTickets) {
        setTicketError(`Not enough tickets. Need ${requiredTickets} tickets for level ${nextLevel}`);
        setIsUpgrading(false);
        return;
      }

      await updateDoc(userRef, {
        level: nextLevel,
        tickets: userData.tickets - requiredTickets,
        lastLevelUpgrade: new Date().toISOString(),
        upgradeTransaction: {
          amount: requiredTickets,
          timestamp: new Date().toISOString(),
          type: 'TICKET_UPGRADE',
          fromLevel: currentLevel,
          toLevel: nextLevel
        }
      });

      setShowLevelModal(false);
      setShowLevelUpSuccess(true);
      
      setTimeout(() => {
        setShowLevelUpSuccess(false);
      }, 2000);

    } catch (error) {
      console.error("Error processing level upgrade:", error);
      setTicketError('Failed to process upgrade. Please try again.');
    } finally {
      setIsUpgrading(false);
    }
  };

  // Update handleSellItem function
  const handleSellItem = async (drop: any) => {
    const telegramUserId = localStorage.getItem("telegramUserId");
    if (!telegramUserId) return;

    const currentLevel = userStats?.level || 0;
    if (currentLevel < 200) {
      setSelectedDrop(drop);
      setShowLevelModal(true);
      return;
    }

    // TODO: Implement actual sell functionality
    console.log('Selling item:', drop);
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box 
        //@ts-ignore
        sx={{
           display: 'flex', 
           justifyContent: 'center', 
           alignItems: 'center', 
           minHeight: '60vh' 
           }}>

          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4, pb: 25 }}>
        {/* Search Bar - Only show for boxes and drops tabs */}
        {currentTab !== 'craft' && (
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'stretch' }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder={currentTab === 'boxes' ? "Search boxes..." : "Search drops..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'white' }} />
                    </InputAdornment>
                  ),
                  sx: {
                    color: 'white',
                    height: '100%',
                    '& .MuiOutlinedInput-root': {
                      height: '100%'
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255,255,255,0.2)',
                    },
                  },
                }}
                sx={{
                  '& .MuiInputBase-root': {
                    height: '48px'
                  }
                }}
              />
              {currentTab === 'boxes' && (
                <Button
                  onClick={() => setSortByPrice(prev => prev === 'asc' ? 'desc' : 'asc')}
                  sx={{
                    color: 'white',
                    borderColor: 'rgba(255,255,255,0.2)',
                    fontSize: '0.8rem',
                    letterSpacing: 0.1,
                    textTransform: 'none',
                    minWidth: '120px',
                    height: '48px'
                  }}
                  variant="outlined"
                >
                  Price {sortByPrice === 'asc' ? '↑' : '↓'}
                </Button>
              )}
            </Box>
          </Box>
        )}

        {/* Games Banner */}
        {currentTab !== 'craft' && (
          <Box 
            onClick={() => navigate('/latest-booba/games')}
            sx={{ 
              mb: 4,
              background: commonStyles.bgGradient,
              borderRadius: '15px',
              overflow: 'hidden',
              cursor: 'pointer',
              position: 'relative',
              border: `1px solid ${commonStyles.borderColor}`,
              transition: 'all 0.3s ease',
              p: 2.5,
              '&:hover': {
                border: `1px solid ${commonStyles.hoverBorderColor}`,
                boxShadow: commonStyles.buttonHoverShadow,
                '& .hover-effect': {
                  transform: 'translateY(-2px)'
                }
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, mb: 2 }}>
              <Box sx={{ 
                width: '52px', 
                height: '52px', 
                borderRadius: '12px',
                background: commonStyles.primaryGradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: commonStyles.buttonShadow
              }}>
                <Typography sx={{ 
                  color: 'white', 
                  fontWeight: 'bold', 
                  fontSize: '1.8rem'
                }}>
                  💎
                </Typography>
              </Box>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Typography sx={{ 
                    color: commonStyles.primaryColor,
                    fontWeight: 'bold',
                    fontSize: '1.2rem',
                  }}>
                    999,999 TON
                  </Typography>
                  <Typography sx={{
                    color: 'black',
                    fontSize: '0.8rem',
                    background: commonStyles.primaryGradient,
                    px: 1,
                    py: 0.2,
                    borderRadius: '4px',
                    fontWeight: 'bold'
                  }}>
                    PRIZE POOL
                  </Typography>
                </Box>
                <Typography sx={{ 
                  color: 'rgba(255,255,255,0.8)',
                  fontSize: '0.9rem',
                  fontWeight: '500'
                }}>
                  Play games & win massive rewards!
                </Typography>
              </Box>
            </Box>
            <Box
             className="hover-effect" 
             sx={{ 
              width: '100%',
              transition: 'transform 0.3s ease'
            }}>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  background: commonStyles.primaryGradient,
                    color: 'black',
                  textTransform: 'none',
                  py: 1.5,
                  fontSize: '0.95rem',
                  fontWeight: 'bold',
                  boxShadow: commonStyles.buttonShadow,
                  '&:hover': {
                    background: 'linear-gradient(90deg, #8ee9ff, #6ed3ff)',
                    boxShadow: commonStyles.buttonHoverShadow
                  }
                }}
              >
                Play Now →
              </Button>
            </Box>
          </Box>
        )}

        {/* Tab Bar */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs 
            value={currentTab} 
            onChange={(_: any, newValue: TabType) => setCurrentTab(newValue)}
            sx={{
              '& .MuiTab-root': {
                color: 'rgba(255,255,255,0.7)',
                textTransform: 'none',
                '&.Mui-selected': {
                  color: commonStyles.primaryColor
                }
              },
              '& .MuiTabs-indicator': {
                backgroundColor: commonStyles.primaryColor
              }
            }}
          >
            <Tab label="Boxes" value="boxes" />
            <Tab label="Sell items" value="drops" />
            <Tab label="Craft" value="craft" />
          </Tabs>
        </Box>

        {error && (
          <Typography sx={{ color: '#ff4444', mb: 2, textAlign: 'center' }}>
            {error}
          </Typography>
        )}

        {/* Content based on selected tab */}
        {currentTab === 'boxes' && (
          <Grid container spacing={1}>
            {gameCards
              .sort((a, b) => {
                // Mystery Gift Box her zaman en üstte
                if (a.id === 'mystery-gift') return -1;
                if (b.id === 'mystery-gift') return 1;

                // Kullanıcının sahip olduğu kutuları bul
                const aBoxCount = getBoxCount(a);
                const bBoxCount = getBoxCount(b);

                // Sahip olunan kutular üstte
                if (aBoxCount > 0 && bBoxCount === 0) return -1;
                if (aBoxCount === 0 && bBoxCount > 0) return 1;

                // Aynı durumdaki kutular için fiyat sıralaması
                return parseFloat(a.salePrice) - parseFloat(b.salePrice);
              })
              .map((card) => (
                <Grid item xs={6} key={card.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card
                      onClick={() => handleCardClick(card.id)}
                      sx={{
                        position: 'relative',
                        background: card.id === 'mystery-gift' 
                          ? 'linear-gradient(145deg, rgba(108,93,211,0.2) 0%, rgba(108,93,211,0.3) 100%)'
                          : 'linear-gradient(145deg, rgba(26,27,35,0.9) 0%, rgba(26,27,35,0.95) 100%)',
                        borderRadius: '15px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        border: card.id === 'mystery-gift'
                          ? '1px solid rgba(108,93,211,0.4)'
                          : `1px solid ${commonStyles.borderColor}`,
                        height: '100%',
                        minHeight: '330px',
                      }}
                    >
                      {/* Box Count Badge */}
                      <Box 
                      //@ts-ignore
                      sx={{
                        position: 'absolute',
                        top: 10,
                        left: 10,
                        background: commonStyles.primaryGradient,
                        color: 'black',
                        px: 1.5,
                        py: 0.5,
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        zIndex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5
                      }}>
                        <PackageOpenIcon size={16} />
                        {getBoxCount(card)}
                      </Box>

                      {card.id === 'mystery-gift' && (
                        <Box sx={{
                          position: 'absolute',
                          top: 10,
                          right: 10,
                          background: 'linear-gradient(90deg, #6C7BDC, #6C7BDC80)',
                          color: 'white',
                          px: 2,
                          py: 0.5,
                          borderRadius: '20px',
                          fontSize: '0.8rem',
                          fontWeight: 'bold',
                          zIndex: 1
                        }}>
                          FREE BOX
                        </Box>
                      )}
                      <Box
                        component="img"
                        src={card.image}
                        alt={card.title}
                        sx={{
                          width: '100%',
                          height: '200px',
                          mt:-3,
                          mb:-7,
                          objectFit: 'contain',
                          p: 1,
                        }}
                      />
                      <Box sx={{ p: 2 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '1rem',
                          }}
                        >
                          {card.title}
                        </Typography>
                        <Typography
                          sx={{
                            color: 'rgba(255,255,255,0.7)',
                            mb: 2,
                            fontSize: '0.9rem',
                            height: '40px',
                            overflow: 'hidden',
                          }}
                        >
                          {card.description}
                        </Typography>
                      
                        <Box sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}>
                          {card.id === 'mystery-gift' ? (
                            <Box sx={{ width: '100%', height: '24px' }} />
                          ) : (
                            <>
                              <Typography
                                sx={{
                                  color: 'rgba(255,255,255,0.5)',
                                  textDecoration: 'line-through',
                                  fontSize: '0.9rem',
                                }}
                              >
                                ${card.normalPrice}
                              </Typography>
                              <Typography
                                sx={{
                                  color: commonStyles.primaryColor,
                                  fontWeight: 'bold',
                                  fontSize: '1.2rem',
                                }}
                              >
                                ${card.salePrice}
                              </Typography>
                            </>
                          )}
                        </Box>
                        <Button
                          onClick={() => handleCardClick(card.id)}
                          variant="contained"
                          fullWidth
                          sx={{
                            mt: 1,
                            textTransform: 'none',
                            background: card.id === 'mystery-gift'
                              ? 'linear-gradient(90deg, #0088CC, #00A3FF)'
                              : commonStyles.primaryGradient,
                            color: 'black',
                          }}
                        >
                          {card.id === 'mystery-gift' ? 'Open Free Box' : 'Open Box'}
                        </Button>
                      </Box>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
          </Grid>
        )}

        {currentTab === 'drops' && renderMyDrops()}

        {currentTab === 'craft' && (
          <Box sx={{ maxWidth: '600px', margin: '0 auto' }}>
            <KeyCrafting
              keyParts={userStats?.keyParts || 0}
              onCraftKey={handleCraftKey}
              isLoading={isCrafting}
              onOpenFreeBox={() => handleCardClick('mystery-gift')}
            />
          </Box>
        )}

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
            onClose={handleCloseReward}
          />
        )}

        {/* SwapDrawer Component */}
        <SwapDrawer
          open={showSwapDrawer}
          onClose={() => setShowSwapDrawer(false)}
        />

        {/* Level Requirement Modal */}
        <Modal
          open={showLevelModal}
          onClose={() => setShowLevelModal(false)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1100
          }}
        >
          <Box sx={{
            backgroundColor: 'rgba(18, 22, 25, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '32px',
            width: '90%',
            maxWidth: '360px',
            border: '1px solid rgba(110, 211, 255, 0.1)',
            outline: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px',
            position: 'relative',
            zIndex: 9999
          }}>
            <Box sx={{ 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
              width: '100%'
            }}>
              {/* Header Section */}
              <Box sx={{ 
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2
              }}>
                <Box sx={{ 
                  width: '80px', 
                  height: '80px', 
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Box
                    component="img"
                    src={ticketImage}
                    alt="Upgrade Ticket"
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      animation: 'float 3s ease-in-out infinite',
                      '@keyframes float': {
                        '0%, 100%': {
                          transform: 'translateY(0)',
                        },
                        '50%': {
                          transform: 'translateY(-10px)',
                        },
                      },
                    }}
                  />
                  <Box sx={{
                    position: 'absolute',
                    width: '100%',
                    height: '10px',
                    bottom: '-15px',
                    background: 'radial-gradient(ellipse at center, rgba(110, 211, 255, 0.3) 0%, rgba(110, 211, 255, 0) 70%)',
                    animation: 'shadow 3s ease-in-out infinite',
                    '@keyframes shadow': {
                      '0%, 100%': {
                        transform: 'scale(1)',
                        opacity: 0.3,
                      },
                      '50%': {
                        transform: 'scale(0.7)',
                        opacity: 0.1,
                      },
                    },
                  }} />
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography sx={{ 
                    color: 'white', 
                    fontSize: '20px', 
                    fontWeight: '600',
                    mb: 1
                  }}>
                    Level Upgrade Required
                  </Typography>
                  <Typography sx={{ 
                    color: 'rgba(255, 255, 255, 0.7)', 
                    fontSize: '14px',
                    lineHeight: 1.5
                  }}>
                    You need to upgrade your level to sell items !!!
                  </Typography>
                </Box>
              </Box>

              {/* Level Info Section */}
              <Box sx={{
                width: '100%',
                display: 'flex',
                gap: 2,
                mb: 1
              }}>
                <Box sx={{
                  flex: 1,
                  background: 'linear-gradient(145deg, rgba(110, 211, 255, 0.1) 0%, rgba(110, 211, 255, 0.05) 100%)',
                  borderRadius: '16px',
                  padding: '16px',
                  border: '1px solid rgba(110, 211, 255, 0.1)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 1,
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(110, 211, 255, 0.1), transparent)',
                    animation: 'shine 2s infinite',
                  },
                  '@keyframes shine': {
                    '100%': {
                      left: '100%',
                    },
                  },
                }}>
                  <Typography sx={{ 
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Current Level
                  </Typography>
                  <Typography sx={{ 
                    color: '#6ed3ff',
                    fontSize: '24px',
                    fontWeight: '600',
                    textShadow: '0 0 10px rgba(110, 211, 255, 0.5)'
                  }}>
                    {userStats?.level || 0}
                  </Typography>
                </Box>
                <Box sx={{
                  flex: 1,
                  background: 'linear-gradient(145deg, rgba(110, 211, 255, 0.1) 0%, rgba(110, 211, 255, 0.05) 100%)',
                  borderRadius: '16px',
                  padding: '16px',
                  border: '1px solid rgba(110, 211, 255, 0.1)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 1,
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(110, 211, 255, 0.1), transparent)',
                    animation: 'shine 2s infinite 1s',
                  },
                }}>
                  <Typography sx={{ 
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Available Tickets
                  </Typography>
                  <Typography sx={{ 
                    color: '#6ed3ff',
                    fontSize: '24px',
                    fontWeight: '600',
                    textShadow: '0 0 10px rgba(110, 211, 255, 0.5)'
                  }}>
                    {userStats?.tickets || 0}
                  </Typography>
                </Box>
              </Box>

              {/* Error Message */}
              {ticketError && (
                <Typography sx={{ 
                  color: '#ff4d4d', 
                  fontSize: '14px',
                  textAlign: 'center',
                  padding: '12px',
                  backgroundColor: 'rgba(255, 77, 77, 0.1)',
                  borderRadius: '12px',
                  width: '100%',
                  border: '1px solid rgba(255, 77, 77, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1
                }}>
                  <span role="img" aria-label="warning">⚠️</span>
                  {ticketError}
                </Typography>
              )}

              {/* Action Buttons */}
              <Box sx={{ 
                width: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 2 
              }}>
                <Button
                  fullWidth
                  onClick={handleLevelUpgrade}
                  disabled={isUpgrading || !userStats?.tickets || userStats?.tickets < 1}
                  sx={{
                    background: 'linear-gradient(90deg, #6ed3ff, #8ee9ff)',
                    color: 'black',
                    height: '48px',
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontWeight: '600',
                    textTransform: 'none',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': {
                      background: 'linear-gradient(90deg, #8ee9ff, #6ed3ff)',
                    },
                    '&:disabled': {
                      background: 'rgba(110, 211, 255, 0.1)',
                      color: 'rgba(255, 255, 255, 0.3)',
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: '-100%',
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                      animation: 'shine 2s infinite',
                    },
                  }}
                >
                  {isUpgrading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CircularProgress size={20} thickness={5} sx={{ color: 'black' }} />
                      Processing...
                    </Box>
                  ) : (
                    'Use Upgrade Ticket'
                  )}
                </Button>

                <Button
                  fullWidth
                  onClick={() => setShowSwapDrawer(true)}
                  sx={{
                    background: 'linear-gradient(90deg, #0088CC, #00A3FF)',
                    color: 'white',
                    height: '48px',
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontWeight: '600',
                    textTransform: 'none',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': {
                      background: 'linear-gradient(90deg, #00A3FF, #0088CC)',
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: '-100%',
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                      animation: 'shine 2s infinite',
                    },
                  }}
                >
                  Get More Tickets
                </Button>

                <Typography sx={{ 
                  color: 'rgba(255, 255, 255, 0.7)', 
                  fontSize: '14px',
                  textAlign: 'center',
                  padding: '8px 12px',
                  borderRadius: '8px',
               
                }}>
                  {(() => {
                    const currentLevel = userStats?.level || 0;
                    const nextLevel = currentLevel + 1;
                    const currentTickets = userStats?.tickets || 0;
                    const neededTickets = nextLevel - currentTickets;
                    return `You need ${neededTickets} more ticket${neededTickets > 1 ? 's' : ''} to reach Level ${nextLevel}`;
                  })()}
                </Typography>

                <Button
                  fullWidth
                  onClick={() => setShowLevelModal(false)}
                  sx={{
                    color: 'rgba(255, 255, 255, 0.6)',
                    height: '48px',
                    fontSize: '16px',
                    textTransform: 'none',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.1)',
                    }
                  }}
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          </Box>
        </Modal>

        {/* Level Up Success Modal */}
        <Modal
          open={showLevelUpSuccess}
          onClose={() => setShowLevelUpSuccess(false)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box sx={{
            backgroundColor: 'rgba(18, 22, 25, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '32px',
            width: '90%',
            maxWidth: '360px',
            border: '1px solid rgba(110, 211, 255, 0.2)',
            outline: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px',
            animation: 'popIn 0.3s ease-out',
            '@keyframes popIn': {
              '0%': {
                transform: 'scale(0.9)',
                opacity: 0,
              },
              '100%': {
                transform: 'scale(1)',
                opacity: 1,
              },
            },
          }}>
            <Box sx={{ 
              width: '80px', 
              height: '80px', 
              borderRadius: '50%', 
              backgroundColor: 'rgba(110, 211, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'pulse 1s ease-out'
            }}>
              <StarIcon sx={{ 
                fontSize: 40, 
                color: '#6ed3ff',
                animation: 'rotate 1s ease-out'
              }} />
            </Box>
            <Typography sx={{ 
              color: '#6ed3ff',
              fontSize: '24px',
              fontWeight: '500',
              textAlign: 'center'
            }}>
              Level Up!
            </Typography>
            <Typography sx={{ 
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '16px',
              textAlign: 'center'
            }}>
              {`You've reached Level ${userStats?.level || 1}`}
            </Typography>
          </Box>
        </Modal>
      </Box>
    </Container>
  );
};

export default BoxOpening; 