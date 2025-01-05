import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getDoc, doc } from 'firebase/firestore';
import { db } from './pages/firebase'; // Firebase bağlantısını buradan alıyoruz
import { Container, Typography, Card, CardContent,  Box, Button } from '@mui/material';
import MatchLiveDetails from './MatchLiveDetails';

interface Match {
  league: string;
  date: string;
  homeWin: number;
  draw: number;
  awayWin: number;
  homeTeam: string;
  homeLogo: string;
  awayTeam: string;
  awayLogo: string;
  doubleChance0_2: string;
  doubleChance0_1: string;
  doubleChance2_1: string;
  over0_5: string;
  over1_5: string;
  over2_5: string;
  over3_5: string;
  over4_5: string;
  under0_5: string;
  under1_5: string;
  under2_5: string;
  under3_5: string;
  under4_5: string;
  goalInBothHalves_Y: string;
  goalInBothHalves_N: string;
  firstGoalscorer1: string;
  firstGoalscorer0: string;
  firstGoalscorer2: string;
  under1_5home: string;
  under1home: string;
  draw_0home: string;
  plus_1home: string;
  plus1_5home: string;
  plus2_5home: string;
  under1_5Deplas: string;
  under1Deplas: string;
  draw_0Deplas: string;
  plus_1Deplas: string;
  plus1_5Deplas: string;
  plus2_5Deplas: string;
  ciftevet: string;
  tekevet: string;
}

const MatchDetails: React.FC = () => {
  const { id } = useParams(); // URL'deki id parametresini alıyoruz
  const [match, setMatch] = useState<Match | null>(null);


  

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

  if (!match) {
    return <Typography variant="h6" align="center">Loading...</Typography>;
  }

  return (
    <Container maxWidth="md" sx={{ paddingTop: 4  }}>
      <Typography variant="h4" gutterBottom align="center">Match Details</Typography>

      <Box>

                <MatchLiveDetails/> 

        
      </Box>

      <Card sx={{ marginBottom: 3, borderRadius: 3, boxShadow: 3 }}>
        <CardContent>
         
   

          <Box sx={{  }}>


    {/* 1x2 Buttons */}
<Box sx={{ marginTop: 2 }}>
  <Typography variant="body1" fontWeight="bold" sx={{ marginBottom: 1 }}>1x2</Typography>
  <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
    <Button
      variant="outlined"
      sx={{
        marginRight: 1,
        display: 'flex',
        justifyContent: 'space-between',
      width: '32.3%',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap'
      }}
    >
      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'left', marginRight: '8px' }}>{match.awayTeam}</span>
    <span style={{ textAlign: 'right', color: 'black', fontWeight: 'bold' }}>{match.awayWin}</span>
    </Button>
    <Button
      variant="outlined"
      sx={{
        marginRight: 1,
        display: 'flex',
        justifyContent: 'space-between',
      width: '32.3%',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap'
      }}
    >
      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'left', marginRight: '8px' }}>Draw</span>
      <span style={{ textAlign: 'right', color: 'black', fontWeight: 'bold' }}>{match.draw}</span>
    </Button>
    <Button
      variant="outlined"
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
      width: '32.3%',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap'
      }}
    >
      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'left', marginRight: '8px' }}>{match.homeTeam}</span>
    <span style={{ textAlign: 'right', color: 'black', fontWeight: 'bold' }}>{match.homeWin}</span>
    </Button>
  </Box>
</Box>



          {/* Double Chance Buttons */}
