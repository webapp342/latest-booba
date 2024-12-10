import React, { useState, useEffect } from 'react';
import { Button, Tabs, Tab, AppBar, Typography, Box } from '@mui/material';
import { createTheme, ThemeProvider } from "@mui/material/styles";


const theme = createTheme({
  typography: {
    fontFamily: "Montserrat, sans-serif",
  },

});


// Sayıyı 6 haneli formatta (000.000) göstermek için fonksiyon
const formatAmount = (amount: number) => {
  const paddedAmount = amount.toString().padStart(6, '0'); // En az 6 haneli yapmak için başına sıfır ekler
  const integerPart = paddedAmount.slice(0, 3); // İlk 3 haneli kısmı alır
  const decimalPart = paddedAmount.slice(3); // Sonraki 3 haneli kısmı alır
  return `${parseInt(integerPart, 10)}.${decimalPart}`; // Tam sayı kısmındaki sıfırları kaldırır
};

interface SpinAndDepositButtonsProps {
  total: number;
  tickets: number;
  bblip: number;
  selectedSpinType: string;
  handleSpin: () => void;
  openDepositDrawer: () => void;
  handleSpinTypeChange: (event: React.SyntheticEvent, value: string) => void;
}



const SpinAndDepositButtons: React.FC<SpinAndDepositButtonsProps> = ({
  total,
  tickets,
  bblip,
  selectedSpinType,
  handleSpin,
  openDepositDrawer,
  handleSpinTypeChange,
}) => {
  const [loading, setLoading] = useState(false);
  const [prevTotal, setPrevTotal] = useState(total);
  const [prevTickets, setPrevTickets] = useState(tickets);
  const [prevBblip, setPrevBblip] = useState(bblip);
  const [amountStyle, setAmountStyle] = useState({});

  // useEffect to update previous values when actual values change
  useEffect(() => {
    // Check if the total has increased or decreased
    if (total > prevTotal) {
      setAmountStyle({ color: 'green' });
      setTimeout(() => setAmountStyle({}), 500); // Reset the color after a short time
    } else if (total < prevTotal) {
      setAmountStyle({ color: 'red' });
      setTimeout(() => setAmountStyle({}), 500); // Reset the color after a short time
    }
    setPrevTotal(total); // Update prevTotal after checking
  }, [total, prevTotal]);

  useEffect(() => {
    // Check if tickets have increased or decreased
    if (tickets > prevTickets) {
      setAmountStyle({ color: 'green' });
      setTimeout(() => setAmountStyle({}), 500); // Reset the color after a short time
    } else if (tickets < prevTickets) {
      setAmountStyle({ color: 'red' });
      setTimeout(() => setAmountStyle({}), 500); // Reset the color after a short time
    }
    setPrevTickets(tickets); // Update prevTickets after checking
  }, [tickets, prevTickets]);

  useEffect(() => {
    // Check if bblip has increased or decreased
    if (bblip > prevBblip) {
      setAmountStyle({ color: 'green' });
      setTimeout(() => setAmountStyle({}), 500); // Reset the color after a short time
    } else if (bblip < prevBblip) {
      setAmountStyle({ color: 'red' });
      setTimeout(() => setAmountStyle({}), 500); // Reset the color after a short time
    }
    setPrevBblip(bblip); // Update prevBblip after checking
  }, [bblip, prevBblip]);

  // Spin etkinlik durumu
  const isSpinEnabled =
    (selectedSpinType === 'total' && total >= 200) ||
    (selectedSpinType === 'ticket' && tickets > 0) ||
    (selectedSpinType === 'bblip' && bblip >= 250);

  const handleSpinClick = () => {
    setLoading(true);
    handleSpin();
    setTimeout(() => setLoading(false), 2300); // 20 saniye sonra loading durumunu kaldır
  };

  // Dinamik Spin Button Text
  let spinButtonText = '';
  if (selectedSpinType === 'total') {
    spinButtonText = `Spin with 0.2 TON`;
  } else if (selectedSpinType === 'ticket') {
    spinButtonText = `Spin with 1 Ticket`;
  } else if (selectedSpinType === 'bblip') {
    spinButtonText = `Spin with 1 BBLIP`;
  }

  // Miktarları formatlayarak göster
  let availableAmount = '';
  if (selectedSpinType === 'total') {
    availableAmount = `${formatAmount(total)} $TON available`;
  } else if (selectedSpinType === 'ticket') {
    availableAmount = `${tickets} Tickets available`;
  } else if (selectedSpinType === 'bblip') {
    availableAmount = `${formatAmount(bblip)} $BBLIP available`;
  }

  return (
    <ThemeProvider theme={theme}>

    <Box
    sx={{
      width: '110%',
      margin: '0 ',
      borderRadius: 3,
      textAlign: 'center',
      color: 'black',
    }}
  >
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
    animation: 'gradientShift 3s ease-in-out infinite', // Animasyonu ekler
    lineHeight: 2,
  }}
