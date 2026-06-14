import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import themeReducer from './commun/selectThemeSlice';
import solicitudReducer from './solicitud/solicitudSlice';
import auditReducer from './audit/auditSlice';
import usuarioReducer from './usuario/usuarioSlice';
import historialReducer from './historial/historialSlice';

type PreloadedAppState = Partial<{
  themeSlected: ReturnType<typeof themeReducer>;
  solicitud:    ReturnType<typeof solicitudReducer>;
  audit:        ReturnType<typeof auditReducer>;
  usuario:      ReturnType<typeof usuarioReducer>;
  historial:    ReturnType<typeof historialReducer>;
}>;

function leerLocalStorage(): PreloadedAppState {
  if (typeof window === 'undefined') return {};
  const estado: PreloadedAppState = {};

  // usuario-perfil → persistir guarda el objeto completo UsuarioState
  try {
    const raw = localStorage.getItem('usuario-perfil');
    if (raw) estado.usuario = JSON.parse(raw);
  } catch {}

  // solicitudes-historial → persistir guarda { solicitudes: [] }
  try {
    const raw = localStorage.getItem('solicitudes-historial');
    if (raw) estado.historial = JSON.parse(raw);
  } catch {}

  // solicitud-draft → el slice persiste su estado completo
  try {
    const raw = localStorage.getItem('solicitud-draft');
    if (raw) estado.solicitud = JSON.parse(raw);
  } catch {}

  // solicitud-audit → el slice guarda SOLO el array de eventos (no el objeto { eventos })
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
  reducer: {
    themeSlected: themeReducer,
    solicitud: solicitudReducer,
    audit: auditReducer,
    usuario: usuarioReducer,
    historial: historialReducer,
  },
  preloadedState: leerLocalStorage(),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
