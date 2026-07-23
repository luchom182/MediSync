import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';

const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="skeleton" style={{ width: '60px', height: '60px', borderRadius: '16px', margin: '0 auto 16px' }} />
          <p style={{ fontWeight: 600 }}>Cargando MediSync...</p>
        </div>
      </div>
    );
  }

  return user ? <DashboardPage /> : <AuthPage />;
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
