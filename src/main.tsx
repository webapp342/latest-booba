import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "slick-carousel/slick/slick.css"; // Basic styles for the slider
import "slick-carousel/slick/slick-theme.css"; // Theme styles for the slider
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import LocalStorageViewer from "./pages/LocalStorageViewer.tsx";
import TokenSwap from "./pages/SwapComponent.tsx";
import WebApp from "@twa-dev/sdk";

import TopComponent from "./pages/Cup.tsx";
import DealsComponent from "./pages/Tasks.tsx";
import TestComponent from "./pages/TestComponent.tsx";
import { SlotMachine } from './pages/spot/SlotMachine';
import ImageSlider from "./pages/ImageSlider.tsx";
import MatchesList from "./pages/MatchesList.tsx";
import AdminPanel from "./pages/AdminPanel.tsx";
import NewComponent from "./components/NewComponent.tsx";
import Stats from "./components/Stats.tsx";
import Statistics from "./components/Statistics.tsx";
import Layout from "./layouts/StatsLayout.tsx";
import { OnboardingProvider } from './components/Onboarding/OnboardingProvider'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ErrorBoundary from "./components/ErrorBoundary.tsx";
import { Box, Typography } from '@mui/material';

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
  <Box
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

const router = createBrowserRouter([
  {
    path: "/latest-booba",
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
        path: "stats",
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
        path: "swap",
        element: <TokenSwap />
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
        path: "matches",
        element: <MatchesList />
      },
      {
        path: "admin",
        element: <AdminPanel />
      },
      {
        path: "slot",
        element: <SlotMachine />
      },
      {
        path: "top",
        element: <TopComponent />
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);
