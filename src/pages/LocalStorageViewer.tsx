import React, { useState, useEffect } from "react";
import { ThemeProvider, createTheme, Tooltip } from "@mui/material";
import QRCode from 'qrcode';
import { Box, Typography, Button, Avatar, Drawer, Snackbar, SnackbarContent } from "@mui/material";
import SwapHorizontalCircleIcon from '@mui/icons-material/SwapHorizontalCircle';import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import OutboundIcon from '@mui/icons-material/Outbound';import TransactionHashes from "./TransactionHashes"; // Bileşeninizin yolu
import { CheckCircleOutline } from '@mui/icons-material';
import AddCircleIcon from '@mui/icons-material/AddCircle';import { useNavigate } from 'react-router-dom';
import TokenSwap from "./SwapComponent"; // TokenSwap bileşenini eklediğiniz yer
import logo5 from '../assets/darkLogo.png';
import SettingsIcon from '@mui/icons-material/Settings';
import { doc, onSnapshot, getFirestore, getDoc } from "firebase/firestore";
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './firebaseConfig';
import WebApp from "@twa-dev/sdk";
import TwoFieldsComponent from "./TwoFieldsComponent";
import Brand from "../components/AiYield";
import UserAvatar from "./UserAvatar";


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
  active: boolean;
}

