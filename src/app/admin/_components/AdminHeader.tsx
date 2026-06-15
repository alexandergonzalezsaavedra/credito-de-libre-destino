'use client';
import { useEffect, useState } from 'react';
import { Button } from '@heroui/react';
import {
  IconList, IconLogin, IconLogout, IconArrowLeft, IconShieldCheck,
} from '@tabler/icons-react';
import { useRouter, usePathname } from 'next/navigation';
import { isAdminAuthenticated, logoutAdmin } from '@/app/admin/_lib/credentials';

export default function AdminHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [autenticado, setAutenticado] = useState(false);

  useEffect(() => {
    setAutenticado(isAdminAuthenticated());
  }, [pathname]);

  function handleCerrarSesion() {
    logoutAdmin();
    setAutenticado(false);
    router.push('/admin');
  }

  return (
    <header className='sticky top-0 z-50 bg-gray-900 dark:bg-black border-b border-gray-700 shadow-lg'>
      <div className='max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-3'>

        {/* Brand */}
        <div className='flex items-center gap-2 shrink-0'>
          <div className='w-7 h-7 rounded-lg bg-primary/20 text-primary flex items-center justify-center'>
            <IconShieldCheck size={16} />
          </div>
          <span className='text-white font-bold text-sm hidden sm:block'>Panel Administrador</span>
        </div>

        {/* Acciones */}
        <div className='flex items-center gap-2'>
          <Button
            size='sm'
            variant='flat'
            radius='full'
            className='text-gray-300 bg-white/10 hover:bg-white/20'
            startContent={<IconList size={15} />}
            onPress={() => router.push('/admin/dashboard')}
            isDisabled={!autenticado}
          >
            <span className='hidden sm:inline'>Lista de solicitudes</span>
            <span className='sm:hidden'>Solicitudes</span>
          </Button>

          {autenticado ? (
            <Button
              size='sm'
              variant='flat'
              radius='full'
              className='text-red-400 bg-red-500/10 hover:bg-red-500/20'
              startContent={<IconLogout size={15} />}
              onPress={handleCerrarSesion}
            >
              <span className='hidden sm:inline'>Cerrar sesión</span>
            </Button>
          ) : (
            <Button
              size='sm'
              variant='flat'
              radius='full'
              className='text-green-400 bg-green-500/10 hover:bg-green-500/20'
              startContent={<IconLogin size={15} />}
              onPress={() => router.push('/admin')}
            >
              <span className='hidden sm:inline'>Iniciar sesión</span>
            </Button>
          )}

          <Button
            size='sm'
            variant='flat'
            radius='full'
            className='text-gray-300 bg-white/10 hover:bg-white/20'
            startContent={<IconArrowLeft size={15} />}
            onPress={() => router.push('/')}
          >
            <span className='hidden sm:inline'>Volver al inicio</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
