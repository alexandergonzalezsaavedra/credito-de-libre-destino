/** Muestra dígitos crudos con separadores de miles colombianos: "1300000" → "1.300.000" */
export function formatearMonto(raw: string): string {
  if (!raw) return '';
  const num = parseInt(raw, 10);
  return isNaN(num) ? '' : num.toLocaleString('es-CO');
}

/** Quita los separadores para obtener solo dígitos: "1.300.000" → "1300000" */
export function desformatearMonto(formateado: string): string {
  return formateado.replace(/\./g, '').replace(/,/g, '').replace(/\D/g, '');
}
