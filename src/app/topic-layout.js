import { ThemeProvider } from '@/components/ThemeProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getSharedData } from '@/lib/home-data';

export default async function TopicLayout({ children }) {
  const { details, profile } = await getSharedData();

  return (
    <ThemeProvider>
      <Header />
      <main style={{ paddingTop: '64px' }}>
        {children}
      </main>
      <Footer profile={profile} details={details} />
    </ThemeProvider>
  );
}
