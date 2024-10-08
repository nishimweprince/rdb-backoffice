import { createApi } from '@reduxjs/toolkit/query/react';
import { businessBaseQueryWithReauth } from './rootApiSlice';
import { businessId } from '@/types/models/business';

export const businessRegQueryApiSlice = createApi({
  reducerPath: 'businessRegistrationQueryApi',
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
        query: ({ page, size, applicationStatus, serviceId, userId }) => {
          let url = `/back-office/applications?page=${page}&size=${size}`;
          if (applicationStatus) {
            url += `&applicationStatus=${applicationStatus}`;
          }
          if (serviceId) {
            url += `&serviceId=${serviceId}`;
          }
          if (userId) {
            url += `&userId=${userId}`;
          }
          return {
            url,
          };
        },
      }),

      // FETCH NAVIGATION FLOW MASS
      fetchNavigationFlowMass: builder.query({
        query: ({ businessType }) => {
          return {
            url: `/navigation-flow/mass?businessType=${businessType}`,
          };
        },
      }),

      // FETCH BUSINESS NAVIGATION FLOWS
      fetchBusinessNavigationFlows: builder.query({
        query: ({ businessId }) => {
          return {
            url: `/navigation-flow?businessId=${businessId}`,
          };
        },
      }),

      // FETCH SERVICES
      fetchServices: builder.query({
        query: ({ category }) => {
          return {
            url: `/services?${category ? `category=${category}` : ''}`,
          };
        },
      }),

      // FETCH COMPANY DETAILS
      fetchBusinessDetails: builder.query({
        query: ({ businessId }) => {
          return {
            url: `/details?businessId=${businessId}`,
          };
        },
      }),

      // GET BUSINESS
      getBusiness: builder.query({
        query: ({ id }) => {
          return {
            url: `/${id}`,
          };
        },
      }),

      // GET BUSINESS ADDRESS
      fetchBusinessAddress: builder.query({
        query: ({ businessId }) => {
          return {
            url: `/address?businessId=${businessId}`,
          };
        },
      }),

      // FETCH BUSINESS ACTIVITIES
      fetchBusinessActivities: builder.query({
        query: ({ businessId }) => {
          return {
            url: `/business-activities?businessId=${businessId}`,
          };
        },
      }),

      // FETCH MANAGEMENT OR BOARD PEOPLE
      fetchBusinessPeople: builder.query({
        query: ({
          businessId,
          route = 'management',
        }: {
          businessId: businessId;
          route: 'management' | 'board-member';
        }) => {
          return {
            url: `/${route}?businessId=${businessId}`,
          };
        },
      }),

      // GET PERSON DETAILS BY ID
      getBusinessPersonDetails: builder.query({
        query: ({ id }) => `/person/${id}`,
      }),

      // GET PERSON ATTACHMENTS
      fetchPersonAttachments: builder.query({
        query: ({ personId }) => `/attachment/person?personId=${personId}`,
      }),

      // FETCH BUSINESS EMPLOYMENT INFO
      fetchBusinessEmploymentInfo: builder.query({
        query: ({ businessId }) => {
          return {
            url: `/employment-info?businessId=${businessId}`,
          };
        },
      }),

      // FETCH SHAREHOLDERS
      fetchShareholders: builder.query({
        query: ({ businessId }) => {
          return {
            url: `/founders?businessId=${businessId}`,
          };
        },
      }),

      // FETCH BUSINESS ATTACHMENTS
      fetchBusinessAttachments: builder.query({
        query: ({ businessId }) => {
          return {
            url: `/attachment/business?businessId=${businessId}`,
          };
        },
      }),

      // FETCH BUSINESS REVIEW COMMENTS
      fetchBusinessReviewComments: builder.query({
        query: ({ navigationFlowId, businessId }) => {
          let url = `/review-comments?businessId=${businessId}`;
          if (navigationFlowId) {
            url += `&navigationFlowId=${navigationFlowId}`;
          }
          return {
            url,
          };
        },
      }),

      // FETCH AMENDMENTS
      fetchBusinessAmendments: builder.query({
        query: ({ businessId, userId, searchKey }) => {
          let url = `/back-office/amendments?page=1&size=100`;
          if (businessId) {
            url += `&businessId=${businessId}`;
          }
          if (userId) {
            url += `&userId=${userId}`;
          }
          if (searchKey) {
            url += `&searchKey=${searchKey}`;
          }
          return {
            url,
          };
        },
      }),

      // GET BUSINESS AMENDMENT DETAILS
      getAmendmentDetails: builder.query({
        query: ({ id }) => {
          return {
            url: `/back-office/amendments/${id}`,
          };
        },
      }),

      // FETCH AMENDMENT REVIEW COMMENTS
      fetchAmendmentReviewComments: builder.query({
        query: ({ amendmentDetailId }) => {
          return {
            url: `/review-comments/amendment?amendmentDetailId=${amendmentDetailId}`,
          };
        },
      }),

      // FETCH BUSINESS ACTIVITY SECTORS
      fetchBusinessActivitiesSectors: builder.query({
        query: () => {
          return {
            url: `/business-activity/sectors`,
          };
        },
      }),

      // FETCH BUSINESS LINES
      fetchBusinessLines: builder.query({
        query: ({ sectorCode }) => {
          return {
            url: `/business-activity/business-lines?sectorCode=${sectorCode}`,
          };
        },
      }),

      // FETCH ALL NAME RESERVATIONS
      fetchNameReservations: builder.query({
        query: ({ page, size, searchKey, status, code, assignedTo }) => {
          let url = `/name-reservations/back-office/all?page=${page}&size=${size}`;
          if (searchKey) {
            url += `&searchKey=${searchKey}`;
          }
          if (status) {
            url += `&status=${status}`;
          }
          if (code) {
            url += `&code=${code}`;
          }
          if (assignedTo) {
            url += `&assignedTo=${assignedTo}`;
          }
          return {
            url,
          };
        },
      }),

      // SEARCH BUSINESS NAME AVAILABILITY
      searchBusinessNameAvailability: builder.query({
        query: ({ companyName }) => {
          return {
            url: `/search-availability?companyName=${companyName}`,
          };
        },
      }),

      // FETCH BUSINESS GENERAL COMMENTS
      fetchBusinessGeneralComments: builder.query({
        query: ({ businessId, userId }) => {
          let url = `/review-comments/general?businessId=${businessId}`;
          if (userId) {
            url += `&userId=${userId}`;
          }
          return {
            url,
            method: 'GET',
          };
        },
      }),

      // FETCH BUSINESS BY REFERENCE ID FOR CURRENCY SETTING
      fetchBusinessByReferenceId: builder.query({
        query: ({ referenceId }) => {
          return {
            url: `/back-office/business/applicationRefNumber?applicationRefNumber=${referenceId}`,
          };
        },
      }),

      // UPDATE BUSINESS CURRENCY SETTINGS
      updateBusinessCurrencySettings: builder.mutation({
        query: ({ applicationReferenceId, endpoint }) => {
          return {
            url: `/back-office/${endpoint}?applicationReferenceId=${applicationReferenceId}`,
            method: 'PATCH',
          };
        },
      }),
    };
  },
});

