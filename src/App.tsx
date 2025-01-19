import "./App.css";
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import SimpleBottomNavigation from "./pages/Navigation";
import Loading from "./pages/Loading"; // Loading bileşenini import edin
import "./index.css"; // Global stil dosyasını import edin
import "slick-carousel/slick/slick.css"; // Basic styles for the slider
import "slick-carousel/slick/slick-theme.css"; // Theme styles for the slider
import { TonConnectUIProvider} from "@tonconnect/ui-react";
import { ThemeProvider } from '@mui/material/styles';
import ResponsiveAppBar from './components/HeaderTop'; // Import the ResponsiveAppBar

import theme from './pages/theme'; // Yukarıda oluşturduğunuz tema



function App() {
    const [loading, setLoading] = useState(true);
    const manifestUrl = "https://webapp342.github.io/latest-booba/tonconnect-manifest.json";


    useEffect(() => {
        // Telegram WebApp'i tam ekran moduna genişlet

        // İlk yüklemede loading göstermek için zamanlayıcı
        const timer = setTimeout(() => {
            setLoading(false);
        }, 3000); // 3 saniye bekleme süresi

        return () => clearTimeout(timer);
    }, []);


 

    return (
          <ThemeProvider theme={theme}>
           <TonConnectUIProvider manifestUrl={manifestUrl} actionsConfiguration={{
              twaReturnUrl: 'https://t.me/BoobaBlipBot'
          }} >
        <div id="root">

            

          
            {/* Loading ekranı */}
            {loading && <Loading />}

            {/* Ana içerik */}
            <div className={`main-content ${loading ? "hidden" : ""}`} style={{ paddingTop: '64px' }}>
                
                <ResponsiveAppBar /> {/* Add the ResponsiveAppBar here */}
                <Outlet />
                
            </div>

            {/* Alt gezinme */}
            <SimpleBottomNavigation />

        </div>
        </TonConnectUIProvider>
        </ThemeProvider>
    );
}

export default App;
