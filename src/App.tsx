import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/hooks/useAuth';
import AuthGuard from '@/components/auth/AuthGuard';
import DashboardLayout from '@/components/DashboardLayout';

import HomePage from '@/pages/HomePage'; // Eager load for better first-paint

// Lazy-loaded route pages
const DashboardHome = lazy(() => import('@/pages/dashboard/DashboardHome'));
const LegacyVaultPage = lazy(() => import('@/pages/dashboard/LegacyVaultPage'));
const LegacyPostEdit = lazy(() => import('@/pages/dashboard/legacy-vault/CreateLegacyPost'));
const IdeaVaultPage = lazy(() => import('@/pages/dashboard/IdeaVaultPage'));
const IdeaPostCreate = lazy(() => import('@/pages/dashboard/idea-vault/CreateIdeaPost'));
const MentorshipPage = lazy(() => import('@/pages/dashboard/MentorshipPage'));
const MentorshipResourceCreate = lazy(() => import('@/pages/dashboard/mentorship/CreateWisdomResource'));
const TimelessMessagesPage = lazy(() => import('@/pages/dashboard/TimelessMessagesPage'));
const TimelessMessageCreate = lazy(() => import('@/pages/dashboard/timeless-messages/CreateTimelessMessage'));
const SettingsPage = lazy(() => import('@/pages/dashboard/SettingsPage'));
const ProfilePage = lazy(() => import('@/pages/dashboard/ProfilePage'));
const BecomeMentorPage = lazy(() => import('@/pages/dashboard/BecomeMentorPage'));

const SigninPage = lazy(() => import('@/pages/SignIn'));
const SignupPage = lazy(() => import('@/pages/SignUp'));
const PricingPage = lazy(() => import('@/pages/pricing'));
const NotFoundPage = lazy(() => import('@/pages/NotFound'));

const FeatureLegacyVaultPage = lazy(() => import('@/pages/features/LegacyVaultPage'));
const FeatureIdeaVaultPage = lazy(() => import('@/pages/features/IdeaVaultPage'));
const FeatureMentorshipPage = lazy(() => import('@/pages/features/MentorshipPage'));
const FeatureTimelessMessagesPage = lazy(() => import('@/pages/features/TimelessMessagesPage'));

const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));
const AdminOverview = lazy(() => import('@/pages/admin/AdminOverview'));
const UsersManagement = lazy(() => import('@/pages/admin/UsersManagement'));
const MentorApplications = lazy(() => import('@/pages/admin/MentorApplications'));
const SubscriptionPlans = lazy(() => import('@/pages/admin/SubscriptionPlans'));

const CommunityGuidelinesPage = lazy(() => import('@/pages/legal/CommunityGuidelinesPage'));
const PrivacyPolicyPage = lazy(() => import('@/pages/legal/PrivacyPolicyPage'));
const TermsOfUsePage = lazy(() => import('@/pages/legal/TermsOfUsePage'));
const CopyrightPolicyPage = lazy(() => import('@/pages/legal/CopyrightPolicyPage'));

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AuthProvider>
          <Suspense fallback={<div className="p-6 text-center">Loading...</div>}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/signin" element={<SigninPage />} />
              <Route path="/signup" element={<SignupPage />} />

              <Route path="/features/legacy-vault" element={<FeatureLegacyVaultPage />} />
              <Route path="/features/idea-vault" element={<FeatureIdeaVaultPage />} />
              <Route path="/features/mentorship" element={<FeatureMentorshipPage />} />
              <Route path="/features/timeless-messages" element={<FeatureTimelessMessagesPage />} />

              <Route path="/legal/community-guidelines" element={<CommunityGuidelinesPage />} />
              <Route path="/legal/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/legal/terms-of-use" element={<TermsOfUsePage />} />
              <Route path="/legal/copyright-policy" element={<CopyrightPolicyPage />} />

              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <AuthGuard>
                    <AdminDashboard />
                  </AuthGuard>
                }
              >
                <Route index element={<AdminOverview />} />
                <Route 
                  path="users" 
                  element={<UsersManagement />} 
                />
                <Route 
                  path="mentor-applications" 
                  element={<MentorApplications />} 
                />
                <Route 
                  path="subscription-plans" 
                  element={<SubscriptionPlans />} 
                />
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

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
