'use client';
import { useState, useEffect } from 'react';
import {
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
  Button, Input, addToast,
} from '@heroui/react';
import { IconLogin, IconIdBadge2, IconCalendar, IconAlertCircle } from '@tabler/icons-react';
import { useAppSelector } from '@/app/store';
import type { UsuarioPerfil } from '@/app/store/usuario/usuarioSlice';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (perfil: UsuarioPerfil) => void;
  /** Mensaje informativo que se muestra en la parte superior del modal */
  mensaje?: string;
  /** Número de documento pre-rellenado (cuando viene de detección de duplicado) */
  docInicial?: string;
}

export default function ModalIngreso({ isOpen, onClose, onSuccess, mensaje, docInicial }: Props) {
  const sesiones = useAppSelector(s => s.sesiones.sesiones);

  const [doc, setDoc] = useState(docInicial ?? '');
  const [fecha, setFecha] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  // Sincroniza el doc cuando cambia el prop externo (ej. nuevo duplicado detectado)
  useEffect(() => {
    setDoc(docInicial ?? '');
    setError('');
  }, [docInicial, isOpen]);

  function reset() {
    setDoc(docInicial ?? '');
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
    await new Promise<void>(resolve => setTimeout(resolve, 600));
    const sesion = sesiones.find(
      s => s.usuario.numeroDocumento === doc.trim() && s.usuario.fechaNacimiento === fecha,
    );
    setCargando(false);
    if (!sesion) {
      setError('No encontramos un perfil con esos datos. Verifica e intenta de nuevo.');
      return;
    }
    addToast({
      title: `Bienvenido, ${sesion.usuario.nombres.trim()}`,
      description: 'Sesión iniciada correctamente.',
      color: 'success',
    });
    reset();
    onSuccess(sesion.usuario);
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
              {/* Mensaje informativo de duplicado */}
              {mensaje && (
                <div className='flex items-start gap-2 rounded-xl bg-warning/10 border border-warning/20 p-3'>
                  <IconAlertCircle size={16} className='text-warning shrink-0 mt-0.5' />
                  <p className='text-xs text-warning-700 dark:text-warning-400'>{mensaje}</p>
                </div>
              )}

              <p className='text-sm text-gray-500 dark:text-gray-400'>
                Ingresa tu número de documento y fecha de nacimiento para acceder.
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
