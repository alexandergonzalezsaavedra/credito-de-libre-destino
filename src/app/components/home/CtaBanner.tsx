import { Button, Link } from '@heroui/react';
import {
  IconArrowRight,
  IconClockHour4,
  IconFileCheck,
} from '@tabler/icons-react';

const steps = [
  { icon: IconFileCheck, label: 'Completa el formulario' },
  { icon: IconClockHour4, label: 'Aprobación en minutos' },
  { icon: IconArrowRight, label: 'Recibe tu dinero' },
];

const CtaBanner = () => {
  return (
    <section className='py-16 px-4'>
      <div className='max-w-4xl mx-auto'>
        <div className='relative bg-primary rounded-3xl overflow-hidden p-10 text-center shadow-xl'>
          <div className='absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_white_0%,_transparent_60%)]' />

          <h2 className='text-3xl sm:text-4xl font-extrabold text-white mb-3'>
            ¿Listo para solicitarlo?
          </h2>
          <p className='text-white/80 mb-8 max-w-md mx-auto text-sm'>
            En solo 3 pasos tendrás tu crédito aprobado. El proceso es
            completamente en línea y sin complicaciones.
          </p>

          <div className='flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-0 mb-8'>
            {steps.map(({ icon: Icon, label }, i) => (
              <div
                key={label}
                className='flex items-center gap-2'
              >
                <div className='flex flex-col items-center gap-1'>
                  <div className='w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white'>
                    <Icon size={18} />
                  </div>
                  <span className='text-white/90 text-xs font-medium whitespace-nowrap'>
                    {label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className='hidden sm:block w-16 h-px bg-white/30 mx-2 mb-4' />
                )}
              </div>
            ))}
          </div>

          <Button
            as={Link}
            href='/solicitar-credito'
            size='lg'
            radius='full'
            className='bg-white text-primary font-bold px-10 hover:bg-white/90 shadow-md'
            endContent={<IconArrowRight size={18} />}
          >
            Iniciar solicitud
          </Button>

          <p className='text-white/50 text-xs mt-4'>
            Sin costo de estudio · Sin papelería · Solo tú y tu celular
          </p>
        </div>
      </div>
    </section>
  );
};

export default CtaBanner;
