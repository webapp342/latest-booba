import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "slick-carousel/slick/slick.css"; // Basic styles for the slider
import "slick-carousel/slick/slick-theme.css"; // Theme styles for the slider
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import LocalStorageViewer from "./pages/LocalStorageViewer.tsx";
import { Analytics } from '@vercel/analytics/react';
import analytics from '@telegram-apps/analytics';
import WebApp from "@twa-dev/sdk";

// Initialize analytics
const ANALYTICS_TOKEN = 'eyJhcHBfbmFtZSI6IkJvb2JhQmxpcCIsImFwcF91cmwiOiJodHRwczovL3QubWUvQm9vYmFCbGlwQm90IiwiYXBwX2RvbWFpbiI6Imh0dHBzOi8vYXBwLmJibGlwLmlvIn0=!AtipScY/ag//8I4N0LwUprrlzN0h6V9p7pWU0FC4gE4='; // Replace with your actual token from t.me/mini_apps_analytics_bot

analytics.init({
  token: ANALYTICS_TOKEN,
  appName: 'BoobaBlip'
}).catch(console.error);

// Analytics event sending function
export const sendAnalyticsEvent = async (eventName: string, customData?: Record<string, any>) => {
  try {
    if (!WebApp.initData) {
      console.warn('Analytics: WebApp.initData is not available');
      return;
    }

    await analytics.init({
      token: ANALYTICS_TOKEN,
      appName: 'BoobaBlip'
    });

    const eventData = {
      event_name: eventName,
      user_id: WebApp.initDataUnsafe?.user?.id?.toString(),
      platform: WebApp.platform || 'unknown',
      start_param: WebApp.initDataUnsafe?.start_param || '',
      ...customData
    };

    const response = await fetch('https://tganalytics.xyz/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ANALYTICS_TOKEN}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify(eventData)
    });

    if (!response.ok) {
      throw new Error(`Analytics error: ${await response.text()}`);
    }

    console.debug('Analytics event sent successfully:', eventName);
  } catch (error) {
    console.warn('Analytics event error:', error);
  }
};

import DealsComponent from "./pages/Tasks.tsx";
import TestComponent from "./pages/TestComponent.tsx";
import { SlotMachine } from './pages/spot/SlotMachine';
import ImageSlider from "./pages/ImageSlider.tsx";
import NewComponent from "./components/NewComponent.tsx";
import Layout from "./layouts/StatsLayout.tsx";
import Stats from "./components/Stats.tsx";
import Statistics from "./components/Statistics.tsx";
import TokenSwap from "./pages/SwapComponent.tsx";
import { OnboardingProvider } from './components/Onboarding/OnboardingProvider'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ErrorBoundary from "./components/ErrorBoundary.tsx";
import { Box, Typography } from '@mui/material';
import DirectLinkAd from "./components/Ads/DirectLinkAd.tsx";
import DirectLinkKeys from "./components/Ads/DirectLinkKeys.tsx";
import Settings from "./pages/Settings.tsx";
// MUI theme configuration
const theme = createTheme({
  palette: {
    primary: {
      main: '#2196F3',
      light: '#64B5F6',
      dark: '#1976D2',
    },
    secondary: {
      main: '#f50057',
    },
    error: {
      main: '#f44336',
    },
    background: {
      default: '#fff',
      paper: '#f5f5f5',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

const DefaultErrorElement = () => (
  <Box //@ts-ignore
    sx={{
      p: 4,
      textAlign: 'center',
      color: 'text.secondary',
    }}
  >
    <Typography variant="h5" gutterBottom>
      Oops! Something went wrong.
    </Typography>
    <Typography>
      Please try refreshing the page or contact support if the problem persists.
    </Typography>
  </Box>
);

// Performance monitoring function
const reportWebVitals = (metric: any) => {
  if (metric.label === 'web-vital') {
    // Analytics'e gönder veya console'a yazdır
    console.log(metric);
  }
};

// Only lazy load heavy and less frequently used components
const LazyBoxOpening = React.lazy(() => import("./components/boxOpening/BoxOpening"));
const LazyBoxDetail = React.lazy(() => import("./components/boxOpening/BoxDetail"));

// Loading component with better UX
const LoadingFallback = () => (
  <Box sx={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh',
    backgroundColor: '#1a2126',
  }}>
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 2
    }}>
      <Typography sx={{ color: '#6ed3ff' }}>Loading...</Typography>
    </Box>
  </Box>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ErrorBoundary>
        <OnboardingProvider>
          <App />
        </OnboardingProvider>
      </ErrorBoundary>
    ),
    errorElement: <DefaultErrorElement />,
    children: [
      {
        path: "",
        element: <Layout>
          <Stats
            totalLockedTon={55320000}
            totalEarningsDistributed={5532000}
            totalPools={3}
            performanceData={[11193, 40083, 90056, 100622, 124722, 132191, 177181,]}
          />
        </Layout>
      },
      {
        path: "/stats",
        element: <Layout />,
        children: [
          {
            path: "",
            element: <Stats totalLockedTon={0} totalEarningsDistributed={0} totalPools={0} performanceData={[]} />
          },
          {
            path: "statistics",
            element: <Statistics />
          }
        ]
      },
      {
        path: "/swap",
        element: <TokenSwap />
      },
      {
        path: "/spin",
        element: <LocalStorageViewer />
      },
      {
        path: "/stake",
        element: <NewComponent />
      },
         {
        path: "/settings",
        element: <Settings />
      },
      {
        path: "/test",
        element: <TestComponent />
      },
      {
        path: "/tasks",
        element: <DealsComponent />
      },
      {
        path: "/games",
        element: <ImageSlider />
      },
      {
        path: "/ad",
        element: <DirectLinkAd />
      },
      {
        path: "/adkeys",
        element: <DirectLinkKeys />
      },
     
      {
        path: "/slot",
        element: <SlotMachine />
      },
      {
        path: "/mystery-box",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <LazyBoxOpening />
          </Suspense>
        )
      },
      {
        path: "/box/:boxId",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <LazyBoxDetail />
          </Suspense>
        )
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
      <Analytics />
    </ThemeProvider>
  </React.StrictMode>
);

// Initialize performance monitoring
reportWebVitals(window.performance);
