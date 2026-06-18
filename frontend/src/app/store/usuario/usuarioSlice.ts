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

// UsuarioState = sesión activa en pantalla; la lista de todos los registrados
// vive ahora en sesionesSlice (sesionesUsuario en localStorage).
export type UsuarioState = UsuarioPerfil;

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
};

function persistir(state: UsuarioState) {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(current(state))); } catch {}
}

const usuarioSlice = createSlice({
  name: 'usuario',
  initialState,
  reducers: {
    // Guarda el perfil activo en la sesión (persiste en localStorage)
    guardarPerfil: (state, action: PayloadAction<UsuarioPerfil>) => {
      Object.assign(state, action.payload);
      persistir(state);
    },
    // Carga datos en pantalla sin persistir (para autocompletar formularios)
    cargarPerfil: (state, action: PayloadAction<Partial<UsuarioState>>) => {
      Object.assign(state, action.payload);
    },
    // Cierra la sesión activa; la lista en sesionesSlice permanece intacta
    cerrarSesion: () => {
      if (typeof window !== 'undefined') localStorage.removeItem(STORAGE_KEY);
      return initialState;
    },
    // Elimina la sesión activa (sesionesSlice borra al usuario de la lista)
    darseDeBaja: () => {
      if (typeof window !== 'undefined') localStorage.removeItem(STORAGE_KEY);
      return initialState;
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
