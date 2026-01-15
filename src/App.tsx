import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Index from "./pages/Index";
import Register from "./pages/Register";
import Login from "./pages/Login";
import MainDashboard from "./pages/MainDashboard";
import PasswordDashboard from "./pages/PasswordDashboard";
import PasswordStrength from "./pages/PasswordStrength";
import PhishingDashboard from "./pages/PhishingDashboard";
import PhishingCheck from "./pages/PhishingCheck";
import MalwareDashboard from "./pages/MalwareDashboard";
import MalwareScan from "./pages/MalwareScan";
import NotFound from "./pages/NotFound";
import AuthGuard from "./components/auth/AuthGuard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<AuthGuard><MainDashboard /></AuthGuard>} />
            <Route path="/password-dashboard" element={<AuthGuard><PasswordDashboard /></AuthGuard>} />
            <Route path="/password-strength" element={<AuthGuard><PasswordStrength /></AuthGuard>} />
            <Route path="/phishing-dashboard" element={<AuthGuard><PhishingDashboard /></AuthGuard>} />
            <Route path="/phishing-check" element={<AuthGuard><PhishingCheck /></AuthGuard>} />
            <Route path="/malware-dashboard" element={<AuthGuard><MalwareDashboard /></AuthGuard>} />
            <Route path="/malware-scan" element={<AuthGuard><MalwareScan /></AuthGuard>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
