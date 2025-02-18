import React, { useState, useEffect } from "react";
import { ThemeProvider, createTheme, Tooltip } from "@mui/material";
import QRCode from 'qrcode';
import { Box, Typography, Button, Avatar,  Snackbar, SnackbarContent } from "@mui/material";
import SwapHorizontalCircleIcon from '@mui/icons-material/SwapHorizontalCircle';import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import OutboundIcon from '@mui/icons-material/Outbound';
import { CheckCircleOutline } from '@mui/icons-material';
import AddCircleIcon from '@mui/icons-material/AddCircle';import { useNavigate } from 'react-router-dom';
import TokenSwap from "./SwapComponent"; // TokenSwap bileşenini eklediğiniz yer
import logo5 from '../assets/booba-logo.png';
import ticket from '../assets/ticket.png';

import SettingsIcon from '@mui/icons-material/Settings';
import { doc, onSnapshot, getFirestore, getDoc } from "firebase/firestore"; 
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './firebaseConfig';
import WebApp from "@twa-dev/sdk";
import UserAvatar from "./UserAvatar";
import styled from "styled-components";
import DepositDrawer from '../components/WalletDrawers/DepositDrawer';
import WithdrawDrawer from '../components/WalletDrawers/WithdrawDrawer';
import HistoryDrawer from '../components/WalletDrawers/HistoryDrawer';
import SwapDrawer from '../components/WalletDrawers/SwapDrawer';
import axios from 'axios';
import tonlogo from '../assets/kucukTON.png';
import UserAgreementModal from '../components/modals/UserAgreementModal';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);





// Tema oluşturma
const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#2f363a',
      paper: 'transparent',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B0BEC5',
    },
  },
  typography: {
    fontFamily: "monospace",
  },
});


interface Asset {
  logo: string;
  symbol: string;
  name: string;
  amount: number;
  view:string;
  usdValue: number;
  price:number;
  active: boolean;
}

// Centralized initial data definition
const initialData: Asset[] = [
  {
    logo: logo5,
    symbol: "BBLIP",
    view:"Booba Blip",
    name: "BBLIP",
    amount: 0,
    usdValue: 0,
    price:0.07,
    active: true
  },
  {
    logo: tonlogo,
    symbol: "TON",
    name: "Ton",
    view:"Booba Blip",
    amount: 0,
    usdValue: 0,
    price:0,
    active: true
  },
  {
    logo: "https://s3-symbol-logo.tradingview.com/crypto/XTVCUSDT--big.svg",
    symbol: "USDT",
    name: "USDT",
    view:"Booba Blip",
    price:1.00, // USDT her zaman 1 USD
    amount: 0,
    usdValue: 0,
    active: true
  },
  {
    logo: ticket,
    symbol: "TICKET",
    name: "Ticket",
        view:"Booba Blip",
    price:0,

    amount: 0,
    usdValue: 0,
    active: true
  },
  {
    logo: "https://s3-symbol-logo.tradingview.com/crypto/XTVCETH--big.svg",
    symbol: "ETH",
    name: "Ethereum",
        view:"Booba Blip",
    price:0,

    amount: 0,
    usdValue: 0,
    active: false
  },
  {
    logo: "https://s3-symbol-logo.tradingview.com/crypto/XTVCBNB--big.svg",
    symbol: "BNB",
    name: "Binance Coin",
        view:"Booba Blip",
    price:0,

    amount: 0,
    usdValue: 0,
    active: false
  },
  {
    logo: "https://s3-symbol-logo.tradingview.com/crypto/XTVCADA--big.svg",
    symbol: "ADA",
    name: "Cardano",
        view:"Booba Blip",
    price:0,

    amount: 0,
    usdValue: 0,
    active: false
  }
];

