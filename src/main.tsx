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



    
  WebApp.expand();




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
        element:          <DealsComponent />
        ,
      },
      {
        path: "/latest-booba/games",
        element: <ImageSlider />,
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
    />    </React.StrictMode>
);