// Centralized initial data definition
const initialData: Asset[] = [
  {
    logo: logo5,
    symbol: "BBLIP",
    view:"Booba Blip",
    name: "BBLIP",
    amount: 0, // Placeholder, updated dynamically
    usdValue: 0,
    active: true
  },
  {
    logo: "https://cryptologos.cc/logos/toncoin-ton-logo.png?v=040",
    symbol: "TON",
    name: "Ton",
        view:"Booba Blip",

    amount: 10000,
    usdValue: 0,
    active: true
  },
  {
    logo: "https://s3-symbol-logo.tradingview.com/crypto/XTVCUSDT--big.svg",
    symbol: "USDT",
    name: "USDT",
        view:"Booba Blip",

    amount: 0,
    usdValue: 0,
    active: true
  },
  {
    logo: "https://cryptologos.cc/logos/telcoin-tel-logo.png?v=040",
    symbol: "TICKET",
    name: "Ticket",
        view:"Booba Blip",

    amount: 0,
    usdValue: 0,
    active: true
  },
  {
    logo: "https://s3-symbol-logo.tradingview.com/crypto/XTVCETH--big.svg",
    symbol: "ETH",
    name: "Ethereum",
        view:"Booba Blip",

    amount: 0,
    usdValue: 0,
    active: false
  },
  {
    logo: "https://s3-symbol-logo.tradingview.com/crypto/XTVCBNB--big.svg",
    symbol: "BNB",
    name: "Binance Coin",
        view:"Booba Blip",

    amount: 0,
    usdValue: 0,
    active: false
  },
  {
    logo: "https://s3-symbol-logo.tradingview.com/crypto/XTVCADA--big.svg",
    symbol: "ADA",
    name: "Cardano",
        view:"Booba Blip",

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
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [comment, setComment] = useState("Loading..."); // Default value for comment
  const [tonPrice, setTonPrice] = useState<number | null>(null); // TON price state
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [data, setData] = useState<Asset[]>([]); // Initialize as an empty array
  const [totalEquity, setTotalEquity] = useState<string>("0.00");
   const navigate = useNavigate();

       const [open1, setOpen1] = useState(false);

  const [openDrawer, setOpenDrawer] = useState(false);

useEffect(() => {
      const backButton = WebApp.BackButton;
  
      // BackButton'u görünür yap ve tıklanma işlevi ekle
      backButton.show();
      backButton.onClick(() => {
        navigate("/latest-booba/");
      });
  
      // Cleanup: Bileşen unmount olduğunda butonu gizle ve event handler'ı kaldır
      return () => {
        backButton.hide();
        backButton.offClick(() => {
          navigate("/latest-booba/"); // Buraya tekrar aynı callback sağlanmalıdır.
        });
      };
    }, [navigate]);

  // Drawer'ı açma/kapama işlevi
  const handleClick1 = () => {
    setOpenDrawer(true);
  };

  const handleCloseDrawer1 = () => {
    setOpenDrawer(false);
  };

  

  

  // Calculate the total USD value
  useEffect(() => {
    const totalUsdValue = data.reduce((sum, item) => sum + item.usdValue, 0);
    setTotalEquity(totalUsdValue.toLocaleString(undefined, { 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 
    })); // Format with commas and 2 decimal places
  }, [data]);

  useEffect(() => {
    const telegramUserId = localStorage.getItem("telegramUserId");
    if (!telegramUserId) {
      console.error("Telegram User ID not found!");
      return;
    }

    // Firestore real-time listener
    const docRef = doc(db, "users", telegramUserId);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const bblipAmount = data.bblip || 0;
        const totalUSD = data.usdt || 0;
        const ticket = data.tickets || 0;
        const ton = data.total || 0;


        // Update initialData dynamically
        const updatedData = initialData.map((item) => {
          switch (item.symbol) {
            case "BBLIP":
              return { ...item, amount: bblipAmount };
            case "USDT":
              return { ...item, amount: totalUSD };
            case "TICKET":
              return { ...item, amount: ticket };
               case "TON":
              return { ...item, amount: ton };
            default:
              return item;
          }
        });

        setData(updatedData);

        // Store values in localStorage
        localStorage.setItem("bblipAmount", JSON.stringify(bblipAmount));
        localStorage.setItem("totalUSD", JSON.stringify(totalUSD));
        localStorage.setItem("ticket", JSON.stringify(ticket));
      } else {
        console.error("Document not found!");
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Fetch the TON/USDT price from Binance API
    const fetchTonPrice = async () => {
      try {
        const response = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=TONUSDT');
        const data = await response.json();
        if (data && data.price) {
          setTonPrice(parseFloat(data.price));
        }
      } catch (error) {
        console.error("Error fetching TON price:", error);
      }
    };

    fetchTonPrice();
  }, []);

   // Updated USD value calculation
  const calculateUsdValue = (amount: number, symbol: string) => {
    const actualAmount = symbol === "BBLIP" || symbol === "TON" ? amount / 1000 : amount;
    
    if (symbol === "USDT") {
      return actualAmount;
    }
    if (symbol === "BBLIP") {
      return actualAmount * 0.07; // BBLIP price using actual amount
    }
    if (symbol === "TON") {
      if (tonPrice !== null) {
        return actualAmount * tonPrice; // TON price using actual amount
      } else {
        console.warn("TON price is not available");
        return 0; // Return 0 if tonPrice is not available
      }
    }
    return 0;
  };

  useEffect(() => {
    // Update the usdValue for each asset whenever TON price is fetched or changed
    const updatedData = data.map((item) => ({
      ...item,
      usdValue: calculateUsdValue(item.amount, item.symbol),
    }));

    setData(updatedData);
  }, [tonPrice]); // Sadece tonPrice'ı bağımlılık olarak bırakıyoruz

  // Arama filtreleme fonksiyonu
  const filteredData = data.filter(
    (item) =>
      item.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );



   // Handle deposit drawer toggle
   const handleDepositClick = () => {
    setOpenDepositDrawer(true);
  };

  const handleCloseDrawer = () => {
    setOpenDepositDrawer(false);
  };

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

    const toggleDrawer = (state: boolean) => () => {
    setOpen1(state);
  };
 




  return (
    <ThemeProvider theme={theme}>
  
       <Brand/>

              <Box mt={"5vh"}>

   
  
                <Box px={2} display={'flex'} justifyContent={'space-between'}>
                                  <SettingsIcon sx={{ fontSize: '1.5rem', color:"white",       p:0.5,          
 }} />
                 <UserAvatar 
                  telegramUserId={telegramUser?.id?.toString() ?? ''}
                  displayName={telegramUser?.first_name ?? 'User'}
                />

                </Box>
        {/* İlk Kart */}
      <Box  sx={{ borderRadius: 3,   px: 2 }}>            {/* Total Account Equity */}
            <Typography className="total-equity"
              variant="subtitle2"
              sx={{ color: "white" }}
              align="center"
              gutterBottom
            >
              My Balance
            </Typography>
            <Typography  mt={-1} variant="subtitle1" align="center" gutterBottom>
              <span style={{ fontSize: "2.5rem" ,color:"grey"}}>$</span>
              <span style={{ fontSize: "2.5rem", fontWeight:"bold" }}>{totalEquity.split('.')[0]}</span>
              <span style={{ fontSize: "1.6rem" }}>.{totalEquity.split('.')[1]}</span>
            </Typography>
           

        

           
            {/* Buttons */}
            <Box
                    
              sx={{
                display: "flex",
                width:"100%",
                justifyContent: "space-between",
                mt: 1,
                mb: 0,
               
              }}
            >
             <Button
          className="deposit-button"
              
                 sx={{
                  flexDirection: 'column', // Stack icon and text vertically
                  textTransform: "none", 
         border:"1px solid #575757",
                  backgroundColor: "transparent",              color:'white',
                  fontSize: '0.7rem',
                  width:"25%",
                  mr:1,
                  borderRadius: 2,
                }}
                onClick={handleDepositClick} 
              >
                <AddCircleIcon sx={{ fontSize: '1.5rem', color:"#89d9ff" }} />
                Deposit
              </Button>
      <Button
               className="withdraw-button"
      sx={{
                  flexDirection: 'column', // Stack icon and text vertically
                  textTransform: "none",
                                    width:"25%",
                  mr:1,

                color:'white',
                  fontSize: '0.7rem',
                  border:"1px solid #575757",
                  backgroundColor: "transparent",

                  borderRadius: 2,
                }}
        onClick={handleClick1}
      >
        <OutboundIcon sx={{ fontSize: '1.5rem', color:"#89d9ff" }} />
        Withdraw
      </Button>

      {/* Drawer */}
      <Drawer
        anchor="bottom"
        open={openDrawer}
        onClose={handleCloseDrawer1}
        sx={{
          "& .MuiDrawer-paper": {
            height: "auto", // İstenilen yükseklik
            maxHeight: "90%", // Drawer'ın maksimum yüksekliği
            overflow: "auto",
            borderRadius: "10px 10px 0 0", // Üst köşeleri yuvarlak yapabiliriz
          },
        }}
      >
        {/* Alttan kayan drawer içerisinde TwoFieldsComponent */}
        <TwoFieldsComponent  />
      </Drawer> 

    
              <Button
              className="swap-button"
  onClick={() => setShowTokenSwap(true)} // TokenSwap'ı göster
    sx={{
                  flexDirection: 'column', // Stack icon and text vertically
                  textTransform: "none",
                border:"1px solid #575757",
                  backgroundColor: "transparent",
                                    width:"25%",
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
        onClick={toggleDrawer(true)}
       sx={{
                  flexDirection: 'column', // Stack icon and text vertically
                  textTransform: "none",
                border:"1px solid #575757",
                  backgroundColor: "transparent",
                                    width:"25%",
ml:1,
                  color:'white',
                  fontSize: '0.7rem',
                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
                  borderRadius: 2,
                }}
      >
        <ReceiptLongIcon sx={{ fontSize: '1.5rem', color:"#89d9ff" }} />
        History
      </Button>
      <Drawer
        anchor="bottom"
        open={open1}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: { borderRadius: "16px 16px 0 0", padding: 2, maxHeight: "50%" },
        }}
      >
        <Box>
          <TransactionHashes />
        </Box>
      </Drawer>
    </>
<Box>

</Box>

  

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

         

      {/* İkinci Kart - Asset List */}
<Box sx={{ borderRadius: 3, mt: 1, m:2 }}>
   
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
        <Typography variant="subtitle1" fontSize={'1.3em'}>My Assets</Typography>
                <Typography variant="subtitle1" fontSize={'1em'} color={'gray'}>see all</Typography>

     
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
            py:1.5,

            backgroundColor: !item.active ? "grey.100" : "#2f363a",
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
                    🔒 Coming Soon
                  </span>
                )}
              </Typography>
            <Typography variant="subtitle2" fontSize={"0.8rem"} color="gray">
              $5.45
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


{/* Bottom Drawer for Deposit Information */}
<Drawer
  anchor="bottom"
  open={openDepositDrawer}
  onClose={handleCloseDrawer}
>
  <Box sx={{ padding: 2, position: 'relative' }}>
    {/* Close Icon */}
    
    {/* Header Section */}
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
      }}
    >
      {/* Typography Header */}
      <Typography  sx={{ textAlign: 'left', flexGrow: 1 , fontSize: '1.5rem', }}>
        Deposit TON
      </Typography>

      {/* Close Icon Button */}
      <Button
        onClick={handleCloseDrawer}
        sx={{
          fontSize: '1.5rem',
          position: 'absolute',
          right: -12,
        }}
      >
        ✖
      </Button>
    </Box>


        {/* Image Box */}
        <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 2,
        bgcolor:'white',
        width:'75%',
        ml:'15%',
                  borderRadius:4,

      }}
    >
     <Box
        sx={{
          width: '90%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {qrCodeUrl ? (
          <img src={qrCodeUrl} alt="QR Code" style={{minWidth:'100%',minHeight:'100%',}} />
        ) : (
          <span>Loading QR Code...</span>
        )}
      </Box>
    </Box>

    

    {/* Account Number */}
    <Box
      sx={{
        mt:4,
        display: 'flex',
        mx:1,
        fontFamily: 'monospace',
        textAlign: 'center',
        alignItems: "center",
        justifyContent: 'space-between',
      }}
    >
