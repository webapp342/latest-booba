import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./i18n/i18n";

import { RouterProvider, createBrowserRouter } from "react-router-dom";
//import Home  from "./pages/Home.tsx"; 
import  AccountEquityCard  from "./pages/extras/AccountEquityCard.tsx";
import DPRdata from "./pages/DPRdata.tsx";
// import UserProfilePage from "./pages/UserProfilePage.tsx";
//import WheelSpin from "./pages/WheelSpin.tsx";
import LocalStorageViewer from "./pages/localStorage.tsx";
//import  CryptoTable2  from "./pages/wallet.tsx";
import Calculator from "./pages/Calculator.tsx";
import Task from "./pages/Tasks/Task.tsx";

import SwapComponent from "./pages/SwapComponent.tsx";
import TradingViewWidgetVertical from "./pages/extras/DataComponent.tsx";
import TestComponent from "./pages/TestComponent.tsx";






const router = createBrowserRouter([
  {
    path: "/latest-booba/",
    element: <App />,
    children: [
      {
        path: "/latest-booba/calculator",
        element: <Calculator />,
      },
     
      {
        path: "/latest-booba/farm",
        element: <AccountEquityCard />,
      },
      {
        path: "/latest-booba/task",
        element: <Task />,
      },
      {
        path: "/latest-booba/test",
        element: <TestComponent />,
      },
      {
        path: "/latest-booba/news",
        element: <TradingViewWidgetVertical />,
      },
      {
        path: "/latest-booba/user-details",
        element: <DPRdata />,
      },
      {
        path: "/latest-booba/user-profile-page",
        element: <SwapComponent />,
      },
      {
        path: "/latest-booba/",
        element: <LocalStorageViewer />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
