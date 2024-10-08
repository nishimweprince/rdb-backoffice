import { createApi } from '@reduxjs/toolkit/query/react';
import { businessBaseQueryWithReauth } from './rootApiSlice';
import { businessId } from '@/types/models/business';

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
        query: ({ businessId, comment }) => {
          return {
            url: `/back-office/request-approval?businessId=${businessId}`,
            method: 'PATCH',
            body: {
              comment,
            },
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
          return {
            url: `/back-office/business-line?businessLineId=${businessLineId}`,
            method: 'PATCH',
            body: {
              disclaimer,
              status,
            },
          };
        },
      }),

      // APPROVE BUSINESS
      approveBusiness: builder.mutation({
        query: ({
          businessId,
          companyType,
          comment
        }: {
          businessId: businessId;
          companyType: 'domestic' | 'foreign' | 'enterprise';
          comment?: string;
        }) => {
          return {
            url: `/back-office/approve-${companyType}?businessId=${businessId}`,
            method: 'PATCH',
            body: {
              comment,
            }
          };
        },
      }),

      // REJECT BUSINESS
      rejectBusiness: builder.mutation({
        query: ({ businessId, comment }) => {
          return {
            url: `/back-office/reject-business?businessId=${businessId}`,
            method: 'PATCH',
            body: {
              comment,
            },
          };
        },
      }),

      // APPROVE NAME RESERVATION
      approveNameReservation: builder.mutation({
        query: ({ id }) => {
          return {
            url: `/name-reservations/back-office/approve/${id}`,
            method: 'PATCH',
          };
        },
      }),

      // REJECT NAME RESERVATION
      rejectNameReservation: builder.mutation({
        query: ({ id, comment }) => {
          return {
            url: `/name-reservations/back-office/reject/${id}`,
            method: 'PATCH',
            body: {
              comment,
            },
          };
        },
      }),

      // CREATE GENERAL COMMENT
      createBusinessGeneralComment: builder.mutation({
        query: ({ businessId, comment }) => {
          return {
            url: `/review-comments/general?businessId=${businessId}`,
            method: 'POST',
            body: {
              businessId,
              comment,
            },
          };
        },
      }),

      // RECOMMEND BUSINESS FOR REJECTION
      recommendBusinessForRejection: builder.mutation({
        query: ({ businessId, comment }) => {
          return {
            url: `/back-office/recommend-rejection?businessId=${businessId}`,
            method: 'PATCH',
            body: {
              comment,
            },
          };
        },
      }),

      // DELETE BUSINESS GENERAL COMMENT
      deleteBusinessGeneralComment: builder.mutation({
        query: ({ id }) => {
          return {
            url: `/review-comments/general/${id}`,
            method: 'DELETE',
          };
        },
      }),

      // UPDATE BUSINESS GENERAL COMMENT
      updateBusinessGeneralComment: builder.mutation({
        query: ({ id, comment }) => {
          return {
            url: `/review-comments/general/${id}`,
            method: 'PATCH',
            body: {
              comment,
            },
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
  useUpdateBusinessLineMutation,
  useApproveBusinessMutation,
  useRejectBusinessMutation,
  useApproveNameReservationMutation,
  useRejectNameReservationMutation,
  useCreateBusinessGeneralCommentMutation,
  useRecommendBusinessForRejectionMutation,
  useDeleteBusinessGeneralCommentMutation,
  useUpdateBusinessGeneralCommentMutation,
} = businessRegApiSlice;

export default businessRegApiSlice;
