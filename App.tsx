
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { AppointmentList } from './components/AppointmentList';
import { Waitlist } from './components/Waitlist';
import { ChatView } from './components/ChatView';
import { Settings } from './components/Settings';
import { PatientDetails } from './components/PatientDetails';
import { AITraining } from './components/AITraining';
import { QRCodeScanner } from './components/QRCodeScanner';
import { SaaSAdmin } from './components/SaaSAdmin';
import { Billing } from './components/Billing';
import { Onboarding } from './components/Onboarding';
import { Login } from './components/Login';
import { LandingPage } from './components/LandingPage';
import { ViewState, KPIData, Patient, UserRole } from './types';

const MOCK_KPI: KPIData = {
  noShowReduction: 78,
  revenueSaved: 3450.00,
  recoveredSlots: 14,
  responseRate: 92,
  riskAnalysis: {
    high: 12,
    medium: 28,
    low: 60
  }
};

const App: React.FC = () => {
  // Auth State
  const [showLanding, setShowLanding] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('CLINIC_OWNER');

  // App State
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [whatsappConnected, setWhatsappConnected] = useState<boolean>(false);
  const [kpiData, setKpiData] = useState<KPIData>(MOCK_KPI);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  
  useEffect(() => {
    // Add fade-in animation styles dynamically
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animate-fade-in {
        animation: fadeIn 0.4s ease-out forwards;
      }
    `;
    document.head.appendChild(style);
  }, []);

  const handleLogin = (role: UserRole) => {
      setUserRole(role);
      setIsAuthenticated(true);
      setShowLanding(false); // Ensure landing is hidden
      // If Owner, assume they might need onboarding (mock logic)
      if (role === 'CLINIC_OWNER') {
          // For demo purposes, we can toggle this to true to test Onboarding
          setHasCompletedOnboarding(true); 
      } else {
          setHasCompletedOnboarding(true);
      }
  };

  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
  };

  const renderContent = () => {
    switch (currentView) {
      case ViewState.DASHBOARD:
        return <Dashboard kpi={kpiData} userRole={userRole} />;
      case ViewState.AGENDA:
        return <AppointmentList 
                  whatsappConnected={whatsappConnected} 
                  onSelectPatient={handleSelectPatient} 
                  onRequestScan={() => setShowScanner(true)}
               />;
      case ViewState.WAITLIST:
        return <Waitlist onSelectPatient={handleSelectPatient} />;
      case ViewState.CHATS:
        return <ChatView onSelectPatient={handleSelectPatient} />;
      case ViewState.TRAINING:
        return <AITraining />;
      case ViewState.SAAS_ADMIN:
        return <SaaSAdmin />;
      case ViewState.BILLING:
        return <Billing />;
      case ViewState.SETTINGS:
        return <Settings 
                 connected={whatsappConnected} 
                 onToggleConnection={() => setWhatsappConnected(!whatsappConnected)} 
                 userRole={userRole}
               />;
      default:
        return <Dashboard kpi={kpiData} userRole={userRole} />;
    }
  };

  // 1. Landing Page Check
  if (showLanding && !isAuthenticated) {
    return (
      <LandingPage 
        onLoginClick={() => setShowLanding(false)} 
        onSignupClick={() => setShowLanding(false)} 
      />
    );
  }

  // 2. Auth Check (Login)
  if (!isAuthenticated) {
      return <Login onLogin={handleLogin} />;
  }

  // 3. Onboarding Check (Only for Owners who haven't finished)
  if (!hasCompletedOnboarding && userRole === 'CLINIC_OWNER') {
      return <Onboarding onComplete={() => setHasCompletedOnboarding(true)} />;
  }

  // 4. Main App Layout
  return (
    <Layout 
      currentView={currentView} 
      setView={setCurrentView}
      whatsappConnected={whatsappConnected}
      onRequestScan={() => setShowScanner(true)}
      userRole={userRole}
      setUserRole={setUserRole}
    >
      {renderContent()}
      
      {/* Global Patient Details Panel */}
      {selectedPatient && (
        <PatientDetails 
            patient={selectedPatient} 
            onClose={() => setSelectedPatient(null)} 
        />
      )}

      {/* Global QR Scanner */}
      {showScanner && (
        <QRCodeScanner 
          onScanSuccess={(id) => {
              console.log("Scanned:", id);
              setShowScanner(false);
          }}
          onClose={() => setShowScanner(false)}
        />
      )}
    </Layout>
  );
};

export default App;
