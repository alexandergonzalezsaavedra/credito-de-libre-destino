import { IconCashBanknoteHeart } from '@tabler/icons-react';
import Link from 'next/link';

const LogoBrand = () => {
  return (
    <Link
      href='/'
      className='flex items-center gap-2 no-underline group'
    >
      <div className='flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white shadow-sm group-hover:shadow-md transition-shadow'>
        <IconCashBanknoteHeart
          size={18}
          stroke={2}
        />
      </div>
      <div className='flex flex-col leading-none'>
        <span className='text-base font-bold tracking-widest text-primary'>
          CLD
        </span>
        <span className='text-[9px] font-medium tracking-wide text-default-500 uppercase'>
          Crédito de Libre Destino
        </span>
      </div>
    </Link>
  );
};

export default LogoBrand;
