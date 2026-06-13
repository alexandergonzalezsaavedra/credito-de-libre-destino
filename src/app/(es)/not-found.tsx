import Link from 'next/link';
import { Button } from '@heroui/react';
import { House, MapPinOff } from 'lucide-react';

export default function NotFound() {
  return (
    <main className='min-h-[70vh] flex flex-col justify-center items-center px-4 text-center'>
      <MapPinOff
        size={56}
        className='text-gray-400 dark:text-gray-500 mb-4'
      />
      <h1 className='text-6xl font-extrabold text-gray-800 dark:text-gray-200 tracking-tight'>
        404
      </h1>
      <p className='text-lg text-gray-600 dark:text-gray-400 mt-2 mb-1'>
        Pagina no encontrada
      </p>
      <p className='text-sm text-gray-500 dark:text-gray-500 mb-8 max-w-md'>
        La pagina que buscas no existe o fue movida. Vuelve al inicio para
        solicitar digitalmente tu crédito de libre destino.
      </p>
      <Button
        as={Link}
        href='/'
        radius='full'
        size='lg'
        color='danger'
        variant='flat'
        startContent={<House size={18} />}
      >
        Volver al inicio
      </Button>
    </main>
  );
}
