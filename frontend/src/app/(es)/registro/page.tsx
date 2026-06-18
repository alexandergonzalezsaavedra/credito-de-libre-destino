import SolicitudWizard from '@/app/components/solicitud/SolicitudWizard';
import { RecaptchaProvider } from '@/app/components/commun/RecaptchaProvider';

export default function RegistroPage() {
  return (
    <RecaptchaProvider>
      <main className='max-w-2xl mx-auto px-4 py-10'>
        <SolicitudWizard />
      </main>
    </RecaptchaProvider>
  );
}
