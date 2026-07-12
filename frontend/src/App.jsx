import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import DriversPage from './pages/DriversPage';
import SettingsPage from './pages/SettingsPage';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/drivers" replace />} />
          <Route path="drivers" element={<DriversPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<div className="text-on-surface">Page not found</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