<span style={{ color: "grey", fontSize: "0.9rem"  }}>
    Address: <span style={{ color: "white" , marginLeft: 12 , fontSize: "1rem"  , fontWeight: 'bolder'}}>UQDppAs...BNn2</span>
  </span>       <Button
        onClick={() => {
          navigator.clipboard.writeText("UQDppAsjyioMu23LIEaFBm5g5o5oNjRft99oe4gfv-c9BNn2");
          setSnackbarOpen(true);
        }}
      >
        Copy
      </Button>
    </Box>

    {/* Deposit Amount */}
    <Box
      sx={{
        mt:1,
        display: 'flex',
        mx:1,
                fontFamily: 'monospace',

        alignItems: "center",
        justifyContent: 'space-between',
        marginBottom: 4,
      }}
    >
<span style={{ color: "grey", fontSize: "0.9rem" }}>
  Comment: <span style={{ color: "white", marginLeft: 12, fontSize: "1rem", fontWeight: 'bolder' }}>{comment}</span>
</span>

      <Button
        onClick={() => {
      navigator.clipboard.writeText(comment);          
      setSnackbarOpen(true);
        }}
      >
        Copy
      </Button>
    </Box>

    <Box
      sx={{
      
        display: 'relative',

        textAlign: "center",
        alignItems: "center",
        color: 'grey',
                fontFamily: 'monospace',
         mt:-2,
        marginBottom: 1,
      }}
    >
      <h6>Please carefully send your $TON to these exact addresses</h6>
     
    </Box>


  </Box>
</Drawer>

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
    </ThemeProvider>
  );
};

export default AccountEquityCard;
