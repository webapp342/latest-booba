import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import { Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';

const navItems = [
  { label: 'Boxes', path: '/latest-booba/mystery-box' },
    { label: 'Games', path: '/latest-booba/games' },

  { label: 'Invest', path: '/latest-booba/stake' },
  { label: 'Stats', path: '/latest-booba/' },
  { label: 'Tasks', path: '/latest-booba/tasks' },
  { label: 'Wallet', path: '/latest-booba/spin' }, 
    { label: '999x Crash', path: '/latest-booba/slot' }, 

];

function Brand() {
  const location = useLocation();
  
  // Get current route's label
  const currentLabel = navItems.find(item => item.path === location.pathname)?.label || 'Stats';

  return (
    <AppBar sx={{
      backgroundColor: '#1a2126',
      border: "none",
      boxShadow: 'none',
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        bottom: '30%',
        left: '50%',
        width: '300px',
        height: '15vh',
        background: 'radial-gradient(circle, rgba(159,223,255,0.5) 0%, rgba(0,198,255,0) 70%)',
        filter: 'blur(40px)',
        animation: 'mainGlow 8s ease-in-out infinite',
        pointerEvents: 'none'
      },
      '&::after': {
        content: '""',
        position: 'absolute',
        top: '40%',
        left: '30%',
        width: '200px',
        height: '200px',
        background: 'radial-gradient(circle, rgba(116,235,213,0.3) 0%, rgba(0,198,255,0) 70%)',
        filter: 'blur(35px)',
        animation: 'secondaryGlow 6s ease-in-out infinite',
        pointerEvents: 'none'
      },
      '@keyframes mainGlow': {
        '0%, 100%': {
          opacity: 0.7,
          transform: 'translate(-10%, 90%) scale(1) rotate(0deg)'
        },
        '25%': {
          opacity: 0.9,
          transform: 'translate(-20%, 85%) scale(1.2) rotate(-5deg)'
        },
        '50%': {
          opacity: 0.7,
          transform: 'translate(-10%, 90%) scale(1) rotate(0deg)'
        },
        '75%': {
          opacity: 0.9,
          transform: 'translate(0%, 85%) scale(1.2) rotate(5deg)'
        }
      },
      '@keyframes secondaryGlow': {
        '0%, 100%': {
          opacity: 0.3,
          transform: 'translate(0, 0) scale(1)'
        },
        '50%': {
          opacity: 0.5,
          transform: 'translate(-30px, 20px) scale(1.1)'
        }
      }
    }}>
      <Box //@ts-ignore
        alignItems="center" 
        sx={{
          backgroundColor: 'transparent', 
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '20%',
            right: '20%',
            width: '150px',
            height: '150px',
            background: 'radial-gradient(circle, rgba(159,223,255,0.2) 0%, rgba(0,198,255,0) 70%)',
            filter: 'blur(30px)',
            animation: 'flashGlow 10s ease-in-out infinite',
            pointerEvents: 'none'
          },
          '@keyframes flashGlow': {
            '0%, 100%': {
              opacity: 0.2,
              transform: 'scale(1)'
            },
            '5%, 15%': {
              opacity: 0.4,
              transform: 'scale(1.3)'
            },
            '10%': {
              opacity: 0.1,
              transform: 'scale(1.1)'
            },
            '50%': {
              opacity: 0.3,
              transform: 'scale(1.2)'
            }
          }
        }}
      >
        <Typography 
          variant="h1"
          sx={{
            textAlign: "center",
            fontFamily: "monospace",
            fontWeight: 700,
            fontSize: "1.4rem",
            letterSpacing: "1px",
            position: 'relative',
            color: '#fff',
            textShadow: '0 0 20px rgba(159,223,255,0.3)'
          }}
        >
          {currentLabel}
        </Typography>
      </Box>
    </AppBar>
  );
}

export default Brand;
