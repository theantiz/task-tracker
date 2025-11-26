import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { HeroUIProvider } from "@heroui/react";
import "./index.css";
import { AppProvider } from "./AppProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HeroUIProvider>
      <AppProvider>
        <div className="dark text-foreground bg-background min-h-screen w-full flex justify-center">
          <div className="w-full max-w-md sm:max-w-lg md:max-w-2xl px-4 py-6">
            <App />
          </div>
        </div>
      </AppProvider>
    </HeroUIProvider>
  </StrictMode>
);
