'use client';
import Image from 'next/image';
import { FadeUp, StaggerParent, StaggerChild } from '@/app/components/commun/Motion';
import {
  IconWallet,
  IconRocket,
  IconDeviceMobile,
  IconHeartHandshake,
  IconPercentage,
  IconLock,
} from '@tabler/icons-react';

const BenefitsSection = () => (
  <section className='py-20 px-4 bg-slate-100 dark:bg-slate-900'>
    <div className='max-w-5xl mx-auto'>

      {/* Header */}
      <FadeUp className='flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-8'>
        <div>
          <span className='text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500'>
            Beneficios
          </span>
          <h2 className='text-3xl font-bold text-gray-900 dark:text-white mt-1.5'>
            ¿Por qué elegir nuestro CLD?
          </h2>
        </div>
        <p className='text-sm text-gray-500 dark:text-gray-400 max-w-xs sm:text-right'>
          Diseñado para acceder a tu dinero de la manera más simple y segura.
        </p>
      </FadeUp>

      {/* Bento grid — 2 cols mobile, 3 cols desktop */}
      <StaggerParent className='grid grid-cols-2 lg:grid-cols-3 gap-3'>

        {/* 1 — sin destino (1 col) */}
        <StaggerChild className='h-52 lg:h-55 relative rounded-2xl overflow-hidden'>
          <Image src='/home/elige-cld/sin-destino-especifico.jpg' fill className='object-cover' alt='' sizes='(max-width: 1024px) 50vw, 200px' />
          <div className='absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent p-4 flex flex-col justify-end'>
            <div className='w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3'>
              <IconWallet size={16} className='text-white' />
            </div>
            <h3 className='text-white font-bold text-lg leading-tight'>
              Sin destino<br />específico
            </h3>
            <p className='text-white/50 text-xs mt-1'>Úsalo como quieras</p>
          </div>
        </StaggerChild>

        {/* 2 — aprobación (1 col mobile, col-span-2 desktop) */}
        <StaggerChild className='h-52 lg:h-55 lg:col-span-2 relative rounded-2xl overflow-hidden'>
          <Image src='/home/elige-cld/aprobacion.jpg' fill className='object-cover' alt='' sizes='(max-width: 1024px) 50vw, 600px' />
          <div className='absolute inset-0 bg-linear-to-r from-black/80 via-black/50 to-transparent p-5 lg:p-7 flex flex-col justify-between'>
            <span className='text-[11px] font-bold uppercase tracking-[0.15em] text-gray-400'>
              Aprobación
            </span>
            <div>
              <p className='text-5xl lg:text-6xl font-extrabold text-white leading-none mb-2'>100%</p>
              <p className='text-white/60 text-sm'>
                Proceso <strong className='text-white font-bold'>automatizado</strong> al instante
              </p>
            </div>
          </div>
        </StaggerChild>

        {/* 3 — proceso digital (full width mobile, col-1 row-span-2 desktop) */}
        <StaggerChild className='col-span-2 h-52 lg:col-span-1 lg:row-span-2 lg:h-auto relative rounded-2xl overflow-hidden'>
          <Image src='/home/elige-cld/proceso-100-digital.jpg' fill className='object-cover' alt='' sizes='(max-width: 1024px) 100vw, 200px' />
          <div className='absolute inset-0 bg-linear-to-t from-black/90 via-black/50 to-transparent p-5 flex flex-col justify-between'>
            <span className='text-[11px] font-bold uppercase tracking-[0.15em] text-gray-400'>
              Digital
            </span>
            <div>
              <div className='w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3'>
                <IconDeviceMobile size={16} className='text-white' />
              </div>
              <h3 className='text-white font-bold text-2xl leading-tight'>
                Proceso<br />100%<br />digital
              </h3>
              <p className='text-white/50 text-xs mt-2'>Sin filas ni papelería</p>
            </div>
          </div>
        </StaggerChild>

        {/* 4 — tasas competitivas (1 col) */}
        <StaggerChild className='h-44 lg:h-46.25 relative rounded-2xl overflow-hidden'>
          <Image src='/home/elige-cld/tasas-competitivas.jpg' fill className='object-cover' alt='' sizes='(max-width: 1024px) 50vw, 200px' />
          <div className='absolute inset-0 bg-linear-to-t from-gray-900/90 via-gray-900/50 to-gray-900/20 p-4 flex flex-col justify-between'>
            <div className='w-8 h-8 rounded-full bg-white/20 flex items-center justify-center'>
              <IconPercentage size={16} className='text-white' />
            </div>
            <div>
              <h3 className='text-white font-bold text-base lg:text-lg leading-tight'>
                Tasas<br />competitivas
              </h3>
              <p className='text-white/70 text-xs mt-1'>Adaptadas a tu perfil crediticio</p>
            </div>
          </div>
        </StaggerChild>

        {/* 5 — desembolso inmediato (1 col) */}
        <StaggerChild className='h-44 lg:h-46.25 relative rounded-2xl overflow-hidden'>
          <Image src='/home/elige-cld/desembolso-inmediato.jpg' fill className='object-cover' alt='' sizes='(max-width: 1024px) 50vw, 200px' />
          <div className='absolute inset-0 bg-linear-to-t from-gray-900/90 via-gray-900/50 to-gray-900/20 p-4 flex flex-col justify-between'>
            <div className='w-8 h-8 rounded-full bg-white/20 flex items-center justify-center'>
              <IconHeartHandshake size={16} className='text-white' />
            </div>
            <div>
              <h3 className='text-white font-bold text-base lg:text-lg leading-tight'>
                Desembolso<br />inmediato
              </h3>
              <p className='text-white/60 text-xs mt-1'>Dinero en tu cuenta en horas</p>
            </div>
          </div>
        </StaggerChild>

        {/* 6 — seguridad (full width ambos breakpoints) */}
        <StaggerChild className='col-span-2 h-48 lg:h-46.25 relative rounded-2xl overflow-hidden'>
          <Image src='/home/elige-cld/seguridad-garantizada.jpg' fill className='object-cover' alt='' sizes='(max-width: 1024px) 100vw, 600px' />
          <div className='absolute inset-0 bg-linear-to-r from-black/85 via-black/50 to-transparent p-5 lg:p-7 flex flex-col justify-between'>
            <span className='text-[11px] font-bold uppercase tracking-[0.15em] text-gray-400'>
              Seguridad
            </span>
            <div className='flex items-end justify-between gap-4'>
              <div>
                <div className='w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3'>
                  <IconLock size={16} className='text-white' />
                </div>
                <h3 className='text-white font-bold text-xl leading-tight'>
                  Seguridad<br />garantizada
                </h3>
                <p className='text-white/50 text-xs mt-1.5 max-w-xs'>
                  Cifrado de extremo a extremo y autenticación de doble factor
                </p>
              </div>
              <div className='shrink-0 hidden sm:flex flex-col items-end gap-1'>
                <div className='w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center'>
                  <IconRocket size={16} className='text-white' />
                </div>
                <p className='text-white/40 text-[10px] text-right'>Aprobación<br />rápida</p>
              </div>
            </div>
          </div>
        </StaggerChild>

      </StaggerParent>
    </div>
  </section>
);

export default BenefitsSection;
