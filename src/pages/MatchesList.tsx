import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import './slide.css';

import { 
  Container, 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  IconButton, 
  Box,
  Chip,
  Avatar,
  Button,
 
} from '@mui/material';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';
import { 
  FavoriteBorder as FavoriteIcon,
 

} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import WebApp from '@twa-dev/sdk';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import image1 from '../assets/28827_SA_FA-Cup_Informative_600_388_Desktop.jpg';
import image2 from '../assets/29255_SA_PickYourPromo_600_388_Desktop.jpg';



interface Match {
  id: string;
  league: string;
  leagueName: string;
  leagueLogo: string;
  country: string;
  round: string;
  date: string;
  homeWin: number;
  draw: number;
  awayWin: number;
  homeTeam: string;
  homeLogo: string;
  awayTeam: string;
  awayLogo: string;
  liveData?: {
    goals: { home: number; away: number };
    elapsed: number;
    status: string;
  };
}

// Define the images array
const images: { src: string, text: string, additionalText1: string, additionalText2: string }[] = [

    { src: image1, text: "", additionalText1: " ", additionalText2: "" },
    { src: image2, text: "", additionalText1: "", additionalText2: "" },
    

];

const MatchesList: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();


  useEffect(() => {
      const backButton = WebApp.BackButton;
  
      // BackButton'u görünür yap ve tıklanma işlevi ekle
      backButton.show();
      backButton.onClick(() => {
        navigate("/latest-booba/top");
      });
  
      // Cleanup: Bileşen unmount olduğunda butonu gizle ve event handler'ı kaldır
      return () => {
        backButton.hide();
        backButton.offClick(() => {
          navigate("/latest-booba/top"); // Buraya tekrar aynı callback sağlanmalıdır.
        });
      };
    }, [navigate]);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'matches'));
        const matchesData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Match[];
        setMatches(matchesData);
      } catch (error) {
        console.error('Error fetching matches:', error);
      }
    };

    fetchMatches();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getCountdown = (matchDate: string) => {
    const matchTime = new Date(matchDate).getTime();
    const now = currentTime.getTime();
    const distance = matchTime - now;

    if (distance < 0) {
      return 'Match Finished';
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (days > 0) {
      return `${days}d ${hours}h`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const handleCardClick = (id: string) => {
    navigate(`/latest-booba/match/${id}`);
  };

  return (
    <Container maxWidth="lg" sx={{ 
      paddingTop: { xs: 2, sm: 4 }, 
      mb: { xs: 15, sm: 22 },
      px: { xs: 1, sm: 2, md: 3 }
    }}>
    <Box m={0} mb={2} overflow="hidden" sx={{borderTopRightRadius:15,borderTopLeftRadius:15}}>
                        <Slide 
                                         nextArrow={
                                             <Button 
                                                 style={{
                                                     background: 'rgba(255, 255, 255, 0.5)',
                                                     border: 'none',
                                                     borderRadius: 15,
                                                     width: '10vw',
                                                     height: '10vw',
                                                     position: 'absolute',
                                                     bottom: '3vh',
                                                     right: '1vw',
                                                     transform: 'translateY(50%)',
                                                     boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                                                     display: 'flex',
                                                     justifyContent: 'center',
                                                     alignItems: 'center',
                                                     cursor: 'pointer',
                                                     transition: 'background 0.3s, transform 0.3s',
                                                 }}
                                                 onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.8)'}
                                                 onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.5)'}
                                             >
                                                 <FaArrowRight size={20} color="black" />
                                             </Button>
                                         } 
                                         prevArrow={
                                             <Button 
                                                 style={{
                                                     background: 'rgba(255, 255, 255, 0.5)',
                                                     border: 'none',
                                                     borderRadius: 15,
                                                     width: '10vw',
                                                     height: '10vw',
                                                     position: 'absolute',
                                                     bottom: '3vh',
                                                     left: '1vw',
                                                     transform: 'translateY(50%)',
                                                     boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                                                     display: 'flex',
                                                     justifyContent: 'center',
                                                     alignItems: 'center',
                                                     cursor: 'pointer',
                                                     transition: 'background 0.3s, transform 0.3s',
                                                 }}
                                                 onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.8)'}
                                                 onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.5)'}
                                             >
                                                 <FaArrowLeft size={20} color="black" />
                                             </Button>
                                         } 
                                     >
                                         {images.map((image, index) => (
                                             <Box key={index} className="each-slide-effect"  position="relative">
                                                 <Box
                                                     minHeight={'230px'}
                                                     
                                                     width={'100vh'}
                                                     style={{ backgroundImage: `url(${image.src})`, backgroundSize: 'cover', backgroundPosition: 'center',  }}
                                                 />
                                                 {/* Text on top of the image */}
                                                 <Typography
                                                     variant="subtitle2"
                                                     color="white"
                                                     position="absolute"
                                                     bottom={140}
                                                     left={20}
                                                     style={{
                                                         backgroundColor: 'rgba(71, 70, 70, 0.5)',  // Semi-transparent black background
                                                         padding: '0px 10px',
                                                         borderRadius: '5px'
                                                     }}
                                                 >
                                                     {image.text}
                                                 </Typography>
                                                 {/* First additional text */}
                                                 <Typography
                                                     variant="h6"
                                                     color="white"
                                                     position="absolute"
                                                     bottom={83}
                                                     left={20}
                                                     fontWeight="bold"
                                                      style={{
                                                         backgroundColor: 'rgba(71, 70, 70, 0.5)',  // Semi-transparent black background
                                                         padding: '0px 6px',
                                                         borderRadius: '5px'
                                                     }}
                                                 >
                                                     {image.additionalText1}
                                                 </Typography>
                                                 {/* Second additional text */}
                                                 <Typography
                                                     variant="body1"
                                                     color="black"
                                                     px={1}
                                                     textAlign={'center'}
                                                     position="absolute"
                                                     bottom={55}
                                                     left={20}
                                                     fontWeight="normal"
                                                     style={{
                                                         backgroundColor: 'rgb(247, 243, 11)',  // Semi-transparent black background
                                                         borderRadius: '5px'
                                                     }}
                                                 >
                                                     {image.additionalText2}
                                                 </Typography>
                                             </Box>
                                         ))}
                                     </Slide>
                                     </Box>
                      
    
      <Box sx={{ 
        mb: { xs: 3, sm: 5 }, 
        textAlign: 'center',
        position: 'relative'
      }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontSize: { xs: '1.25rem', sm: '2rem', md: '2.25rem' },
            fontWeight: 800,
            background: 'linear-gradient(45deg, #00c6ff, #0072ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: '-10px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '60px',
              height: '4px',
              background: 'linear-gradient(45deg, #00c6ff, #0072ff)',
              borderRadius: '2px'
            }
          }}
        >
          Today's Matches
        </Typography>
      </Box>

      <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }}>
        {matches.map((match) => (
          <Grid item xs={12} sm={6} key={match.id}>
            <Card 
              onClick={() => handleCardClick(match.id)}
              sx={{ 
                borderRadius: { xs: 2.5, sm: 3 },
                background: 'linear-gradient(145deg, rgba(32, 38, 48, 0.95) 0%, rgba(22, 26, 32, 0.98) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                overflow: 'hidden',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: 'linear-gradient(90deg, #00c6ff, #0072ff)',
                  opacity: 0,
                  transition: 'opacity 0.3s ease'
                },
                '&:hover': {
                  transform: { xs: 'none', sm: 'translateY(-4px)' },
                  boxShadow: { 
                    xs: 'none', 
                    sm: '0 8px 20px rgba(0,0,0,0.3), 0 0 20px rgba(0, 198, 255, 0.1)' 
                  },
                  '&::before': {
                    opacity: 1
                  }
                }
              }}
            >
              <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start',
                  mb: { xs: 2, sm: 2.5 } 
                }}>
                  <Box sx={{ display: 'flex', gap: 1.5, flex: 1 }}>
                    <Avatar 
                      src={match.leagueLogo} 
                      alt={match.leagueName}
                      variant="rounded"
                      sx={{ 
                        width: { xs: 32, sm: 36 }, 
                        height: { xs: 32, sm: 36 },
                        bgcolor: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        p: 0.5
                      }} 
                    />
                    <Box>
                      <Typography 
                        sx={{ 
                          color: '#fff',
                          fontSize: { xs: '0.9rem', sm: '1rem' },
                          fontWeight: 600,
                          lineHeight: 1.2,
                          mb: 0.5,
                          letterSpacing: '0.3px'
                        }}
                      >
                        {match.leagueName}
                      </Typography>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1,
                        color: 'rgba(255, 255, 255, 0.6)'
                      }}>
                        <Typography 
                          sx={{ 
                            fontSize: { xs: '0.75rem', sm: '0.8rem' },
                            fontWeight: 500,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5
                          }}
                        >
                          {match.country} • Round {match.round}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }}>
                    {match.liveData?.status && (
                      <Chip 
                        label={match.liveData.status}
                        sx={{ 
                          borderRadius: '12px',
                          animation: 'pulse 2s infinite',
                          height: { xs: '26px', sm: '28px' },
                          background: 'linear-gradient(45deg, #ff4d4d, #f02929)',
                          color: '#fff',
                          fontWeight: 600,
                          border: '1px solid rgba(255,77,77,0.3)',
                          boxShadow: '0 2px 8px rgba(255,77,77,0.2)',
                          '& .MuiChip-label': {
                            fontSize: { xs: '0.75rem', sm: '0.8rem' },
                            px: { xs: 1.2, sm: 1.5 }
                          }
                        }}
                      />
                    )}
                    <IconButton 
                      size="small" 
                      sx={{ 
                        color: '#ff4d8c',
                        bgcolor: 'rgba(255, 77, 140, 0.1)',
                        backdropFilter: 'blur(4px)',
                        '&:hover': {
                          bgcolor: 'rgba(255, 77, 140, 0.2)',
                        },
                        padding: { xs: 0.8, sm: 1 }
                      }}
                    >
                      <FavoriteIcon sx={{ fontSize: { xs: '1.1rem', sm: '1.2rem' } }} />
                    </IconButton>
                  </Box>
                </Box>

                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  backgroundColor: 'rgba(16, 20, 24, 0.6)',
                  borderRadius: { xs: 2, sm: 2.5 },
                  p: { xs: 1.5, sm: 2 },
                  mb: { xs: 2, sm: 2.5 },
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'radial-gradient(circle at top right, rgba(0, 198, 255, 0.03), transparent)',
                    pointerEvents: 'none'
                  }
                }}>
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'center', 
                    gap: 1,
                    width: '30%',
                    minWidth: 'auto'
                  }}>
                    <Avatar 
                      src={match.homeLogo} 
                      alt={match.homeTeam} 
                      sx={{ 
                        width: { xs: 40, sm: 48 },
                        height: { xs: 40, sm: 48 },
                        border: '2px solid rgba(255, 255, 255, 0.1)',
                        bgcolor: 'rgba(255, 255, 255, 0.03)',
                        p: 0.5
                      }} 
                    />
                    <Typography sx={{ 
                      color: '#fff', 
                      fontWeight: 600,
                      fontSize: { xs: '0.7rem', sm: '0.75rem' },
                      textAlign: 'center',
                      width: '100%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      px: 0.5
                    }}>
                      {match.homeTeam}
                    </Typography>
                  </Box>

                  <Box sx={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 0.5,
                    width: '40%',
                    px: { xs: 1, sm: 2 }
                  }}>
                    <Box sx={{ 
                      px: { xs: 1, sm: 2 }, 
                      py: { xs: 0.5, sm: 1 }, 
                      borderRadius: 2,
                      backgroundColor: match.liveData ? 'rgba(255, 77, 77, 0.1)' : 
                        new Date(match.date) < currentTime ? 'rgba(255, 77, 77, 0.1)' : 'transparent',
                      border: match.liveData || new Date(match.date) < currentTime ? 
                        '1px solid rgba(255, 77, 77, 0.2)' : 'none',
                      width: '100%',
                      textAlign: 'center'
                    }}>
                      {match.liveData?.goals ? (
                        <Typography 
                          variant="h5" 
                          sx={{ 
                            fontWeight: 700, 
                            color: '#fff',
                            textShadow: '0 0 20px rgba(255,255,255,0.2)',
                            fontSize: { xs: '1.25rem', sm: '1.5rem' },
                            letterSpacing: '1px'
                          }}
                        >
                          {match.liveData.goals.home} - {match.liveData.goals.away}
                        </Typography>
                      ) : (
                        <Typography 
                          variant="h5" 
                          sx={{ 
                            fontWeight: 600,
                            color: 'rgba(255, 255, 255, 0.5)',
                            fontSize: { xs: '1.1rem', sm: '1.25rem' }
                          }}
                        >
                          VS
                        </Typography>
                      )}
                    </Box>
                    <Typography 
                      sx={{ 
                        color: new Date(match.date) < currentTime ? '#ff4d4d' : 'rgba(255, 255, 255, 0.5)',
                        fontSize: { xs: '0.6rem', sm: '0.6rem' },
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        fontWeight: new Date(match.date) < currentTime ? 600 : 400
                      }}
                    >
                    
                      {new Date(match.date) < currentTime ? 
                        '' : 
                        getCountdown(match.date)
                      }
                    </Typography>
                  </Box>

                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'center', 
                    gap: 1,
                    width: '30%',
                    minWidth: 'auto'
                  }}>
                    <Avatar 
                      src={match.awayLogo} 
                      alt={match.awayTeam} 
                      sx={{ 
                        width: { xs: 40, sm: 48 },
                        height: { xs: 40, sm: 48 },
                        border: '2px solid rgba(255, 255, 255, 0.1)',
                        bgcolor: 'rgba(255, 255, 255, 0.03)',
                        p: 0.5
                      }} 
                    />
                    <Typography sx={{ 
                      color: '#fff', 
                      fontWeight: 600,
                      fontSize: { xs: '0.7rem', sm: '0.75rem' },
                      textAlign: 'center',
                      width: '100%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      px: 0.5
                    }}>
                      {match.awayTeam}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  gap: { xs: 1, sm: 1.5 }
                }}>
                  {[
                    { label: '1', value: match.homeWin },
                    { label: 'X', value: match.draw },
                    { label: '2', value: match.awayWin }
                  ].map((odd, index) => (
                    <Button 
                      key={index}
                      variant="contained" 
                      fullWidth 
                      sx={{ 
                        background: 'linear-gradient(145deg, rgba(0, 198, 255, 0.1), rgba(0, 114, 255, 0.1))',
                        color: '#fff',
                        fontSize: { xs: '0.85rem', sm: '0.95rem' },
                        fontWeight: 600,
                        padding: { xs: '2px', sm: '4px' },
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 0.5,
                        '&:hover': { 
                          background: 'linear-gradient(145deg, rgba(0, 198, 255, 0.15), rgba(0, 114, 255, 0.15))',
                          boxShadow: '0 4px 12px rgba(0, 198, 255, 0.15)'
                        } 
                      }}
                    >
                      <Typography sx={{ 
                        fontSize: { xs: '0.7rem', sm: '0.75rem' },
                        color: 'rgba(255, 255, 255, 0.6)',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                      }}>
                        {odd.label}
                      </Typography>
                      {odd.value}
                    </Button>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default MatchesList;
