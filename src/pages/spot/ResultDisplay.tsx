import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { createTheme, ThemeProvider } from "@mui/material/styles";


const theme = createTheme({
  typography: {
    fontFamily: "Montserrat, sans-serif",
  },

});

interface ResultDisplayProps {
  total: number;
  bblip: number;
  tickets: number;
}

// Sayıyı 6 haneli formatta (000.000) göstermek için fonksiyon
const formatAmount = (amount: number) => {
  const paddedAmount = amount.toString().padStart(6, '0'); // En az 6 haneli yapmak için başına sıfır ekler
  const integerPart = paddedAmount.slice(0, 3); // İlk 3 haneli kısmı alır
  const decimalPart = paddedAmount.slice(3); // Sonraki 3 haneli kısmı alır
  return `${parseInt(integerPart, 10)}.${decimalPart}`; // Tam sayı kısmındaki sıfırları kaldırır
};

interface AmountStyle {
  [key: string]: React.CSSProperties;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ total, bblip, tickets }) => {
  const [open, setOpen] = useState(false);
  const [prevTotal, setPrevTotal] = useState(total);
  const [prevBblip, setPrevBblip] = useState(bblip);
  const [prevTickets, setPrevTickets] = useState(tickets);
  const [amountStyle, setAmountStyle] = useState<AmountStyle>({
    total: {},
    bblip: {},
    tickets: {},
  });

  const data = [
    {
      logo: 'https://cryptologos.cc/logos/toncoin-ton-logo.png?v=040',
      value: formatAmount(total),
      label: '$TON',
    },
    {
      logo: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=040',
      value: formatAmount(bblip),
      label: '$BBLIP',
    },
    {
      logo: 'https://cryptologos.cc/logos/autonio-niox-logo.png?v=040',
      value: tickets.toString(),
      label: 'Tickets',
    },
  ];

  useEffect(() => {
    if (total > prevTotal) {
      setAmountStyle((prevState) => ({
        ...prevState,
        total: { color: 'green' },
      }));
      setTimeout(() => setAmountStyle((prevState) => ({ ...prevState, total: {} })), 300);
    } else if (total < prevTotal) {
      setAmountStyle((prevState) => ({
        ...prevState,
        total: { color: 'red' },
      }));
      setTimeout(() => setAmountStyle((prevState) => ({ ...prevState, total: {} })), 300);
    }
    setPrevTotal(total);

    if (bblip > prevBblip) {
      setAmountStyle((prevState) => ({
        ...prevState,
        bblip: { color: 'green' },
      }));
      setTimeout(() => setAmountStyle((prevState) => ({ ...prevState, bblip: {} })), 300);
    } else if (bblip < prevBblip) {
      setAmountStyle((prevState) => ({
        ...prevState,
        bblip: { color: 'red' },
      }));
      setTimeout(() => setAmountStyle((prevState) => ({ ...prevState, bblip: {} })), 300);
    }
    setPrevBblip(bblip);

    if (tickets > prevTickets) {
      setAmountStyle((prevState) => ({
        ...prevState,
        tickets: { color: 'green' },
      }));
      setTimeout(() => setAmountStyle((prevState) => ({ ...prevState, tickets: {} })), 300);
    } else if (tickets < prevTickets) {
      setAmountStyle((prevState) => ({
        ...prevState,
        tickets: { color: 'red' },
      }));
      setTimeout(() => setAmountStyle((prevState) => ({ ...prevState, tickets: {} })), 300);
    }
    setPrevTickets(tickets);
  }, [total, bblip, tickets, prevTotal, prevBblip, prevTickets]);

  const handleToggle = () => {
    setOpen(!open);
  };

  return (
    <ThemeProvider theme={theme}>

    <Box
      sx={{
    
        margin: '0 ',
        padding: 0.5,
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)', // Hafif gölge
        backgroundColor: 'whitesmoke',
        border: '1px solid #e0e0e0',
        borderRadius: 1,
        textAlign: 'center',
        cursor: 'pointer',
      
      }}
    >
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item xs={8} sx={{ display: 'flex', alignItems: 'center' }}>
          <Box
            component="img"
            src={data[0].logo}
            alt={data[0].label}
            sx={{ width: 20, height: 20, objectFit: 'contain', marginRight: '8px' }}
          />
          <Typography
            variant="body2"
            sx={{
              fontWeight: 'bold',
              color: '#000',
              marginRight: '8px',
            }}
          >
            {data[0].label}
          </Typography>
        </Grid>

        <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 'bold',
              color: '#000',
              ...amountStyle.total,
            }}
          >
            {data[0].value}
          </Typography>
          <IconButton
            onClick={handleToggle}
            sx={{
              marginLeft: 2,
              padding: 0,
            }}
          >
            <ExpandMoreIcon />
          </IconButton>
        </Grid>
      </Grid>

      {open && (
        <Box
          sx={{
            mt: 2,
            borderRadius: 2,
          }}
        >
          <Grid container spacing={1} sx={{ marginTop: 0 }}>
            {data.map((item, index) => (
              <Grid item xs={12} key={index}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px',
                    border: '1px solid #e0e0e0',
                    borderRadius: 2,
                    backgroundColor: '#fff',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Box
                      component="img"
                      src={item.logo}
                      alt={item.label}
                      sx={{ width: 24, height: 24, objectFit: 'contain', marginRight: '8px' }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 'bold',
                        color: '#000',
                      }}
                    >
                      {item.label}
                    </Typography>
                  </Box>

                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 'bold',
                      color: '#000',
                      ...amountStyle[item.label.toLowerCase()],
                    }}
                  >
                    {item.value}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
    
        </Box>
        
      )}
      
    </Box>
    </ThemeProvider>

  );
};

export default ResultDisplay;
