'use client';
import { useState } from 'react';
import { Button, Input, Select, SelectItem, Card, CardBody, addToast } from '@heroui/react';
import { IconCalculator, IconArrowRight, IconArrowLeft, IconCurrencyDollar } from '@tabler/icons-react';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { guardarSimulacion, setPaso, type ResultadoSimulacion } from '@/app/store/solicitud/solicitudSlice';
import { registrarEvento } from '@/app/store/audit/auditSlice';
import { formatearMonto, desformatearMonto } from '@/lib/formato';

const PLAZOS = [12, 24, 36, 48, 60, 72, 84];
const MAX_MONTO = 99_999_999;
const TASA_MENSUAL = 0.018;
const TASA_EA = Math.pow(1 + TASA_MENSUAL, 12) - 1;

function calcularCuota(monto: number, plazo: number): ResultadoSimulacion {
  const i = TASA_MENSUAL;
  const n = plazo;
  const cuotaMensual = monto * (i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
  const totalPagar = cuotaMensual * n;
  return {
    cuotaMensual: Math.round(cuotaMensual),
    tasaEA: Math.round(TASA_EA * 10000) / 100,
    totalPagar: Math.round(totalPagar),
    totalIntereses: Math.round(totalPagar - monto),
  };
}

function formatCOP(n: number) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);
}

export default function StepSimulacion() {
  const dispatch = useAppDispatch();
  const guardado = useAppSelector(s => s.solicitud.simulacion);

  const [monto, setMonto] = useState(guardado.monto);
  const [plazoMeses, setPlazoMeses] = useState(guardado.plazoMeses);
  const [resultado, setResultado] = useState<ResultadoSimulacion | null>(guardado.resultado);
  const [errores, setErrores] = useState<{ monto?: string; plazo?: string }>({});
  const [calculando, setCalculando] = useState(false);


  function validar() {
    const e: { monto?: string; plazo?: string } = {};
    const n = Number(monto);
    if (!monto) e.monto = 'Ingresa el monto';
    else if (n < 1_000_000) e.monto = 'El monto mínimo es $1.000.000';
    else if (n > MAX_MONTO) e.monto = `El monto máximo es ${formatCOP(MAX_MONTO)}`;
    if (!plazoMeses) e.plazo = 'Selecciona el plazo';
    return e;
  }

  async function handleCalcular() {
    const errs = validar();
    if (Object.keys(errs).length) { setErrores(errs); return; }
    setCalculando(true);
    await new Promise(r => setTimeout(r, 600));
    const res = calcularCuota(Number(monto), Number(plazoMeses));
    setResultado(res);
    setCalculando(false);
    dispatch(registrarEvento({ evento: 'SIMULACION_CALCULADA', detalle: `Monto: ${monto}, Plazo: ${plazoMeses}` }));
    addToast({
      title: 'Simulación calculada',
      description: `Cuota mensual estimada: ${formatCOP(res.cuotaMensual)} a ${plazoMeses} meses.`,
      color: 'primary',
    });
  }

  function handleContinuar() {
    if (!resultado) return;
    dispatch(guardarSimulacion({ monto, plazoMeses, resultado }));
  }

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center gap-3 mb-2'>
        <div className='w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0'>
          <IconCalculator size={22} stroke={1.8} />
        </div>
        <div>
          <h2 className='text-lg font-bold text-gray-800 dark:text-gray-100'>Simulación de oferta</h2>
          <p className='text-xs text-gray-500 dark:text-gray-400'>
            Calcula tu cuota antes de continuar · Tasa EA: {(TASA_EA * 100).toFixed(2)}%
          </p>
        </div>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        <Input
          label='Monto a solicitar ($)'
          value={formatearMonto(monto)}
          onValueChange={v => { setMonto(desformatearMonto(v).slice(0, 8)); setResultado(null); setErrores(e => ({ ...e, monto: undefined })); }}
          inputMode='numeric'
          startContent={<IconCurrencyDollar size={16} className='text-gray-400' />}
          isInvalid={!!errores.monto}
          errorMessage={errores.monto}
          description={`Máx. ${formatCOP(MAX_MONTO)}`}
        />
        <Select
          label='Plazo'
          placeholder='Selecciona el plazo'
          selectedKeys={plazoMeses ? new Set([plazoMeses]) : new Set()}
          onSelectionChange={keys => { setPlazoMeses(String(Array.from(keys)[0] ?? '')); setResultado(null); }}
          isInvalid={!!errores.plazo}
          errorMessage={errores.plazo}
        >
          {PLAZOS.map(p => <SelectItem key={String(p)} textValue={`${p} meses`}>{p} meses</SelectItem>)}
        </Select>
      </div>

      <Button
        color='primary' variant='flat' radius='full'
        onPress={handleCalcular} isLoading={calculando}
        startContent={!calculando && <IconCalculator size={16} />}
        className='font-semibold'
      >
        {calculando ? 'Calculando...' : 'Calcular cuota'}
      </Button>

      {resultado && (
        <Card className='border border-primary/20 overflow-hidden'>
          <div className='bg-primary px-5 py-4 flex flex-col items-center'>
            <p className='text-xs text-white/70 font-medium uppercase tracking-widest mb-1'>Cuota mensual estimada</p>
            <p className='text-4xl font-extrabold text-white'>{formatCOP(resultado.cuotaMensual)}</p>
          </div>
          <CardBody className='p-0'>
            <div className='divide-y divide-gray-100 dark:divide-white/10'>
              {[
                { label: 'Monto solicitado', value: formatCOP(Number(monto)) },
                { label: 'Plazo',            value: `${plazoMeses} meses` },
                { label: 'Tasa EA',          value: `${resultado.tasaEA}%` },
                { label: 'Total intereses',  value: formatCOP(resultado.totalIntereses) },
              ].map(({ label, value }) => (
                <div key={label} className='flex justify-between items-center px-5 py-2.5 text-sm'>
                  <span className='text-gray-500 dark:text-gray-400'>{label}</span>
                  <span className='font-semibold text-gray-800 dark:text-gray-100'>{value}</span>
                </div>
              ))}
              <div className='flex justify-between items-center px-5 py-3 bg-primary/5 dark:bg-primary/10'>
                <span className='font-semibold text-gray-700 dark:text-gray-200 text-sm'>Total a pagar</span>
                <span className='font-extrabold text-primary text-base'>{formatCOP(resultado.totalPagar)}</span>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      <div className='flex gap-3 mt-2'>
        <Button variant='flat' radius='full' onPress={() => dispatch(setPaso(2))}
          startContent={<IconArrowLeft size={16} />}>
          Atrás
        </Button>
        <Button
          color='primary' radius='full' className='flex-1 font-semibold'
          endContent={<IconArrowRight size={18} />}
          isDisabled={!resultado}
          onPress={handleContinuar}
        >
          Aceptar oferta
        </Button>
      </div>
    </div>
  );
}
