'use client';
import { IconCheck } from '@tabler/icons-react';
import { useAppDispatch } from '@/app/store';
import { setPaso } from '@/app/store/solicitud/solicitudSlice';
import { registrarEvento } from '@/app/store/audit/auditSlice';

const PASOS = [
  { label: 'Identidad',  full: 'Identidad',        paso: 0 },
  { label: 'Personal',   full: 'Datos personales',  paso: 1 },
  { label: 'Finanzas',   full: 'Datos financieros', paso: 2 },
  { label: 'Simulación', full: 'Simulación',        paso: 3 },
  { label: 'Autoriz.',   full: 'Autorizaciones',    paso: 4 },
  { label: 'Resumen',    full: 'Resumen',           paso: 5 },
];

interface Props {
  pasoActual: number;
}

export default function StepIndicator({ pasoActual }: Props) {
  const dispatch = useAppDispatch();

  function irAPaso(paso: number) {
    dispatch(setPaso(paso));
    dispatch(registrarEvento({
      evento: 'NAVEGACION_PASO',
      detalle: `Regresó al paso ${paso} — ${PASOS.find(p => p.paso === paso)?.full}`,
    }));
  }

  return (
    <div className='flex items-start w-full'>
      {PASOS.flatMap(({ label, full, paso }, i) => {
        const numero = i + 1;
        const completado = pasoActual > paso;
        const activo = pasoActual === paso;
        const navegable = completado && paso > 0;

        const step = (
          <button
            key={`step-${i}`}
            type='button'
            disabled={!navegable}
            onClick={() => navegable && irAPaso(paso)}
            title={navegable ? `Editar: ${full}` : full}
            className={[
              'flex flex-col items-center gap-1 shrink-0 transition-opacity',
              navegable ? 'cursor-pointer' : 'cursor-default',
            ].join(' ')}
          >
            <div
              className={[
                'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all',
                completado
                  ? 'bg-primary text-white hover:ring-2 hover:ring-primary/40'
                  : activo
                    ? 'bg-primary text-white ring-4 ring-primary/20'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400',
              ].join(' ')}
            >
              {completado ? <IconCheck size={12} stroke={3} /> : numero}
            </div>
            <span
              className={[
                'text-[10px] leading-tight text-center w-12 transition-colors',
                activo
                  ? 'text-primary font-semibold'
                  : completado
                    ? 'text-primary/70 hover:text-primary'
                    : 'text-gray-400 dark:text-gray-500',
              ].join(' ')}
            >
              {label}
            </span>
          </button>
        );

        if (i === PASOS.length - 1) return [step];

        const connector = (
          <div
            key={`conn-${i}`}
            className={[
              'flex-1 h-px mt-3.5 mx-1 transition-colors',
              completado ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700',
            ].join(' ')}
          />
        );

        return [step, connector];
      })}
    </div>
  );
}
