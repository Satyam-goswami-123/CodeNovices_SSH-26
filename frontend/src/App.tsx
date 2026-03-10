import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { VoiceAssistant } from './components/VoiceAssistant';
import { Login } from './pages/Login';
import { CitizenDashboard } from './pages/CitizenDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { SmartLandVerification } from './pages/SmartLandVerification';
import { FundTransparency } from './pages/FundTransparency';
import { AiHub } from './pages/AiHub';
import { DigitalDocumentLocker } from './pages/DigitalDocumentLocker';
import { EligibilityEnginePage } from './pages/EligibilityEnginePage';
import { PaymentTrackingPage } from './pages/PaymentTrackingPage';
import { BlockchainLedger } from './pages/BlockchainLedger';
import { GatewayPage } from './pages/GatewayPage';
import { UserCentricHubPage } from './pages/UserCentricHubPage';
import { LanguageProvider } from './context/LanguageContext';

export default function App() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Listen to Firebase auth state changes for persistent sessions
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in — restore role from localStorage or default to 'citizen'
        const savedRole = localStorage.getItem('userRole');
        setUserRole(savedRole || 'citizen');
      } else {
        // User is signed out
        setUserRole(null);
        localStorage.removeItem('userRole');
        localStorage.removeItem('adminDept');
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = (role: string) => {
    setUserRole(role);
    localStorage.setItem('userRole', role);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Logout error:', err);
    }
    setUserRole(null);
    localStorage.removeItem('userRole');
    localStorage.removeItem('adminDept');
  };

  // Show a loading screen while checking Firebase auth state
  if (authLoading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: '#0a0a0a',
        color: '#fff',
        fontFamily: 'Inter, sans-serif',
        fontSize: '1.1rem',
        gap: '12px',
      }}>
        <div style={{
          width: 24,
          height: 24,
          border: '3px solid rgba(255,255,255,0.2)',
          borderTopColor: '#3b82f6',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        Loading...
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <LanguageProvider>
      <Router>
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 font-sans flex flex-col">
          {/* Navbar always visible — shows Login button when not authenticated */}
          <Navbar userRole={userRole} onLogout={handleLogout} />

          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar always visible — shows citizen links for guest users */}
            <Sidebar userRole={userRole} />

            <main className="flex-1 overflow-y-auto">
              <Routes>
                {/* Default route: go to citizen dashboard (freely browsable) */}
                <Route path="/" element={<Navigate to="/citizen" replace />} />

                {/* Login page: accessible voluntarily, redirects away if already logged in */}
                <Route path="/login" element={!userRole ? <Login onLogin={handleLogin} /> : <Navigate to={userRole === 'admin' ? '/admin' : '/citizen'} replace />} />

                {/* ===== Freely Browsable Pages (no login required) ===== */}
                <Route path="/citizen" element={<CitizenDashboard />} />
                <Route path="/land-verification" element={<SmartLandVerification />} />
                <Route path="/transparency" element={<FundTransparency />} />
                <Route path="/ai-hub" element={<AiHub />} />
                <Route path="/locker" element={<DigitalDocumentLocker />} />
                <Route path="/eligibility" element={<EligibilityEnginePage />} />
                <Route path="/payments" element={<PaymentTrackingPage />} />
                <Route path="/admin/blockchain" element={<BlockchainLedger />} />
                <Route path="/gateway" element={<GatewayPage />} />
                <Route path="/user-hub" element={<UserCentricHubPage />} />

                {/* Admin dashboard: requires admin role */}
                <Route
                  path="/admin"
                  element={userRole === 'admin' ? <AdminDashboard /> : <Navigate to="/login" replace />}
                />
              </Routes>
            </main>
          </div>

          <VoiceAssistant />
        </div>
      </Router>
    </LanguageProvider>
  );
}
