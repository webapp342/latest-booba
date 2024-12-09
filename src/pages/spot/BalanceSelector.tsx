import React from 'react';
import { Tabs, Tab, Box, Typography } from '@mui/material';
import { styles } from './styles';

interface BalanceSelectorProps {
  selectedBalance: string;
  onChange: (event: React.ChangeEvent<{}>, value: string) => void;
}

const BalanceSelector: React.FC<BalanceSelectorProps> = ({ selectedBalance, onChange }) => {
  return (
    <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginTop: '20px',
      color: 'black',
    }}
  >
    <h4>
        Earn in
    </h4>
      <Tabs
        value={selectedBalance}
        onChange={onChange}
        indicatorColor="primary"
        textColor="primary"
        centered
        TabIndicatorProps={{
          style: {
            display: 'none', // Varsayılan göstergesi devre dışı bırakıldı
            
          },
        }}
        sx={{
          '& .MuiTab-root': {
            backgroundColor: 'transparent', // Varsayılan arka plan
            color: 'black', // Varsayılan yazı rengi
            transition: 'all 0.3s',
            padding: '25px 50px',
            fontWeight: "bold",
            border: '2px solid #e0e0e0',

          },
          '& .MuiTab-root.Mui-selected': {
            backgroundColor: 'black', // Seçili arka plan
            color: 'white', // Seçili yazı rengi
          },
          '& .MuiTab-root:first-of-type': {
            borderTopLeftRadius: '16px', // TON Lottery sekmesinin sol üst köşe yuvarlama
            borderBottomLeftRadius: '16px', // BBLIP Lottery sekmesinin sol alt köşe yuvarlama
          },
          '& .MuiTab-root:last-of-type': {
            borderTopRightRadius: '16px', // BBLIP Lottery sekmesinin sol alt köşe yuvarlama
            borderBottomRightRadius: '16px', // BBLIP Lottery sekmesinin sağ alt köşe yuvarlama
          },
        }}
      >
        <Tab value="total" label="Ton" />
        <Tab value="bblip" label="Bblip" />
      </Tabs>
      </div>
  );
};

export default BalanceSelector;
