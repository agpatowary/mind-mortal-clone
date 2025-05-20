import React, { Suspense, lazy } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Auth components and pages
import { AuthProvider } from '@/hooks/useAuth';
import AuthGuard from '@/components/auth/AuthGuard';
import SignIn from '@/pages/SignIn';
import SignUp from '@/pages/SignUp';
import LoadingScreen from '@/components/LoadingScreen';

// Homepage
import HomePage from '@/pages/HomePage';

// Dashboard
import DashboardLayout from '@/components/DashboardLayout';
import DashboardHome from '@/pages/dashboard/DashboardHome';

// Dashboard Feature Pages
import LegacyVaultPage from '@/pages/dashboard/LegacyVaultPage';
import TimelessMessagesPage from '@/pages/dashboard/TimelessMessagesPage';
import MentorshipPage from '@/pages/dashboard/WisdomExchangePage';
import ProfilePage from '@/pages/dashboard/ProfilePage';

// Create Content Pages
import CreateLegacyPost from '@/pages/dashboard/legacy-vault/CreateLegacyPost';
import CreateTimelessMessage from '@/pages/dashboard/timeless-messages/CreateTimelessMessage';
import CreateMentorshipResource from '@/pages/dashboard/wisdom-exchange/CreateWisdomResource';

// Feature Pages
import LegacyVaultFeaturePage from '@/pages/features/LegacyVaultPage';
import TimelessMessagesFeaturePage from '@/pages/features/TimelessMessagesPage';
import MentorshipFeaturePage from '@/pages/features/MentorshipPage';
import IdeaVaultFeaturePage from '@/pages/features/IdeaVaultPage';

// Legal Pages
import PrivacyPolicyPage from '@/pages/legal/PrivacyPolicyPage';
import TermsOfUsePage from '@/pages/legal/TermsOfUsePage';
import CommunityGuidelinesPage from '@/pages/legal/CommunityGuidelinesPage';
import CopyrightPolicyPage from '@/pages/legal/CopyrightPolicyPage';

// Other
import NotFound from '@/pages/NotFound';
import UnauthorizedPage from '@/pages/UnauthorizedPage';
import PricingPage from '@/pages/pricing';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Lazily load the IdeaVaultPage component
const IdeaVaultPage = lazy(() => import('@/pages/dashboard/IdeaVaultPage'));
const CreateIdeaPost = lazy(() => import('@/pages/dashboard/idea-vault/CreateIdeaPost'));

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Suspense fallback={<LoadingScreen isLoading={true} />}>
            <div className="min-h-screen bg-background font-sans antialiased">
              <AuthProvider>
                <div className="flex flex-col min-h-screen">
                  <div className="flex-grow">
                    {/* Routes section */}
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      
                      {/* Public Feature Pages */}
                      <Route path="/features">
                        <Route path="legacy-vault" element={<LegacyVaultFeaturePage />} />
                        <Route path="timeless-messages" element={<TimelessMessagesFeaturePage />} />
                        <Route path="mentorship" element={<MentorshipFeaturePage />} />
                        <Route path="idea-vault" element={<IdeaVaultFeaturePage />} />
                      </Route>
                      
                      {/* Auth-related */}
                      <Route path="/signin" element={<SignIn />} />
                      <Route path="/signup" element={<SignUp />} />
                      <Route path="/unauthorized" element={<UnauthorizedPage />} />
                      
                      {/* Legal */}
                      <Route path="/legal">
                        <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
                        <Route path="terms-of-use" element={<TermsOfUsePage />} />
                        <Route path="community-guidelines" element={<CommunityGuidelinesPage />} />
                        <Route path="copyright-policy" element={<CopyrightPolicyPage />} />
                      </Route>
                      
                      {/* Pricing */}
                      <Route path="/pricing" element={<PricingPage />} />
                      
                      {/* Dashboard (Protected) */}
                      <Route path="/dashboard" element={
                        <AuthGuard>
                          <DashboardLayout />
                        </AuthGuard>
                      }>
                        <Route index element={<DashboardHome />} />
                        
                        {/* Legacy Vault */}
                        <Route path="legacy-vault">
                          <Route index element={<LegacyVaultPage />} />
                          <Route path="create" element={<CreateLegacyPost />} />
                        </Route>
                        
                        {/* Idea Vault */}
                        <Route path="idea-vault">
                          <Route index element={<IdeaVaultPage />} />
                          <Route path="create" element={<CreateIdeaPost />} />
                          <Route path="view/:id" element={<div>Idea Details View - Coming Soon</div>} />
                        </Route>
                        
                        {/* Timeless Messages */}
                        <Route path="timeless-messages">
                          <Route index element={<TimelessMessagesPage />} />
                          <Route path="create" element={<CreateTimelessMessage />} />
                        </Route>
                        
                        {/* Mentorship */}
                        <Route path="mentorship">
                          <Route index element={<MentorshipPage />} />
                          <Route path="create" element={<CreateMentorshipResource />} />
                        </Route>
                        
                        {/* User Profile */}
                        <Route path="profile" element={<ProfilePage />} />
                      </Route>
                      
                      {/* 404 Page */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </div>
                </div>
              </AuthProvider>
            </div>
          </Suspense>
        </BrowserRouter>
        <Toaster />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
