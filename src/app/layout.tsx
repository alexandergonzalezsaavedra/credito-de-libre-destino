import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Script from 'next/script';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Alexander González',
  description: 'Solicitud Digital de Crédito de Libre Destino',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning data-scroll-behavior='smooth'>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
        <Script src='https://www.googletagmanager.com/gtag/js?id=G-TQB3SJV5HN' strategy='afterInteractive' />
        <Script id='gtag-init' strategy='afterInteractive'>{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-TQB3SJV5HN');
        `}</Script>
        <Script id='clarity' strategy='afterInteractive'>{`
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "x8hot5pofd");
        `}</Script>
      </body>
    </html>
  );
}
