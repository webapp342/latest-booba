import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "slick-carousel/slick/slick.css"; // Basic styles for the slider
import "slick-carousel/slick/slick-theme.css"; // Theme styles for the slider
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import LocalStorageViewer from "./pages/LocalStorageViewer.tsx";
import WebApp from "@twa-dev/sdk";
import { Analytics } from '@vercel/analytics/react';

import DealsComponent from "./pages/Tasks.tsx";
import TestComponent from "./pages/TestComponent.tsx";
import { SlotMachine } from './pages/spot/SlotMachine';
import ImageSlider from "./pages/ImageSlider.tsx";
import NewComponent from "./components/NewComponent.tsx";
import Layout from "./layouts/StatsLayout.tsx";
import { OnboardingProvider } from './components/Onboarding/OnboardingProvider'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ErrorBoundary from "./components/ErrorBoundary.tsx";
import { Box, Typography } from '@mui/material';
import DirectLinkAd from "./components/Ads/DirectLinkAd.tsx";
import DirectLinkKeys from "./components/Ads/DirectLinkKeys.tsx";

if (WebApp.isVersionAtLeast('8.0') && 
    WebApp.platform !== 'tdesktop' && 
    WebApp.platform !== 'weba') {
    WebApp.expand();
    WebApp.requestFullscreen();
    WebApp.enableClosingConfirmation();
} else {
    console.warn('Fullscreen mode is not supported on this platform. Using expand() instead.');
    WebApp.expand();
}

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

// Lazy load the components
const LazyStats = React.lazy(() => import("./components/Stats.tsx"));
const LazyStatistics = React.lazy(() => import("./components/Statistics.tsx"));
const LazyTokenSwap = React.lazy(() => import("./pages/SwapComponent.tsx"));
const LazyAdminPanel = React.lazy(() => import("./pages/AdminPanel.tsx"));
const LazyBoxOpening = React.lazy(() => import("./components/boxOpening/BoxOpening"));
const LazyBoxDetail = React.lazy(() => import("./components/boxOpening/BoxDetail"));

// Loading component
const LoadingFallback = () => (
  <Box sx={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh' 
  }}>
    <Typography>Loading...</Typography>
  </Box>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ErrorBoundary>
        <OnboardingProvider>
          <Suspense fallback={<LoadingFallback />}>
            <App />
          </Suspense>
        </OnboardingProvider>
      </ErrorBoundary>
    ),
    errorElement: <DefaultErrorElement />,
    children: [
      {
        path: "",
        element: <Layout>
          <Suspense fallback={<LoadingFallback />}>
            <LazyStats
              totalLockedTon={55320000}
              totalEarningsDistributed={5532000}
              totalPools={3}
              performanceData={[11193, 40083, 90056, 100622, 124722, 132191, 177181,]}
            />
          </Suspense>
        </Layout>
      },
      {
        path: "stats",
        element: <Layout />,
        children: [
          {
            path: "",
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <LazyStats totalLockedTon={0} totalEarningsDistributed={0} totalPools={0} performanceData={[]} />
              </Suspense>
            )
          },
          {
            path: "statistics",
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <LazyStatistics />
              </Suspense>
            )
          }
        ]
      },
      {
        path: "swap",
        element: <Suspense fallback={<LoadingFallback />}>
          <LazyTokenSwap />
        </Suspense>
      },
      {
        path: "spin",
        element: <LocalStorageViewer />
      },
      {
        path: "stake",
        element: <NewComponent />
      },
      {
        path: "test",
        element: <TestComponent />
      },
      {
        path: "tasks",
        element: <DealsComponent />
      },
      {
        path: "games",
        element: <ImageSlider />
      },
      {
        path: "ad",
        element: <DirectLinkAd />
      },
      {
        path: "adkeys",
        element: <DirectLinkKeys />
      },
      {
        path: "admin",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <LazyAdminPanel />
          </Suspense>
        )
      },
      {
        path: "slot",
        element: <SlotMachine />
      },
      {
        path: "mystery-box",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <LazyBoxOpening />
          </Suspense>
        )
      },
      {
        path: "box/:boxId",
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
