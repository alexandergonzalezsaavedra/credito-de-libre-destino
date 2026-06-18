// In-memory store — persiste en memoria del proceso Node.js (se limpia al reiniciar el servidor)

export interface ApplicationEvent {
  id: string;
  applicationId: string;
  evento: string;
  detalle?: string;
  timestamp: string;
}

export interface Identidad {
  tipoDocumento: string;
  numeroDocumento: string;
  validado: boolean;
}

export interface DatosPersonales {
  nombres: string;
  apellidos: string;
  fechaNacimiento: string;
  email: string;
  telefono: string;
  direccion: string;
  ciudad: string;
}

export interface DatosFinancieros {
  tipoEmpleo: string;
  empresa: string;
  ingresoMensual: string;
  otrosIngresos?: string;
  gastosMensuales: string;
}

export interface ResultadoSimulacion {
  cuotaMensual: number;
  tasaEA: number;
  totalPagar: number;
  totalIntereses: number;
}

export interface Simulacion {
  monto: string;
  plazoMeses: string;
  resultado: ResultadoSimulacion | null;
}

export interface Autorizaciones {
  habeasData: boolean;
  terminosCondiciones: boolean;
  consultaCentrales: boolean;
}

export type ApplicationStatus = 'en_proceso' | 'completada' | 'abandonada';

export interface Application {
  id: string;
  creadoEn: string;
  actualizadoEn: string;
  pasoActual: number;
  status: ApplicationStatus;
  identidad: Identidad;
  datosPersonales?: DatosPersonales;
  datosFinancieros?: DatosFinancieros;
  simulacion?: Simulacion;
  autorizaciones?: Autorizaciones;
  utms?: Record<string, string>;
}

// Módulo singleton — una sola instancia por proceso
const applications = new Map<string, Application>();
const events = new Map<string, ApplicationEvent[]>();

export function getApplications(): Application[] {
  return Array.from(applications.values());
}

export function getApplication(id: string): Application | undefined {
  return applications.get(id);
}

export function saveApplication(app: Application): Application {
  applications.set(app.id, app);
  return app;
}

export function getEvents(applicationId: string): ApplicationEvent[] {
  return events.get(applicationId) ?? [];
}

export function addEvent(
  applicationId: string,
  evento: string,
  detalle?: string,
): ApplicationEvent {
  const event: ApplicationEvent = {
    id: `EVT-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    applicationId,
    evento,
    detalle,
    timestamp: new Date().toISOString(),
  };
  const list = events.get(applicationId) ?? [];
  list.push(event);
  events.set(applicationId, list);
  return event;
}
