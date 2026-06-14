'use client';
import { useState } from 'react';
import { Button, Input, Select, SelectItem } from '@heroui/react';
import { IconIdBadge2, IconArrowRight, IconLogin } from '@tabler/icons-react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { useAppDispatch } from '@/app/store';
import {
  iniciarSolicitud,
  guardarDatosPersonales,
  type TipoDocumento,
} from '@/app/store/solicitud/solicitudSlice';
import { registrarEvento } from '@/app/store/audit/auditSlice';
import { guardarPerfil, type UsuarioPerfil } from '@/app/store/usuario/usuarioSlice';
import { capturarUtms, utmsToString } from '@/lib/utms';
import ModalIngreso from '@/app/components/commun/ModalIngreso';

const TIPOS_DOCUMENTO = [
  { key: 'CC', label: 'Cédula de Ciudadanía' },
  { key: 'CE', label: 'Cédula de Extranjería' },
  { key: 'PA', label: 'Pasaporte' },
  { key: 'TI', label: 'Tarjeta de Identidad' },
];

const LONGITUDES: Record<string, { min: number; max: number; pattern: string }> = {
  CC: { min: 6, max: 10, pattern: '[0-9]*' },
  CE: { min: 6, max: 12, pattern: '[0-9A-Za-z]*' },
  PA: { min: 5, max: 12, pattern: '[0-9A-Za-z]*' },
  TI: { min: 10, max: 11, pattern: '[0-9]*' },
};

export default function StepIdentidad() {
  const dispatch = useAppDispatch();
  const { executeRecaptcha } = useGoogleReCaptcha();

  const [tipoDocumento, setTipoDocumento] = useState<TipoDocumento | ''>('');
  const [numeroDocumento, setNumeroDocumento] = useState('');
  const [errores, setErrores] = useState<{ tipo?: string; numero?: string; recaptcha?: string }>({});
  const [cargando, setCargando] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  function validar() {
    const e: typeof errores = {};
    if (!tipoDocumento) e.tipo = 'Selecciona el tipo de documento';
    if (!numeroDocumento.trim()) {
      e.numero = 'Ingresa el número de documento';
    } else if (tipoDocumento) {
      const { min, max } = LONGITUDES[tipoDocumento];
      if (numeroDocumento.length < min || numeroDocumento.length > max)
        e.numero = `El ${tipoDocumento} debe tener entre ${min} y ${max} caracteres`;
    }
    return e;
  }

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    const errs = validar();
    if (Object.keys(errs).length) { setErrores(errs); return; }

    if (!executeRecaptcha) {
      setErrores({ recaptcha: 'reCAPTCHA no disponible. Recarga la página.' });
      return;
    }

    setCargando(true);
    try {
      const token = await executeRecaptcha('identidad_validacion');
      if (!token) {
        setErrores({ recaptcha: 'No se pudo verificar el reCAPTCHA. Intenta de nuevo.' });
        return;
      }

      const utms = capturarUtms();

      dispatch(iniciarSolicitud({
        identidad: { tipoDocumento: tipoDocumento as TipoDocumento, numeroDocumento, validado: true },
        utms,
      }));

      const utmDetalle = utmsToString(utms);
      dispatch(registrarEvento({
        evento: 'IDENTIDAD_VALIDADA',
        detalle: `${tipoDocumento} ${numeroDocumento}${utmDetalle ? ` | ${utmDetalle}` : ''}`,
      }));
    } finally {
      setCargando(false);
    }
  }

  function handleLoginSuccess(perfil: UsuarioPerfil) {
    dispatch(guardarPerfil(perfil));
    dispatch(iniciarSolicitud({
      identidad: {
        tipoDocumento: perfil.tipoDocumento as TipoDocumento,
        numeroDocumento: perfil.numeroDocumento,
        validado: true,
      },
      utms: capturarUtms(),
    }));
    dispatch(guardarDatosPersonales({
      nombres: perfil.nombres,
      apellidos: perfil.apellidos,
      email: perfil.email,
      telefono: perfil.telefono,
      fechaNacimiento: perfil.fechaNacimiento,
      direccion: perfil.direccion,
      ciudad: perfil.ciudad,
    }));
    dispatch(registrarEvento({
      evento: 'LOGIN_PERFIL_SOLICITUD',
      detalle: `${perfil.tipoDocumento} ${perfil.numeroDocumento}`,
    }));
    setModalOpen(false);
  }

  return (
    <>
      <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
        <div className='flex items-center gap-3 mb-2'>
          <div className='w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0'>
            <IconIdBadge2 size={22} stroke={1.8} />
          </div>
          <div>
            <h2 className='text-lg font-bold text-gray-800 dark:text-gray-100'>Validación de identidad</h2>
            <p className='text-xs text-gray-500 dark:text-gray-400'>Ingresa tu documento para iniciar la solicitud</p>
          </div>
        </div>

        <Select
          label='Tipo de documento'
          placeholder='Selecciona una opción'
          selectedKeys={tipoDocumento ? new Set([tipoDocumento]) : new Set()}
          onSelectionChange={(keys) => {
            const val = Array.from(keys)[0] as TipoDocumento;
            setTipoDocumento(val ?? '');
            setNumeroDocumento('');
            setErrores({});
          }}
          isInvalid={!!errores.tipo}
          errorMessage={errores.tipo}
          isRequired
        >
          {TIPOS_DOCUMENTO.map(t => (
            <SelectItem key={t.key}>{t.label}</SelectItem>
          ))}
        </Select>

        <Input
          label='Número de documento'
          placeholder={tipoDocumento
            ? `Ej: ${tipoDocumento === 'CC' ? '1234567890' : tipoDocumento === 'TI' ? '10234567890' : 'AB123456'}`
            : '—'}
          value={numeroDocumento}
          onValueChange={(v) => { setNumeroDocumento(v); setErrores(prev => ({ ...prev, numero: undefined })); }}
          onBlur={() => {
            const errs = validar();
            setErrores(prev => ({ ...prev, numero: errs.numero }));
          }}
          inputMode={tipoDocumento === 'CC' || tipoDocumento === 'TI' ? 'numeric' : 'text'}
          isInvalid={!!errores.numero}
          errorMessage={errores.numero}
          isDisabled={!tipoDocumento}
          isRequired
          maxLength={tipoDocumento ? LONGITUDES[tipoDocumento]?.max : 12}
        />

        {errores.recaptcha && (
          <p className='text-sm text-danger'>{errores.recaptcha}</p>
        )}

        <Button
          type='submit'
          color='primary'
          radius='full'
          size='lg'
          isLoading={cargando}
          endContent={!cargando && <IconArrowRight size={18} />}
          className='font-semibold mt-2'
        >
          {cargando ? 'Validando...' : 'Validar identidad'}
        </Button>

        <div className='flex items-center justify-center gap-1.5'>
          <span className='text-xs text-gray-500 dark:text-gray-400'>¿Ya tienes perfil registrado?</span>
          <button
            type='button'
            className='text-xs text-primary font-semibold hover:underline flex items-center gap-1'
            onClick={() => setModalOpen(true)}
          >
            <IconLogin size={13} />
            Ingresar aquí
          </button>
        </div>
      </form>

      <ModalIngreso
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={handleLoginSuccess}
      />
    </>
  );
}