const AccountEquityCard: React.FC = () => {


  const [searchQuery] = useState("");
  const [] = useState(false); // Arama moduna girildi mi?
  const [showTokenSwap, setShowTokenSwap] = useState(false);
  const [openDepositDrawer, setOpenDepositDrawer] = useState(false);
  const [openWithdrawDrawer, setOpenWithdrawDrawer] = useState(false);
  const [openHistoryDrawer, setOpenHistoryDrawer] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [, setComment] = useState("Loading..."); // Default value for comment
  const [tonPrice, setTonPrice] = useState<number>(0); // Default to 0 instead of null
  const [, setQrCodeUrl] = useState<string>('');
  const [data, setData] = useState<Asset[]>(initialData); // Initialize with initialData
  const [totalEquity, setTotalEquity] = useState<string>("0.00");
   const navigate = useNavigate();

       const [] = useState(false);

  const [] = useState(false);
  const [openSwapDrawer, setOpenSwapDrawer] = useState(false);
  const [showAgreement, setShowAgreement] = useState(false);

useEffect(() => {
      const backButton = WebApp.BackButton;
  
      // BackButton'u görünür yap ve tıklanma işlevi ekle
      backButton.show();
      backButton.onClick(() => {
        navigate("/");
      });
  
      // Cleanup: Bileşen unmount olduğunda butonu gizle ve event handler'ı kaldır
      return () => {
        backButton.hide();
        backButton.offClick(() => {
          navigate("/"); // Buraya tekrar aynı callback sağlanmalıdır.
        });
      };
    }, [navigate]);

  // Drawer'ı açma/kapama işlevi


  

  

  // Calculate the total USD value
  useEffect(() => {
    const totalUsdValue = data.reduce((sum, item) => sum + item.usdValue, 0);
    setTotalEquity(totalUsdValue.toLocaleString(undefined, { 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 
    })); // Format with commas and 2 decimal places
  }, [data]);

  // Combine price fetching and data update in one effect
  useEffect(() => {
    const updatePricesAndCalculateValues = async () => {
      try {
        const response = await axios.get(`https://api.binance.com/api/v3/ticker/price`, {
          params: { symbol: 'TONUSDT' },
        });
        const newTonPrice = parseFloat(response.data.price);
        setTonPrice(newTonPrice);

        const updatedData = data.map(item => {
          let newPrice = item.price;
          let amount = item.amount;
          let usdValue = 0;

          switch(item.symbol) {
            case "TON":
              newPrice = newTonPrice;
              amount = amount / 1000; // Convert to actual amount
              usdValue = amount * newTonPrice;
              break;
            case "TICKET":
              newPrice = newTonPrice * 2.5;
              usdValue = amount * (newTonPrice * 2.5);
              break;
            case "BBLIP":
              amount = amount / 1000; // Convert to actual amount
              usdValue = amount * 0.07;
              break;
            case "USDT":
              newPrice = 1.00;
              usdValue = amount;
              break;
            default:
              usdValue = amount * newPrice;
          }

          return {
            ...item,
            price: newPrice,
            usdValue: usdValue
          };
        });

        setData(updatedData);

        // Calculate total equity
        const newTotalEquity = updatedData.reduce((sum, item) => sum + item.usdValue, 0);
        setTotalEquity(newTotalEquity.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }));

      } catch (error) {
        console.error("Error updating prices:", error);
      }
    };

    // Initial update
    updatePricesAndCalculateValues();

    // Set up interval for updates
    const interval = setInterval(updatePricesAndCalculateValues, 60000);
    return () => clearInterval(interval);
  }, []); // Empty dependency array since we're managing all updates internally

  // Update data when Firestore changes
  useEffect(() => {
    const telegramUserId = localStorage.getItem("telegramUserId");
    if (!telegramUserId) {
      console.error("Telegram User ID not found!");
      return;
    }

    const docRef = doc(db, "users", telegramUserId);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const userData = docSnap.data();
        
        setData(prevData => 
          prevData.map(item => {
            let newAmount = item.amount;
            
            switch(item.symbol) {
              case "BBLIP":
                newAmount = userData.bblip || 0;
                break;
              case "USDT":
                newAmount = userData.usdt || 0;
                break;
              case "TICKET":
                newAmount = userData.tickets || 0;
                break;
              case "TON":
                newAmount = userData.total || 0;
                break;
            }

            const actualAmount = item.symbol === "BBLIP" || item.symbol === "TON" 
              ? newAmount / 1000 
              : newAmount;

            let usdValue = 0;
            switch(item.symbol) {
              case "USDT":
                usdValue = actualAmount;
                break;
              case "BBLIP":
                usdValue = actualAmount * 0.07;
                break;
              case "TON":
                usdValue = actualAmount * tonPrice;
                break;
              case "TICKET":
                usdValue = actualAmount * (tonPrice * 2.5);
                break;
            }

            return {
              ...item,
              amount: newAmount,
              usdValue: usdValue
            };
          })
        );
      }
    });

    return () => unsubscribe();
  }, [tonPrice]); // Add tonPrice as dependency since we use it in calculations

  // Arama filtreleme fonksiyonu
  const filteredData = data.filter(
    (item) =>
      item.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );



   // Handle deposit drawer toggle


   // Snackbar for copy confirmation
   const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
  const generateQRCode = async () => {
    try {
      const telegramUserId = localStorage.getItem("telegramUserId");
      if (!telegramUserId) {
        console.error("Telegram User ID not found!");
        setComment("Error: User ID not found"); // Set error message
        return;
      }

      // Firestore query to fetch the comment
      const docRef = doc(db, "users", telegramUserId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const fetchedComment = docSnap.data().comment || "No comment available";
        setComment(fetchedComment); // Set the fetched comment
        const address = 'UQDppAsjyioMu23LIEaFBm5g5o5oNjRft99oe4gfv-c9BNn2';
        const encodedComment = encodeURIComponent(fetchedComment);
        const uri = `https://app.tonkeeper.com/transfer/${address}?text=${encodedComment}`;

        // Generate QR Code
        const qrCode = await QRCode.toDataURL(uri);
        setQrCodeUrl(qrCode); // Save QR Code URL to state
      } else {
        console.error("User document not found in Firestore!");
        setComment("Error: Document not found"); // Set error message
      }
    } catch (error) {
      console.error("Error generating QR code:", error);
      setComment("Error fetching comment"); // Set error message
    }
  };

  generateQRCode();
}, []);

  const telegramUser = WebApp.initDataUnsafe.user;

  // Helper function to format display amount
  const formatDisplayAmount = (amount: number, symbol: string) => {
    if (symbol === "BBLIP" || symbol === "TON" ) {
      return (amount / 1000).toFixed(2);
    }
    if (symbol === "USDT") {
      return amount.toLocaleString(); // Adds commas for thousands
    }
    return amount;
  };

 

