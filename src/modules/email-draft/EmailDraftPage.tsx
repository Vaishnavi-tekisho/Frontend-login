import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { SettingsProvider } from "./context/SettingsContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Navbar from "../dashboard/components/Navbar";

const queryClient = new QueryClient();

const EmailDraftPage = () => (
  <QueryClientProvider client={queryClient}>
    <SettingsProvider>
      <TooltipProvider>
        <Navbar/>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </SettingsProvider>
  </QueryClientProvider>
);

export default EmailDraftPage;
