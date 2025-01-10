import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from './pages/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { Card, Typography, CircularProgress, Grid, Box } from '@mui/material';
import { Match } from './pages/bet/match';

interface MatchLiveDetailsProps {
  match: Match;
}

const MatchLiveDetails: React.FC<MatchLiveDetailsProps> = ({ match }) => {
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<string | null>(null);
  const { id } = useParams();

  useEffect(() => {
    if (!id) return;

    console.log('Firestore anlık izleme başlatılıyor...');
    const docRef = doc(db, 'matches', id);

    // `onSnapshot` kullanımı ile anlık veri güncellemesi
    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          console.log('Firestore dokümanı güncellendi:', docSnap.data());
          const matchData = docSnap.data() as Match;

          // Eğer maçın tarihi varsa, geri sayımı başlat
          if (matchData.date) {
            const matchDate = new Date(matchData.date);
            startCountdown(matchDate);
          }
        } else {
          console.log('Doküman bulunamadı.');
        }
        setLoading(false);
      },
      (error) => {
        console.error('Firestore anlık izleme hatası:', error);
        setLoading(false);
      }
    );

    // Cleanup: Bileşen unmount olduğunda `onSnapshot` aboneliğini kaldır
    return () => {
      console.log('Firestore anlık izleme iptal ediliyor...');
      unsubscribe();
    };
  }, [id]);

  // Geri sayımı başlat
  const startCountdown = (matchDate: Date) => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeDifference = matchDate.getTime() - now.getTime();

      if (timeDifference <= 0) {
        clearInterval(interval);
        setTimeLeft('Maç başladı!');
      } else {
        let timeLeftStr = '';
        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

        if (days > 0) {
          timeLeftStr = `${days} gün `;
        }
        if (hours > 0) {
          timeLeftStr += `${hours} saat `;
        }
        if (minutes > 0) {
          timeLeftStr += `${minutes} dakika `;
        }
        if (seconds > 0) {
          timeLeftStr += `${seconds} saniye`;
        }

        setTimeLeft(timeLeftStr);
      }
    }, 1000);
  };

  if (loading) {
    console.log('Yükleme durumu aktif.');
    return <CircularProgress />;
  }

  console.log('Maç bilgisi render ediliyor:', match);
  return (
    <Card 
      sx={{ 
        padding: 2,
        margin: 'auto', 
        marginTop: 1.5, 
        marginBottom: 3,
        background: 'linear-gradient(145deg, #1a1a1a 0%, #2d2d2d 100%)',
        color: '#fff',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 12px 48px rgba(0,0,0,0.4)',
        }
      }}
    >
      {match.liveData ? (
        <div>
          {match.leagueName && (
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              mb: 2,
              background: 'rgba(255,255,255,0.08)',
              padding: '8px 16px',
              borderRadius: '12px',
              backdropFilter: 'blur(8px)',
            }}>
              <Typography 
                variant="subtitle1" 
                textAlign="center"
                sx={{ 
                  fontSize: '0.9rem', 
                  color: '#e0e0e0',
                  fontWeight: 600,
                  letterSpacing: '0.5px',
                }}
              >
                {match.leagueName}
              </Typography>
            </Box>
          )}

          <Grid container spacing={2} justifyContent="center" alignItems="center">
            <Grid item xs={4}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                background: 'rgba(255,255,255,0.05)',
                padding: '12px',
                borderRadius: '14px',
                transition: 'all 0.2s ease',
                '&:hover': {
                  background: 'rgba(255,255,255,0.08)',
                  transform: 'scale(1.02)',
                }
              }}>
                <img 
                  src={match.awayTeamLogo} 
                  alt={match.awayTeam} 
                  width="60" 
                  style={{ 
                    filter: 'brightness(1.3) drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
                    marginBottom: '8px',
                    transition: 'transform 0.2s ease',
                  }}
                />
                <Typography sx={{
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '100%',
                  color: '#fff',
                  textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                }}>
                  {match.awayTeam}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={4}>
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1,
              }}>
                <Typography sx={{ 
                  fontWeight: 700, 
                  fontSize: '2rem',
                  color: '#fff',
                  textShadow: '0 0 20px rgba(255,255,255,0.4)',
                  letterSpacing: '3px',
                  fontFamily: "'Roboto Condensed', sans-serif",
                }}>
                  {match.liveData.goals.away} - {match.liveData.goals.home}
                </Typography>
                {!match.finished && match.liveData.elapsed && (
                  <Box sx={{
                    background: 'linear-gradient(90deg, #e74c3c 0%, #c0392b 100%)',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    minWidth: '60px',
                    textAlign: 'center',
                    boxShadow: '0 4px 12px rgba(231,76,60,0.3)',
                  }}>
                    <Typography sx={{
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: '#fff',
                    }}>
                      {match.liveData.elapsed}'
                    </Typography>
                  </Box>
                )}
              </Box>
            </Grid>

            <Grid item xs={4}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                background: 'rgba(255,255,255,0.05)',
                padding: '12px',
                borderRadius: '14px',
                transition: 'all 0.2s ease',
                '&:hover': {
                  background: 'rgba(255,255,255,0.08)',
                  transform: 'scale(1.02)',
                }
              }}>
                <img 
                  src={match.homeTeamLogo} 
                  alt={match.homeTeam} 
                  width="60" 
                  style={{ 
                    filter: 'brightness(1.3) drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
                    marginBottom: '8px',
                    transition: 'transform 0.2s ease',
                  }}
                />
                <Typography sx={{
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '100%',
                  color: '#fff',
                  textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                }}>
                  {match.homeTeam}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {match.finished ? (
            <Box sx={{
              mt: 2,
              background: 'linear-gradient(90deg, #2ecc71 0%, #27ae60 100%)',
              padding: '6px 16px',
              borderRadius: '24px',
              textAlign: 'center',
              width: 'fit-content',
              margin: '16px auto 0',
              boxShadow: '0 4px 12px rgba(46,204,113,0.3)',
            }}>
              <Typography sx={{ 
                fontSize: '0.85rem', 
                color: '#fff',
                fontWeight: 700,
                letterSpacing: '0.5px',
              }}>
                Maç Bitti
              </Typography>
            </Box>
          ) : (
            <Box sx={{
              mt: 2,
              textAlign: 'center',
              background: 'rgba(255,255,255,0.08)',
              padding: '6px 16px',
              borderRadius: '12px',
            }}>
              <Typography sx={{ 
                fontSize: '0.85rem', 
                color: '#bbb',
                fontWeight: 600,
                letterSpacing: '0.5px',
              }}>
                {match.liveData.status}
              </Typography>
            </Box>
          )}
        </div>
      ) : (
        <div>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={4}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                background: 'rgba(255,255,255,0.03)',
                padding: '8px',
                borderRadius: '10px',
              }}>
                <img 
                  src={match.homeLogo} 
                  alt={match.homeTeam} 
                  width="50" 
                  style={{ 
                    filter: 'brightness(1.2)',
                    marginBottom: '4px' 
                  }}
                />
                <Typography sx={{
                  fontWeight: 500,
                  fontSize: '0.8rem',
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '100%',
                  color: '#fff',
                }}>
                  {match.homeTeam}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={4} sx={{ textAlign: 'center' }}>
              <Typography sx={{ 
                fontWeight: 600, 
                fontSize: '1.1rem',
                color: '#e74c3c',
                letterSpacing: '1px',
              }}>
                VS
              </Typography>
            </Grid>

            <Grid item xs={4}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                background: 'rgba(255,255,255,0.03)',
                padding: '8px',
                borderRadius: '10px',
              }}>
                <img 
                  src={match.awayLogo} 
                  alt={match.awayTeam} 
                  width="50" 
                  style={{ 
                    filter: 'brightness(1.2)',
                    marginBottom: '4px' 
                  }}
                />
                <Typography sx={{
                  fontWeight: 500,
                  fontSize: '0.8rem',
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '100%',
                  color: '#fff',
                }}>
                  {match.awayTeam}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {timeLeft && (
            <Box sx={{
              mt: 2,
              background: 'rgba(255,255,255,0.05)',
              padding: '8px',
              borderRadius: '8px',
              textAlign: 'center',
            }}>
              <Typography sx={{ 
                fontSize: '0.75rem', 
                color: '#aaa',
                fontWeight: 500,
              }}>
                {timeLeft}
              </Typography>
            </Box>
          )}
        </div>
      )}
    </Card>
  );
};

export default MatchLiveDetails;
