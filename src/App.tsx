
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import AuthGuard from "./components/auth/AuthGuard";
import HomePage from "./pages/HomePage";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import NotFound from "./pages/NotFound";
import WisdomExchangePage from "./pages/features/WisdomExchangePage";
import LegacyVaultPage from "./pages/features/LegacyVaultPage";
import TimelessMessagesPage from "./pages/features/TimelessMessagesPage";
import { useState, useEffect } from "react";
import LoadingScreen from "./components/LoadingScreen";

// Import dashboard components
import DashboardHome from "./components/dashboard/DashboardHome";
import CreateContent from "./components/dashboard/CreateContent";
import LegacyVault from "./components/dashboard/LegacyVault";
import WisdomExchange from "./components/dashboard/WisdomExchange";
import TimelessMessages from "./components/dashboard/TimelessMessages";
import ProfileSettings from "./components/dashboard/ProfileSettings";

// Import framer-motion for animations
import { MotionConfig } from "framer-motion";

const queryClient = new QueryClient();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading for a minimum time (better UX)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <MotionConfig reducedMotion="user">
          <LoadingScreen isLoading={isLoading} />
          {!isLoading && (
            <>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <AuthProvider>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/features/wisdom-exchange" element={<WisdomExchangePage />} />
                    <Route path="/features/legacy-vault" element={<LegacyVaultPage />} />
                    <Route path="/features/timeless-messages" element={<TimelessMessagesPage />} />
                    <Route path="/signin" element={
                      <AuthGuard requireAuth={false}>
                        <SignIn />
                      </AuthGuard>
                    } />
                    <Route path="/signup" element={
                      <AuthGuard requireAuth={false}>
                        <SignUp />
                      </AuthGuard>
                    } />
                    
                    {/* Dashboard Routes */}
                    <Route path="/dashboard" element={
                      <AuthGuard requireAuth={true}>
                        <Dashboard />
                      </AuthGuard>
                    }>
                      {/* Dashboard nested routes rendered via outlet */}
                      <Route path="create" element={<CreateContent />} />
                      <Route path="legacy-vault" element={<LegacyVault />} />
                      <Route path="wisdom-exchange" element={<WisdomExchange />} />
                      <Route path="timeless-messages" element={<TimelessMessages />} />
                      <Route path="profile" element={<ProfileSettings />} />
                    </Route>
                    
                    <Route path="/unauthorized" element={<UnauthorizedPage />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </AuthProvider>
              </BrowserRouter>
            </>
          )}
        </MotionConfig>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
