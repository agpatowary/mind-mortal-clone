
import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Toaster } from '@/components/ui/toaster';
import LoadingScreen from '@/components/LoadingScreen';
import AuthGuard from '@/components/auth/AuthGuard';
import DashboardLayout from '@/components/DashboardLayout';

// Lazy-loaded components
const HomePage = lazy(() => import('@/pages/HomePage'));
const SignIn = lazy(() => import('@/pages/SignIn'));
const SignUp = lazy(() => import('@/pages/SignUp'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const UnauthorizedPage = lazy(() => import('@/pages/UnauthorizedPage'));

// Dashboard pages
const DashboardHome = lazy(() => import('@/pages/dashboard/DashboardHome'));
const ProfilePage = lazy(() => import('@/pages/dashboard/ProfilePage'));
const SettingsPage = lazy(() => import('@/pages/dashboard/SettingsPage'));
const LegacyVaultPage = lazy(() => import('@/pages/dashboard/LegacyVaultPage'));
const IdeaVaultPage = lazy(() => import('@/pages/dashboard/IdeaVaultPage'));
const TimelessMessagesPage = lazy(() => import('@/pages/dashboard/TimelessMessagesPage'));
const MentorshipPage = lazy(() => import('@/pages/dashboard/MentorshipPage'));
const CreateContentPage = lazy(() => import('@/pages/dashboard/CreateContentPage'));

// Legacy Vault
const CreateLegacyPost = lazy(() => import('@/pages/dashboard/legacy-vault/CreateLegacyPost'));

// Idea Vault
const CreateIdeaPost = lazy(() => import('@/pages/dashboard/idea-vault/CreateIdeaPost'));

// Timeless Messages
const CreateTimelessMessage = lazy(() => import('@/pages/dashboard/timeless-messages/CreateTimelessMessage'));

// Mentorship (Wisdom Exchange)
const CreateWisdomResource = lazy(() => import('@/pages/dashboard/mentorship/CreateWisdomResource'));

// Admin pages
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));
const AdminOverview = lazy(() => import('@/pages/admin/AdminOverview'));
const UsersManagement = lazy(() => import('@/pages/admin/UsersManagement'));
const MentorApplicationsPage = lazy(() => import('@/pages/admin/MentorApplicationsPage'));
const SubscriptionPlans = lazy(() => import('@/pages/admin/SubscriptionPlans'));

// Feature pages for homepage
const LegacyVaultFeaturePage = lazy(() => import('@/pages/features/LegacyVaultPage'));
const IdeaVaultFeaturePage = lazy(() => import('@/pages/features/IdeaVaultPage'));
const TimelessMessagesFeaturePage = lazy(() => import('@/pages/features/TimelessMessagesPage'));
const MentorshipFeaturePage = lazy(() => import('@/pages/features/MentorshipPage'));

// Pricing page
const PricingPage = lazy(() => import('@/pages/pricing'));

// Legal pages
const PrivacyPolicyPage = lazy(() => import('@/pages/legal/PrivacyPolicyPage'));
const TermsOfUsePage = lazy(() => import('@/pages/legal/TermsOfUsePage'));
const CommunityGuidelinesPage = lazy(() => import('@/pages/legal/CommunityGuidelinesPage'));
const CopyrightPolicyPage = lazy(() => import('@/pages/legal/CopyrightPolicyPage'));

function App() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        
        {/* Feature pages */}
        <Route path="/features/legacy-vault" element={<LegacyVaultFeaturePage />} />
        <Route path="/features/idea-vault" element={<IdeaVaultFeaturePage />} />
        <Route path="/features/timeless-messages" element={<TimelessMessagesFeaturePage />} />
        <Route path="/features/mentorship" element={<MentorshipFeaturePage />} />
        
        {/* Legal pages */}
        <Route path="/legal/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/legal/terms-of-use" element={<TermsOfUsePage />} />
        <Route path="/legal/community-guidelines" element={<CommunityGuidelinesPage />} />
        <Route path="/legal/copyright-policy" element={<CopyrightPolicyPage />} />
        
        {/* Protected dashboard routes */}
        <Route
          path="/dashboard"
          element={
            <AuthGuard>
              <DashboardLayout />
            </AuthGuard>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="home" element={<DashboardHome />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="legacy-vault" element={<LegacyVaultPage />} />
          <Route path="legacy-vault/create" element={<CreateLegacyPost />} />
          <Route path="idea-vault" element={<IdeaVaultPage />} />
          <Route path="idea-vault/create" element={<CreateIdeaPost />} />
          <Route path="timeless-messages" element={<TimelessMessagesPage />} />
          <Route path="timeless-messages/create" element={<CreateTimelessMessage />} />
          <Route path="mentorship" element={<MentorshipPage />} />
          <Route path="mentorship/create-resource" element={<CreateWisdomResource />} />
          <Route path="create-content" element={<CreateContentPage />} />
        </Route>
        
        {/* Admin routes */}
        <Route
          path="/admin"
          element={
            <AuthGuard requiredRole="admin">
              <AdminDashboard />
            </AuthGuard>
          }
        >
          <Route index element={<AdminOverview />} />
          <Route path="users" element={<UsersManagement />} />
          <Route path="mentor-applications" element={<MentorApplicationsPage />} />
          <Route path="subscription-plans" element={<SubscriptionPlans />} />
        </Route>
        
        {/* Catch-all route for 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      <Toaster />
    </Suspense>
  );
}

export default App;
