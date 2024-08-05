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
            url
          };
        },
      }),
    };
  },
});

export const {
  useSearchBusinessesQuery,
  useFetchBusinessesQuery,
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
} = businessRegQueryApiSlice;

export default businessRegQueryApiSlice;
