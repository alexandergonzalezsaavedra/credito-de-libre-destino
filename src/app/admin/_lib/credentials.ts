export const ADMIN_CREDENTIALS = {
  usuario: 'admin',
  contrasena: 'admin2026',
} as const;

export const SESSION_KEY = 'admin-session';
export const SESSION_TOKEN = 'authenticated';

export function isAdminAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(SESSION_KEY) === SESSION_TOKEN;
}

export function loginAdmin(): void {
  localStorage.setItem(SESSION_KEY, SESSION_TOKEN);
}

export function logoutAdmin(): void {
  localStorage.removeItem(SESSION_KEY);
}
