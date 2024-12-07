import React, {  } from 'react';
import { Box, Typography, Button, Card, CardContent } from '@mui/material';
import BasicStack from './Earn';
import CryptoCards from '../pages/extras/CryptoCards';
import Calculator from './Calculator';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import VerticalAlignBottomIcon from '@mui/icons-material/VerticalAlignBottom';import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link ,  useNavigate } from 'react-router-dom';
import ProgressStepper from './QontoConnector';
import VerifiedIcon from '@mui/icons-material/Verified';

const theme = createTheme({
  typography: {
    fontFamily: 'Montserrat, sans-serif',
  },
});

const PointsManager: React.FC = () => {
  const totalBalance = `= 9,235 USD`;
  const percentageChange = '+8,391 USD Today';
  const steps = [
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
  ];
  const activeSteps = [0,1, 2, 3]; // Only these steps will be active
  const navigate = useNavigate();
  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          overflowX: 'hidden',
        }}
      >
        <Box>
          {/* Üst Bilgilendirme */}
          <Box
            m={2}
            justifyContent="space-between"
            alignItems="center"
            display="flex"
          >
            <AutorenewIcon sx={{ fontSize: '1.6rem', color: 'black' }} />
           
            <Typography   
            sx={{
              fontSize: '1.3rem',
              fontWeight: 'bold',
              
              background: 'linear-gradient(90deg, #031340, #08AEEA)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
           CAPVERSAL

           </Typography>
            <PersonOutlinedIcon sx={{ fontSize: '1.6rem', color: 'black' }} />
          </Box>

          {/* Kart: Total Balance ve Buton */}
          <Box p={1} display="flex" justifyContent="center" mt={-1}>
            <Card
              sx={{
                width: '100%',
                maxWidth: '400px',
                backgroundColor: '#2c3e50',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                borderRadius: 2,
              }}
            >
              <CardContent>
                {/* Total Balance */}
                <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
                  <Typography sx={{ color: '#909eae', fontWeight: 'bold', fontSize: '0.8rem' }}>
                    TOTAL BALANCE
                  </Typography>
                  <Typography sx={{ color: 'white', fontWeight: 'bold', fontSize: '1.4rem' }}>
                    {totalBalance}
                  </Typography>
                  <Typography sx={{ color: '#00b894', fontSize: '0.8rem' }}>
                    {percentageChange}
                  </Typography>
                </Box>

                {/* Deposit Button */}
                <Button
                  variant="contained"
                  color="success"
                  endIcon={<VerticalAlignBottomIcon />}
                  component={Link}
                  to="/latest-booba/farm"
                  sx={{
                    marginBottom: -1,
                    textTransform: 'none', // Harfleri büyük yapmayı devre dışı bırakır
                    width: '100%', // Buton genişliği kart kadar olur
                    backgroundColor: '#00b894',
                  }}
                >
                  Deposit
                </Button>
              </CardContent>
            </Card>
          </Box>

       {/* Kart: Total Balance ve Buton */}
<Box p={1} display="flex" justifyContent="center" mt={-1}>
  <Card
          onClick={() => navigate('/latest-booba/task')} // Tıklanma olayında yönlendirme
    sx={{
      width: '100%',
      maxWidth: '400px',
      backgroundColor: '#2c3e50',
      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
      borderRadius: 2,
    }}
  >
   <CardContent>
      {/* Total Balance */}
      <Box display="flex" flexDirection="column" alignItems="flex-start" mb={-1}>

        <Typography
          sx={{
            color: 'white',
            fontWeight: 'bold',
            fontSize: '1.2rem',
            textAlign: 'left', // Sola hizalama
          }}
        >
          Complete tasks and get
        </Typography>
        <Typography
          sx={{
            color: 'white',
            fontWeight: 'bold',
            fontSize: '1.2rem',
            textAlign: 'left', // Sola hizalama
          }}
        >
         up to $2,290
        </Typography>
        
       
      </Box>
      <Box mt={1}>

      <ProgressStepper steps={steps} activeSteps={activeSteps} />   
        {/* Alt Bilgi */}
        <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
        <Typography
          sx={{
            color: '#909eae',
            fontWeight: 'bold',
            fontSize: '0.8rem',
            textAlign: 'left', // Sola hizalama
          }}
        >
          4/10 tasks completed
        </Typography>
        

        {/* Sağdaki Kutu */}
        <Box
        mt={0}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5, // İkon ve yazı arası boşluk
            backgroundColor: '#00b894',
            borderRadius: 3,
            boxShadow:4,
           
            px: 1, // Yatay iç boşluk
            py: 0.5, // Dikey iç boşluk
          }}
        >
          <VerifiedIcon
            sx={{
              color: 'gold', // İkon rengi (yeşil)
              fontSize: '1rem',
            }}
          />
          <Typography
            sx={{
              color: '#fff', // Yazı rengi (beyaz)
              fontSize: '0.8rem',
              fontWeight: 'bold',
            }}
          >
            Pro
          </Typography>
        </Box>
      </Box>  
      </Box>
    
    </CardContent>
  </Card>
</Box>

        </Box>
      </Box>
    </ThemeProvider>
  );
};

const App = () => {
  return (
    <Box>
      <PointsManager />
      <CryptoCards />
      <BasicStack />
      <Calculator />
    </Box>
  );
};

export default App;
