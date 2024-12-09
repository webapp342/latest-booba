import React, { FC, useState, useRef } from 'react';
import { styles } from './styles';
import { generateRandomNumber } from './utils/random';
import SlotDisplay from './SlotDisplay';
import BalanceSelector from './BalanceSelector';
import SpinAndDepositButtons from './SpinAndDepositButtons';
import ResultDisplay from './ResultDisplay';
import DepositDrawer from './DepositDrawer';
import SnackbarComponent from './SnackbarComponent';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export const SlotMachine: FC = () => {
  const [numbers, setNumbers] = useState<string>('000000');
  const [total, setTotal] = useState<number>(500);
  const [tickets, setTickets] = useState<number>(5);
  const [bblip, setBblip] = useState<number>(1200);
  const [selectedSpinType, setSelectedSpinType] = useState<string>('total');
  const [selectedBalance, setSelectedBalance] = useState<string>('total');
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [winAmount, setWinAmount] = useState<string>('');  
  const [history, setHistory] = useState<{ spinType: string; balanceType: string; amount: string }[]>([]);

  const counterRefs = Array(6)
    .fill(null)
    .map(() => useRef<any>(null));

  const spinAudio = useRef(new Audio('spin.mp3'));
  const winAudio = useRef(new Audio('win.mp3'));

  const handleSpinTypeChange = (event: React.ChangeEvent<{}>, value: string) => {
    
    setSelectedSpinType(value);
  };
  
  const handleBalanceChange = (event: React.ChangeEvent<{}>, value: string) => {
    setSelectedBalance(value); // Yeni seçimi ayarla
  };
  

  

  const handleSpin = () => {
    if (selectedSpinType === 'ticket' && tickets === 0) return;
    if (selectedSpinType === 'total' && total < 250) return;
    if (selectedSpinType === 'bblip' && bblip < 1000) return;
  
    spinAudio.current.play();
  
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
            return generateRandomNumber(0, 0).toString();
          case 4:
            return generateRandomNumber(0, 0).toString();
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
            return generateRandomNumber(0, 0).toString();
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
            return generateRandomNumber(0, 0).toString();
          case 3:
            return generateRandomNumber(0, 0).toString();
          case 4:
            return generateRandomNumber(0, 0).toString();
          case 5:
            return generateRandomNumber(6, 9).toString();
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
            return generateRandomNumber(0, 0).toString();
          case 3:
            return generateRandomNumber(0, 0).toString();
          case 4:
            return generateRandomNumber(0, 0).toString();
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
            return generateRandomNumber(0, 0).toString();
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
  
    // Bakiyeleri güncelle
    if (selectedSpinType === 'ticket') setTickets((prev) => prev - 1);
    if (selectedSpinType === 'total') setTotal((prev) => prev - 500);
    if (selectedSpinType === 'bblip') setBblip((prev) => prev - 1000);
  
    // Kazançları hesapla ve bakiyeyi güncelle
    const newNumberValue = parseInt(newNumberString, 10);
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
  
    counterRefs.forEach((ref, index) => {
      const isRed =
        (selectedSpinType === 'total' && index === 0) ||
        (selectedSpinType === 'bblip' && index < 2);
  
      setTimeout(() => {
        if (isRed) return; // Kırmızı kutuların animasyonu iptal
        ref.current?.startAnimation({
          duration: 20,
          dummyCharacterCount: 100,
          direction: 'top-down',
          value: newNumberString[index],
        });
      }, index * 0);
    });
  };
  
  

  // Aktif kutulara göre stil belirleme
  const getActiveIndexes = () => {
    const activeIndexes = [];
    if (selectedSpinType === 'ticket') {
      activeIndexes.push(...[0, 1, 2, 3, 4, 5]); // Tüm kutular aktif
    } else if (selectedSpinType === 'total') {
      activeIndexes.push(...[0, 1, 2, 3, 4]); // İlk 5 kutu aktif
    } else if (selectedSpinType === 'bblip') {
      activeIndexes.push(...[0, 1, 2, 3]); // İlk 4 kutu aktif
    }
    return activeIndexes;
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Slot Machine</h1>
      <ResultDisplay total={total} bblip={bblip} tickets={tickets} />

      
      {/* Slot kutularını aktiflik durumuna göre göster */}
      <SlotDisplay
  numbers={numbers}
  counterRefs={counterRefs}
  selectedSpinType={selectedSpinType} // Burada selectedSpinType'ı geçiyoruz
/>

      
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
      
      
      {/* Geçmiş Bölümü */}
      <div style={styles.historyContainer}>
        <h2>Previous Spins</h2>
        {history.length === 0 ? (
          <p>No spins yet.</p>
        ) : (
          <ul style={styles.historyList}>
            {history.map((entry, index) => (
              <li key={index} style={styles.historyItem}>
                <strong>{entry.spinType}</strong> <ArrowForwardIcon /> <strong>{entry.balanceType}</strong> {entry.amount} {entry.balanceType}
              </li>
            ))}
          </ul>
        )}
      </div>

      <DepositDrawer drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} setSnackbarOpen={setSnackbarOpen} />
      <SnackbarComponent snackbarOpen={snackbarOpen} setSnackbarOpen={setSnackbarOpen} />
    </div>
  );
};
