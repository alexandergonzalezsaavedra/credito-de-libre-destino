'use client';
import { useState, useEffect } from 'react';
import {
  Card, CardBody, Chip, Button,
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
} from '@heroui/react';
import {
  IconClipboardList, IconCreditCard, IconCalendar, IconArrowRight,
  IconInbox, IconLogin, IconEye, IconPlayerPlay, IconUser, IconBriefcase,
  IconSortAscending, IconSortDescending,
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
    <main className='max-w-3xl mx-auto px-4 py-12 flex flex-col gap-6 min-h-[calc(100vh-160px)] justify-center'>
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

  const statusColor = solicitud.status === 'completada' ? 'success' : solicitud.status === 'en-progreso' ? 'warning' : 'danger';
  const statusLabel = solicitud.status === 'completada' ? 'Enviada' : solicitud.status === 'en-progreso' ? 'En progreso' : 'Abandonada';

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={open => { if (!open) onClose(); }}
      size='2xl'
    >
      <ModalContent className='max-h-[90svh] flex flex-col overflow-hidden'>
        {(onCloseInternal) => (
          <>
            <ModalHeader className='flex flex-row items-start justify-between gap-3 pb-3 shrink-0'>
              <div>
                <p className='font-mono text-sm font-bold text-primary'>{solicitud.id}</p>
                <p className='text-xs font-normal text-gray-400 mt-0.5'>{formatFecha(solicitud.fecha)}</p>
              </div>
              <Chip size='sm' color={statusColor} variant='flat' className='shrink-0 mt-0.5'>
                {statusLabel}
              </Chip>
            </ModalHeader>

            <ModalBody className='p-0 overflow-y-auto min-h-0 flex-1'>
              <div className='flex flex-col gap-5 px-6 py-2 pb-6'>

              {/* Aviso en progreso */}
              {solicitud.status !== 'completada' && (
                <div className='bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 rounded-xl px-4 py-3'>
                  <span className='text-xs text-amber-700 dark:text-amber-400'>
                    Último paso completado: <strong>{PASO_LABELS[solicitud.paso] ?? `Paso ${solicitud.paso}`}</strong>
                  </span>
                </div>
              )}

              {/* Condiciones del crédito */}
              {res && (
                <div className='rounded-2xl overflow-hidden bg-linear-to-br from-primary to-blue-700'>
                  <div className='px-5 pt-5 pb-4'>
                    <p className='text-[10px] font-bold uppercase tracking-widest text-white/50 mb-3'>
                      Condiciones del crédito
                    </p>
                    <p className='text-white/60 text-xs mb-0.5'>Monto aprobado</p>
                    <p className='text-white text-3xl font-extrabold leading-none'>
                      {formatCOP(Number(solicitud.monto))}
                    </p>
                  </div>
                  <div className='border-t border-white/20 divide-y divide-white/10'>
                    {[
                      ['Plazo', `${solicitud.plazoMeses} meses`],
                      ['Cuota mensual', formatCOP(res.cuotaMensual)],
                      ['Tasa EA', `${res.tasaEA}%`],
                      ['Total intereses', formatCOP(res.totalIntereses)],
                      ['Total a pagar', formatCOP(res.totalPagar)],
                    ].map(([label, value]) => (
                      <div key={label} className='flex items-center justify-between px-5 py-3'>
                        <p className='text-white/60 text-xs'>{label}</p>
                        <p className='text-white font-semibold text-sm'>{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Datos personales */}
              {dp && (
                <div className='rounded-2xl border border-gray-100 dark:border-white/10 overflow-hidden'>
                  <div className='flex items-center gap-2 px-4 py-3 bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/10'>
                    <IconUser size={13} className='text-primary' />
                    <p className='text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400'>
                      Datos personales
                    </p>
                  </div>
                  <div className='divide-y divide-gray-100 dark:divide-white/10'>
                    {[
                      ['Nombre', `${dp.nombres} ${dp.apellidos}`],
                      ['Email', dp.email],
                      ['Teléfono', dp.telefono],
                      ['Ciudad', dp.ciudad],
                      ['Dirección', dp.direccion],
                    ].map(([label, value]) => (
                      <div key={label} className='flex items-start justify-between gap-4 px-4 py-3'>
                        <p className='text-xs text-gray-400 shrink-0 w-24'>{label}</p>
                        <p className='text-sm font-medium text-gray-800 dark:text-gray-100 text-right break-all'>{value || '—'}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Datos financieros */}
              {df && (
                <div className='rounded-2xl border border-gray-100 dark:border-white/10 overflow-hidden'>
                  <div className='flex items-center gap-2 px-4 py-3 bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/10'>
                    <IconBriefcase size={13} className='text-primary' />
                    <p className='text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400'>
                      Datos financieros
                    </p>
                  </div>
                  <div className='divide-y divide-gray-100 dark:divide-white/10'>
                    {([
                      ['Tipo empleo', TIPOS_EMP[df.tipoEmpleo] ?? df.tipoEmpleo],
                      df.empresa ? ['Empresa', df.empresa] : null,
                      ['Ingreso mensual', formatCOP(Number(df.ingresoMensual))],
                      df.otrosIngresos ? ['Otros ingresos', formatCOP(Number(df.otrosIngresos))] : null,
                      ['Gastos mensuales', formatCOP(Number(df.gastosMensuales))],
                    ] as ([string, string] | null)[])
                      .filter((row): row is [string, string] => row !== null)
                      .map(([label, value]) => (
                        <div key={label} className='flex items-start justify-between gap-4 px-4 py-3'>
                          <p className='text-xs text-gray-400 shrink-0 w-32'>{label}</p>
                          <p className='text-sm font-medium text-gray-800 dark:text-gray-100 text-right'>{value || '—'}</p>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              </div>
            </ModalBody>

            <ModalFooter className='border-t border-gray-100 dark:border-white/10 shrink-0 mt-auto'>
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
  const [orden, setOrden] = useState<'desc' | 'asc'>('desc');
  const [filtroStatus, setFiltroStatus] = useState<string | null>(null);
  const [filtroPaso, setFiltroPaso] = useState<number | null>(null);

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
        <main className='max-w-3xl mx-auto px-4 py-20 flex flex-col items-center justify-center text-center gap-5 fade-in min-h-[calc(100vh-160px)]'>
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
      <main className='max-w-3xl mx-auto px-4 py-20 flex flex-col items-center justify-center text-center gap-5 fade-in min-h-[calc(100vh-160px)]'>
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
      <main className='max-w-3xl mx-auto px-4 py-12 flex flex-col gap-6 fade-in min-h-[calc(100vh-160px)] justify-center'>
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

        {/* Divider + acciones */}
        <div className='flex items-center justify-between gap-2 flex-wrap'>
          <div className='flex items-center gap-2'>
            <IconCreditCard size={14} className='text-primary/70' />
            <p className='text-[10px] font-bold uppercase tracking-widest text-gray-400'>
              {(() => {
                const base = orden === 'desc' ? [...solicitudes].reverse() : [...solicitudes];
                const filtradas = base
                  .filter(s => !filtroStatus || s.status === filtroStatus)
                  .filter(s => filtroPaso === null || s.paso === filtroPaso);
                return filtradas.length === solicitudes.length
                  ? `Detalle (${solicitudes.length})`
                  : `Detalle (${filtradas.length} de ${solicitudes.length})`;
              })()}
            </p>
          </div>
          <div className='flex items-center gap-2'>
            <Button
              size='sm' variant='flat' radius='full'
              startContent={orden === 'desc' ? <IconSortDescending size={14} /> : <IconSortAscending size={14} />}
              onPress={() => setOrden(o => o === 'desc' ? 'asc' : 'desc')}
              className='text-gray-500 dark:text-gray-400'
            >
              {orden === 'desc' ? 'Más reciente' : 'Más antigua'}
            </Button>
            <Button as={Link} href='/solicitar-credito' size='sm' color='primary'
              variant='flat' radius='full' endContent={<IconArrowRight size={14} />}>
              Nueva solicitud
            </Button>
          </div>
        </div>

        {/* Filtros */}
        <div className='flex flex-col gap-2'>
          {/* Por estado */}
          <div className='flex flex-wrap gap-1.5'>
            {([
              { key: null,           label: 'Todas',        color: 'default'  },
              { key: 'completada',   label: 'Enviadas',     color: 'success'  },
              { key: 'en-progreso',  label: 'En progreso',  color: 'warning'  },
              { key: 'abandonada',   label: 'Abandonadas',  color: 'danger'   },
            ] as { key: string | null; label: string; color: 'default' | 'success' | 'warning' | 'danger' }[]).map(({ key, label, color }) => (
              <Chip
                key={label}
                size='sm'
                variant={filtroStatus === key ? 'solid' : 'flat'}
                color={filtroStatus === key ? color : 'default'}
                className='cursor-pointer select-none'
                onClick={() => { setFiltroStatus(key); setFiltroPaso(null); }}
              >
                {label}
              </Chip>
            ))}
          </div>

          {/* Por paso (solo si el filtro de estado muestra solicitudes no completadas) */}
          {(() => {
            const base = filtroStatus ? solicitudes.filter(s => s.status === filtroStatus) : solicitudes;
            const pasos = [...new Set(base.filter(s => s.status !== 'completada').map(s => s.paso))].sort((a, b) => a - b);
            if (!pasos.length) return null;
            return (
              <div className='flex flex-wrap gap-1.5'>
                {pasos.map(paso => (
                  <Chip
                    key={paso}
                    size='sm'
                    variant={filtroPaso === paso ? 'solid' : 'bordered'}
                    color={filtroPaso === paso ? 'primary' : 'default'}
                    className='cursor-pointer select-none'
                    onClick={() => setFiltroPaso(filtroPaso === paso ? null : paso)}
                  >
                    {PASO_LABELS[paso] ?? `Paso ${paso}`}
                  </Chip>
                ))}
              </div>
            );
          })()}
        </div>

        {/* Lista */}
        <div className='flex flex-col gap-3'>
          {(orden === 'desc' ? [...solicitudes].reverse() : [...solicitudes])
            .filter(s => !filtroStatus || s.status === filtroStatus)
            .filter(s => filtroPaso === null || s.paso === filtroPaso)
            .map(s => (
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
