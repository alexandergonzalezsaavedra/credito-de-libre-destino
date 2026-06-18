export type ApplicationStatus = 'en_proceso' | 'completada' | 'abandonada';

export const PLAZOS_VALIDOS = [12, 24, 36, 48, 60, 72, 84] as const;
export const MONTO_MIN = 1_000_000;
export const MONTO_MAX = 99_999_999;
export const TASA_MENSUAL = 0.018;

export interface ApplicationEvent {
  tipo: string;
  timestamp: string;
  datos?: Record<string, unknown>;
}

export interface SimulacionResultado {
  cuotaMensual: number;
  tasaEA: number;
  totalPagar: number;
  totalIntereses: number;
}

export interface Application {
  id: string;
  userId: string;
  status: ApplicationStatus;
  pasoActual: number;
  identidad: {
    tipoDocumento: string;
    numeroDocumento: string;
  };
  datosPersonales?: {
    nombres: string;
    apellidos: string;
    email: string;
    telefono: string;
    fechaNacimiento: string;
    direccion: string;
    ciudad: string;
  };
  datosFinancieros?: {
    ingresos: number;
    gastos: number;
    activos?: number;
    pasivos?: number;
  };
  simulacion?: {
    monto: number;
    plazoMeses: number;
    resultado: SimulacionResultado;
  };
  autorizaciones?: {
    habeasData: boolean;
    terminosCondiciones: boolean;
    consultaCentrales: boolean;
  };
  creadoEn: string;
  actualizadoEn: string;
  eventos: ApplicationEvent[];
}
