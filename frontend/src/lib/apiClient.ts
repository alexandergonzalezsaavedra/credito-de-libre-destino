const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(
      (body as { message?: string }).message ?? `HTTP ${res.status}`,
    );
  }
  return res.json() as Promise<T>;
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};

export interface BackendApplication {
  id: string;
  userId: string;
  status: 'en_proceso' | 'completada' | 'abandonada';
  pasoActual: number;
}

export const applicationsApi = {
  create: (data: {
    identidad: { tipoDocumento: string; numeroDocumento: string };
    datosPersonales?: {
      nombres: string; apellidos: string; email: string;
      telefono: string; fechaNacimiento: string; direccion: string; ciudad: string;
    };
  }) => apiClient.post<BackendApplication>('/applications', data),

  update: (id: string, data: Record<string, unknown>) =>
    apiClient.patch<BackendApplication>(`/applications/${id}`, data),

  simulateOffer: (id: string, monto: number, plazoMeses: number) =>
    apiClient.post<BackendApplication>(`/applications/${id}/simulate-offer`, {
      monto,
      plazoMeses,
    }),

  finalize: (id: string, autorizaciones: {
    habeasData: boolean; terminosCondiciones: boolean; consultaCentrales: boolean;
  }) =>
    apiClient.post<BackendApplication>(`/applications/${id}/finalize`, {
      autorizaciones,
    }),

  abandon: (id: string, motivo?: string) =>
    apiClient.post<BackendApplication>(`/applications/${id}/abandon`, {
      motivo,
    }),
};