>
Pick Your Power </Typography>


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
      {/* Tabs Kullanımı */}
      <AppBar position="static" color="default" sx={{   borderRadius: 14 ,     boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)', // Hafif gölge
}}>
      <Tabs
  value={selectedSpinType}
  onChange={handleSpinTypeChange}
  indicatorColor="primary"
  textColor="primary"
  variant="fullWidth"
  aria-label="spin type tabs"
  sx={{
    backdropFilter: 'blur(10px)', // Cam efekti
    borderRadius: '16px',
    
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)', // Hafif gölge
    '& .MuiTabs-indicator': {
      backgroundColor: 'green',
      height: '4px', // Gösterge çizgisini biraz kalın yapar
      borderRadius: '14px',
    },
    '& .MuiTab-root': {
      fontSize: '0.8rem',
      fontWeight: 'bold',
      color: '#333',
      transition: 'all 0.3s ease',
      padding: '10px 20px',
      borderRadius: '16px',
      '&:hover': {
        backgroundColor: 'rgba(0, 128, 0, 0.1)', // Hover sırasında hafif yeşil bir arka plan
        color: 'green',
        borderRadius: '16px',

      },
    },
    '& .MuiTab-root.Mui-selected': {
      backgroundColor: 'rgba(0, 128, 0, 0.2)', // Seçili sekme için daha belirgin bir renk
      color: 'green',
      borderRadius: '16px',

    },
  }}
>
  <Tab
    value="ticket"
    icon={
      <img
        src="https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=040"
        alt="Bitcoin Logo"
        style={{ width: '40px', height: '40px' }}
      />
    }
    aria-label="Ticket"
  />
  <Tab
    value="total"
    icon={
      <img
        src="https://cryptologos.cc/logos/toncoin-ton-logo.png?v=040"
        alt="Autonio Logo"
        style={{ width: '40px', height: '40px' }}
      />
    }
    aria-label="TON"
  />
  <Tab
    value="bblip"
    icon={
      <img
        src="https://cryptologos.cc/logos/autonio-niox-logo.png?v=040"
        alt="TON Logo"
        style={{ width: '40px', height: '40px' }}
      />
    }
    aria-label="BBlip"
  />
</Tabs>

      </AppBar>

      {/* Seçilen Spin Türü ve Miktarının Gösterilmesi */}
      <Typography variant="body2" sx={{ marginTop: '12px', fontWeight: 'bold', ...amountStyle }}>
        {availableAmount}
      </Typography>

      {/* Spin ve Deposit Butonları */}
      {isSpinEnabled || loading ? (
        <Button
          onClick={handleSpinClick}
          disabled={loading}
          sx={{
            backgroundColor: loading ? 'green' : 'green', // Yüklenme sırasında gri renk
            color: 'white',
            width: '100%',
            mt: 2,
            borderRadius: 2,
            fontWeight: 'bold',
            padding: '10px 20px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Spinning...' : spinButtonText}
        </Button>
      ) : (
        <Button
          onClick={openDepositDrawer}
          sx={{
            backgroundColor: 'red',
            color: 'white',
            mt: 2,
            width: '100%',
            padding: '10px 20px',
            cursor: 'pointer',
          }}
        >
          Deposit
        </Button>
      )}
    </Box>
    </ThemeProvider>

  );
};

export default SpinAndDepositButtons;
