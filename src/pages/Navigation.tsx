import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import TaskOutlinedIcon from '@mui/icons-material/TaskOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import QueryStatsOutlinedIcon from '@mui/icons-material/QueryStatsOutlined';
import WalletIcon from '@mui/icons-material/Wallet';
import CalculateOutlinedIcon from '@mui/icons-material/CalculateOutlined';
// import { Box } from '@mui/material';

const navItems = [
  { label: 'HOME', icon: <HomeOutlinedIcon />, path: '/vite-react-router/' },
  { label: 'WALLET', icon: <WalletIcon />, path: '/vite-react-router/farm' },
  { label: 'CalculateOutlinedIcon', icon: <CalculateOutlinedIcon />, path: '/vite-react-router/farm' },

  { label: 'TASKS', icon: <TaskOutlinedIcon />, path: '/vite-react-router/user-details' },
  { label: 'PROFILE', icon: <QueryStatsOutlinedIcon />, path: '/vite-react-router/user-profile-page' },


];

export default function SimpleBottomNavigation() {
  const [value, setValue] = React.useState<number>(0);
  const navigate = useNavigate();

  const handleNavigationChange = (newValue: number) => {
    setValue(newValue);
    navigate(navItems[newValue].path);
  };

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
          pb: 1,
          
          maxWidth: "100%",
        }}
      >
        {navItems.map((item, index) => (
          <BottomNavigationAction
            key={item.label}
            icon={item.icon}
            sx={{
              borderRadius: 2,
              border: value === index ? '2px blue' : '',
              pb: 1,
              color: value === index ? 'white' : '#616161',
              minWidth: 2,
              '& .MuiSvgIcon-root': {
                fontSize: value === index ? '2.2rem' : '2rem', // Change font size based on selection
                color: value === index ? '#436893' : '#9E9E9E',
                
              },
            }}
          />
        ))}
      </BottomNavigation>
    
  );
}