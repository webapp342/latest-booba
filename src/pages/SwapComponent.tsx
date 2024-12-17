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
import { useTranslation } from "react-i18next";
import SwapVertRoundedIcon from '@mui/icons-material/SwapVertRounded';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import axios from "axios";
import UnfoldMoreRoundedIcon from '@mui/icons-material/UnfoldMoreRounded';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';


const TokenSwap: React.FC = () => {
  const { t } = useTranslation(); // t fonksiyonu çeviri için kullanılır
    const [fromToken, setFromToken] = useState("ETH");
  const [toToken, setToToken] = useState("USDT");
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [fromTokenPrice, setFromTokenPrice] = useState<number>(0);
  const [toTokenPrice, setToTokenPrice] = useState<number>(1); // USDT price is always 1
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedTokenType, setSelectedTokenType] = useState<"from" | "to">(
    "from"
  );

  const [allTokenPrices, setAllTokenPrices] = useState<any>({});

  const tokens = [
    { name: "ETH", icon: "https://s3-symbol-logo.tradingview.com/crypto/XTVCETH--big.svg" },
    { name: "USDT", icon: "https://s3-symbol-logo.tradingview.com/crypto/XTVCUSDT--big.svg" },
    { name: "BTC", icon: "https://s3-symbol-logo.tradingview.com/crypto/XTVCBTC--big.svg" },
    { name: "SUI", icon: "https://s3-symbol-logo.tradingview.com/crypto/XTVCSUI--big.svg" },
    { name: "SOL", icon: "https://s3-symbol-logo.tradingview.com/crypto/XTVCSOL--big.svg" },
    { name: "TON", icon: "https://s3-symbol-logo.tradingview.com/crypto/XTVCTON--big.svg" },
    { name: "BBLIP", icon: "https://via.placeholder.com/32?text=BBLIP" }, // Sabit fiyat
  ];

  const theme = createTheme({
    typography: {
      fontFamily: "Montserrat, sans-serif",
    },
   
  });

  // Binance API'den fiyatları al
  const fetchTokenPrice = async (token: string) => {
    if (token === "USDT" ) {
      return 1; // USDT fiyatı sabit
    }
    if (token === "BBLIP") return 0.07; // Sabit fiyat BBLIP için

    try {
      const response = await axios.get(`https://api.binance.com/api/v3/ticker/price`, {
        params: { symbol: `${token}USDT` },
      });
      return parseFloat(response.data.price);
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, // Burada tip genişletildi
    type: "from" | "to"
  ) => {
    const inputValue = e.target.value;
  
    // Eğer giriş boşsa, diğer alanı da boş yap
    if (inputValue === "") {
      if (type === "from") {
        setFromAmount("");
        setToAmount("");
      } else {
        setToAmount("");
        setFromAmount("");
      }
      return; // Hesaplama yapılmasını engellemek için buradan çık
    }
  
    const amount = parseFloat(inputValue) || 0;
  
    if (type === "from") {
      setFromAmount(inputValue);
      const amountInUSD = amount * fromTokenPrice;
      const toCalculatedAmount = amountInUSD / toTokenPrice;
      setToAmount(toCalculatedAmount.toFixed(4));
    } else {
      setToAmount(inputValue);
      const amountInUSD = amount * toTokenPrice;
      const fromCalculatedAmount = amountInUSD / fromTokenPrice;
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

  return (
    <ThemeProvider theme={theme}>
        <Box
          justifyContent="space-between"
          alignItems="center"
          m={2}
        >
       

           
        </Box>
      <Box
        sx={{
          display: "flex",
          mt:8,
          justifyContent: "center",
          alignItems: "center",

        }}
      >
        <Card
          sx={{
            boxShadow: 0,
            borderRadius: 0,
            width: "100%",
          }}
        >
          <Box
          display={"flex"}
          m={1}
          alignItems={"center"
          }
          justifyContent={"space-between"}
          sx={{mb: 2,}}>

<TuneRoundedIcon 
 fontSize="medium"  />

<Typography variant="h6"     fontWeight={"bold"}    >
            Swap 
          </Typography>
<RefreshRoundedIcon  fontSize="medium" />


      

          </Box>

          <Grid container spacing={3} alignItems="center">
            {/* From Token Section */}
            <Grid item xs={12}>
  <Card
    sx={{
      padding: 2,
      display: "flex",
      flexDirection: "column", // Yatay içeriğin alt alta yerleşmesini sağlar
      gap: 2,
      boxShadow: 3,
      border: "1px solid #ddd",
      borderRadius: 4,
      mb:3,

      backgroundColor: theme.palette.background.default,
    }}
  >
    {/* Üstteki Box */}
    <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: -1,
            ml: 0.5,
            justifyContent: "space-between",

          }}
    >
      <Typography  variant="caption"
                  color="text.secondary"
                  sx={{
                    fontWeight: 'light',
                    fontFamily: 'Montserrat, sans-serif',
                  }} >
        Sell
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: "primary.main",
          cursor: "pointer", // Tıklanabilir olduğunu belirtmek için
          "&:hover": { textDecoration: "underline" }, // Hover efekti
        }}
        onClick={() => {
          console.log("Max clicked");
          // Max işlemleri buraya
        }}
      >
        Use max
      </Typography>
    </Box>

    {/* To Token Section */}
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        justifyContent: "space-between",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          boxShadow: 2,
          padding: 1,

          cursor: "pointer",
          borderRadius: 2,
          backgroundColor: theme.palette.background.default,
        }}
        onClick={() => {
          setSelectedTokenType("from");
          setOpenDrawer(true);
        }}
      >
        <Avatar
          src={tokens.find((t) => t.name === fromToken)?.icon}
          sx={{
            width: 30,
            height: 30,
          }}
        />
        <Typography variant="body1">{fromToken}</Typography>
        <UnfoldMoreRoundedIcon  fontSize="medium" />

      </Box>

      <TextField
  value={fromAmount}
  onChange={(e) => handleAmountChange(e, "from")}
  fullWidth
  placeholder="0.0" // Boşken gösterilecek metin
  variant="standard"
  InputProps={{
    disableUnderline: true,
  }}
  inputProps={{
    type: "text", // 'text' kullanarak geniş tarayıcı desteği sağlanır
    inputMode: "decimal", // Mobil cihazlarda ondalık sayı klavyesini açar
    pattern: "[0-9]*", // Sadece sayısal girişlere izin verir
  }}
  sx={{
    "& .MuiInputBase-input": {
      padding: 0,
      textAlign: "right",
      fontSize: "1.3rem",
    },
  }}
