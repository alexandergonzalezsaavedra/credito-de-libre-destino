import Link from 'next/link';
import LanguageSwitcher from './LanguageSwitcher';

type Props = {
  locale: 'es' | 'en';
};

const Header = ({ locale }: Props) => {
  const isEnglish = locale === 'en';
  return (
    <header className='mb-6'>
      <div className='flex justify-between w-full'>
        <div className='basis-1/2'>
          {isEnglish ? 'Menu english' : 'Menú español'}
        </div>
        <div className='basis-1/2 flex justify-end gap-4'>
          <Link
            href={isEnglish ? '/en' : '/'}
            className='font-bold text-blue-600'
          >
            {isEnglish ? 'Home' : 'Inicio'}
          </Link>
          <Link
            href={isEnglish ? '/en/projects-ar' : '/proyectos-ar'}
            className='font-bold text-blue-600'
          >
            {isEnglish ? 'Projects' : 'Proyectos'}
          </Link>
          <LanguageSwitcher locale={locale} />
        </div>
      </div>
    </header>
  );
};

export default Header;
