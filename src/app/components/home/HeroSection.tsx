'use client';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Button, Link, Chip } from '@heroui/react';
import {
  IconArrowRight, IconShieldCheck, IconClock,
  IconCurrencyDollar, IconChevronLeft, IconChevronRight,
} from '@tabler/icons-react';

const SLIDES = [
  '/home/slide/slide-1.jpg',
  '/home/slide/slide-2.jpg',
  '/home/slide/slide-3.jpg',
  '/home/slide/slide-4.jpg',
  '/home/slide/slide-5.jpg',
];

const stats = [
  { icon: IconCurrencyDollar, label: 'Desde',      value: '$1 millón'    },
  { icon: IconClock,          label: 'Plazo hasta', value: '84 meses'     },
  { icon: IconShieldCheck,    label: 'Proceso',     value: '100% digital' },
];

function SlideVertical() {
  const [actual, setActual] = useState(0);

  const ir = useCallback((idx: number) => {
    setActual((idx + SLIDES.length) % SLIDES.length);
  }, []);

  const siguiente = useCallback(() => ir(actual + 1), [actual, ir]);

  useEffect(() => {
    const t = setInterval(siguiente, 4500);
    return () => clearInterval(t);
  }, [siguiente]);

  return (
    <div className='relative shrink-0 w-full max-w-[320px] mx-auto lg:mx-0'>
      {/* Contenedor de imagen vertical */}
      <div className='relative w-full overflow-hidden rounded-3xl shadow-2xl' style={{ aspectRatio: '3/4' }}>
        {SLIDES.map((src, i) => (
          <div
            key={src}
            className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
              i === actual ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <Image src={src} alt={`Slide ${i + 1}`} fill className='object-cover' priority={i === 0} sizes='320px' />
          </div>
        ))}

        {/* Flechas sobre la imagen */}
        <button
          onClick={() => ir(actual - 1)}
          aria-label='Anterior'
          className='absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-gray-800 flex items-center justify-center shadow transition-colors'
        >
          <IconChevronLeft size={18} />
        </button>
        <button
          onClick={siguiente}
          aria-label='Siguiente'
          className='absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-gray-800 flex items-center justify-center shadow transition-colors'
        >
          <IconChevronRight size={18} />
        </button>
      </div>

      {/* Puntos debajo */}
      <div className='flex justify-center gap-1.5 mt-3'>
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => ir(i)}
            aria-label={`Slide ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${
              i === actual ? 'w-5 h-2 bg-primary' : 'w-2 h-2 bg-gray-300 dark:bg-gray-600'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

const HeroSection = () => (
  <section className='relative overflow-hidden py-12 px-4'>
    <div className='max-w-5xl mx-auto'>
      <div className='flex flex-col lg:flex-row items-center gap-10 lg:gap-16'>

        {/* Columna izquierda — texto */}
        <div className='flex flex-col items-center lg:items-start text-center lg:text-left gap-5 flex-1'>
          <Chip color='primary' variant='flat' size='sm' className='font-medium'>
            Crédito de Libre Destino
          </Chip>

          <h1 className='text-4xl sm:text-5xl font-extrabold text-gray-800 dark:text-gray-100 leading-tight'>
            Dinero para lo que <span className='text-primary'>tú decidas</span>,{' '}
            cuando lo necesitas
          </h1>

          <p className='text-lg text-gray-500 dark:text-gray-400 max-w-md'>
            Obtén liquidez inmediata sin importar el destino. Solicita tu crédito
            100% en línea y recibe el desembolso en tu cuenta en tiempo récord.
          </p>

          <div className='flex flex-col sm:flex-row gap-3'>
            <Button
              as={Link} href='/solicitar-credito'
              color='primary' size='lg' radius='full'
              endContent={<IconArrowRight size={18} />}
              className='font-semibold px-8'
            >
              Solicitar ahora
            </Button>
            <Button
              as={Link} href='/solicitar-credito'
              variant='bordered' size='lg' radius='full'
              className='font-semibold px-8'
            >
              Ya tengo cuenta
            </Button>
          </div>

          <div className='grid grid-cols-3 gap-4 mt-2 w-full max-w-sm'>
            {stats.map(({ icon: Icon, label, value }) => (
              <div key={label} className='flex flex-col items-center gap-1 bg-white/70 dark:bg-white/10 rounded-2xl p-3 shadow-sm'>
                <Icon size={20} className='text-primary' />
                <span className='text-xs text-gray-400 dark:text-gray-500'>{label}</span>
                <span className='text-sm font-bold text-gray-700 dark:text-gray-200'>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Columna derecha — slide vertical */}
        <SlideVertical />

      </div>
    </div>
  </section>
);

export default HeroSection;
