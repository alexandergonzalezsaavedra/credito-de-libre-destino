'use client';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

const SLIDES = [
  { src: '/home/slide/slide-1.jpg', alt: 'Crédito de libre destino — slide 1' },
  { src: '/home/slide/slide-2.jpg', alt: 'Crédito de libre destino — slide 2' },
  { src: '/home/slide/slide-3.jpg', alt: 'Crédito de libre destino — slide 3' },
  { src: '/home/slide/slide-4.jpg', alt: 'Crédito de libre destino — slide 4' },
  { src: '/home/slide/slide-5.jpg', alt: 'Crédito de libre destino — slide 5' },
];

const INTERVALO_MS = 4500;

export default function SlideShow() {
  const [actual, setActual]     = useState(0);
  const [animando, setAnimando] = useState(false);

  const ir = useCallback((indice: number) => {
    if (animando) return;
    setAnimando(true);
    setActual((indice + SLIDES.length) % SLIDES.length);
    setTimeout(() => setAnimando(false), 500);
  }, [animando]);

  const anterior = () => ir(actual - 1);
  const siguiente = useCallback(() => ir(actual + 1), [actual, ir]);

  // Auto-play
  useEffect(() => {
    const timer = setInterval(siguiente, INTERVALO_MS);
    return () => clearInterval(timer);
  }, [siguiente]);

  return (
    <section className='relative w-full overflow-hidden rounded-none' style={{ aspectRatio: '16/5' }}>

      {/* Slides */}
      {SLIDES.map((slide, i) => (
        <div
          key={slide.src}
          className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
            i === actual ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            className='object-cover'
            priority={i === 0}
            sizes='100vw'
          />
        </div>
      ))}

      {/* Overlay sutil */}
      <div className='absolute inset-0 z-20 bg-black/10' />

      {/* Flecha izquierda */}
      <button
        onClick={anterior}
        aria-label='Anterior'
        className='absolute left-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-white/70 hover:bg-white text-gray-800 flex items-center justify-center shadow transition-colors'
      >
        <IconChevronLeft size={20} />
      </button>

      {/* Flecha derecha */}
      <button
        onClick={siguiente}
        aria-label='Siguiente'
        className='absolute right-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-white/70 hover:bg-white text-gray-800 flex items-center justify-center shadow transition-colors'
      >
        <IconChevronRight size={20} />
      </button>

      {/* Puntos indicadores */}
      <div className='absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex gap-2'>
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => ir(i)}
            aria-label={`Ir al slide ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${
              i === actual
                ? 'w-5 h-2 bg-white'
                : 'w-2 h-2 bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
