import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Button, CircularProgress, Grid, Card, TextField, InputAdornment, Tabs, Tab } from '@mui/material';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import BoxOpenAnimation from './BoxOpenAnimation';
import RewardDisplay from './RewardDisplay';
import KeyCrafting from './KeyCrafting';
import { useNavigate } from 'react-router-dom';
import { db } from '../../pages/firebase';
import { doc, updateDoc, increment, onSnapshot } from 'firebase/firestore';
import { boxesData } from '../../data/boxesData';

import SearchIcon from '@mui/icons-material/Search';

// Import all box images
import alienwareImage from '../../assets/boxes/ALIENWARE.png';
import amazonImage from '../../assets/boxes/Amazon.png';
import landRoverImage from '../../assets/boxes/06_LANDROVER-Box-mock_box_1_pmWxJoo.png';
import rolexSubmarinerImage from '../../assets/boxes/06_ROLEX_SUBMARINER-Box-mock_box_HyKP6Wz.png';
import donaldTrumpImage from '../../assets/boxes/06-DONALD_TRUMP-Box-mock_box_1_Mtw3P4X.png';
import rolexYachtmasterImage from '../../assets/boxes/07_ROLEX_YACHTMASTER-Box-mock_box_1_AWKQOtA.png';
import rolexImage from '../../assets/boxes/19_ROLEX-Box-mock_box_Mf79Eyz.png';
import bbcImage from '../../assets/boxes/21-BBC-Box-mock_box_1_PJXKvVL.png';
import chanelImage from '../../assets/boxes/22-CHANEL-Box-mock_box_1_LJJWWSE.png';
import jordanImage from '../../assets/boxes/JORDAN_EXCLUSIVE-mock_box_aQCGLp6.png';
import louisVuittonImage from '../../assets/boxes/LOUIS_VUITTON-Deluxe-mock_box.png';
import winterImage from '../../assets/boxes/newwintererrer_OPdiwGJ.png';
import bmwImage from '../../assets/boxes/05-BMW-Box-mock_box_1_tcGgWnJ.png';
import primeImage from '../../assets/boxes/PRIME-Box-BLUE-mock_box_1_1_i1bhp4C.png';
import sneakersImage from '../../assets/boxes/SNEAKERS-Box-mock_box_1_1_XJ6yoyi.png';
import wolfImage from '../../assets/boxes/The-Wolf-of-Wall-Street_tRg4lgr.png';
import ufcImage from '../../assets/boxes/UFC_2_1_Qr3aLhG.png';
import victoriaImage from '../../assets/boxes/Victorias-Secret_X2kHKwy.png';
import rolexDaytonaImage from '../../assets/boxes/01_ROLEX_DAYTONA-Box-mock_box_tgFf3C6.png';
import corsairImage from '../../assets/boxes/02-CORSAIR-Box-mock_box_1_9ex9nau.png';
import versaceImage from '../../assets/boxes/02-VERSACE-Box-mock_box_1_Eh0sKbn.png';
import fortniteImage from '../../assets/boxes/03-FORTNITE-Box-mock_box_1_UANiWgs.png';
import rollsRoyceImage from '../../assets/boxes/04_ROLLS_ROYCE-Box-mock_box_lEnAQxE.png';
import footballImage from '../../assets/boxes/08_FOOTBALL_FRENZY-Box-mock_box_xTGy6uS.png';
import maseratiImage from '../../assets/boxes/09_MASERATI-Box-mock_box_nNGuE9m.png';
import mercedesImage from '../../assets/boxes/09_MERCEDES-Box-mock_box_YrkBf6x.png';
import topgImage from '../../assets/boxes/09-TOPG-Box-mock_box_1_DYOk6ka.png';
import porscheImage from '../../assets/boxes/11_PORSCHE-Box-mock_box_GsB1OjI.png';
import ferrariImage from '../../assets/boxes/12_FERRARI-Box-mock_box_1_gxu1E5e.png';
import rolexDayDateImage from '../../assets/boxes/15_DAY_DATE_VS_DAYJUST-Box-mock_box_1_APubmFH.png';
import ralphLaurenImage from '../../assets/boxes/15-RALPH_LAUREN-Box-mock_box_U3Pc619.png';
import oldMoneyImage from '../../assets/boxes/28_OLD_MONEY-Box-mock_box_1_NbdcPuo.png';
import appleImage from '../../assets/boxes/APPLE-Budget-mock_box_1_1_BNZNwNg.png';
import barbieImage from '../../assets/boxes/Barbie_1_JgeLffJ.png';
import cartierImage from '../../assets/boxes/Cartier_lC54zo9.png';
import diamondImage from '../../assets/boxes/Diamond-Vault_1_rL3pUUO.png';
import hublotImage from '../../assets/boxes/Hublot_wua9Wr6.png';
import highRollerImage from '../../assets/boxes/05_HIGH_ROLLER-Box-mock_box_bxw602J.png';

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
    title: 'Rolex Submariner',
    normalPrice: '299.99',
    salePrice: '249.99',
    description: 'Luxury diving watch themed box',
    brand: 'Luxury'
  },
  {
    id: 'donald-trump',
    image: donaldTrumpImage,
    title: 'Donald Trump',
    normalPrice: '49.99',
    salePrice: '39.99',
    description: 'Political memorabilia box',
    brand: 'Politics'
  },
  {
    id: 'rolex-yachtmaster',
    image: rolexYachtmasterImage,
    title: 'Rolex Yachtmaster',
    normalPrice: '299.99',
    salePrice: '249.99',
    description: 'Luxury yacht watch themed box',
    brand: 'Luxury'
  },
  {
    id: 'rolex',
    image: rolexImage,
    title: 'Rolex Collection',
    normalPrice: '399.99',
    salePrice: '349.99',
    description: 'Premium Rolex collection box',
    brand: 'Luxury'
  },
  {
    id: 'bbc',
    image: bbcImage,
    title: 'BBC Box',
    normalPrice: '29.99',
    salePrice: '24.99',
    description: 'British Broadcasting themed box',
    brand: 'Media'
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
    id: 'jordan',
    image: jordanImage,
    title: 'Jordan Exclusive',
    normalPrice: '149.99',
    salePrice: '129.99',
    description: 'Exclusive Jordan sneakers and apparel',
    brand: 'Sports'
  },
  {
    id: 'louis-vuitton',
    image: louisVuittonImage,
    title: 'Louis Vuitton Deluxe',
    normalPrice: '299.99',
    salePrice: '249.99',
    description: 'Premium Louis Vuitton fashion items',
    brand: 'Luxury'
  },
  {
    id: 'winter',
    image: winterImage,
    title: 'Winter Collection',
    normalPrice: '79.99',
    salePrice: '69.99',
    description: 'Winter themed mystery box',
    brand: 'Seasonal'
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
    normalPrice: '129.99',
    salePrice: '109.99',
    description: 'Premium sneaker collection box',
    brand: 'Fashion'
  },
  {
    id: 'wolf-of-wall-street',
    image: wolfImage,
    title: 'Wolf of Wall Street',
    normalPrice: '199.99',
    salePrice: '169.99',
    description: 'Luxury lifestyle themed box',
    brand: 'Lifestyle'
  },
  {
    id: 'ufc',
    image: ufcImage,
    title: 'UFC Box',
    normalPrice: '89.99',
    salePrice: '79.99',
    description: 'Ultimate Fighting Championship themed box',
    brand: 'Sports'
  },
  {
    id: 'victoria-secret',
    image: victoriaImage,
    title: "Victoria's Secret",
    normalPrice: '99.99',
    salePrice: '89.99',
    description: 'Luxury lingerie and beauty box',
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
    normalPrice: '149.99',
    salePrice: '129.99',
    description: 'Premium gaming gear box',
    brand: 'Tech'
  },
  {
    id: 'versace',
    image: versaceImage,
    title: 'Versace',
    normalPrice: '249.99',
    salePrice: '219.99',
    description: 'Luxury Italian fashion box',
    brand: 'Luxury'
  },
  {
    id: 'fortnite',
    image: fortniteImage,
    title: 'Fortnite',
    normalPrice: '39.99',
    salePrice: '34.99',
    description: 'Fortnite gaming themed box',
    brand: 'Gaming'
  },
  {
    id: 'rolls-royce',
    image: rollsRoyceImage,
    title: 'Rolls Royce',
    normalPrice: '399.99',
    salePrice: '349.99',
    description: 'Ultra-luxury automotive themed box',
    brand: 'Automotive'
  },
  {
    id: 'football-frenzy',
    image: footballImage,
    title: 'Football Frenzy',
    normalPrice: '79.99',
    salePrice: '69.99',
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
    id: 'mercedes',
    image: mercedesImage,
    title: 'Mercedes',
    normalPrice: '299.99',
    salePrice: '249.99',
    description: 'German luxury automotive box',
    brand: 'Automotive'
  },
  {
    id: 'topg',
    image: topgImage,
    title: 'Top G',
    normalPrice: '149.99',
    salePrice: '129.99',
    description: 'Premium lifestyle box',
    brand: 'Lifestyle'
  },
  {
    id: 'porsche',
    image: porscheImage,
    title: 'Porsche',
    normalPrice: '349.99',
    salePrice: '299.99',
    description: 'Sports car themed luxury box',
    brand: 'Automotive'
  },
  {
    id: 'ferrari',
    image: ferrariImage,
    title: 'Ferrari',
    normalPrice: '399.99',
    salePrice: '349.99',
    description: 'Italian supercar themed box',
    brand: 'Automotive'
  },
  {
    id: 'rolex-day-date',
    image: rolexDayDateImage,
    title: 'Rolex Day-Date vs Datejust',
    normalPrice: '299.99',
    salePrice: '249.99',
    description: 'Classic Rolex watches themed box',
    brand: 'Luxury'
  },
  {
    id: 'ralph-lauren',
    image: ralphLaurenImage,
    title: 'Ralph Lauren',
    normalPrice: '199.99',
    salePrice: '169.99',
    description: 'American luxury fashion box',
    brand: 'Fashion'
  },
  {
    id: 'old-money',
    image: oldMoneyImage,
    title: 'Old Money',
    normalPrice: '499.99',
    salePrice: '449.99',
    description: 'Classic luxury lifestyle box',
    brand: 'Lifestyle'
  },
  {
    id: 'apple',
    image: appleImage,
    title: 'Apple Budget',
    normalPrice: '199.99',
    salePrice: '169.99',
    description: 'Apple tech themed box',
    brand: 'Tech'
  },
  {
    id: 'barbie',
    image: barbieImage,
    title: 'Barbie',
    normalPrice: '49.99',
    salePrice: '39.99',
    description: 'Barbie collectibles box',
    brand: 'Toys'
  },
  {
    id: 'cartier',
    image: cartierImage,
    title: 'Cartier',
    normalPrice: '299.99',
    salePrice: '249.99',
    description: 'Luxury jewelry themed box',
    brand: 'Luxury'
  },
  {
    id: 'diamond-vault',
    image: diamondImage,
    title: 'Diamond Vault',
    normalPrice: '999.99',
    salePrice: '899.99',
    description: 'Premium diamond jewelry box',
    brand: 'Luxury'
  },
  {
    id: 'hublot',
    image: hublotImage,
    title: 'Hublot',
    normalPrice: '399.99',
    salePrice: '349.99',
    description: 'Luxury Swiss watch themed box',
    brand: 'Luxury'
  },
  {
    id: 'high-roller',
    image: highRollerImage,
    title: 'High Roller',
    normalPrice: '1999.99',
    salePrice: '1799.99',
    description: 'Ultra-premium luxury items box',
    brand: 'Luxury'
  }
];

