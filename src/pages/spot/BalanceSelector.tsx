import React from 'react';
import { Tabs, Tab, Box} from '@mui/material';
import { createTheme, ThemeProvider } from "@mui/material/styles";



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
 
          
          mb:2,
        alignItems: 'center',
        color: 'black',
      }}
    >
   





      {/* Sekmeler */}
      <Tabs
        value={selectedBalance}
        onChange={onChange}
        centered
        TabIndicatorProps={{
          style: { display: 'none' }, // Varsayılan göstergeyi gizle
        }}
        sx={{
          '& .MuiTab-root': {
            backgroundColor: 'transparent',
            color: 'white',
            transition: 'all 0.3s',
            padding: '12px 50px',
            fontWeight: 'bold',
            border: '2px dotted #FFC107 ',
          },
          '& .MuiTab-root.Mui-selected': {
            backgroundColor: '#6f0101',
            color: '#FFC107',
          },
          '& .MuiTab-root:first-of-type': {
            borderTopLeftRadius: '16px',
            borderBottomLeftRadius: '16px',
          },
          '& .MuiTab-root:last-of-type': {
            borderTopRightRadius: '16px',
            borderBottomRightRadius: '16px',
          },
        }}
      >
        <Tab value="total" label="Ton" />
        <Tab value="bblip" label="Bblip" />
      </Tabs>
    </Box>
    </ThemeProvider>

  );
};

export default BalanceSelector;
