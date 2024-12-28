import "./App.css";
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import SimpleBottomNavigation from "./pages/Navigation";
import WebApp from "@twa-dev/sdk";
import Loading from "./pages/Loading"; // Loading bileşenini import edin
import "./index.css"; // Global stil dosyasını import edin

function App() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Telegram WebApp'i tam ekran moduna genişlet
        WebApp.expand();

        // İlk yüklemede loading göstermek için zamanlayıcı
        const timer = setTimeout(() => {
            setLoading(false);
        }, 3000); // 3 saniye bekleme süresi

        return () => clearTimeout(timer);
    }, []);


 

    return (
        <div id="root">

          
            {/* Loading ekranı */}
            {loading && <Loading />}

            {/* Ana içerik */}
            <div className={`main-content ${loading ? "hidden" : ""}`}>
                <Outlet />
            </div>

            {/* Alt gezinme */}
            <SimpleBottomNavigation />

        </div>
    );
}

export default App;
