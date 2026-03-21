import { RegistryClientProvider } from '@/providers';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Excellence Dental',
  description: 'Professional dental care services',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>
        <RegistryClientProvider>{children}</RegistryClientProvider>
      </body>
    </html>
  );
}
