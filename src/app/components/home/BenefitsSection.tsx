import { Card, CardBody } from '@heroui/react';
import {
  IconWallet,
  IconRocket,
  IconDeviceMobile,
  IconHeartHandshake,
  IconPercentage,
  IconLock,
} from '@tabler/icons-react';

const benefits = [
  {
    icon: IconWallet,
    title: 'Sin destino específico',
    description:
      'Úsalo para lo que quieras: viajes, estudios, emergencias, remodelación o cualquier necesidad personal.',
  },
  {
    icon: IconRocket,
    title: 'Aprobación rápida',
    description:
      'Respuesta en minutos. Nuestro proceso automatizado evalúa tu solicitud al instante.',
  },
  {
    icon: IconPercentage,
    title: 'Tasas competitivas',
    description:
      'Accede a una de las tasas de interés más bajas del mercado, adaptadas a tu perfil crediticio.',
  },
  {
    icon: IconDeviceMobile,
    title: 'Proceso 100% digital',
    description:
      'Desde la solicitud hasta el desembolso, todo desde tu dispositivo, sin filas ni papelería.',
  },
  {
    icon: IconHeartHandshake,
    title: 'Desembolso inmediato',
    description:
      'Una vez aprobado, el dinero llega a tu cuenta en cuestión de horas.',
  },
  {
    icon: IconLock,
    title: 'Seguridad garantizada',
    description:
      'Tu información está protegida con cifrado de extremo a extremo y autenticación de doble factor.',
  },
];

const BenefitsSection = () => {
  return (
    <section className='py-16 px-4 bg-white/40 dark:bg-white/5'>
      <div className='max-w-5xl mx-auto'>
        <div className='text-center mb-10'>
          <h2 className='text-3xl font-bold text-gray-800 dark:text-gray-100'>
            ¿Por qué elegir nuestro CLD?
          </h2>
          <p className='text-gray-500 dark:text-gray-400 mt-2'>
            Diseñado para que accedas a tu dinero de la manera más simple y
            segura.
          </p>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          {benefits.map(({ icon: Icon, title, description }) => (
            <Card
              key={title}
              shadow='sm'
              className='bg-white/80 dark:bg-white/10 border border-white dark:border-white/10 hover:shadow-md transition-shadow'
            >
              <CardBody className='flex flex-row gap-4 items-start p-5'>
                <div className='flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary shrink-0'>
                  <Icon size={20} stroke={1.8} />
                </div>
                <div>
                  <h3 className='font-semibold text-gray-800 dark:text-gray-100 text-sm mb-1'>
                    {title}
                  </h3>
                  <p className='text-xs text-gray-500 dark:text-gray-400 leading-relaxed'>
                    {description}
                  </p>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
