import * as React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import SportsEsportsTwoToneIcon from '@mui/icons-material/SportsEsportsTwoTone';
import AccountBalanceWalletTwoToneIcon from '@mui/icons-material/AccountBalanceWalletTwoTone';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import AnalyticsTwoToneIcon from '@mui/icons-material/AnalyticsTwoTone';
import AssistantTwoToneIcon from '@mui/icons-material/AssistantTwoTone';
import InventoryTwoToneIcon from '@mui/icons-material/InventoryTwoTone';
import { Paper } from '@mui/material';

const navItems = [
  { label: 'Games', icon: <SportsEsportsTwoToneIcon />, path: '/latest-booba/games' },
  { label: 'Earn', icon: <AssistantTwoToneIcon />, path: '/latest-booba/stake' },
  { label: 'Stats', icon: <AnalyticsTwoToneIcon />, path: '/latest-booba/' },
  { label: 'Tasks', icon: <InventoryTwoToneIcon />, path: '/latest-booba/tasks' },
  { label: 'Wallet', icon: <AccountBalanceWalletTwoToneIcon />, path: '/latest-booba/spin' },
];

export default function SimpleBottomNavigation() {
  const [value, setValue] = React.useState<number>(0);
  const navigate = useNavigate();
  const location = useLocation();

 

  // ✅ Seçili sekmeyi güncelle
  React.useEffect(() => {
    const currentIndex = navItems.findIndex((item) => location.pathname === item.path);
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
        main: '#00c6ff',
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
        elevation={1}
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          borderTopLeftRadius: '55px',
          borderTopRightRadius: '16px',
        }}
      >
        <BottomNavigation
          value={value}
          onChange={(_, newValue) => handleNavigationChange(newValue)}
          showLabels
          sx={{
            height: '65px',
            bgcolor: '#1e2625',
            boxShadow:5,
            transition: 'none',
            '& .MuiBottomNavigationAction-root': {
              minWidth: 'auto',
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
              sx={{
                '& .MuiSvgIcon-root': {
                  mt: 2,
                  fontSize: '1.5rem',
                  color: value === index ? 'linear-gradient(45deg, #00c6ff, #0072ff)' : '#757575',
                  transition: 'none',
                },
                '& .MuiBottomNavigationAction-label': {
                  fontSize: '0.8rem',
                  mb: 4,
                  fontWeight: value === index ? 400 : 400,
                  color: value === index ? 'linear-gradient(45deg, #00c6ff, #0072ff)' : '#757575',
                  transition: 'none',
                },
              }}
            />
          ))}
        </BottomNavigation>
      </Paper>
    </ThemeProvider>
  );
}
