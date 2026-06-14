import { Button, Link, Chip } from '@heroui/react';
import {
  IconArrowRight,
  IconShieldCheck,
  IconClock,
  IconCurrencyDollar,
} from '@tabler/icons-react';

const stats = [
  { icon: IconCurrencyDollar, label: 'Desde', value: '$1 millón' },
  { icon: IconClock, label: 'Plazo hasta', value: '84 meses' },
  { icon: IconShieldCheck, label: 'Proceso', value: '100% digital' },
];

const HeroSection = () => {
  return (
    <section className='relative overflow-hidden py-16 px-4'>
      <div className='max-w-5xl mx-auto'>
        <div className='flex flex-col items-center text-center gap-6'>
          <Chip
            color='primary'
            variant='flat'
            size='sm'
            className='font-medium'
          >
            Crédito de Libre Destino
          </Chip>

          <h1 className='text-4xl sm:text-5xl font-extrabold text-gray-800 dark:text-gray-100 leading-tight max-w-3xl'>
            Dinero para lo que <span className='text-primary'>tú decidas</span>,
            cuando lo necesitas
          </h1>

          <p className='text-lg text-gray-500 dark:text-gray-400 max-w-xl'>
            Obtén liquidez inmediata sin importar el destino. Solicita tu
            crédito 100% en línea y recibe el desembolso en tu cuenta en tiempo
            récord.
          </p>

          <div className='flex flex-col sm:flex-row gap-3 mt-2'>
            <Button
              as={Link}
              href='/solicitar-credito'
              color='primary'
              size='lg'
              radius='full'
              endContent={<IconArrowRight size={18} />}
              className='font-semibold px-8'
            >
              Solicitar ahora
            </Button>
            <Button
              as={Link}
              href='/solicitar-credito'
              variant='bordered'
              size='lg'
              radius='full'
              className='font-semibold px-8'
            >
              Ya tengo cuenta
            </Button>
          </div>

          <div className='grid grid-cols-3 gap-6 mt-8 w-full max-w-lg'>
            {stats.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className='flex flex-col items-center gap-1 bg-white/70 dark:bg-white/10 rounded-2xl p-4 shadow-sm'
              >
                <Icon
                  size={22}
                  className='text-primary'
                />
                <span className='text-xs text-gray-400 dark:text-gray-500'>
                  {label}
                </span>
                <span className='text-sm font-bold text-gray-700 dark:text-gray-200'>
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
