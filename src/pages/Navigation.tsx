import * as React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import SportsEsportsTwoToneIcon from '@mui/icons-material/SportsEsportsTwoTone';
import AccountBalanceWalletTwoToneIcon from '@mui/icons-material/AccountBalanceWalletTwoTone';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import EmojiEventsTwoToneIcon from '@mui/icons-material/EmojiEventsTwoTone';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import InventoryTwoToneIcon from '@mui/icons-material/InventoryTwoTone';
import { Paper } from '@mui/material';

const navItems = [
  { label: 'Games', icon: <SportsEsportsTwoToneIcon />, path: '/latest-booba/games' },
  { label: 'Sports', icon: <SportsSoccerIcon />, path: '/latest-booba/matches' },
  { label: 'Top', icon: <EmojiEventsTwoToneIcon />, path: '/latest-booba/' },
  { label: 'Tasks', icon: <InventoryTwoToneIcon />, path: '/latest-booba/tasks' },
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
      fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
    },
    palette: {
      primary: {
        main: '#1976d2',
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
        elevation={8}
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
        }}
      >
        <BottomNavigation
          value={value}
          onChange={(_, newValue) => handleNavigationChange(newValue)}
          showLabels
          sx={{
            height: '60px',
            bgcolor: '#ffffff',
            borderTopLeftRadius: '16px',
            borderTopRightRadius: '16px',
            '& .MuiBottomNavigationAction-root': {
              minWidth: 'auto',
              padding: '0',
              '&.Mui-selected': {
                padding: '0',
              },
            },
          }}
        >
          {navItems.map((item, index) => (
            <BottomNavigationAction
              key={item.label}
              icon={item.icon}
              label={item.label}
              sx={{
                '& .MuiSvgIcon-root': {
                  fontSize: '22px',
                  transition: 'all 0.2s ease',
                  color: value === index ? 'primary.main' : '#757575',
                  mb: 0.5,
                },
                '& .MuiBottomNavigationAction-label': {
                  fontSize: '0.7rem',
                  transition: 'all 0.2s ease',
                  fontWeight: value === index ? 600 : 400,
                  color: value === index ? 'primary.main' : '#757575',
                },
                '&.Mui-selected': {
                  '& .MuiSvgIcon-root': {
                    transform: 'scale(1.1)',
                  },
                },
              }}
            />
          ))}
        </BottomNavigation>
      </Paper>
    </ThemeProvider>
  );
}
