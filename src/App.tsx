import React from 'react';
import { Routes, Route } from 'react-router-dom';
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

// Feature pages
import FeatureLegacyVaultPage from '@/pages/features/LegacyVaultPage';
import FeatureIdeaVaultPage from '@/pages/features/IdeaVaultPage';
import FeatureMentorshipPage from '@/pages/features/MentorshipPage';
import FeatureTimelessMessagesPage from '@/pages/features/TimelessMessagesPage';

// Admin pages
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminOverview from '@/pages/admin/AdminOverview';
import UsersManagement from '@/pages/admin/UsersManagement';
import MentorApplications from '@/pages/admin/MentorApplications';
import SubscriptionPlans from '@/pages/admin/SubscriptionPlans';

// Legal pages
import CommunityGuidelinesPage from '@/pages/legal/CommunityGuidelinesPage';
import PrivacyPolicyPage from '@/pages/legal/PrivacyPolicyPage';
import TermsOfUsePage from '@/pages/legal/TermsOfUsePage';
import CopyrightPolicyPage from '@/pages/legal/CopyrightPolicyPage';

import DashboardLayout from '@/components/DashboardLayout';
import AuthGuard from '@/components/auth/AuthGuard';
import { AuthProvider } from '@/hooks/useAuth';

import LegacyPostCreate from '@/pages/dashboard/CreateContentPage';
import LegacyPostEdit from '@/pages/dashboard/legacy-vault/CreateLegacyPost';
import IdeaPostCreate from '@/pages/dashboard/idea-vault/CreateIdeaPost';
import TimelessMessageCreate from '@/pages/dashboard/timeless-messages/CreateTimelessMessage';
import MentorshipResourceCreate from '@/pages/dashboard/mentorship/CreateWisdomResource';
import BecomeMentorPage from '@/pages/dashboard/BecomeMentorPage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AuthProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/signin" element={<SigninPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Feature Pages */}
            <Route path="/features/legacy-vault" element={<FeatureLegacyVaultPage />} />
            <Route path="/features/idea-vault" element={<FeatureIdeaVaultPage />} />
            <Route path="/features/mentorship" element={<FeatureMentorshipPage />} />
            <Route path="/features/timeless-messages" element={<FeatureTimelessMessagesPage />} />

            {/* Legal Pages */}
            <Route path="/legal/community-guidelines" element={<CommunityGuidelinesPage />} />
            <Route path="/legal/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/legal/terms-of-use" element={<TermsOfUsePage />} />
            <Route path="/legal/copyright-policy" element={<CopyrightPolicyPage />} />

            {/* Admin Routes - Nested routing to keep sidebar visible */}
            <Route
              path="/admin"
              element={
                <AuthGuard>
                  <AdminDashboard />
                </AuthGuard>
              }
            >
              <Route index element={<AdminOverview />} />
              <Route path="users" element={<UsersManagement />} />
              <Route path="mentor-applications" element={<MentorApplications />} />
              <Route path="subscription-plans" element={<SubscriptionPlans />} />
            </Route>

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
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
