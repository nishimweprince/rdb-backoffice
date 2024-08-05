import { createApi } from '@reduxjs/toolkit/query/react';
import { businessBaseQueryWithReauth } from './rootApiSlice';

export const businessRegApiSlice = createApi({
  reducerPath: 'businessRegistrationApi',
  baseQuery: businessBaseQueryWithReauth,
  endpoints: (builder) => {
    return {
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

      // CREATE NAVIGATION FLOW
      createNavigationFlow: builder.mutation({
        query: ({ businessId, massId, isActive }) => {
          return {
            url: `/navigation-flow`,
            method: 'POST',
            body: {
              businessId,
              massId,
              isActive,
            },
          };
        },
      }),

      // COMPLETE NAVIGATION FLOW
      completeNavigationFlow: builder.mutation({
        query: ({ isCompleted = true, navigationFlowId }) => {
          return {
            url: `/navigation-flow/complete`,
            method: 'POST',
            body: {
              isCompleted,
              navigationFlowId,
            },
          };
        },
      }),

      // CREATE BUSINESS REVIEW COMMENT
      createBusinessReviewComment: builder.mutation({
        query: ({ navigationFlowId, comment }) => {
          return {
            url: `/review-comments`,
            method: 'POST',
            body: {
              navigationFlowId,
              comment,
            },
          };
        },
      }),

      // DELETE BUSINESS REVIEW COMMENT
      deleteBusinessReviewComment: builder.mutation({
        query: ({ id }) => {
          return {
            url: `/review-comments/${id}`,
            method: 'DELETE',
          };
        },
      }),
    };
  },
});

export const {
  useUpdateBusinessMutation,
  useCreateNavigationFlowMutation,
  useCompleteNavigationFlowMutation,
  useCreateBusinessReviewCommentMutation,
  useDeleteBusinessReviewCommentMutation
} = businessRegApiSlice;

export default businessRegApiSlice;
