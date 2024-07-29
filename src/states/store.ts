import { configureStore } from '@reduxjs/toolkit';
import userSlice from './features/userSlice';
import authApiSlice from './api/authApiSlice';
import sidebarSlice from './features/sidebarSlice';

export const store = configureStore({
  reducer: {
    [authApiSlice.reducerPath]: authApiSlice.reducer,
    user: userSlice,
    sidebar: sidebarSlice,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(authApiSlice.middleware);
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
