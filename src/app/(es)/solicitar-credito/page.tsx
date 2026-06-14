'use client';
import { useState } from 'react';
import { Button, Input, Select, SelectItem, Card, CardBody } from '@heroui/react';
import { IconSearch, IconAlertCircle } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppDispatch } from '@/app/store';
import { cargarBorrador, type SolicitudState, type TipoDocumento } from '@/app/store/solicitud/solicitudSlice';
import { cargarAudit } from '@/app/store/audit/auditSlice';

const TIPOS_DOCUMENTO = [
  { key: 'CC', label: 'Cédula de Ciudadanía' },
  { key: 'CE', label: 'Cédula de Extranjería' },
  { key: 'PA', label: 'Pasaporte' },
];

export default function SolicitarCreditoPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [tipoDocumento, setTipoDocumento] = useState<TipoDocumento | ''>('');
  const [numeroDocumento, setNumeroDocumento] = useState('');
  const [buscando, setBuscando] = useState(false);
  const [error, setError] = useState('');

  async function handleBuscar(e: { preventDefault(): void }) {
    e.preventDefault();
    if (!tipoDocumento || !numeroDocumento.trim()) {
      setError('Completa el tipo y número de documento');
      return;
    }

    setBuscando(true);
    setError('');
    await new Promise((r) => setTimeout(r, 600));

    try {
      const draftStr = localStorage.getItem('solicitud-draft');
      if (draftStr) {
        const draft = JSON.parse(draftStr) as SolicitudState;
        if (
          draft.identidad.tipoDocumento === tipoDocumento &&
          draft.identidad.numeroDocumento === numeroDocumento.trim()
        ) {
          dispatch(cargarBorrador(draft));
          const auditStr = localStorage.getItem('solicitud-audit');
          if (auditStr) dispatch(cargarAudit(JSON.parse(auditStr)));
          router.push('/registro');
          return;
        }
      }
      setError('No encontramos una solicitud activa con ese documento. ¿Deseas iniciar una nueva?');
    } catch {
      setError('Ocurrió un error al buscar la solicitud. Intenta de nuevo.');
    } finally {
      setBuscando(false);
    }
  }

  return (
    <main className='max-w-md mx-auto px-4 py-16'>
      <div className='text-center mb-8'>
        <h1 className='text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2'>Retomar solicitud</h1>
        <p className='text-sm text-gray-500 dark:text-gray-400'>
          Ingresa tu documento para continuar donde lo dejaste
        </p>
      </div>

      <Card shadow='sm' className='bg-white/80 dark:bg-white/10 border border-white dark:border-white/10'>
        <CardBody className='p-6'>
          <form onSubmit={handleBuscar} className='flex flex-col gap-4'>
            <Select
              label='Tipo de documento'
              placeholder='Selecciona una opción'
              selectedKeys={tipoDocumento ? new Set([tipoDocumento]) : new Set()}
              onSelectionChange={(keys) => {
                setTipoDocumento((Array.from(keys)[0] as TipoDocumento) ?? '');
                setError('');
              }}
              isRequired
            >
              {TIPOS_DOCUMENTO.map((t) => (
                <SelectItem key={t.key} textValue={t.label}>{t.label}</SelectItem>
              ))}
            </Select>

            <Input
              label='Número de documento'
              value={numeroDocumento}
              onValueChange={(v) => { setNumeroDocumento(v); setError(''); }}
              isDisabled={!tipoDocumento}
              isRequired
            />

            {error && (
              <div className='flex items-start gap-2 text-sm text-danger'>
                <IconAlertCircle size={16} className='shrink-0 mt-0.5' />
                <span>{error}</span>
              </div>
            )}

            <Button
              type='submit'
              color='primary'
              radius='full'
              isLoading={buscando}
              startContent={!buscando && <IconSearch size={16} />}
              className='font-semibold mt-2'
            >
              {buscando ? 'Buscando...' : 'Buscar solicitud'}
            </Button>

            <div className='flex flex-col items-center gap-2 pt-2 border-t border-gray-100 dark:border-white/10'>
              <p className='text-xs text-gray-400 dark:text-gray-500'>¿No tienes una solicitud?</p>
              <Link
                href='/registro'
                className='w-full text-center rounded-full border-2 border-primary text-primary text-sm font-semibold py-2 px-4 hover:bg-primary hover:text-white transition-colors'
              >
                Iniciar nueva solicitud
              </Link>
            </div>
          </form>
        </CardBody>
      </Card>
    </main>
  );
}
