'use client';
import { useState, useEffect } from 'react';
import {
  Button, Input, Select, SelectItem, Card, CardBody, Chip,
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure,
} from '@heroui/react';
import {
  IconUserCheck, IconPencil, IconIdBadge2, IconUser, IconMail,
  IconPhone, IconClipboardList, IconMapPin, IconLogin, IconCalendar,
  IconLogout, IconUserX, IconArrowRight,
} from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/app/store';
import {
  guardarPerfil, cargarPerfil, cerrarSesion, darseDeBaja,
  type UsuarioPerfil,
} from '@/app/store/usuario/usuarioSlice';
import type { TipoDocumento } from '@/app/store/solicitud/solicitudSlice';
import ModalIngreso from '@/app/components/commun/ModalIngreso';

const TIPOS_DOCUMENTO = [
  { key: 'CC', label: 'Cédula de Ciudadanía' },
  { key: 'CE', label: 'Cédula de Extranjería' },
  { key: 'PA', label: 'Pasaporte' },
  { key: 'TI', label: 'Tarjeta de Identidad' },
];

function formatCOP(n: number) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);
}

export default function PerfilPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const perfilGuardado = useAppSelector(s => s.usuario);
  const registrados = useAppSelector(s => s.usuario.registrados);
  const historial = useAppSelector(s => s.historial.solicitudes);

  const yaRegistrado = !!perfilGuardado.numeroDocumento;
  const [editando, setEditando] = useState(!yaRegistrado);
  const [modalIngresoOpen, setModalIngresoOpen] = useState(false);
  const { isOpen: isBajaOpen, onOpen: onBajaOpen, onOpenChange: onBajaChange } = useDisclosure();

  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState<UsuarioPerfil>({ ...perfilGuardado });
  const [errores, setErrores] = useState<Partial<Record<keyof UsuarioPerfil, string>>>({});

  // After hydration: sync state with what the store already has (from preloadedState)
  useEffect(() => {
    setMounted(true);
    if (perfilGuardado.numeroDocumento) {
      setForm({ ...perfilGuardado });
      setEditando(false);
    } else {
      setEditando(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function set(campo: keyof UsuarioPerfil, valor: string) {
    setForm(f => ({ ...f, [campo]: valor }));
    setErrores(e => ({ ...e, [campo]: undefined }));
  }

  function validar() {
    const e: Partial<Record<keyof UsuarioPerfil, string>> = {};
    if (!form.tipoDocumento) e.tipoDocumento = 'Selecciona el tipo de documento';
    if (!form.numeroDocumento.trim()) {
      e.numeroDocumento = 'Campo requerido';
    } else {
      // Excluir el propio doc (edición del mismo usuario)
      const docNorm = form.numeroDocumento.trim().toUpperCase();
      const selfDoc = perfilGuardado.numeroDocumento.trim().toUpperCase();
      const otros = registrados.filter(r => r.numeroDocumento.trim().toUpperCase() !== selfDoc);
      if (otros.some(r => r.numeroDocumento.trim().toUpperCase() === docNorm))
        e.numeroDocumento = 'Este número de documento ya está registrado';
    }
    if (!form.nombres.trim()) e.nombres = 'Campo requerido';
    if (!form.apellidos.trim()) e.apellidos = 'Campo requerido';
    if (!form.fechaNacimiento) e.fechaNacimiento = 'Campo requerido';
    if (!form.email.trim()) {
      e.email = 'Campo requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = 'Correo inválido';
    } else {
      // Comparar ambos lados en minúsculas para evitar duplicados por capitalización
      const emailNorm = form.email.trim().toLowerCase();
      const selfDoc = perfilGuardado.numeroDocumento.trim().toUpperCase();
      const otros = registrados.filter(r => r.numeroDocumento.trim().toUpperCase() !== selfDoc);
      if (otros.some(r => r.email.trim().toLowerCase() === emailNorm))
        e.email = 'Este correo ya está registrado';
    }
    if (!form.telefono.trim()) e.telefono = 'Campo requerido';
    else if (!/^[0-9]{10}$/.test(form.telefono)) e.telefono = 'Debe tener 10 dígitos';
    if (!form.direccion.trim()) e.direccion = 'Campo requerido';
    if (!form.ciudad.trim()) e.ciudad = 'Campo requerido';
    return e;
  }

  function handleGuardar() {
    const errs = validar();
    if (Object.keys(errs).length) { setErrores(errs); return; }
    dispatch(guardarPerfil(form));
    setEditando(false);
  }

  function handleCerrarSesion() {
    dispatch(cerrarSesion());
    router.push('/');
  }

  function handleDarseDeBaja() {
    dispatch(darseDeBaja());
    router.push('/');
  }

  function handleLoginSuccess(perfil: UsuarioPerfil) {
    // guardarPerfil en lugar de cargarPerfil: persiste la sesión en localStorage
    dispatch(guardarPerfil(perfil));
    setForm({ ...perfil });
    setModalIngresoOpen(false);
    setEditando(false);
  }

  const solicitudesUsuario = historial.filter(
    s => s.numeroDocumento === perfilGuardado.numeroDocumento,
  );

  if (!mounted) return (
    <main className='max-w-xl mx-auto px-4 py-12 flex flex-col gap-6'>
      <div className='flex items-center gap-3'>
        <div className='w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/10 animate-pulse shrink-0' />
        <div className='flex flex-col gap-2 flex-1'>
          <div className='h-5 w-44 rounded bg-gray-100 dark:bg-white/10 animate-pulse' />
          <div className='h-3 w-56 rounded bg-gray-100 dark:bg-white/10 animate-pulse' />
        </div>
      </div>
      <div className='h-56 rounded-xl bg-gray-100 dark:bg-white/10 animate-pulse' />
    </main>
  );

  return (
    <main className='max-w-xl mx-auto px-4 py-12 flex flex-col gap-6'>
      {/* Header — solo visible en modo edición */}
      {editando && (
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0'>
            <IconUser size={22} stroke={1.8} />
          </div>
          <div>
            <h1 className='text-xl font-bold text-gray-800 dark:text-gray-100'>
              {yaRegistrado ? `${perfilGuardado.nombres} ${perfilGuardado.apellidos}` : 'Crear perfil'}
            </h1>
            {yaRegistrado && (
              <p className='text-xs text-gray-500 dark:text-gray-400'>{perfilGuardado.email}</p>
            )}
          </div>
        </div>
      )}

      {/* Formulario */}
      {editando ? (
        <Card shadow='none' className='bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10'>
          <CardBody className='p-5 flex flex-col gap-4'>
            <div className='flex items-center gap-2 mb-1'>
              <IconIdBadge2 size={14} className='text-primary/70' />
              <p className='text-[10px] font-bold uppercase tracking-widest text-gray-400'>Identificación</p>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
              <Select
                label='Tipo de documento'
                placeholder='Selecciona'
                selectedKeys={form.tipoDocumento ? new Set([form.tipoDocumento]) : new Set()}
                onSelectionChange={keys => set('tipoDocumento', (Array.from(keys)[0] as TipoDocumento) ?? '')}
                isInvalid={!!errores.tipoDocumento}
                errorMessage={errores.tipoDocumento}
                isRequired
              >
                {TIPOS_DOCUMENTO.map(t => (
                  <SelectItem key={t.key} textValue={t.label}>{t.label}</SelectItem>
                ))}
              </Select>
              <Input
                label='Número de documento'
                value={form.numeroDocumento}
                onValueChange={v => set('numeroDocumento', v)}
                isDisabled={!form.tipoDocumento}
                isInvalid={!!errores.numeroDocumento}
                errorMessage={errores.numeroDocumento}
                isRequired
              />
            </div>

            <div className='flex items-center gap-2 mt-1'>
              <IconUser size={14} className='text-primary/70' />
              <p className='text-[10px] font-bold uppercase tracking-widest text-gray-400'>Datos personales</p>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
              <Input label='Nombres' value={form.nombres}
                onValueChange={v => set('nombres', v)}
                isInvalid={!!errores.nombres} errorMessage={errores.nombres} isRequired />
              <Input label='Apellidos' value={form.apellidos}
                onValueChange={v => set('apellidos', v)}
                isInvalid={!!errores.apellidos} errorMessage={errores.apellidos} isRequired />
              <Input
                label='Fecha de nacimiento'
                type='date'
                value={form.fechaNacimiento}
                onValueChange={v => set('fechaNacimiento', v)}
                startContent={<IconCalendar size={14} className='text-gray-400' />}
                isInvalid={!!errores.fechaNacimiento}
                errorMessage={errores.fechaNacimiento}
                isRequired
                className='sm:col-span-2'
              />
              <Input label='Correo electrónico' type='email' value={form.email}
                onValueChange={v => set('email', v)}
                startContent={<IconMail size={14} className='text-gray-400' />}
                isInvalid={!!errores.email} errorMessage={errores.email} isRequired
                className='sm:col-span-2' />
              <Input label='Teléfono celular' value={form.telefono}
                onValueChange={v => set('telefono', v)}
                inputMode='numeric' maxLength={10}
                startContent={<IconPhone size={14} className='text-gray-400' />}
                isInvalid={!!errores.telefono} errorMessage={errores.telefono} isRequired
                className='sm:col-span-2' />
              <Input label='Dirección' value={form.direccion}
                onValueChange={v => set('direccion', v)}
                startContent={<IconMapPin size={14} className='text-gray-400' />}
                isInvalid={!!errores.direccion} errorMessage={errores.direccion} isRequired />
              <Input label='Ciudad' value={form.ciudad}
                onValueChange={v => set('ciudad', v)}
                isInvalid={!!errores.ciudad} errorMessage={errores.ciudad} isRequired />
            </div>

            <div className='flex gap-3 mt-2'>
              {yaRegistrado && (
                <Button variant='flat' radius='full'
                  onPress={() => { setForm({ ...perfilGuardado }); setEditando(false); }}>
                  Cancelar
                </Button>
              )}
              <Button color='primary' radius='full' className='flex-1 font-semibold'
                onPress={handleGuardar}
                startContent={<IconUserCheck size={16} />}>
                {yaRegistrado ? 'Guardar cambios' : 'Registrarme y solicitar'}
              </Button>
            </div>

            {!yaRegistrado && (
              <div className='flex items-center justify-center gap-1.5 pt-1'>
                <span className='text-xs text-gray-500 dark:text-gray-400'>¿Ya tienes perfil?</span>
                <button
                  type='button'
                  className='text-xs text-primary font-semibold hover:underline flex items-center gap-1'
                  onClick={() => setModalIngresoOpen(true)}
                >
                  <IconLogin size={13} />
                  Ingresar aquí
                </button>
              </div>
            )}
          </CardBody>
        </Card>
      ) : (
        <div className='flex flex-col gap-3'>
          {/* Hero card con avatar + datos */}
          <Card shadow='none' className='bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 overflow-hidden'>
            {/* Strip superior con avatar e iniciales */}
            <div className='bg-primary px-5 py-5 flex items-center gap-4'>
              <div className='w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shrink-0'>
                <span className='text-xl font-extrabold text-white select-none'>
                  {(perfilGuardado.nombres[0] ?? '').toUpperCase()}
                  {(perfilGuardado.apellidos[0] ?? '').toUpperCase()}
                </span>
              </div>
              <div className='flex-1 min-w-0'>
                <p className='text-lg font-bold text-white leading-tight'>
                  {perfilGuardado.nombres} {perfilGuardado.apellidos}
                </p>
                <p className='text-xs text-white/75 mt-0.5'>
                  {perfilGuardado.tipoDocumento} {perfilGuardado.numeroDocumento}
                </p>
                <p className='text-xs text-white/60 truncate mt-0.5'>{perfilGuardado.email}</p>
              </div>
              <button
                onClick={() => { setForm({ ...perfilGuardado }); setEditando(true); }}
                className='w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors shrink-0'
                title='Editar perfil'
              >
                <IconPencil size={15} />
              </button>
            </div>

            {/* Filas de detalle */}
            <CardBody className='p-0'>
              <div className='divide-y divide-gray-50 dark:divide-white/5'>
                {[
                  {
                    icon: <IconCalendar size={14} />,
                    label: 'Nacimiento',
                    value: perfilGuardado.fechaNacimiento
                      ? new Date(perfilGuardado.fechaNacimiento + 'T00:00:00').toLocaleDateString('es-CO', { day: '2-digit', month: 'long', year: 'numeric' })
                      : '—',
                  },
                  { icon: <IconPhone size={14} />, label: 'Teléfono', value: perfilGuardado.telefono },
                  { icon: <IconMail size={14} />, label: 'Correo', value: perfilGuardado.email },
                  { icon: <IconMapPin size={14} />, label: 'Dirección', value: [perfilGuardado.direccion, perfilGuardado.ciudad].filter(Boolean).join(', ') },
                ].map(({ icon, label, value }) => (
                  <div key={label} className='flex items-center gap-3 px-5 py-3.5'>
                    <span className='text-primary/60 shrink-0'>{icon}</span>
                    <span className='text-xs text-gray-400 dark:text-gray-500 w-20 shrink-0'>{label}</span>
                    <span className='text-sm font-medium text-gray-800 dark:text-gray-100 truncate'>{value || '—'}</span>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* CTA principal */}
          <Button
            as={Link} href='/registro' color='primary' radius='full'
            size='lg' className='w-full font-semibold'
            endContent={<IconArrowRight size={18} />}
          >
            Nueva solicitud de crédito
          </Button>

          {/* Acceso rápido al historial */}
          {solicitudesUsuario.length > 0 && (
            <Button
              as={Link} href='/historial' variant='bordered' radius='full'
              className='w-full border-gray-200 dark:border-white/10'
              startContent={<IconClipboardList size={16} className='text-primary' />}
            >
              <span className='flex-1 text-left'>Mis solicitudes</span>
              <Chip size='sm' color='primary' variant='flat'>{solicitudesUsuario.length}</Chip>
            </Button>
          )}

          {/* Acciones de cuenta */}
          <div className='flex gap-2 pt-1'>
            <Button
              variant='light' color='danger' radius='full' size='sm' className='flex-1'
              onPress={handleCerrarSesion}
              startContent={<IconLogout size={14} />}
            >
              Cerrar sesión
            </Button>
            <Button
              variant='light' color='default' radius='full' size='sm'
              className='flex-1 text-gray-400 hover:text-danger'
              onPress={onBajaOpen}
              startContent={<IconUserX size={14} />}
            >
              Darse de baja
            </Button>
          </div>
        </div>
      )}

      {/* Historial de solicitudes */}
      {solicitudesUsuario.length > 0 && (
        <div className='flex flex-col gap-3'>
          <div className='flex items-center gap-2'>
            <IconClipboardList size={14} className='text-primary/70' />
            <p className='text-[10px] font-bold uppercase tracking-widest text-gray-400'>
              Mis solicitudes ({solicitudesUsuario.length})
            </p>
          </div>
          {solicitudesUsuario.map(s => (
            <Card key={s.id} shadow='none' className='bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10'>
              <CardBody className='p-4 flex flex-row items-center justify-between gap-4'>
                <div className='flex flex-col gap-1'>
                  <p className='font-mono text-xs text-gray-500 dark:text-gray-400'>{s.id}</p>
                  <p className='text-sm font-semibold text-gray-800 dark:text-gray-100'>
                    {formatCOP(Number(s.monto))} · {s.plazoMeses} meses
                  </p>
                  <p className='text-xs text-gray-500 dark:text-gray-400'>
                    Cuota: {formatCOP(s.cuotaMensual)} · Total: {formatCOP(s.totalPagar)}
                  </p>
                </div>
                <div className='flex flex-col items-end gap-1 shrink-0'>
                  <Chip size='sm' color={s.status === 'completada' ? 'success' : 'warning'} variant='flat'>
                    {s.status === 'completada' ? 'Enviada' : 'Pausada'}
                  </Chip>
                  <p className='text-[10px] text-gray-400'>
                    {new Date(s.fecha).toLocaleDateString('es-CO')}
                  </p>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {/* Modal: Ingresar con perfil existente */}
      <ModalIngreso
        isOpen={modalIngresoOpen}
        onClose={() => setModalIngresoOpen(false)}
        onSuccess={handleLoginSuccess}
      />

      {/* Modal: Confirmar darse de baja */}
      <Modal isOpen={isBajaOpen} onOpenChange={onBajaChange} placement='center'>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex items-center gap-2 text-danger'>
                <IconUserX size={18} />
                ¿Darse de baja?
              </ModalHeader>
              <ModalBody>
                <p className='text-sm text-gray-600 dark:text-gray-300'>
                  Tu perfil y datos de registro serán eliminados de este dispositivo.
                  Las solicitudes realizadas quedarán en el historial pero no podrás acceder a ellas sin volverte a registrar.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button variant='flat' radius='full' onPress={onClose}>
                  Cancelar
                </Button>
                <Button color='danger' radius='full' onPress={() => { onClose(); handleDarseDeBaja(); }}>
                  Sí, darme de baja
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </main>
  );
}
