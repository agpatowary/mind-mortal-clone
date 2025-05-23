
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/toaster"

import HomePage from '@/pages/HomePage';
import DashboardHome from '@/pages/dashboard/DashboardHome';
import LegacyVaultPage from '@/pages/dashboard/LegacyVaultPage';
import IdeaVaultPage from '@/pages/dashboard/IdeaVaultPage';
import MentorshipPage from '@/pages/dashboard/MentorshipPage';
import TimelessMessagesPage from '@/pages/dashboard/TimelessMessagesPage';
import SettingsPage from '@/pages/dashboard/SettingsPage';
import ProfilePage from '@/pages/dashboard/ProfilePage';
import SigninPage from '@/pages/SignIn';
import SignupPage from '@/pages/SignUp';
import PricingPage from '@/pages/pricing';
import NotFoundPage from '@/pages/NotFound';

import DashboardLayout from '@/components/DashboardLayout';
import { AuthProvider, useAuth } from '@/hooks/useAuth';

import LegacyPostCreate from '@/pages/dashboard/CreateContentPage';
import LegacyPostEdit from '@/pages/dashboard/legacy-vault/CreateLegacyPost';
import IdeaPostCreate from '@/pages/dashboard/idea-vault/CreateIdeaPost';
import TimelessMessageCreate from '@/pages/dashboard/timeless-messages/CreateTimelessMessage';
import MentorshipResourceCreate from '@/pages/dashboard/mentorship/CreateWisdomResource';
import BecomeMentorPage from '@/pages/dashboard/BecomeMentorPage';

const queryClient = new QueryClient();

// AuthGuard component
const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>; // Show a loading indicator
  }

  return isAuthenticated() ? <>{children}</> : <Navigate to="/signin" />;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/signin" element={<SigninPage />} />
              <Route path="/signup" element={<SignupPage />} />

              {/* Dashboard Routes */}
              <Route
                path="/dashboard"
                element={
                  <AuthGuard>
                    <DashboardLayout>
                      <DashboardHome />
                    </DashboardLayout>
                  </AuthGuard>
                }
              />
              <Route
                path="/dashboard/legacy-vault"
                element={
                  <AuthGuard>
                    <DashboardLayout>
                      <LegacyVaultPage />
                    </DashboardLayout>
                  </AuthGuard>
                }
              />
              <Route
                path="/dashboard/legacy-vault/create"
                element={
                  <AuthGuard>
                    <DashboardLayout>
                      <LegacyPostCreate />
                    </DashboardLayout>
                  </AuthGuard>
                }
              />
              <Route
                path="/dashboard/legacy-vault/edit/:postId"
                element={
                  <AuthGuard>
                    <DashboardLayout>
                      <LegacyPostEdit />
                    </DashboardLayout>
                  </AuthGuard>
                }
              />
              <Route
                path="/dashboard/idea-vault"
                element={
                  <AuthGuard>
                    <DashboardLayout>
                      <IdeaVaultPage />
                    </DashboardLayout>
                  </AuthGuard>
                }
              />
              <Route
                path="/dashboard/idea-vault/create"
                element={
                  <AuthGuard>
                    <DashboardLayout>
                      <IdeaPostCreate />
                    </DashboardLayout>
                  </AuthGuard>
                }
              />
              <Route
                path="/dashboard/mentorship"
                element={
                  <AuthGuard>
                    <DashboardLayout>
                      <MentorshipPage />
                    </DashboardLayout>
                  </AuthGuard>
                }
              />
              <Route
                path="/dashboard/mentorship/create"
                element={
                  <AuthGuard>
                    <DashboardLayout>
                      <MentorshipResourceCreate />
                    </DashboardLayout>
                  </AuthGuard>
                }
              />
              <Route
                path="/dashboard/timeless-messages"
                element={
                  <AuthGuard>
                    <DashboardLayout>
                      <TimelessMessagesPage />
                    </DashboardLayout>
                  </AuthGuard>
                }
              />
              <Route
                path="/dashboard/timeless-messages/create"
                element={
                  <AuthGuard>
                    <DashboardLayout>
                      <TimelessMessageCreate />
                    </DashboardLayout>
                  </AuthGuard>
                }
              />
              <Route
                path="/dashboard/settings"
                element={
                  <AuthGuard>
                    <DashboardLayout>
                      <SettingsPage />
                    </DashboardLayout>
                  </AuthGuard>
                }
              />
              <Route
                path="/dashboard/profile"
                element={
                  <AuthGuard>
                    <DashboardLayout>
                      <ProfilePage />
                    </DashboardLayout>
                  </AuthGuard>
                }
              />
              
              <Route
                path="/dashboard/become-mentor"
                element={
                  <AuthGuard>
                    <DashboardLayout>
                      <BecomeMentorPage />
                    </DashboardLayout>
                  </AuthGuard>
                }
              />
              
              {/* Catch-all route for 404 Not Found */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
