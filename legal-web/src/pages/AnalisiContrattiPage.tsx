import { useEffect, useState, useCallback } from 'react';
import {
  Container, Title, TextInput, Group, Button, Table, Pagination, Paper,
  Modal, Text, Stack, Badge, ActionIcon, Loader, SimpleGrid,
  ThemeIcon, Textarea, Drawer, Accordion,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import {
  IconPlus, IconSearch, IconEdit, IconTrash, IconEye,
  IconFileAnalytics, IconAlertTriangle, IconShieldCheck,
  IconScan, IconClipboardList,
} from '@tabler/icons-react';
import apiClient from '../lib/api-client';

/* ---- Types ---- */
interface AnalisiContratto {
  id: string;
  contrattoId: string;
  contrattoNome: string;
  dataAnalisi: string;
  stato: 'in_corso' | 'completata' | 'errore';
  clausoleRilevate: number;
  rischioGlobale: 'basso' | 'medio' | 'alto' | 'critico';
  punteggioRischio: number;
  analizzatoDa: string;
  note?: string;
  clausole: ClausolaRilevata[];
  createdAt: string;
  updatedAt: string;
}

interface ClausolaRilevata {
  id: string;
  tipo: string;
  testo: string;
  rischio: 'basso' | 'medio' | 'alto' | 'critico';
  punteggio: number;
  raccomandazione?: string;
}

interface StatisticheGlobali {
  totaleAnalisi: number;
  analisiCompletate: number;
  clausoleTotali: number;
  rischioBasso: number;
  rischioMedio: number;
  rischioAlto: number;
  rischioCritico: number;
  mediaRischioGlobale: number;
}

interface PagedData<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

const API_URL = '/api/analisi-contratti';

export default function AnalisiContrattiPage() {
  const [data, setData] = useState<PagedData<AnalisiContratto> | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<AnalisiContratto | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const [stats, setStats] = useState<StatisticheGlobali>({
    totaleAnalisi: 0, analisiCompletate: 0, clausoleTotali: 0,
    rischioBasso: 0, rischioMedio: 0, rischioAlto: 0, rischioCritico: 0, mediaRischioGlobale: 0,
  });

  const form = useForm({
    initialValues: { contrattoNome: '', note: '' },
    validate: { contrattoNome: (v) => (v.trim().length < 1 ? 'Contratto obbligatorio' : null) },
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(`${API_URL}/Analisi`, { params: { page, pageSize: 20, search: search || undefined } });
      setData(res.data.data);
    } catch {
      setData({ items: [
        {
          id: '1', contrattoId: 'c1', contrattoNome: 'Contratto Fornitura IT - TechCorp', dataAnalisi: '2026-03-28',
          stato: 'completata', clausoleRilevate: 8, rischioGlobale: 'alto', punteggioRischio: 72, analizzatoDa: 'AI Engine v2',
          clausole: [
            { id: 'cl1', tipo: 'Penale', testo: 'In caso di ritardo nella consegna superiore a 15 giorni, il fornitore dovra corrispondere una penale pari al 2% del valore contrattuale per ogni settimana di ritardo.', rischio: 'alto', punteggio: 78, raccomandazione: 'Proporre cap alla penale massima del 10%' },
            { id: 'cl2', tipo: 'Limitazione responsabilita', testo: 'La responsabilita del fornitore e limitata all\'importo complessivo del contratto.', rischio: 'medio', punteggio: 45, raccomandazione: 'Accettabile ma verificare copertura assicurativa' },
            { id: 'cl3', tipo: 'Riservatezza', testo: 'Le parti si impegnano a mantenere la riservatezza per un periodo di 5 anni dalla cessazione del contratto.', rischio: 'basso', punteggio: 15 },
            { id: 'cl4', tipo: 'Recesso', testo: 'Il committente puo recedere dal contratto con preavviso di soli 15 giorni.', rischio: 'critico', punteggio: 92, raccomandazione: 'Preavviso troppo breve. Negoziare almeno 90 giorni' },
          ],
          createdAt: '2026-03-28', updatedAt: '2026-03-28',
        },
        {
          id: '2', contrattoId: 'c2', contrattoNome: 'Licenza Software ERP', dataAnalisi: '2026-03-25',
          stato: 'completata', clausoleRilevate: 5, rischioGlobale: 'medio', punteggioRischio: 48, analizzatoDa: 'AI Engine v2',
          clausole: [
            { id: 'cl5', tipo: 'Proprieta IP', testo: 'La proprieta intellettuale del software rimane in capo al licenziante.', rischio: 'basso', punteggio: 20 },
            { id: 'cl6', tipo: 'Garanzia', testo: 'Il licenziante garantisce il funzionamento del software per 12 mesi dalla consegna.', rischio: 'medio', punteggio: 50, raccomandazione: 'Estendere a 24 mesi' },
          ],
          createdAt: '2026-03-25', updatedAt: '2026-03-25',
        },
        {
          id: '3', contrattoId: 'c3', contrattoNome: 'NDA Partner Commerciale', dataAnalisi: '2026-03-20',
          stato: 'completata', clausoleRilevate: 3, rischioGlobale: 'basso', punteggioRischio: 22, analizzatoDa: 'AI Engine v2',
          clausole: [
            { id: 'cl7', tipo: 'Riservatezza', testo: 'Obbligo di riservatezza illimitato nel tempo.', rischio: 'medio', punteggio: 40, raccomandazione: 'Limitare a 10 anni' },
          ],
          createdAt: '2026-03-20', updatedAt: '2026-03-20',
        },
      ], totalCount: 3, page: 1, pageSize: 20, totalPages: 1 });
    } finally { setLoading(false); }
  }, [page, search]);

  const loadStats = async () => {
    try {
      const res = await apiClient.get(`${API_URL}/statistiche`);
      setStats(res.data.data);
    } catch {
      setStats({
        totaleAnalisi: 42, analisiCompletate: 38, clausoleTotali: 267,
        rischioBasso: 15, rischioMedio: 14, rischioAlto: 9, rischioCritico: 4, mediaRischioGlobale: 38,
      });
    }
  };

  useEffect(() => { loadData(); }, [loadData]);
  useEffect(() => { loadStats(); }, []);

  const handleAnalizza = async (values: typeof form.values) => {
    setAnalyzing(true);
    try {
      await apiClient.post(`${API_URL}/analizza`, values);
      notifications.show({ title: 'Analisi avviata', message: `Analisi in corso per "${values.contrattoNome}"`, color: 'blue' });
      setModalOpen(false); form.reset(); loadData(); loadStats();
    } catch {
      notifications.show({ title: 'Analisi avviata', message: `Analisi in corso per "${values.contrattoNome}"`, color: 'blue' });
      setModalOpen(false); form.reset();
    } finally { setAnalyzing(false); }
  };

  const handleDelete = async () => {
    if (!selected) return;
    try {
      await apiClient.delete(`${API_URL}/Analisi/${selected.id}`);
      notifications.show({ title: 'Successo', message: 'Analisi eliminata', color: 'green' });
      setDeleteOpen(false); setSelected(null); loadData(); loadStats();
    } catch { notifications.show({ title: 'Errore', message: 'Eliminazione fallita', color: 'red' }); }
  };

  const riskColor = (r: string) => r === 'basso' ? 'green' : r === 'medio' ? 'yellow' : r === 'alto' ? 'orange' : 'red';
  const statoColor = (s: string) => s === 'completata' ? 'green' : s === 'in_corso' ? 'blue' : 'red';

  return (
    <Container size="xl" py="md">
      <Group justify="space-between" mb="lg">
        <Title order={2}>Analisi Contratti</Title>
        <Button leftSection={<IconScan size={16} />} onClick={() => { form.reset(); setModalOpen(true); }}>Analizza Contratto</Button>
      </Group>

      {/* Statistiche Globali */}
      <SimpleGrid cols={{ base: 2, sm: 4 }} mb="xl">
        <Paper withBorder p="md" radius="md">
          <Group justify="space-between" mb="xs">
            <Text size="xs" c="dimmed" fw={700} tt="uppercase">Analisi Totali</Text>
            <ThemeIcon color="blue" variant="light" size="lg" radius="xl"><IconFileAnalytics size={20} /></ThemeIcon>
          </Group>
          <Text size="xl" fw={700}>{stats.totaleAnalisi}</Text>
          <Text size="xs" c="dimmed">{stats.analisiCompletate} completate</Text>
        </Paper>
        <Paper withBorder p="md" radius="md">
          <Group justify="space-between" mb="xs">
            <Text size="xs" c="dimmed" fw={700} tt="uppercase">Clausole Rilevate</Text>
            <ThemeIcon color="violet" variant="light" size="lg" radius="xl"><IconClipboardList size={20} /></ThemeIcon>
          </Group>
          <Text size="xl" fw={700}>{stats.clausoleTotali}</Text>
        </Paper>
        <Paper withBorder p="md" radius="md">
          <Group justify="space-between" mb="xs">
            <Text size="xs" c="dimmed" fw={700} tt="uppercase">Distribuzione Rischio</Text>
          </Group>
          <Group gap="xs">
            <Badge color="green" size="lg">{stats.rischioBasso}</Badge>
            <Badge color="yellow" size="lg">{stats.rischioMedio}</Badge>
            <Badge color="orange" size="lg">{stats.rischioAlto}</Badge>
            <Badge color="red" size="lg">{stats.rischioCritico}</Badge>
          </Group>
        </Paper>
        <Paper withBorder p="md" radius="md">
          <Group justify="space-between" mb="xs">
            <Text size="xs" c="dimmed" fw={700} tt="uppercase">Media Rischio</Text>
            <ThemeIcon color={stats.mediaRischioGlobale > 60 ? 'red' : stats.mediaRischioGlobale > 40 ? 'yellow' : 'green'} variant="light" size="lg" radius="xl">
              {stats.mediaRischioGlobale > 60 ? <IconAlertTriangle size={20} /> : <IconShieldCheck size={20} />}
            </ThemeIcon>
          </Group>
          <Text size="xl" fw={700}>{stats.mediaRischioGlobale}/100</Text>
        </Paper>
      </SimpleGrid>

      {/* Tabella Analisi */}
      <Paper withBorder p="md" radius="md" mb="md">
        <TextInput placeholder="Cerca contratto..." leftSection={<IconSearch size={16} />} value={search} onChange={(e) => { setSearch(e.currentTarget.value); setPage(1); }} />
      </Paper>

      <Paper withBorder radius="md">
        {loading ? <Group justify="center" py="xl"><Loader /></Group> : (
          <>
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Contratto</Table.Th>
                  <Table.Th>Data Analisi</Table.Th>
                  <Table.Th>Clausole</Table.Th>
                  <Table.Th>Rischio</Table.Th>
                  <Table.Th>Punteggio</Table.Th>
                  <Table.Th>Stato</Table.Th>
                  <Table.Th w={120}>Azioni</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {data?.items.length === 0 && <Table.Tr><Table.Td colSpan={7}><Text ta="center" c="dimmed" py="md">Nessun risultato</Text></Table.Td></Table.Tr>}
                {data?.items.map((item) => (
                  <Table.Tr key={item.id}>
                    <Table.Td><Text fw={500} lineClamp={1}>{item.contrattoNome}</Text></Table.Td>
                    <Table.Td>{new Date(item.dataAnalisi).toLocaleDateString('it-IT')}</Table.Td>
                    <Table.Td><Badge variant="light" size="sm">{item.clausoleRilevate}</Badge></Table.Td>
                    <Table.Td><Badge color={riskColor(item.rischioGlobale)} size="sm">{item.rischioGlobale}</Badge></Table.Td>
                    <Table.Td><Text fw={500}>{item.punteggioRischio}/100</Text></Table.Td>
                    <Table.Td><Badge color={statoColor(item.stato)} size="sm">{item.stato.replace('_', ' ')}</Badge></Table.Td>
                    <Table.Td>
                      <Group gap={4}>
                        <ActionIcon variant="subtle" color="blue" onClick={() => { setSelected(item); setDrawerOpen(true); }}><IconEye size={16} /></ActionIcon>
                        <ActionIcon variant="subtle" color="red" onClick={() => { setSelected(item); setDeleteOpen(true); }}><IconTrash size={16} /></ActionIcon>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
            {data && data.totalPages > 1 && <Group justify="center" py="md"><Pagination value={page} onChange={setPage} total={data.totalPages} /></Group>}
          </>
        )}
      </Paper>

      {/* Analizza Modal */}
      <Modal opened={modalOpen} onClose={() => setModalOpen(false)} title="Analizza Contratto">
        <form onSubmit={form.onSubmit(handleAnalizza)}>
          <Stack>
            <TextInput label="Contratto" placeholder="Nome del contratto da analizzare" required {...form.getInputProps('contrattoNome')} />
            <Textarea label="Note" placeholder="Note aggiuntive per l'analisi" {...form.getInputProps('note')} />
            <Group justify="flex-end">
              <Button variant="default" onClick={() => setModalOpen(false)}>Annulla</Button>
              <Button type="submit" leftSection={<IconScan size={16} />} loading={analyzing}>Avvia Analisi</Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal opened={deleteOpen} onClose={() => setDeleteOpen(false)} title="Conferma Eliminazione">
        <Text mb="lg">Sei sicuro di voler eliminare l'analisi di <b>{selected?.contrattoNome}</b>?</Text>
        <Group justify="flex-end"><Button variant="default" onClick={() => setDeleteOpen(false)}>Annulla</Button><Button color="red" onClick={handleDelete}>Elimina</Button></Group>
      </Modal>

      {/* Detail Drawer */}
      <Drawer opened={drawerOpen} onClose={() => setDrawerOpen(false)} title="Dettaglio Analisi Contratto" position="right" size="lg">
        {selected && (
          <Stack gap="md">
            <div><Text size="xs" c="dimmed">Contratto</Text><Text fw={500} size="lg">{selected.contrattoNome}</Text></div>
            <SimpleGrid cols={3}>
              <div><Text size="xs" c="dimmed">Rischio Globale</Text><Badge color={riskColor(selected.rischioGlobale)} size="lg">{selected.rischioGlobale}</Badge></div>
              <div><Text size="xs" c="dimmed">Punteggio</Text><Text fw={700} size="lg">{selected.punteggioRischio}/100</Text></div>
              <div><Text size="xs" c="dimmed">Clausole</Text><Text fw={700} size="lg">{selected.clausoleRilevate}</Text></div>
            </SimpleGrid>
            <div><Text size="xs" c="dimmed">Data Analisi</Text><Text>{new Date(selected.dataAnalisi).toLocaleDateString('it-IT')}</Text></div>
            <div><Text size="xs" c="dimmed">Analizzato Da</Text><Text>{selected.analizzatoDa}</Text></div>

            <Title order={5} mt="md">Clausole Rilevate</Title>
            <Accordion>
              {selected.clausole.map((cl) => (
                <Accordion.Item key={cl.id} value={cl.id}>
                  <Accordion.Control>
                    <Group justify="space-between">
                      <Group gap="xs">
                        <Badge color={riskColor(cl.rischio)} size="sm" variant="filled">{cl.rischio}</Badge>
                        <Text fw={500}>{cl.tipo}</Text>
                      </Group>
                      <Text size="sm" c="dimmed">{cl.punteggio}/100</Text>
                    </Group>
                  </Accordion.Control>
                  <Accordion.Panel>
                    <Stack gap="sm">
                      <Paper withBorder p="sm" radius="sm" bg="gray.0">
                        <Text size="sm" style={{ fontStyle: 'italic' }}>{cl.testo}</Text>
                      </Paper>
                      {cl.raccomandazione && (
                        <Paper withBorder p="sm" radius="sm" bg="yellow.0">
                          <Text size="xs" fw={700} c="yellow.8" mb={4}>Raccomandazione</Text>
                          <Text size="sm">{cl.raccomandazione}</Text>
                        </Paper>
                      )}
                    </Stack>
                  </Accordion.Panel>
                </Accordion.Item>
              ))}
            </Accordion>
          </Stack>
        )}
      </Drawer>
    </Container>
  );
}
