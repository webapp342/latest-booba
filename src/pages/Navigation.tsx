import * as React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import CasinoIcon from '@mui/icons-material/Casino';
import WalletIcon from '@mui/icons-material/Wallet';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import AnalyticsIcon from '@mui/icons-material/Analytics';
import PaymentsIcon from '@mui/icons-material/Payments';
import ChecklistRtlIcon from '@mui/icons-material/ChecklistRtl';
import { Paper } from '@mui/material';

const navItems = [
  { label: 'Play', icon: <CasinoIcon />, path: '/latest-booba/games' },
  { label: 'Invest', icon: <PaymentsIcon />, path: '/latest-booba/stake' },
  { label: 'Stats', icon: <AnalyticsIcon />, path: '/latest-booba/' },
  { label: 'Tasks', icon: <ChecklistRtlIcon />, path: '/latest-booba/tasks' },
  { label: 'Wallet', icon: <WalletIcon />, path: '/latest-booba/spin' },
];

export default function SimpleBottomNavigation() {
  const [value, setValue] = React.useState<number>(0);
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    const currentIndex = navItems.findIndex((item) => location.pathname === item.path);
    if (currentIndex !== -1) {
      setValue(currentIndex);
    }
  }, [location.pathname]);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      mainContent.scrollTop = 0;
    }
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    window.scrollTo(0, 0);
    
    // Use setTimeout to ensure scroll happens before navigation
    setTimeout(() => {
      navigate(navItems[newValue].path);
    }, 0);
  };

  const theme = createTheme({
    typography: {
      fontFamily:'Montserrat',
    },
    palette: {
      primary: {
        main: '#6ed3ff',
      },
    },
  });

  const shouldHideBottomNav = location.pathname === '/latest-booba/spin';
  if (shouldHideBottomNav) {
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      <Paper 
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          borderTopLeftRadius: 4,
          borderTopRightRadius: 4,
        }}
      >
        <BottomNavigation
          value={value}
          onChange={handleChange}
          showLabels
          sx={{
            height: '75px',
            bgcolor: '#2f363a',
            transition: 'none',
            '& .MuiBottomNavigationAction-root': {
              padding: '0',
              transition: 'none',
              '&.Mui-selected': {
                padding: '0',
                transition: 'none',
              },
            },
          }}
        >
          {navItems.map((item, index) => (
            <BottomNavigationAction
              key={item.label}
              icon={item.icon}
              label={item.label}
              value={index}
              sx={{
                '& .MuiSvgIcon-root': {
                  mt: 2,
                  fontSize: '1.2rem',
                  color: value === index ? 'linear-gradient(45deg, #00c6ff, #0072ff)' : '#757575',
                  transition: 'none',
                },
                '& .MuiBottomNavigationAction-label': {
                  fontSize: '0.6rem',
                  mb: 4,
                  color: value === index ? 'linear-gradient(45deg, #00c6ff, #0072ff)' : '#757575',
                  transition: 'none',
                  textTransform:'none',
                },
              }}
            />
          ))}
        </BottomNavigation>
      </Paper>
    </ThemeProvider>
  );
}
