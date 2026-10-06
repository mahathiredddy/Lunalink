import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AppLayout } from './components/layout/AppLayout';
import { ToastContainer } from './components/ui/ToastContainer';

// Public Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';

// Authenticated Pages
import { DashboardPage } from './pages/DashboardPage';
import { CycleCalendarPage } from './pages/CycleCalendarPage';
import { SharedCalendarPage } from './pages/SharedCalendarPage';
import { SymptomsPainPage } from './pages/SymptomsPainPage';
import { WomensHealthPage } from './pages/WomensHealthPage';
import { HealthcarePage } from './pages/HealthcarePage';
import { CareProfilePage } from './pages/CareProfilePage';
import { CareModePage } from './pages/CareModePage';
import { SupportInsightsPage } from './pages/SupportInsightsPage';
import { CareSuggestionsPage } from './pages/CareSuggestionsPage';
import { ConnectPartnerPage } from './pages/ConnectPartnerPage';
import { PartnerProfilePage } from './pages/PartnerProfilePage';
import { SharedSpacePage } from './pages/SharedSpacePage';
import { PrivacySharingPage } from './pages/PrivacySharingPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { MemoryVaultPage } from './pages/MemoryVaultPage';
import { SettingsPage } from './pages/SettingsPage';
import { UserProfilePage } from './pages/UserProfilePage';

const AppContent: React.FC = () => {
  const { currentPage } = useApp();

  // Public View Router
  if (currentPage === 'landing') {
    return (
      <>
        <LandingPage />
        <ToastContainer />
      </>
    );
  }

  if (currentPage === 'login') {
    return (
      <>
        <LoginPage />
        <ToastContainer />
      </>
    );
  }

  if (currentPage === 'signup') {
    return (
      <>
        <SignUpPage />
        <ToastContainer />
      </>
    );
  }

  if (currentPage === 'forgot-password') {
    return (
      <>
        <ForgotPasswordPage />
        <ToastContainer />
      </>
    );
  }

  // Authenticated View Router (wrapped in AppLayout)
  return (
    <AppLayout>
      {currentPage === 'dashboard' && <DashboardPage />}
      {currentPage === 'cycle-calendar' && <CycleCalendarPage />}
      {currentPage === 'womens-health' && <WomensHealthPage />}
      {currentPage === 'healthcare' && <HealthcarePage />}
      {currentPage === 'shared-calendar' && <SharedCalendarPage />}
      {currentPage === 'symptoms-pain' && <SymptomsPainPage />}
      {currentPage === 'care-profile' && <CareProfilePage />}
      {currentPage === 'care-mode' && <CareModePage />}
      {currentPage === 'support-insights' && <SupportInsightsPage />}
      {currentPage === 'care-suggestions' && <CareSuggestionsPage />}
      {currentPage === 'connect-partner' && <ConnectPartnerPage />}
      {currentPage === 'partner-profile' && <PartnerProfilePage />}
      {currentPage === 'shared-space' && <SharedSpacePage />}
      {currentPage === 'privacy-sharing' && <PrivacySharingPage />}
      {currentPage === 'notifications' && <NotificationsPage />}
      {currentPage === 'memory-vault' && <MemoryVaultPage />}
      {currentPage === 'settings' && <SettingsPage />}
      {currentPage === 'user-profile' && <UserProfilePage />}
    </AppLayout>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
