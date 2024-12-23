import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import LocalStorageViewer from "./pages/LocalStorageViewer.tsx";
import TokenSwap from "./pages/SwapComponent.tsx";
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
        path: "/latest-booba/swap",
        element:     <TokenSwap />,
      },
         {
        path: "/latest-booba/spin",
        element:     <LocalStorageViewer />,
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
        path: "/latest-booba/slot",
                element: <SlotMachine />,

      },
        {
        path: "/latest-booba/top", 
                element: <TopComponent />,

      },
      {
        path: "/latest-booba/", 
                element: <TopComponent />,

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
