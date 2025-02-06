import React from 'react';
import { Tabs, Tab, Box, Typography } from '@mui/material';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import boobaLogo from '../../assets/booba-logo.png';
import tonLogo from '../../assets/ton_symbol.png';

interface BalanceSelectorProps {
  selectedBalance: string;
  onChange: (event: React.SyntheticEvent, value: string) => void;
}

const theme = createTheme({
  typography: {
    fontFamily: "monospace",
  },
});

const BalanceSelector: React.FC<BalanceSelectorProps> = ({ selectedBalance, onChange }) => {
  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          mb: 1,
          alignItems: 'center',
        }}
      >
        <Tabs
          value={selectedBalance}
          onChange={onChange}
          centered
          TabIndicatorProps={{
            style: { display: 'none' },
          }}
          sx={{
            minHeight: '40px',
            '& .MuiTabs-flexContainer': {
              gap: '8px',
            },
            '& .MuiTab-root': {
              minHeight: '40px',
              padding: '6px 16px',
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '0.85rem',
              fontWeight: 'bold',
              background: 'linear-gradient(145deg, rgba(26,31,46,0.8) 0%, rgba(13,15,23,0.8) 100%)',
              border: '1px solid rgba(255, 215, 0, 0.3)',
              borderRadius: '8px',
              transition: 'all 0.2s ease',
              '&.Mui-selected': {
                color: '#FFD700',
                background: 'linear-gradient(145deg, rgba(26,31,46,1) 0%, rgba(13,15,23,1) 100%)',
                border: '1px solid #FFD700',
              },
            },
          }}
        >
          <Tab 
            value="total" 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <img
                  src={tonLogo}
                  alt="TON Logo"
                  style={{ width: '16px', height: '16px' }}
                />
                <Typography sx={{ fontSize: 'inherit', fontWeight: 'inherit' }}>
                  TON
                </Typography>
              </Box>
            } 
          />
          <Tab 
            value="bblip" 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <img
                  src={boobaLogo}
                  alt="BBLIP Logo"
                  style={{ width: '16px', height: '16px', borderRadius: '50%' }}
                />
                <Typography sx={{ fontSize: 'inherit', fontWeight: 'inherit' }}>
                  BBLIP
                </Typography>
              </Box>
            } 
          />
        </Tabs>
      </Box>
    </ThemeProvider>
  );
};

export default BalanceSelector;