<Box sx={{ marginTop: 2 }}>
  <Typography variant="body1" fontWeight="bold" sx={{ marginBottom: 1 }}>Double Chance</Typography>
  <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
  <Button
    variant="outlined"
    sx={{
      marginRight: 0.2,
      display: 'flex',
      justifyContent: 'space-between',
      width: '32.3%',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace: 'nowrap'
    }}
  >
    <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'left', marginRight: '8px' }}>{match.awayTeam} or Draw</span>
   <span style={{ textAlign: 'right', color: 'black', fontWeight: 'bold' }}>{match.doubleChance0_2}</span>
  </Button>
  <Button
    variant="outlined"
    sx={{
      marginRight: 0.2,
      display: 'flex',
      justifyContent: 'space-between',
      width: '32.3%',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace: 'nowrap'
    }}
  >
    <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'left', marginRight: '8px' }}>{match.homeTeam} or {match.awayTeam}</span>
   <span style={{ textAlign: 'right', color: 'black', fontWeight: 'bold' }}>{match.doubleChance2_1}</span>
  </Button>
  <Button
    variant="outlined"
    sx={{
      display: 'flex',
      justifyContent: 'space-between',
      width: '32.3%',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace: 'nowrap'
    }}
  >
    <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'left', marginRight: '8px' }}>{match.homeTeam} or Draw </span>
    <span style={{ textAlign: 'right', color: 'black', fontWeight: 'bold' }}>{match.doubleChance0_1}</span>
  </Button>
</Box>
</Box>

{/* Over/Under Buttons */}
<Typography variant="body1" fontWeight="bold" sx={{ marginTop: 2 , mb:1 }}>Total</Typography>

<Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
  
  {/* Under Buttons */}
  <Box sx={{ display: 'flex', flexDirection: 'column', width: '49%' }}>
    <Button variant="outlined" sx={{ marginBottom: 1, display: 'flex', justifyContent: 'space-between', textTransform: "none" }}>
      <span style={{ textAlign: 'left', flex: 1 }}>Under 0.5</span>
      <span style={{ textAlign: 'right', color: 'black', fontWeight: 'bold' }}>{match.under0_5}</span>
    </Button>
    <Button variant="outlined" sx={{ marginBottom: 1, display: 'flex', justifyContent: 'space-between', textTransform: "none" }}>
      <span style={{ textAlign: 'left', flex: 1 }}>Under 1.5</span>
      <span style={{ textAlign: 'right', color: 'black', fontWeight: 'bold' }}>{match.under1_5}</span>
    </Button>
    <Button variant="outlined" sx={{ marginBottom: 1, display: 'flex', justifyContent: 'space-between', textTransform: "none" }}>
      <span style={{ textAlign: 'left', flex: 1 }}>Under 2.5</span>
      <span style={{ textAlign: 'right', color: 'black', fontWeight: 'bold' }}>{match.under2_5}</span>
    </Button>
    <Button variant="outlined" sx={{ marginBottom: 1, display: 'flex', justifyContent: 'space-between', textTransform: "none" }}>
      <span style={{ textAlign: 'left', flex: 1 }}>Under 3.5</span>
      <span style={{ textAlign: 'right', color: 'black', fontWeight: 'bold' }}>{match.under3_5}</span>
    </Button>
    <Button variant="outlined" sx={{ marginBottom: 1, display: 'flex', justifyContent: 'space-between', textTransform: "none" }}>
      <span style={{ textAlign: 'left', flex: 1 }}>Under 4.5</span>
      <span style={{ textAlign: 'right', color: 'black', fontWeight: 'bold' }}>{match.under4_5}</span>
    </Button>
  </Box>

  {/* Over Buttons */}
  <Box sx={{ display: 'flex', flexDirection: 'column', width: '49%' }}>
    <Button variant="outlined" sx={{ marginBottom: 1, display: 'flex', justifyContent: 'space-between', textTransform: "none" }}>
      <span style={{ textAlign: 'left', flex: 1 }}>Over 0.5</span>
      <span style={{ textAlign: 'right', color: 'black', fontWeight: 'bold' }}>{match.over0_5}</span>
    </Button>
    <Button variant="outlined" sx={{ marginBottom: 1, display: 'flex', justifyContent: 'space-between', textTransform: "none" }}>
      <span style={{ textAlign: 'left', flex: 1 }}>Over 1.5</span>
      <span style={{ textAlign: 'right', color: 'black', fontWeight: 'bold' }}>{match.over1_5}</span>
    </Button>
    <Button variant="outlined" sx={{ marginBottom: 1, display: 'flex', justifyContent: 'space-between', textTransform: "none" }}>
      <span style={{ textAlign: 'left', flex: 1 }}>Over 2.5</span>
      <span style={{ textAlign: 'right', color: 'black', fontWeight: 'bold' }}>{match.over2_5}</span>
    </Button>
    <Button variant="outlined" sx={{ marginBottom: 1, display: 'flex', justifyContent: 'space-between', textTransform: "none" }}>
      <span style={{ textAlign: 'left', flex: 1 }}>Over 3.5</span>
      <span style={{ textAlign: 'right', color: 'black', fontWeight: 'bold' }}>{match.over3_5}</span>
    </Button>
    <Button variant="outlined" sx={{ marginBottom: 1, display: 'flex', justifyContent: 'space-between', textTransform: "none" }}>
      <span style={{ textAlign: 'left', flex: 1 }}>Over 4.5</span>
      <span style={{ textAlign: 'right', color: 'black', fontWeight: 'bold' }}>{match.over4_5}</span>
    </Button>
  </Box>
