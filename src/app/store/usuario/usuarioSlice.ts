import { createSlice, PayloadAction, current } from '@reduxjs/toolkit';
import type { TipoDocumento } from '../solicitud/solicitudSlice';

export interface UsuarioPerfil {
  tipoDocumento: TipoDocumento | '';
  numeroDocumento: string;
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
  fechaNacimiento: string;
  direccion: string;
  ciudad: string;
}

interface UsuarioState extends UsuarioPerfil {
  registrados: UsuarioPerfil[];
}

const STORAGE_KEY = 'usuario-perfil';

const initialState: UsuarioState = {
  tipoDocumento: '',
  numeroDocumento: '',
  nombres: '',
  apellidos: '',
  email: '',
  telefono: '',
  fechaNacimiento: '',
  direccion: '',
  ciudad: '',
  registrados: [],
};

function persistir(state: UsuarioState) {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(current(state))); } catch {}
}

const usuarioSlice = createSlice({
  name: 'usuario',
  initialState,
  reducers: {
    guardarPerfil: (state, action: PayloadAction<UsuarioPerfil>) => {
      const idx = state.registrados.findIndex(
        r => r.numeroDocumento === action.payload.numeroDocumento,
      );
      if (idx >= 0) {
        state.registrados[idx] = { ...action.payload };
      } else {
        state.registrados.push({ ...action.payload });
      }
      Object.assign(state, action.payload);
      persistir(state);
    },
    cargarPerfil: (state, action: PayloadAction<Partial<UsuarioState>>) => {
      Object.assign(state, action.payload);
    },
    cerrarSesion: (state) => {
      // Clear active profile but keep the registrados list intact
      const registrados = current(state).registrados;
      Object.assign(state, { ...initialState, registrados });
      persistir(state);
    },
    darseDeBaja: (state) => {
      // Remove user from registrados and clear active profile
      const registrados = current(state).registrados.filter(
        r => r.numeroDocumento !== state.numeroDocumento,
      );
      Object.assign(state, { ...initialState, registrados });
      persistir(state);
    },
    limpiarPerfil: () => {
      if (typeof window !== 'undefined') localStorage.removeItem(STORAGE_KEY);
      return initialState;
    },
  },
});

export const {
  guardarPerfil, cargarPerfil, cerrarSesion, darseDeBaja, limpiarPerfil,
} = usuarioSlice.actions;
export default usuarioSlice.reducer;
