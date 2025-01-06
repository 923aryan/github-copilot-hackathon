import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import Navbar from './components/common/navbar';
import CreateDigitalLegacy, { CreateDigitalLegacyWrapper } from './components/CreateLegacy/createLegacy';
import { Dashboard } from './components/HomePage/dashboard';
import Memories from './components/HomePage/memories';
import LoginPage from './components/Login';
import AuthCallback from './components/Login/authCallback';
import ResetPassword from './components/Login/reset-password';
import VerifyEmail from './components/Login/verify-email';
import { AuthProvider, useAuth } from './context/authContext';
import { useToast } from './hooks/use-toast';
import { PreviewWrapper } from './components/CreateLegacy/preview';
import UserCapsule from './components/HomePage/usersCapsule';


const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        duration: 2000
      });
      localStorage.setItem('redirectTo', location.pathname);
    }
  }, [isAuthenticated, location.pathname, toast]);

  if (!isAuthenticated) {
    console.log("navigating to login")
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={
            <Dashboard />
          } />
          <Route path="/memories" element={
            <Memories />
          } />
          <Route path="/preview" element={
            <PreviewWrapper />
          } />
          <Route path="/update/memory" element={
            <CreateDigitalLegacyWrapper />
          } />
          <Route path="/auth/github-callback" element={<AuthCallback />} />
          <Route path="/auth/reset-password" element={<ResetPassword />} />
          <Route path="/auth/verify-email" element={<VerifyEmail />} />
          <Route path='/create' element={
            <ProtectedRoute>
              <CreateDigitalLegacy />
            </ProtectedRoute>
          } />
          <Route path='/dashboard' element={
            <ProtectedRoute>
              <CreateDigitalLegacy />
            </ProtectedRoute>
          } />
             <Route path='/user-capsule/:userId' element={
              <UserCapsule />
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
