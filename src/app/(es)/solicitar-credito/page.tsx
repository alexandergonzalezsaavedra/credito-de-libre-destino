import Image from 'next/image';
import SolicitudWizard from '@/app/components/solicitud/SolicitudWizard';
import { RecaptchaProvider } from '@/app/components/commun/RecaptchaProvider';
import { IconCircleCheck } from '@tabler/icons-react';

const BENEFICIOS = [
  'Sin destino específico — úsalo como quieras',
  'Desembolso en horas tras la aprobación',
  'Proceso 100% en línea, sin filas ni papelería',
  'Plazos hasta 84 meses',
];

export default function SolicitarCreditoPage() {
  return (
    <RecaptchaProvider>
      <main className='min-h-[calc(100vh-160px)] flex items-center'>
        <div className='w-full max-w-5xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center'>

          {/* Columna izquierda — contexto */}
          <div className='hidden lg:flex flex-col gap-6'>

            {/* Imagen */}
            <div className='relative w-full h-72 rounded-3xl overflow-hidden shadow-lg'>
              <Image
                src='/home/elige-cld/aprobacion.jpg'
                fill
                className='object-cover'
                alt='Solicita tu crédito de libre destino'
                sizes='(max-width: 1024px) 100vw, 50vw'
                priority
              />
              <div className='absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent p-6 flex flex-col justify-end'>
                <p className='text-white/60 text-xs font-bold uppercase tracking-widest mb-1'>Crédito de Libre Destino</p>
                <h2 className='text-white text-2xl font-extrabold leading-tight'>
                  Dinero para lo<br />que tú decidas
                </h2>
              </div>
            </div>

            {/* Texto y beneficios */}
            <div>
              <h1 className='text-xl font-bold text-gray-800 dark:text-gray-100 mb-2'>
                ¿Qué es el CLD?
              </h1>
              <p className='text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-5'>
                El Crédito de Libre Destino (CLD) te da liquidez inmediata sin restricciones.
                Puedes usarlo para lo que necesites: viajes, remodelaciones, educación o cualquier otro proyecto personal.
              </p>
              <ul className='flex flex-col gap-3'>
                {BENEFICIOS.map(b => (
                  <li key={b} className='flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300'>
                    <IconCircleCheck size={18} className='text-primary shrink-0 mt-0.5' stroke={1.8} />
                    {b}
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Columna derecha — formulario */}
          <div>
            <SolicitudWizard />
          </div>

        </div>
      </main>
    </RecaptchaProvider>
  );
}
