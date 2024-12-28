import * as React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import SportsEsportsTwoToneIcon from '@mui/icons-material/SportsEsportsTwoTone';
import AccountBalanceWalletTwoToneIcon from '@mui/icons-material/AccountBalanceWalletTwoTone';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import EmojiEventsTwoToneIcon from '@mui/icons-material/EmojiEventsTwoTone';
import "../index.css"; // Global stil dosyasını import edin

import InventoryTwoToneIcon from '@mui/icons-material/InventoryTwoTone';
import PeopleOutlineTwoToneIcon from '@mui/icons-material/PeopleOutlineTwoTone';


const navItems = [
  { label: 'Game', icon: <SportsEsportsTwoToneIcon />, path: '/latest-booba/slot' },
  { label: 'Frens', icon: <PeopleOutlineTwoToneIcon />, path: '/latest-booba/test' },
  { label: 'Top', icon: <EmojiEventsTwoToneIcon />, path: '/latest-booba/' },

  { label: 'Tasks', icon: <InventoryTwoToneIcon  />, path: '/latest-booba/tasks' },
      { label: 'Wallet', icon: <AccountBalanceWalletTwoToneIcon />, path: '/latest-booba/spin' },

];

export default function SimpleBottomNavigation() {
  const [value, setValue] = React.useState<number>(0);
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    const currentIndex = navItems.findIndex((item) => item.path === location.pathname);
    if (currentIndex !== -1) {
      setValue(currentIndex);
    }
  }, [location.pathname]);

  const handleNavigationChange = (newValue: number) => {
    setValue(newValue);
    navigate(navItems[newValue].path);
  };

  const theme = createTheme({
    typography: {
      fontFamily: "monospace",
    },
  
  });


  const shouldHideBottomNav = location.pathname === '/latest-booba/spin';
  if (shouldHideBottomNav) {
    return null;
  }

  return (
    <ThemeProvider theme={theme}>

<BottomNavigation
  value={value}
  onChange={(_, newValue) => handleNavigationChange(newValue)}
  showLabels
  className="bottom-navigation"
  sx={{
    bgcolor: '#ffffff',
    px: 4,
    pt: 1,
    pb: 2,
    maxWidth: '100%',
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)", // Hafif gölge

    borderTop: '1px solid #E0E0E0', // Gri ince top border
  }}
>

      {navItems.map((item, index) => (
      <BottomNavigationAction
      key={item.label}
      icon={item.icon}
      label={item.label}
      sx={{
        borderRadius: 2,
        pb: 1,
        color: value === index ? 'black' : '#616161',
        '& .MuiSvgIcon-root': {
          fontSize: '1.2rem', // Sabit ikon boyutu
          color: value === index ? 'black' : '#9E9E9E', // Renk değişimi
        },
        '& .MuiBottomNavigationAction-label': {
          fontSize: '0.7rem', // Sabit label boyutu
          fontWeight: 500, // Varsayılan font ağırlığı
          transition: 'none', // Animasyonu iptal eder
          color: value === index ? 'black' : '#9E9E9E', // Label renk değişimi
        },
        '&.Mui-selected .MuiBottomNavigationAction-label': {
          fontSize: '0.7rem', // Seçili olan için sabit boyut
          fontWeight: 500, // Aynı font ağırlığı
        },
      }}
    />
    
      ))}
    </BottomNavigation>
    </ThemeProvider>

  );
}
