import React, { useState } from 'react';
import { Box, Typography, Grid, IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface ResultDisplayProps {
  total: number;
  bblip: number;
  tickets: number;
}

// Sayıyı 6 haneli formatta (000.000) göstermek için fonksiyon
const formatNumber = (num: number) => {
  const numString = num.toString().padStart(6, '0');
  return numString.slice(0, 3) + '.' + numString.slice(3);
};

const ResultDisplay: React.FC<ResultDisplayProps> = ({ total, bblip, tickets }) => {
  const [open, setOpen] = useState(false); // Menü için durum

  const data = [
    {
      logo: 'https://cryptologos.cc/logos/toncoin-ton-logo.png?v=040',
      value: formatNumber(total),
      label: '$TON',
    },
    {
      logo: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=040',
      value: formatNumber(bblip),
      label: '$BBLIP',
    },
    {
      logo: 'https://cryptologos.cc/logos/autonio-niox-logo.png?v=040',
      value: tickets.toString(),
      label: 'Tickets',
    },
  ];

  // Menü açma kapama
  const handleToggle = () => {
    setOpen(!open);
  };

  return (
    <Box
      sx={{
        width: '100%', // %95 genişlik
        margin: '0 ',
        padding: '16px',
        border: '1px solid #e0e0e0',
        borderRadius: 3,
        textAlign: 'center',
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: '#f5f5f5',
        },
        transition: 'background-color 0.3s',
      }}
    >
      <Grid container alignItems="center" justifyContent="space-between">
        {/* Logo ve Metin Sol Tarafta */}
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

        {/* Sayı ve İkon Sağ Tarafta */}
        <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 'bold',
              color: '#000',
            }}
          >
            {data[0].value}
          </Typography>
          {/* Expand İkonu */}
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

      {/* Menü */}
      {open && (
        <Box
          sx={{
            mt: 2,
            borderRadius: 2,
          }}
        >
      

          {/* Tüm verileri burada gösteriyoruz */}
          <Grid container spacing={1} sx={{ marginTop: 0 }}>
            {data.map((item, index) => (
              <Grid item xs={12} key={index}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between', // Soldaki öğeler ile sağdaki öğeleri ayırıyoruz
                    padding: '8px',
                    border: '1px solid #e0e0e0',
                    borderRadius: 2,
                    backgroundColor: '#fff',
                  }}
                >
                  {/* Sol taraf: Logo ve Label */}
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

                  {/* Sağ taraf: Miktar */}
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 'bold',
                      color: '#000',
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
  );
};

export default ResultDisplay;
