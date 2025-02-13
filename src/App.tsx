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
import { usePerformanceMonitoring } from './hooks/usePerformanceMonitoring';
import analytics from '@telegram-apps/analytics';
import { v4 as uuidv4 } from 'uuid';

// Create a session ID for analytics
const sessionId = uuidv4();

// Initialize analytics before app renders
analytics.init({
    token: 'eyJhcHBfbmFtZSI6IkJvb2JhQmxpcCIsImFwcF91cmwiOiJodHRwczovL3QubWUvQm9vYmFCbGlwQm90IiwiYXBwX2RvbWFpbiI6Imh0dHBzOi8vYXBwLmJibGlwLmlvIn0=!fwYnpPAfOiM7DtV2126g0WrJPi8o7t+GB8KH3xk9pZw=',
    appName: 'BoobaBlip',
    env: process.env.NODE_ENV === 'development' ? 'STG' : 'PROD'
}).catch(console.error);

// Custom analytics functions
const sendAnalyticsEvent = async (eventName: string, customData?: Record<string, any>) => {
    try {
        if (!WebApp.initData) return;

        const user = WebApp.initDataUnsafe?.user;
        if (!user?.id) return;

        const eventData = {
            event_name: eventName,
            session_id: sessionId,
            user_id: user.id,
            app_name: 'BoobaBlip',
            is_premium: user.is_premium || false,
            platform: WebApp.platform || 'unknown',
            locale: user.language_code || 'en',
            start_param: WebApp.initDataUnsafe?.start_param || '',
            client_timestamp: Date.now().toString(),
            custom_data: customData
        };

        await fetch('https://analytics.tgapps.xyz/api/v1/events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.VITE_ANALYTICS_TOKEN || 'eyJhcHBfbmFtZSI6IkJvb2JhQmxpcCIsImFwcF91cmwiOiJodHRwczovL3QubWUvQm9vYmFCbGlwQm90IiwiYXBwX2RvbWFpbiI6Imh0dHBzOi8vYXBwLmJibGlwLmlvIn0=!fwYnpPAfOiM7DtV2126g0WrJPi8o7t+GB8KH3xk9pZw='}`
            },
            body: JSON.stringify(eventData)
        });
    } catch (error) {
        console.error('Analytics event error:', error);
    }
};

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
      Please use our official Telegram bot to access the application.
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
    const manifestUrl = "https://app.bblip.io/tonconnect-manifest.json";
    const location = useLocation();

    // Performance monitoring hook
    usePerformanceMonitoring();

    // Initialize WebApp
    useEffect(() => {
        try {
            // Check if WebApp is initialized
            if (!WebApp.initData) {
                console.error('Not running in Telegram Web App');
                setIsAuthorized(false);
                setLoading(false);
                return;
            }

            // WebApp is initialized, proceed with setup
            WebApp.expand();
            WebApp.setHeaderColor('#1a2126');
            WebApp.setBackgroundColor('#1a2126');
            WebApp.enableClosingConfirmation();
            WebApp.ready();

            // Send app-init event
            sendAnalyticsEvent('app-init');
            
            setIsAuthorized(true);
        } catch (error) {
            console.error('Error initializing WebApp:', error);
            setIsAuthorized(false);
        } finally {
            setLoading(false);
        }
    }, []);

    // Track page views
    useEffect(() => {
        if (isAuthorized) {
            sendAnalyticsEvent('custom-event', {
                type: 'page_view',
                path: location.pathname,
                title: document.title
            });
        }
    }, [location.pathname, isAuthorized]);

    // Track app hide/show
    useEffect(() => {
        if (!isAuthorized) return;

        const handleVisibilityChange = () => {
            if (document.hidden) {
                sendAnalyticsEvent('app-hide');
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [isAuthorized]);

    // Resource hint'leri ekle
    useEffect(() => {
        // Önemli kaynakları önceden yükle
        const preloadResources = [
            '/images/large-image.jpg',
            '/fonts/main-font.woff2'
        ];

        preloadResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = resource.includes('.woff2') ? 'font' : 'image';
            link.href = resource;
            document.head.appendChild(link);
        });

        // DNS'i önceden çöz
        const prefetchDomains = [
            'https://api.bblip.io',
            'https://cdn.bblip.io'
        ];

        prefetchDomains.forEach(domain => {
            const link = document.createElement('link');
            link.rel = 'dns-prefetch';
            link.href = domain;
            document.head.appendChild(link);
        });
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

    if (loading) {
        return <LoadingScreen />;
    }

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

                    <div 
                        className={`main-content ${loading ? "hidden" : ""}`} 
                        style={{
                            marginBottom:"13vh", 
                            paddingTop: '64px', 
                            overflowX: 'hidden',
                            willChange: 'transform',
                            transform: 'translateZ(0)',
                            backfaceVisibility: 'hidden'
                        }}
                    >
                        <WelcomeModal onClose={() => {
                            console.log('Welcome modal closed');
                            // Track modal close event
                            sendAnalyticsEvent('custom-event', {
                                type: 'modal_closed',
                                name: 'welcome_modal'
                            });
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
