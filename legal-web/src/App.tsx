import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/HomePage';
import ContrattiPage from './pages/ContrattiPage';
import IPPage from './pages/IPPage';
import ScadenzePage from './pages/ScadenzePage';
import CompliancePage from './pages/CompliancePage';
import ContenziosoPage from './pages/ContenziosoPage';
import AnalisiRischioPage from './pages/AnalisiRischioPage';
import AnalisiContrattiPage from './pages/AnalisiContrattiPage';
import Modello231Page from './pages/Modello231Page';
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
        <Route path="/analisi-rischio" element={<AnalisiRischioPage />} />
        <Route path="/analisi-contratti" element={<AnalisiContrattiPage />} />
        <Route path="/modello-231" element={<Modello231Page />} />
        <Route path="/ai" element={<AIPage />} />
        <Route path="/impostazioni" element={<SettingsPage />} />
      </Routes></MainLayout>);
}
