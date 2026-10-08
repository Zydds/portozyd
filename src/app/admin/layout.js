import { ThemeProvider } from '@/components/ThemeProvider';
import AdminShell from '@/components/admin/AdminShell';

export default function AdminLayout({ children }) {
  return (
    <ThemeProvider>
      <AdminShell>{children}</AdminShell>
    </ThemeProvider>
  );
}
