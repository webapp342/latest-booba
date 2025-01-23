import React, { useState, useEffect } from "react";
import {
  TextField,
  Card,
  Typography,
  SwipeableDrawer,
  List,
  ListItem,
  IconButton,
  Box,
  Avatar,
  Grid,
  Button,
  Alert,
} from "@mui/material";
import SwapVertRoundedIcon from '@mui/icons-material/SwapVertRounded';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import axios from "axios";
import UnfoldMoreRoundedIcon from '@mui/icons-material/UnfoldMoreRounded';
import logo5 from '../assets/logo5.png';
import { doc, onSnapshot, getFirestore, updateDoc } from "firebase/firestore";
import { initializeApp } from 'firebase/app';

import { firebaseConfig } from './firebaseConfig';
import { useNavigate } from "react-router-dom";
import WebApp from "@twa-dev/sdk";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


const TICKET_TON_RATE = 2.5;

const TokenSwap: React.FC = () => {
  const [fromToken, setFromToken] = useState("TON");
  const [toToken, setToToken] = useState("TICKET");
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [tonPrice, setTonPrice] = useState<number>(0);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedTokenType, setSelectedTokenType] = useState<"from" | "to">("from");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSwapping, setIsSwapping] = useState(false);
     const navigate = useNavigate();

  const [balances, setBalances] = useState({
    bblip: 0,
    usdt: 0,
    ticket: 0,
    ton: 0
  });

  const tokens = [
        { name: "TICKET", icon: "https://cryptologos.cc/logos/telcoin-tel-logo.png?v=040" },

    { name: "TON", icon: "https://s3-symbol-logo.tradingview.com/crypto/XTVCTON--big.svg" },
    { name: "USDT", icon: "https://s3-symbol-logo.tradingview.com/crypto/XTVCUSDT--big.svg" },
        { name: "BBLIP", icon: logo5 },

  ];

  const theme = createTheme({
    typography: {
      fontFamily: "monospace",
    },
  });

  // Fetch TON price from Binance API
  const fetchTonPrice = async () => {
    try {
      const response = await axios.get(`https://api.binance.com/api/v3/ticker/price`, {
        params: { symbol: 'TONUSDT' },
      });
      setTonPrice(parseFloat(response.data.price));
    } catch (error) {
      console.error("Error fetching TON price:", error);
    }
  };

  useEffect(() => {
          const backButton = WebApp.BackButton;
      
          // BackButton'u görünür yap ve tıklanma işlevi ekle
          backButton.show();
          backButton.onClick(() => {
            navigate("/latest-booba/stake");
          });
      
          // Cleanup: Bileşen unmount olduğunda butonu gizle ve event handler'ı kaldır
          return () => {
            backButton.hide();
            backButton.offClick(() => {
              navigate("/latest-booba/stake"); // Buraya tekrar aynı callback sağlanmalıdır.
            });
          };
        }, [navigate]);
    

  useEffect(() => {
    fetchTonPrice();
    const interval = setInterval(fetchTonPrice, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const telegramUserId = localStorage.getItem("telegramUserId");
    if (!telegramUserId) {
      console.error("Telegram User ID not found!");
      return;
    }

    const docRef = doc(db, "users", telegramUserId);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setBalances({
          bblip: data.bblip || 0,
          usdt: data.usdt || 0,
          ticket: data.tickets || 0,
          ton: data.total || 0
        });
      }
    });

    return () => unsubscribe();
  }, []);

  

 const handleAmountChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  type: "from" | "to"
) => {
  const inputValue = e.target.value;

  if (inputValue === "") {
    setFromAmount("");
    setToAmount("");
    return;
  }

  const amount = parseFloat(inputValue);
  if (isNaN(amount)) return;

  if (type === "from") {
    setFromAmount(inputValue);

    // TON -> USDT dönüşümü
    if (fromToken === "TON" && toToken === "USDT") {
      setToAmount((amount * tonPrice).toFixed(2)); // TON miktarını USDT'ye çevir
    }
    // USDT -> TON dönüşümü
    else if (fromToken === "USDT" && toToken === "TON") {
      setToAmount((amount / tonPrice).toFixed(2)); // USDT miktarını TON'a çevir
    }
    // TICKET dönüşümleri
    else if (fromToken === "TON" && toToken === "TICKET") {
      setToAmount((amount / 2.5).toFixed(2)); // 2.5 TON = 1 TICKET
    } else if (fromToken === "TICKET" && toToken === "TON") {
      setToAmount((amount * 2.5).toFixed(2)); // 1 TICKET = 2.5 TON
    }
  } else {
    setToAmount(inputValue);

    if (fromToken === "TON" && toToken === "USDT") {
      setFromAmount((amount / tonPrice).toFixed(2));
    } else if (fromToken === "USDT" && toToken === "TON") {
      setFromAmount((amount * tonPrice).toFixed(2));
    } else if (fromToken === "TON" && toToken === "TICKET") {
      setFromAmount((amount * 2.5).toFixed(2));
    } else if (fromToken === "TICKET" && toToken === "TON") {
      setFromAmount((amount / 2.5).toFixed(2));
    }
  }
};



  const handleTokenSelect = (token: { name: string; icon: string }) => {
    if (selectedTokenType === "from") {
      if (token.name === toToken) {
        setToToken(fromToken);
      }
      setFromToken(token.name);
    } else {
      if (token.name === fromToken) {
        setFromToken(toToken);
      }
      setToToken(token.name);
    }

    setFromAmount("");
    setToAmount("");
    setOpenDrawer(false);
  };

