import React, { useState } from 'react';
import { Button, Tabs, Tab, AppBar, Typography } from '@mui/material';

// Sayıyı 6 haneli formatta (000.000) göstermek için fonksiyon
const formatNumber = (num: number) => {
  const numString = num.toString().padStart(6, '0');
  return numString.slice(0, 3) + '.' + numString.slice(3);
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

  // Spin etkinlik durumu
  const isSpinEnabled =
    (selectedSpinType === 'total' && total >= 250) ||
    (selectedSpinType === 'ticket' && tickets > 0) ||
    (selectedSpinType === 'bblip' && bblip >= 250);

  const handleSpinClick = () => {
    setLoading(true);
    handleSpin();
    setTimeout(() => setLoading(false), 20000); // 20 saniye sonra loading durumunu kaldır
  };

  // Dinamik Spin Button Text
  let spinButtonText = '';
  if (selectedSpinType === 'total') {
    spinButtonText = `Spin with 0.2 TON`;
  } else if (selectedSpinType === 'ticket') {
    spinButtonText = `Spin with 1 Ticket`;
  } else if (selectedSpinType === 'bblip') {
    spinButtonText = `Spin with 1000 BBLIP`;
  }

  // Miktarları formatlayarak göster
  let availableAmount = '';
  if (selectedSpinType === 'total') {
    availableAmount = `${formatNumber(total)} $TON available`;
  } else if (selectedSpinType === 'ticket') {
    availableAmount = `${(tickets)} Tickets available`;
  } else if (selectedSpinType === 'bblip') {
    availableAmount = `${formatNumber(bblip)} $BBLIP available`;
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '20px',
        color: 'black',
      }}
    >
      <h4>Choose your bet</h4>

      {/* Tabs Kullanımı */}
      <AppBar position="static" color="default" sx={{ width: '125%', maxWidth: 500, borderRadius: 2 }}>
        <Tabs
          value={selectedSpinType}
          onChange={handleSpinTypeChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="spin type tabs"
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: 'black', // Burada yeşil renk veriyoruz
            },
            '& .MuiTab-root': {
              fontSize: '0.7rem',
              borderBottom: '1px solid #e0e0e0', // Tab'lar arasında ince bir çizgi
            },
            '& .MuiTab-root.Mui-selected': {
              color: 'green', // Seçili tab için yazı rengi
              fontSize: '0.9rem',
            },
          }}
        >
          <Tab
            value="ticket"
            icon={<img src="https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=040" alt="Bitcoin Logo" style={{ width: '40px', height: '40px' }} />}
            aria-label="Ticket"
          />
          <Tab
            value="total"
            icon={<img src="https://cryptologos.cc/logos/toncoin-ton-logo.png?v=040" alt="Autonio Logo" style={{ width: '40px', height: '40px' }} />}
            aria-label="TON"
          /> 
          
          <Tab
            value="bblip"
            icon={<img src="https://cryptologos.cc/logos/autonio-niox-logo.png?v=040" alt="TON Logo" style={{ width: '40px', height: '40px' }} />}
            aria-label="BBlip"
          />
        </Tabs>
      </AppBar>

      {/* Seçilen Spin Türü ve Miktarının Gösterilmesi */}
      <Typography variant="body1" sx={{ marginTop: '8px', fontWeight: 'bold' }}>
        Available: {availableAmount}
      </Typography>

      {/* Spin ve Deposit Butonları */}
      {isSpinEnabled || loading ? (
        <Button
          onClick={handleSpinClick}
          disabled={loading}
          sx={{
            backgroundColor: loading ? '#9E9E9E' : '#4CAF50', // Yüklenme sırasında gri renk
            color: 'white',
            width: '125%',
            mt: 2,
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
            width: '125%',
            padding: '10px 20px',
            cursor: 'pointer',
          }}
        >
          Deposit
        </Button>
      )}
    </div>
  );
};

export default SpinAndDepositButtons;
