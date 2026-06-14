'use client';
import { useState } from 'react';
import { Button, Checkbox } from '@heroui/react';
import { IconShieldCheck, IconArrowRight, IconArrowLeft } from '@tabler/icons-react';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { guardarAutorizaciones, setPaso } from '@/app/store/solicitud/solicitudSlice';
import { registrarEvento } from '@/app/store/audit/auditSlice';

const AUTORIZACIONES = [
  {
    key: 'habeasData' as const,
    titulo: 'Tratamiento de datos personales (Habeas Data)',
    descripcion:
      'Autorizo a Banco Caja Social para recolectar, almacenar, usar, circular y suprimir mis datos personales con fines de vinculación, oferta de productos y servicios, según la Ley 1581 de 2012.',
  },
  {
    key: 'consultaCentrales' as const,
    titulo: 'Consulta y reporte en centrales de riesgo',
    descripcion:
      'Autorizo la consulta y reporte de mi información crediticia ante operadores de información como Datacrédito y TransUnion, para evaluación de la presente solicitud.',
  },
  {
    key: 'terminosCondiciones' as const,
    titulo: 'Términos y condiciones del crédito',
    descripcion:
      'He leído y acepto los términos y condiciones del Crédito de Libre Destino, incluyendo las condiciones de desembolso, tasas vigentes y política de prepago.',
  },
];

export default function StepAutorizaciones() {
  const dispatch = useAppDispatch();
  const guardado = useAppSelector(s => s.solicitud.autorizaciones);

  const [checks, setChecks] = useState({ ...guardado });
  const [error, setError] = useState('');

  function toggle(key: keyof typeof checks) {
    setChecks(c => ({ ...c, [key]: !c[key] }));
    setError('');
  }

  function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    if (!checks.habeasData || !checks.consultaCentrales || !checks.terminosCondiciones) {
      setError('Debes aceptar todas las autorizaciones para continuar');
      return;
    }
    dispatch(guardarAutorizaciones(checks));
    dispatch(registrarEvento({ evento: 'AUTORIZACIONES_ACEPTADAS' }));
  }

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
      <div className='flex items-center gap-3 mb-2'>
        <div className='w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0'>
          <IconShieldCheck size={22} stroke={1.8} />
        </div>
        <div>
          <h2 className='text-lg font-bold text-gray-800 dark:text-gray-100'>Autorizaciones</h2>
          <p className='text-xs text-gray-500 dark:text-gray-400'>Lee y acepta cada autorización para continuar</p>
        </div>
      </div>

      <div className='flex flex-col gap-4'>
        {AUTORIZACIONES.map(({ key, titulo, descripcion }) => (
          <div
            key={key}
            onClick={() => toggle(key)}
            className={[
              'flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-colors',
              checks[key]
                ? 'border-primary/40 bg-primary/5 dark:bg-primary/10'
                : 'border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-white/5',
            ].join(' ')}
          >
            <Checkbox
              isSelected={checks[key]}
              onValueChange={() => toggle(key)}
              color='primary'
              className='mt-0.5 shrink-0'
              aria-label={titulo}
            />
            <div>
              <p className='text-sm font-semibold text-gray-800 dark:text-gray-100 mb-1'>{titulo}</p>
              <p className='text-xs text-gray-500 dark:text-gray-400 leading-relaxed'>{descripcion}</p>
            </div>
          </div>
        ))}
      </div>

      {error && (
        <p className='text-sm text-danger font-medium'>{error}</p>
      )}

      <div className='flex gap-3 mt-2'>
        <Button variant='flat' radius='full' onPress={() => dispatch(setPaso(3))}
          startContent={<IconArrowLeft size={16} />}>
          Atrás
        </Button>
        <Button type='submit' color='primary' radius='full' className='flex-1 font-semibold'
          endContent={<IconArrowRight size={18} />}>
          Continuar
        </Button>
      </div>
    </form>
  );
}
