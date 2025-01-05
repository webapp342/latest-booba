import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase'; // Firebase bağlantısını buradan alıyoruz
import { Container, Card, CardContent, Typography, Grid, Divider, IconButton, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { FavoriteBorder as FavoriteIcon } from '@mui/icons-material';
import { SelectChangeEvent } from '@mui/material'; // Bu importu ekleyin
import { useNavigate } from 'react-router-dom'; // useNavigate'yi import edin

interface Match {
  id: string;
  league: string;
  date: string;
  homeWin: number;
  draw: number;
  awayWin: number;
  homeTeam: string;
  homeLogo: string;
  awayTeam: string;
  awayLogo: string;
}

const MatchesList: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]); // matches tipi Match dizisi olmalı
  const [leagues, setLeagues] = useState<string[]>([]); // Lige ait kategoriler
  const [selectedLeague, setSelectedLeague] = useState<string>('');
  const navigate = useNavigate(); // Yönlendirme işlemi için navigate kullanıyoruz

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'matches'));
        const matchesData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Match[];
        const leaguesList = Array.from(new Set(matchesData.map((match) => match.league)));
        setLeagues(leaguesList);
        setMatches(matchesData);
      } catch (error) {
        console.error('Error fetching matches:', error);
      }
    };

    fetchMatches();
  }, []);

  const handleLeagueChange = (event: SelectChangeEvent<string>) => {
    setSelectedLeague(event.target.value);
  };

  const filteredMatches = selectedLeague
    ? matches.filter((match) => match.league === selectedLeague)
    : matches;

  const handleCardClick = (id: string) => {
    navigate(`/latest-booba/match/${id}`); // Tıklanan maçın ID'sine göre detay sayfasına yönlendiriyoruz
  };

  return (
    <Container maxWidth="md" sx={{ paddingTop: 4 }}>
      <Typography variant="h4" gutterBottom align="center">Upcoming Matches</Typography>

      <FormControl fullWidth>
        <InputLabel>Choose League</InputLabel>
        <Select value={selectedLeague} label="Choose League" onChange={handleLeagueChange}>
          <MenuItem value="">All Leagues</MenuItem>
          {leagues.map((league) => (
            <MenuItem key={league} value={league}>
              {league}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {filteredMatches.map((match) => (
        <Card key={match.id} sx={{ marginBottom: 3, borderRadius: 3, boxShadow: 3 }} onClick={() => handleCardClick(match.id)}>
          <CardContent>
            <Grid container spacing={2} direction="row" alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography variant="h6">{match.league}</Typography>
                   <Grid item xs={12}>
                <Typography variant="h6" align="center">{new Date(match.date).toLocaleDateString()}</Typography>              </Grid>
              </Grid>
              <Grid item xs={12} md={6} sx={{ textAlign: 'right' }}>
                <IconButton color="primary">
                  <FavoriteIcon />
                </IconButton>
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Grid container spacing={2} alignItems="center">
              <Grid item xs={4} sx={{ display: 'flex', alignItems: 'center' }}>
                <img src={match.homeLogo} alt={match.homeLogo} width="40" style={{ borderRadius: '50%' }} />
                <Typography sx={{ marginLeft: 1 }}>{match.homeTeam}</Typography>
              </Grid>
              <Grid item xs={4} sx={{ textAlign: 'center' }}>
                <Typography variant="h5" fontWeight="bold">VS</Typography>
              </Grid>
              <Grid item xs={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                <Typography sx={{ marginRight: 1 }}>{match.awayTeam}</Typography>
                <img src={match.awayLogo} alt={match.awayLogo} width="40" style={{ borderRadius: '50%' }} />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}
    </Container>
  );
};

export default MatchesList;
