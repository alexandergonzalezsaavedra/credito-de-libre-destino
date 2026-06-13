'use client';
import { HeroUIProvider, ToastProvider } from '@heroui/react';
import { Provider } from 'react-redux';
import { store } from './store';
import { useEffect } from 'react';
import { setThemeSlice } from './store/commun/selectThemeSlice';

export function ProvidersUI({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Precarga seleccion de Tema
    try {
      const themeSelectedStr = localStorage.getItem('themeSelected');
      if (themeSelectedStr) {
        const themeSelected = JSON.parse(themeSelectedStr);
        store.dispatch(setThemeSlice(themeSelected));
      } else {
        store.dispatch(setThemeSlice('light'));
      }
    } catch (error) {
      console.error('Error loading theme from localStorage:', error);
      store.dispatch(setThemeSlice('light'));
    }
  }, []);

  return (
    <Provider store={store}>
      <HeroUIProvider>
        <ToastProvider placement='bottom-center' />
        {children}
      </HeroUIProvider>
    </Provider>
  );
}
