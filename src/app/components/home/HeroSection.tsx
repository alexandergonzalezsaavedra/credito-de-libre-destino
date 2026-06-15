'use client';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Button, Link } from '@heroui/react';
import {
  IconArrowRight,
  IconShieldCheck,
  IconClock,
  IconCurrencyDollar,
} from '@tabler/icons-react';
import { FadeUp, StaggerParent, StaggerChild, ScaleIn } from '@/app/components/commun/Motion';

const SLIDES = [
  '/home/slide/slide-1.jpg',
  '/home/slide/slide-2.jpg',
  '/home/slide/slide-3.jpg',
  '/home/slide/slide-4.jpg',
  '/home/slide/slide-5.jpg',
];

const idx = (n: number) => (n + SLIDES.length) % SLIDES.length;

const HeroSection = () => {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => setCurrent(c => (c + 1) % SLIDES.length), []);

  useEffect(() => {
    const t = setInterval(next, 4500);
    return () => clearInterval(t);
  }, [next]);

  return (
    <section className='relative bg-white dark:bg-gray-950 px-6 overflow-hidden'>
      <div className='max-w-5xl mx-auto'>
        <div className='flex flex-col lg:flex-row items-center gap-12 py-16 lg:py-24'>

          {/* ── Columna izquierda ── */}
          <StaggerParent className='flex flex-col gap-6 flex-1 items-center lg:items-start text-center lg:text-left'>
            <StaggerChild>
              <span className='text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500'>
                Crédito de Libre Destino
              </span>
            </StaggerChild>

            <StaggerChild>
              <h1 className='text-5xl sm:text-6xl text-gray-900 dark:text-white leading-[1.05] font-light'>
                Dinero para<br />
                lo que tú{' '}
                <span className='font-extrabold'>decidas,</span><br />
                <span className='font-extrabold text-primary'>cuando</span>{' '}
                lo necesitas
              </h1>
            </StaggerChild>

            <StaggerChild>
              <p className='text-base text-gray-500 dark:text-gray-400 max-w-sm leading-relaxed'>
                Obtén liquidez inmediata sin importar el destino. Solicita tu crédito
                100% en línea y recibe el desembolso en tiempo récord.
              </p>
            </StaggerChild>

            <StaggerChild className='flex flex-wrap gap-3 justify-center lg:justify-start'>
              <Button
                as={Link}
                href='/solicitar-credito'
                size='lg'
                radius='full'
                className='bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold px-8 shadow-lg'
                endContent={<IconArrowRight size={18} />}
              >
                Solicitar ahora
              </Button>
              <Button
                as={Link}
                href='/historial'
                variant='bordered'
                size='lg'
                radius='full'
                className='font-semibold px-8 border-gray-200 dark:border-white/20 text-gray-700 dark:text-gray-300'
              >
                Ya tengo cuenta
              </Button>
            </StaggerChild>
          </StaggerParent>

          {/* ── Columna derecha: slides apilados ── */}
          <ScaleIn delay={0.2} className='relative shrink-0 w-65 h-85 sm:w-75 sm:h-97.5 lg:w-80 lg:h-103.75 mx-auto'>

            {/* Carta trasera */}
            <div
              className='absolute inset-0 rounded-3xl overflow-hidden shadow-md opacity-40'
              style={{ transform: 'rotate(8deg) translate(24px, 8px) scale(0.89)' }}
            >
              <Image src={SLIDES[idx(current - 2)]} alt='' fill className='object-cover' sizes='320px' />
            </div>

            {/* Carta media */}
            <div
              className='absolute inset-0 rounded-3xl overflow-hidden shadow-lg opacity-70'
              style={{ transform: 'rotate(4deg) translate(12px, 4px) scale(0.945)' }}
            >
              <Image src={SLIDES[idx(current - 1)]} alt='' fill className='object-cover' sizes='320px' />
            </div>

            {/* Carta frontal */}
            <div className='absolute inset-0 rounded-3xl overflow-hidden shadow-2xl'>
              <Image
                src={SLIDES[current]}
                alt='Crédito de Libre Destino'
                fill
                className='object-cover transition-opacity duration-500'
                sizes='320px'
                priority
              />
            </div>

            {/* Badge: monto */}
            <FadeUp delay={0.5} className='absolute -left-12 top-10 bg-white dark:bg-gray-900 rounded-2xl shadow-xl px-3.5 py-2.5 flex items-center gap-2.5 z-20'>
              <div className='w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0'>
                <IconCurrencyDollar size={15} className='text-white' />
              </div>
              <div>
                <p className='text-[10px] text-gray-400 leading-none mb-0.5'>Desde</p>
                <p className='text-sm font-bold text-gray-800 dark:text-gray-100 whitespace-nowrap'>$1.000.000</p>
              </div>
            </FadeUp>

            {/* Badge: plazo */}
            <FadeUp delay={0.65} className='absolute -right-10 top-1/3 bg-white dark:bg-gray-900 rounded-2xl shadow-xl px-3.5 py-2.5 flex items-center gap-2.5 z-20'>
              <div className='w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center shrink-0'>
                <IconClock size={15} className='text-white' />
              </div>
              <div>
                <p className='text-[10px] text-gray-400 leading-none mb-0.5'>Plazo hasta</p>
                <p className='text-sm font-bold text-gray-800 dark:text-gray-100 whitespace-nowrap'>84 meses</p>
              </div>
            </FadeUp>

            {/* Badge: digital */}
            <FadeUp delay={0.8} className='absolute -left-8 bottom-10 bg-white dark:bg-gray-900 rounded-2xl shadow-xl px-3.5 py-2.5 flex items-center gap-2.5 z-20'>
              <div className='w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shrink-0'>
                <IconShieldCheck size={15} className='text-white' />
              </div>
              <div>
                <p className='text-[10px] text-gray-400 leading-none mb-0.5'>Proceso</p>
                <p className='text-sm font-bold text-gray-800 dark:text-gray-100 whitespace-nowrap'>100% digital</p>
              </div>
            </FadeUp>

            {/* Dots */}
            <div className='absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-1.5 z-20'>
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  aria-label={`Slide ${i + 1}`}
                  className={`rounded-full transition-all duration-300 ${
                    i === current
                      ? 'w-5 h-2 bg-primary'
                      : 'w-2 h-2 bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </ScaleIn>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
