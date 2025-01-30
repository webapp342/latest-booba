import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import { Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';

const navItems = [
  { label: 'Play', path: '/latest-booba/games' },
  { label: 'Invest', path: '/latest-booba/stake' },
  { label: 'Stats', path: '/latest-booba/' },
  { label: 'Tasks', path: '/latest-booba/tasks' },
  { label: 'Wallet', path: '/latest-booba/spin' },
];

function Brand() {
  const location = useLocation();
  
  // Get current route's label
  const currentLabel = navItems.find(item => item.path === location.pathname)?.label || 'Stats';

  return (
    <AppBar sx={{minHeight:"10vh", backgroundColor: '#1a2126',border:"none",boxShadow:'none' }}>
      <Box alignItems={"center"} sx={{backgroundColor: '#1a2126' }}>
        <Box
          top="50%"
          left="40%"
          width="250px"
          height="10vh"
          borderRadius="40%"
          sx={{
            background: 'radial-gradient(circle, rgba(159,223,255,0.5) 0%, rgba(0,198,255,0) 70%)',
            transform: 'translate(60%, 90%)',
            filter: 'blur(40px)',
          }}
        />
        <Typography 
          variant="h1"
          sx={{
            textAlign: "center",
            mt: "-3vh",
            fontFamily: "monospace",
            fontWeight: 700,
            fontSize: "1.4rem",
            letterSpacing: "1px",
          }}
        >
          {currentLabel}
        </Typography>
      </Box>
    </AppBar>
  );
}

export default Brand;