const handleSwap = async () => {
  setError(null);
  setSuccess(null);
  setIsSwapping(true);

  try {
    const telegramUserId = localStorage.getItem("telegramUserId");
    if (!telegramUserId) {
      throw new Error("Telegram User ID not found!");
    }

    const fromAmountNum = parseFloat(fromAmount);
    const toAmountNum = parseFloat(toAmount);

    if (isNaN(fromAmountNum) || isNaN(toAmountNum)) {
      throw new Error("Invalid amount entered");
    }

    const docRef = doc(db, "users", telegramUserId);

    // TON -> USDT işlemi
    if (fromToken === "TON" && toToken === "USDT") {
      const requiredTon = fromAmountNum * 1000; // TON miktarını 1000 ile çarp

      if (balances.ton < requiredTon) {
        throw new Error(`Insufficient TON. Need ${requiredTon / 1000} TON`);
      }

      await updateDoc(docRef, {
        total: balances.ton - requiredTon, // TON miktarını düşür
        usdt: (balances.usdt || 0) + toAmountNum, // USDT miktarını artır
      });

      setSuccess(`Successfully swapped ${fromAmountNum} TON to ${toAmountNum} USDT`);
    }
    // USDT -> TON işlemi
    else if (fromToken === "USDT" && toToken === "TON") {
      const requiredUsdt = fromAmountNum; // USDT doğrudan işlem görecek
      const addedTon = toAmountNum * 1000; // TON miktarını 1000 ile çarp

      if (balances.usdt < requiredUsdt) {
        throw new Error("Insufficient USDT");
      }

      await updateDoc(docRef, {
        usdt: balances.usdt - requiredUsdt, // USDT miktarını düşür
        total: balances.ton + addedTon, // TON miktarını artır
      });

      setSuccess(`Successfully swapped ${fromAmountNum} USDT to ${toAmountNum} TON`);
    }
    // TICKET işlemleri
    else if (fromToken === "TON" && toToken === "TICKET") {
      const requiredTon = toAmountNum * 2500;

      if (balances.ton < requiredTon) {
        throw new Error(`Insufficient TON. Need ${requiredTon / 1000} TON`);
      }

      await updateDoc(docRef, {
        total: balances.ton - requiredTon,
        tickets: (balances.ticket || 0) + toAmountNum,
      });

      setSuccess(`Successfully swapped ${fromAmountNum} TON to ${toAmountNum} TICKET`);
    } else if (fromToken === "TICKET" && toToken === "TON") {
      const addedTon = fromAmountNum * 2500;

      if (balances.ticket < fromAmountNum) {
        throw new Error("Insufficient TICKET balance");
      }

      await updateDoc(docRef, {
        tickets: balances.ticket - fromAmountNum,
        total: balances.ton + addedTon,
      });

      setSuccess(`Successfully swapped ${fromAmountNum} TICKET to ${toAmountNum} TON`);
    } else {
      throw new Error("Unsupported token swap");
    }

    setFromAmount("");
    setToAmount("");
  } catch (error) {
    setError(error instanceof Error ? error.message : "An error occurred during the swap");
  } finally {
    setIsSwapping(false);
  }
};




  const handleTokenSwapInline2 = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  const getBalanceForToken = (tokenName: string) => {
    switch (tokenName) {
      case 'TON':
        return balances.ton;
      case 'USDT':
        return balances.usdt;
      case 'BBLIP':
        return balances.bblip;
      case 'TICKET':
        return balances.ticket;
      default:
        return 0;
    }
  };

  const formatDisplayAmount = (amount: number, symbol: string) => {
    if (symbol === "BBLIP" || symbol === "TON") {
      return (amount / 1000).toFixed(2);
    }
    return amount.toFixed(2);
  };

  // Calculate and display equivalent prices
  const getEquivalentPrice = (token: string): string => {
    switch (token) {
  
      case "TON":
        return `  ${tonPrice.toFixed(2)} USDT`;
      case "TICKET":
        return `  ${TICKET_TON_RATE} TON (${(TICKET_TON_RATE * tonPrice).toFixed(2)} USDT)`;
      default:
        return "";
    }
  };

  return (
    <ThemeProvider theme={theme}>
    
      
            {/* Add error and success alerts */}
      {error && (
        <Box sx={{ mt: 2 }}>
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        </Box>
      )}
      {success && (
        <Box sx={{ mt: 2 }}>
          <Alert severity="success" onClose={() => setSuccess(null)}>
            {success}
          </Alert>
        </Box>
      )}
      <Box  sx={{ display: "flex", mt: 4, justifyContent: "center", alignItems: "center" }}>
        <Card   sx={{p:1, boxShadow: 0, borderRadius: 4, width: "100%" , bgcolor:'#282828' }}>
          <Box  display={"flex"}   alignItems={"center"} justifyContent={"space-between"} sx={{ mb: 1 }}>
            <TuneRoundedIcon  fontSize="medium" sx={{color:'white'}} />
            <Typography sx={{color:'white'}} variant="h6" fontWeight={"bold"}>Swap</Typography>
            <RefreshRoundedIcon sx={{color:'white'}} fontSize="medium" />
          </Box>

         
            <Grid container spacing={3} alignItems="center"  bgcolor={'#282828'} >
        <Grid item xs={12}>
          <Card sx={{ padding: 2, display: "flex", flexDirection: "column", gap: 2, boxShadow: 3,  borderRadius: 2, mb: 3, backgroundColor: '#3f3f3f' }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Box sx={{width:'33vw', display: "flex", alignItems: "center", gap: 1, boxShadow: 2, padding: 1, cursor: "pointer", borderRadius: 2, backgroundColor: '#3f3f3f' }} onClick={() => { setSelectedTokenType("from"); setOpenDrawer(true); }}>
                    <Avatar src={tokens.find((t) => t.name === fromToken)?.icon} sx={{ width: 30, height: 30 }} />
                    <Typography color={'white'} variant="body1">{fromToken}</Typography>
                  <UnfoldMoreRoundedIcon  fontSize="medium" sx={{color:'white'}} />
                  </Box>
                  <Box sx={{width:'47vw', display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
                  <Typography variant="caption" sx={{ color: 'gray' }}>
  Balance: {formatDisplayAmount(getBalanceForToken(fromToken), fromToken)}
</Typography>

                  </Box>
                </Box>
                <TextField 
                  value={fromAmount} 
                  onChange={(e) => handleAmountChange(e, "from")} 
                  fullWidth 
                  
                  placeholder="0.0" 
                  variant="standard" 
                  InputProps={{ disableUnderline: true }} 
                  inputProps={{ type: "text", inputMode: "decimal", pattern: "[0-9]*" }} 
                  sx={{mb:3, "& .MuiInputBase-input": { padding: 0,color:'white', textAlign: "right", fontSize: "2.2rem" } }} 
                />
              </Box>
            </Box>
          </Card>
        </Grid>


            {/* Swap Icon Between */}
            <Grid item xs={12} mt={-7.5} textAlign="center">
              <IconButton  onClick={handleTokenSwapInline2} sx={{ backgroundColor: "#00c6ff", border: "2px solid #00c6ff", borderRadius: "30%", "&:hover": { backgroundColor: "#e0e0e0" } }}>
                <SwapVertRoundedIcon  fontSize="small" />
              </IconButton>
            </Grid>

            {/* To Token Section */}
            <Grid item xs={12}>
          <Card sx={{ padding: 2, display: "flex", flexDirection: "column", gap: 2, boxShadow: 3,  borderRadius: 2, mb: 1,mt:-4.5 ,backgroundColor: '#3f3f3f' }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Box sx={{width:'33vw', display: "flex", alignItems: "center", gap: 1, boxShadow: 2, padding: 1, cursor: "pointer", borderRadius: 2, backgroundColor: '#3f3f3f' }} onClick={() => { setSelectedTokenType("from"); setOpenDrawer(true); }}>
                    <Avatar src={tokens.find((t) => t.name === toToken)?.icon} sx={{ width: 30, height: 30 }} />
                 <Typography color={'white'} variant="body1">{toToken}</Typography>
                  <UnfoldMoreRoundedIcon  fontSize="medium" sx={{color:'white'}} />
                  </Box>
                  <Box sx={{width:'47vw', display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1}}>
                    <Typography variant="caption" sx={{ color: 'gray' }}>
  Balance: {formatDisplayAmount(getBalanceForToken(toToken), toToken)}
                    </Typography>
                 
                  </Box>
                </Box>
                <TextField 
                  value={toAmount} 
                  onChange={(e) => handleAmountChange(e, "to")} 
                  fullWidth 
                  placeholder="0.0" 
                  variant="standard" 
                  InputProps={{ disableUnderline: true }} 
                  inputProps={{ type: "text", inputMode: "numeric", pattern: "[0-9]*" }} 
                  sx={{mb:3, "& .MuiInputBase-input": { padding: 0,color:'white', textAlign: "right", fontSize: "2.2rem" } }} 
                />
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>
         {/* Add swap button */}
      <Box sx={{ mt: 0, mb: 2 }}>
        <Button
          variant="contained"
          fullWidth
          size="large"
          onClick={handleSwap}
          disabled={!fromAmount || !toAmount || isSwapping}
          sx={{
            borderRadius: 2,
            py: 1.5,
            backgroundColor: '#00c6ff',
            '&:hover': {
              backgroundColor: '#1565c0',
            },
          }}
        >
          {isSwapping ? "Swapping..." : "Swap"}
        </Button>
      </Box>

      


         {/* Add price information */}
   <Box sx={{  p: 0.5,  borderRadius: 2 }}>
  {tokens.filter(t => t.name !== "USDT").map(token => (
    <Typography key={token.name} variant="caption" display="flex" justifyContent="space-between" sx={{color:'white', mb: 0.5 }}>
      <span>{token.name}</span>
      <span style={{ marginLeft: 'auto' }}>
        {token.name === "BBLIP" ? "Coming Soon ..." : getEquivalentPrice(token.name)}
      </span>
    </Typography>
  ))}
</Box>


      


   

          {/* Token Selection Drawer */}
 {/* Token Selection Drawer */}
<SwipeableDrawer
  anchor="bottom"
  open={openDrawer}
  onClose={() => setOpenDrawer(false)}
  onOpen={() => setOpenDrawer(true)}
>
  <List sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' ,bgcolor:'#282828'}}>
    {/* Başlık ekleniyor */}
    <ListItem sx={{ justifyContent: 'center', padding: 2 }}>
      <Typography variant="h6">Select Asset</Typography>
    </ListItem>

    {/* Tokenlar listesi */}
    {tokens.map((token) => (
      <ListItem
        button
        key={token.name}
        onClick={() => handleTokenSelect(token)}
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          padding: 2,
          opacity: token.name === 'BBLIP' ? 0.5 : 1, // BBLIP devre dışı bırakıldığında yarı şeffaf yapılır
          pointerEvents: token.name === 'BBLIP' ? 'none' : 'auto', // BBLIP tıklanamaz hale getirilir
        }}
      >
        <Avatar
          src={token.icon}
          sx={{ marginRight: 2 }}
        />
        <Typography variant="body1" sx={{ flexGrow: 1 }}>
          {token.name}
        </Typography>
        <Typography variant="body2">
          {token.name === 'BBLIP' ? (
            'Coming Soon' // BBLIP için Coming Soon mesajı
          ) : (
            token.name === 'TON' || token.name === 'BBLIP'
              ? formatDisplayAmount(getBalanceForToken(token.name), token.name)
              : getBalanceForToken(token.name).toFixed(2)
          )}
        </Typography>
      </ListItem>
    ))}
  </List>
</SwipeableDrawer>


        </Card>
      </Box>
    </ThemeProvider>
  );
};

export default TokenSwap;
