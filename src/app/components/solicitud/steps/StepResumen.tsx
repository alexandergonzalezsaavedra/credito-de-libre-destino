'use client';
import { useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  addToast,
} from '@heroui/react';
import {
  IconClipboardCheck,
  IconArrowLeft,
  IconCheck,
  IconX,
  IconIdBadge2,
  IconUser,
  IconBriefcase,
  IconCreditCard,
} from '@tabler/icons-react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { useAppDispatch, useAppSelector } from '@/app/store';
import {
  confirmarSolicitud,
  abandonarSolicitud,
  setPaso,
} from '@/app/store/solicitud/solicitudSlice';
import { registrarEvento } from '@/app/store/audit/auditSlice';

function formatCOP(n: number) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(n);
}

function Fila({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className='flex justify-between items-center py-2 border-b border-gray-100 dark:border-white/5 last:border-0 gap-4'>
      <span className='text-xs text-gray-500 dark:text-gray-400 shrink-0'>
        {label}
      </span>
      <span
        className={`text-xs font-semibold text-right truncate ${highlight ? 'text-primary' : 'text-gray-800 dark:text-gray-100'}`}
      >
        {value}
      </span>
    </div>
  );
}

function SeccionCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card
      shadow='none'
      className='bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10'
    >
      <CardBody className='p-4'>
        <div className='flex items-center gap-2 mb-3'>
          <div className='text-primary/70'>{icon}</div>
          <p className='text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500'>
            {title}
          </p>
        </div>
        {children}
      </CardBody>
    </Card>
  );
}

const TIPOS_DOC: Record<string, string> = {
  CC: 'Cédula de Ciudadanía',
  CE: 'Cédula de Extranjería',
  PA: 'Pasaporte',
  TI: 'Tarjeta de Identidad',
};
const TIPOS_EMP: Record<string, string> = {
  empleado_publico: 'Empleado público',
  empleado_privado: 'Empleado privado',
  pensionado: 'Pensionado',
  independiente: 'Independiente',
};

