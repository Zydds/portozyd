import { ThemeProvider } from '@/components/ThemeProvider';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout({ children }) {
  return (
    <ThemeProvider>
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
        <AdminSidebar />
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </ThemeProvider>
  );
}
