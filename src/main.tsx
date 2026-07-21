import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";

import App from "@/App.tsx";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ModalProvider } from "@/context/ModalProvider";
import "@/index.css";

const root = createRoot(document.getElementById("root")!);
const queryClient = new QueryClient();

root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <ModalProvider>
            <App />
          </ModalProvider>
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