export const {
  useSearchBusinessesQuery,
  useLazyFetchBusinessesQuery,
  useFetchNavigationFlowMassQuery,
  useFetchBusinessNavigationFlowsQuery,
  useFetchBusinessDetailsQuery,
  useLazyGetBusinessQuery,
  useFetchBusinessAddressQuery,
  useLazyFetchBusinessActivitiesQuery,
  useLazyFetchBusinessPeopleQuery,
  useLazyGetBusinessPersonDetailsQuery,
  useLazyFetchPersonAttachmentsQuery,
  useLazyFetchBusinessEmploymentInfoQuery,
  useLazyFetchShareholdersQuery,
  useLazyFetchBusinessAttachmentsQuery,
  useLazyFetchBusinessReviewCommentsQuery,
  useLazyFetchServicesQuery,
  useLazyFetchBusinessAmendmentsQuery,
  useLazyFetchAmendmentReviewCommentsQuery,
  useLazyFetchBusinessActivitiesSectorsQuery,
  useLazyFetchBusinessLinesQuery,
  useLazyFetchNameReservationsQuery,
  useLazySearchBusinessNameAvailabilityQuery,
  useLazyFetchBusinessGeneralCommentsQuery,
  useLazyGetAmendmentDetailsQuery,
  useLazyFetchBusinessByReferenceIdQuery,
  useUpdateBusinessCurrencySettingsMutation,
} = businessRegQueryApiSlice;

export default businessRegQueryApiSlice;