</Box>


         {/* Odd/Even Buttons */}
          <Typography variant="body1" fontWeight="bold" sx={{mb:1,  marginTop: 2}}>Goal in both halves</Typography>


<Box sx={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
  <Button variant="outlined" sx={{ flex: 1, marginRight: 1, display: 'flex', justifyContent: 'space-between' }}>
    Yes: <span style={{ textAlign: 'right', color: 'black', fontWeight: 'bold' }}>{match.goalInBothHalves_Y}</span>
  </Button>
  <Button variant="outlined" sx={{ flex: 1, display: 'flex', justifyContent: 'space-between' }}>
    No: <span style={{ textAlign: 'right', color: 'black', fontWeight: 'bold' }}>{match.goalInBothHalves_N}</span>
  </Button>
</Box>

        
          {/* Double Chance Buttons */}
<Box sx={{ marginTop: 2 }}>
  <Typography variant="body1" fontWeight="bold" sx={{ marginBottom: 1 }}>First Goal</Typography>
  <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
  <Button
    variant="outlined"
    sx={{
      marginRight: 0.2,
      display: 'flex',
      justifyContent: 'space-between',
      width: '32.3%',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace: 'nowrap'
    }}
  >
    <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'left', marginRight: '8px' }}>{match.awayTeam} or Draw</span>
   <span style={{ textAlign: 'right', color: 'black', fontWeight: 'bold' }}>{match.firstGoalscorer2}</span>
  </Button>
  <Button
    variant="outlined"
    sx={{
      marginRight: 0.2,
      display: 'flex',
      justifyContent: 'space-between',
      width: '32.3%',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace: 'nowrap'
    }}
  >
    <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'left', marginRight: '8px' }}>none:</span>
   <span style={{ textAlign: 'right', color: 'black', fontWeight: 'bold' }}>{match.firstGoalscorer0}</span>
  </Button>
  <Button
    variant="outlined"
    sx={{
      display: 'flex',
      justifyContent: 'space-between',
      width: '32.3%',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace: 'nowrap'
    }}
  >
    <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'left', marginRight: '8px' }}>{match.homeTeam} or Draw </span>
    <span style={{ textAlign: 'right', color: 'black', fontWeight: 'bold' }}>{match.firstGoalscorer1}</span>
  </Button>
</Box>
</Box>





