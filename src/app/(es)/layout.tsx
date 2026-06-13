import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '../globals.css';
import { Header, Footer } from '../components';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Alexander González - Solicitud Digital de Crédito de Libre Destino',
  description: 'Prueba técnica - Solicitud Digital de Crédito de Libre Destino',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='es'>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Header locale='es' />
        {children}
        <Footer />
      </body>
    </html>
  );
}
