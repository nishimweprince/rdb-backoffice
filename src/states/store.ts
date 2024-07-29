import { configureStore } from '@reduxjs/toolkit';
import userSlice from './features/userSlice';
import authApiSlice from './api/authApiSlice';
import sidebarSlice from './features/sidebarSlice';
import businessRegApiSlice from './api/businessRegApiSlice';
import businessSlice from './features/businessSlice';

export const store = configureStore({
  reducer: {
    [authApiSlice.reducerPath]: authApiSlice.reducer,
    [businessRegApiSlice.reducerPath]: businessRegApiSlice.reducer,
    user: userSlice,
    sidebar: sidebarSlice,
    business: businessSlice,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(
      authApiSlice.middleware,
      businessRegApiSlice.middleware
    );
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