const BoxOpening: React.FC = () => {
  const navigate = useNavigate();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [isOpening, setIsOpening] = useState(false);
  const [currentReward, setCurrentReward] = useState<DisplayReward | null>(null);
  const [showReward, setShowReward] = useState(false);
  const [isCrafting, setIsCrafting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortByPrice, setSortByPrice] = useState<'asc' | 'desc'>('asc');
  const [currentTab, setCurrentTab] = useState<'boxes' | 'drops'>('boxes');
  const [dropsSortBy, setDropsSortBy] = useState<'price' | 'rarity'>('price');

  // Filter and sort cards for Boxes tab
  const filteredCards = gameCards.filter(card => {
    const matchesSearch = card.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  }).sort((a, b) => {
    if (sortByPrice === 'asc') {
      return parseFloat(a.salePrice) - parseFloat(b.salePrice);
    } else {
      return parseFloat(b.salePrice) - parseFloat(a.salePrice);
    }
  });

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

  const handleCardClick = (cardId: string) => {
    navigate(`/latest-booba/box/${cardId}`);
  };

  const renderMyDrops = () => {
    if (!userStats || !userStats.drops) return null;

    let allDrops = Object.entries(userStats.drops).flatMap(([boxTitle, drops]) =>
      drops.map(drop => {
        const boxData = boxesData[boxTitle.toLowerCase()];
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
        <Box sx={{ mb: 3, p: 3, borderRadius: '15px', background: 'rgba(108, 93, 211, 0.1)' }}>
          <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
            My Collection Summary
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                  Total Items
                </Typography>
                <Typography sx={{ color: '#6C5DD3', fontWeight: 'bold', fontSize: '1.5rem' }}>
                  {allDrops.length}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                  Total Value
                </Typography>
                <Typography sx={{ color: '#6C5DD3', fontWeight: 'bold', fontSize: '1.5rem' }}>
                  ${allDrops.reduce((sum, drop) => sum + parseFloat(drop.price) * drop.amount, 0).toFixed(2)}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                  Unique Boxes
                </Typography>
                <Typography sx={{ color: '#6C5DD3', fontWeight: 'bold', fontSize: '1.5rem' }}>
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
                  borderColor: 'rgba(255,255,255,0.2)',
                  backgroundColor: dropsSortBy === sortType ? '#6C5DD3' : 'transparent',
                  '&:hover': {
                    backgroundColor: dropsSortBy === sortType ? '#8677E3' : 'rgba(108,93,211,0.1)'
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
              borderColor: 'rgba(255,255,255,0.2)',
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
                  background: 'linear-gradient(145deg, rgba(26,27,35,0.9) 0%, rgba(26,27,35,0.95) 100%)',
                  borderRadius: '15px',
                  overflow: 'hidden',
                  border: '1px solid rgba(255,255,255,0.1)',
                  height: '100%',
                  transition: 'transform 0.2s',
                 
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
                    <Box sx={{
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
                  <Box sx={{ p: 2 }}>
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
                    <Box sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: 'rgba(108,93,211,0.1)',
                      borderRadius: '12px',
                      p: 1.5
                    }}>
                      <Box>
                        <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>
                          Value
                        </Typography>
                        <Typography sx={{ color: '#6C5DD3', fontWeight: 'bold', fontSize: '1.2rem' }}>
                          ${drop.price}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>
                          Amount
                        </Typography>
                        <Typography sx={{ color: '#6C5DD3', fontWeight: 'bold', fontSize: '1.2rem' }}>
                          {drop.amount}x
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        {/* Search Bar */}
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

        {/* Tab Bar */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs 
            value={currentTab} 
            onChange={(_, newValue) => setCurrentTab(newValue)}
            sx={{
              '& .MuiTab-root': {
                color: 'rgba(255,255,255,0.7)',
                '&.Mui-selected': {
                  color: '#6C5DD3'
                }
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#6C5DD3'
              }
            }}
          >
            <Tab label="Boxes" value="boxes" />
            <Tab label="My Drops" value="drops" />
          </Tabs>
        </Box>

        {error && (
          <Typography sx={{ color: '#ff4444', mb: 2, textAlign: 'center' }}>
            {error}
          </Typography>
        )}

        {/* Content based on selected tab */}
        {currentTab === 'boxes' ? (
          <Grid container spacing={1}>
            {filteredCards.map((card) => (
              <Grid item xs={6} key={card.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card
                    onClick={() => handleCardClick(card.id)}
                    sx={{
                      background: 'linear-gradient(145deg, rgba(26,27,35,0.9) 0%, rgba(26,27,35,0.95) 100%)',
                      borderRadius: '15px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      border: '1px solid rgba(255,255,255,0.1)',
                      height: '100%',
                
                    }}
                  >
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
                    
                        <Box  sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }} >
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
                              color: '#6C5DD3',
                              fontWeight: 'bold',
                              fontSize: '1.2rem',
                            }}
                          >
                            ${card.salePrice}
                          </Typography>
                        </Box>
                        <Button
                          onClick={() => handleCardClick(card.id)}
                          variant="contained"
                          fullWidth
                          sx={{
                            mt:1,
                            background: 'linear-gradient(90deg, #6C5DD3, #8677E3)',
                            color: 'white',
                          }}
                        >
                          Open Box
                        </Button>
                    
                    </Box>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        ) : (
          renderMyDrops()
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

        {/* Key Crafting Modal */}
        <KeyCrafting
          keyParts={userStats?.keyParts || 0}
          onCraftKey={handleCraftKey}
          isLoading={isCrafting}
        />
      </Box>
    </Container>
  );
};

export default BoxOpening; 