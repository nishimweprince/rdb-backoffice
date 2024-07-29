import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';
import store from 'store';
import { businessRegApi } from '../../constants/environments.constants';
import { setToken, setUser } from '../features/userSlice';
import { toast } from 'react-toastify';

const prepareHeaders = (headers: Headers) => {
  const user = store.get('user');
  if (user) {
    headers.set('authorization', `Bearer ${user.token}`);
  }
  return headers;
};

// BUSINESS REG BASE QUERY
export const businessRegBaseQuery = fetchBaseQuery({
  baseUrl: `${businessRegApi}`,
  prepareHeaders,
});

// BUSINESS REG BASE QUERY WITH REAUTH
export const businessBaseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await businessRegBaseQuery(args, api, extraOptions);
  if (result.error) {
    if ([403, 401].includes(Number(result?.error?.status))) {
      api.dispatch(setToken(''));
      api.dispatch(setUser({}));
      window.location.href = '/auth/login';
    } else if (Number(result?.error?.status) === 500) {
      toast.error('An error occurred. Please try again later.');
    }
  }

  return result;
};
