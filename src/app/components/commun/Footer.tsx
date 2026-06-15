'use client';
import { Link } from '@heroui/react';
import { IconBrandLinkedin, IconBrandGithub } from '@tabler/icons-react';
import LogoBrand from './LogoBrand';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className='border-t border-gray-200 dark:border-white/10 bg-white dark:bg-black mt-auto'>
      <div className='max-w-5xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4'>

        {/* Logo + copyright */}
        <div className='flex flex-col items-center sm:items-start gap-1'>
          <LogoBrand />
          <p className='text-xs text-gray-400 dark:text-gray-500 mt-1'>
            © {year} Banco Caja Social · Crédito de Libre Destino
          </p>
          <p className='text-xs text-gray-400 dark:text-gray-500'>
            Powered by{' '}
            <span className='font-semibold text-gray-600 dark:text-gray-300'>Alexander González</span>
          </p>
        </div>

        {/* Redes sociales */}
        <div className='flex items-center gap-4'>
          <Link
            href='https://www.linkedin.com/in/alexander-gonzalez-saavedra'
            isExternal
            className='flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-primary transition-colors'
          >
            <IconBrandLinkedin size={18} className='text-[#0A66C2]' />
            <span className='hidden sm:inline'>LinkedIn</span>
          </Link>
          <Link
            href='https://github.com/alexandergonzalezsaavedra/credito-de-libre-destino'
            isExternal
            className='flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-primary transition-colors'
          >
            <IconBrandGithub size={18} />
            <span className='hidden sm:inline'>GitHub</span>
          </Link>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
