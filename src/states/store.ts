import { configureStore } from '@reduxjs/toolkit';
import userSlice from './features/userSlice';
import authApiSlice from './api/authApiSlice';
import sidebarSlice from './features/sidebarSlice';
import businessRegApiSlice from './api/businessRegApiSlice';
import businessSlice from './features/businessSlice';
import businessRegQueryApiSlice from './api/businessRegQueryApiSlice';
import navigationFlowSlice from './features/navigationFlowSlice';
import boardOfDirectorsSlice from './features/boardOfDirectorsSlice';
import businessPeopleSlice from './features/businessPeopleSlice';
import executiveManagementSlice from './features/executiveManagementSlice';
import founderDetailSlice from './features/founderDetailSlice';
import businessActivitiesSlice from './features/businessActivitiesSlice';

export const store = configureStore({
  reducer: {
    [authApiSlice.reducerPath]: authApiSlice.reducer,
    [businessRegApiSlice.reducerPath]: businessRegApiSlice.reducer,
    [businessRegQueryApiSlice.reducerPath]: businessRegQueryApiSlice.reducer,
    user: userSlice,
    sidebar: sidebarSlice,
    business: businessSlice,
    navigationFlow: navigationFlowSlice,
    boardOfDirectors: boardOfDirectorsSlice,
    businessPeople: businessPeopleSlice,
    executiveManagement: executiveManagementSlice,
    founderDetail: founderDetailSlice,
    businessActivities: businessActivitiesSlice,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(
      authApiSlice.middleware,
      businessRegApiSlice.middleware,
      businessRegQueryApiSlice.middleware
    );
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
