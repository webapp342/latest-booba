import * as React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { 
  Paper, 
  keyframes, 
  Box, 
  IconButton, 
  Tooltip, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Button,
  Typography
} from '@mui/material';
import { 

  Wallet,
  BarChart2,
  ListTodo,
  BadgeDollarSign,
  HelpCircle,
  ExternalLink,
  Gift
} from 'lucide-react';


// Animasyon keyframes'i
const coinAnimation = keyframes`
  0% {
    transform: rotateY(0deg);
  }
  100% {
    transform: rotateY(360deg);
  }
`;

const navItems = [
  {
    label: 'Boxes',
    icon: <Gift size={24} strokeWidth={1.5} />,
    path: '/mystery-box',
    dataTour: 'mystery-box-nav'
  },
  
  { 
    label: 'Stats', 
    icon: <BarChart2 size={24} strokeWidth={1.5} />, 
    path: '/',
    dataTour: 'stats-nav'
  },
  { 
    label: 'Earn', 
    icon: (isSelected: boolean) => (
      <Box // @ts-ignore
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          perspective: '1000px',
          '& svg': {
            color: isSelected ? '#6ed3ff' : 'rgba(255, 255, 255, 0.4)',
            animation: `${coinAnimation} 3s linear infinite`,
            transformOrigin: 'center center',
            transformStyle: 'preserve-3d',
            fontSize: '26px'
          }
        }}
      >
        <BadgeDollarSign />
      </Box>
    ),
    path: '/stake',
    dataTour: 'earn-nav'
  },
 
  { 
    label: 'Tasks', 
    icon: <ListTodo size={24} strokeWidth={1.5} />, 
    path: '/tasks',
    dataTour: 'tasks-nav'
  },
  { 
    label: 'Wallet', 
    icon: <Wallet size={24} strokeWidth={1.5} />, 
    path: '/spin',
    dataTour: 'wallet-nav'
  },
];

export default function Navigation() {
  const [value, setValue] = React.useState<number>(0);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
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
    
    setTimeout(() => {
      navigate(navItems[newValue].path);
    }, 0);
  };

  const handleSupportClick = () => {
    setIsModalOpen(true);
  };

  const handleTelegramClick = () => {
    const defaultMessage = encodeURIComponent("Hello! I need support with Booba platform.");
    window.open(`https://t.me/BoobaBlipCMO?text=${defaultMessage}`, '_blank');
    setIsModalOpen(false);
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



  return (
    <ThemeProvider theme={theme}>
      <Paper 
        elevation={0}
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          overflow: 'visible',
          background: '#1a2126',
          borderTop: '1px solid rgba(110, 211, 255, 0.1)',
          paddingBottom: 'calc(env(safe-area-inset-bottom) + 15px)',
        }}
      >
        <Box sx={{ position: 'absolute', top: -40, right: 16 }}>
          <Tooltip title="Support">
            <IconButton
              onClick={handleSupportClick}
              sx={{
                backgroundColor: 'rgba(110, 211, 255, 0.1)',
                color: '#6ed3ff',
                '&:hover': {
                  backgroundColor: 'rgba(110, 211, 255, 0.2)',
                },
              }}
            >
              <HelpCircle size={20} />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Support Modal */}
        <Dialog 
          open={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
          PaperProps={{
            sx: {
              backgroundColor: '#1a2126',
              color: 'white',
              borderRadius: 3,
              maxWidth: '90%',
              width: '400px'
            }
          }}
        >
          <DialogTitle sx={{ 
            borderBottom: '1px solid rgba(110, 211, 255, 0.1)',
            color: '#6ed3ff'
          }}>
            Technical Support
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Do you have any questions or concerns? We'd be happy to help you.
            </Typography>
            <Typography variant="body2" color="grey.400">
              You can reach us via Telegram. Our support team will get back to you as soon as possible.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ 
            borderTop: '1px solid rgba(110, 211, 255, 0.1)',
            p: 2
          }}>
            <Button 
              onClick={() => setIsModalOpen(false)}
              sx={{ 
                color: 'grey.400',
                '&:hover': { color: 'grey.300' }
              }}
            >
              Close
            </Button>
            <Button
            fullWidth
              variant="contained"
              onClick={handleTelegramClick}
              startIcon={<ExternalLink size={16} />}
              sx={{
                bgcolor: '#6ed3ff',
                color: '#1a2126',
                '&:hover': {
                  bgcolor: '#5bc0ff'
                }
              }}
            >
              Contact Us
            </Button>
          </DialogActions>
        </Dialog>

        <BottomNavigation
          value={value}
          onChange={handleChange}
          showLabels
          sx={{
            height: '75px',
            background: 'transparent',
            paddingBottom: { xs: '12px', sm: '12px', md: '12px' },
            '& .MuiBottomNavigationAction-root': {
              padding: '6px 0',
              minWidth: 'auto',
              transition: 'all 0.2s ease',
              position: 'relative',
              '&.Mui-selected': {
                padding: '6px 0',
              },
            },
          }}
        >
          {navItems.map((item, index) => (
            <BottomNavigationAction
              key={item.label}
              icon={typeof item.icon === 'function' ? item.icon(value === index) : item.icon}
              label={item.label}
              value={index}
              data-tour={item.dataTour}
              sx={{
                '& .MuiSvgIcon-root, & svg:not(.special-icon)': {
                  mt: 1,
                  color: value === index ? '#6ed3ff' : 'rgba(255, 255, 255, 0.4)',
                  transition: 'all 0.2s ease',
                  transform: value === index ? 'scale(1.1)' : 'scale(1)',
                  stroke: value === index ? '#6ed3ff' : 'rgba(255, 255, 255, 0.4)',
                  strokeWidth: value === index ? 2 : 1.5,
                },
                '& .MuiBottomNavigationAction-label': {
                  fontSize: '0.7rem !important',
                  mt: 0.5,
                  mb: { xs: 1, sm: 1, md: 1 },
                  color: value === index ? '#6ed3ff' : 'rgba(255, 255, 255, 0.4)',
                  transition: 'all 0.2s ease',
                  fontWeight: value === index ? 600 : 400,
                  opacity: 1,
                  letterSpacing: '0.02em',
                  fontFamily: 'Montserrat',
                  '&.Mui-selected': {
                    fontSize: '0.7rem !important'
                  }
                },
                '&:hover': {
                  '& .MuiSvgIcon-root, & svg:not(.special-icon)': {
                    color: '#6ed3ff',
                    stroke: '#6ed3ff',
                  },
                  '& .MuiBottomNavigationAction-label': {
                    color: '#6ed3ff'
                  }
                }
              }}
            />
          ))}
        </BottomNavigation>
      </Paper>
    </ThemeProvider>
  );
}
