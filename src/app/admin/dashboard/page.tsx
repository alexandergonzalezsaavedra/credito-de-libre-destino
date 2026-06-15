'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Button, Chip, Card, CardBody, Input,
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Tooltip, Pagination,
} from '@heroui/react';
import {
  IconRefresh, IconShieldOff, IconClipboardList,
  IconCircleCheck, IconAlertTriangle, IconLoader2,
  IconSearch, IconX,
} from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { isAdminAuthenticated } from '@/app/admin/_lib/credentials';

interface DatosPersonales {
  nombres: string; apellidos: string; email: string;
  telefono: string; fechaNacimiento: string; direccion: string; ciudad: string;
}
interface DatosFinancieros {
  tipoEmpleo: string; empresa: string;
  ingresoMensual: string; otrosIngresos?: string; gastosMensuales: string;
}
interface Simulacion {
  monto: string; plazoMeses: string;
  resultado: { cuotaMensual: number; tasaEA: number; totalPagar: number; totalIntereses: number } | null;
}
interface SolicitudSesion {
  id: string; fecha: string; paso: number;
  status: 'en-progreso' | 'completada' | 'abandonada';
  tipoDocumento: string; numeroDocumento: string;
  monto?: string; plazoMeses?: string;
  cuotaMensual?: number; totalPagar?: number; tasaEA?: number;
  datosPersonales?: DatosPersonales;
  datosFinancieros?: DatosFinancieros;
  simulacion?: Simulacion;
}
interface SesionUsuario {
  usuario: { tipoDocumento: string; numeroDocumento: string; nombres: string; apellidos: string; email: string; telefono: string };
  solicitudes: SolicitudSesion[];
}
interface FilaSolicitud extends SolicitudSesion {
  usuarioNombres: string; usuarioApellidos: string; usuarioEmail: string;
}

const POR_PAGINA = 10;

const STATUS_CHIP: Record<string, { label: string; color: 'success' | 'warning' | 'danger' | 'primary' }> = {
  'en-progreso': { label: 'En proceso', color: 'primary' },
  completada:    { label: 'Completada', color: 'success' },
  abandonada:    { label: 'Abandonada', color: 'danger'  },
};
const PASO_LABEL = ['Identidad', 'Personal', 'Finanzas', 'Simulación', 'Autorización', 'Resumen'];

