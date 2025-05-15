
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
import UnauthorizedPage from "./pages/UnauthorizedPage";
import NotFound from "./pages/NotFound";
import WisdomExchangePage from "./pages/features/WisdomExchangePage";
import LegacyVaultPage from "./pages/features/LegacyVaultPage";
import TimelessMessagesPage from "./pages/features/TimelessMessagesPage";
import { useState, useEffect } from "react";
import LoadingScreen from "./components/LoadingScreen";

// Dashboard imports
import DashboardLayout from "./components/DashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import CreateContentPage from "./pages/dashboard/CreateContentPage";
import LegacyVaultDashboard from "./pages/dashboard/LegacyVaultPage";
import WisdomExchangeDashboard from "./pages/dashboard/WisdomExchangePage";
import TimelessMessagesDashboard from "./pages/dashboard/TimelessMessagesPage";
import ProfilePage from "./pages/dashboard/ProfilePage";

// Legal Pages
import TermsOfUsePage from "./pages/legal/TermsOfUsePage";
import PrivacyPolicyPage from "./pages/legal/PrivacyPolicyPage";
import CommunityGuidelinesPage from "./pages/legal/CommunityGuidelinesPage";
import CopyrightPolicyPage from "./pages/legal/CopyrightPolicyPage";

// Pricing Page
import PricingPage from "./pages/pricing";

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
                  <div className="flex flex-col min-h-screen">
                    <div className="flex-grow">
                      {/* Routes section */}
                      <Routes>
                        <Route path="/" element={<HomePage />} />
                        
                        {/* Feature pages - add mentorship route */}
                        <Route path="/features/wisdom-exchange" element={<WisdomExchangePage />} />
                        <Route path="/features/mentorship" element={<WisdomExchangePage />} />
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
                            <DashboardLayout />
                          </AuthGuard>
                        }>
                          <Route index element={<DashboardHome />} />
                          <Route path="create" element={<CreateContentPage />} />
                          <Route path="legacy-vault" element={<LegacyVaultDashboard />} />
                          <Route path="wisdom-exchange" element={<WisdomExchangeDashboard />} />
                          <Route path="mentorship" element={<WisdomExchangeDashboard />} />
                          <Route path="timeless-messages" element={<TimelessMessagesDashboard />} />
                          <Route path="profile" element={<ProfilePage />} />
                        </Route>
                        
                        {/* Legal Pages */}
                        <Route path="/legal/terms" element={<TermsOfUsePage />} />
                        <Route path="/legal/privacy" element={<PrivacyPolicyPage />} />
                        <Route path="/legal/community" element={<CommunityGuidelinesPage />} />
                        <Route path="/legal/copyright" element={<CopyrightPolicyPage />} />
                        
                        {/* Pricing Page */}
                        <Route path="/pricing" element={<PricingPage />} />
                        
                        <Route path="/unauthorized" element={<UnauthorizedPage />} />
                        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </div>
                  </div>
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
