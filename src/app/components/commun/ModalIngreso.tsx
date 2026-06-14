'use client';
import { useState } from 'react';
import {
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
  Button, Input,
} from '@heroui/react';
import { IconLogin, IconIdBadge2, IconCalendar } from '@tabler/icons-react';
import { useAppSelector } from '@/app/store';
import type { UsuarioPerfil } from '@/app/store/usuario/usuarioSlice';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (perfil: UsuarioPerfil) => void;
}

export default function ModalIngreso({ isOpen, onClose, onSuccess }: Props) {
  const registrados = useAppSelector(s => s.usuario.registrados);

  const [doc, setDoc] = useState('');
  const [fecha, setFecha] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  function reset() {
    setDoc('');
    setFecha('');
    setError('');
  }

  function handleClose() {
    reset();
    onClose();
  }

  async function handleIngresar() {
    if (!doc.trim() || !fecha) {
      setError('Completa ambos campos para continuar');
      return;
    }
    setCargando(true);
    await new Promise(r => setTimeout(r, 600));
    const found = registrados.find(
      r => r.numeroDocumento === doc.trim() && r.fechaNacimiento === fecha,
    );
    setCargando(false);
    if (!found) {
      setError('No encontramos un perfil con esos datos. Verifica e intenta de nuevo.');
      return;
    }
    reset();
    onSuccess(found);
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => { if (!open) handleClose(); }}
      placement='center'
    >
      <ModalContent>
        {(onCloseInternal) => (
          <>
            <ModalHeader className='flex items-center gap-2'>
              <IconLogin size={18} className='text-primary' />
              <span>Ingresar con mi perfil</span>
            </ModalHeader>

            <ModalBody className='flex flex-col gap-4 pb-2'>
              <p className='text-sm text-gray-500 dark:text-gray-400'>
                Ingresa los datos con los que te registraste para continuar.
              </p>
              <Input
                label='Número de documento'
                placeholder='Ej: 1234567890'
                value={doc}
                onValueChange={v => { setDoc(v); setError(''); }}
                startContent={<IconIdBadge2 size={14} className='text-gray-400' />}
              />
              <Input
                label='Fecha de nacimiento'
                type='date'
                value={fecha}
                onValueChange={v => { setFecha(v); setError(''); }}
                startContent={<IconCalendar size={14} className='text-gray-400' />}
              />
              {error && (
                <p className='text-xs text-danger'>{error}</p>
              )}
            </ModalBody>

            <ModalFooter>
              <Button
                variant='flat' radius='full'
                onPress={() => { handleClose(); onCloseInternal(); }}
              >
                Cancelar
              </Button>
              <Button
                color='primary' radius='full'
                isLoading={cargando}
                onPress={handleIngresar}
              >
                {cargando ? 'Verificando...' : 'Ingresar'}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
