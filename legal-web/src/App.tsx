import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/HomePage';
import ContrattiPage from './pages/ContrattiPage';
import IPPage from './pages/IPPage';
import ScadenzePage from './pages/ScadenzePage';
import CompliancePage from './pages/CompliancePage';
import ContenziosoPage from './pages/ContenziosoPage';
import AIPage from './pages/AIPage';
import SettingsPage from './pages/SettingsPage';
export default function App() {
  return (<MainLayout><Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/contratti" element={<ContrattiPage />} />
        <Route path="/ip" element={<IPPage />} />
        <Route path="/scadenze" element={<ScadenzePage />} />
        <Route path="/compliance" element={<CompliancePage />} />
        <Route path="/contenzioso" element={<ContenziosoPage />} />
        <Route path="/ai" element={<AIPage />} />
        <Route path="/impostazioni" element={<SettingsPage />} />
      </Routes></MainLayout>);
}
