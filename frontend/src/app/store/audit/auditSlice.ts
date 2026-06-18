import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AuditEvento {
  timestamp: string;
  evento: string;
  detalle?: string;
}

interface AuditState {
  eventos: AuditEvento[];
}

const initialState: AuditState = { eventos: [] };
const AUDIT_KEY = 'solicitud-audit';

const auditSlice = createSlice({
  name: 'audit',
  initialState,
  reducers: {
    registrarEvento: (state, action: PayloadAction<{ evento: string; detalle?: string }>) => {
      state.eventos.push({
        timestamp: new Date().toISOString(),
        evento: action.payload.evento,
        detalle: action.payload.detalle,
      });
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(AUDIT_KEY, JSON.stringify(state.eventos));
        } catch {}
      }
    },
    cargarAudit: (state, action: PayloadAction<AuditEvento[]>) => {
      state.eventos = action.payload;
    },
    limpiarAudit: (state) => {
      state.eventos = [];
      if (typeof window !== 'undefined') localStorage.removeItem(AUDIT_KEY);
    },
  },
});

export const { registrarEvento, cargarAudit, limpiarAudit } = auditSlice.actions;
export default auditSlice.reducer;
