import React, { FC, useState, useRef } from 'react';
import { generateRandomNumber } from './utils/random';
import SlotDisplay from './SlotDisplay';
import BalanceSelector from './BalanceSelector';
import SpinAndDepositButtons from './SpinAndDepositButtons';
import ResultDisplay from './ResultDisplay';
import DepositDrawer from './DepositDrawer';
import InfoIcon from '@mui/icons-material/Info';
import SnackbarComponent from './SnackbarComponent';
import HistoryDisplay from './HistoryDisplay'; // Yeni bileşeni import ettik
import { Box, Button, IconButton, Modal, Typography } from '@mui/material';
import { createTheme, ThemeProvider } from "@mui/material/styles";


const theme = createTheme({
  typography: {
    fontFamily: "Montserrat, sans-serif",
  },

});


export const SlotMachine: FC = () => {
  const [numbers, setNumbers] = useState<string>('000000');
  const [total, setTotal] = useState<number>(600);
  const [tickets, setTickets] = useState<number>(5);
  const [bblip, setBblip] = useState<number>(10000);
  const [selectedSpinType, setSelectedSpinType] = useState<string>('total');
  const [selectedBalance, setSelectedBalance] = useState<string>('total');
  const [, setOpenDialog] = useState<boolean>(false);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [, setWinAmount] = useState<string>('');  
  const [isModalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);
  const [history, setHistory] = useState<{ spinType: string; balanceType: string; amount: string }[]>([]);

  const counterRefs = Array(6)
    .fill(null)
    .map(() => useRef<any>(null));

  const spinAudio = useRef(new Audio('spin.mp3'));
  const winAudio = useRef(new Audio('win.mp3'));

  const handleSpinTypeChange = (_event: React.ChangeEvent<{}>, value: string) => {
    
    setSelectedSpinType(value);
  };
  
  const handleBalanceChange = (_event: React.ChangeEvent<{}>, value: string) => {
    setSelectedBalance(value); // Yeni seçimi ayarla
  };
  

  

  const handleSpin = () => {
    if (selectedSpinType === 'ticket' && tickets === 0) return;
    if (selectedSpinType === 'total' && total < 200) return;
    if (selectedSpinType === 'bblip' && bblip < 1000) return;
  
    spinAudio.current.play();

    if (selectedSpinType === 'ticket') setTickets((prev) => prev - 1);
    if (selectedSpinType === 'total') setTotal((prev) => prev - 200);
    if (selectedSpinType === 'bblip') setBblip((prev) => prev - 1000);
  
    const newNumbers: string[] = [...Array(6)].map((_, index) => {
      // Kombinasyona göre sayı aralıkları
      if (selectedBalance === 'total' && selectedSpinType === 'total') {
        switch (index) {
          case 0:
            return '0'; // Kırmızı kutu
          case 1:
            return generateRandomNumber(0, 0).toString();
          case 2:
            return generateRandomNumber(0, 0).toString();
          case 3:
            return generateRandomNumber(1, 1).toString();
          case 4:
            return generateRandomNumber(0, 6).toString();
          case 5:
            return generateRandomNumber(0, 9).toString();
          default:
            return generateRandomNumber(0, 9).toString();
        }
      }
  
      if (selectedBalance === 'total' && selectedSpinType === 'bblip') {
        switch (index) {
          case 0:
            return '0'; // Kırmızı kutu
          case 1:
            return '0'; // Kırmızı kutu
          case 2:
            return generateRandomNumber(0, 0).toString();
          case 3:
            return generateRandomNumber(0, 0).toString();
          case 4:
            return generateRandomNumber(0, 2).toString();
          case 5:
            return generateRandomNumber(7, 9).toString();
          default:
            return generateRandomNumber(0, 9).toString();
        }
      }
  
      if (selectedBalance === 'total' && selectedSpinType === 'ticket') {
        switch (index) {
          case 0:
            return generateRandomNumber(0, 0).toString();
          case 1:
            return generateRandomNumber(0, 0).toString();
          case 2:
            return generateRandomNumber(1, 1).toString();
          case 3:
            return generateRandomNumber(5, 9).toString();
          case 4:
            return generateRandomNumber(6, 9).toString();
          case 5:
            return generateRandomNumber(0, 9).toString();
          default:
            return generateRandomNumber(0, 9).toString();
        }
      }
  
      if (selectedBalance === 'bblip' && selectedSpinType === 'total') {
        switch (index) {
          case 0:
            return '0'; // Kırmızı kutular

          case 1:
            return generateRandomNumber(0, 0).toString();
          case 2:
            return generateRandomNumber(0, 1).toString();
          case 3:
            return generateRandomNumber(0, 1).toString();
          case 4:
            return generateRandomNumber(0, 9).toString();
          case 5:
            return generateRandomNumber(6, 9).toString();
          default:
            return generateRandomNumber(0, 9).toString();
        }
      }
  
      if (selectedBalance === 'bblip' && selectedSpinType === 'bblip') {
        switch (index) {
          case 0:
          case 1:
            return '0'; // Kırmızı kutular
          case 2:
            return generateRandomNumber(0, 0).toString();
          case 3:
            return generateRandomNumber(0, 0).toString();
          case 4:
            return generateRandomNumber(0, 1).toString();
          case 5:
            return generateRandomNumber(7, 9).toString();
          default:
            return generateRandomNumber(0, 9).toString();
        }
      }
  
      if (selectedBalance === 'bblip' && selectedSpinType === 'ticket') {
        switch (index) {
          case 0:
            return generateRandomNumber(0, 0).toString();

          case 1:
            return generateRandomNumber(0, 0).toString();
          case 2:
            return generateRandomNumber(0, 0).toString();
          case 3:
            return generateRandomNumber(0, 0).toString();
          case 4:
            return generateRandomNumber(0, 0).toString();
          case 5:
            return generateRandomNumber(7, 9).toString();
          default:
            return generateRandomNumber(0, 9).toString();
        }
      }
  
      // Varsayılan durumda 0-9 aralığı
      return generateRandomNumber(0, 9).toString();
    });
  
    const newNumberString = newNumbers.join('');
  setNumbers(newNumberString);

  counterRefs.forEach((ref, index) => {
    const isRed =
      (selectedSpinType === 'total' && index === 0) ||
      (selectedSpinType === 'bblip' && index < 2);

    setTimeout(() => {
      if (isRed) return; // Kırmızı kutuların animasyonu iptal
      ref.current?.startAnimation({
        duration: 2,
        dummyCharacterCount: 800,
        direction: 'top-down',
        value: newNumberString[index],
      });
    }, index * 100);
  });

  // Animasyon bitişi sonrası işlemler
  setTimeout(() => {
    const newNumberValue = parseInt(newNumberString, 10);

    // Kazançları hesapla ve bakiyeyi güncelle
    if (selectedBalance === 'total') setTotal((prev) => prev + newNumberValue);
    if (selectedBalance === 'bblip') setBblip((prev) => prev + newNumberValue);

    if (newNumberValue > 0) {
      winAudio.current.play();
      setWinAmount(newNumberString);
      setOpenDialog(true);

      // Kazançları geçmişe ekleme
      setHistory((prevHistory) => [
        ...prevHistory,
        {
          spinType: selectedSpinType.toUpperCase(),
          balanceType: selectedBalance.toUpperCase(),
          amount: newNumberString,
        },
      ]);
    }
  }, 2500); // Animasyon süresi kadar bir gecikme (2.5 saniye)
};
  
  

  // Aktif kutulara göre stil belirleme

  return (
    <ThemeProvider theme={theme}>

    <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '10px',
      padding: '1.5rem',
      borderRadius: '16px',
    }}
  >    
 <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: "105%",
          mt: -1,
  
        }}
      >
        {/* Left: Slot Machine Title with Info Icon */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Typography
            variant="h6"
            component="h6"
            sx={{
              m: -1,
              fontSize: { xs: '1.1rem', sm: '2rem', md: '2.5rem' },
              color: '#333',

              fontWeight: 'bold',
            }}
          >
            Lottery
          </Typography>
          <IconButton
            onClick={handleOpenModal}
            sx={{
              ml: 1,
              color: '#333',
            }}
            aria-label="information"
          >
            <InfoIcon />
          </IconButton>
        </Box>

        {/* Right: Jackpot Info */}
        <Box
  sx={{
    backgroundImage: 'linear-gradient(90deg, #28a745, #dc3545)', // Yeşil ve kırmızı gradient
    color: '#fff',
    m : -1,
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    fontSize: { xs: '0.8rem', sm: '1rem' },
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundSize: '200% 100%', // Arka plan geçişi için boyut ayarı
    backgroundPosition: 'right bottom', // Başlangıçta arka planın pozisyonu
    animation: 'gradientShift 4s ease-in-out infinite', // Yalnızca arka plan animasyonu
    '@keyframes gradientShift': {
      '0%': { backgroundPosition: 'right bottom' },
      '50%': { backgroundPosition: 'left bottom' },
      '100%': { backgroundPosition: 'right bottom' },
    },
  }}
>
  Current Jackpot: 999 TON
</Box>


      </Box>
      <ResultDisplay total={total} bblip={bblip} tickets={tickets} />

      <SlotDisplay numbers={numbers} counterRefs={counterRefs} selectedSpinType={selectedSpinType} />
      
      <BalanceSelector selectedBalance={selectedBalance} onChange={handleBalanceChange} />
      <SpinAndDepositButtons
        total={total}
        tickets={tickets}
        bblip={bblip}
        selectedSpinType={selectedSpinType}
        handleSpin={handleSpin}
        openDepositDrawer={() => setDrawerOpen(true)}
        handleSpinTypeChange={handleSpinTypeChange}
      />
      
      {/* HistoryDisplay bileşenini ekledik */}
      <HistoryDisplay history={history} />

      
      {/* Modal */}
      <Modal open={isModalOpen} onClose={handleCloseModal} aria-labelledby="info-modal" aria-describedby="info-description">
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            color: "black",
            transform: 'translate(-50%, -50%)',
            width: { xs: 300, sm: 400 },
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 3,
            borderRadius: '8px',
          }}
        >
          <Typography id="info-modal" variant="h6" component="h2" sx={{ mb: 2 }}>
            How to Play Slot Machine
          </Typography>
          <Typography id="info-description" variant="body1" sx={{ mb: 3 }}>
            Select your preferred spin type, adjust your bet, and press spin to start the reels. Match symbols to win prizes and aim for the jackpot!
          </Typography>
          <Button variant="contained" onClick={handleCloseModal} fullWidth>
            Understand
          </Button>
        </Box>
      </Modal>

      <DepositDrawer drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} setSnackbarOpen={setSnackbarOpen} />
      <SnackbarComponent snackbarOpen={snackbarOpen} setSnackbarOpen={setSnackbarOpen} />
    </Box>
        </ThemeProvider>

  );
};
