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

      // UPDATE BUSINESS REVIEW COMMENT
      updateBusinessReviewComment: builder.mutation({
        query: ({ id, comment }) => {
          return {
            url: `/review-comments/${id}`,
            method: 'PATCH',
            body: {
              comment,
            },
          };
        },
      }),

      // UPDATE BUSINESS REVIEW COMMENT STATUS
      updateBusinessReviewCommentStatus: builder.mutation({
        query: ({ id, status }) => {
          return {
            url: `/review-comments/${id}/status`,
            method: 'PATCH',
            body: {
              status,
            },
          };
        },
      }),

      // REQUEST BUSINESS APPROVER
      requestBusinessApprover: builder.mutation({
        query: ({ businessId }) => {
          return {
            url: `/back-office/request-approval?businessId=${businessId}`,
            method: 'PATCH',
          };
        },
      }),

      // CREATE AMENDMENT REVIEW COMMENT
      createAmendmentReviewComment: builder.mutation({
        query: ({ amendmentDetailId, comment, status = 'UNRESOLVED' }) => {
          return {
            url: `/review-comments/amendment`,
            method: 'POST',
            body: {
              amendmentDetailId,
              comment,
              status,
            },
          };
        },
      }),

      // UPDATE AMENDMENT REVIEW COMMENT
      updateAmendmentReviewComment: builder.mutation({
        query: ({ id, comment }) => {
          return {
            url: `/review-comments/amendment/${id}`,
            method: 'PATCH',
            body: {
              comment,
            },
          };
        },
      }),

      // UPDATE AMENDMENT REVIEW COMMENT STATUS
      updateAmendmentReviewCommentStatus: builder.mutation({
        query: ({ id, status }) => {
          return {
            url: `/review-comments/amendment/${id}/status`,
            method: 'PATCH',
            body: {
              status,
            },
          };
        },
      }),

      // DELETE AMENDMENT REVIEW COMMENT
      deleteAmendmentReviewComment: builder.mutation({
        query: ({ id }) => {
          return {
            url: `/review-comments/amendment/${id}`,
            method: 'DELETE',
          };
        },
      }),

      // UPDATE BUSINESS AMENDMENT
      updateBusinessAmendmentStatus: builder.mutation({
        query: ({ id, amendmentStatus }) => {
          return {
            url: `/amendment/${id}`,
            method: 'PATCH',
            body: {
              amendmentStatus,
            },
          };
        },
      }),

      // RECOMMEND AMENDMENT FOR APPROVAL
      recommendAmendmentForApproval: builder.mutation({
        query: ({ amendmentId }) => {
          return {
            url: `/back-office/request-amendment-approval?amendmentId=${amendmentId}`,
            method: 'PATCH',
          };
        },
      }),

      // APPROVE AMENDMENT
      approveAmendment: builder.mutation({
        query: ({ amendmentId }) => {
          return {
            url: `/back-office/approve-amendment?amendmentId=${amendmentId}`,
            method: 'PATCH',
          };
        },
      }),

      // REJECT AMENDMENT
      rejectAmendment: builder.mutation({
        query: ({ amendmentId, entityId }) => {
          return {
            url: `/back-office/reject-amendment?amendmentId=${amendmentId}&entityId=${entityId}`,
            method: 'PATCH',
          };
        },
      }),

      // RECOMMEND AMENDMENT REJECTION
      recommendAmendmentRejection: builder.mutation({
        query: ({ amendmentId }) => {
          return {
            url: `/back-office/recommend-amendment-rejection?amendmentId=${amendmentId}`,
            method: 'PATCH',
          };
        },
      }),

      // UPDATE BUSINESS LINE
      updateBusinessLine: builder.mutation({
        query: ({ disclaimer, status, businessLineId }) => {
          return{
            url: `/back-office/business-line?businessLineId=${businessLineId}`,
            method: 'PATCH',
            body: {
              disclaimer,
              status
            }
          }
        }
      })
    };
  },
});

export const {
  useUpdateBusinessMutation,
  useCreateNavigationFlowMutation,
  useCompleteNavigationFlowMutation,
  useCreateBusinessReviewCommentMutation,
  useDeleteBusinessReviewCommentMutation,
  useUpdateBusinessReviewCommentMutation,
  useUpdateBusinessReviewCommentStatusMutation,
  useRequestBusinessApproverMutation,
  useCreateAmendmentReviewCommentMutation,
  useUpdateAmendmentReviewCommentMutation,
  useUpdateAmendmentReviewCommentStatusMutation,
  useUpdateBusinessAmendmentStatusMutation,
  useDeleteAmendmentReviewCommentMutation,
  useRecommendAmendmentForApprovalMutation,
  useApproveAmendmentMutation,
  useRejectAmendmentMutation,
  useRecommendAmendmentRejectionMutation,
  useUpdateBusinessLineMutation
} = businessRegApiSlice;

export default businessRegApiSlice;
