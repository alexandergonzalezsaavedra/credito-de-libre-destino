import { createSlice, PayloadAction, current } from '@reduxjs/toolkit';
import type { UsuarioPerfil } from '../usuario/usuarioSlice';
import type { DatosPersonales, DatosFinancieros, Simulacion } from '../solicitud/solicitudSlice';

export interface SolicitudSesion {
  id: string;
  fecha: string;             // ISO — cuándo se creó la solicitud
  paso: number;              // último paso alcanzado (1-5)
  status: 'en-progreso' | 'completada' | 'abandonada';
  tipoDocumento: string;
  numeroDocumento: string;
  // Datos del crédito (disponibles a partir del paso 3)
  monto?: string;
  plazoMeses?: string;
  cuotaMensual?: number;
  totalPagar?: number;
  tasaEA?: number;
  // Datos completos para modal de detalle y reanudar solicitud
  datosPersonales?: DatosPersonales;
  datosFinancieros?: DatosFinancieros;
  simulacion?: Simulacion;
}

export interface SesionUsuario {
  usuario: UsuarioPerfil;
  solicitudes: SolicitudSesion[];
}

export interface SesionesState {
  sesiones: SesionUsuario[];
}

const initialState: SesionesState = { sesiones: [] };

const STORAGE_KEY = 'sesionesUsuario';

function persistir(state: SesionesState) {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(current(state))); } catch {}
}

const sesionesSlice = createSlice({
  name: 'sesiones',
  initialState,
  reducers: {
    // Crea o actualiza la entrada de un usuario en sesiones
    registrarSesionUsuario(state, action: PayloadAction<UsuarioPerfil>) {
      const perfil = action.payload;
      const idx = state.sesiones.findIndex(
        s => s.usuario.numeroDocumento === perfil.numeroDocumento,
      );
      if (idx === -1) {
        state.sesiones.push({ usuario: { ...perfil }, solicitudes: [] });
      } else {
        state.sesiones[idx].usuario = { ...perfil };
      }
      persistir(state);
    },

    // Elimina un usuario y todas sus solicitudes
    eliminarSesionUsuario(state, action: PayloadAction<string>) {
      state.sesiones = state.sesiones.filter(
        s => s.usuario.numeroDocumento !== action.payload,
      );
      persistir(state);
    },

    // Guarda o actualiza una solicitud dentro de la sesión del usuario.
    // Si la sesión no existe aún, la crea automáticamente con los datos del usuario.
    guardarSolicitudEnSesion(
      state,
      action: PayloadAction<{ usuario: UsuarioPerfil; solicitud: SolicitudSesion }>,
    ) {
      const { usuario, solicitud } = action.payload;
      let sesionIdx = state.sesiones.findIndex(
        s => s.usuario.numeroDocumento === usuario.numeroDocumento,
      );
      if (sesionIdx === -1) {
        state.sesiones.push({ usuario: { ...usuario }, solicitudes: [] });
        sesionIdx = state.sesiones.length - 1;
      } else {
        state.sesiones[sesionIdx].usuario = { ...usuario };
      }
      const solIdx = state.sesiones[sesionIdx].solicitudes.findIndex(
        s => s.id === solicitud.id,
      );
      if (solIdx === -1) {
        state.sesiones[sesionIdx].solicitudes.push({ ...solicitud });
      } else {
        state.sesiones[sesionIdx].solicitudes[solIdx] = { ...solicitud };
      }
      persistir(state);
    },
  },
});

export const {
  registrarSesionUsuario,
  eliminarSesionUsuario,
  guardarSolicitudEnSesion,
} = sesionesSlice.actions;

export default sesionesSlice.reducer;
