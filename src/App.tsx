
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

// Import framer-motion for animations
import { MotionConfig } from "framer-motion";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <MotionConfig reducedMotion="user">
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<HomePage />} />
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
              <Route path="/dashboard" element={
                <AuthGuard requireAuth={true}>
                  <Dashboard />
                </AuthGuard>
              } />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </MotionConfig>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
