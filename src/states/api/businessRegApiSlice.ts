import { createApi } from '@reduxjs/toolkit/query/react';
import { businessBaseQueryWithReauth } from './rootApiSlice';

export const businessRegApiSlice = createApi({
  reducerPath: 'businessRegistrationApi',
  baseQuery: businessBaseQueryWithReauth,
  endpoints: (builder) => {
    return {
      // SEARCH BUSINESSES
      searchBusinesses: builder.query({
        query: ({ type, companyName, tin, page, size }) => {
          return {
            url: `/search?companyName=${companyName}&tin=${tin}&type=${type}&page=${page}&size=${size}`,
          };
        },
      }),

      // FETCH BUSINESSES
      fetchBusinesses: builder.query({
        query: ({ page, size, applicationStatus, serviceId }) => {
          let url = `/back-office?page=${page}&size=${size}`;
          if (applicationStatus) {
            url += `&applicationStatus=${applicationStatus}`;
          }
          if (serviceId) {
            url += `&serviceId=${serviceId}`;
          }
          return {
            url,
          };
        },
      }),

      // UPDATE BUSINESS
      updateBusiness: builder.mutation({
        query: ({ businessId, applicationStatus }) => {
          return {
            url: `/?businessId=${businessId}`,
            method: 'PATCH',
            body: {
              applicationStatus,
            },
          };
        },
      }),
    };
  },
});

export const {
  useSearchBusinessesQuery,
  useFetchBusinessesQuery,
  useUpdateBusinessMutation,
} = businessRegApiSlice;

export default businessRegApiSlice;
