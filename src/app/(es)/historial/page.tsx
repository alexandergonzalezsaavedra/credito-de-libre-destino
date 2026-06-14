'use client';
import { useState, useEffect } from 'react';
import { Card, CardBody, Chip, Button } from '@heroui/react';
import {
  IconClipboardList, IconCreditCard, IconCalendar,
  IconArrowRight, IconInbox, IconLogin,
} from '@tabler/icons-react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { guardarPerfil, type UsuarioPerfil } from '@/app/store/usuario/usuarioSlice';
import type { SolicitudHistorial } from '@/app/store/historial/historialSlice';
import ModalIngreso from '@/app/components/commun/ModalIngreso';

function formatCOP(n: number) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency', currency: 'COP', maximumFractionDigits: 0,
  }).format(n);
}

function formatFecha(iso: string) {
  return new Date(iso).toLocaleDateString('es-CO', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

function Skeleton() {
  return (
    <main className='max-w-3xl mx-auto px-4 py-12 flex flex-col gap-6'>
      {/* título */}
      <div className='flex items-center gap-3'>
        <div className='w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/10 animate-pulse' />
        <div className='flex flex-col gap-1.5'>
          <div className='h-5 w-44 rounded bg-gray-100 dark:bg-white/10 animate-pulse' />
          <div className='h-3 w-64 rounded bg-gray-100 dark:bg-white/10 animate-pulse' />
        </div>
      </div>
      {/* stats */}
      <div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
        {[1, 2, 3].map(i => (
          <div key={i} className='h-20 rounded-xl bg-gray-100 dark:bg-white/10 animate-pulse' />
        ))}
      </div>
      {/* divider */}
      <div className='h-4 w-32 rounded bg-gray-100 dark:bg-white/10 animate-pulse' />
      {/* tarjetas */}
      {[1, 2].map(i => (
        <div key={i} className='h-36 rounded-xl bg-gray-100 dark:bg-white/10 animate-pulse' />
      ))}
    </main>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <Card shadow='none' className='bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10'>
      <CardBody className='p-4'>
        <p className='text-xs text-gray-500 dark:text-gray-400'>{label}</p>
        <p className='text-xl font-bold text-gray-800 dark:text-gray-100 mt-0.5'>{value}</p>
        {sub && <p className='text-[11px] text-gray-400 mt-0.5'>{sub}</p>}
      </CardBody>
    </Card>
  );
}

function TarjetaSolicitud({ s }: { s: SolicitudHistorial }) {
  const completada = s.status === 'completada';
  return (
    <Card shadow='none' className='bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 hover:border-primary/30 transition-colors'>
      <CardBody className='p-5'>
        <div className='flex items-start justify-between gap-4 mb-4'>
          <div className='flex flex-col gap-0.5'>
            <p className='font-mono text-[11px] text-gray-400 dark:text-gray-500'>{s.id}</p>
            <div className='flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400'>
              <IconCalendar size={12} />
              {formatFecha(s.fecha)}
            </div>
          </div>
          <Chip
            size='sm'
            color={completada ? 'success' : 'warning'}
            variant='flat'
            className='shrink-0'
          >
            {completada ? 'Enviada' : 'Pausada'}
          </Chip>
        </div>

        <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
          <div className='col-span-2 sm:col-span-1'>
            <p className='text-[10px] uppercase tracking-wide text-gray-400'>Monto</p>
            <p className='text-base font-bold text-primary'>{formatCOP(Number(s.monto))}</p>
          </div>
          <div>
            <p className='text-[10px] uppercase tracking-wide text-gray-400'>Plazo</p>
            <p className='text-sm font-semibold text-gray-800 dark:text-gray-100'>{s.plazoMeses} meses</p>
          </div>
          <div>
            <p className='text-[10px] uppercase tracking-wide text-gray-400'>Cuota mensual</p>
            <p className='text-sm font-semibold text-gray-800 dark:text-gray-100'>{formatCOP(s.cuotaMensual)}</p>
          </div>
          <div>
            <p className='text-[10px] uppercase tracking-wide text-gray-400'>Total a pagar</p>
            <p className='text-sm font-semibold text-gray-800 dark:text-gray-100'>{formatCOP(s.totalPagar)}</p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

export default function HistorialPage() {
  const dispatch = useAppDispatch();
  const usuario = useAppSelector(s => s.usuario);
  const todasSolicitudes = useAppSelector(s => s.historial.solicitudes);

  const [mounted, setMounted] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  function handleLoginSuccess(perfil: UsuarioPerfil) {
    dispatch(guardarPerfil(perfil));
    setModalOpen(false);
  }

  if (!mounted) return <Skeleton />;

  const loggedIn = !!usuario.numeroDocumento;
  const solicitudes = loggedIn
    ? todasSolicitudes.filter(s => s.numeroDocumento === usuario.numeroDocumento)
    : [];

  const completadas = solicitudes.filter(s => s.status === 'completada');
  const totalSolicitado = completadas.reduce((acc, s) => acc + Number(s.monto), 0);

  if (!loggedIn) {
    return (
      <>
        <main className='max-w-3xl mx-auto px-4 py-20 flex flex-col items-center text-center gap-5 animate-in fade-in duration-300'>
          <div className='w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center'>
            <IconClipboardList size={32} stroke={1.5} />
          </div>
          <div>
            <h1 className='text-2xl font-bold text-gray-800 dark:text-gray-100'>Historial de solicitudes</h1>
            <p className='text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-sm'>
              Inicia sesión con tu número de documento y fecha de nacimiento para ver
              el historial de tus solicitudes de crédito.
            </p>
          </div>
          <div className='flex flex-col sm:flex-row gap-3'>
            <Button
              color='primary' radius='full'
              startContent={<IconLogin size={16} />}
              onPress={() => setModalOpen(true)}
            >
              Ingresar
            </Button>
            <Button
              as={Link} href='/perfil' variant='flat' radius='full'
            >
              Crear perfil
            </Button>
            <Button
              as={Link} href='/solicitar-credito' variant='bordered' radius='full'
              endContent={<IconArrowRight size={16} />}
            >
              Solicitar crédito
            </Button>
          </div>
        </main>

        <ModalIngreso
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSuccess={handleLoginSuccess}
        />
      </>
    );
  }

  if (solicitudes.length === 0) {
    return (
      <main className='max-w-3xl mx-auto px-4 py-20 flex flex-col items-center text-center gap-5 animate-in fade-in duration-300'>
        <div className='w-16 h-16 rounded-2xl bg-gray-100 dark:bg-white/10 text-gray-400 flex items-center justify-center'>
          <IconInbox size={32} stroke={1.5} />
        </div>
        <div>
          <h1 className='text-2xl font-bold text-gray-800 dark:text-gray-100'>Sin solicitudes aún</h1>
          <p className='text-sm text-gray-500 dark:text-gray-400 mt-2'>
            Hola, <strong>{usuario.nombres}</strong>. Todavía no tienes solicitudes registradas.
          </p>
        </div>
        <Button as={Link} href='/solicitar-credito' color='primary' radius='full'
          endContent={<IconArrowRight size={16} />}>
          Realizar mi primera solicitud
        </Button>
      </main>
    );
  }

  return (
    <main className='max-w-3xl mx-auto px-4 py-12 flex flex-col gap-6 animate-in fade-in duration-300'>
      {/* Título */}
      <div className='flex items-center gap-3'>
        <div className='w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0'>
          <IconClipboardList size={22} stroke={1.8} />
        </div>
        <div>
          <h1 className='text-xl font-bold text-gray-800 dark:text-gray-100'>Mis solicitudes</h1>
          <p className='text-xs text-gray-500 dark:text-gray-400'>
            {usuario.nombres} {usuario.apellidos} · {usuario.tipoDocumento} {usuario.numeroDocumento}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
        <StatCard
          label='Total solicitudes'
          value={String(solicitudes.length)}
          sub={`${completadas.length} enviadas`}
        />
        <StatCard
          label='Monto total solicitado'
          value={formatCOP(totalSolicitado)}
          sub='Solo solicitudes enviadas'
        />
        <StatCard
          label='Última solicitud'
          value={formatFecha(solicitudes[solicitudes.length - 1].fecha)}
          sub={solicitudes[solicitudes.length - 1].status === 'completada' ? 'Enviada' : 'Pausada'}
        />
      </div>

      {/* Divider + acción */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <IconCreditCard size={14} className='text-primary/70' />
          <p className='text-[10px] font-bold uppercase tracking-widest text-gray-400'>
            Detalle ({solicitudes.length})
          </p>
        </div>
        <Button as={Link} href='/solicitar-credito' size='sm' color='primary'
          variant='flat' radius='full' endContent={<IconArrowRight size={14} />}>
          Nueva solicitud
        </Button>
      </div>

      {/* Lista — más reciente primero */}
      <div className='flex flex-col gap-3'>
        {[...solicitudes].reverse().map(s => (
          <TarjetaSolicitud key={s.id} s={s} />
        ))}
      </div>
    </main>
  );
}
