import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import VictimApp from './apps/victim/VictimApp';
import DashboardApp from './apps/dashboard/DashboardApp';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<VictimApp />} />
        <Route path="/dashboard" element={<DashboardApp />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
