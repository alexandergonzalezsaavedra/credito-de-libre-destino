import type { ResultadoSimulacion } from './store';

const TASA_MENSUAL = 0.018;
const TASA_EA = Math.pow(1 + TASA_MENSUAL, 12) - 1;

export const PLAZOS_VALIDOS = [12, 24, 36, 48, 60, 72, 84];
export const MONTO_MIN = 1_000_000;
export const MONTO_MAX = 99_999_999;

export function calcularCuota(monto: number, plazoMeses: number): ResultadoSimulacion {
  const i = TASA_MENSUAL;
  const n = plazoMeses;
  const cuotaMensual = (monto * (i * Math.pow(1 + i, n))) / (Math.pow(1 + i, n) - 1);
  const totalPagar = cuotaMensual * n;
  return {
    cuotaMensual: Math.round(cuotaMensual),
    tasaEA: Math.round(TASA_EA * 10000) / 100,
    totalPagar: Math.round(totalPagar),
    totalIntereses: Math.round(totalPagar - monto),
  };
}
