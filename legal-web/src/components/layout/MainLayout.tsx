import { AppShell, NavLink, Group, Title, Badge, ActionIcon, useMantineColorScheme } from '@mantine/core';
import { useNavigate, useLocation } from 'react-router-dom';
import { IconHome, IconFileText, IconBulb, IconCalendarEvent, IconShieldCheck, IconGavel, IconRobot, IconSettings, IconSun, IconMoon } from '@tabler/icons-react';
const navItems = [
  { icon: IconHome, label: 'Dashboard', path: '/' },
  { icon: IconFileText, label: 'Contratti', path: '/contratti' },
  { icon: IconBulb, label: 'Proprieta Intellettuale', path: '/ip' },
  { icon: IconCalendarEvent, label: 'Scadenze', path: '/scadenze' },
  { icon: IconShieldCheck, label: 'Compliance', path: '/compliance' },
  { icon: IconGavel, label: 'Contenzioso', path: '/contenzioso' },
  { icon: IconRobot, label: 'AI Assistant', path: '/ai' },
  { icon: IconSettings, label: 'Impostazioni', path: '/impostazioni' },
];
export default function MainLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  return (<AppShell navbar={{ width: 250, breakpoint: 'sm' }} header={{ height: 50 }} padding="md">
      <AppShell.Header><Group h="100%" px="md" justify="space-between"><Group><Title order={4}>LEGAL Microservices</Title><Badge variant="light" size="sm">v0.1</Badge></Group><ActionIcon variant="subtle" onClick={toggleColorScheme}>{colorScheme === 'dark' ? <IconSun size={18} /> : <IconMoon size={18} />}</ActionIcon></Group></AppShell.Header>
      <AppShell.Navbar p="xs">{navItems.map((item) => (<NavLink key={item.path} leftSection={<item.icon size={20} />} label={item.label} active={location.pathname === item.path} onClick={() => navigate(item.path)} />))}</AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main></AppShell>);
}
