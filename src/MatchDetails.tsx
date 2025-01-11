import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getDoc, doc } from 'firebase/firestore';
import { db } from './pages/firebase';
import { Container, Typography,  Grid, useTheme, useMediaQuery, Box, IconButton, Collapse } from '@mui/material';
import MatchLiveDetails from './MatchLiveDetails';
import { Match } from './pages/bet/match';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import CloseIcon from '@mui/icons-material/Close';

// Components
import MatchHeader from './pages/bet/MatchHeader';
import Match1x2 from './pages/bet/Match1x2';
import MatchDoubleChance from './pages/bet/MatchDoubleChance';
import MatchOverUnder from './pages/bet/MatchOverUnder';
import MatchFirstGoal from './pages/bet/MatchFirstGoal';
import MatchHandicap from './pages/bet/MatchHandicap';
import MatchOddEven from './pages/bet/MatchOddEven';
import BetSlip from './pages/bet/BetSlip';

// Bahis seçimi için interface
interface BetSelection {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  betType: string;
  selection: string;
  odds: number;
}

const MatchDetails: React.FC = () => {
  const { id } = useParams();
  const [match, setMatch] = useState<Match | null>(null);
  const [selections, setSelections] = useState<BetSelection[]>([]);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchMatchDetails = async () => {
      if (id) {
        const docRef = doc(db, 'matches', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setMatch(docSnap.data() as Match);
        } else {
          console.log('No such document!');
        }
      }
    };
    fetchMatchDetails();
  }, [id]);

  // Bahis seçme fonksiyonu
  const handleBetSelection = (betType: string, selection: string, odds: number) => {
    if (!match || !id) return;

    // Aynı maç için aynı tip bahis varsa kaldır
    const existingBetIndex = selections.findIndex(
      (bet) => bet.matchId === id && bet.betType === betType
    );

    if (existingBetIndex !== -1) {
      // Aynı seçim yapıldıysa seçimi kaldır
      if (selections[existingBetIndex].selection === selection) {
        const newSelections = [...selections];
        newSelections.splice(existingBetIndex, 1);
        setSelections(newSelections);
        return;
      }
      // Farklı seçim yapıldıysa güncelle
      const newSelections = [...selections];
      newSelections[existingBetIndex] = {
        matchId: id,
        homeTeam: match.homeTeam,
        awayTeam: match.awayTeam,
        betType,
        selection,
        odds
      };
      setSelections(newSelections);
    } else {
      // Yeni bahis ekle
      setSelections([
        ...selections,
        {
          matchId: id,
          homeTeam: match.homeTeam,
          awayTeam: match.awayTeam,
          betType,
          selection,
          odds
        }
      ]);
    }
  };

  // Seçili bahsi kaldır
  const handleRemoveSelection = (matchId: string, betType: string) => {
    setSelections(selections.filter(
      (bet) => !(bet.matchId === matchId && bet.betType === betType)
    ));
  };

  // Tüm seçimleri temizle
  const handleClearSlip = () => {
    setSelections([]);
  };

  if (!match) {
    return <Typography variant="h6" align="center">Loading...</Typography>;
  }

  return (
    <Container 
      maxWidth={isMobile ? false : "md"} 
      sx={{ 
        paddingTop: 2, 
        paddingBottom: 10,
        px: isMobile ? 1 : 2 // Mobilde kenar boşluklarını azalt
      }}
    >
      <MatchHeader match={match} />
      <Box sx={{ 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        mb: 2,
        mt: 1
      }}>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          bgcolor: '#2e2e2e',
          borderRadius: '20px',
          p: '6px 12px',
          cursor: 'pointer',
          border: '1px solid rgba(255,255,255,0.1)',
          '&:hover': {
            bgcolor: '#3a3a3a'
          }
        }}
        onClick={() => setShowHowToPlay(!showHowToPlay)}
        >
          <HelpOutlineIcon sx={{ color: '#ffd700', fontSize: '1.2rem' }} />
          <Typography sx={{ 
            color: '#fff',
            fontSize: '0.9rem',
            fontWeight: 500
          }}>
            How to Place a Bet?
          </Typography>
        </Box>
      </Box>
      <MatchLiveDetails match={match} />

      <Grid container spacing={isMobile ? 1 : 2}>
        <Grid item xs={12} md={8}>
          <Collapse in={showHowToPlay}>
            <Box sx={{ 
              mb: 3, 
              p: 2, 
              bgcolor: '#2e2e2e',
              borderRadius: '4px',
              border: '1px solid rgba(255,255,255,0.1)',
              position: 'relative'
            }}>
              <IconButton 
                size="small" 
                sx={{ 
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  color: '#666'
                }}
                onClick={() => setShowHowToPlay(false)}
              >
                <CloseIcon />
              </IconButton>

              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 1.5,
                color: '#ccc',
                fontSize: '0.9rem'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  <Typography sx={{ color: '#ffd700', fontWeight: 600, minWidth: '24px' }}>1.</Typography>
                  <Typography>Select your preferred bet type (1X2, Total Goals, First Goal etc.)</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  <Typography sx={{ color: '#ffd700', fontWeight: 600, minWidth: '24px' }}>2.</Typography>
                  <Typography>Click on the odds to select your bet</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  <Typography sx={{ color: '#ffd700', fontWeight: 600, minWidth: '24px' }}>3.</Typography>
                  <Typography>Enter your stake amount in the bet slip</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  <Typography sx={{ color: '#ffd700', fontWeight: 600, minWidth: '24px' }}>4.</Typography>
                  <Typography>Click "Place Bet" to confirm your bet</Typography>
                </Box>
                <Box sx={{ 
                  mt: 1,
                  p: 1.5,
                  bgcolor: 'rgba(255,215,0,0.1)',
                  borderRadius: '4px',
                  border: '1px solid rgba(255,215,0,0.2)',
                  color: '#ffd700',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <Typography component="span" sx={{ fontWeight: 600 }}>💡 Tip:</Typography>
                  <Typography>Winning bets are highlighted in yellow. Your winnings will be automatically added to your account when the match ends.</Typography>
                </Box>
              </Box>
            </Box>
          </Collapse>

          <Box sx={{ mb: 3 }}>
            <Match1x2 match={match} onSelect={handleBetSelection} />
            <MatchDoubleChance match={match} onSelect={handleBetSelection} />
            <MatchOverUnder match={match} onSelect={handleBetSelection} />
            <MatchFirstGoal match={match} onSelect={handleBetSelection} />
            <MatchHandicap match={match} onSelect={handleBetSelection} />
            <MatchOddEven match={match} onSelect={handleBetSelection} />
          </Box>
        </Grid>
        {!isMobile && (
          <Grid item md={4}>
            <BetSlip
              selections={selections}
              onRemoveSelection={handleRemoveSelection}
              onClearSlip={handleClearSlip}
            />
          </Grid>
        )}
      </Grid>

      {/* Mobil görünümde BetSlip her zaman görünecek */}
      {isMobile && (
        <BetSlip
          selections={selections}
          onRemoveSelection={handleRemoveSelection}
          onClearSlip={handleClearSlip}
        />
      )}
    </Container>
  );
};

export default MatchDetails;