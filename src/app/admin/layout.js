import { ThemeProvider } from '@/components/ThemeProvider';
import SessionProvider from '@/components/SessionProvider';
import AdminShell from '@/components/admin/AdminShell';

export default function AdminLayout({ children }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <AdminShell>{children}</AdminShell>
      </ThemeProvider>
    </SessionProvider>
  );
}
