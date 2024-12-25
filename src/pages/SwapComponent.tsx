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
} from "@mui/material";
import SwapVertRoundedIcon from '@mui/icons-material/SwapVertRounded';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import axios from "axios";
import UnfoldMoreRoundedIcon from '@mui/icons-material/UnfoldMoreRounded';
import logo5 from '../assets/logo5.png';
import { doc, onSnapshot, getFirestore} from "firebase/firestore";
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './firebaseConfig';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const TokenSwap: React.FC = () => {
  const [fromToken, setFromToken] = useState("TON");
  const [toToken, setToToken] = useState("USDT");
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [fromTokenPrice, setFromTokenPrice] = useState<number>(0);
  const [toTokenPrice, setToTokenPrice] = useState<number>(1);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedTokenType, setSelectedTokenType] = useState<"from" | "to">("from");
  const [ setAllTokenPrices] = useState<any>({});
  
  // Add new state for balances
  const [balances, setBalances] = useState({
    bblip: 0,
    usdt: 0,
    ticket: 0,
    ton: 0
  });

  // Existing tokens array and other code remains the same...
  const tokens = [
    { name: "BBLIP", icon: logo5 },
    { name: "TON", icon: "https://s3-symbol-logo.tradingview.com/crypto/XTVCTON--big.svg" },
    { name: "USDT", icon: "https://s3-symbol-logo.tradingview.com/crypto/XTVCUSDT--big.svg" },
    { name: "TICKET", icon: "https://example.com/ticket-icon.png" },
  ];

  const theme = createTheme({
    typography: {
      fontFamily: "Montserrat, sans-serif",
    },
  });

  // Add new useEffect for fetching balances
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
        setBalances({
          bblip: data.bblip || 0,
          usdt: data.usdt || 0,
          ticket: data.tickets || 0,
          ton: data.total || 0
        });
      }
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  // Binance API'den fiyatları al
 const fetchTokenPrice = async (token: string) => {
  if (token === "USDT") {
    return 1; // USDT'nin fiyatı sabit
  }
  if (token === "BBLIP") return 0.07; // Sabit fiyat BBLIP için
  if (token === "TICKET") return 2.5; // TICKET fiyatını sabitle
  try {
    const response = await axios.get(`https://api.binance.com/api/v3/ticker/price`, {
      params: { symbol: `${token}USDT` },
    });
    return parseFloat(response.data.price); // Fiyatı döndürüyoruz
  } catch (error) {
    console.error("Error fetching price:", error);
    return 0;
  }
};


  useEffect(() => {
  const getPrices = async () => {
    const prices: any = {};
    for (const token of tokens) {
      prices[token.name] = await fetchTokenPrice(token.name);
    }
    setAllTokenPrices(prices);
    setFromTokenPrice(prices[fromToken] || 0);
    setToTokenPrice(prices[toToken] || 0);
  };
  getPrices();
}, [fromToken, toToken]);


 const handleAmountChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, 
  type: "from" | "to"
) => {
  const inputValue = e.target.value;

  // Eğer giriş boşsa, diğer alanı da boş yap
  if (inputValue === "") {
    setFromAmount("");
    setToAmount("");
    return;
  }

  const amount = parseFloat(inputValue) || 0;

  if (type === "from") {
    setFromAmount(inputValue);
    const amountInUSD = amount * fromTokenPrice; // TON miktarını USD'ye çeviriyoruz
    const toCalculatedAmount = amountInUSD / toTokenPrice; // USDT cinsinden değeri hesaplıyoruz
    setToAmount(toCalculatedAmount.toFixed(4));
  } else {
    setToAmount(inputValue);
    const amountInUSD = amount * toTokenPrice; // USDT miktarını USD'ye çeviriyoruz
    const fromCalculatedAmount = amountInUSD / fromTokenPrice; // TON cinsinden değeri hesaplıyoruz
    setFromAmount(fromCalculatedAmount.toFixed(4));
  }
};


  const handleTokenSelect = (token: { name: string; icon: string }) => {
    if (selectedTokenType === "from") {
      setFromToken(token.name);
    } else {
      setToToken(token.name);
    }

    // Tüm girişleri sıfırla
    setFromAmount("");
    setToAmount("");

    setOpenDrawer(false);
  };

  const handleTokenSwapInline2 = () => {
    // Token'lerin yerlerini değiştir
    const tempToken = fromToken;
    setFromToken(toToken);
    setToToken(tempToken);

    // Miktarları sıfırla
    setFromAmount("");
    setToAmount("");
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

  

   // Helper function to format display amount
  const formatDisplayAmount = (amount: number, symbol: string) => {
    if (symbol === "BBLIP" || symbol === "TON" ) {
      return (amount / 1000).toFixed(2);
    }
  
    return amount;
  };

  return (
    <ThemeProvider theme={theme}>
      <Box justifyContent="space-between" alignItems="center" m={2}>
      </Box>
      <Box sx={{ display: "flex", mt: 8, justifyContent: "center", alignItems: "center" }}>
        <Card sx={{ boxShadow: 0, borderRadius: 0, width: "100%" }}>
          <Box display={"flex"} m={1} alignItems={"center"} justifyContent={"space-between"} sx={{ mb: 2 }}>
            <TuneRoundedIcon fontSize="medium" />
            <Typography variant="h6" fontWeight={"bold"}>Swap</Typography>
            <RefreshRoundedIcon fontSize="medium" />
          </Box>

         
            <Grid container spacing={3} alignItems="center">
        <Grid item xs={12}>
          <Card sx={{ padding: 2, display: "flex", flexDirection: "column", gap: 2, boxShadow: 3, border: "1px solid #ddd", borderRadius: 4, mb: 3, backgroundColor: theme.palette.background.default }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, boxShadow: 2, padding: 1, cursor: "pointer", borderRadius: 2, backgroundColor: theme.palette.background.default }} onClick={() => { setSelectedTokenType("from"); setOpenDrawer(true); }}>
                    <Avatar src={tokens.find((t) => t.name === fromToken)?.icon} sx={{ width: 30, height: 30 }} />
                    <Typography variant="body1">{fromToken}</Typography>
                    <UnfoldMoreRoundedIcon fontSize="medium" />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1, ml: 1 }}>
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
                  sx={{ "& .MuiInputBase-input": { padding: 0, textAlign: "right", fontSize: "1.3rem" } }} 
                />
              </Box>
            </Box>
          </Card>
        </Grid>


            {/* Swap Icon Between */}
            <Grid item xs={12} mt={-8} textAlign="center">
              <IconButton color="primary" onClick={handleTokenSwapInline2} sx={{ backgroundColor: "#f5f5f5", border: "2px solid #ddd", borderRadius: "30%", "&:hover": { backgroundColor: "#e0e0e0" } }}>
                <SwapVertRoundedIcon fontSize="small" />
              </IconButton>
            </Grid>

            {/* To Token Section */}
            <Grid item xs={12}>
          <Card sx={{ padding: 2, display: "flex", flexDirection: "column", gap: 2, boxShadow: 4, border: "1px solid #ddd", borderRadius: 4, mb: 3, mt: -5, backgroundColor: theme.palette.background.default }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, cursor: "pointer", padding: 1, boxShadow: 2, borderRadius: 2, backgroundColor: theme.palette.background.default }} onClick={() => { setSelectedTokenType("to"); setOpenDrawer(true); }}>
                    <Avatar src={tokens.find((t) => t.name === toToken)?.icon} sx={{ width: 30, height: 30 }} />
                    <Typography variant="body1">{toToken}</Typography>
                    <UnfoldMoreRoundedIcon fontSize="medium" />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1, ml: 1 }}>
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
                  sx={{ "& .MuiInputBase-input": { padding: 0, textAlign: "right", fontSize: "1.3rem" } }} 
                />
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>

             <Box sx={{ mt: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Your Balances</Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar src={logo5} sx={{ width: 24, height: 24 }} />
<Typography>BBLIP: {formatDisplayAmount(balances.bblip, "BBLIP")}</Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar src="https://s3-symbol-logo.tradingview.com/crypto/XTVCUSDT--big.svg" sx={{ width: 24, height: 24 }} />
                  <Typography>USDT: {balances.usdt.toFixed(2)}</Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar src="https://s3-symbol-logo.tradingview.com/crypto/XTVCTON--big.svg" sx={{ width: 24, height: 24 }} />
                  <Typography>TON: {balances.ton.toFixed(2)}</Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar src="https://example.com/ticket-icon.png" sx={{ width: 24, height: 24 }} />
                  <Typography>TICKET: {balances.ticket.toFixed(2)}</Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>

          {/* Token Selection Drawer */}
 <SwipeableDrawer
            anchor="bottom"
            open={openDrawer}
            onClose={() => setOpenDrawer(false)}
            onOpen={() => setOpenDrawer(true)}
          >            <List>
              {tokens.map((token) => (
                <ListItem button key={token.name} onClick={() => handleTokenSelect(token)}>
                  <Avatar src={token.icon} sx={{ marginRight: 2 }} />
                  <Typography variant="body1">{token.name}</Typography>
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
