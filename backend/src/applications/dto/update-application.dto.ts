export class UpdateApplicationDto {
  pasoActual?: number;
  datosPersonales?: {
    nombres?: string;
    apellidos?: string;
    email?: string;
    telefono?: string;
    fechaNacimiento?: string;
    direccion?: string;
    ciudad?: string;
  };
  datosFinancieros?: {
    ingresos?: number;
    gastos?: number;
    activos?: number;
    pasivos?: number;
  };
  simulacion?: {
    monto: number;
    plazoMeses: number;
    resultado: {
      cuotaMensual: number;
      tasaEA: number;
      totalPagar: number;
      totalIntereses: number;
    };
  };
  autorizaciones?: {
    habeasData?: boolean;
    terminosCondiciones?: boolean;
    consultaCentrales?: boolean;
  };
}
