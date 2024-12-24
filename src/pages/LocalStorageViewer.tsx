import React, { useState, useEffect } from "react";import { ThemeProvider, createTheme, CssBaseline ,Tooltip} from "@mui/material";
import QRCode from 'qrcode';
import { Box, Card, CardContent, Typography,  Button, Avatar, TextField, InputAdornment ,Drawer, Snackbar, SnackbarContent } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import { CheckCircleOutline } from '@mui/icons-material';
import LoupeIcon from '@mui/icons-material/Loupe';
import { useNavigate } from 'react-router-dom';
import TokenSwap from "./SwapComponent"; // TokenSwap bileşenini eklediğiniz yer
import logo5 from '../assets/logo5.png';
import { doc, onSnapshot , getFirestore, getDoc} from "firebase/firestore";
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './firebaseConfig';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);





// Tema oluşturma
const theme = createTheme({
  typography: {
    fontFamily: "Montserrat, sans-serif",
  },
});


interface Asset {
  logo: string;
  symbol: string;
  name: string;
  amount: number;
  usdValue: number;
  active: boolean;
}

// Centralized initial data definition
const initialData: Asset[] = [
  {
    logo: logo5,
    symbol: "BBLIP",
    name: "Booba",
    amount: 0, // Placeholder, updated dynamically
    usdValue: 0,
    active: true
  },
  {
    logo: "https://s3-symbol-logo.tradingview.com/crypto/XTVCADA--big.svg",
    symbol: "TON",
    name: "Ton",
    amount: 10000,
    usdValue: 0,
    active: true
  },
  {
    logo: "https://s3-symbol-logo.tradingview.com/crypto/XTVCUSDT--big.svg",
    symbol: "USDT",
    name: "Tether",
    amount: 0,
    usdValue: 0,
    active: true
  },
  {
    logo: "https://s3-symbol-logo.tradingview.com/crypto/XTVCBTC--big.svg",
    symbol: "TICKET",
    name: "Lucky Ticket",
    amount: 0,
    usdValue: 0,
    active: true
  },
  {
    logo: "https://s3-symbol-logo.tradingview.com/crypto/XTVCETH--big.svg",
    symbol: "ETH",
    name: "Ethereum",
    amount: 0,
    usdValue: 0,
    active: false
  },
  {
    logo: "https://s3-symbol-logo.tradingview.com/crypto/XTVCBNB--big.svg",
    symbol: "BNB",
    name: "Binance Coin",
    amount: 0,
    usdValue: 0,
    active: false
  },
  {
    logo: "https://s3-symbol-logo.tradingview.com/crypto/XTVCADA--big.svg",
    symbol: "ADA",
    name: "Cardano",
    amount: 0,
    usdValue: 0,
    active: false
  }
];

const AccountEquityCard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false); // Arama moduna girildi mi?
  const [showTokenSwap, setShowTokenSwap] = useState(false);
  const [openDepositDrawer, setOpenDepositDrawer] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [comment, setComment] = useState("Loading..."); // Default value for comment

  const [tonPrice, setTonPrice] = useState<number | null>(null); // TON price state
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [data, setData] = useState<Asset[]>([]); // Initialize as an empty array
  const [totalEquity, setTotalEquity] = useState<string>("0.00");
   const navigate = useNavigate();

  const handleClick = () => {
    navigate('/latest-booba/');
  };

