import { useEffect, useState, useCallback } from 'react';
import {
  Container, Title, TextInput, Group, Button, Table, Pagination, Paper,
  Modal, Text, Stack, Badge, ActionIcon, Loader, SimpleGrid,
  ThemeIcon, Tabs, Select, Textarea, Checkbox, Progress,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import {
  IconPlus, IconSearch, IconEdit, IconTrash, IconEye,
  IconShieldCheck, IconAlertTriangle, IconChecklist,
  IconChartBar, IconFileAnalytics,
} from '@tabler/icons-react';
import apiClient from '../lib/api-client';

/* ---- Types ---- */
interface AnalisiRischio {
  id: string;
  contrattoId: string;
  contrattoNome: string;
  punteggioRischio: number;
  livelloRischio: 'basso' | 'medio' | 'alto' | 'critico';
  areaRischio: string;
  descrizione: string;
  dataAnalisi: string;
  analista: string;
  stato: 'bozza' | 'in_revisione' | 'completata' | 'da_aggiornare';
  note?: string;
  createdAt: string;
  updatedAt: string;
}

interface ChecklistCompliance {
  id: string;
  nome: string;
  categoria: string;
  descrizione: string;
  obbligatoria: boolean;
  stato: 'da_verificare' | 'conforme' | 'non_conforme' | 'non_applicabile';
  dataVerifica?: string;
  verificatoDa?: string;
  note?: string;
}

interface VerificaCompliance {
  id: string;
  contrattoId: string;
  contrattoNome: string;
  checklistCompletate: number;
  checklistTotali: number;
  esito: 'conforme' | 'non_conforme' | 'parziale';
  dataVerifica: string;
  verificatoDa: string;
  note?: string;
}

interface PagedData<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

interface DashboardRischio {
  totaleAnalisi: number;
  basso: number;
  medio: number;
  alto: number;
  critico: number;
  mediaRischio: number;
  conformi: number;
  nonConformi: number;
}

const API_URL = '/api/analisi-rischio';

export default function AnalisiRischioPage() {
  const [activeTab, setActiveTab] = useState<string | null>('analisi');

  /* Analisi Rischio */
  const [analisi, setAnalisi] = useState<PagedData<AnalisiRischio> | null>(null);
  const [loadingA, setLoadingA] = useState(true);
  const [pageA, setPageA] = useState(1);
  const [searchA, setSearchA] = useState('');
  const [modalA, setModalA] = useState(false);
  const [deleteA, setDeleteA] = useState(false);
  const [selectedA, setSelectedA] = useState<AnalisiRischio | null>(null);
  const [editModeA, setEditModeA] = useState(false);
  const [detailA, setDetailA] = useState(false);

  /* Checklist */
  const [checklist, setChecklist] = useState<PagedData<ChecklistCompliance> | null>(null);
  const [loadingC, setLoadingC] = useState(true);
  const [pageC, setPageC] = useState(1);
  const [searchC, setSearchC] = useState('');
  const [modalC, setModalC] = useState(false);
  const [deleteC, setDeleteC] = useState(false);
  const [selectedC, setSelectedC] = useState<ChecklistCompliance | null>(null);
  const [editModeC, setEditModeC] = useState(false);

  /* Verifiche */
  const [verifiche, setVerifiche] = useState<PagedData<VerificaCompliance> | null>(null);
  const [loadingV, setLoadingV] = useState(true);
  const [pageV, setPageV] = useState(1);
  const [searchV, setSearchV] = useState('');

  /* Dashboard */
  const [dashboard, setDashboard] = useState<DashboardRischio>({
    totaleAnalisi: 0, basso: 0, medio: 0, alto: 0, critico: 0, mediaRischio: 0, conformi: 0, nonConformi: 0,
  });

  /* Forms */
  const formA = useForm({
    initialValues: { contrattoNome: '', areaRischio: '', descrizione: '', punteggioRischio: 0, livelloRischio: 'basso' as string, analista: '', note: '' },
    validate: { contrattoNome: (v) => (v.trim().length < 1 ? 'Contratto obbligatorio' : null), descrizione: (v) => (v.trim().length < 1 ? 'Descrizione obbligatoria' : null) },
  });
  const formC = useForm({
    initialValues: { nome: '', categoria: '', descrizione: '', obbligatoria: true, note: '' },
    validate: { nome: (v) => (v.trim().length < 1 ? 'Nome obbligatorio' : null) },
  });

  /* Data loading */
  const loadAnalisi = useCallback(async () => {
    setLoadingA(true);
    try {
      const res = await apiClient.get(`${API_URL}/AnalisiRischio`, { params: { page: pageA, pageSize: 20, search: searchA || undefined } });
      setAnalisi(res.data.data);
    } catch {
      setAnalisi({ items: [
        { id: '1', contrattoId: 'c1', contrattoNome: 'Contratto Fornitura IT - TechCorp', punteggioRischio: 72, livelloRischio: 'alto', areaRischio: 'Clausole penali', descrizione: 'Penali eccessive per ritardi consegna', dataAnalisi: '2026-03-20', analista: 'Avv. Rossi', stato: 'completata', createdAt: '2026-03-20', updatedAt: '2026-03-20' },
        { id: '2', contrattoId: 'c2', contrattoNome: 'Licenza Software ERP', punteggioRischio: 45, livelloRischio: 'medio', areaRischio: 'Proprieta intellettuale', descrizione: 'Clausola di proprieta IP ambigua', dataAnalisi: '2026-03-18', analista: 'Avv. Bianchi', stato: 'in_revisione', createdAt: '2026-03-18', updatedAt: '2026-03-18' },
        { id: '3', contrattoId: 'c3', contrattoNome: 'Appalto Manutenzione', punteggioRischio: 15, livelloRischio: 'basso', areaRischio: 'Responsabilita', descrizione: 'Responsabilita ben definite', dataAnalisi: '2026-03-15', analista: 'Avv. Verdi', stato: 'completata', createdAt: '2026-03-15', updatedAt: '2026-03-15' },
        { id: '4', contrattoId: 'c4', contrattoNome: 'NDA Fornitore Estero', punteggioRischio: 88, livelloRischio: 'critico', areaRischio: 'Giurisdizione', descrizione: 'Foro competente estero svantaggioso', dataAnalisi: '2026-03-10', analista: 'Avv. Rossi', stato: 'da_aggiornare', createdAt: '2026-03-10', updatedAt: '2026-03-10' },
      ], totalCount: 4, page: 1, pageSize: 20, totalPages: 1 });
    } finally { setLoadingA(false); }
  }, [pageA, searchA]);

  const loadChecklist = useCallback(async () => {
    setLoadingC(true);
    try {
      const res = await apiClient.get(`${API_URL}/Checklist`, { params: { page: pageC, pageSize: 20, search: searchC || undefined } });
      setChecklist(res.data.data);
    } catch {
      setChecklist({ items: [
        { id: '1', nome: 'Clausola di recesso', categoria: 'Clausole Contrattuali', descrizione: 'Verifica presenza e condizioni clausola di recesso', obbligatoria: true, stato: 'conforme', dataVerifica: '2026-03-20', verificatoDa: 'Avv. Rossi' },
        { id: '2', nome: 'Conformita GDPR', categoria: 'Privacy', descrizione: 'Verifica trattamento dati personali', obbligatoria: true, stato: 'conforme', dataVerifica: '2026-03-19', verificatoDa: 'DPO' },
        { id: '3', nome: 'Clausola penale', categoria: 'Clausole Contrattuali', descrizione: 'Verifica proporzionalita penali', obbligatoria: false, stato: 'non_conforme', dataVerifica: '2026-03-18', verificatoDa: 'Avv. Bianchi' },
        { id: '4', nome: 'Assicurazione RC', categoria: 'Coperture', descrizione: 'Verifica copertura assicurativa adeguata', obbligatoria: true, stato: 'da_verificare' },
        { id: '5', nome: 'Antiriciclaggio', categoria: 'Compliance', descrizione: 'Verifica AML sul contraente', obbligatoria: true, stato: 'conforme', dataVerifica: '2026-03-15', verificatoDa: 'Compliance Officer' },
      ], totalCount: 5, page: 1, pageSize: 20, totalPages: 1 });
    } finally { setLoadingC(false); }
  }, [pageC, searchC]);

  const loadVerifiche = useCallback(async () => {
    setLoadingV(true);
    try {
      const res = await apiClient.get(`${API_URL}/Verifiche`, { params: { page: pageV, pageSize: 20, search: searchV || undefined } });
      setVerifiche(res.data.data);
    } catch {
      setVerifiche({ items: [
        { id: '1', contrattoId: 'c1', contrattoNome: 'Contratto Fornitura IT - TechCorp', checklistCompletate: 8, checklistTotali: 10, esito: 'parziale', dataVerifica: '2026-03-20', verificatoDa: 'Avv. Rossi' },
        { id: '2', contrattoId: 'c2', contrattoNome: 'Licenza Software ERP', checklistCompletate: 10, checklistTotali: 10, esito: 'conforme', dataVerifica: '2026-03-18', verificatoDa: 'Avv. Bianchi' },
        { id: '3', contrattoId: 'c3', contrattoNome: 'NDA Fornitore Estero', checklistCompletate: 3, checklistTotali: 10, esito: 'non_conforme', dataVerifica: '2026-03-10', verificatoDa: 'Avv. Rossi' },
      ], totalCount: 3, page: 1, pageSize: 20, totalPages: 1 });
    } finally { setLoadingV(false); }
  }, [pageV, searchV]);

  const loadDashboard = async () => {
    try {
      const res = await apiClient.get(`${API_URL}/dashboard`);
      setDashboard(res.data.data);
    } catch {
      setDashboard({ totaleAnalisi: 24, basso: 8, medio: 9, alto: 5, critico: 2, mediaRischio: 42, conformi: 18, nonConformi: 6 });
    }
  };

  useEffect(() => { loadAnalisi(); }, [loadAnalisi]);
  useEffect(() => { loadChecklist(); }, [loadChecklist]);
  useEffect(() => { loadVerifiche(); }, [loadVerifiche]);
  useEffect(() => { loadDashboard(); }, []);

  /* CRUD */
  const handleSubmitA = async (values: typeof formA.values) => {
    try {
      if (editModeA && selectedA) { await apiClient.put(`${API_URL}/AnalisiRischio/${selectedA.id}`, values); notifications.show({ title: 'Successo', message: 'Analisi aggiornata', color: 'green' }); }
      else { await apiClient.post(`${API_URL}/AnalisiRischio`, values); notifications.show({ title: 'Successo', message: 'Analisi creata', color: 'green' }); }
      setModalA(false); formA.reset(); loadAnalisi(); loadDashboard();
    } catch { notifications.show({ title: 'Errore', message: 'Operazione fallita', color: 'red' }); }
  };
  const handleDeleteA = async () => { if (!selectedA) return; try { await apiClient.delete(`${API_URL}/AnalisiRischio/${selectedA.id}`); notifications.show({ title: 'Successo', message: 'Analisi eliminata', color: 'green' }); setDeleteA(false); setSelectedA(null); loadAnalisi(); loadDashboard(); } catch { notifications.show({ title: 'Errore', message: 'Eliminazione fallita', color: 'red' }); } };

  const handleSubmitC = async (values: typeof formC.values) => {
    try {
      if (editModeC && selectedC) { await apiClient.put(`${API_URL}/Checklist/${selectedC.id}`, values); notifications.show({ title: 'Successo', message: 'Checklist aggiornata', color: 'green' }); }
      else { await apiClient.post(`${API_URL}/Checklist`, values); notifications.show({ title: 'Successo', message: 'Checklist creata', color: 'green' }); }
      setModalC(false); formC.reset(); loadChecklist();
    } catch { notifications.show({ title: 'Errore', message: 'Operazione fallita', color: 'red' }); }
  };
  const handleDeleteC = async () => { if (!selectedC) return; try { await apiClient.delete(`${API_URL}/Checklist/${selectedC.id}`); notifications.show({ title: 'Successo', message: 'Checklist eliminata', color: 'green' }); setDeleteC(false); setSelectedC(null); loadChecklist(); } catch { notifications.show({ title: 'Errore', message: 'Eliminazione fallita', color: 'red' }); } };

  const riskColor = (r: string) => r === 'basso' ? 'green' : r === 'medio' ? 'yellow' : r === 'alto' ? 'orange' : 'red';
  const statoColorA = (s: string) => s === 'completata' ? 'green' : s === 'in_revisione' ? 'blue' : s === 'da_aggiornare' ? 'orange' : 'gray';
  const statoColorC = (s: string) => s === 'conforme' ? 'green' : s === 'non_conforme' ? 'red' : s === 'da_verificare' ? 'yellow' : 'gray';
  const esitoColor = (e: string) => e === 'conforme' ? 'green' : e === 'non_conforme' ? 'red' : 'yellow';

  return (
    <Container size="xl" py="md">
      <Group justify="space-between" mb="lg">
        <Title order={2}>Analisi Rischio</Title>
      </Group>

      {/* Dashboard */}
      <SimpleGrid cols={{ base: 2, sm: 4 }} mb="xl">
        <Paper withBorder p="md" radius="md">
          <Group justify="space-between" mb="xs">
            <Text size="xs" c="dimmed" fw={700} tt="uppercase">Totale Analisi</Text>
            <ThemeIcon color="blue" variant="light" size="lg" radius="xl"><IconFileAnalytics size={20} /></ThemeIcon>
          </Group>
          <Text size="xl" fw={700}>{dashboard.totaleAnalisi}</Text>
          <Text size="xs" c="dimmed">Media rischio: {dashboard.mediaRischio}/100</Text>
        </Paper>
        <Paper withBorder p="md" radius="md">
          <Group justify="space-between" mb="xs">
            <Text size="xs" c="dimmed" fw={700} tt="uppercase">Distribuzione Rischio</Text>
          </Group>
          <Group gap="xs">
            <Badge color="green" size="lg">{dashboard.basso}</Badge>
            <Badge color="yellow" size="lg">{dashboard.medio}</Badge>
            <Badge color="orange" size="lg">{dashboard.alto}</Badge>
            <Badge color="red" size="lg">{dashboard.critico}</Badge>
          </Group>
          <Text size="xs" c="dimmed" mt={4}>Basso / Medio / Alto / Critico</Text>
        </Paper>
        <Paper withBorder p="md" radius="md">
          <Group justify="space-between" mb="xs">
            <Text size="xs" c="dimmed" fw={700} tt="uppercase">Conformi</Text>
            <ThemeIcon color="green" variant="light" size="lg" radius="xl"><IconShieldCheck size={20} /></ThemeIcon>
          </Group>
          <Text size="xl" fw={700} c="green">{dashboard.conformi}</Text>
        </Paper>
        <Paper withBorder p="md" radius="md">
          <Group justify="space-between" mb="xs">
            <Text size="xs" c="dimmed" fw={700} tt="uppercase">Non Conformi</Text>
            <ThemeIcon color="red" variant="light" size="lg" radius="xl"><IconAlertTriangle size={20} /></ThemeIcon>
          </Group>
          <Text size="xl" fw={700} c="red">{dashboard.nonConformi}</Text>
        </Paper>
      </SimpleGrid>

      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List mb="md">
          <Tabs.Tab value="analisi" leftSection={<IconChartBar size={16} />}>Analisi Rischio</Tabs.Tab>
          <Tabs.Tab value="checklist" leftSection={<IconChecklist size={16} />}>Checklist Compliance</Tabs.Tab>
          <Tabs.Tab value="verifiche" leftSection={<IconShieldCheck size={16} />}>Verifiche</Tabs.Tab>
        </Tabs.List>

        {/* Analisi Rischio */}
        <Tabs.Panel value="analisi">
          <Group justify="space-between" mb="md">
            <TextInput placeholder="Cerca contratto..." leftSection={<IconSearch size={16} />} value={searchA} onChange={(e) => { setSearchA(e.currentTarget.value); setPageA(1); }} style={{ flex: 1, maxWidth: 400 }} />
            <Button leftSection={<IconPlus size={16} />} onClick={() => { setEditModeA(false); setSelectedA(null); formA.reset(); setModalA(true); }}>Nuova Analisi</Button>
          </Group>
          <Paper withBorder radius="md">
            {loadingA ? <Group justify="center" py="xl"><Loader /></Group> : (
              <>
                <Table striped highlightOnHover>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Contratto</Table.Th>
                      <Table.Th>Area Rischio</Table.Th>
                      <Table.Th>Punteggio</Table.Th>
                      <Table.Th>Livello</Table.Th>
                      <Table.Th>Stato</Table.Th>
                      <Table.Th>Analista</Table.Th>
                      <Table.Th w={140}>Azioni</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {analisi?.items.length === 0 && <Table.Tr><Table.Td colSpan={7}><Text ta="center" c="dimmed" py="md">Nessun risultato</Text></Table.Td></Table.Tr>}
                    {analisi?.items.map((item) => (
                      <Table.Tr key={item.id}>
                        <Table.Td><Text fw={500} lineClamp={1}>{item.contrattoNome}</Text></Table.Td>
                        <Table.Td>{item.areaRischio}</Table.Td>
                        <Table.Td>
                          <Group gap="xs">
                            <Progress value={item.punteggioRischio} color={riskColor(item.livelloRischio)} size="sm" w={60} />
                            <Text size="sm" fw={500}>{item.punteggioRischio}</Text>
                          </Group>
                        </Table.Td>
                        <Table.Td><Badge color={riskColor(item.livelloRischio)} size="sm">{item.livelloRischio}</Badge></Table.Td>
                        <Table.Td><Badge color={statoColorA(item.stato)} size="sm">{item.stato.replace('_', ' ')}</Badge></Table.Td>
                        <Table.Td><Text size="sm">{item.analista}</Text></Table.Td>
                        <Table.Td>
                          <Group gap={4}>
                            <ActionIcon variant="subtle" color="blue" onClick={() => { setSelectedA(item); setDetailA(true); }}><IconEye size={16} /></ActionIcon>
                            <ActionIcon variant="subtle" color="yellow" onClick={() => { setEditModeA(true); setSelectedA(item); formA.setValues({ contrattoNome: item.contrattoNome, areaRischio: item.areaRischio, descrizione: item.descrizione, punteggioRischio: item.punteggioRischio, livelloRischio: item.livelloRischio, analista: item.analista, note: item.note || '' }); setModalA(true); }}><IconEdit size={16} /></ActionIcon>
                            <ActionIcon variant="subtle" color="red" onClick={() => { setSelectedA(item); setDeleteA(true); }}><IconTrash size={16} /></ActionIcon>
                          </Group>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
                {analisi && analisi.totalPages > 1 && <Group justify="center" py="md"><Pagination value={pageA} onChange={setPageA} total={analisi.totalPages} /></Group>}
              </>
            )}
          </Paper>
        </Tabs.Panel>

        {/* Checklist Compliance */}
        <Tabs.Panel value="checklist">
          <Group justify="space-between" mb="md">
            <TextInput placeholder="Cerca checklist..." leftSection={<IconSearch size={16} />} value={searchC} onChange={(e) => { setSearchC(e.currentTarget.value); setPageC(1); }} style={{ flex: 1, maxWidth: 400 }} />
            <Button leftSection={<IconPlus size={16} />} onClick={() => { setEditModeC(false); setSelectedC(null); formC.reset(); setModalC(true); }}>Nuova Checklist</Button>
          </Group>
          <Paper withBorder radius="md">
            {loadingC ? <Group justify="center" py="xl"><Loader /></Group> : (
              <>
                <Table striped highlightOnHover>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Nome</Table.Th>
                      <Table.Th>Categoria</Table.Th>
                      <Table.Th>Obbligatoria</Table.Th>
                      <Table.Th>Stato</Table.Th>
                      <Table.Th>Verificato Da</Table.Th>
                      <Table.Th>Data Verifica</Table.Th>
                      <Table.Th w={120}>Azioni</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {checklist?.items.length === 0 && <Table.Tr><Table.Td colSpan={7}><Text ta="center" c="dimmed" py="md">Nessun risultato</Text></Table.Td></Table.Tr>}
                    {checklist?.items.map((item) => (
                      <Table.Tr key={item.id}>
                        <Table.Td><Text fw={500}>{item.nome}</Text></Table.Td>
                        <Table.Td>{item.categoria}</Table.Td>
                        <Table.Td><Badge variant="light" color={item.obbligatoria ? 'red' : 'gray'} size="sm">{item.obbligatoria ? 'Si' : 'No'}</Badge></Table.Td>
                        <Table.Td><Badge color={statoColorC(item.stato)} size="sm">{item.stato.replace('_', ' ')}</Badge></Table.Td>
                        <Table.Td>{item.verificatoDa || '-'}</Table.Td>
                        <Table.Td>{item.dataVerifica ? new Date(item.dataVerifica).toLocaleDateString('it-IT') : '-'}</Table.Td>
                        <Table.Td>
                          <Group gap={4}>
                            <ActionIcon variant="subtle" color="yellow" onClick={() => { setEditModeC(true); setSelectedC(item); formC.setValues({ nome: item.nome, categoria: item.categoria, descrizione: item.descrizione, obbligatoria: item.obbligatoria, note: item.note || '' }); setModalC(true); }}><IconEdit size={16} /></ActionIcon>
                            <ActionIcon variant="subtle" color="red" onClick={() => { setSelectedC(item); setDeleteC(true); }}><IconTrash size={16} /></ActionIcon>
                          </Group>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
                {checklist && checklist.totalPages > 1 && <Group justify="center" py="md"><Pagination value={pageC} onChange={setPageC} total={checklist.totalPages} /></Group>}
              </>
            )}
          </Paper>
        </Tabs.Panel>

        {/* Verifiche */}
        <Tabs.Panel value="verifiche">
          <Group justify="space-between" mb="md">
            <TextInput placeholder="Cerca contratto..." leftSection={<IconSearch size={16} />} value={searchV} onChange={(e) => { setSearchV(e.currentTarget.value); setPageV(1); }} style={{ flex: 1, maxWidth: 400 }} />
          </Group>
          <Paper withBorder radius="md">
            {loadingV ? <Group justify="center" py="xl"><Loader /></Group> : (
              <>
                <Table striped highlightOnHover>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Contratto</Table.Th>
                      <Table.Th>Checklist</Table.Th>
                      <Table.Th>Completamento</Table.Th>
                      <Table.Th>Esito</Table.Th>
                      <Table.Th>Data Verifica</Table.Th>
                      <Table.Th>Verificato Da</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {verifiche?.items.length === 0 && <Table.Tr><Table.Td colSpan={6}><Text ta="center" c="dimmed" py="md">Nessun risultato</Text></Table.Td></Table.Tr>}
                    {verifiche?.items.map((item) => (
                      <Table.Tr key={item.id}>
                        <Table.Td><Text fw={500}>{item.contrattoNome}</Text></Table.Td>
                        <Table.Td>{item.checklistCompletate}/{item.checklistTotali}</Table.Td>
                        <Table.Td><Progress value={(item.checklistCompletate / item.checklistTotali) * 100} color={esitoColor(item.esito)} size="sm" w={100} /></Table.Td>
                        <Table.Td><Badge color={esitoColor(item.esito)} size="sm">{item.esito.replace('_', ' ')}</Badge></Table.Td>
                        <Table.Td>{new Date(item.dataVerifica).toLocaleDateString('it-IT')}</Table.Td>
                        <Table.Td>{item.verificatoDa}</Table.Td>
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

      {/* Modals */}
      <Modal opened={modalA} onClose={() => setModalA(false)} title={editModeA ? 'Modifica Analisi' : 'Nuova Analisi Rischio'} size="lg">
        <form onSubmit={formA.onSubmit(handleSubmitA)}>
          <Stack>
            <TextInput label="Contratto" placeholder="Nome contratto" required {...formA.getInputProps('contrattoNome')} />
            <Group grow>
              <TextInput label="Area Rischio" placeholder="Es. Clausole penali" {...formA.getInputProps('areaRischio')} />
              <TextInput label="Analista" placeholder="Es. Avv. Rossi" {...formA.getInputProps('analista')} />
            </Group>
            <Group grow>
              <TextInput label="Punteggio Rischio (0-100)" type="number" {...formA.getInputProps('punteggioRischio')} />
              <Select label="Livello Rischio" data={[{ value: 'basso', label: 'Basso' }, { value: 'medio', label: 'Medio' }, { value: 'alto', label: 'Alto' }, { value: 'critico', label: 'Critico' }]} {...formA.getInputProps('livelloRischio')} />
            </Group>
            <Textarea label="Descrizione" placeholder="Descrizione analisi" required {...formA.getInputProps('descrizione')} />
            <Textarea label="Note" placeholder="Note aggiuntive" {...formA.getInputProps('note')} />
            <Group justify="flex-end">
              <Button variant="default" onClick={() => setModalA(false)}>Annulla</Button>
              <Button type="submit">{editModeA ? 'Salva' : 'Crea'}</Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      <Modal opened={modalC} onClose={() => setModalC(false)} title={editModeC ? 'Modifica Checklist' : 'Nuova Checklist'}>
        <form onSubmit={formC.onSubmit(handleSubmitC)}>
          <Stack>
            <TextInput label="Nome" placeholder="Nome checklist" required {...formC.getInputProps('nome')} />
            <TextInput label="Categoria" placeholder="Es. Clausole Contrattuali" {...formC.getInputProps('categoria')} />
            <Textarea label="Descrizione" placeholder="Descrizione" {...formC.getInputProps('descrizione')} />
            <Checkbox label="Obbligatoria" {...formC.getInputProps('obbligatoria', { type: 'checkbox' })} />
            <Textarea label="Note" placeholder="Note" {...formC.getInputProps('note')} />
            <Group justify="flex-end">
              <Button variant="default" onClick={() => setModalC(false)}>Annulla</Button>
              <Button type="submit">{editModeC ? 'Salva' : 'Crea'}</Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      <Modal opened={detailA} onClose={() => setDetailA(false)} title="Dettaglio Analisi Rischio" size="md">
        {selectedA && (
          <Stack gap="md">
            <div><Text size="xs" c="dimmed">Contratto</Text><Text fw={500}>{selectedA.contrattoNome}</Text></div>
            <div><Text size="xs" c="dimmed">Area Rischio</Text><Text>{selectedA.areaRischio}</Text></div>
            <div><Text size="xs" c="dimmed">Descrizione</Text><Text>{selectedA.descrizione}</Text></div>
            <Group grow>
              <div><Text size="xs" c="dimmed">Punteggio</Text><Text fw={700} size="xl">{selectedA.punteggioRischio}/100</Text><Progress value={selectedA.punteggioRischio} color={riskColor(selectedA.livelloRischio)} size="sm" mt={4} /></div>
              <div><Text size="xs" c="dimmed">Livello</Text><Badge color={riskColor(selectedA.livelloRischio)} size="lg">{selectedA.livelloRischio}</Badge></div>
            </Group>
            <div><Text size="xs" c="dimmed">Analista</Text><Text>{selectedA.analista}</Text></div>
            <div><Text size="xs" c="dimmed">Data Analisi</Text><Text>{new Date(selectedA.dataAnalisi).toLocaleDateString('it-IT')}</Text></div>
            <div><Text size="xs" c="dimmed">Stato</Text><Badge color={statoColorA(selectedA.stato)}>{selectedA.stato.replace('_', ' ')}</Badge></div>
            {selectedA.note && <div><Text size="xs" c="dimmed">Note</Text><Text>{selectedA.note}</Text></div>}
          </Stack>
        )}
      </Modal>

      <Modal opened={deleteA} onClose={() => setDeleteA(false)} title="Conferma Eliminazione">
        <Text mb="lg">Sei sicuro di voler eliminare l'analisi per <b>{selectedA?.contrattoNome}</b>?</Text>
        <Group justify="flex-end"><Button variant="default" onClick={() => setDeleteA(false)}>Annulla</Button><Button color="red" onClick={handleDeleteA}>Elimina</Button></Group>
      </Modal>
      <Modal opened={deleteC} onClose={() => setDeleteC(false)} title="Conferma Eliminazione">
        <Text mb="lg">Sei sicuro di voler eliminare la checklist <b>{selectedC?.nome}</b>?</Text>
        <Group justify="flex-end"><Button variant="default" onClick={() => setDeleteC(false)}>Annulla</Button><Button color="red" onClick={handleDeleteC}>Elimina</Button></Group>
      </Modal>
    </Container>
  );
}