export default function StepResumen() {
  const dispatch = useAppDispatch();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const { id, identidad, datosPersonales, datosFinancieros, simulacion } =
    useAppSelector((s) => s.solicitud);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [confirmando, setConfirmando] = useState(false);

  async function handleConfirmar() {
    if (!executeRecaptcha) return;
    setConfirmando(true);
    try {
      const token = await executeRecaptcha('solicitud_confirmacion');
      if (!token) return;
      await new Promise((r) => setTimeout(r, 1000));
      dispatch(confirmarSolicitud());
      dispatch(registrarEvento({ evento: 'SOLICITUD_CONFIRMADA', detalle: id ?? '' }));
      addToast({ title: '¡Solicitud enviada!', description: `Tu solicitud ${id} fue registrada. Recibirás respuesta pronto.`, color: 'success' });
      // La sincronización a sesionesUsuario la maneja SolicitudWizard automáticamente
    } finally {
      setConfirmando(false);
    }
  }

  function handleAbandonar() {
    dispatch(abandonarSolicitud());
    dispatch(registrarEvento({ evento: 'SOLICITUD_ABANDONADA', detalle: id ?? '' }));
    addToast({ title: 'Solicitud pausada', description: 'Tu borrador quedó guardado. Puedes retomarlo cuando quieras.', color: 'warning' });
  }

  const res = simulacion.resultado;

  return (
    <div className='flex flex-col gap-4'>
      {/* Header */}
      <div className='flex items-center gap-3'>
        <div className='w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0'>
          <IconClipboardCheck
            size={22}
            stroke={1.8}
          />
        </div>
        <div>
          <h2 className='text-lg font-bold text-gray-800 dark:text-gray-100'>
            Resumen de solicitud
          </h2>
          <p className='text-xs text-gray-500 dark:text-gray-400'>
            Revisa los datos antes de confirmar · ID:{' '}
            <span className='font-mono text-primary'>{id}</span>
          </p>
        </div>
      </div>

      {/* Condiciones del crédito — hero card */}
      {res && (
        <Card
          shadow='none'
          className='bg-primary overflow-hidden border-0'
        >
          <CardBody className='p-5'>
            <div className='flex items-center gap-2 mb-4'>
              <IconCreditCard
                size={14}
                className='text-white/60'
              />
              <p className='text-[10px] font-bold uppercase tracking-widest text-white/60'>
                Condiciones del crédito
              </p>
            </div>
            <div className='flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between'>
              <div>
                <p className='text-xs text-white/60 mb-0.5'>Cuota mensual</p>
                <p className='text-3xl font-extrabold text-white'>
                  {formatCOP(res.cuotaMensual)}
                </p>
              </div>
              <div className='grid grid-cols-2 gap-x-10 gap-y-1.5 text-sm'>
                {[
                  ['Monto', formatCOP(Number(simulacion.monto))],
                  ['Plazo', `${simulacion.plazoMeses} meses`],
                  ['Tasa EA', `${res.tasaEA}%`],
                  ['Total a pagar', formatCOP(res.totalPagar)],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className='contents'
                  >
                    <span className='text-white/60 text-xs'>{label}</span>
                    <span className='text-white font-semibold text-xs text-right'>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Data cards 2x2 */}
      <div className='grid grid-cols-1 gap-3'>
        <SeccionCard
          icon={<IconIdBadge2 size={14} />}
          title='Identidad'
        >
          <Fila
            label='Tipo doc.'
            value={
              TIPOS_DOC[identidad.tipoDocumento] ?? identidad.tipoDocumento
            }
          />
          <Fila
            label='Número'
            value={identidad.numeroDocumento}
          />
        </SeccionCard>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
        <SeccionCard
          icon={<IconUser size={14} />}
          title='Datos personales'
        >
          <Fila
            label='Nombre'
            value={`${datosPersonales.nombres} ${datosPersonales.apellidos}`}
          />
          <Fila
            label='Teléfono'
            value={datosPersonales.telefono}
          />
          <Fila
            label='Email'
            value={datosPersonales.email}
          />
          <Fila
            label='Ciudad'
            value={datosPersonales.ciudad}
          />
        </SeccionCard>

        <SeccionCard
          icon={<IconBriefcase size={14} />}
          title='Datos financieros'
        >
          <Fila
            label='Empleo'
            value={
              TIPOS_EMP[datosFinancieros.tipoEmpleo] ??
              datosFinancieros.tipoEmpleo
            }
          />
          {datosFinancieros.empresa && (
            <Fila
              label='Empresa'
              value={datosFinancieros.empresa}
            />
          )}
          <Fila
            label='Ingreso mensual'
            value={formatCOP(Number(datosFinancieros.ingresoMensual))}
          />
          <Fila
            label='Gastos mensuales'
            value={formatCOP(Number(datosFinancieros.gastosMensuales))}
          />
        </SeccionCard>
      </div>

      {/* Actions */}
      <div className='flex flex-col gap-2 mt-1'>
        <Button
          color='primary'
          radius='full'
          className='w-full font-semibold'
          isLoading={confirmando}
          onPress={handleConfirmar}
          endContent={!confirmando && <IconCheck size={18} />}
        >
          {confirmando ? 'Enviando...' : 'Confirmar solicitud'}
        </Button>
        <div className='flex gap-2'>
          <Button
            variant='flat'
            radius='full'
            className='flex-1'
            onPress={() => dispatch(setPaso(4))}
            startContent={<IconArrowLeft size={16} />}
          >
            Atrás
          </Button>
          <Button
            variant='flat'
            color='danger'
            radius='full'
            className='flex-1'
            onPress={onOpen}
            startContent={<IconX size={16} />}
          >
            Abandonar
          </Button>
        </div>
      </div>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement='center'
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='text-gray-800 dark:text-gray-100'>
                ¿Abandonar solicitud?
              </ModalHeader>
              <ModalBody>
                <p className='text-sm text-gray-500 dark:text-gray-400'>
                  Tu borrador quedará guardado y podrás retomarlo desde la
                  sección <strong>Ingresar</strong> con tu número de documento.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button
                  variant='flat'
                  radius='full'
                  onPress={onClose}
                >
                  Cancelar
                </Button>
                <Button
                  color='danger'
                  radius='full'
                  onPress={() => {
                    onClose();
                    handleAbandonar();
                  }}
                >
                  Sí, abandonar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
