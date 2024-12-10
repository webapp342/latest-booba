import React from 'react';
import { Tabs, Tab, Box, Typography } from '@mui/material';
import { createTheme, ThemeProvider } from "@mui/material/styles";



interface BalanceSelectorProps {
  selectedBalance: string;
  onChange: (event: React.SyntheticEvent, value: string) => void;
}

const theme = createTheme({
  typography: {
    fontFamily: "Montserrat, sans-serif",
  },

});


const BalanceSelector: React.FC<BalanceSelectorProps> = ({ selectedBalance, onChange }) => {
  return (
    <ThemeProvider theme={theme}>

    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        
        alignItems: 'center',
        color: 'black',
      }}
    >
      {/* Başlık */}
      <Typography
  variant="body2"
  sx={{
    fontWeight: 'bold',
    marginBottom: '1rem',
    fontSize: '1rem',
    letterSpacing: '1.5px',
    backgroundImage: 'linear-gradient(to right, green, red)', // Soldan sağa renk geçişi
    backgroundSize: '200% 100%', // Renk geçişi boyutu
    backgroundPosition: 'right bottom',
    WebkitBackgroundClip: 'text', // Yalnızca metni renklendirir
    color: 'transparent', // Yazıyı şeffaf yapar, renk arka plandan gelir
    animation: 'gradientShift 4s ease-in-out infinite', // Animasyonu ekler
    lineHeight: 2,
  }}
>
  Pick Your Winning Token
</Typography>


<style>
  {`
    @keyframes gradientShift {
      0% {
        background-position: right bottom;
      }
      50% {
        background-position: left bottom;
      }
      100% {
        background-position: right bottom;
      }
    }
  `}
</style>


      {/* Sekmeler */}
      <Tabs
        value={selectedBalance}
        onChange={onChange}
        centered
        TabIndicatorProps={{
          style: { display: 'none' }, // Varsayılan göstergeyi gizle
        }}
        sx={{
          '& .MuiTab-root': {
            backgroundColor: 'transparent',
            color: 'black',
            transition: 'all 0.3s',
            padding: '12px 50px',
            fontWeight: 'bold',
            border: '2px solid green',
          },
          '& .MuiTab-root.Mui-selected': {
            backgroundColor: 'green',
            color: 'white',
          },
          '& .MuiTab-root:first-of-type': {
            borderTopLeftRadius: '16px',
            borderBottomLeftRadius: '16px',
          },
          '& .MuiTab-root:last-of-type': {
            borderTopRightRadius: '16px',
            borderBottomRightRadius: '16px',
          },
        }}
      >
        <Tab value="total" label="Ton" />
        <Tab value="bblip" label="Bblip" />
      </Tabs>
    </Box>
    </ThemeProvider>

  );
};

export default BalanceSelector;
