'use client';

import { usePathname } from 'next/navigation';

const Footer = () => {
  const pathname = usePathname();
  const isEnglish = pathname.startsWith('/en');

  return (
    <header className='flex justify-between'>
      <div className='basis-1/2'>{isEnglish ? 'Footer' : 'Pie de pagina'}</div>
      <div className='basis-1/2'>
        {isEnglish ? 'Social media' : 'Redes sociales'}
      </div>
    </header>
  );
};
export default Footer;
