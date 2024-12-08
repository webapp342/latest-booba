import "./App.css";
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import SimpleBottomNavigation from "./pages/Navigation";
import WebApp from "@twa-dev/sdk";
import Loading from "./pages/Loading"; // Loading bileşenini import edin
import Navbar from "./pages/Navbar"; // Yeni Navbar bileşenini import edin
import "./index.css"; // Global stil dosyasını import edin
import "./i18n/i18n"; // i18n yapılandırmasını import edin
import i18n from "i18next";

function App() {
    const [loading, setLoading] = useState(true);
    const [language, setLanguage] = useState(() => localStorage.getItem("language") || "en");

    useEffect(() => {
        // Telegram WebApp'i tam ekran moduna genişlet
        WebApp.expand();

        // İlk yüklemede loading göstermek için zamanlayıcı
        const timer = setTimeout(() => {
            setLoading(false);
        }, 3000); // 3 saniye bekleme süresi

        return () => clearTimeout(timer);
    }, []);

    // Dil değiştirme işlevi
    const handleLanguageChange = (lang: string) => {
        setLanguage(lang);
        localStorage.setItem("language", lang);
        i18n.changeLanguage(lang); // i18n dilini değiştir
    };

    

    return (
        <div id="root">

            {/* Navbar'ı üstte göster */}
            <Navbar currentLanguage={language} onLanguageChange={handleLanguageChange} />

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
