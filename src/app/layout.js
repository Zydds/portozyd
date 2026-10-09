import { Spectral, IBM_Plex_Mono, Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import GrainOverlay from '@/components/GrainOverlay';
import { getSiteTitle } from '@/lib/home-data';

const spectral = Spectral({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['italic'], // every Spectral usage on the site is italic
  variable: '--font-spectral',
  display: 'swap',
  preload: false, // not preloaded → no unused-weight console warnings; loads on first use (swap)
});

const ibmMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
  preload: false, // same: Inter (preloaded) covers body text; Spectral/Mono swap in via @font-face
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
});

const DESCRIPTION = 'Personal portfolio of Zaidan Ghiffari Azhar — QA, Web Dev, Project Management.';

export async function generateMetadata() {
  const title = await getSiteTitle();
  return {
    title,
    description: DESCRIPTION,
    openGraph: {
      title,
      description: DESCRIPTION,
      siteName: 'ZYD Portfolio',
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary',
      title,
      description: DESCRIPTION,
    },
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${spectral.variable} ${ibmMono.variable} ${inter.variable}`} suppressHydrationWarning>
      <body>
        <GrainOverlay />
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
