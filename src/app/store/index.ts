import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import themeReducer from './commun/selectThemeSlice';
import solicitudReducer from './solicitud/solicitudSlice';
import auditReducer from './audit/auditSlice';
import usuarioReducer from './usuario/usuarioSlice';
import sesionesReducer from './sesiones/sesionesSlice';

const rootReducer = combineReducers({
  themeSlected: themeReducer,
  solicitud:    solicitudReducer,
  audit:        auditReducer,
  usuario:      usuarioReducer,
  sesiones:     sesionesReducer,
});

type PreloadedAppState = Partial<ReturnType<typeof rootReducer>>;

function leerLocalStorage(): PreloadedAppState {
  if (typeof window === 'undefined') return {};
  const estado: PreloadedAppState = {};

  // Sesión activa del usuario
  try {
    const raw = localStorage.getItem('usuario-perfil');
    if (raw) estado.usuario = JSON.parse(raw);
  } catch {}

  // Lista unificada de usuarios con sus solicitudes
  try {
    const raw = localStorage.getItem('sesionesUsuario');
    if (raw) estado.sesiones = JSON.parse(raw);
  } catch {}

  // Borrador de solicitud en curso
  try {
    const raw = localStorage.getItem('solicitud-draft');
    if (raw) estado.solicitud = JSON.parse(raw);
  } catch {}

  // Audit — el slice guarda SOLO el array, no el objeto { eventos }
  try {
    const raw = localStorage.getItem('solicitud-audit');
    if (raw) {
      const parsed = JSON.parse(raw);
      estado.audit = { eventos: Array.isArray(parsed) ? parsed : [] };
    }
  } catch {}

  return estado;
}

export const store = configureStore({
  reducer: rootReducer,
  preloadedState: leerLocalStorage(),
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