function formatCOP(n: number) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);
}
function formatFecha(iso: string) {
  return new Date(iso).toLocaleString('es-CO', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

function leerDesdeLocalStorage(): FilaSolicitud[] {
  try {
    const raw = localStorage.getItem('sesionesUsuario');
    if (!raw) return [];
    const parsed = JSON.parse(raw) as { sesiones: SesionUsuario[] };
    return (parsed.sesiones ?? [])
      .flatMap(s => s.solicitudes.map(sol => ({
        ...sol,
        usuarioNombres:   s.usuario.nombres,
        usuarioApellidos: s.usuario.apellidos,
        usuarioEmail:     s.usuario.email,
      })))
      .sort((a, b) => b.fecha.localeCompare(a.fecha));
  } catch { return []; }
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [todas, setTodas]       = useState<FilaSolicitud[]>([]);
  const [cargando, setCargando] = useState(true);
  const [filtroCedula, setFiltroCedula] = useState('');
  const [pagina, setPagina]     = useState(1);

  const cargar = useCallback(() => {
    setCargando(true);
    setTodas(leerDesdeLocalStorage());
    setCargando(false);
  }, []);

  useEffect(() => {
    if (!isAdminAuthenticated()) { router.replace('/admin'); return; }
    cargar();
  }, [router, cargar]);

  // Filtrado por cédula
  const filtradas = useMemo(() => {
    const term = filtroCedula.trim();
    if (!term) return todas;
    return todas.filter(s => s.numeroDocumento.includes(term));
  }, [todas, filtroCedula]);

  // Resetear página al cambiar filtro
  useEffect(() => { setPagina(1); }, [filtroCedula]);

  // Paginación
  const totalPaginas = Math.max(1, Math.ceil(filtradas.length / POR_PAGINA));
  const paginaActual = Math.min(pagina, totalPaginas);
  const filasPagina  = filtradas.slice((paginaActual - 1) * POR_PAGINA, paginaActual * POR_PAGINA);

  const totales = todas.reduce(
    (acc, s) => { acc[s.status] = (acc[s.status] ?? 0) + 1; return acc; },
    {} as Record<string, number>,
  );

  return (
    <main className='max-w-7xl mx-auto px-4 py-8'>

      {/* Encabezado */}
      <div className='flex items-center justify-between mb-6'>
        <div className='flex items-center gap-3'>
          <IconClipboardList size={28} className='text-primary' />
          <div>
            <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>Solicitudes de crédito</h1>
            <p className='text-sm text-gray-500 dark:text-gray-400'>
              {filtradas.length} de {todas.length} registros
            </p>
          </div>
        </div>
        <Button size='sm' variant='flat' radius='full' color='primary'
          startContent={<IconRefresh size={15} />} onPress={cargar} isLoading={cargando}>
          Actualizar
        </Button>
      </div>

      {/* Tarjetas resumen */}
      <div className='grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6'>
        {[
          { key: 'en-progreso', label: 'En proceso',  icon: IconLoader2,       color: 'text-primary', bg: 'bg-primary/10' },
          { key: 'completada',  label: 'Completadas', icon: IconCircleCheck,   color: 'text-success', bg: 'bg-success/10' },
          { key: 'abandonada',  label: 'Abandonadas', icon: IconAlertTriangle, color: 'text-danger',  bg: 'bg-danger/10'  },
        ].map(({ key, label, icon: Icon, color, bg }) => (
          <Card key={key} shadow='sm' className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700'>
            <CardBody className='flex flex-row items-center gap-4 p-4'>
              <div className={`w-11 h-11 rounded-xl ${bg} ${color} flex items-center justify-center shrink-0`}>
                <Icon size={22} stroke={1.5} />
              </div>
              <div>
                <p className='text-2xl font-extrabold text-gray-900 dark:text-white'>{totales[key] ?? 0}</p>
                <p className='text-xs text-gray-500 dark:text-gray-400'>{label}</p>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Filtro por cédula */}
      <div className='mb-4 max-w-xs'>
        <Input
          placeholder='Filtrar por número de cédula'
          value={filtroCedula}
          onValueChange={v => setFiltroCedula(v.replace(/\D/g, ''))}
          inputMode='numeric'
          startContent={<IconSearch size={15} className='text-gray-400' />}
          endContent={filtroCedula && (
            <button onClick={() => setFiltroCedula('')} className='text-gray-400 hover:text-gray-600'>
              <IconX size={14} />
            </button>
          )}
          size='sm'
          radius='full'
          classNames={{ inputWrapper: 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700' }}
        />
      </div>

      {/* Tabla */}
      {filtradas.length === 0 && !cargando ? (
        <div className='flex flex-col items-center gap-3 py-20 text-gray-400'>
          <IconShieldOff size={44} stroke={1.2} />
          <p className='text-sm text-center max-w-xs'>
            {filtroCedula
              ? `No se encontraron solicitudes para la cédula "${filtroCedula}".`
              : 'No hay solicitudes registradas todavía.'
            }
          </p>
          {filtroCedula && (
            <Button size='sm' variant='flat' onPress={() => setFiltroCedula('')}>Limpiar filtro</Button>
          )}
        </div>
      ) : (
        <Card shadow='sm' className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 overflow-hidden'>
          <Table
            aria-label='Lista de solicitudes'
            classNames={{
              wrapper: 'shadow-none rounded-none',
              th: 'bg-gray-50 dark:bg-gray-800 text-xs uppercase text-gray-500 dark:text-gray-400',
            }}
          >
            <TableHeader>
              <TableColumn>ID</TableColumn>
              <TableColumn>Documento</TableColumn>
              <TableColumn>Nombre</TableColumn>
              <TableColumn>Estado</TableColumn>
              <TableColumn>Paso</TableColumn>
              <TableColumn>Monto</TableColumn>
              <TableColumn>Cuota</TableColumn>
              <TableColumn>Tasa EA</TableColumn>
              <TableColumn>Fecha</TableColumn>
            </TableHeader>

            <TableBody emptyContent={cargando ? 'Cargando…' : 'Sin datos'}>
              {filasPagina.map(s => (
                <TableRow key={s.id} className='hover:bg-gray-50 dark:hover:bg-gray-800/50'>
                  <TableCell>
                    <Tooltip content={s.id}>
                      <span className='font-mono text-xs text-primary cursor-default'>{s.id}</span>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <span className='text-xs text-gray-600 dark:text-gray-300'>
                      {s.tipoDocumento} {s.numeroDocumento}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className='text-sm font-medium text-gray-800 dark:text-gray-100 leading-tight'>
                        {s.usuarioNombres} {s.usuarioApellidos}
                      </p>
                      <p className='text-xs text-gray-400'>{s.usuarioEmail}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Chip size='sm' variant='flat' color={STATUS_CHIP[s.status]?.color ?? 'default'}>
                      {STATUS_CHIP[s.status]?.label ?? s.status}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <span className='text-xs text-gray-600 dark:text-gray-300 whitespace-nowrap'>
                      {s.paso + 1}. {PASO_LABEL[s.paso] ?? '—'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className='text-sm font-mono'>
                      {s.monto ? formatCOP(Number(s.monto)) : '—'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className='text-sm font-mono'>
                      {s.cuotaMensual ? formatCOP(s.cuotaMensual) : '—'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className='text-sm'>{s.tasaEA != null ? `${s.tasaEA}%` : '—'}</span>
                  </TableCell>
                  <TableCell>
                    <span className='text-xs text-gray-500 whitespace-nowrap'>{formatFecha(s.fecha)}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Paginación */}
          {totalPaginas > 1 && (
            <div className='flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-gray-800'>
              <p className='text-xs text-gray-500 dark:text-gray-400'>
                Mostrando {(paginaActual - 1) * POR_PAGINA + 1}–{Math.min(paginaActual * POR_PAGINA, filtradas.length)} de {filtradas.length}
              </p>
              <Pagination
                total={totalPaginas}
                page={paginaActual}
                onChange={setPagina}
                size='sm'
                radius='full'
                color='primary'
                variant='flat'
                showControls
              />
            </div>
          )}
        </Card>
      )}
    </main>
  );
}
