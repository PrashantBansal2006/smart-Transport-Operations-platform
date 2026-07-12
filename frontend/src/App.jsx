import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import DriversPage from './pages/DriversPage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TripsDispatcher from './pages/TripDispatcher';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Protected Dashboard Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/drivers" replace />} />
            <Route path="drivers" element={<DriversPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="trips" element={<TripsDispatcher />} />
            <Route path="*" element={<div className="text-on-surface">Page not found</div>} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;
