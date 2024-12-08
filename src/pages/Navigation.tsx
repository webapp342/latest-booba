import * as React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import QueryStatsOutlinedIcon from '@mui/icons-material/QueryStatsOutlined';
import WalletIcon from '@mui/icons-material/Wallet';
import CurrencyExchangeOutlinedIcon from '@mui/icons-material/CurrencyExchangeOutlined';
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded';
import { createTheme, ThemeProvider } from "@mui/material/styles";


const navItems = [
  { label: 'HOME', icon: <HomeOutlinedIcon />, path: '/latest-booba/' },
  { label: 'TASKS', icon: <PaymentsRoundedIcon />, path: '/latest-booba/test' },
  { label: 'CALCULATOR', icon: <CurrencyExchangeOutlinedIcon />, path: "/latest-booba/user-profile-page" },
  { label: 'PROFILE', icon: <QueryStatsOutlinedIcon />, path: '/latest-booba/news' },
  { label: 'WALLET', icon: <WalletIcon />, path: '/latest-booba/farm' },
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
      fontFamily: "Montserrat, sans-serif",
    },
  
  });


  const shouldHideBottomNav = location.pathname === '/latest-booba/calculator';
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
              fontSize: '1.5rem', // Sabit ikon boyutu
              color: value === index ? 'black' : '#9E9E9E', // Renk değişimi
            },
            '& .MuiBottomNavigationAction-label': {
              fontSize: '0.7rem', // Sabit label boyutu
              color: value === index ? 'black' : '#9E9E9E', // Label renk değişimi
            },
          }}
        />
      ))}
    </BottomNavigation>
    </ThemeProvider>

  );
}
