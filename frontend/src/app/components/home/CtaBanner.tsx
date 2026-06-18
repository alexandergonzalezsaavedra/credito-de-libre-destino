import Image from 'next/image';
import { Button, Link } from '@heroui/react';
import {
  IconArrowRight,
  IconShieldCheck,
  IconClock,
  IconCurrencyDollar,
} from '@tabler/icons-react';

const CtaBanner = () => (
  <section className='py-16 px-4'>
    <div className='max-w-5xl mx-auto'>
      <div className='relative bg-linear-to-br from-primary via-primary to-blue-700 rounded-3xl overflow-hidden shadow-2xl'>
        {/* Círculos decorativos de fondo */}
        <div className='absolute -top-16 -left-16 w-64 h-64 rounded-full bg-white/5' />
        <div className='absolute -bottom-20 -right-10 w-80 h-80 rounded-full bg-white/5' />
        <div className='absolute top-1/2 left-1/3 w-40 h-40 rounded-full bg-white/5 -translate-y-1/2' />

        <div className='relative flex flex-col lg:flex-row items-center gap-10 p-8 sm:p-12'>
          {/* ── Columna izquierda: visual ── */}
          <div className='relative shrink-0 w-48 h-48 sm:w-56 sm:h-56 mx-auto lg:mx-0'>
            {/* GIF central */}
            <div className='w-full h-full rounded-3xl bg-white/10 backdrop-blur-sm flex items-center justify-center shadow-xl border border-white/20'>
              <Image
                src='/icons/money.gif'
                alt='Crédito de libre destino'
                width={130}
                height={130}
                unoptimized
                className='rounded-2xl'
              />
            </div>

            {/* Tarjeta flotante superior derecha */}
            <div className='absolute -top-4 -right-6 bg-white rounded-2xl shadow-lg px-3 py-2 flex items-center gap-2'>
              <div className='w-7 h-7 rounded-full bg-success/15 flex items-center justify-center shrink-0'>
                <IconShieldCheck
                  size={14}
                  className='text-success'
                />
              </div>
              <div>
                <p className='text-[10px] text-gray-400 leading-none'>
                  Aprobación
                </p>
                <p className='text-xs font-bold text-gray-800 whitespace-nowrap'>
                  100% digital
                </p>
              </div>
            </div>

            {/* Tarjeta flotante inferior izquierda */}
            <div className='absolute -bottom-4 -left-6 bg-white rounded-2xl shadow-lg px-3 py-2 flex items-center gap-2'>
              <div className='w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0'>
                <IconCurrencyDollar
                  size={14}
                  className='text-primary'
                />
              </div>
              <div>
                <p className='text-[10px] text-gray-400 leading-none'>Desde</p>
                <p className='text-xs font-bold text-gray-800 whitespace-nowrap'>
                  $1.000.000
                </p>
              </div>
            </div>

            {/* Tarjeta flotante derecha media */}
            <div className='absolute top-1/2 -right-8 -translate-y-1/2 bg-white rounded-2xl shadow-lg px-3 py-2 hidden sm:flex items-center gap-2'>
              <div className='w-7 h-7 rounded-full bg-warning/15 flex items-center justify-center shrink-0'>
                <IconClock
                  size={14}
                  className='text-warning'
                />
              </div>
              <div>
                <p className='text-[10px] text-gray-400 leading-none'>Hasta</p>
                <p className='text-xs font-bold text-gray-800 whitespace-nowrap'>
                  84 meses
                </p>
              </div>
            </div>
          </div>

          {/* ── Columna derecha: texto + CTA ── */}
          <div className='flex flex-col items-center lg:items-start text-center lg:text-left gap-5 flex-1 lg:pl-6'>
            <div className='inline-flex items-center gap-1.5 bg-white/15 rounded-full px-3 py-1'>
              <span className='w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse' />
              <span className='text-xs text-white/90 font-medium'>
                Disponible ahora
              </span>
            </div>

            <h2 className='text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight'>
              Solicita tu crédito
              <br />
              <span className='text-white/70'>en minutos,</span> no en días
            </h2>

            <p className='text-white/70 text-sm sm:text-base max-w-md'>
              Completa el formulario en línea, obtén tu simulación de cuota al
              instante y recibe el desembolso directamente en tu cuenta.
            </p>

            {/* Pasos */}
            <div className='flex flex-col sm:flex-row items-center gap-2 sm:gap-0'>
              {[
                'Completa el formulario',
                'Aprobación express',
                'Recibe tu dinero',
              ].map((paso, i) => (
                <div
                  key={paso}
                  className='flex items-center gap-2'
                >
                  <div className='flex items-center gap-2'>
                    <div className='w-6 h-6 rounded-full bg-white/20 text-white text-xs font-bold flex items-center justify-center shrink-0'>
                      {i + 1}
                    </div>
                    <span className='text-white/80 text-xs whitespace-nowrap'>
                      {paso}
                    </span>
                  </div>
                  {i < 2 && (
                    <div className='hidden sm:block w-6 h-px bg-white/30 mx-2' />
                  )}
                </div>
              ))}
            </div>

            <Button
              as={Link}
              href='/solicitar-credito'
              size='lg'
              radius='full'
              className='bg-white text-primary font-bold px-10 hover:bg-white/90 shadow-lg mt-1'
              endContent={<IconArrowRight size={18} />}
            >
              Iniciar solicitud
            </Button>

            <p className='text-white/40 text-xs'>
              Sin costo de estudio · Sin papelería · Solo tú y tu dispositivo
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default CtaBanner;
