import "./App.css";
import { useState, useLayoutEffect, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import SimpleBottomNavigation from "./pages/Navigation";
import Loading from "./pages/Loading";
import "./index.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Brand from './components/AiYield';
import WelcomeModal from './components/WelcomeModal';
import SpinNotification from './components/Notifications/SpinNotification';
import WebApp from "@twa-dev/sdk";
import { Box, Typography, Button, CircularProgress } from '@mui/material';

// MUI theme configuration
const muiTheme = createTheme({
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '1.75rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
    },
  },
  palette: {
    primary: {
      main: '#2196F3',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

const UnauthorizedAccess = () => (
  <Box // @ts-ignore
    sx={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      bgcolor: '#1a2126',
      color: 'white',
      p: 3,
      textAlign: 'center'
    }}
  >
    <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#6ed3ff' }}>
      Unauthorized Access
    </Typography>
    <Typography variant="body1" sx={{ mb: 3, maxWidth: 400 }}>
      This application can only be accessed through Telegram WebApp. Please use our official Telegram bot to access the application.
    </Typography>
    <Button
      variant="contained"
      href="https://t.me/BoobaBlipBot"
      target="_blank"
      sx={{
        bgcolor: '#6ed3ff',
        color: '#1a2126',
        '&:hover': {
          bgcolor: '#5bc0ff'
        }
      }}
    >
      Open in Telegram
    </Button>
  </Box>
);

const LoadingScreen = () => (
  <Box
    sx={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      bgcolor: '#1a2126',
    }}
  >
    <CircularProgress sx={{ color: '#6ed3ff' }} />
  </Box>
);

function App() {
    const [loading, setLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
    const manifestUrl = "https://webapp342.github.io/latest-booba/tonconnect-manifest.json";
    const location = useLocation();

    useEffect(() => {
        const checkAuthorization = () => {
            try {
                const user = WebApp.initDataUnsafe?.user;
                if (user && user.id) {
                    setIsAuthorized(true);
                    console.log('Telegram user authorized:', user.id);
                } else {
                    setIsAuthorized(false);
                    console.log('Unauthorized access attempt');
                }
            } catch (error) {
                console.error('Authorization check failed:', error);
                setIsAuthorized(false);
            } finally {
                setLoading(false);
            }
        };

        // Kısa bir gecikme ekleyerek WebApp'in yüklenmesini bekleyelim
        const timer = setTimeout(checkAuthorization, 100);
        return () => clearTimeout(timer);
    }, []);

    useLayoutEffect(() => {
        const scrollToTop = () => {
            const mainContent = document.querySelector('.main-content');
            if (mainContent) {
                mainContent.scrollTop = 0;
            }
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
            window.scrollTo(0, 0);
        };

        scrollToTop();
        setTimeout(scrollToTop, 50);
    }, [location.pathname]);

    // İlk yükleme sırasında loading ekranını göster
    if (loading || isAuthorized === null) {
        return <LoadingScreen />;
    }

    // Authorization kontrolü tamamlandıktan sonra
    if (!isAuthorized) {
        return <UnauthorizedAccess />;
    }

    return (
        <ThemeProvider theme={muiTheme}>
            <TonConnectUIProvider manifestUrl={manifestUrl} actionsConfiguration={{
                twaReturnUrl: 'https://t.me/BoobaBlipBot'
            }}>
                <div id="root">
                    {loading && <Loading onLoadComplete={() => setLoading(false)} />}

                    <div className={`main-content ${loading ? "hidden" : ""}`} style={{marginBottom:"13vh", paddingTop: '64px', overflowX: 'hidden' }}>
                        <WelcomeModal onClose={() => {
                            console.log('Welcome modal closed');
                        }} />
                        <Brand />
                        <Outlet />
                    </div>

                    <SimpleBottomNavigation />
                    <SpinNotification />
                </div>
            </TonConnectUIProvider>
        </ThemeProvider>
    );
}

export default App;