const GradientBox = styled(Box)(() => ({
  background: 'linear-gradient(180deg, rgba(110, 211, 255, 0.08) 0%, rgba(26, 33, 38, 0) 100%)',
  borderRadius: '24px',
  padding: '24px 16px',
  marginBottom: '24px',
  
  border: '1px solid rgba(110, 211, 255, 0.1)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
}));

useEffect(() => {
  // Check if user has accepted the agreement
  const hasAcceptedAgreement = localStorage.getItem('userAgreementAccepted');
  if (!hasAcceptedAgreement) {
    setShowAgreement(true);
  }
}, []);

const handleAgreementAccept = () => {
  localStorage.setItem('userAgreementAccepted', 'true');
  setShowAgreement(false);
};

  return (
      <ThemeProvider theme={theme}>
        <Box // @ts-ignore
         mt={-5}>
          <Box px={1} >
            <GradientBox>
              <Box // @ts-ignore
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: { xs: 2, sm: 3 },
                }}
              >
                <Box width={'100%'}  display={'flex'} justifyContent={'space-between'}>
                  <SettingsIcon sx={{ fontSize: '1.5rem', color:"white",       p:0.5,          
                  }} />
                  <UserAvatar 
                    telegramUserId={telegramUser?.id?.toString() ?? ''}
                    displayName={telegramUser?.first_name ?? 'User'}
                  />
                </Box>
                {/* Live Stats Badge */}
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>           
                </Box>

                <Typography mb={-2} mt={-2} className="total-equity"
                    variant="subtitle2"
                    sx={{ color: "white" }}
                    align="center"
                  >
                    My Balance
                  </Typography>

                {/* Main Title */}
                 <Typography  mb={-2} variant="subtitle1" align="center" gutterBottom>
                    <span style={{ fontSize: "2.5rem" ,color:"grey"}}>$</span>
                    <span style={{ fontSize: "2.5rem", fontWeight:"bold" }}>{totalEquity.split('.')[0]}</span>
                    <span style={{ fontSize: "1.6rem" }}>.{totalEquity.split('.')[1]}</span>
                  </Typography>
                  {/* İlk Kart */}
                  <Box  sx={{ borderRadius: 3 }}>            {/* Total Account Equity */}
                    
                  

                

               
                  {/* Buttons */}
                <Box 
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "repeat(4, 1fr)",
                      width: '100%',
                      mt: 1,
                      mb: 0,
                    }}
                  >
                   <Button
                className="deposit-button"
                data-tour="deposit-button"
                   sx={{
                    flexDirection: 'column', // Stack icon and text vertically
                    textTransform: "none", 
                  backgroundColor: 'rgba(110, 211, 255, 0.05)',
                color:'white',                   fontSize: '0.7rem',
                
                  mr:1,                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
                           px:2,

                  borderRadius: 2,
                }}
                onClick={() => setOpenDepositDrawer(true)} 
              >
                <AddCircleIcon sx={{ fontSize: '1.5rem', color:"#89d9ff" }} />
                Deposit
              </Button>
                <Button
                 className="withdraw-button"
                data-tour="withdraw-button"
                sx={{
                    flexDirection: 'column', // Stack icon and text vertically
                    textTransform: "none",
                                    
                    mr:1,
                px:2,
                  color:'white',
                    fontSize: '0.7rem',
                  backgroundColor: 'rgba(110, 211, 255, 0.05)',
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",

                    borderRadius: 2,
                  }}
          onClick={() => setOpenWithdrawDrawer(true)}
        >
          <OutboundIcon sx={{ fontSize: '1.5rem', color:"#89d9ff" }} />
          Withdraw
        </Button>


      
                <Button
                className="swap-button"
          onClick={() => setOpenSwapDrawer(true)}
            sx={{
                    flexDirection: 'column',
                    textTransform: "none",
                  backgroundColor: 'rgba(110, 211, 255, 0.05)',
                           px:3,
                color:'white',
                    fontSize: '0.7rem',
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
                    borderRadius: 2, 
                  }}
          >
            <SwapHorizontalCircleIcon sx={{ fontSize: '1.5rem', color:"#89d9ff" }} />
            Swap
          </Button>

            <>
                <Button
                    className="history-button"
              onClick={() => setOpenHistoryDrawer(true)}
             sx={{
                    flexDirection: 'column', // Stack icon and text vertically
                    textTransform: "none",
                  backgroundColor: 'rgba(110, 211, 255, 0.05)',
                                                              px:2,

                ml:1,
                  color:'white',
                    fontSize: '0.7rem',
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
                    borderRadius: 2,
                  }}
              >
                <ReceiptLongIcon sx={{ fontSize: '1.5rem',                               color: '#6ed3ff',
              }} />
                History
              </Button>
            </>


          

        {/* Tam Ekran TokenSwap Modal */}
        {showTokenSwap && (
          <Box className="fullscreen-modal">
            {/* Üst Bar */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="h6">Convert Assets</Typography>
              <Button
                onClick={() => setShowTokenSwap(false)} // Modalı kapat
                sx={{ textTransform: "none", color: "red" }}
              >
                Close
              </Button>
            </Box>

            {/* TokenSwap Bileşeni */}
            <Box sx={{ flex: 1, overflowY: "auto" }}>
              <TokenSwap />
            </Box>
          </Box>
        )}
              </Box>
          </Box>

          {/* Description */}
         
           

         

          {/* Stats Grid */}
         
        </Box>
      </GradientBox>
    </Box>

    {/* İkinci Kart - Asset List */}
    <Box sx={{ borderRadius: 3, mt: 4, mx:1 }}>
     
      {/* Başlık ve Arama Kutusu */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
          
        }}
      >
        {/* Arama Kutusunun Görünümü */}
          <Typography variant="subtitle1" mx={1} fontSize={'1.3em'}>My Assets</Typography>
                  <Typography mx={1} variant="subtitle1" fontSize={'1em'} color={'gray'}>see all</Typography>

       
      </Box>

      {/* Dinamik Item Listesi */}
      {filteredData.map((item, index) => (
        <Tooltip
          key={index}
          title={
            !item.active
              ? `${item.symbol} şu anda aktif değil. Yakında kullanıma sunulacak!`
              : ""
          }
          arrow
        >
          <Box
            key={index}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
              borderBottom: index < filteredData.length - 1 ? "" : "none",
              px: 1,
              py:1.2,
              backgroundImage: !item.active
                ? "linear-gradient(45deg, #f3f3f3 25%, #eaeaea 25%, #eaeaea 50%, #f3f3f3 50%, #f3f3f3 75%, #eaeaea 75%, #eaeaea)"
                : "none",
              borderRadius: 2,
              pointerEvents: !item.active ? "none" : "auto",
              opacity: item.active ? 1 : 0.6,
            }}
          >
            {/* Sol Kısım: Logo ve Yazılar */}
            <Box sx={{ display: "flex", alignItems: "center",color:"white",fontWeight:"bold" }}>
              <Avatar
                src={item.logo}
                alt={item.symbol}
                sx={{ width: 40, height: 40, mr: 2 ,color:"black"}}
              />
              <Box>
                <Typography variant="body2" fontSize={'1rem' } >
                  {item.symbol}
                  {!item.active && (
                    <span style={{ marginLeft: "10px", color: "gray" }}>
                      🔒 coming soon
                    </span>
                  )}
                </Typography>
              <Typography variant="subtitle2" fontSize={"0.8rem"} color="gray">
                ${item.price}
              </Typography>
               
              </Box>
            </Box>

            {/* Sağ Kısım: Rakamlar */}
            <Box sx={{ textAlign: "right" }}>
                <Typography variant="body2" fontSize={'1rem' } >
                 {formatDisplayAmount(item.amount, item.symbol)}
              </Typography>
             
              <Typography variant="subtitle2" fontSize={"0.8rem"} color="gray">
                  ${item.usdValue.toFixed(2)}
              </Typography>
            </Box>
          </Box>
        </Tooltip>
      ))}

    
    </Box>
  </Box>

  {/* Add the new drawer components */}
  <DepositDrawer
    open={openDepositDrawer}
    onClose={() => setOpenDepositDrawer(false)}
  /> 

  <WithdrawDrawer
    open={openWithdrawDrawer}
    onClose={() => setOpenWithdrawDrawer(false)}
  />

  <HistoryDrawer
    open={openHistoryDrawer}
    onClose={() => setOpenHistoryDrawer(false)}
  />

  {/* Add the new SwapDrawer component */}
  <SwapDrawer
    open={openSwapDrawer}
    onClose={() => setOpenSwapDrawer(false)}
  />

          <Snackbar
      open={snackbarOpen}
      autoHideDuration={2000}
      onClose={handleSnackbarClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Display on top
    >
      <SnackbarContent
        style={{
          backgroundColor: '#4caf50', // Green background
          color: '#fff', // White text color
          borderRadius: 8, // Rounded corners
          display: 'flex',
          alignItems: 'center',
          padding: '10px 20px',
        }}
        message={
          <span style={{ display: 'flex', alignItems: 'center' }}>
            <CheckCircleOutline style={{ marginRight: 10 }} />
            Copied to clipboard!
          </span>
        }
      />
    </Snackbar>

    {/* Add UserAgreementModal */}
    <UserAgreementModal
      open={showAgreement}
      onClose={() => {}} // Empty function since we don't want to allow closing without accepting
      onAccept={handleAgreementAccept}
    />
  </ThemeProvider>
);
};

export default AccountEquityCard;
