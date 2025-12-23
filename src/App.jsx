import './App.css';
import AuthPage from './modules/auth/components/AuthPage';
import CardScannerPage from './modules/card-scanner/CardScannerPage';
import CompanyProfile from './modules/company-profile/CompanyProfile';
import DashboardPage from './modules/dashboard/components/DashboardPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './modules/dashboard/pages/Home';
// import Navbar from './modules/dashboard/components/Navbar';
// import Leads from './modules/dashboard/pages/Leads';
import SettingsPage from './modules/settings/SettingsPage';
import MeetingCapturePage from './modules/meeting-capture/MeetingCapturePage';
import EmailDraftPage from './modules/email-draft/EmailDraftPage';
import OAuthSuccess from './modules/auth/views/OAuthSuccess';
import { AuthService } from './modules/auth/models/authService';
import { Navigate } from 'react-router-dom';

/**
 * Higher Order Component to protect routes.
 * Redirects to login if not authenticated.
 * Redirects to verify-email if email not verified.
 */
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = AuthService.isAuthenticated();
  const user = AuthService.getUserData();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user && !user.email_verified) {
    return <Navigate to="/login/verify-email" replace />;
  }

  return children;
};

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path='/login/*' element={<AuthPage />} />
        <Route path='/oauth-success' element={<OAuthSuccess />} />

        {/* Protected Routes */}
        <Route path='/dashboard' element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path='/card-scanner' element={<ProtectedRoute><CardScannerPage /></ProtectedRoute>} />
        <Route path="/company-person-profile" element={<ProtectedRoute><CompanyProfile /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        <Route path='/meetings' element={<ProtectedRoute><MeetingCapturePage /></ProtectedRoute>} />
        <Route path='/emails/*' element={<ProtectedRoute><EmailDraftPage /></ProtectedRoute>} />
      </Routes>
    </Router>
  )
}

export default App
