import React, { FC, useState, useRef, useEffect } from 'react';
import { generateRandomNumber } from './utils/random';
import SlotDisplay from './SlotDisplay';
import BalanceSelector from './BalanceSelector';
import SpinAndDepositButtons from './SpinAndDepositButtons';
import DepositDrawer from './DepositDrawer';
import { keyframes } from "@emotion/react";
import InfoIcon from "@mui/icons-material/Info";
import StarIcon from '@mui/icons-material/Star';
import backgroundImage from '../../assets/bg.png'; // PNG dosyasını import edin
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import SnackbarComponent from './SnackbarComponent';
import {IconButton, Box, Button,  Modal, Typography, List, ListItem, ListItemText, } from '@mui/material';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { motion } from "framer-motion";
import { doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import WebApp from '@twa-dev/sdk'; // Telegram WebApp SDK

import { useWindowSize } from 'react-use';
import { useNavigate } from 'react-router-dom';



const theme = createTheme({
  typography: {
    fontFamily: "monospace",
  },

});


export const SlotMachine: FC = () => {
  const [numbers, setNumbers] = useState<string>('999999');
  const [total, setTotal] = useState<number>(0); // Default value
  const [tickets, setTickets] = useState<number>(5); // Default value
  const [bblip, setBblip] = useState<number>(10000); // Default value
  const [telegramUserId, setTelegramUserId] = useState<string | null>(null);

  const [selectedSpinType, setSelectedSpinType] = useState<string>('total');
  const [selectedBalance, setSelectedBalance] = useState<string>('total');
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [winAmount, setWinAmount] = useState<string>('');  // To store the win amount
  const [winModalOpen, setWinModalOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [openWinningToken, setOpenWinningToken] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleOpenWinningToken = () => setOpenWinningToken(true);
  const handleCloseWinningToken = () => setOpenWinningToken(false);

  const [, setHistory] = useState<{ spinType: string; balanceType: string; amount: string }[]>([]);
  
const navigate = useNavigate();


  useEffect(() => {
      const backButton = WebApp.BackButton;
  
      // BackButton'u görünür yap ve tıklanma işlevi ekle
      backButton.show();
      backButton.onClick(() => {
        navigate("/latest-booba/top");
      });
  
      // Cleanup: Bileşen unmount olduğunda butonu gizle ve event handler'ı kaldır
      return () => {
        backButton.hide();
        backButton.offClick(() => {
          navigate("/latest-booba/top"); // Buraya tekrar aynı callback sağlanmalıdır.
        });
      };
    }, [navigate]);



  const counterRefs = Array(6)
    .fill(null)
    .map(() => useRef<any>(null));

 
    useEffect(() => {
      const initTelegramUserId = () => {
        const user = WebApp.initDataUnsafe?.user;
        if (user?.id) {
          setTelegramUserId(user.id.toString());
          console.log(`Telegram User ID initialized: ${user.id}`);
        } else {
          console.error('Telegram User ID not found.');
        }
      };
      initTelegramUserId();
    }, []);
  
    useEffect(() => {
      if (telegramUserId) {
        const userRef = doc(db, 'users', telegramUserId);
  
        const unsubscribe = onSnapshot(userRef, async (docSnapshot) => {
          console.log(`Listening to Firestore document: ${telegramUserId}`);
  
          if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            console.log('Fetched Firestore data:', data);
  
            setTotal(data.total || 0);
            setBblip(data.bblip || 0);
            setTickets(data.tickets || 0);
          } else {
            console.warn(`Document does not exist for ID: ${telegramUserId}`);
            try {
              await setDoc(userRef, {
                total: 600,
                bblip: 10000,
                tickets: 5,
              });
              console.log('Default Firestore document created:', {
                total: 600,
                bblip: 10000,
                tickets: 5,
              });
            } catch (error) {
              console.error('Error creating Firestore document:', error);
            }
          }
        });
  
        return () => {
          console.log(`Unsubscribed from Firestore listener for ID: ${telegramUserId}`);
          unsubscribe();
        };
      }
    }, [telegramUserId]);
  
    const updateFirestoreBalance = async (field: 'total' | 'bblip' | 'tickets', value: number) => {
      if (!telegramUserId) {
        console.error('Telegram User ID is not available for Firestore update.');
        return;
      }
  
      console.log(`Updating Firestore field: ${field} with value: ${value} for user: ${telegramUserId}`);
    
      const userRef = doc(db, 'users', telegramUserId);
      try {
        await updateDoc(userRef, { [field]: value });
        console.log(`Firestore update successful: ${field} = ${value}`);
      } catch (error) {
        console.error(`Error updating Firestore field: ${field}`, error);
      }
    };
    

    



  const handleSpinTypeChange = (_event: React.ChangeEvent<{}>, value: string) => {
    
    setSelectedSpinType(value);
  };
  
  const handleBalanceChange = (_event: React.ChangeEvent<{}>, value: string) => {
    setSelectedBalance(value); // Yeni seçimi ayarla
  };
  

  

  const handleSpin = async () => {
    if (selectedSpinType === 'ticket' && tickets === 0) {
      console.warn('Spin failed: Not enough tickets.');
      return;
    }
    if (selectedSpinType === 'total' && total < 200) {
      console.warn('Spin failed: Not enough total balance.');
      return;
    }
    if (selectedSpinType === 'bblip' && bblip < 1000) {
      console.warn('Spin failed: Not enough BBLIP balance.');
      return;
    }

    console.log(`Spin initiated with type: ${selectedSpinType}`);

    try {
     
      console.log('Spin sound played.');
    } catch (error) {
      console.error('Audio play error:', error);
    }

    if (selectedSpinType === 'ticket') {
      setTickets((prev) => {
        const newTickets = prev - 1;
        console.log(`Tickets decreased: ${prev} -> ${newTickets}`);
        updateFirestoreBalance('tickets', newTickets);
        return newTickets;
      });
    } else if (selectedSpinType === 'total') {
      setTotal((prev) => {
        const newTotal = prev - 200;
        console.log(`Total decreased: ${prev} -> ${newTotal}`);
        updateFirestoreBalance('total', newTotal);
        return newTotal;
      });
    } else if (selectedSpinType === 'bblip') {
      setBblip((prev) => {
        const newBblip = prev - 5000;
        console.log(`BBLIP decreased: ${prev} -> ${newBblip}`);
        updateFirestoreBalance('bblip', newBblip);
        return newBblip;
      });
    }

    
  
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
            return generateRandomNumber(0, 1).toString();
          case 4:
            return generateRandomNumber(7, 9).toString();
          case 5:
            return generateRandomNumber(4, 9).toString();
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
            return generateRandomNumber(0, 9).toString();
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
            return generateRandomNumber(1, 6).toString();
          case 3:
            return generateRandomNumber(8, 9).toString();
          case 4:
            return generateRandomNumber(8, 9).toString();
          case 5:
            return generateRandomNumber(7, 9).toString();
          default:
            return generateRandomNumber(0, 9).toString();
        }
      }
  
      if (selectedBalance === 'bblip' && selectedSpinType === 'ticket') {
        switch (index) {
          case 0:
            return generateRandomNumber(0, 3).toString();
  
          case 1:
            return generateRandomNumber(0, 4).toString();
          case 2:
            return generateRandomNumber(0, 7).toString();
          case 3:
            return generateRandomNumber(0, 7).toString();
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

    console.log(`Generated spin result: ${newNumberString}`);
  
    counterRefs.forEach((ref, index) => {
      const isRed =
        (selectedSpinType === 'total' && index === 0) ||
        (selectedSpinType === 'bblip' && index < 2);
  
      setTimeout(() => {
        if (isRed) return; // Skip animation for red boxes
        ref.current?.startAnimation({
          duration: 2,
          dummyCharacterCount: 800,
          direction: 'top-down',
          value: newNumberString[index],
        });
      }, index * 100);
    });
  
     // Spin sonucuna göre kazanç hesapla
  
     setTimeout(() => {
      const newNumberValue = parseInt(newNumberString, 10);
      console.log(`Spin result parsed: ${newNumberValue}`);

      if (selectedBalance === 'total') {
        setTotal((prev) => {
          const updatedTotal = prev + newNumberValue;
          console.log(`Total increased: ${prev} -> ${updatedTotal}`);
          updateFirestoreBalance('total', updatedTotal);
          return updatedTotal;
        });
      } else if (selectedBalance === 'bblip') {
        setBblip((prev) => {
          const updatedBblip = prev + newNumberValue;
          console.log(`BBLIP increased: ${prev} -> ${updatedBblip}`);
          updateFirestoreBalance('bblip', updatedBblip);
          return updatedBblip;
        });
      }

      if (newNumberValue > 0) {
     
        console.log('Win sound played.');
        setWinAmount(newNumberString);
        setWinModalOpen(true);
        console.log(`Win modal opened with amount: ${newNumberString}`);
        // Add history entry
        setHistory((prevHistory) => [
          ...prevHistory,
          {
            spinType: selectedSpinType.toUpperCase(),
            balanceType: selectedBalance.toUpperCase(),
            amount: newNumberString,
          },
        ]);
      }
    }, 2500); // Wait for animation to finish before showing win modal
  };


  // Animasyon keyframe tanımı
const bounceAnimation = keyframes`
0%, 100% {
  transform: translateY(0);
}
50% {
  transform: translateY(10px);
}
`;

const [animatedValue, setAnimatedValue] = useState(0);
const [, setShowConfetti] = useState(false);
  useWindowSize(); // Pencere boyutlarını almak için

  useEffect(() => {
    const targetValue = Number(winAmount);
    const duration = 2500; // 2 saniye
    const steps = 60; // Animasyon karesi
    const increment = targetValue / steps;

    let currentValue = 0;
    setShowConfetti(true); // Konfeti animasyonu başlasın
    const interval = setInterval(() => {
      currentValue += increment;
      if (currentValue >= targetValue) {
        currentValue = targetValue; // Hedef değeri aşmamak için sınırla
        clearInterval(interval);
        setTimeout(() => setShowConfetti(false), 2500); // Konfetiyi 3 saniye sonra durdur
      }
      setAnimatedValue(Math.floor(currentValue));
    }, duration / steps);

    return () => clearInterval(interval); // Cleanup
  }, [winAmount]);

  // Formatlama fonksiyonu
  const formatWinAmount = (amount: number): string => {
    const numString = String(amount).padStart(4, '0');
    return numString.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };


  

  // Aktif kutulara göre stil belirleme

  return (
    <ThemeProvider theme={theme}>
      

    <Box
    sx={{
      mt:-2,
      backgroundColor: "#1E1E1E",
      backgroundmage: 'radial-gradient( circle 780px at 37.8% 100.3%,  rgba(19,55,115,1) 2.2%, rgba(32,7,80,1) 20.2%, rgba(27,88,111,1) 58.6%, rgba(115,88,44,1) 75%, rgba(99,19,90,1) 89.6%, rgba(12,51,76,1) 96.1% )',      color: "white",
      textAlign: "center",
      backgroundImage: `url(${backgroundImage})`, // PNG yolu
        backgroundSize: "cover", // Görüntüyü tam kapla
        backgroundRepeat: "no-repeat", // Tekrar etmesin
        backgroundPosition: "center", // Ortala
        width: "100vw", // Tam genişlik
       
      position: "relative",
      overflow: "hidden",
      minHeight: "100vh",

    }}
  >    


  <Box sx={{       border: "0px dotted #FFC107",
}}>

  

             {/* Win Modal */}

           

       {/* Jackpot Section */}

  

          {/* Jackpot Section */}
          <Box
          sx={{
           mt:"14vh",
           width:"95%",
            mx:1,
            borderRadius: 1,
          }}
        >
          <Typography fontWeight={'bold'} fontSize={'1.5rem'} >
            999x CRASH
          </Typography>
        
          <SlotDisplay  numbers={numbers} counterRefs={counterRefs} selectedSpinType={selectedSpinType} />

        </Box>

     

      <Button
        style={{
          background: "#f7cf6d",
          borderRadius: 12,
          padding:10,
          marginTop: -13,
          
          color: "black",
          textTransform: "none",
          fontWeight: "bold",
          position: "relative",
        }}
      >
        Pick Your Winning Token
        <IconButton
          sx={{
            position: "absolute",
            right: -40, // Adjust this value for proper positioning
            top: "50%",
            transform: "translateY(-50%)",
            color: "#f7cf6d",
          }}
          onClick={handleOpenWinningToken}
        >
          <InfoIcon />
        </IconButton>
      </Button>

        <Box>
               {/* Aşağı yönlendirme ikonu */}
      <ArrowDownwardIcon
        sx={{
          color: "#ffd700",
          fontSize: "1rem",
          animation: `${bounceAnimation} 1.5s infinite`,
        }}
      />



        </Box>

          {/* Modal for Pick Your Winning Token */}
          <Modal open={openWinningToken} onClose={handleCloseWinningToken}>
          <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: { xs: 2, sm: 4 },
          width: { xs: '80%', sm: '80%', md: '60%' },
          maxWidth: '600px',
          borderRadius: 2,
          maxHeight: '80vh',
          overflowY: 'auto',
        }}
      >
        <Typography variant="body2" gutterBottom sx={{color:'black', textAlign:'center', fontSize: '1rem'}}>
          How to pick your winning token
        </Typography>
        <List sx={{color: 'black' }}>
          <ListItem>
            <ListItemText
              primary={
                <Typography variant="body2" sx={{ display: 'inline', fontWeight: 'bold' }}>
                  Choose Your Preferred Token:
                </Typography>
              }
              secondary={ 
                <>
                  <ul>
                    <li>You have two options to select from: <strong>BBLIP</strong> or <strong>TON</strong>.</li>
                    <li>This choice determines the type of reward you will receive after each spin.</li>
                  </ul>
                </>
              }
              sx={{
                textAlign: 'left', // Sola hizala
                ml:-2
              }}
            />
          </ListItem>

          <ListItem>
            <ListItemText
              primary={
                <Typography variant="body2" sx={{ display: 'inline', fontWeight: 'bold' }}>
                  Winning with BBLIP:
                </Typography>
              }
              secondary={
                <>
                  <ul>
                    <li>If you select <strong>BBLIP</strong>, every spin will reward you with BBLIP tokens.</li>
                    <li>These tokens can be used to enhance your gaming experience or saved for future benefits.</li>
                  </ul>
                </>
              }
              sx={{
                textAlign: 'left', // Sola hizala
                ml:-2
              }}  
            />
          </ListItem>

          <ListItem>
            <ListItemText
              primary={
                <Typography variant="body2" sx={{ display: 'inline', fontWeight: 'bold' }}>
                  Winning with TON:
                </Typography>
              }
              secondary={
                <>
                  <ul>
                    <li>By selecting <strong>TON</strong>, your spins will yield TON coins as rewards.</li>
                    <li>TON coins offer unique advantages and can be utilized in various aspects of the ecosystem.</li>
                  </ul>
                </>
              }
              sx={{
                textAlign: 'left', // Sola hizala
                ml:-2
              }}  
            />
          </ListItem>

          <ListItem>
            <ListItemText
              primary={
                <Typography variant="body2" sx={{ display: 'inline', fontWeight: 'bold' }}>
                  Key Things to Remember:
                </Typography>
              }
              secondary={
                <>
                  <ul>
                    <li>The token you choose directly influences the type of prize you will earn.</li>
                    <li>This decision is made before each spin, so select wisely based on your current goals.</li>
                    <li>Switching between tokens is seamless, allowing you to adapt your strategy at any time.</li>
                  </ul>
                </>
              }
              sx={{
                textAlign: 'left', // Sola hizala
                ml:-2
              }}  
            />
          </ListItem>

          <ListItem>
            <ListItemText
              primary={
                <Typography variant="body2" sx={{ display: 'inline', fontWeight: 'bold' }}>
                  Plan Your Strategy:
                </Typography>
              }
              secondary={
                <>
                  <ul>
                    <li>For those who prefer a steady accumulation of BBLIP, selecting BBLIP ensures consistent token rewards.</li>
                    <li>If you're looking for potential advantages with TON, choosing TON aligns your rewards with your goals.</li>
                  </ul>
                </>
              }
              sx={{
                textAlign: 'left', // Sola hizala
                ml:-2
              }}  
            />
          </ListItem>
        </List>
        
        <Button
          variant="contained"
          sx={{
            mt: 3,
            width: '100%',
            background: '#f7cf6d',
            color: 'black',
            textTransform: 'none',
            fontWeight: 'bold',
          }}
          onClick={handleCloseWinningToken}
        >
          Understand
        </Button>
      </Box>
    </Modal>
        <Box
          sx={{
            py: 0,
            mx: 4,
            borderRadius: 1,

          }}
        >
           <BalanceSelector selectedBalance={selectedBalance} onChange={handleBalanceChange} />

        </Box>

          {/* Buttons */}
           {/* Buttons */}
           <Button
        style={{
          background: "#f7cf6d",
          borderRadius: 12,
          padding:10,
          marginTop: -10,
          
          color: "black",
          textTransform: "none",
          fontWeight: "bold",
          position: "relative",
        }}
      >
        Pick Your Spin Power
        <IconButton
          sx={{
            position: "absolute",
            right: -40, // Adjust this value for proper positioning
            top: "50%",
            transform: "translateY(-50%)",
            color: "#f7cf6d",
          }}
          onClick={handleOpen}
        >
          <InfoIcon />
        </IconButton>
      </Button>

      {/* Modal */}
      <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: { xs: 2, sm: 4 },
          width: { xs: '80%', sm: '80%', md: '60%' },
          maxWidth: '600px',
          borderRadius: 2,
          maxHeight: '80vh',
          overflowY: 'auto',
        }}
      >
        <Typography variant="body2" gutterBottom sx={{color:'black', textAlign:'center', fontSize: '1rem'}}>
        Pick Your Power !
        </Typography>

        <List sx={{color:'black'}}>
          <ListItem>
            <ListItemText
              primary={<strong>Choose Your Spin Type:</strong>}
              secondary={
                <>
                  <ul>
                    <li>
                      You can spin with three options: <strong>Ticket</strong>, <strong>TON</strong>, or <strong>BBLIP</strong>.
                    </li>
                    <li>Each option provides different rewards and maximum prize values based on your choice.</li>
                  </ul>
                </>
              }
              sx={{
                textAlign: 'left', // Sola hizala
                ml:-2
              }}            />
          </ListItem>

          <ListItem>
            <ListItemText
              primary={<strong>Ticket Spin:</strong>}
              secondary={
                <>
                  <ul>
                    <li>If you select <strong>Ticket</strong>, you can spin for the maximum prize of <strong>999.999</strong>.</li>
                    <li>For this, you must own at least <strong>1 Ticket</strong> to participate.</li>
                    <li>Your prize depends on your luck and can be any amount up to the max value.</li>
                  </ul>
                </>
              }
              sx={{
                textAlign: 'left', // Sola hizala
                ml:-2
              }}              />
          </ListItem>

          <ListItem>
            <ListItemText
              primary={<strong>TON Spin:</strong>}
              secondary={
                <>
                  <ul>
                    <li>If you choose <strong>TON</strong>, your spin will yield a reward of up to <strong>99.999</strong> TON.</li>
                    <li>You must own at least <strong>0.2 TON</strong> to participate in a TON spin.</li>
                    <li>This gives you a higher reward potential compared to other spin types.</li>
                  </ul>
                </>
              }
              sx={{
                textAlign: 'left', // Sola hizala
                ml:-2
              }}              />
          </ListItem>

          <ListItem>
            <ListItemText
              primary={<strong>BBLIP Spin:</strong>}
              secondary={
                <>
                  <ul>
                    <li>With a <strong>BBLIP</strong> spin, your maximum prize is <strong>9.999</strong> BBLIP.</li>
                    <li>You must own at least <strong>1 BBLIP</strong> to participate in a BBLIP spin.</li>
                    <li>This option provides a smaller, more consistent reward compared to others.</li>
                  </ul>
                </>
              }
              sx={{
                textAlign: 'left', // Sola hizala
                ml:-2
              }}              />
          </ListItem>

          <ListItem>
            <ListItemText
              primary={<strong>Important Things to Remember:</strong>}
              secondary={
                <>
                  <ul>
                    <li>Your chosen spin type determines the maximum prize value and the reward type.</li>
                    <li>Each option is based on a random chance, so choose wisely depending on your current goals.</li>
                    <li>You can easily switch between spin types at any time for a different experience.</li>
                    <li>Make sure you have the required tokens to participate in your chosen spin.</li>
                  </ul>
                </>
              }
              sx={{
                textAlign: 'left', // Sola hizala
                ml:-2
              }}              />
          </ListItem>
        </List>

        <Button
          variant="contained"
          sx={{
            mt: 3,
            width: '100%',
            background: '#f7cf6d',
            color: 'black',
            textTransform: 'none',
            fontWeight: 'bold',
          }}
          onClick={handleClose}
        >
          Understand
        </Button>
      </Box>
      </Modal>

        <Box>
               {/* Aşağı yönlendirme ikonu */}
      <ArrowDownwardIcon
        sx={{
          color: "#ffd700",
          fontSize: "1rem",
          animation: `${bounceAnimation} 1.5s infinite`,
        }}
      />

        </Box>


        <Box
          sx={{
            padding: 0,
            mx: 4,
            borderRadius: 1,


          }}
        >
         <SpinAndDepositButtons
        total={total}
        tickets={tickets}
        bblip={bblip}
        selectedSpinType={selectedSpinType}
        handleSpin={handleSpin}
        openDepositDrawer={() => setDrawerOpen(true)}
        handleSpinTypeChange={handleSpinTypeChange}
      />
        </Box>


        <Box
      sx={{
        width: '90%',
        margin: '0 auto',
      
        textAlign: 'center',
        padding: '16px',
        borderRadius: '8px',
      }}
    >
      {/* "WIN UP TO" text */}
      <Typography
        variant="h6"
        sx={{
          color:'#FFC107',             
          fontSize: '16px',
        }}
      >
        WIN UP TO
      </Typography>

      {/* Stars and Text */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Left Stars */}
        {[20, 25, 30].map((size, index) => (
          <StarIcon
            key={`left-star-${index}`}
            sx={{
              fontSize: size,
              color:'#FFC107',             
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              margin: '0 4px',
            }}
          />
        ))}

        {/* Center Text */}
        <Typography
          variant="h6"
          sx={{
            fontSize: '20px',
            color: '#fff',
            margin: '0 12px',
          }}
        >
          999 TON
        </Typography>

        {/* Right Stars */}
        {[30, 25, 20].map((size, index) => (
          <StarIcon
            key={`right-star-${index}`}
            sx={{
              fontSize: size,
color:'#FFC107',             
 WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              margin: '0 4px',
            }}
          />
        ))}
      </Box>
    </Box>


        <Box
          sx={{
            background: "linear-gradient(to bottom, #ffd700, #ffffff)",
            padding: 0,
            mx: 4,
            borderRadius: 1,


          }}
        >
      {/* HistoryDisplay bileşenini ekledik */}

      </Box>

     
      
       
      
    

 <Modal open={winModalOpen} onClose={() => setWinModalOpen(false)} aria-labelledby="win-modal" aria-describedby="win-description">
 <Box
  component={motion.div}
  initial={{ opacity: 0, scale: 0.8 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0, scale: 0.8 }}
  transition={{ duration: 0.4, ease: "easeOut" }}
  sx={{
    mt: "35vh",
    mx: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Şeffaf arka plan
    backdropFilter: "blur(2px)", // Glass efekti
    borderRadius: "10px", // Border radius ekledim
    textAlign: "center",
    p: 3,
      boxShadow: "10px 10px 60px rgba(255, 215, 0, 0.9), inset 5px 5px 15px rgba(255, 215, 0, 0.6)", // Hoverda daha derin gölge efekti
    border: "3px solid linear-gradient(45deg, rgba(255, 215, 0, 0.7), rgba(255, 255, 255, 0.7))", 
      transform: "perspective(1000px) rotateX(5deg) rotateY(5deg) scale(1.05)", // Hoverda biraz büyütme
   
  }}
