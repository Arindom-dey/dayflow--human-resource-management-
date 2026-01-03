import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import MainLayout from './layouts/MainLayout';
import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';
import FirstTimeLogin from './pages/auth/FirstTimeLogin';
import ChangePassword from './pages/auth/ChangePassword';
import EmployeeDashboard from './pages/dashboard/EmployeeDashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import Profile from './pages/profile/Profile';
import EmployeeList from './pages/employees/EmployeeList';
import AddEmployee from './pages/employees/AddEmployee';
import AttendanceView from './pages/attendance/AttendanceView';
import LeaveManagement from './pages/leaves/LeaveManagement';
import Payroll from './pages/payroll/Payroll';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #4F46E5', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <p style={{ fontFamily: 'sans-serif', color: '#666' }}>Loading NexHR...</p>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const Dashboard = () => {
  const { user } = useAuth();
  if (!user) return null;
  return user.role === 'admin' ? <AdminDashboard /> : <EmployeeDashboard />;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/activate" element={<FirstTimeLogin />} />
            <Route path="/change-password" element={<ChangePassword />} />

            <Route path="/" element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/employees" replace />} />
              <Route path="profile" element={<Profile />} />
              <Route path="employees" element={<EmployeeList />} />
              <Route path="employees/new" element={<AddEmployee />} />
              <Route path="employees/:id" element={<Profile />} />
              <Route path="attendance" element={<AttendanceView />} />
              <Route path="leaves" element={<LeaveManagement />} />
              <Route path="payroll" element={<Payroll />} />
            </Route>

          </Routes>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
