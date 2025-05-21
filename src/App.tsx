
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import DashboardLayout from './components/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import LegacyVaultPage from './pages/dashboard/LegacyVaultPage';
import IdeaVaultPage from './pages/dashboard/IdeaVaultPage';
import MentorshipPage from './pages/dashboard/MentorshipPage';
import TimelessMessagesPage from './pages/dashboard/TimelessMessagesPage';
import ProfilePage from './pages/dashboard/ProfilePage';
import PricingPage from './pages/pricing/index';
import TermsOfUsePage from './pages/legal/TermsOfUsePage';
import PrivacyPolicyPage from './pages/legal/PrivacyPolicyPage';
import CopyrightPolicyPage from './pages/legal/CopyrightPolicyPage';
import CommunityGuidelinesPage from './pages/legal/CommunityGuidelinesPage';
import NotFound from './pages/NotFound';
import AuthGuard from './components/auth/AuthGuard';
import UnauthorizedPage from './pages/UnauthorizedPage';
import CreateLegacyPost from './pages/dashboard/legacy-vault/CreateLegacyPost';
import CreateIdeaPost from './pages/dashboard/idea-vault/CreateIdeaPost';
import CreateWisdomResource from './pages/dashboard/mentorship/CreateWisdomResource';
import CreateTimelessMessage from './pages/dashboard/timeless-messages/CreateTimelessMessage';

// Admin Dashboard Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOverview from './pages/admin/AdminOverview';
import UsersManagement from './pages/admin/UsersManagement';
import SubscriptionPlans from './pages/admin/SubscriptionPlans';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      
      {/* Add admin routes */}
      <Route path="/admin" element={
        <AuthGuard>
          <AdminDashboard />
        </AuthGuard>
      }>
        <Route index element={<AdminOverview />} />
        <Route path="users" element={<UsersManagement />} />
        <Route path="subscriptions" element={<SubscriptionPlans />} />
        <Route path="settings" element={<div>Admin Settings</div>} />
      </Route>
      
      {/* Feature pages */}
      <Route path="/features/legacy-vault" element={<LegacyVaultPage />} />
      <Route path="/features/timeless-messages" element={<TimelessMessagesPage />} />
      <Route path="/features/mentorship" element={<MentorshipPage />} />
      <Route path="/features/idea-vault" element={<IdeaVaultPage />} />
      
      {/* Dashboard paths */}
      <Route path="/dashboard" element={
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      }>
        <Route index element={<DashboardHome />} />
        <Route path="legacy-vault" element={<LegacyVaultPage />} />
        <Route path="legacy-vault/create" element={<CreateLegacyPost />} />
        <Route path="idea-vault" element={<IdeaVaultPage />} />
        <Route path="idea-vault/create" element={<CreateIdeaPost />} />
        <Route path="mentorship" element={<MentorshipPage />} />
        <Route path="mentorship/create" element={<CreateWisdomResource />} />
        <Route path="timeless-messages" element={<TimelessMessagesPage />} />
        <Route path="timeless-messages/create" element={<CreateTimelessMessage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<div>Settings</div>} />
      </Route>
      
      {/* Pricing */}
      <Route path="/pricing" element={<PricingPage />} />
      
      {/* Legal */}
      <Route path="/legal/terms" element={<TermsOfUsePage />} />
      <Route path="/legal/privacy" element={<PrivacyPolicyPage />} />
      <Route path="/legal/copyright" element={<CopyrightPolicyPage />} />
      <Route path="/legal/community" element={<CommunityGuidelinesPage />} />
      
      {/* 404 route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
