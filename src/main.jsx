import { StrictMode } from "react";
import "lenis/dist/lenis.css";
import "./index.css";
import App from "./App.jsx";

import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import ScrollToTop from "./components/ScrollToTop.jsx";
import { ReactLenis } from "lenis/react";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        wheelMultiplier: 1.0,
        touchMultiplier: 1.2,
        smoothWheel: true,
        autoRaf: true,
      }}
    >
      <BrowserRouter>
        <ScrollToTop />
        <App />
      </BrowserRouter>
    </ReactLenis>
  </StrictMode>,
);
