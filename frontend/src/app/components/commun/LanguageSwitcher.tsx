'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
const routeMapping: Record<string, string> = {
  '/': '/en',
};
const reverseRouteMapping: Record<string, string> = Object.entries(
  routeMapping,
).reduce(
  (acc, [es, en]) => {
    acc[en] = es;
    return acc;
  },
  {} as Record<string, string>,
);
type Props = {
  locale: 'es' | 'en';
};
const LanguageSwitcher = ({ locale }: Props) => {
  const pathname = usePathname();
  const isEnglish = locale === 'en';
  const getAlternatePath = () => {
    if (isEnglish) {
      if (reverseRouteMapping[pathname]) {
        return reverseRouteMapping[pathname];
      }
      const withoutEn = pathname.replace(/^\/en/, '');
      return withoutEn || '/';
    } else {
      if (routeMapping[pathname]) {
        return routeMapping[pathname];
      }
      return `/en${pathname}`;
    }
  };
  const alternatePath = getAlternatePath();
  const alternateLabel = isEnglish ? 'Español' : 'English';
  const alternateFlag = isEnglish ? '🇪🇸' : '🇺🇸';
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  return (
    <>
      {isClient && (
        <Link
          href={alternatePath}
          style={{
            background: '#ddd',
            color: '#000',
            padding: '6px 10px',
            borderRadius: '6px',
            cursor: 'pointer',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <span>{alternateFlag}</span>
          <span>{alternateLabel}</span>
        </Link>
      )}
    </>
  );
};
export default LanguageSwitcher;
