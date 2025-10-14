import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Header } from './components/Header';
import { Login } from './pages/Login';
import { EmployeeView } from './pages/EmployeeView';
import { ManagerView } from './pages/ManagerView';

const AppContent: React.FC = () => {
  const { userRole } = useAuth();

  return (
    <>
      <Header />
      {!userRole && <Login />}
      {userRole === 'employee' && <EmployeeView />}
      {userRole === 'manager' && <ManagerView />}
    </>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};
