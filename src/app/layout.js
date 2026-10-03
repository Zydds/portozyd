import { Inter } from 'next/font/google';
import './globals.css';
import SessionProvider from '@/components/SessionProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata = {
  title: 'Zaidan Ghiffari Azhar — Portfolio',
  description: 'Quality Assurance · Web Development · Project Management',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.variable}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
