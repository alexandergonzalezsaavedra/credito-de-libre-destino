import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { ProvidersUI } from '../Providers';
import type { Metadata } from 'next';
import { Header, Footer } from '../components';

export const metadata: Metadata = {
  title: 'Alexander González - Solicitud Digital de Crédito de Libre Destino',
  description: 'Prueba técnica - Solicitud Digital de Crédito de Libre Destino',
};

export default async function EsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProvidersUI>
      <NextThemesProvider
        attribute='class'
        defaultTheme='light'
        enableSystem={false}
        storageKey='ar-construcciones-theme'
      >
        <Header />
        {children}
        <Footer />
      </NextThemesProvider>
    </ProvidersUI>
  );
}
