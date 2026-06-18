import { configureStore } from '@reduxjs/toolkit';
import selectThemeReducer from './commun/selectThemeSlice';

export const store = configureStore({
  reducer: {
    theme: selectThemeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
