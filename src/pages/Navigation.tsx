import * as React from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // useLocation'u import ediyoruz
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import QueryStatsOutlinedIcon from '@mui/icons-material/QueryStatsOutlined';
import WalletIcon from '@mui/icons-material/Wallet';
import CurrencyExchangeOutlinedIcon from '@mui/icons-material/CurrencyExchangeOutlined';
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded';


const navItems = [
  { label: 'HOME', icon: <HomeOutlinedIcon />, path: '/latest-booba/' },
  { label: 'TASKS', icon: <PaymentsRoundedIcon />, path: '/latest-booba/user-details' },

  { label: 'CALCULATOR', icon: <CurrencyExchangeOutlinedIcon />,         path: "/latest-booba/user-profile-page",
  },


  { label: 'PROFILE', icon: <QueryStatsOutlinedIcon />, path: '/latest-booba/news' },

  { label: 'WALLET', icon: <WalletIcon />, path: '/latest-booba/farm' },
];

export default function SimpleBottomNavigation() {
  const [value, setValue] = React.useState<number>(0);
  const navigate = useNavigate();
  const location = useLocation(); // useLocation ile mevcut path'i alıyoruz

  // Yol değiştiğinde value'yu güncelle
  React.useEffect(() => {
    const currentIndex = navItems.findIndex((item) => item.path === location.pathname);
    if (currentIndex !== -1) {
      setValue(currentIndex);
    }
  }, [location.pathname]); // location.pathname değiştiğinde çalışır

  const handleNavigationChange = (newValue: number) => {
    setValue(newValue); // Yeni değeri ayarla
    navigate(navItems[newValue].path); // Yeni path'e git
  };

  // Sadece /vite-react-router/calculator sayfasında gizlemek için kontrol
  const shouldHideBottomNav = location.pathname === '/latest-booba/calculator';

  // Eğer gizlenecekse null döndür
  if (shouldHideBottomNav) {
    return null;
  }

  return (
    <BottomNavigation
      value={value}
      onChange={(_, newValue) => handleNavigationChange(newValue)}
      showLabels
      className="bottom-navigation"
      sx={{
        gap: 5,
        bgcolor: '#f6f5f0',
        px: 4,
        pt: 1,
        pb: 2,
        maxWidth: '100%',
      }}
    >
      {navItems.map((item, index) => (
        <BottomNavigationAction
          key={item.label}
          icon={
            <div style={{ position: 'relative' }}>
              {value === index && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: -5,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 30,
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: '#436893',
                  }}
                />
              )}
              {item.icon}
            </div>
          }
          sx={{
            borderRadius: 2,
            pb: 1,
            color: value === index ? 'white' : '#616161',
            minWidth: 2,
            '& .MuiSvgIcon-root': {
              fontSize: value === index ? '2.2rem' : '2rem',
              color: value === index ? '#436893' : '#9E9E9E',
            },
          }}
        />
      ))}
    </BottomNavigation>
  );
}
