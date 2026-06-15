'use client';
import { useState } from 'react';
import { Button, Input, Select, SelectItem, addToast } from '@heroui/react';
import {
  IconBriefcase,
  IconArrowRight,
  IconArrowLeft,
} from '@tabler/icons-react';
import { useAppDispatch, useAppSelector } from '@/app/store';
import {
  guardarDatosFinancieros,
  setPaso,
  type DatosFinancieros,
} from '@/app/store/solicitud/solicitudSlice';
import { registrarEvento } from '@/app/store/audit/auditSlice';
import { formatearMonto, desformatearMonto } from '@/lib/formato';

const TIPOS_EMPLEO = [
  { key: 'empleado_publico', label: 'Empleado' },
  { key: 'pensionado', label: 'Pensionado' },
  { key: 'independiente', label: 'Independiente' },
];

export default function StepDatosFinancieros() {
  const dispatch = useAppDispatch();
  const guardado = useAppSelector((s) => s.solicitud.datosFinancieros);
  const isLoggedIn = useAppSelector((s) => !!s.usuario.numeroDocumento);

  const [form, setForm] = useState<DatosFinancieros>({ ...guardado });
  const [errores, setErrores] = useState<
    Partial<Record<keyof DatosFinancieros, string>>
  >({});

  function set(campo: keyof DatosFinancieros, valor: string) {
    setForm((f) => ({ ...f, [campo]: valor }));
    setErrores((e) => ({ ...e, [campo]: undefined }));
  }

  function validar() {
    const e: Partial<Record<keyof DatosFinancieros, string>> = {};
    if (!form.tipoEmpleo) e.tipoEmpleo = 'Selecciona el tipo de empleo';
    if (form.tipoEmpleo !== 'pensionado' && !form.empresa.trim())
      e.empresa = 'Campo requerido';
    if (!form.ingresoMensual) e.ingresoMensual = 'Campo requerido';
    else if (Number(form.ingresoMensual) < 1300000)
      e.ingresoMensual = 'El ingreso mínimo es $1.300.000';
    if (!form.gastosMensuales) e.gastosMensuales = 'Campo requerido';
    else if (Number(form.gastosMensuales) >= Number(form.ingresoMensual))
      e.gastosMensuales = 'Los gastos no pueden superar los ingresos';
    return e;
  }

  function tocar(campo: keyof DatosFinancieros) {
    const errs = validar();
    setErrores((e) => ({ ...e, [campo]: errs[campo] }));
  }

  function handleContinuar() {
    const errs = validar();
    if (Object.keys(errs).length) {
      setErrores(errs);
      return;
    }
    dispatch(guardarDatosFinancieros(form));
    dispatch(registrarEvento({ evento: 'DATOS_FINANCIEROS_GUARDADOS' }));
    addToast({ title: 'Datos financieros guardados', description: 'Tu información de ingresos fue registrada correctamente.', color: 'success' });
  }

  const esPensionado = form.tipoEmpleo === 'pensionado';

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center gap-3 mb-2'>
        <div className='w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0'>
          <IconBriefcase
            size={22}
            stroke={1.8}
          />
        </div>
        <div>
          <h2 className='text-lg font-bold text-gray-800 dark:text-gray-100'>
            Datos financieros
          </h2>
          <p className='text-xs text-gray-500 dark:text-gray-400'>
            Información de ingresos para evaluar tu crédito
          </p>
        </div>
      </div>

      <Select
        label='Tipo de empleo'
        placeholder='Selecciona una opción'
        selectedKeys={form.tipoEmpleo ? new Set([form.tipoEmpleo]) : new Set()}
        onSelectionChange={(keys) => {
          const val = Array.from(keys)[0] as string;
          set('tipoEmpleo', val ?? '');
          if (val === 'pensionado') set('empresa', '');
        }}
        isInvalid={!!errores.tipoEmpleo}
        errorMessage={errores.tipoEmpleo}
        isRequired
      >
        {TIPOS_EMPLEO.map((t) => (
          <SelectItem key={t.key}>{t.label}</SelectItem>
        ))}
      </Select>

      {!esPensionado && (
        <Input
          label='Empresa / entidad empleadora'
          value={form.empresa}
          onValueChange={(v) => set('empresa', v)}
          onBlur={() => tocar('empresa')}
          isInvalid={!!errores.empresa}
          errorMessage={errores.empresa}
          isRequired
        />
      )}

      <div className='flex flex-col gap-4'>
        <Input
          label='Ingreso mensual ($)'
          value={formatearMonto(form.ingresoMensual)}
          onValueChange={(v) => set('ingresoMensual', desformatearMonto(v))}
          onBlur={() => tocar('ingresoMensual')}
          inputMode='numeric'
          startContent={<span className='text-gray-400 text-sm'>$</span>}
          isInvalid={!!errores.ingresoMensual}
          errorMessage={errores.ingresoMensual}
          isRequired
        />
        <Input
          label='Otros ingresos ($)'
          value={formatearMonto(form.otrosIngresos)}
          onValueChange={(v) => set('otrosIngresos', desformatearMonto(v))}
          inputMode='numeric'
          startContent={<span className='text-gray-400 text-sm'>$</span>}
          description='Opcional'
        />
        <Input
          label='Gastos mensuales ($)'
          value={formatearMonto(form.gastosMensuales)}
          onValueChange={(v) => set('gastosMensuales', desformatearMonto(v))}
          onBlur={() => tocar('gastosMensuales')}
          inputMode='numeric'
          startContent={<span className='text-gray-400 text-sm'>$</span>}
          isInvalid={!!errores.gastosMensuales}
          errorMessage={errores.gastosMensuales}
          isRequired
        />
      </div>

      <div className='flex gap-3 mt-2'>
        {!isLoggedIn && (
          <Button
            variant='flat'
            radius='full'
            onPress={() => dispatch(setPaso(1))}
            startContent={<IconArrowLeft size={16} />}
          >
            Atrás
          </Button>
        )}
        <Button
          color='primary'
          radius='full'
          className='flex-1 font-semibold'
          endContent={<IconArrowRight size={18} />}
          onPress={handleContinuar}
        >
          Continuar
        </Button>
      </div>
    </div>
  );
}
