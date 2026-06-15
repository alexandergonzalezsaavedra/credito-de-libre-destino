import { Chip } from '@heroui/react';
import {
  IconUserCheck,
  IconBriefcase,
  IconReportMoney,
  IconCircleCheck,
} from '@tabler/icons-react';

const requirements = [
  {
    icon: IconUserCheck,
    title: 'Mayor de edad',
    description:
      'Ser ciudadano colombiano mayor de 18 años con cédula vigente.',
  },
  {
    icon: IconBriefcase,
    title: 'Empleado o pensionado',
    description:
      'Pertenecer al sector público, privado o ser pensionado con ingresos demostrables.',
  },
  {
    icon: IconReportMoney,
    title: 'Buen historial crediticio',
    description:
      'No presentar reportes negativos vigentes en centrales de riesgo.',
  },
];

const RequirementsSection = () => {
  return (
    <section className='py-16 px-4'>
      <div className='max-w-5xl mx-auto'>
        <div className='flex flex-col lg:flex-row gap-12 items-center'>
          <div className='flex-1'>
            <Chip
              color='primary'
              variant='dot'
              size='sm'
              className='mb-4 font-medium'
            >
              Requisitos mínimos
            </Chip>
            <h2 className='text-3xl font-bold text-gray-800 dark:text-gray-100 leading-tight mb-3'>
              ¿Quién puede
              <br />
              <span className='text-primary'>solicitar el crédito?</span>
            </h2>
            <p className='text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-sm'>
              Cumplir estos requisitos es suficiente para iniciar tu solicitud.
              El proceso es simple y lo hacemos todo por ti.
            </p>
          </div>

          <div className='flex-1 w-full'>
            <ul className='flex flex-col gap-4'>
              {requirements.map(({ icon: Icon, title, description }) => (
                <li
                  key={title}
                  className='flex items-center gap-4 py-4 border-b border-gray-100 dark:border-white/10 last:border-0'
                >
                  <div className='flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary shrink-0'>
                    <Icon size={20} stroke={1.8} />
                  </div>
                  <div className='flex-1'>
                    <p className='font-semibold text-gray-800 dark:text-gray-100 text-sm'>
                      {title}
                    </p>
                    <p className='text-xs text-gray-500 dark:text-gray-400 mt-0.5'>
                      {description}
                    </p>
                  </div>
                  <IconCircleCheck
                    size={18}
                    className='text-primary shrink-0'
                    stroke={1.8}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RequirementsSection;
