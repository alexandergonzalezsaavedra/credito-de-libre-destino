'use client';
import { useEffect, useState } from 'react';
import { Button, Card, CardBody } from '@heroui/react';
import { IconCircleCheck, IconAlertTriangle, IconRefresh } from '@tabler/icons-react';
import { useAppDispatch, useAppSelector } from '@/app/store';
import {
  limpiarSolicitud, iniciarSolicitud, guardarDatosPersonales,
  setBackendId,
  type TipoDocumento, type DatosPersonales,
} from '@/app/store/solicitud/solicitudSlice';
import { applicationsApi } from '@/lib/apiClient';
import { limpiarAudit, registrarEvento } from '@/app/store/audit/auditSlice';
import { capturarUtms } from '@/lib/utms';
import {
  guardarSolicitudEnSesion,
  type SolicitudSesion,
} from '@/app/store/sesiones/sesionesSlice';
import type { UsuarioPerfil } from '@/app/store/usuario/usuarioSlice';
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
  const solicitud = useAppSelector(s => s.solicitud);
  const usuario = useAppSelector(s => s.usuario);
  const { pasoActual, status, id } = solicitud;
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Al montar: limpiar borradores que no corresponden al usuario actual.
  // - Sin sesión activa: siempre limpiar (evita ver datos de otro usuario previo).
  // - Con sesión activa y estado terminal: limpiar para que el auto-avance funcione.
  useEffect(() => {
    if (!usuario.numeroDocumento && status !== 'idle') {
      dispatch(limpiarSolicitud());
      dispatch(limpiarAudit());
    } else if (usuario.numeroDocumento && (status === 'completada' || status === 'abandonada')) {
      dispatch(limpiarSolicitud());
      dispatch(limpiarAudit());
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      const dp: DatosPersonales = {
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        email: usuario.email,
        telefono: usuario.telefono,
        fechaNacimiento: usuario.fechaNacimiento,
        direccion: usuario.direccion,
        ciudad: usuario.ciudad,
      };
      dispatch(guardarDatosPersonales(dp));
      dispatch(registrarEvento({
        evento: 'AUTO_AVANCE_PERFIL',
        detalle: `${usuario.tipoDocumento} ${usuario.numeroDocumento}`,
      }));
      // Crear la solicitud en el backend con datos personales ya disponibles
      applicationsApi.create({
        identidad: {
          tipoDocumento: usuario.tipoDocumento,
          numeroDocumento: usuario.numeroDocumento,
        },
        datosPersonales: dp,
      })
        .then((app) => dispatch(setBackendId(app.id)))
        .catch(() => {});
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pasoActual, status]);

  // Sincroniza el estado del wizard con sesionesUsuario en cada cambio de paso o status
  useEffect(() => {
    if (!id || !usuario.numeroDocumento || status === 'idle') return;

    const sesionSolicitud: SolicitudSesion = {
      id,
      fecha: solicitud.creadoEn ?? new Date().toISOString(),
      paso: pasoActual,
      status: status === 'en_proceso' ? 'en-progreso' : status as 'completada' | 'abandonada',
      tipoDocumento: solicitud.identidad.tipoDocumento,
      numeroDocumento: solicitud.identidad.numeroDocumento,
      monto: solicitud.simulacion.monto || undefined,
      plazoMeses: solicitud.simulacion.plazoMeses || undefined,
      cuotaMensual: solicitud.simulacion.resultado?.cuotaMensual,
      totalPagar: solicitud.simulacion.resultado?.totalPagar,
      tasaEA: solicitud.simulacion.resultado?.tasaEA,
      datosPersonales: solicitud.datosPersonales,
      datosFinancieros: solicitud.datosFinancieros,
      simulacion: solicitud.simulacion,
    };

    const usuarioPerfil: UsuarioPerfil = {
      tipoDocumento: usuario.tipoDocumento,
      numeroDocumento: usuario.numeroDocumento,
      nombres: usuario.nombres,
      apellidos: usuario.apellidos,
      email: usuario.email,
      telefono: usuario.telefono,
      fechaNacimiento: usuario.fechaNacimiento,
      direccion: usuario.direccion,
      ciudad: usuario.ciudad,
    };

    dispatch(guardarSolicitudEnSesion({ usuario: usuarioPerfil, solicitud: sesionSolicitud }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pasoActual, status, id]);

  function reiniciar() {
    dispatch(limpiarSolicitud());
    dispatch(limpiarAudit());
  }

  if (!mounted) {
    return (
      <Card shadow='sm' className='bg-white/80 dark:bg-white/10 border border-white dark:border-white/10'>
        <CardBody className='p-6'>
          <div className='flex flex-col gap-4 animate-pulse'>
            <div className='h-10 w-10 rounded-xl bg-gray-200 dark:bg-white/10' />
            <div className='h-5 w-48 rounded-lg bg-gray-200 dark:bg-white/10' />
            <div className='h-10 rounded-xl bg-gray-200 dark:bg-white/10' />
            <div className='h-10 rounded-xl bg-gray-200 dark:bg-white/10' />
            <div className='h-10 rounded-xl bg-gray-100 dark:bg-white/5 mt-2' />
          </div>
        </CardBody>
      </Card>
    );
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
