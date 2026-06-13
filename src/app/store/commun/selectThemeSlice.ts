import { createSlice } from '@reduxjs/toolkit';

export interface ThemeState {
  themeSelected: string | null;
}

const initialState: ThemeState = {
  themeSelected: 'light',
};

const selectThemeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemeSlice: (state, action) => {
      state.themeSelected = action.payload;
      const theme = state.themeSelected;
      localStorage.setItem('selectedTheme', JSON.stringify(theme));
    },
  },
});

export const { setThemeSlice } = selectThemeSlice.actions;
export default selectThemeSlice.reducer;
