import React, { useState } from 'react';
import { AppBar, Tabs, Tab } from '@mui/material';

const FakeTab: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('ticket'); // Seçilen tab'ı takip etmek için state

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: string) => {
    setSelectedTab(newValue); // Tab değiştikçe state güncelleniyor
  };

  return (
    <AppBar position="static" color="default" sx={{ width: '125%', maxWidth: 500, borderRadius: 2, mt: 2 }}>
      <Tabs
        value={selectedTab}
        onChange={handleTabChange} // Tab değişimini yönetiyoruz
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
        aria-label="spin type tabs"
        sx={{
            '& .MuiTabs-indicator': {
        backgroundColor: 'black', // Burada yeşil renk veriyoruz
      },
          '& .MuiTab-root': {
            fontSize: "0.8rem",

            
          },
          '& .MuiTab-root.Mui-selected': {
            color: 'black', // Seçili tab için yazı rengi
            fontSize: "1.2rem",
            
          },
        }}
      >
        <Tab label="0.2" value="ticket" />
        <Tab label="1" value="total" />
        <Tab label="5" value="bblip" />
      </Tabs>
    </AppBar>
  );
};

export default FakeTab;
