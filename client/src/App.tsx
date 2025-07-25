import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import MatchDetails from "./pages/MatchDetails";
import Profile from "./pages/Profile";
import BettingHistory from "./pages/BettingHistory";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import AdminBets from "./pages/AdminBets";
import AdminRoute from "@/components/AdminRoute";
import AdminUsers from "@/pages/AdminUsers";
import UserRoute from "@/components/UserRoute";

const queryClient = new QueryClient();

// Initialize theme on app load
const initializeTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
  
  document.documentElement.classList.remove('light', 'dark');
  document.documentElement.classList.add(theme);
};

const App = () => {
  useEffect(() => {
    initializeTheme();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/dashboard/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
            <Route path="/admin/bets" element={<AdminRoute><AdminBets /></AdminRoute>} />
            <Route path="/match/:id" element={<MatchDetails />} />
            <Route path="/profile" element={<UserRoute><Profile /></UserRoute>} />
            <Route path="/betting-history" element={<UserRoute><BettingHistory /></UserRoute>} />
            <Route path="/settings" element={<UserRoute><Settings /></UserRoute>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
