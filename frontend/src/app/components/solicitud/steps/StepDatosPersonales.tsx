'use client';
import { useState } from 'react';
import { Button, Input, addToast } from '@heroui/react';
import { IconUser, IconArrowRight, IconArrowLeft } from '@tabler/icons-react';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { guardarDatosPersonales, setPaso, type DatosPersonales } from '@/app/store/solicitud/solicitudSlice';
import { registrarEvento } from '@/app/store/audit/auditSlice';
import { guardarPerfil } from '@/app/store/usuario/usuarioSlice';
import { registrarSesionUsuario } from '@/app/store/sesiones/sesionesSlice';
import { applicationsApi } from '@/lib/apiClient';

export default function StepDatosPersonales() {
  const dispatch = useAppDispatch();
  const guardado = useAppSelector(s => s.solicitud.datosPersonales);
  const identidad = useAppSelector(s => s.solicitud.identidad);
  const usuario = useAppSelector(s => s.usuario);
  const backendId = useAppSelector(s => s.solicitud.backendId);

  const [form, setForm] = useState<DatosPersonales>({ ...guardado });
  const [errores, setErrores] = useState<Partial<Record<keyof DatosPersonales, string>>>({});

  function set(campo: keyof DatosPersonales, valor: string) {
    setForm(f => ({ ...f, [campo]: valor }));
    setErrores(e => ({ ...e, [campo]: undefined }));
  }

  function validar(data = form) {
    const e: Partial<Record<keyof DatosPersonales, string>> = {};
    if (!data.nombres.trim()) e.nombres = 'Campo requerido';
    if (!data.apellidos.trim()) e.apellidos = 'Campo requerido';
    if (!data.fechaNacimiento) e.fechaNacimiento = 'Campo requerido';
    else {
      const edad = new Date().getFullYear() - new Date(data.fechaNacimiento).getFullYear();
      if (edad < 18) e.fechaNacimiento = 'Debes ser mayor de 18 años';
    }
    if (!data.email.trim()) e.email = 'Campo requerido';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = 'Correo inválido';
    if (!data.telefono.trim()) e.telefono = 'Campo requerido';
    else if (!/^[0-9]{10}$/.test(data.telefono)) e.telefono = 'Debe tener 10 dígitos';
    if (!data.direccion.trim()) e.direccion = 'Campo requerido';
    if (!data.ciudad.trim()) e.ciudad = 'Campo requerido';
    return e;
  }

  function tocar(campo: keyof DatosPersonales) {
    const errs = validar();
    setErrores(e => ({ ...e, [campo]: errs[campo] }));
  }

  async function handleContinuar() {
    const errs = validar();
    if (Object.keys(errs).length) { setErrores(errs); return; }

    dispatch(guardarDatosPersonales(form));
    dispatch(registrarEvento({ evento: 'DATOS_PERSONALES_GUARDADOS' }));
    addToast({ title: 'Datos personales guardados', description: 'Tu información personal fue registrada correctamente.', color: 'success' });

    // Sincronizar con backend
    if (backendId) {
      try {
        await applicationsApi.update(backendId, {
          pasoActual: 2,
          datosPersonales: {
            nombres: form.nombres,
            apellidos: form.apellidos,
            email: form.email,
            telefono: form.telefono,
            fechaNacimiento: form.fechaNacimiento,
            direccion: form.direccion,
            ciudad: form.ciudad,
          },
        });
      } catch {
        // No bloquea el flujo
      }
    }

    // Si el usuario aún no tiene sesión activa, registrarlo automáticamente
    if (!usuario.numeroDocumento && identidad.numeroDocumento) {
      const perfil = {
        tipoDocumento: identidad.tipoDocumento,
        numeroDocumento: identidad.numeroDocumento,
        nombres: form.nombres,
        apellidos: form.apellidos,
        email: form.email,
        telefono: form.telefono,
        fechaNacimiento: form.fechaNacimiento,
        direccion: form.direccion,
        ciudad: form.ciudad,
      };
      dispatch(guardarPerfil(perfil));
      dispatch(registrarSesionUsuario(perfil));
      dispatch(registrarEvento({
        evento: 'USUARIO_REGISTRADO_AUTOMATICO',
        detalle: `${identidad.tipoDocumento} ${identidad.numeroDocumento}`,
      }));
      addToast({ title: 'Perfil creado', description: `Bienvenido, ${form.nombres.trim()}. Tu perfil fue registrado automáticamente.`, color: 'primary' });
    }
  }

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center gap-3 mb-2'>
        <div className='w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0'>
          <IconUser size={22} stroke={1.8} />
        </div>
        <div>
          <h2 className='text-lg font-bold text-gray-800 dark:text-gray-100'>Datos personales</h2>
          <p className='text-xs text-gray-500 dark:text-gray-400'>Información básica para procesar tu solicitud</p>
        </div>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        <Input
          label='Nombres' value={form.nombres}
          onValueChange={v => set('nombres', v)}
          onBlur={() => tocar('nombres')}
          isInvalid={!!errores.nombres} errorMessage={errores.nombres} isRequired
        />
        <Input
          label='Apellidos' value={form.apellidos}
          onValueChange={v => set('apellidos', v)}
          onBlur={() => tocar('apellidos')}
          isInvalid={!!errores.apellidos} errorMessage={errores.apellidos} isRequired
        />
        <Input
          label='Fecha de nacimiento' type='date' value={form.fechaNacimiento}
          onValueChange={v => set('fechaNacimiento', v)}
          onBlur={() => tocar('fechaNacimiento')}
          isInvalid={!!errores.fechaNacimiento} errorMessage={errores.fechaNacimiento} isRequired
          max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
        />
        <Input
          label='Teléfono celular' value={form.telefono}
          onValueChange={v => set('telefono', v.replace(/\s/g, ''))}
          onBlur={() => tocar('telefono')}
          inputMode='numeric' maxLength={10}
          isInvalid={!!errores.telefono} errorMessage={errores.telefono} isRequired
        />
        <Input
          label='Correo electrónico' type='email' value={form.email}
          onValueChange={v => set('email', v)}
          onBlur={() => tocar('email')}
          isInvalid={!!errores.email} errorMessage={errores.email} isRequired
          className='sm:col-span-2'
        />
        <Input
          label='Dirección' value={form.direccion}
          onValueChange={v => set('direccion', v)}
          onBlur={() => tocar('direccion')}
          isInvalid={!!errores.direccion} errorMessage={errores.direccion} isRequired
        />
        <Input
          label='Ciudad' value={form.ciudad}
          onValueChange={v => set('ciudad', v)}
          onBlur={() => tocar('ciudad')}
          isInvalid={!!errores.ciudad} errorMessage={errores.ciudad} isRequired
        />
      </div>

      <div className='flex gap-3 mt-2'>
        <Button variant='flat' radius='full' onPress={() => dispatch(setPaso(0))}
          startContent={<IconArrowLeft size={16} />}>
          Atrás
        </Button>
        <Button color='primary' radius='full' className='flex-1 font-semibold'
          endContent={<IconArrowRight size={18} />}
          onPress={handleContinuar}>
          Continuar
        </Button>
      </div>
    </div>
  );
}