{/* Handicap Buttons */}
<Typography variant="body1" fontWeight="bold" sx={{ marginTop: 2, marginBottom: 1 }}>Handicap</Typography>
<Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
  
  {/* Away Team Handicap Buttons */}
  <Box sx={{ display: 'flex', flexDirection: 'column', width: '49%' }}>
    <Button variant="outlined" sx={{ marginBottom: 1, display: 'flex', justifyContent: 'space-between', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'left', marginRight: '8px' }}>{`-1.5 ${match.awayTeam} `}</span>
      <span style={{ textAlign: 'right', color: 'black', fontWeight: 'bold' }}>{match.under1_5Deplas}</span>
    </Button>
    <Button variant="outlined" sx={{ marginBottom: 1, display: 'flex', justifyContent: 'space-between', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'left', marginRight: '8px' }}>{`-1 ${match.awayTeam} `}</span>
      <span style={{ textAlign: 'right', color: 'black', fontWeight: 'bold' }}>{match.under1Deplas}</span>
    </Button>
    <Button variant="outlined" sx={{ marginBottom: 1, display: 'flex', justifyContent: 'space-between', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'left' }}>{`0 ${match.awayTeam} `}</span>
      <span style={{ textAlign: 'right', color: 'black', fontWeight: 'bold' }}>{match.draw_0Deplas}</span>
    </Button>
    <Button variant="outlined" sx={{ marginBottom: 1, display: 'flex', justifyContent: 'space-between', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'left', marginRight: '8px' }}>{`+1 ${match.awayTeam} `}</span>
      <span style={{ textAlign: 'right', color: 'black', fontWeight: 'bold' }}>{match.plus_1Deplas}</span>
    </Button>
    <Button variant="outlined" sx={{ marginBottom: 1, display: 'flex', justifyContent: 'space-between', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'left', marginRight: '8px' }}>{`+1.5 ${match.awayTeam} `}</span>
      <span style={{ textAlign: 'right', color: 'black', fontWeight: 'bold' }}>{match.plus1_5Deplas}</span>
    </Button>
    <Button variant="outlined" sx={{ marginBottom: 1, display: 'flex', justifyContent: 'space-between', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'left', marginRight: '8px' }}>{`+2.5 ${match.awayTeam} `}</span>
      <span style={{ textAlign: 'right', color: 'black', fontWeight: 'bold' }}>{match.plus2_5Deplas}</span>
    </Button>
  </Box>
  
  {/* Home Team Handicap Buttons */}
  <Box sx={{ display: 'flex', flexDirection: 'column', width: '49%' }}>
    <Button variant="outlined" sx={{ marginBottom: 1, display: 'flex', justifyContent: 'space-between', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'left', marginRight: '8px' }}>{`-1.5 ${match.homeTeam} `}</span>
      <span style={{ textAlign: 'right', color: 'black', fontWeight: 'bold' }}>{match.under1_5home}</span>
    </Button>
    <Button variant="outlined" sx={{ marginBottom: 1, display: 'flex', justifyContent: 'space-between', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'left' }}>{`-1 ${match.homeTeam} `}</span>
      <span style={{ textAlign: 'right', color: 'black', fontWeight: 'bold' }}>{match.under1home}</span>
    </Button>
    <Button variant="outlined" sx={{ marginBottom: 1, display: 'flex', justifyContent: 'space-between', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'left', marginRight: '8px' }}>{`0 ${match.homeTeam} `}</span>
      <span style={{ textAlign: 'right', color: 'black', fontWeight: 'bold' }}>{match.draw_0home}</span>
    </Button>
    <Button variant="outlined" sx={{ marginBottom: 1, display: 'flex', justifyContent: 'space-between', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'left', marginRight: '8px' }}>{`+1 ${match.homeTeam} `}</span>
      <span style={{ textAlign: 'right', color: 'black', fontWeight: 'bold' }}>{match.plus_1home}</span>
    </Button>
    <Button variant="outlined" sx={{ marginBottom: 1, display: 'flex', justifyContent: 'space-between', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'left', marginRight: '8px' }}>{`+1.5 ${match.homeTeam} `}</span>
      <span style={{ textAlign: 'right', color: 'black', fontWeight: 'bold' }}>{match.plus1_5home}</span>
    </Button>
    <Button variant="outlined" sx={{ marginBottom: 1, display: 'flex', justifyContent: 'space-between', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'left', marginRight: '8px' }}>{`+2.5 ${match.homeTeam} `}</span>
      <span style={{ textAlign: 'right', color: 'black', fontWeight: 'bold' }}>{match.plus2_5home}</span>
    </Button>
  </Box>
</Box>


        {/* Odd/Even Buttons */}
          <Typography variant="body1" fontWeight="bold" sx={{ mb:1, marginTop: 2}}>Odd/Even</Typography>

{/* Odd/Even Buttons */}
{/* Odd/Even Buttons */}
{/* Odd/Even Buttons */}
<Box sx={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
  <Button variant="outlined" sx={{ flex: 1, marginRight: 1, display: 'flex', justifyContent: 'space-between' }}>
    Odd: <span>{match.tekevet}</span>
  </Button>
  <Button variant="outlined" sx={{ flex: 1, display: 'flex', justifyContent: 'space-between' }}>
    Even: <span>{match.ciftevet}</span>
  </Button>
</Box>






          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default MatchDetails;
