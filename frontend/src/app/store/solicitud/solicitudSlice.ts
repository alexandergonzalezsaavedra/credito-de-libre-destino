import { createSlice, PayloadAction, current } from '@reduxjs/toolkit';

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
  otrosIngresos: string;
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

export type TipoDocumento = 'CC' | 'CE' | 'PA' | 'TI';

export interface Identidad {
  tipoDocumento: TipoDocumento | '';
  numeroDocumento: string;
  validado: boolean;
}

export interface Utms {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_term: string;
  utm_content: string;
}

export interface SolicitudState {
  id: string | null;
  backendId: string | null;  // ID generado por el backend NestJS
  creadoEn: string | null;   // ISO — fecha de inicio de la solicitud
  pasoActual: number;
  status: 'idle' | 'en_proceso' | 'completada' | 'abandonada';
  identidad: Identidad;
  datosPersonales: DatosPersonales;
  datosFinancieros: DatosFinancieros;
  simulacion: Simulacion;
  autorizaciones: Autorizaciones;
  utms: Utms;
}

const initialState: SolicitudState = {
  id: null,
  backendId: null,
  creadoEn: null,
  pasoActual: 0,
  status: 'idle',
  identidad: { tipoDocumento: '', numeroDocumento: '', validado: false },
  datosPersonales: {
    nombres: '', apellidos: '', fechaNacimiento: '',
    email: '', telefono: '', direccion: '', ciudad: '',
  },
  datosFinancieros: {
    tipoEmpleo: '', empresa: '',
    ingresoMensual: '', otrosIngresos: '', gastosMensuales: '',
  },
  simulacion: { monto: '', plazoMeses: '', resultado: null },
  autorizaciones: { habeasData: false, terminosCondiciones: false, consultaCentrales: false },
  utms: { utm_source: '', utm_medium: '', utm_campaign: '', utm_term: '', utm_content: '' },
};

const STORAGE_KEY = 'solicitud-draft';

function persistir(draft: SolicitudState) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current(draft)));
  } catch {}
}

const solicitudSlice = createSlice({
  name: 'solicitud',
  initialState,
  reducers: {
    iniciarSolicitud: (state, action: PayloadAction<{ identidad: Identidad; utms: Utms }>) => {
      state.id = `SOL-${Date.now()}`;
      state.creadoEn = new Date().toISOString();
      state.pasoActual = 1;
      state.status = 'en_proceso';
      state.identidad = { ...action.payload.identidad, validado: true };
      state.utms = action.payload.utms;
      persistir(state);
    },
    setPaso: (state, action: PayloadAction<number>) => {
      state.pasoActual = action.payload;
      persistir(state);
    },
    guardarDatosPersonales: (state, action: PayloadAction<DatosPersonales>) => {
      state.datosPersonales = action.payload;
      state.pasoActual = 2;
      persistir(state);
    },
    guardarDatosFinancieros: (state, action: PayloadAction<DatosFinancieros>) => {
      state.datosFinancieros = action.payload;
      state.pasoActual = 3;
      persistir(state);
    },
    guardarSimulacion: (state, action: PayloadAction<Simulacion>) => {
      state.simulacion = action.payload;
      state.pasoActual = 4;
      persistir(state);
    },
    guardarAutorizaciones: (state, action: PayloadAction<Autorizaciones>) => {
      state.autorizaciones = action.payload;
      state.pasoActual = 5;
      persistir(state);
    },
    confirmarSolicitud: (state) => {
      state.status = 'completada';
      persistir(state);
    },
    abandonarSolicitud: (state) => {
      state.status = 'abandonada';
      persistir(state);
    },
    cargarBorrador: (_, action: PayloadAction<SolicitudState>) => action.payload,
    // Reanuda una solicitud guardada en sesionesUsuario (viene del historial)
    reanudarSolicitud: (state, action: PayloadAction<{
      id: string;
      creadoEn: string;
      paso: number;
      tipoDocumento: string;
      numeroDocumento: string;
      datosPersonales?: DatosPersonales;
      datosFinancieros?: DatosFinancieros;
      simulacion?: Simulacion;
    }>) => {
      const p = action.payload;
      state.id = p.id;
      state.creadoEn = p.creadoEn;
      state.pasoActual = p.paso;
      state.status = 'en_proceso';
      state.identidad = { tipoDocumento: p.tipoDocumento as TipoDocumento, numeroDocumento: p.numeroDocumento, validado: true };
      if (p.datosPersonales) state.datosPersonales = p.datosPersonales;
      if (p.datosFinancieros) state.datosFinancieros = p.datosFinancieros;
      if (p.simulacion) state.simulacion = p.simulacion;
      persistir(state);
    },
    setBackendId: (state, action: PayloadAction<string>) => {
      state.backendId = action.payload;
      persistir(state);
    },
    limpiarSolicitud: () => {
      if (typeof window !== 'undefined') localStorage.removeItem(STORAGE_KEY);
      return initialState;
    },
  },
});

export const {
  iniciarSolicitud, setPaso,
  guardarDatosPersonales, guardarDatosFinancieros,
  guardarSimulacion, guardarAutorizaciones,
  confirmarSolicitud, abandonarSolicitud,
  cargarBorrador, reanudarSolicitud, limpiarSolicitud,
  setBackendId,
} = solicitudSlice.actions;

export default solicitudSlice.reducer;
