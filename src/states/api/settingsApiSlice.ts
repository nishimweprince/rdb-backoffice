import { createApi } from '@reduxjs/toolkit/query/react';
import { businessBaseQueryWithReauth } from './rootApiSlice';

export const settingsApiSlices = createApi({
  reducerPath: 'settingsQueryApi',
  baseQuery: businessBaseQueryWithReauth,
  endpoints: (builder) => {
    return {
      // SEARCH BUSINESSES
      fetchRegistrarGeneral: builder.query({
        query: ({ type, page, size }) => {
          return {
            url: `/certificate-parameter/all?type=${type}&page=${page}&size=${size}`,
            method: 'GET'
          };
        },
      }),

      // CREATE REGISTRAR GENERAL
      addRegistrarGeneral: builder.mutation({
        query: (body) => {
          return {
            url: '/certificate-parameter/create',
            method: 'POST',
            body,
          };
        },
      }),
      

    // UPLOAD REGISTRAR GENERAL SIGNATURE
    uploadRegistrarGeneralSignature: builder.mutation({
      query: ({id, formData}) => {
        return {
          url: `/certificate-parameter/upload-signature/${id}`,
          method: 'POST',
          body: formData,
          formData: true,
        };
      },
    }),

    inactiveOrActiveRegistrarGeneral: builder.mutation({
      query: ({ id, action }) => {
        return {
          url: `/certificate-parameter/${action}/${id}`,
          method: 'PUT',
        };
      },
    }),

    deleteRegistrarGeneral: builder.mutation({
      query: (id) => {
        return {
          url: `/certificate-parameter/${id}`,
          method: 'DELETE',
        };
      }
    }),

    };
  },
});

export const {
  useLazyFetchRegistrarGeneralQuery,
  useAddRegistrarGeneralMutation,
  useUploadRegistrarGeneralSignatureMutation,
  useInactiveOrActiveRegistrarGeneralMutation,
  useDeleteRegistrarGeneralMutation
} = settingsApiSlices;

export default settingsApiSlices;
