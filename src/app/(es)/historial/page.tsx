'use client';
import { useState, useEffect } from 'react';
import {
  Card, CardBody, Chip, Button,
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
} from '@heroui/react';
import {
  IconClipboardList, IconCreditCard, IconCalendar, IconArrowRight,
  IconInbox, IconLogin, IconEye, IconPlayerPlay, IconUser, IconBriefcase,
} from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { guardarPerfil, type UsuarioPerfil } from '@/app/store/usuario/usuarioSlice';
import { reanudarSolicitud } from '@/app/store/solicitud/solicitudSlice';
import { registrarSesionUsuario, type SolicitudSesion } from '@/app/store/sesiones/sesionesSlice';
import ModalIngreso from '@/app/components/commun/ModalIngreso';

const PASO_LABELS = [
  'Identidad', 'Datos personales', 'Datos financieros',
  'Simulación', 'Autorizaciones', 'Resumen',
];

const TIPOS_EMP: Record<string, string> = {
  empleado_publico: 'Empleado público',
  empleado_privado: 'Empleado privado',
  pensionado: 'Pensionado',
  independiente: 'Independiente',
};

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

// ─── Skeleton ────────────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <main className='max-w-3xl mx-auto px-4 py-12 flex flex-col gap-6'>
      <div className='flex items-center gap-3'>
        <div className='w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/10 animate-pulse' />
        <div className='flex flex-col gap-1.5'>
          <div className='h-5 w-44 rounded bg-gray-100 dark:bg-white/10 animate-pulse' />
          <div className='h-3 w-64 rounded bg-gray-100 dark:bg-white/10 animate-pulse' />
        </div>
      </div>
      <div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
        {[1, 2, 3].map(i => (
          <div key={i} className='h-20 rounded-xl bg-gray-100 dark:bg-white/10 animate-pulse' />
        ))}
      </div>
      <div className='h-4 w-32 rounded bg-gray-100 dark:bg-white/10 animate-pulse' />
      {[1, 2].map(i => (
        <div key={i} className='h-36 rounded-xl bg-gray-100 dark:bg-white/10 animate-pulse' />
      ))}
    </main>
  );
}

// ─── Stat card ───────────────────────────────────────────────────────────────
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

