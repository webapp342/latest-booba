
import { Typography, Grid, Box, Avatar } from '@mui/material';
import { styled } from '@mui/system';
import logo5 from '../../assets/logo5.jpg'; // Logo5 import edildi

const StyledBox = styled(Box)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.2)', // Yarı saydam beyaz arka plan
  backdropFilter: 'blur(10px)', // Cam efekti
  color: '#fff',
  borderRadius: theme.spacing(1), // Küçük köşe yuvarlama
  boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.2)',
  textAlign: 'center',
  display: 'flex',
  justifyContent: 'start',  // Sol hizalama
  alignItems: 'center',  // Dikeyde ortalama
  gap: '1.5px', // Logo ve yazı arasındaki boşluk
}));

const GameTitle = styled(Typography)(({  }) => ({
  fontSize: '1rem',
  fontWeight: 'bold',
  color: '#ffeb3b', // Sarı renk
  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)', // Gölgeli efekt
  textAlign: 'center',
}));

const DisplayCards = ({ total, bblip }: { total: number; bblip: number }) => {
  const formattedTotal = (total / 1000).toFixed(2); // Tam sayı
  const formattedBblip = (bblip / 1000).toFixed(2);

  return (
    <Box  sx={{ p:0.5 }}>
      <Grid container justifyContent="space-between" alignItems="center">
        {/* TON Balance */}
        <Grid item xs="auto" >
          <StyledBox width={'100%' } marginRight={1}>
            <Avatar
              alt="TON Logo"
              src="https://cryptologos.cc/logos/toncoin-ton-logo.png?v=040"
              sx={{ width: 18, height: 18 }} // TON logosu dairesel avatar
            />
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              TON
            </Typography>
            <Typography  variant="body2" sx={{marginLeft:2, fontWeight: 'bold' }}>
              {formattedTotal}
            </Typography>
          </StyledBox>
        </Grid>

        {/* Oyunun Başlığı */}
   <Box width={'25%'} sx={{border:'1px solid black'}}>

            <GameTitle>
            999x CRASH
          </GameTitle>
        
   </Box>
  


        {/* BBLIP Balance */}
        <Grid item xs="auto">
          <StyledBox width={'100%'} marginRight={1}>
            <Avatar
              alt="Logo 5"
              src={logo5}
              sx={{ width: 18, height: 18 }} // Logo5 dairesel avatar
            />
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              BBLIP
            </Typography>
            <Typography variant="body2" sx={{marginLeft:3,  fontWeight: 'bold' }}>
              {formattedBblip}
            </Typography>
          </StyledBox>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DisplayCards;
