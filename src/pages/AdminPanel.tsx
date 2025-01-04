import React, { useState, useEffect } from 'react';
import { doc, setDoc, collection, getDocs, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase'; // Firebase bağlantısı
import { TextField, Button, Container, Grid, Typography, Card, CardContent, IconButton, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { SelectChangeEvent } from '@mui/material';

const AdminPanel: React.FC = () => {
  const [formData, setFormData] = useState({
    league: '',
    date: '',
    homeTeam: '',
    homeLogo: '',
    awayTeam: '',
    awayLogo: '',
    homeWin: '',
    draw: '',
 
    awayWin: '',
   //cifte sans
    doubleChance0_2: '',
doubleChance0_1: '',
doubleChance2_1: '',
// alt/ust
over0_5: '',
over1_5: '',
 over2_5: '',
over3_5: '', 
 over4_5: '',
under0_5: '',
 under1_5: '',
under2_5: '',
under3_5: '',
under4_5: '',
//her iki yarida gol
goalInBothHalves_Y: '',
goalInBothHalves_N: '',
//ilk gol
 firstGoalscorer1: '',
firstGoalscorer0: '',
firstGoalscorer2: '',
//handikap
under1_5home:'',
under1home:'',
draw_0home:'',
plus_1home:'',
plus1_5home:'',
plus2_5home:'',
 under1_5Deplas:'',
under1Deplas:'',
 draw_0Deplas:'',
plus_1Deplas:'',
plus1_5Deplas:'',
plus2_5Deplas:'',
// tek/cift
 ciftevet: '', 
 tekevet:''

  });
  const [matches, setMatches] = useState<any[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [editMatchId, setEditMatchId] = useState<string | null>(null);
  
  const categories = ['Top Leagues', 'European Leagues', 'International Leagues', 'Others'];
  const popularLeagues = ['Premier League', 'La Liga', 'Serie A', 'Bundesliga', 'Ligue 1'];

  const [selectedCategory, setSelectedCategory] = useState<string>('Top Leagues');
  const [leagues, setLeagues] = useState<string[]>(popularLeagues);

  // Firestore'dan maçları çek
  const fetchMatches = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'matches'));
      const matchesData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMatches(matchesData);
    } catch (error) {
      console.error('Error fetching matches:', error);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    const category = event.target.value;
    setSelectedCategory(category);

    if (category === 'Top Leagues') {
      setLeagues(popularLeagues);
    } else {
      setLeagues([]); // Diğer kategoriler için farklı ligler ekleyebilirsiniz.
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (editMode && editMatchId) {
      try {
        await updateDoc(doc(db, 'matches', editMatchId), formData);
        alert('Match updated successfully!');
        setEditMode(false);
        setEditMatchId(null);
        setFormData({
          league: '',
          date: '',
          homeTeam: '',
          homeLogo: '',
          awayTeam: '',
          awayLogo: '',
          homeWin: '',
          draw: '',
          awayWin: '',

// Double Chance
                                        doubleChance0_2: '',

                    doubleChance0_1: '',
                                        doubleChance2_1: '',


                                        //Total Over


             over0_5: '',  // Over 1.5

             over1_5: '',  // Over 1.5
    over2_5: '',  // Over 2.5
    over3_5: '',  // Over 3.5
    over4_5: '',  // Over 4.5

                //Under 

             under0_5: '',  

               under1_5: '',
                under2_5: '',
                 under3_5: '',
                 under4_5: '',



                


          
 // Gol in both halves

          goalInBothHalves_Y: '',
                    goalInBothHalves_N: '',

          //First Goal Scorer

            firstGoalscorer1: '',  // İlk golü atan takım
                    firstGoalscorer0: '',  // İlk golü atan takım
                                        firstGoalscorer2: '',  // İlk golü atan takım

                                        //Handikap Home

                                        under1_5home:'',
                                        under1home:'',
                                        draw_0home:'',
                                        plus_1home:'',
                                        plus1_5home:'',
                                        plus2_5home:'',

                                       //Handikap Deplasman 

                                       under1_5Deplas:'',
                                        under1Deplas:'',
                                        draw_0Deplas:'',
                                        plus_1Deplas:'',
                                        plus1_5Deplas:'',
                                        plus2_5Deplas:'',

         
// Çift/Çift bahisi

          ciftevet: '', 
          tekevet:'',

        





        });
        fetchMatches();
      } catch (error) {
        console.error('Error updating match:', error);
        alert('Error updating match. Please try again.');
      }
    } else {
      const matchId = `${formData.homeTeam}_vs_${formData.awayTeam}_${formData.date}`;
      try {
        await setDoc(doc(db, 'matches', matchId), formData);
        alert('Match added successfully!');
        setFormData({
          league: '',
          date: '',
          homeTeam: '',
          homeLogo: '',
          awayTeam: '',
          awayLogo: '',
          homeWin: '',
          draw: '',
          awayWin: '',

// Double Chance
                                        doubleChance0_2: '',

                    doubleChance0_1: '',
                                        doubleChance2_1: '',


                                        //Total Over


             over0_5: '',  // Over 1.5

             over1_5: '',  // Over 1.5
    over2_5: '',  // Over 2.5
    over3_5: '',  // Over 3.5
    over4_5: '',  // Over 4.5

                //Under 

             under0_5: '',  

               under1_5: '',
                under2_5: '',
                 under3_5: '',
                 under4_5: '',



                


          
 // Gol in both halves

          goalInBothHalves_Y: '',
                    goalInBothHalves_N: '',

          //First Goal Scorer

            firstGoalscorer1: '',  // İlk golü atan takım
                    firstGoalscorer0: '',  // İlk golü atan takım
                                        firstGoalscorer2: '',  // İlk golü atan takım

                                        //Handikap Home

                                        under1_5home:'',
                                        under1home:'',
                                        draw_0home:'',
                                        plus_1home:'',
                                        plus1_5home:'',
                                        plus2_5home:'',

                                       //Handikap Deplasman 

                                       under1_5Deplas:'',
                                        under1Deplas:'',
                                        draw_0Deplas:'',
                                        plus_1Deplas:'',
                                        plus1_5Deplas:'',
                                        plus2_5Deplas:'',

         
// Çift/Çift bahisi

          ciftevet: '', 
          tekevet:'',

        });
        fetchMatches();
      } catch (error) {
        console.error('Error adding match:', error);
        alert('Error adding match. Please try again.');
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'matches', id));
      alert('Match deleted successfully!');
      fetchMatches();
    } catch (error) {
      console.error('Error deleting match:', error);
      alert('Error deleting match. Please try again.');
    }
  };

  const handleEdit = (match: any) => {
    setEditMode(true);
    setEditMatchId(match.id);
    setFormData({

      league: match.league,
      date: match.date,

      homeTeam: match.homeTeam,
      homeLogo: match.homeLogo,
      awayTeam: match.awayTeam,
      awayLogo: match.awayLogo,

      homeWin: match.homeWin,
      awayWin: match.awayWin,
      draw: match.draw,


      doubleChance0_2: match.doubleChance0_2,
      
      doubleChance0_1: match.doubleChance0_1,
      doubleChance2_1: match.doubleChance2_1,
      over0_5: match.over0_5,  // Gol sayısı bahisleri
      over1_5: match.over1_5,  // Gol sayısı bahisleri
      over2_5: match.over2_5,  // Gol sayısı bahisleri
      over3_5: match.over3_5,  // Gol sayısı bahisleri
      over4_5: match.over4_5,  // Gol sayısı bahisleri
      under0_5: match.under0_5,    // Düzenleme
       under1_5: match.under1_5,    // Düzenleme
 under2_5: match.under2_5,    // Düzenleme
 under3_5: match.under3_5,    // Düzenleme
 under4_5:match.under4_5,    // Düzenleme
 //her iki yarida gol
goalInBothHalves_Y: match.goalInBothHalves_Y,
goalInBothHalves_N: match.goalInBothHalves_N,
//ilk gol
 firstGoalscorer1: match.firstGoalscorer1,
firstGoalscorer0: match.firstGoalscorer0,
firstGoalscorer2: match.firstGoalscorer2,
//handikap
under1_5home:match.under1_5home,
under1home:match.under1home,
draw_0home:match.draw_0home,
plus_1home:match.plus_1home,
plus1_5home:match.plus1_5home,
plus2_5home:match.plus2_5home,
 under1_5Deplas:match.under1_5Deplas,
under1Deplas:match.under1Deplas,
 draw_0Deplas:match.draw_0Deplas,
plus_1Deplas:match.plus_1Deplas,
plus1_5Deplas:match.plus1_5Deplas,
plus2_5Deplas:match.plus2_5Deplas,
// tek/cift
 ciftevet: match.ciftevet, 
 tekevet:match.tekevet



      
    });
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Admin Panel</Typography>

      <Card sx={{ marginBottom: 3 }}>
        <CardContent>
          <Typography variant="h6">Add or Edit Match</Typography>
          <Grid container spacing={2}>
            {/* Category and League Selection */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Kategori</InputLabel>
                <Select
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  label="Kategori"
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Lig"
                fullWidth
                name="league"
                select
                value={formData.league}
                onChange={handleInputChange}
              >
                {leagues.map((league) => (
                  <MenuItem key={league} value={league}>
                    {league}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Match Date, Teams, Logos, and Odds */}
            <Grid item xs={12} md={6}>
              <TextField
                label="Tarih ve Saat"
                fullWidth
                name="date"
                type="datetime-local"
                value={formData.date}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Ev sahibi ISMI"
                fullWidth
                name="homeTeam"
                value={formData.homeTeam}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Ev sahibi LOGO"
                fullWidth
                name="homeLogo"
                value={formData.homeLogo}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Deplasman Takim ISMI"
                fullWidth
                name="awayTeam"
                value={formData.awayTeam}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Deplasman Takim LOGO"
                fullWidth
                name="awayLogo"
                value={formData.awayLogo}
                onChange={handleInputChange}
              />
            </Grid>

            {/* Odds and Bet Types */}
            <Grid item xs={12} md={4}>
              <TextField
                label="MS Ev Sahibi Kazanir"
                fullWidth
                name="homeWin"
                value={formData.homeWin}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="MS Beraberlik"
                fullWidth
                name="draw"
                value={formData.draw}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="MS Deplasman Kazanir"
                fullWidth
                name="awayWin"
                value={formData.awayWin}
                onChange={handleInputChange}
              />
            </Grid>

            {/* Additional Bet Types */}
            <Grid item xs={12} md={6}>
              <TextField
                label="CIFTE SANS 0/2"
                fullWidth
                name="doubleChance0_2"
                value={formData.doubleChance0_2}
                onChange={handleInputChange}
              />
            </Grid>
             {/* Over/Under fields */}
            <Grid item xs={12} md={6}>
              <TextField
                label="CIFTE SANS 0/1"
                fullWidth
                name="doubleChance0_1"
                value={formData.doubleChance0_1}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="CIFTE SANS 2/1"
                fullWidth
                name="doubleChance2_1"
                value={formData.doubleChance2_1}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="ALT/UST +0.5"
                fullWidth
                name="over0_5"
                value={formData.over0_5}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="ALT/UST +1.5"
                fullWidth
                name="over1_5"
                value={formData.over1_5}
                onChange={handleInputChange}
              />
            </Grid>

            {/* Other Bet Types */}
            <Grid item xs={12} md={6}>
              <TextField
                label="ALT/UST +2.5"
                fullWidth
                name="over2_5"
                value={formData.over2_5}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="ALT/UST +3.5"
                fullWidth
                name="over3_5"
                value={formData.over3_5}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="ALT/UST +4.5"
                fullWidth
                name="over4_5"
                value={formData.over4_5}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="ALT/UST -0.5"
                fullWidth
                name="under0_5"
                value={formData.under0_5}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="ALT/UST -1.5"
                fullWidth
                name="under1_5"
                value={formData.under1_5}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="ALT/UST -2.5"
                fullWidth
                name="under2_5"
                value={formData.under2_5}
                onChange={handleInputChange}
              />
            </Grid>

            
            <Grid item xs={12} md={6}>
              <TextField
                label="ALT/UST -3.5"
                fullWidth
                name="under3_5"
                value={formData.under3_5}
                onChange={handleInputChange}
              />
            </Grid>

            
            <Grid item xs={12} md={6}>
              <TextField
                label="ALT/UST -4.5"
                fullWidth
                name="under4_5"
                value={formData.under4_5}
                onChange={handleInputChange}
              />
            </Grid>

            
            <Grid item xs={12} md={6}>
              <TextField
                label="Her iki yarida gol VAR"
                fullWidth
                name="goalInBothHalves_Y"
                value={formData.goalInBothHalves_Y}
                onChange={handleInputChange}
              />
            </Grid>

                <Grid item xs={12} md={6}>
              <TextField
                label="Her iki yarida gol YOK "
                fullWidth
                name="goalInBothHalves_N"
                value={formData.goalInBothHalves_N}
                onChange={handleInputChange}
              />
            </Grid>

               <Grid item xs={12} md={6}>
              <TextField
                label="Ilk gol Ev sahibi"
                fullWidth
                name="firstGoalscorer1"
                value={formData.firstGoalscorer1}
                onChange={handleInputChange}
              />
            </Grid>

                <Grid item xs={12} md={6}>
              <TextField
                label="Ilk gol Hicbiri (macta hic gol olmayacak )"
                fullWidth
                name="firstGoalscorer0"
                value={formData.firstGoalscorer0}
                onChange={handleInputChange}
              />
            </Grid>


                 <Grid item xs={12} md={6}>
              <TextField
                label="Ilk gol deplasman"
                fullWidth
                name="firstGoalscorer2"
                value={formData.firstGoalscorer2}
                onChange={handleInputChange}
              />
            </Grid>

            
                 <Grid item xs={12} md={6}>
              <TextField
                label="Ev  -1.5 Handikap"
                fullWidth
                name="under1_5home"
                value={formData.under1_5home}
                onChange={handleInputChange}
              />
            </Grid>

            

                       <Grid item xs={12} md={6}>
              <TextField
                label="Ev  -1 Handikap"
                fullWidth
                name="under1home"
                value={formData.under1home}
                onChange={handleInputChange}
              />
            </Grid>

                          <Grid item xs={12} md={6}>
              <TextField
                label="Ev  0 Handikap"
                fullWidth
                name="draw_0home"
                value={formData.draw_0home}
                onChange={handleInputChange}
              />
            </Grid>

                         <Grid item xs={12} md={6}>
              <TextField
                label="Ev  +1 Handikap"
                fullWidth
                name="plus_1home"
                value={formData.plus_1home}
                onChange={handleInputChange}
              />
            </Grid>

                         <Grid item xs={12} md={6}>
              <TextField
                label="Ev  +1.5 Handikap"
                fullWidth
                name="plus1_5home"
                value={formData.plus1_5home}
                onChange={handleInputChange}
              />
            </Grid>

                            <Grid item xs={12} md={6}>
              <TextField
                label="Ev  +2.5 Handikap"
                fullWidth
                name="plus2_5home"
                value={formData.plus2_5home}
                onChange={handleInputChange}
              />
            </Grid>

                               <Grid item xs={12} md={6}>
              <TextField
                label="Deplasman -1.5 Handikap"
                fullWidth
                name="under1_5Deplas"
                value={formData.under1_5Deplas}
                onChange={handleInputChange}
              />
            </Grid>

                                 <Grid item xs={12} md={6}>
              <TextField
                label="Deplasman -1 Handikap"
                fullWidth
                name="under1Deplas"
                value={formData.under1Deplas}
                onChange={handleInputChange}
              />
            </Grid>
            
            
                                 <Grid item xs={12} md={6}>
              <TextField
                label="Deplasman 0 Handikap"
                fullWidth
                name="draw_0Deplas"
                value={formData.draw_0Deplas}
                onChange={handleInputChange}
              />
            </Grid>

                <Grid item xs={12} md={6}>
              <TextField
                label="Deplasman +1 Handikap"
                fullWidth
                name="plus_1Deplas"
                value={formData.plus_1Deplas}
                onChange={handleInputChange}
              />
            </Grid>

            
                <Grid item xs={12} md={6}>
              <TextField
                label="Deplasman +1.5 Handikap"
                fullWidth
                name="plus1_5Deplas"
                value={formData.plus1_5Deplas}
                onChange={handleInputChange}
              />
            </Grid>

             
                <Grid item xs={12} md={6}>
              <TextField
                label="Deplasman +2.5 Handikap"
                fullWidth
                name="plus2_5Deplas"
                value={formData.plus2_5Deplas}
                onChange={handleInputChange}
              />
            </Grid>

               <Grid item xs={12} md={6}>
              <TextField
                label="Mac Sonucu 'CIFT' "
                fullWidth
                name="ciftevet"
                value={formData.ciftevet}
                onChange={handleInputChange}
              />
            </Grid>

                <Grid item xs={12} md={6}>
              <TextField
                label="Mac Sonucu 'TEK' "
                fullWidth
                name="tekevet"
                value={formData.tekevet}
                onChange={handleInputChange}
              />
            </Grid>


          </Grid>

          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editMode ? 'Update Match' : 'Add Match'}
          </Button>
        </CardContent>
      </Card>

      {/* Display Matches */}
      {matches.map((match) => (
        <Card key={match.id} sx={{ marginBottom: 2 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="h6">{match.homeTeam} vs {match.awayTeam}</Typography>
                <Typography variant="body1">{match.date}</Typography>
                <Typography variant="body1">Odds: {match.homeWin} | {match.draw} | {match.awayWin}</Typography>
                {/* Display other match details */}
              </Grid>
              <Grid item xs={6}>
                <IconButton onClick={() => handleEdit(match)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(match.id)}>
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}
    </Container>
  );
};

export default AdminPanel;
