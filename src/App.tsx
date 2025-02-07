import "./App.css";
import { useState,  useLayoutEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import SimpleBottomNavigation from "./pages/Navigation";
import Loading from "./pages/Loading";
import "./index.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Brand from './components/AiYield';

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

function App() {
    const [loading, setLoading] = useState(true);
    const manifestUrl = "https://webapp342.github.io/latest-booba/tonconnect-manifest.json";
    const location = useLocation();

    // Use both useEffect and useLayoutEffect for more aggressive scroll handling
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
        // Try again after a short delay
        setTimeout(scrollToTop, 50);
    }, [location.pathname]);

    return (
        <ThemeProvider theme={muiTheme}>
            <TonConnectUIProvider manifestUrl={manifestUrl} actionsConfiguration={{
                twaReturnUrl: 'https://t.me/BoobaBlipBot'
            }}>
                <div id="root">
                    {loading && <Loading onLoadComplete={() => setLoading(false)} />}

                    <div className={`main-content ${loading ? "hidden" : ""}`} style={{marginBottom:"13vh", paddingTop: '64px', overflowX: 'hidden' }}>
                        <Brand />
                        <Outlet />
                    </div>

                    <SimpleBottomNavigation />
                </div>
            </TonConnectUIProvider>
        </ThemeProvider>
    );
}

export default App;
