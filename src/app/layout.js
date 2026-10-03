import { Spectral, IBM_Plex_Mono, Inter } from 'next/font/google';
import './globals.css';
import SessionProvider from '@/components/SessionProvider';
import { ThemeProvider } from '@/components/ThemeProvider';
import GrainOverlay from '@/components/GrainOverlay';

const spectral = Spectral({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-spectral',
  display: 'swap',
});

const ibmMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata = {
  title: 'ZYD — Quality Assurance & Web Development',
  description: 'Personal portfolio of Zaidan Ghiffari Azhar — QA, Web Dev, Project Management.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${spectral.variable} ${ibmMono.variable} ${inter.variable}`} suppressHydrationWarning>
      <body>
        <GrainOverlay />
        <SessionProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