/>


    </Box>
  </Card>
</Grid>

            {/* Swap Icon Between */}
            <Grid   item xs={12} mt={-8} textAlign="center">
              <IconButton 
                color="primary"
                onClick={handleTokenSwapInline2}
                sx={{
                  backgroundColor: "#f5f5f5",
                  border: "2px solid #ddd",
                  borderRadius: "30%",
                  "&:hover": { backgroundColor: "#e0e0e0" },
                }}
              >
                <SwapVertRoundedIcon fontSize="small" />
              </IconButton>
            </Grid>

            {/* To Token Section */}
            <Grid item xs={12}>
  <Card
     sx={{
      padding: 2,
      display: "flex",
      flexDirection: "column", // Yatay içeriğin alt alta yerleşmesini sağlar
      gap: 2, 
      boxShadow: 4,
      border: "1px solid #ddd",
      borderRadius: 4,
      mb:3,
      mt: -5,
      backgroundColor: theme.palette.background.default,
    }}
  >
    {/* Üstteki Box */}
    <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: -1,
            ml: 0.5,
            justifyContent: "space-between",

          }}
    >
      <Typography  variant="caption"
                  color="text.secondary"
                  sx={{
                    fontWeight: 'light',
                    fontFamily: 'Montserrat, sans-serif',
                  }}>
        Buy
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: "primary.main",
          cursor: "pointer", // Tıklanabilir olduğunu belirtmek için
          "&:hover": { textDecoration: "underline" }, // Hover efekti
        }}
        onClick={() => {
          console.log("Max clicked");
          // Max işlemleri buraya
        }}
      >
       Use max
      </Typography>
    </Box>

    {/* To Token Section */}
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        justifyContent: "space-between",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          cursor: "pointer",
          padding: 1,
          boxShadow: 2,
          borderRadius: 2,
          backgroundColor: theme.palette.background.default,
        }}
        onClick={() => {
          setSelectedTokenType("to");
          setOpenDrawer(true);
        }}
      >
        <Avatar
          src={tokens.find((t) => t.name === toToken)?.icon}
          sx={{
            width: 30,
            height: 30,
          }}
        />
        <Typography variant="body1">{toToken}</Typography>
        <UnfoldMoreRoundedIcon  fontSize="medium" />


      </Box>
      <TextField
  value={toAmount}
  placeholder="0.0" // Boşken gösterilecek metin
  onChange={(e) => handleAmountChange(e, "to")}
  fullWidth
  variant="standard"
  InputProps={{
    disableUnderline: true,
  }}
  inputProps={{
    type: "text", // 'text' tipi, özelleştirilebilir
    inputMode: "numeric", // Sayısal klavye açılması için
    pattern: "[0-9]*", // Sadece sayısal giriş için
  }}
  sx={{
    "& .MuiInputBase-input": {
      padding: 0,
      textAlign: "right",
      fontSize: "1.3rem",
    },
  }}
/>


    </Box>
  </Card>
</Grid>

          </Grid>

          {/* Swipeable Drawer with Token List */}
          <SwipeableDrawer
            anchor="bottom"
            open={openDrawer}
            onClose={() => setOpenDrawer(false)}
            onOpen={() => setOpenDrawer(true)}
          >
            <Box sx={{ width: "100%", maxWidth: 400 }}>
              <List>
                {tokens.map((token) => (
                  <ListItem
                    button
                    key={token.name}
                    onClick={() => handleTokenSelect(token)}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingY: 1.5,
                      paddingX: 2,
                      backgroundColor: "#f9f9f9",
                      "&:hover": {
                        backgroundColor: "#f0f0f0",
                      },
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Avatar
                        src={token.icon}
                        sx={{ width: 32, height: 32 }}
                      />
                      <Typography variant="body1">{token.name}</Typography>
                    </Box>
                    <Typography variant="body2" color="textSecondary">
                      ${allTokenPrices[token.name]?.toFixed(2)}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </Box>
          </SwipeableDrawer>
        </Card>
      </Box>
    </ThemeProvider>
  );
};

export default TokenSwap;