// Calculate the total USD value
useEffect(() => {
  const totalUsdValue = data.reduce((sum, item) => sum + item.usdValue, 0);
  setTotalEquity(totalUsdValue.toFixed(2)); // Set the total value in state
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

  // Calculate USD value for each asset
  const calculateUsdValue = (amount: number, symbol: string) => {
    if (symbol === "USDT") {
      return amount; // USDT is always 1 USD
    }
    if (symbol === "BBLIP") {
      return amount * 0.07; // BBLIP price is fixed at 0.07 USD
    }
    if (symbol === "TON" && tonPrice !== null) {
      return amount * tonPrice; // Calculate TON USD value
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
  }, [tonPrice]);

  // Arama filtreleme fonksiyonu
  const filteredData = data.filter(
    (item) =>
      item.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchFocus = () => {
    setIsSearching(true); // Arama kutusuna tıklanması ile arama moduna geç
  };

  const handleCancelSearch = () => {
    setSearchQuery(""); // Arama kutusunu sıfırla
    setIsSearching(false); // Arama modunu kapat
  };

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




  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
  
      <Box  m={2} justifyContent= "space-between"
          alignItems= "center"
          display="flex">

<PersonOutlinedIcon
      sx={{ fontSize: '1.6rem', color: 'black', cursor: 'pointer' }}
      onClick={handleClick}
    />

            <Typography   
            sx={{
              fontSize: '1.3rem',
              fontWeight: 'bold',
              
              background: 'linear-gradient(90deg, #031340, #08AEEA)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
           Wallet

           </Typography>

  

           <AdminPanelSettingsOutlinedIcon    sx={{ fontSize: '1.6rem', color: 'black' }} />

      

      
       
              </Box>
        {/* İlk Kart */}
        <Card sx={{ borderRadius: 3, mx: "auto", mt: 4,  m: 2 }}>
          <CardContent>
            {/* Total Account Equity */}
            <Typography
              variant="subtitle2"
              sx={{ color: "grey.600" }}
              align="center"
              gutterBottom
            >
              Total Account Equity
            </Typography>
            <Typography mt={-1} variant="subtitle1" align="center" gutterBottom>
        {totalEquity} USDT
      </Typography>
            <Typography mt={-1}
              variant="subtitle2"
              align="center"
              color="text.secondary"
            >
              = ${totalEquity}
            </Typography>

        

           
            {/* Buttons */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: 4,
                mb: 0,
                gap: 1,
              }}
            >
             <Button
                startIcon={<LoupeIcon />}
                variant="contained"
                color="primary"
                size="small"
                sx={{
                  textTransform: "none",
                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
                  borderRadius: 2,
                }}
                onClick={handleDepositClick}
              >
                Deposit
              </Button>
              <Button
                              startIcon={<ArrowCircleUpIcon />}

                variant="outlined"
                size="small"
                sx={{
                  textTransform: "none",
                  backgroundColor: "transparent",
                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
                  borderRadius: 2,

                }}
              >
                Withdraw
              </Button>
              <Button
  startIcon={<PublishedWithChangesIcon />}
  variant="outlined"
  size="small"
  onClick={() => setShowTokenSwap(true)} // TokenSwap'ı göster
  sx={{
    textTransform: "none",
    backgroundColor: "transparent",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
    borderRadius: 2,
  }}
>
  Convert
</Button>

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
          </CardContent>
        </Card>

      {/* İkinci Kart - Asset List */}
<Card sx={{ borderRadius: 3, mx: "auto", p: 1, m: 2 }}>
  <CardContent>
    {/* Başlık ve Arama Kutusu */}
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 2,
      }}
    >
      {/* Arama Kutusunun Görünümü */}
      {!isSearching && (
        <Typography variant="subtitle1">Assets List</Typography>
      )}
      <TextField
        size="small"
        variant="outlined"
        placeholder="Search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={handleSearchFocus} // Arama kutusuna tıklanınca genişler
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: "grey.600" }} />
            </InputAdornment>
          ),
        }}
        sx={{
          width: isSearching ? "100%" : 150, // Arama kutusu genişlemesi
          transition: "width 0.3s ease",
        }}
      />
      {isSearching && (
        <Button
          onClick={handleCancelSearch}
          sx={{
            textTransform: "none",
            fontSize: "0.875rem",
            color: "primary.main",
            marginLeft: 2,
          }}
        >
          Cancel
        </Button>
      )}
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
            mb:1,
            borderBottom:
              index < filteredData.length  -1 ? "" : "none",
            p: 1,
            // Devre dışı öğeler için gri tonlama veya desen
            backgroundColor: !item.active ? "grey.100" : "transparent",
            backgroundImage: !item.active
              ? "linear-gradient(45deg, #f3f3f3 25%, #eaeaea 25%, #eaeaea 50%, #f3f3f3 50%, #f3f3f3 75%, #eaeaea 75%, #eaeaea)"
              : "none",
            borderRadius: 1,
            pointerEvents: !item.active ? "none" : "auto", // Tıklamayı devre dışı bırak
            opacity: item.active ? 1 : 0.6, // Görsel farklılık
          }}
        >
          {/* Sol Kısım: Logo ve Yazılar */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar
              src={item.logo}
              alt={item.symbol}
              sx={{ width: 40, height: 40, mr: 2 }}
            />
            <Box>
              <Typography variant="body2">
                {item.symbol}
                {!item.active && (
                  <span style={{ marginLeft: "10px", color: "gray" }}>
                    🔒 Coming Soon
                  </span>
                )}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {item.name}
              </Typography>
            </Box>
          </Box>

          {/* Sağ Kısım: Rakamlar */}
          <Box sx={{ textAlign: "right" }}>
            <Typography variant="subtitle2">{item.amount}</Typography>
            <Typography variant="subtitle2" color="text.secondary">
              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                ${item.usdValue.toFixed(2)}
              </Typography>
            </Typography>
          </Box>
        </Box>
      </Tooltip>
    ))}
  </CardContent>
</Card>


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
      <Typography  sx={{ textAlign: 'center', flexGrow: 1 , fontSize: '1.5rem', }}>
        Deposit 
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
        marginTop: 4,
      }}
    >
     <Box
        sx={{
          width: '80%',
          height: '200px',
       
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {qrCodeUrl ? (
          <img src={qrCodeUrl} alt="QR Code" style={{ maxWidth: '100%', maxHeight: '100%' }} />
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
        textAlign: 'center',
        alignItems: "center",
        justifyContent: 'space-between',
      }}
    >
<span style={{ color: "grey", fontSize: "0.9rem"  }}>
    Address: <span style={{ color: "black" , marginLeft: 12 , fontSize: "1rem"  }}>123456789</span>
  </span>       <Button
        onClick={() => {
          navigator.clipboard.writeText("123456789");
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
        alignItems: "center",
        justifyContent: 'space-between',
        marginBottom: 4,
      }}
    >
<span style={{ color: "grey", fontSize: "0.9rem" }}>
  Comment: <span style={{ color: "black", marginLeft: 12, fontSize: "1rem" }}>{comment}</span>
</span>

      <Button
        onClick={() => {
          navigator.clipboard.writeText("00.500");
          setSnackbarOpen(true);
        }}
      >
        Copy
      </Button>
    </Box>

    <Box
      sx={{
        mt:1,
        display: 'relative',
        mx:1,
        textAlign: "center",
        alignItems: "center",
        color: 'grey',
        marginBottom: 4,
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
