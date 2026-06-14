'use client';
import { HeroUIProvider, ToastProvider } from '@heroui/react';
import { Provider } from 'react-redux';
import { store } from './store';
import { useEffect } from 'react';
import { setThemeSlice } from './store/commun/selectThemeSlice';

export function ProvidersUI({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Theme is not in localStorage slice format — load it separately
    try {
      const themeStr = localStorage.getItem('themeSelected');
      store.dispatch(setThemeSlice(themeStr ? JSON.parse(themeStr) : 'light'));
    } catch {
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
