'use client';
import { useState, useEffect } from 'react';
import { Button, Input, Card, CardBody } from '@heroui/react';
import { IconUser, IconLock, IconLogin, IconAlertCircle, IconShieldCheck, IconEye, IconEyeOff } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { ADMIN_CREDENTIALS, isAdminAuthenticated, loginAdmin } from '@/app/admin/_lib/credentials';

export default function AdminLoginPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const [mostrarContrasena, setMostrarContrasena] = useState(false);

  useEffect(() => {
    if (isAdminAuthenticated()) router.replace('/admin/dashboard');
  }, [router]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setCargando(true);
    await new Promise(r => setTimeout(r, 500));

    if (
      usuario.trim() === ADMIN_CREDENTIALS.usuario &&
      contrasena === ADMIN_CREDENTIALS.contrasena
    ) {
      loginAdmin();
      router.push('/admin/dashboard');
    } else {
      setError('Usuario o contraseña incorrectos');
    }
    setCargando(false);
  }

  return (
    <main className='flex items-center justify-center min-h-[calc(100vh-56px)] px-4 py-12'>
      <Card shadow='lg' className='w-full max-w-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700'>
        <CardBody className='p-8 flex flex-col gap-6'>

          {/* Logo */}
          <div className='flex flex-col items-center gap-3 text-center'>
            <div className='w-14 h-14 rounded-2xl bg-gray-900 dark:bg-gray-800 text-white flex items-center justify-center shadow-md'>
              <IconShieldCheck size={28} stroke={1.5} />
            </div>
            <div>
              <h1 className='text-xl font-bold text-gray-900 dark:text-white'>Panel Administrador</h1>
              <p className='text-xs text-gray-400 mt-0.5'>Crédito de Libre Destino — BCS</p>
            </div>
          </div>

          {/* Formulario */}
          <form onSubmit={handleLogin} className='flex flex-col gap-4'>
            <Input
              label='Usuario'
              placeholder='admin'
              value={usuario}
              onValueChange={v => { setUsuario(v); setError(''); }}
              startContent={<IconUser size={16} className='text-gray-400' />}
              autoComplete='username'
              isRequired
            />
            <Input
              label='Contraseña'
              type={mostrarContrasena ? 'text' : 'password'}
              placeholder='••••••••'
              value={contrasena}
              onValueChange={v => { setContrasena(v); setError(''); }}
              startContent={<IconLock size={16} className='text-gray-400' />}
              endContent={
                <button
                  type='button'
                  onClick={() => setMostrarContrasena(v => !v)}
                  className='text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors'
                  tabIndex={-1}
                >
                  {mostrarContrasena
                    ? <IconEyeOff size={16} />
                    : <IconEye size={16} />
                  }
                </button>
              }
              autoComplete='current-password'
              isRequired
            />

            {error && (
              <div className='flex items-center gap-2 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-xl px-3 py-2'>
                <IconAlertCircle size={15} className='shrink-0' />
                {error}
              </div>
            )}

            <Button
              type='submit'
              color='primary'
              radius='full'
              size='lg'
              isLoading={cargando}
              endContent={!cargando && <IconLogin size={16} />}
              className='font-semibold mt-1'
            >
              {cargando ? 'Verificando...' : 'Ingresar'}
            </Button>
          </form>
        </CardBody>
      </Card>
    </main>
  );
}
