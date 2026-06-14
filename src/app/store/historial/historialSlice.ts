import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SolicitudHistorial {
  id: string;
  fecha: string;
  numeroDocumento: string;
  monto: string;
  plazoMeses: string;
  cuotaMensual: number;
  totalPagar: number;
  status: 'completada' | 'abandonada';
}

interface HistorialState {
  solicitudes: SolicitudHistorial[];
}

const STORAGE_KEY = 'solicitudes-historial';

const initialState: HistorialState = { solicitudes: [] };

function persistir(state: HistorialState) {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
}

const historialSlice = createSlice({
  name: 'historial',
  initialState,
  reducers: {
    agregarSolicitud: (state, action: PayloadAction<SolicitudHistorial>) => {
      state.solicitudes.push(action.payload);
      persistir(state);
    },
    cargarHistorial: (_, action: PayloadAction<HistorialState>) => action.payload,
    limpiarHistorial: () => {
      if (typeof window !== 'undefined') localStorage.removeItem(STORAGE_KEY);
      return initialState;
    },
  },
});

export const { agregarSolicitud, cargarHistorial, limpiarHistorial } = historialSlice.actions;
export default historialSlice.reducer;
