import React, { FC, useRef, useState, useEffect } from 'react';
import SlotCounter from 'react-slot-counter';
import { Button } from '../button/Button';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Drawer,
  Snackbar,
  IconButton,
} from '@mui/material';
import { styles } from './styles';
import { generateRandomNumber } from './utils/random';
import spinSound from '../../assets/spin.mp3';
import winSound from '../../assets/win.mp3';
import CloseIcon from '@mui/icons-material/Close';

export const SlotMachine: FC = () => {
  const [numbers, setNumbers] = useState<string>('000000');
  const [total, setTotal] = useState<number>(500); // Başlangıç total
  const [tickets, setTickets] = useState<number>(5); // Başlangıç ticket
  const [selectedSpinType, setSelectedSpinType] = useState<string>('total'); // Spin tipi
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [winAmount, setWinAmount] = useState<string>('');
  const counterRefs = Array(6)
    .fill(null)
    .map(() => useRef<any>(null));

  const spinAudio = useRef(new Audio(spinSound));
  const winAudio = useRef(new Audio(winSound));

  const handleSpinTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedSpinType(event.target.value);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);

  const generateFirstDigit = () => {
    return selectedSpinType === 'ticket' ? generateRandomNumber(0, 1) : 0;
  };

  const handleSpin = () => {
    if (selectedSpinType === 'ticket' && tickets === 0) return; // Yetersiz ticket
    if (selectedSpinType === 'total' && total < 250) return; // Yetersiz total
  
    spinAudio.current.play();
  
    const newNumber = [
      generateFirstDigit(),
      generateRandomNumber(0, 0),
      generateRandomNumber(0, 1),
      generateRandomNumber(0, 1),
      generateRandomNumber(0, 7),
      generateRandomNumber(0, 9),

    ];
  
    const combinedNumber = newNumber.join(''); // Sayıları düz bir şekilde birleştir
    setNumbers(combinedNumber); // Nokta veya virgül eklenmeden ayarlandı
  
    if (selectedSpinType === 'ticket') {
      setTickets((prev) => prev - 1);
    } else {
      setTotal((prev) => prev - 250);
    }
  
    setTotal((prev) => prev + parseInt(combinedNumber, 10)); // Total'e düz değer ekleniyor
  
    if (parseInt(combinedNumber, 10) > 100) {
      winAudio.current.play();
      setWinAmount(combinedNumber); // Nokta veya virgül eklenmeden
      setOpenDialog(true);
    }
  
    counterRefs.forEach((ref, index) => {
      setTimeout(() => {
        ref.current?.startAnimation({
          duration: 1,
          dummyCharacterCount: 50,
          direction: 'top-down',
          value: newNumber[index],
        });
      }, index * 100);
    });
  };

  const handleDialogClose = () => setOpenDialog(false);

  // Debug logları
  useEffect(() => {
    console.log('Selected Spin Type:', selectedSpinType);
    console.log('Total:', total);
    console.log('Tickets:', tickets);
  }, [selectedSpinType, total, tickets]);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Slot Machine</h1>
      <div style={styles.slotsContainer}>
        {[...numbers].map((char, index) => (
          <div
            key={index}
            style={{
              ...styles.slotRow,
              color: selectedSpinType === 'total' && index === 0 ? 'grey' : 'black',
              borderTop:
                selectedSpinType === 'total' && index === 0
                  ? '2px solid red'
                  : 'none',
            }}
          >
            <SlotCounter
              ref={counterRefs[index]}
              value={char}
              useMonospaceWidth
              charClassName="slot-char"
              containerClassName="slot-container"
            />
          </div>
        ))}
      </div>

      <FormControl>
        <RadioGroup value={selectedSpinType} onChange={handleSpinTypeChange}>
          <FormControlLabel
            value="total"
            control={<Radio />}
            label="Total ile Spin"
            style={{ color: 'black' }}
          />
          <FormControlLabel
            value="ticket"
            control={<Radio />}
            label="Ticket ile Spin"
            style={{ color: 'black' }}
          />
        </RadioGroup>
      </FormControl>
      <Button
        onClick={() => {
          console.log('Button Clicked!');
          if (selectedSpinType === 'total') {
            if (total < 250) {
              console.log('Yetersiz total, Deposit açılıyor.');
              setDrawerOpen(true); // Total yetersizse Deposit Drawer açılır
            } else {
              console.log('Total ile spin yapılıyor.');
              handleSpin(); // Total ile spin yapılır
            }
          } else if (selectedSpinType === 'ticket') {
            if (tickets > 0) {
              console.log('Ticket ile spin yapılıyor.');
              handleSpin(); // Ticket ile spin yapılır
            } else {
              console.log('Yetersiz Ticket.');
            }
          }
        }}
        disabled={false} // Butonu her zaman aktif yap
        style={{
          backgroundColor:
            (selectedSpinType === 'total' && total < 250) ||
            (selectedSpinType === 'ticket' && tickets === 0)
              ? 'grey'
              : 'blue',
          cursor:
            (selectedSpinType === 'total' && total < 250) ||
            (selectedSpinType === 'ticket' && tickets === 0)
              ? 'pointer'
              : 'pointer',
        }}
      >
        {selectedSpinType === 'total' && total < 250
          ? 'Deposit'
          : selectedSpinType === 'ticket' && tickets === 0
          ? 'Yetersiz Ticket'
          : 'Spin!'}
      </Button>

      <Drawer anchor="bottom" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <div style={{ padding: '20px' }}>
          <h2>Deposit Information</h2>
          <p>
            Account Number: 123456789{' '}
            <Button onClick={() => handleCopy('123456789')}>Copy</Button>
          </p>
          <p>
            Deposit Amount: 00.500{' '}
            <Button onClick={() => handleCopy('00.500')}>Copy</Button>
          </p>
        </div>
      </Drawer>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message="Copied to clipboard"
        action={
          <IconButton size="small" onClick={handleSnackbarClose}>
            <CloseIcon />
          </IconButton>
        }
      />
      <div style={styles.totalContainer}>
        <h2>Spin Result:</h2>
        <p>{numbers}</p> {/* Nokta veya virgül eklenmeden düz gösterim */}
        <h2>Total:</h2>
        <p>{total}</p> {/* Nokta veya virgül eklenmeden düz gösterim */}
        <h2>Tickets:</h2>
        <p>{tickets}</p>
      </div>
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Congratulations!</DialogTitle>
        <DialogContent>
          <p>You won: {winAmount}!</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
