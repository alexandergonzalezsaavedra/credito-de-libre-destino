'use client';
import { useEffect } from 'react';
import { Button, Card, CardBody } from '@heroui/react';
import { IconCircleCheck, IconAlertTriangle, IconRefresh } from '@tabler/icons-react';
import { useAppDispatch, useAppSelector } from '@/app/store';
import {
  limpiarSolicitud, iniciarSolicitud, guardarDatosPersonales,
  type TipoDocumento,
} from '@/app/store/solicitud/solicitudSlice';
import { limpiarAudit, registrarEvento } from '@/app/store/audit/auditSlice';
import { capturarUtms } from '@/lib/utms';
import StepIndicator from './StepIndicator';
import StepIdentidad from './steps/StepIdentidad';
import StepDatosPersonales from './steps/StepDatosPersonales';
import StepDatosFinancieros from './steps/StepDatosFinancieros';
import StepSimulacion from './steps/StepSimulacion';
import StepAutorizaciones from './steps/StepAutorizaciones';
import StepResumen from './steps/StepResumen';

function SolicitudCompletada({ id, onNueva }: { id: string; onNueva: () => void }) {
  return (
    <div className='flex flex-col items-center text-center gap-4 py-8'>
      <div className='w-16 h-16 rounded-full bg-success/15 text-success flex items-center justify-center'>
        <IconCircleCheck size={36} stroke={1.5} />
      </div>
      <h2 className='text-2xl font-bold text-gray-800 dark:text-gray-100'>¡Solicitud enviada!</h2>
      <p className='text-gray-500 dark:text-gray-400 text-sm max-w-sm'>
        Tu solicitud <span className='font-mono font-semibold text-primary'>{id}</span> fue registrada exitosamente.
        Recibirás una respuesta en tu correo en las próximas horas.
      </p>
      <Button color='primary' radius='full' onPress={onNueva} startContent={<IconRefresh size={16} />}>
        Nueva solicitud
      </Button>
    </div>
  );
}

function SolicitudAbandonada({ id, onNueva }: { id: string; onNueva: () => void }) {
  return (
    <div className='flex flex-col items-center text-center gap-4 py-8'>
      <div className='w-16 h-16 rounded-full bg-warning/15 text-warning flex items-center justify-center'>
        <IconAlertTriangle size={36} stroke={1.5} />
      </div>
      <h2 className='text-2xl font-bold text-gray-800 dark:text-gray-100'>Solicitud pausada</h2>
      <p className='text-gray-500 dark:text-gray-400 text-sm max-w-sm'>
        Tu borrador <span className='font-mono font-semibold text-primary'>{id}</span> quedó guardado.
        Puedes retomarlo en cualquier momento desde <strong>Ingresar</strong> con tu número de documento.
      </p>
      <Button color='primary' variant='flat' radius='full' onPress={onNueva} startContent={<IconRefresh size={16} />}>
        Iniciar nueva solicitud
      </Button>
    </div>
  );
}

export default function SolicitudWizard() {
  const dispatch = useAppDispatch();
  const { pasoActual, status, id } = useAppSelector(s => s.solicitud);
  const usuario = useAppSelector(s => s.usuario);

  // Auto-avance cuando el wizard arranca/reinicia con un perfil activo
  useEffect(() => {
    if (pasoActual === 0 && status === 'idle' && usuario.numeroDocumento) {
      dispatch(iniciarSolicitud({
        identidad: {
          tipoDocumento: usuario.tipoDocumento as TipoDocumento,
          numeroDocumento: usuario.numeroDocumento,
          validado: true,
        },
        utms: capturarUtms(),
      }));
      dispatch(guardarDatosPersonales({
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        email: usuario.email,
        telefono: usuario.telefono,
        fechaNacimiento: usuario.fechaNacimiento,
        direccion: usuario.direccion,
        ciudad: usuario.ciudad,
      }));
      dispatch(registrarEvento({
        evento: 'AUTO_AVANCE_PERFIL',
        detalle: `${usuario.tipoDocumento} ${usuario.numeroDocumento}`,
      }));
    }
  // pasoActual y status como deps: se re-dispara cada vez que el wizard vuelve a idle/paso0
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pasoActual, status]);

  function reiniciar() {
    dispatch(limpiarSolicitud());
    dispatch(limpiarAudit());
  }

  if (status === 'completada') {
    return <SolicitudCompletada id={id ?? ''} onNueva={reiniciar} />;
  }
  if (status === 'abandonada') {
    return <SolicitudAbandonada id={id ?? ''} onNueva={reiniciar} />;
  }

  return (
    <div className='flex flex-col gap-6'>
      {pasoActual > 0 && <StepIndicator pasoActual={pasoActual} />}
      <Card shadow='sm' className='bg-white/80 dark:bg-white/10 border border-white dark:border-white/10'>
        <CardBody className='p-6'>
          {pasoActual === 0 && <StepIdentidad />}
          {pasoActual === 1 && <StepDatosPersonales />}
          {pasoActual === 2 && <StepDatosFinancieros />}
          {pasoActual === 3 && <StepSimulacion />}
          {pasoActual === 4 && <StepAutorizaciones />}
          {pasoActual === 5 && <StepResumen />}
        </CardBody>
      </Card>
    </div>
  );
}
