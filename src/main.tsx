import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";

import "./index.css";
import "./i18n/i18n";

import { RouterProvider, createBrowserRouter } from "react-router-dom";
//import Home  from "./pages/Home.tsx"; 
import DPRdata from "./pages/DPRdata.tsx";
// import UserProfilePage from "./pages/UserProfilePage.tsx";
//import WheelSpin from "./pages/WheelSpin.tsx";
import LocalStorageViewer from "./pages/LocalStorageViewer.tsx";
//import  CryptoTable2  from "./pages/wallet.tsx";
import Calculator from "./pages/Calculator.tsx";
import Task from "./pages/Tasks/Task.tsx";

import TopComponent from "./pages/Cup.tsx";
import DealsComponent from "./pages/Tasks.tsx";
import TestComponent from "./pages/TestComponent.tsx";
import { SlotMachine } from './pages/spot/SlotMachine';






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
        path: "/latest-booba/spin",
        element:     <SlotMachine />,
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
        path: "/latest-booba/tasks",
        element: <DealsComponent />,
      },
      {
        path: "/latest-booba/user-details",
        element: <DPRdata />,
      },
      {
        path: "/latest-booba/top",
        element: <TopComponent />,
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
  <RouterProvider
      router={router}
    />  </React.StrictMode>
);
