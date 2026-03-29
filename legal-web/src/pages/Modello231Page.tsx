import { useEffect, useState, useCallback } from 'react';
import {
  Container, Title, TextInput, Group, Button, Table, Pagination, Paper,
  Modal, Text, Stack, Badge, ActionIcon, Loader, SimpleGrid,
  ThemeIcon, Tabs, Select, Textarea,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import {
  IconPlus, IconSearch, IconEdit, IconTrash, IconEye,
  IconShieldCheck, IconAlertTriangle, IconFileDescription,
  IconListCheck, IconArrowsExchange, IconChecklist,
  IconBuildingCommunity,
} from '@tabler/icons-react';
import apiClient from '../lib/api-client';

/* ---- Types ---- */
interface ModelloOrganizzativo {
  id: string;
  versione: string;
  dataApprovazione: string;
  stato: 'vigente' | 'in_revisione' | 'superato';
  approvatore: string;
  descrizione: string;
  note?: string;
}

interface AreaRischio {
  id: string;
  codice: string;
  nome: string;
  descrizione: string;
  livelloRischio: 'basso' | 'medio' | 'alto' | 'critico';
  probabilita: number;
  impatto: number;
  rischioResiduo: number;
  processoCoinvolto: string;
  responsabile: string;
  createdAt: string;
  updatedAt: string;
}

interface Protocollo {
  id: string;
  codice: string;
  nome: string;
  areaRischioId: string;
  areaRischioNome: string;
  descrizione: string;
  stato: 'attivo' | 'in_revisione' | 'scaduto' | 'sospeso';
  dataScadenza: string;
  responsabile: string;
  createdAt: string;
  updatedAt: string;
}

interface FlussoOdV {
  id: string;
  tipo: 'segnalazione' | 'informativa' | 'relazione';
  oggetto: string;
  mittente: string;
  dataRicezione: string;
  stato: 'ricevuto' | 'in_esame' | 'esaminato' | 'archiviato';
  priorita: 'bassa' | 'media' | 'alta' | 'urgente';
  descrizione: string;
  esitoEsame?: string;
  createdAt: string;
}

interface VerificaOdV {
  id: string;
  tipo: 'programmata' | 'straordinaria';
  oggetto: string;
  areaVerificata: string;
  dataVerifica: string;
  stato: 'pianificata' | 'in_corso' | 'completata' | 'non_conforme';
  esito?: 'conforme' | 'non_conforme' | 'parzialmente_conforme';
  verificatore: string;
  nonConformita?: string;
  azioniCorrettive?: string;
  createdAt: string;
}

interface PagedData<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

interface KpiData {
  areeRischioAlto: number;
  protocolliScaduti: number;
  segnalazioniAperte: number;
  verifichePianificate: number;
  nonConformita: number;
  protocolliAttivi: number;
}

const API_URL = '/api/modello231';

export default function Modello231Page() {
  const [activeTab, setActiveTab] = useState<string | null>('modello');

  /* Modello */
  const [modello, setModello] = useState<ModelloOrganizzativo | null>(null);
  const [loadingM, setLoadingM] = useState(true);

  /* Aree Rischio */
  const [aree, setAree] = useState<PagedData<AreaRischio> | null>(null);
  const [loadingAr, setLoadingAr] = useState(true);
  const [pageAr, setPageAr] = useState(1);
  const [searchAr, setSearchAr] = useState('');
  const [modalAr, setModalAr] = useState(false);
  const [deleteAr, setDeleteAr] = useState(false);
  const [selectedAr, setSelectedAr] = useState<AreaRischio | null>(null);
  const [editModeAr, setEditModeAr] = useState(false);

  /* Protocolli */
  const [protocolli, setProtocolli] = useState<PagedData<Protocollo> | null>(null);
  const [loadingP, setLoadingP] = useState(true);
  const [pageP, setPageP] = useState(1);
  const [searchP, setSearchP] = useState('');
  const [modalP, setModalP] = useState(false);
  const [deleteP, setDeleteP] = useState(false);
  const [selectedP, setSelectedP] = useState<Protocollo | null>(null);
  const [editModeP, setEditModeP] = useState(false);

  /* Flussi OdV */
  const [flussi, setFlussi] = useState<PagedData<FlussoOdV> | null>(null);
  const [loadingF, setLoadingF] = useState(true);
  const [pageF, setPageF] = useState(1);
  const [searchF, setSearchF] = useState('');
  const [modalF, setModalF] = useState(false);
  const [deleteF, setDeleteF] = useState(false);
  const [selectedF, setSelectedF] = useState<FlussoOdV | null>(null);
  const [editModeF, setEditModeF] = useState(false);

  /* Verifiche OdV */
  const [verifiche, setVerifiche] = useState<PagedData<VerificaOdV> | null>(null);
  const [loadingV, setLoadingV] = useState(true);
  const [pageV, setPageV] = useState(1);
  const [searchV, setSearchV] = useState('');
  const [modalV, setModalV] = useState(false);
  const [deleteV, setDeleteV] = useState(false);
  const [selectedV, setSelectedV] = useState<VerificaOdV | null>(null);
  const [editModeV, setEditModeV] = useState(false);

  /* KPI */
  const [kpi, setKpi] = useState<KpiData>({ areeRischioAlto: 0, protocolliScaduti: 0, segnalazioniAperte: 0, verifichePianificate: 0, nonConformita: 0, protocolliAttivi: 0 });

  /* Forms */
  const formAr = useForm({
    initialValues: { codice: '', nome: '', descrizione: '', livelloRischio: 'basso' as string, probabilita: 1, impatto: 1, processoCoinvolto: '', responsabile: '' },
    validate: { nome: (v) => (v.trim().length < 1 ? 'Nome obbligatorio' : null), codice: (v) => (v.trim().length < 1 ? 'Codice obbligatorio' : null) },
  });
  const formP = useForm({
    initialValues: { codice: '', nome: '', areaRischioNome: '', descrizione: '', stato: 'attivo' as string, dataScadenza: '', responsabile: '' },
    validate: { nome: (v) => (v.trim().length < 1 ? 'Nome obbligatorio' : null), codice: (v) => (v.trim().length < 1 ? 'Codice obbligatorio' : null) },
  });
  const formF = useForm({
    initialValues: { tipo: 'segnalazione' as string, oggetto: '', mittente: '', priorita: 'media' as string, descrizione: '' },
    validate: { oggetto: (v) => (v.trim().length < 1 ? 'Oggetto obbligatorio' : null) },
  });
  const formV = useForm({
    initialValues: { tipo: 'programmata' as string, oggetto: '', areaVerificata: '', dataVerifica: '', verificatore: '', nonConformita: '', azioniCorrettive: '' },
    validate: { oggetto: (v) => (v.trim().length < 1 ? 'Oggetto obbligatorio' : null) },
  });

  /* Data loading */
  const loadModello = async () => {
    setLoadingM(true);
    try {
      const res = await apiClient.get(`${API_URL}/Modello`);
      setModello(res.data.data);
    } catch {
      setModello({ id: '1', versione: '3.1', dataApprovazione: '2025-12-15', stato: 'vigente', approvatore: 'CdA', descrizione: 'Modello di Organizzazione, Gestione e Controllo ai sensi del D.Lgs. 231/2001. Terza revisione con aggiornamento reati ambientali e cybercrime.' });
    } finally { setLoadingM(false); }
  };

  const loadAree = useCallback(async () => {
    setLoadingAr(true);
    try {
      const res = await apiClient.get(`${API_URL}/AreeRischio`, { params: { page: pageAr, pageSize: 20, search: searchAr || undefined } });
      setAree(res.data.data);
    } catch {
      setAree({ items: [
        { id: '1', codice: 'AR-01', nome: 'Reati contro la PA', descrizione: 'Corruzione, concussione, indebita induzione', livelloRischio: 'alto', probabilita: 3, impatto: 5, rischioResiduo: 12, processoCoinvolto: 'Gare e Appalti', responsabile: 'Dir. Acquisti', createdAt: '2025-12-15', updatedAt: '2026-01-10' },
        { id: '2', codice: 'AR-02', nome: 'Reati societari', descrizione: 'False comunicazioni sociali, ostacolo vigilanza', livelloRischio: 'medio', probabilita: 2, impatto: 4, rischioResiduo: 6, processoCoinvolto: 'Amministrazione', responsabile: 'CFO', createdAt: '2025-12-15', updatedAt: '2026-01-10' },
        { id: '3', codice: 'AR-03', nome: 'Reati informatici', descrizione: 'Accesso abusivo, danneggiamento sistemi', livelloRischio: 'alto', probabilita: 4, impatto: 4, rischioResiduo: 10, processoCoinvolto: 'IT', responsabile: 'CTO', createdAt: '2025-12-15', updatedAt: '2026-02-20' },
        { id: '4', codice: 'AR-04', nome: 'Sicurezza sul lavoro', descrizione: 'Omicidio colposo, lesioni personali', livelloRischio: 'critico', probabilita: 2, impatto: 5, rischioResiduo: 8, processoCoinvolto: 'Produzione', responsabile: 'RSPP', createdAt: '2025-12-15', updatedAt: '2026-01-10' },
        { id: '5', codice: 'AR-05', nome: 'Reati ambientali', descrizione: 'Inquinamento, traffico rifiuti', livelloRischio: 'medio', probabilita: 2, impatto: 3, rischioResiduo: 4, processoCoinvolto: 'Produzione', responsabile: 'HSE Manager', createdAt: '2025-12-15', updatedAt: '2026-01-10' },
        { id: '6', codice: 'AR-06', nome: 'Riciclaggio', descrizione: 'Riciclaggio e autoriciclaggio', livelloRischio: 'medio', probabilita: 2, impatto: 4, rischioResiduo: 5, processoCoinvolto: 'Finanza', responsabile: 'CFO', createdAt: '2025-12-15', updatedAt: '2026-03-01' },
      ], totalCount: 6, page: 1, pageSize: 20, totalPages: 1 });
    } finally { setLoadingAr(false); }
  }, [pageAr, searchAr]);

  const loadProtocolli = useCallback(async () => {
    setLoadingP(true);
    try {
      const res = await apiClient.get(`${API_URL}/Protocolli`, { params: { page: pageP, pageSize: 20, search: searchP || undefined } });
      setProtocolli(res.data.data);
    } catch {
      setProtocolli({ items: [
        { id: '1', codice: 'PR-01', nome: 'Gestione rapporti con PA', areaRischioId: '1', areaRischioNome: 'Reati contro la PA', descrizione: 'Protocollo per gestione rapporti con funzionari pubblici', stato: 'attivo', dataScadenza: '2026-12-31', responsabile: 'Dir. Acquisti', createdAt: '2025-12-15', updatedAt: '2026-01-10' },
        { id: '2', codice: 'PR-02', nome: 'Sicurezza informatica', areaRischioId: '3', areaRischioNome: 'Reati informatici', descrizione: 'Protocollo gestione accessi e sicurezza', stato: 'attivo', dataScadenza: '2026-06-30', responsabile: 'CTO', createdAt: '2025-12-15', updatedAt: '2026-02-20' },
        { id: '3', codice: 'PR-03', nome: 'Gestione rifiuti', areaRischioId: '5', areaRischioNome: 'Reati ambientali', descrizione: 'Protocollo smaltimento e tracciamento rifiuti', stato: 'scaduto', dataScadenza: '2026-02-28', responsabile: 'HSE Manager', createdAt: '2025-12-15', updatedAt: '2025-12-15' },
        { id: '4', codice: 'PR-04', nome: 'DVR e formazione sicurezza', areaRischioId: '4', areaRischioNome: 'Sicurezza sul lavoro', descrizione: 'Protocollo aggiornamento DVR e formazione', stato: 'attivo', dataScadenza: '2026-12-31', responsabile: 'RSPP', createdAt: '2025-12-15', updatedAt: '2026-03-15' },
      ], totalCount: 4, page: 1, pageSize: 20, totalPages: 1 });
    } finally { setLoadingP(false); }
  }, [pageP, searchP]);

  const loadFlussi = useCallback(async () => {
    setLoadingF(true);
    try {
      const res = await apiClient.get(`${API_URL}/Flussi`, { params: { page: pageF, pageSize: 20, search: searchF || undefined } });
      setFlussi(res.data.data);
    } catch {
      setFlussi({ items: [
        { id: '1', tipo: 'segnalazione', oggetto: 'Sospetta irregolarita appalto manutenzione', mittente: 'Whistleblower anonimo', dataRicezione: '2026-03-20', stato: 'in_esame', priorita: 'alta', descrizione: 'Segnalazione di possibile conflitto di interessi in procedura di gara', createdAt: '2026-03-20' },
        { id: '2', tipo: 'informativa', oggetto: 'Report trimestrale compliance', mittente: 'Compliance Officer', dataRicezione: '2026-03-15', stato: 'esaminato', priorita: 'media', descrizione: 'Informativa periodica stato adempimenti', esitoEsame: 'Preso atto. Nessuna criticita rilevata.', createdAt: '2026-03-15' },
        { id: '3', tipo: 'relazione', oggetto: 'Audit area IT Q1 2026', mittente: 'Internal Audit', dataRicezione: '2026-03-10', stato: 'ricevuto', priorita: 'media', descrizione: 'Relazione audit sicurezza informatica primo trimestre', createdAt: '2026-03-10' },
      ], totalCount: 3, page: 1, pageSize: 20, totalPages: 1 });
    } finally { setLoadingF(false); }
  }, [pageF, searchF]);

  const loadVerifiche = useCallback(async () => {
    setLoadingV(true);
    try {
      const res = await apiClient.get(`${API_URL}/Verifiche`, { params: { page: pageV, pageSize: 20, search: searchV || undefined } });
      setVerifiche(res.data.data);
    } catch {
      setVerifiche({ items: [
        { id: '1', tipo: 'programmata', oggetto: 'Verifica protocollo gestione PA', areaVerificata: 'Acquisti', dataVerifica: '2026-04-15', stato: 'pianificata', verificatore: 'OdV', createdAt: '2026-03-01' },
        { id: '2', tipo: 'programmata', oggetto: 'Verifica sicurezza IT', areaVerificata: 'IT', dataVerifica: '2026-03-10', stato: 'completata', esito: 'parzialmente_conforme', verificatore: 'OdV', nonConformita: 'Log accessi non conservati per 6 mesi', azioniCorrettive: 'Implementare retention policy', createdAt: '2026-02-15' },
        { id: '3', tipo: 'straordinaria', oggetto: 'Verifica post-segnalazione appalto', areaVerificata: 'Acquisti', dataVerifica: '2026-03-25', stato: 'in_corso', verificatore: 'OdV', createdAt: '2026-03-22' },
      ], totalCount: 3, page: 1, pageSize: 20, totalPages: 1 });
    } finally { setLoadingV(false); }
  }, [pageV, searchV]);

  const loadKpi = async () => {
    try {
      const res = await apiClient.get(`${API_URL}/kpi`);
      setKpi(res.data.data);
    } catch {
      setKpi({ areeRischioAlto: 3, protocolliScaduti: 1, segnalazioniAperte: 2, verifichePianificate: 3, nonConformita: 1, protocolliAttivi: 3 });
    }
  };

  useEffect(() => { loadModello(); loadKpi(); }, []);
  useEffect(() => { loadAree(); }, [loadAree]);
  useEffect(() => { loadProtocolli(); }, [loadProtocolli]);
  useEffect(() => { loadFlussi(); }, [loadFlussi]);
  useEffect(() => { loadVerifiche(); }, [loadVerifiche]);

  /* CRUD Aree Rischio */
  const handleSubmitAr = async (values: typeof formAr.values) => {
    try {
      if (editModeAr && selectedAr) { await apiClient.put(`${API_URL}/AreeRischio/${selectedAr.id}`, values); notifications.show({ title: 'Successo', message: 'Area rischio aggiornata', color: 'green' }); }
      else { await apiClient.post(`${API_URL}/AreeRischio`, values); notifications.show({ title: 'Successo', message: 'Area rischio creata', color: 'green' }); }
      setModalAr(false); formAr.reset(); loadAree(); loadKpi();
    } catch { notifications.show({ title: 'Errore', message: 'Operazione fallita', color: 'red' }); }
  };
  const handleDeleteAr = async () => { if (!selectedAr) return; try { await apiClient.delete(`${API_URL}/AreeRischio/${selectedAr.id}`); notifications.show({ title: 'Successo', message: 'Area eliminata', color: 'green' }); setDeleteAr(false); setSelectedAr(null); loadAree(); loadKpi(); } catch { notifications.show({ title: 'Errore', message: 'Eliminazione fallita', color: 'red' }); } };

  /* CRUD Protocolli */
  const handleSubmitP = async (values: typeof formP.values) => {
    try {
      if (editModeP && selectedP) { await apiClient.put(`${API_URL}/Protocolli/${selectedP.id}`, values); notifications.show({ title: 'Successo', message: 'Protocollo aggiornato', color: 'green' }); }
      else { await apiClient.post(`${API_URL}/Protocolli`, values); notifications.show({ title: 'Successo', message: 'Protocollo creato', color: 'green' }); }
      setModalP(false); formP.reset(); loadProtocolli(); loadKpi();
    } catch { notifications.show({ title: 'Errore', message: 'Operazione fallita', color: 'red' }); }
  };
  const handleDeleteP = async () => { if (!selectedP) return; try { await apiClient.delete(`${API_URL}/Protocolli/${selectedP.id}`); notifications.show({ title: 'Successo', message: 'Protocollo eliminato', color: 'green' }); setDeleteP(false); setSelectedP(null); loadProtocolli(); loadKpi(); } catch { notifications.show({ title: 'Errore', message: 'Eliminazione fallita', color: 'red' }); } };

  /* CRUD Flussi */
  const handleSubmitF = async (values: typeof formF.values) => {
    try {
      if (editModeF && selectedF) { await apiClient.put(`${API_URL}/Flussi/${selectedF.id}`, values); notifications.show({ title: 'Successo', message: 'Flusso aggiornato', color: 'green' }); }
      else { await apiClient.post(`${API_URL}/Flussi`, values); notifications.show({ title: 'Successo', message: 'Flusso creato', color: 'green' }); }
      setModalF(false); formF.reset(); loadFlussi(); loadKpi();
    } catch { notifications.show({ title: 'Errore', message: 'Operazione fallita', color: 'red' }); }
  };
  const handleDeleteF = async () => { if (!selectedF) return; try { await apiClient.delete(`${API_URL}/Flussi/${selectedF.id}`); notifications.show({ title: 'Successo', message: 'Flusso eliminato', color: 'green' }); setDeleteF(false); setSelectedF(null); loadFlussi(); loadKpi(); } catch { notifications.show({ title: 'Errore', message: 'Eliminazione fallita', color: 'red' }); } };

  const handleEsamina = async (id: string) => {
    try { await apiClient.post(`${API_URL}/Flussi/${id}/esamina`); notifications.show({ title: 'Successo', message: 'Flusso in esame', color: 'green' }); loadFlussi(); }
    catch { notifications.show({ title: 'Errore', message: 'Operazione fallita', color: 'red' }); }
  };

  /* CRUD Verifiche */
  const handleSubmitV = async (values: typeof formV.values) => {
    try {
      if (editModeV && selectedV) { await apiClient.put(`${API_URL}/Verifiche/${selectedV.id}`, values); notifications.show({ title: 'Successo', message: 'Verifica aggiornata', color: 'green' }); }
      else { await apiClient.post(`${API_URL}/Verifiche`, values); notifications.show({ title: 'Successo', message: 'Verifica creata', color: 'green' }); }
      setModalV(false); formV.reset(); loadVerifiche(); loadKpi();
    } catch { notifications.show({ title: 'Errore', message: 'Operazione fallita', color: 'red' }); }
  };
  const handleDeleteV = async () => { if (!selectedV) return; try { await apiClient.delete(`${API_URL}/Verifiche/${selectedV.id}`); notifications.show({ title: 'Successo', message: 'Verifica eliminata', color: 'green' }); setDeleteV(false); setSelectedV(null); loadVerifiche(); loadKpi(); } catch { notifications.show({ title: 'Errore', message: 'Eliminazione fallita', color: 'red' }); } };

  const riskColor = (r: string) => r === 'basso' ? 'green' : r === 'medio' ? 'yellow' : r === 'alto' ? 'orange' : 'red';
  const statoColorP = (s: string) => s === 'attivo' ? 'green' : s === 'in_revisione' ? 'blue' : s === 'scaduto' ? 'red' : 'gray';
  const statoColorF = (s: string) => s === 'ricevuto' ? 'blue' : s === 'in_esame' ? 'orange' : s === 'esaminato' ? 'green' : 'gray';
  const prioritaColor = (p: string) => p === 'bassa' ? 'gray' : p === 'media' ? 'blue' : p === 'alta' ? 'orange' : 'red';
  const statoColorV = (s: string) => s === 'pianificata' ? 'blue' : s === 'in_corso' ? 'orange' : s === 'completata' ? 'green' : 'red';

  return (
    <Container size="xl" py="md">
      <Group justify="space-between" mb="lg">
        <Title order={2}>Modello 231</Title>
      </Group>

      {/* KPI Dashboard */}
      <SimpleGrid cols={{ base: 2, sm: 3, md: 6 }} mb="xl">
        <Paper withBorder p="md" radius="md">
          <Text size="xs" c="dimmed" fw={700} tt="uppercase">Aree Alto Rischio</Text>
          <Text size="xl" fw={700} c="orange">{kpi.areeRischioAlto}</Text>
        </Paper>
        <Paper withBorder p="md" radius="md">
          <Text size="xs" c="dimmed" fw={700} tt="uppercase">Protocolli Attivi</Text>
          <Text size="xl" fw={700} c="green">{kpi.protocolliAttivi}</Text>
        </Paper>
        <Paper withBorder p="md" radius="md">
          <Text size="xs" c="dimmed" fw={700} tt="uppercase">Protocolli Scaduti</Text>
          <Text size="xl" fw={700} c="red">{kpi.protocolliScaduti}</Text>
        </Paper>
        <Paper withBorder p="md" radius="md">
          <Text size="xs" c="dimmed" fw={700} tt="uppercase">Segnalazioni Aperte</Text>
          <Text size="xl" fw={700} c="orange">{kpi.segnalazioniAperte}</Text>
        </Paper>
        <Paper withBorder p="md" radius="md">
          <Text size="xs" c="dimmed" fw={700} tt="uppercase">Verifiche Pianificate</Text>
          <Text size="xl" fw={700} c="blue">{kpi.verifichePianificate}</Text>
        </Paper>
        <Paper withBorder p="md" radius="md">
          <Text size="xs" c="dimmed" fw={700} tt="uppercase">Non Conformita</Text>
          <Text size="xl" fw={700} c="red">{kpi.nonConformita}</Text>
        </Paper>
      </SimpleGrid>

      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List mb="md">
          <Tabs.Tab value="modello" leftSection={<IconFileDescription size={16} />}>Modello</Tabs.Tab>
          <Tabs.Tab value="aree" leftSection={<IconAlertTriangle size={16} />}>Aree Rischio</Tabs.Tab>
          <Tabs.Tab value="protocolli" leftSection={<IconListCheck size={16} />}>Protocolli</Tabs.Tab>
          <Tabs.Tab value="flussi" leftSection={<IconArrowsExchange size={16} />}>Flussi OdV</Tabs.Tab>
          <Tabs.Tab value="verifiche" leftSection={<IconChecklist size={16} />}>Verifiche</Tabs.Tab>
        </Tabs.List>

        {/* === Modello === */}
        <Tabs.Panel value="modello">
          {loadingM ? <Group justify="center" py="xl"><Loader /></Group> : modello && (
            <Paper withBorder p="lg" radius="md">
              <Group justify="space-between" mb="lg">
                <Group>
                  <ThemeIcon size="xl" color="blue" variant="light" radius="xl"><IconBuildingCommunity size={28} /></ThemeIcon>
                  <div>
                    <Title order={3}>Modello Organizzativo 231</Title>
                    <Text c="dimmed">D.Lgs. 231/2001</Text>
                  </div>
                </Group>
                <Badge color={modello.stato === 'vigente' ? 'green' : modello.stato === 'in_revisione' ? 'orange' : 'gray'} size="lg">{modello.stato}</Badge>
              </Group>
              <SimpleGrid cols={{ base: 1, sm: 3 }} mb="lg">
                <div><Text size="xs" c="dimmed">Versione</Text><Text fw={700} size="lg">{modello.versione}</Text></div>
                <div><Text size="xs" c="dimmed">Data Approvazione</Text><Text fw={500}>{new Date(modello.dataApprovazione).toLocaleDateString('it-IT')}</Text></div>
                <div><Text size="xs" c="dimmed">Approvato da</Text><Text fw={500}>{modello.approvatore}</Text></div>
              </SimpleGrid>
              <div><Text size="xs" c="dimmed" mb={4}>Descrizione</Text><Text>{modello.descrizione}</Text></div>
            </Paper>
          )}
        </Tabs.Panel>

        {/* === Aree Rischio === */}
        <Tabs.Panel value="aree">
          <Group justify="space-between" mb="md">
            <TextInput placeholder="Cerca area..." leftSection={<IconSearch size={16} />} value={searchAr} onChange={(e) => { setSearchAr(e.currentTarget.value); setPageAr(1); }} style={{ flex: 1, maxWidth: 400 }} />
            <Button leftSection={<IconPlus size={16} />} onClick={() => { setEditModeAr(false); setSelectedAr(null); formAr.reset(); setModalAr(true); }}>Nuova Area</Button>
          </Group>
          <Paper withBorder radius="md">
            {loadingAr ? <Group justify="center" py="xl"><Loader /></Group> : (
              <>
                <Table striped highlightOnHover>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Codice</Table.Th>
                      <Table.Th>Nome</Table.Th>
                      <Table.Th>Rischio</Table.Th>
                      <Table.Th>P</Table.Th>
                      <Table.Th>I</Table.Th>
                      <Table.Th>Residuo</Table.Th>
                      <Table.Th>Processo</Table.Th>
                      <Table.Th>Responsabile</Table.Th>
                      <Table.Th w={120}>Azioni</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {aree?.items.length === 0 && <Table.Tr><Table.Td colSpan={9}><Text ta="center" c="dimmed" py="md">Nessun risultato</Text></Table.Td></Table.Tr>}
                    {aree?.items.map((item) => (
                      <Table.Tr key={item.id} style={{ backgroundColor: item.livelloRischio === 'critico' ? 'var(--mantine-color-red-0)' : item.livelloRischio === 'alto' ? 'var(--mantine-color-orange-0)' : undefined }}>
                        <Table.Td><Text fw={500} ff="monospace">{item.codice}</Text></Table.Td>
                        <Table.Td><Text fw={500}>{item.nome}</Text></Table.Td>
                        <Table.Td><Badge color={riskColor(item.livelloRischio)} size="sm">{item.livelloRischio}</Badge></Table.Td>
                        <Table.Td>{item.probabilita}</Table.Td>
                        <Table.Td>{item.impatto}</Table.Td>
                        <Table.Td><Badge variant="light" color={item.rischioResiduo > 10 ? 'red' : item.rischioResiduo > 5 ? 'yellow' : 'green'} size="sm">{item.rischioResiduo}</Badge></Table.Td>
                        <Table.Td>{item.processoCoinvolto}</Table.Td>
                        <Table.Td>{item.responsabile}</Table.Td>
                        <Table.Td>
                          <Group gap={4}>
                            <ActionIcon variant="subtle" color="yellow" onClick={() => { setEditModeAr(true); setSelectedAr(item); formAr.setValues({ codice: item.codice, nome: item.nome, descrizione: item.descrizione, livelloRischio: item.livelloRischio, probabilita: item.probabilita, impatto: item.impatto, processoCoinvolto: item.processoCoinvolto, responsabile: item.responsabile }); setModalAr(true); }}><IconEdit size={16} /></ActionIcon>
                            <ActionIcon variant="subtle" color="red" onClick={() => { setSelectedAr(item); setDeleteAr(true); }}><IconTrash size={16} /></ActionIcon>
                          </Group>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
                {aree && aree.totalPages > 1 && <Group justify="center" py="md"><Pagination value={pageAr} onChange={setPageAr} total={aree.totalPages} /></Group>}
              </>
            )}
          </Paper>
        </Tabs.Panel>

        {/* === Protocolli === */}
        <Tabs.Panel value="protocolli">
          <Group justify="space-between" mb="md">
            <TextInput placeholder="Cerca protocollo..." leftSection={<IconSearch size={16} />} value={searchP} onChange={(e) => { setSearchP(e.currentTarget.value); setPageP(1); }} style={{ flex: 1, maxWidth: 400 }} />
            <Button leftSection={<IconPlus size={16} />} onClick={() => { setEditModeP(false); setSelectedP(null); formP.reset(); setModalP(true); }}>Nuovo Protocollo</Button>
          </Group>
          <Paper withBorder radius="md">
            {loadingP ? <Group justify="center" py="xl"><Loader /></Group> : (
              <>
                <Table striped highlightOnHover>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Codice</Table.Th>
                      <Table.Th>Nome</Table.Th>
                      <Table.Th>Area Rischio</Table.Th>
                      <Table.Th>Stato</Table.Th>
                      <Table.Th>Scadenza</Table.Th>
                      <Table.Th>Responsabile</Table.Th>
                      <Table.Th w={120}>Azioni</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {protocolli?.items.length === 0 && <Table.Tr><Table.Td colSpan={7}><Text ta="center" c="dimmed" py="md">Nessun risultato</Text></Table.Td></Table.Tr>}
                    {protocolli?.items.map((item) => (
                      <Table.Tr key={item.id}>
                        <Table.Td><Text fw={500} ff="monospace">{item.codice}</Text></Table.Td>
                        <Table.Td><Text fw={500}>{item.nome}</Text></Table.Td>
                        <Table.Td>{item.areaRischioNome}</Table.Td>
                        <Table.Td><Badge color={statoColorP(item.stato)} size="sm">{item.stato}</Badge></Table.Td>
                        <Table.Td><Text c={new Date(item.dataScadenza) < new Date() ? 'red' : undefined}>{new Date(item.dataScadenza).toLocaleDateString('it-IT')}</Text></Table.Td>
                        <Table.Td>{item.responsabile}</Table.Td>
                        <Table.Td>
                          <Group gap={4}>
                            <ActionIcon variant="subtle" color="yellow" onClick={() => { setEditModeP(true); setSelectedP(item); formP.setValues({ codice: item.codice, nome: item.nome, areaRischioNome: item.areaRischioNome, descrizione: item.descrizione, stato: item.stato, dataScadenza: item.dataScadenza, responsabile: item.responsabile }); setModalP(true); }}><IconEdit size={16} /></ActionIcon>
                            <ActionIcon variant="subtle" color="red" onClick={() => { setSelectedP(item); setDeleteP(true); }}><IconTrash size={16} /></ActionIcon>
                          </Group>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
                {protocolli && protocolli.totalPages > 1 && <Group justify="center" py="md"><Pagination value={pageP} onChange={setPageP} total={protocolli.totalPages} /></Group>}
              </>
            )}
          </Paper>
        </Tabs.Panel>

        {/* === Flussi OdV === */}
        <Tabs.Panel value="flussi">
          <Group justify="space-between" mb="md">
            <TextInput placeholder="Cerca flusso..." leftSection={<IconSearch size={16} />} value={searchF} onChange={(e) => { setSearchF(e.currentTarget.value); setPageF(1); }} style={{ flex: 1, maxWidth: 400 }} />
            <Button leftSection={<IconPlus size={16} />} onClick={() => { setEditModeF(false); setSelectedF(null); formF.reset(); setModalF(true); }}>Nuovo Flusso</Button>
          </Group>
          <Paper withBorder radius="md">
            {loadingF ? <Group justify="center" py="xl"><Loader /></Group> : (
              <>
                <Table striped highlightOnHover>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Tipo</Table.Th>
                      <Table.Th>Oggetto</Table.Th>
                      <Table.Th>Mittente</Table.Th>
                      <Table.Th>Data</Table.Th>
                      <Table.Th>Priorita</Table.Th>
                      <Table.Th>Stato</Table.Th>
                      <Table.Th w={140}>Azioni</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {flussi?.items.length === 0 && <Table.Tr><Table.Td colSpan={7}><Text ta="center" c="dimmed" py="md">Nessun risultato</Text></Table.Td></Table.Tr>}
                    {flussi?.items.map((item) => (
                      <Table.Tr key={item.id}>
                        <Table.Td><Badge variant="light" size="sm">{item.tipo}</Badge></Table.Td>
                        <Table.Td><Text fw={500} lineClamp={1}>{item.oggetto}</Text></Table.Td>
                        <Table.Td>{item.mittente}</Table.Td>
                        <Table.Td>{new Date(item.dataRicezione).toLocaleDateString('it-IT')}</Table.Td>
                        <Table.Td><Badge color={prioritaColor(item.priorita)} size="sm">{item.priorita}</Badge></Table.Td>
                        <Table.Td><Badge color={statoColorF(item.stato)} size="sm">{item.stato.replace('_', ' ')}</Badge></Table.Td>
                        <Table.Td>
                          <Group gap={4}>
                            {(item.stato === 'ricevuto' || item.stato === 'in_esame') && <ActionIcon variant="subtle" color="blue" onClick={() => handleEsamina(item.id)} title="Esamina"><IconEye size={16} /></ActionIcon>}
                            <ActionIcon variant="subtle" color="yellow" onClick={() => { setEditModeF(true); setSelectedF(item); formF.setValues({ tipo: item.tipo, oggetto: item.oggetto, mittente: item.mittente, priorita: item.priorita, descrizione: item.descrizione }); setModalF(true); }}><IconEdit size={16} /></ActionIcon>
                            <ActionIcon variant="subtle" color="red" onClick={() => { setSelectedF(item); setDeleteF(true); }}><IconTrash size={16} /></ActionIcon>
                          </Group>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
                {flussi && flussi.totalPages > 1 && <Group justify="center" py="md"><Pagination value={pageF} onChange={setPageF} total={flussi.totalPages} /></Group>}
              </>
            )}
          </Paper>
        </Tabs.Panel>

        {/* === Verifiche OdV === */}
        <Tabs.Panel value="verifiche">
          <Group justify="space-between" mb="md">
            <TextInput placeholder="Cerca verifica..." leftSection={<IconSearch size={16} />} value={searchV} onChange={(e) => { setSearchV(e.currentTarget.value); setPageV(1); }} style={{ flex: 1, maxWidth: 400 }} />
            <Button leftSection={<IconPlus size={16} />} onClick={() => { setEditModeV(false); setSelectedV(null); formV.reset(); setModalV(true); }}>Nuova Verifica</Button>
          </Group>
          <Paper withBorder radius="md">
            {loadingV ? <Group justify="center" py="xl"><Loader /></Group> : (
              <>
                <Table striped highlightOnHover>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Tipo</Table.Th>
                      <Table.Th>Oggetto</Table.Th>
                      <Table.Th>Area</Table.Th>
                      <Table.Th>Data</Table.Th>
                      <Table.Th>Stato</Table.Th>
                      <Table.Th>Esito</Table.Th>
                      <Table.Th>Verificatore</Table.Th>
                      <Table.Th w={120}>Azioni</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {verifiche?.items.length === 0 && <Table.Tr><Table.Td colSpan={8}><Text ta="center" c="dimmed" py="md">Nessun risultato</Text></Table.Td></Table.Tr>}
                    {verifiche?.items.map((item) => (
                      <Table.Tr key={item.id} style={{ backgroundColor: item.stato === 'non_conforme' ? 'var(--mantine-color-red-0)' : undefined }}>
                        <Table.Td><Badge variant="light" size="sm">{item.tipo}</Badge></Table.Td>
                        <Table.Td><Text fw={500} lineClamp={1}>{item.oggetto}</Text></Table.Td>
                        <Table.Td>{item.areaVerificata}</Table.Td>
                        <Table.Td>{new Date(item.dataVerifica).toLocaleDateString('it-IT')}</Table.Td>
                        <Table.Td><Badge color={statoColorV(item.stato)} size="sm">{item.stato.replace('_', ' ')}</Badge></Table.Td>
                        <Table.Td>{item.esito ? <Badge color={item.esito === 'conforme' ? 'green' : item.esito === 'non_conforme' ? 'red' : 'yellow'} size="sm">{item.esito.replace('_', ' ')}</Badge> : '-'}</Table.Td>
                        <Table.Td>{item.verificatore}</Table.Td>
                        <Table.Td>
                          <Group gap={4}>
                            <ActionIcon variant="subtle" color="yellow" onClick={() => { setEditModeV(true); setSelectedV(item); formV.setValues({ tipo: item.tipo, oggetto: item.oggetto, areaVerificata: item.areaVerificata, dataVerifica: item.dataVerifica, verificatore: item.verificatore, nonConformita: item.nonConformita || '', azioniCorrettive: item.azioniCorrettive || '' }); setModalV(true); }}><IconEdit size={16} /></ActionIcon>
                            <ActionIcon variant="subtle" color="red" onClick={() => { setSelectedV(item); setDeleteV(true); }}><IconTrash size={16} /></ActionIcon>
                          </Group>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
                {verifiche && verifiche.totalPages > 1 && <Group justify="center" py="md"><Pagination value={pageV} onChange={setPageV} total={verifiche.totalPages} /></Group>}
              </>
            )}
          </Paper>
        </Tabs.Panel>
      </Tabs>

      {/* === Modals === */}
      {/* Area Rischio */}
      <Modal opened={modalAr} onClose={() => setModalAr(false)} title={editModeAr ? 'Modifica Area Rischio' : 'Nuova Area Rischio'} size="lg">
        <form onSubmit={formAr.onSubmit(handleSubmitAr)}>
          <Stack>
            <Group grow>
              <TextInput label="Codice" placeholder="Es. AR-01" required {...formAr.getInputProps('codice')} />
              <TextInput label="Nome" placeholder="Nome area" required {...formAr.getInputProps('nome')} />
            </Group>
            <Textarea label="Descrizione" placeholder="Descrizione" {...formAr.getInputProps('descrizione')} />
            <Group grow>
              <Select label="Livello Rischio" data={[{ value: 'basso', label: 'Basso' }, { value: 'medio', label: 'Medio' }, { value: 'alto', label: 'Alto' }, { value: 'critico', label: 'Critico' }]} {...formAr.getInputProps('livelloRischio')} />
              <TextInput label="Probabilita (1-5)" type="number" {...formAr.getInputProps('probabilita')} />
              <TextInput label="Impatto (1-5)" type="number" {...formAr.getInputProps('impatto')} />
            </Group>
            <Group grow>
              <TextInput label="Processo Coinvolto" placeholder="Es. Gare e Appalti" {...formAr.getInputProps('processoCoinvolto')} />
              <TextInput label="Responsabile" placeholder="Es. Dir. Acquisti" {...formAr.getInputProps('responsabile')} />
            </Group>
            <Group justify="flex-end"><Button variant="default" onClick={() => setModalAr(false)}>Annulla</Button><Button type="submit">{editModeAr ? 'Salva' : 'Crea'}</Button></Group>
          </Stack>
        </form>
      </Modal>

      {/* Protocollo */}
      <Modal opened={modalP} onClose={() => setModalP(false)} title={editModeP ? 'Modifica Protocollo' : 'Nuovo Protocollo'} size="lg">
        <form onSubmit={formP.onSubmit(handleSubmitP)}>
          <Stack>
            <Group grow>
              <TextInput label="Codice" placeholder="Es. PR-01" required {...formP.getInputProps('codice')} />
              <TextInput label="Nome" placeholder="Nome protocollo" required {...formP.getInputProps('nome')} />
            </Group>
            <TextInput label="Area Rischio" placeholder="Es. Reati contro la PA" {...formP.getInputProps('areaRischioNome')} />
            <Textarea label="Descrizione" placeholder="Descrizione" {...formP.getInputProps('descrizione')} />
            <Group grow>
              <Select label="Stato" data={[{ value: 'attivo', label: 'Attivo' }, { value: 'in_revisione', label: 'In Revisione' }, { value: 'scaduto', label: 'Scaduto' }, { value: 'sospeso', label: 'Sospeso' }]} {...formP.getInputProps('stato')} />
              <TextInput label="Scadenza" type="date" {...formP.getInputProps('dataScadenza')} />
              <TextInput label="Responsabile" placeholder="Responsabile" {...formP.getInputProps('responsabile')} />
            </Group>
            <Group justify="flex-end"><Button variant="default" onClick={() => setModalP(false)}>Annulla</Button><Button type="submit">{editModeP ? 'Salva' : 'Crea'}</Button></Group>
          </Stack>
        </form>
      </Modal>

      {/* Flusso OdV */}
      <Modal opened={modalF} onClose={() => setModalF(false)} title={editModeF ? 'Modifica Flusso' : 'Nuovo Flusso OdV'}>
        <form onSubmit={formF.onSubmit(handleSubmitF)}>
          <Stack>
            <Select label="Tipo" data={[{ value: 'segnalazione', label: 'Segnalazione' }, { value: 'informativa', label: 'Informativa' }, { value: 'relazione', label: 'Relazione' }]} {...formF.getInputProps('tipo')} />
            <TextInput label="Oggetto" placeholder="Oggetto" required {...formF.getInputProps('oggetto')} />
            <TextInput label="Mittente" placeholder="Mittente" {...formF.getInputProps('mittente')} />
            <Select label="Priorita" data={[{ value: 'bassa', label: 'Bassa' }, { value: 'media', label: 'Media' }, { value: 'alta', label: 'Alta' }, { value: 'urgente', label: 'Urgente' }]} {...formF.getInputProps('priorita')} />
            <Textarea label="Descrizione" placeholder="Descrizione" {...formF.getInputProps('descrizione')} />
            <Group justify="flex-end"><Button variant="default" onClick={() => setModalF(false)}>Annulla</Button><Button type="submit">{editModeF ? 'Salva' : 'Crea'}</Button></Group>
          </Stack>
        </form>
      </Modal>

      {/* Verifica OdV */}
      <Modal opened={modalV} onClose={() => setModalV(false)} title={editModeV ? 'Modifica Verifica' : 'Nuova Verifica OdV'} size="lg">
        <form onSubmit={formV.onSubmit(handleSubmitV)}>
          <Stack>
            <Group grow>
              <Select label="Tipo" data={[{ value: 'programmata', label: 'Programmata' }, { value: 'straordinaria', label: 'Straordinaria' }]} {...formV.getInputProps('tipo')} />
              <TextInput label="Data Verifica" type="date" {...formV.getInputProps('dataVerifica')} />
            </Group>
            <TextInput label="Oggetto" placeholder="Oggetto verifica" required {...formV.getInputProps('oggetto')} />
            <Group grow>
              <TextInput label="Area Verificata" placeholder="Es. IT, Acquisti" {...formV.getInputProps('areaVerificata')} />
              <TextInput label="Verificatore" placeholder="Es. OdV" {...formV.getInputProps('verificatore')} />
            </Group>
            <Textarea label="Non Conformita" placeholder="Descrivere eventuali non conformita" {...formV.getInputProps('nonConformita')} />
            <Textarea label="Azioni Correttive" placeholder="Azioni correttive proposte" {...formV.getInputProps('azioniCorrettive')} />
            <Group justify="flex-end"><Button variant="default" onClick={() => setModalV(false)}>Annulla</Button><Button type="submit">{editModeV ? 'Salva' : 'Crea'}</Button></Group>
          </Stack>
        </form>
      </Modal>

      {/* Delete Modals */}
      <Modal opened={deleteAr} onClose={() => setDeleteAr(false)} title="Conferma Eliminazione">
        <Text mb="lg">Sei sicuro di voler eliminare l'area <b>{selectedAr?.nome}</b>?</Text>
        <Group justify="flex-end"><Button variant="default" onClick={() => setDeleteAr(false)}>Annulla</Button><Button color="red" onClick={handleDeleteAr}>Elimina</Button></Group>
      </Modal>
      <Modal opened={deleteP} onClose={() => setDeleteP(false)} title="Conferma Eliminazione">
        <Text mb="lg">Sei sicuro di voler eliminare il protocollo <b>{selectedP?.nome}</b>?</Text>
        <Group justify="flex-end"><Button variant="default" onClick={() => setDeleteP(false)}>Annulla</Button><Button color="red" onClick={handleDeleteP}>Elimina</Button></Group>
      </Modal>
      <Modal opened={deleteF} onClose={() => setDeleteF(false)} title="Conferma Eliminazione">
        <Text mb="lg">Sei sicuro di voler eliminare il flusso <b>{selectedF?.oggetto}</b>?</Text>
        <Group justify="flex-end"><Button variant="default" onClick={() => setDeleteF(false)}>Annulla</Button><Button color="red" onClick={handleDeleteF}>Elimina</Button></Group>
      </Modal>
      <Modal opened={deleteV} onClose={() => setDeleteV(false)} title="Conferma Eliminazione">
        <Text mb="lg">Sei sicuro di voler eliminare la verifica <b>{selectedV?.oggetto}</b>?</Text>
        <Group justify="flex-end"><Button variant="default" onClick={() => setDeleteV(false)}>Annulla</Button><Button color="red" onClick={handleDeleteV}>Elimina</Button></Group>
      </Modal>
    </Container>
  );
}