>
        <Typography
          id="win-description"
          variant="h5"
          sx={{
            color: "#FFD700",
            fontWeight: "bold",
            textShadow: "0px 0px 10px rgba(255, 215, 0, 0.8)", // Parlayan yazı efekti
            mb: 2,
          }}
        >
          YOU WIN
        </Typography>
        <Typography
          variant="h4"
          sx={{
            color: "white",
            fontWeight: "bold",
            textShadow: "0px 0px 5px rgba(255, 255, 255, 0.7)",
          }}
        >
          {formatWinAmount(animatedValue)} {selectedBalance === "total" ? "TON" : "BBLIP"}
        </Typography>
        <Button
          onClick={() => setWinModalOpen(false)}
          variant="contained"
          sx={{
            mt: 3,
            backgroundColor: "#FFD700",
            color: "black",
            fontWeight: "bold",
            fontSize: "1.2rem",
            textTransform: "uppercase",
            boxShadow: "0px 0px 15px rgba(255, 215, 0, 0.8)", // Neon buton efekti
            "&:hover": {
              backgroundColor: "#FFC107",
              boxShadow: "0px 0px 20px rgba(255, 193, 7, 1)",
            },
            width: "100%",
            borderRadius: "12px",
          }}
        >
          Play Again 🚀
        </Button>
      </Box>
    </Modal>


    

      <DepositDrawer drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} setSnackbarOpen={setSnackbarOpen} />
      <SnackbarComponent snackbarOpen={snackbarOpen} setSnackbarOpen={setSnackbarOpen} />
      </Box>
    </Box>
        </ThemeProvider>

  );
};
