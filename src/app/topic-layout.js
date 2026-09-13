import { ThemeProvider } from '@/components/ThemeProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function TopicLayout({ children }) {
  return (
    <ThemeProvider>
      <Header />
      <main style={{ paddingTop: '64px' }}>
        {children}
      </main>
      <Footer />
    </ThemeProvider>
  );
}