// ─── Detalle modal ────────────────────────────────────────────────────────────
function ModalDetalle({
  solicitud,
  isOpen,
  onClose,
  onContinuar,
}: {
  solicitud: SolicitudSesion | null;
  isOpen: boolean;
  onClose: () => void;
  onContinuar: (s: SolicitudSesion) => void;
}) {
  if (!solicitud) return null;
  const { datosPersonales: dp, datosFinancieros: df, simulacion: sim } = solicitud;
  const res = sim?.resultado ?? null;

  return (
    <Modal isOpen={isOpen} onOpenChange={open => { if (!open) onClose(); }} size='2xl' scrollBehavior='inside'>
      <ModalContent>
        {(onCloseInternal) => (
          <>
            <ModalHeader className='flex flex-col gap-0.5'>
              <span className='font-mono text-sm text-primary'>{solicitud.id}</span>
              <span className='text-xs font-normal text-gray-400'>{formatFecha(solicitud.fecha)}</span>
            </ModalHeader>

            <ModalBody className='flex flex-col gap-4 pb-2'>
              {/* Status + paso */}
              <div className='flex items-center gap-2 flex-wrap'>
                <Chip
                  size='sm'
                  color={solicitud.status === 'completada' ? 'success' : solicitud.status === 'en-progreso' ? 'warning' : 'danger'}
                  variant='flat'
                >
                  {solicitud.status === 'completada' ? 'Enviada' : solicitud.status === 'en-progreso' ? 'En progreso' : 'Abandonada'}
                </Chip>
                {solicitud.status !== 'completada' && (
                  <span className='text-xs text-gray-400'>
                    Último paso: <strong>{PASO_LABELS[solicitud.paso] ?? `Paso ${solicitud.paso}`}</strong>
                  </span>
                )}
              </div>

              {/* Condiciones del crédito */}
              {res && (
                <Card shadow='none' className='bg-primary border-0 overflow-hidden'>
                  <CardBody className='p-4'>
                    <p className='text-[10px] font-bold uppercase tracking-widest text-white/60 mb-2'>
                      Condiciones del crédito
                    </p>
                    <div className='grid grid-cols-2 gap-x-6 gap-y-1.5'>
                      {[
                        ['Monto', formatCOP(Number(solicitud.monto))],
                        ['Plazo', `${solicitud.plazoMeses} meses`],
                        ['Cuota mensual', formatCOP(res.cuotaMensual)],
                        ['Tasa EA', `${res.tasaEA}%`],
                        ['Total intereses', formatCOP(res.totalIntereses)],
                        ['Total a pagar', formatCOP(res.totalPagar)],
                      ].map(([label, value]) => (
                        <div key={label} className='contents'>
                          <span className='text-white/60 text-xs'>{label}</span>
                          <span className='text-white font-semibold text-xs text-right'>{value}</span>
                        </div>
                      ))}
                    </div>
                  </CardBody>
                </Card>
              )}

              {/* Datos personales */}
              {dp && (
                <div>
                  <div className='flex items-center gap-1.5 mb-2'>
                    <IconUser size={13} className='text-primary/70' />
                    <p className='text-[10px] font-bold uppercase tracking-widest text-gray-400'>Datos personales</p>
                  </div>
                  <div className='grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs'>
                    {[
                      ['Nombre', `${dp.nombres} ${dp.apellidos}`],
                      ['Email', dp.email],
                      ['Teléfono', dp.telefono],
                      ['Ciudad', dp.ciudad],
                      ['Dirección', dp.direccion],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <p className='text-gray-400'>{label}</p>
                        <p className='font-medium text-gray-800 dark:text-gray-100 truncate'>{value || '—'}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Datos financieros */}
              {df && (
                <div>
                  <div className='flex items-center gap-1.5 mb-2'>
                    <IconBriefcase size={13} className='text-primary/70' />
                    <p className='text-[10px] font-bold uppercase tracking-widest text-gray-400'>Datos financieros</p>
                  </div>
                  <div className='grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs'>
                    {[
                      ['Tipo empleo', TIPOS_EMP[df.tipoEmpleo] ?? df.tipoEmpleo],
                      df.empresa ? ['Empresa', df.empresa] : null,
                      ['Ingreso mensual', formatCOP(Number(df.ingresoMensual))],
                      df.otrosIngresos ? ['Otros ingresos', formatCOP(Number(df.otrosIngresos))] : null,
                      ['Gastos mensuales', formatCOP(Number(df.gastosMensuales))],
                    ]
                      .filter((row): row is [string, string] => row !== null)
                      .map(([label, value]) => (
                        <div key={label}>
                          <p className='text-gray-400'>{label}</p>
                          <p className='font-medium text-gray-800 dark:text-gray-100'>{value || '—'}</p>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </ModalBody>

            <ModalFooter>
              <Button variant='flat' radius='full' onPress={() => { onCloseInternal(); onClose(); }}>
                Cerrar
              </Button>
              {solicitud.status === 'en-progreso' && (
                <Button
                  color='primary' radius='full'
                  endContent={<IconPlayerPlay size={15} />}
                  onPress={() => { onCloseInternal(); onContinuar(solicitud); }}
                >
                  Continuar solicitud
                </Button>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

// ─── Tarjeta de solicitud ─────────────────────────────────────────────────────
function TarjetaSolicitud({
  s,
  onVerDetalle,
}: {
  s: SolicitudSesion;
  onVerDetalle: (s: SolicitudSesion) => void;
}) {
  const completada = s.status === 'completada';
  const enProgreso = s.status === 'en-progreso';

  return (
    <Card shadow='none' className='bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 hover:border-primary/30 transition-colors'>
      <CardBody className='p-5'>
        <div className='flex items-start justify-between gap-4 mb-3'>
          <div className='flex flex-col gap-0.5'>
            <p className='font-mono text-[11px] text-gray-400 dark:text-gray-500'>{s.id}</p>
            <div className='flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400'>
              <IconCalendar size={12} />
              {formatFecha(s.fecha)}
            </div>
          </div>
          <Chip
            size='sm'
            color={completada ? 'success' : enProgreso ? 'warning' : 'danger'}
            variant='flat'
            className='shrink-0'
          >
            {completada ? 'Enviada' : enProgreso ? 'En progreso' : 'Abandonada'}
          </Chip>
        </div>

        {s.monto ? (
          <div className='grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3'>
            <div className='col-span-2 sm:col-span-1'>
              <p className='text-[10px] uppercase tracking-wide text-gray-400'>Monto</p>
              <p className='text-base font-bold text-primary'>{formatCOP(Number(s.monto))}</p>
            </div>
            <div>
              <p className='text-[10px] uppercase tracking-wide text-gray-400'>Plazo</p>
              <p className='text-sm font-semibold text-gray-800 dark:text-gray-100'>{s.plazoMeses} meses</p>
            </div>
            {s.cuotaMensual && (
              <div>
                <p className='text-[10px] uppercase tracking-wide text-gray-400'>Cuota mensual</p>
                <p className='text-sm font-semibold text-gray-800 dark:text-gray-100'>{formatCOP(s.cuotaMensual)}</p>
              </div>
            )}
            {s.totalPagar && (
              <div>
                <p className='text-[10px] uppercase tracking-wide text-gray-400'>Total a pagar</p>
                <p className='text-sm font-semibold text-gray-800 dark:text-gray-100'>{formatCOP(s.totalPagar)}</p>
              </div>
            )}
          </div>
        ) : (
          <p className='text-xs text-gray-500 dark:text-gray-400 mb-3'>
            Se quedó en: <span className='font-medium text-gray-700 dark:text-gray-300'>
              {PASO_LABELS[s.paso] ?? `Paso ${s.paso}`}
            </span>
          </p>
        )}

        <div className='flex gap-2'>
          <Button
            size='sm' variant='flat' radius='full'
            startContent={<IconEye size={13} />}
            onPress={() => onVerDetalle(s)}
          >
            Ver detalles
          </Button>
          {enProgreso && (
            <Button
              size='sm' color='primary' variant='flat' radius='full'
              endContent={<IconPlayerPlay size={13} />}
              onPress={() => onVerDetalle(s)}
            >
              Continuar
            </Button>
          )}
        </div>
      </CardBody>
    </Card>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────
export default function HistorialPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const usuario = useAppSelector(s => s.usuario);
  const sesiones = useAppSelector(s => s.sesiones.sesiones);

  const [mounted, setMounted] = useState(false);
  const [modalIngresoOpen, setModalIngresoOpen] = useState(false);
  const [solicitudDetalle, setSolicitudDetalle] = useState<SolicitudSesion | null>(null);

  useEffect(() => { setMounted(true); }, []);

  function handleLoginSuccess(perfil: UsuarioPerfil) {
    dispatch(guardarPerfil(perfil));
    dispatch(registrarSesionUsuario(perfil));
    setModalIngresoOpen(false);
  }

  function handleContinuar(s: SolicitudSesion) {
    setSolicitudDetalle(null);
    dispatch(reanudarSolicitud({
      id: s.id,
      creadoEn: s.fecha,
      paso: s.paso,
      tipoDocumento: s.tipoDocumento,
      numeroDocumento: s.numeroDocumento,
      datosPersonales: s.datosPersonales,
      datosFinancieros: s.datosFinancieros,
      simulacion: s.simulacion,
    }));
    router.push('/solicitar-credito');
  }

  if (!mounted) return <Skeleton />;

  const loggedIn = !!usuario.numeroDocumento;
  const sesionActual = sesiones.find(s => s.usuario.numeroDocumento === usuario.numeroDocumento);
  const solicitudes = sesionActual?.solicitudes ?? [];
  const completadas = solicitudes.filter(s => s.status === 'completada');
  const totalSolicitado = completadas.reduce((acc, s) => acc + Number(s.monto ?? 0), 0);
  const enProgreso = solicitudes.filter(s => s.status === 'en-progreso');

  // ── No logueado ──
  if (!loggedIn) {
    return (
      <>
        <main className='max-w-3xl mx-auto px-4 py-20 flex flex-col items-center text-center gap-5 fade-in'>
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
            <Button color='primary' radius='full' startContent={<IconLogin size={16} />}
              onPress={() => setModalIngresoOpen(true)}>
              Ingresar
            </Button>
            <Button as={Link} href='/perfil' variant='flat' radius='full'>
              Crear perfil
            </Button>
            <Button as={Link} href='/solicitar-credito' variant='bordered' radius='full'
              endContent={<IconArrowRight size={16} />}>
              Solicitar crédito
            </Button>
          </div>
        </main>
        <ModalIngreso isOpen={modalIngresoOpen} onClose={() => setModalIngresoOpen(false)} onSuccess={handleLoginSuccess} />
      </>
    );
  }

  // ── Sin solicitudes ──
  if (solicitudes.length === 0) {
    return (
      <main className='max-w-3xl mx-auto px-4 py-20 flex flex-col items-center text-center gap-5 fade-in'>
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

  // ── Con solicitudes ──
  return (
    <>
      <main className='max-w-3xl mx-auto px-4 py-12 flex flex-col gap-6 fade-in'>
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
            sub={`${completadas.length} enviadas · ${enProgreso.length} en progreso`}
          />
          <StatCard
            label='Monto total solicitado'
            value={formatCOP(totalSolicitado)}
            sub='Solo solicitudes enviadas'
          />
          <StatCard
            label='Última solicitud'
            value={formatFecha(solicitudes[solicitudes.length - 1].fecha)}
            sub={solicitudes[solicitudes.length - 1].status === 'completada' ? 'Enviada'
              : solicitudes[solicitudes.length - 1].status === 'en-progreso' ? 'En progreso' : 'Abandonada'}
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
            <TarjetaSolicitud key={s.id} s={s} onVerDetalle={setSolicitudDetalle} />
          ))}
        </div>
      </main>

      {/* Modal de detalles */}
      <ModalDetalle
        solicitud={solicitudDetalle}
        isOpen={!!solicitudDetalle}
        onClose={() => setSolicitudDetalle(null)}
        onContinuar={handleContinuar}
      />
    </>
  );
}
