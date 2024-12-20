import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import { AuthProvider } from "./providers/AuthContext.tsx";
import { BreadcrumbProvider } from "./providers/BreadcrumbContext.tsx";
import router from "./router.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BreadcrumbProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </BreadcrumbProvider>
    </QueryClientProvider>
  </StrictMode>
);
