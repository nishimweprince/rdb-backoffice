import { BusinessAttachment } from '@/types/models/attachment';
import {
  Address,
  Business,
  businessId,
  Details,
  EmploymentInfo,
} from '@/types/models/business';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import businessRegApiSlice from '../api/businessRegApiSlice';
import { AppDispatch } from '../store';
import { toast } from 'react-toastify';
import businessRegQueryApiSlice from '../api/businessRegQueryApiSlice';
import { UUID } from 'crypto';
import { BusinessReviewComment } from '@/types/models/businessReviewComment';

const initialState: {
  businessesList: Business[];
  business: Business;
  businessAttachmentsList: BusinessAttachment[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  selectedBusiness?: Business;
  deleteBusinessModal: boolean;
  nameAvailabilitiesList: {
    name: string;
    similarity: string | number;
    status?: string;
  }[];
  nameAvailabilitiesListClone: {
    name: string;
    similarity: string | number;
    status?: string;
  }[];
  similarBusinessNamesModal: boolean;
  businessDetails?: Details;
  businessAddress?: Address;
  deleteBusiessAttachmentModal: boolean;
  selectedBusinessAttachment?: BusinessAttachment;
  businessesIsFetching: boolean;
  businessesIsSuccess: boolean;
  uploadAmendmentAttachmentIsLoading: boolean;
  uploadAmendmentAttachmentIsSuccess: boolean;
  updateBusinessIsSuccess: boolean;
  updateBusinessIsLoading: boolean;
  getBusinessIsFetching: boolean;
  getBusinessIsSuccess: boolean;
  getBusinessIsError: boolean;
  businessEmploymentInfo?: EmploymentInfo;
  businessEmploymentInfoIsFetching: boolean;
  businessEmploymentInfoIsSuccess: boolean;
  approveAmendmentIsLoading: boolean;
  approveAmendmentIsSuccess: boolean;
  rejectBusinessIsLoading: boolean;
  rejectBusinessIsSuccess: boolean;
  approveBusinessIsLoading: boolean;
  approveBusinessIsSuccess: boolean;
  businessRecommendForRejectionModal: boolean;
  businessRecommendForApprovalModal: boolean;
  businessConfirmApproveModal: boolean;
  businessConfirmRejectModal: boolean;
  businessGeneralCommentsList: BusinessReviewComment[];
  createBusinessGeneralCommentIsLoading: boolean;
  createBusinessGeneralCommentIsSuccess: boolean;
  createBusinessGeneralCommentIsError: boolean;
  businessGeneralCommentsIsFetching: boolean;
  businessGeneralCommentsIsSuccess: boolean;
  businessGeneralCommentsIsError: boolean;
  recommendBusinessForRejectionIsLoading: boolean;
  recommendBusinessForRejectionIsSuccess: boolean;
  recommendBusinessForRejectionIsError: boolean;
} = {
  businessesList: [],
  business: {} as Business,
  page: 1,
  size: 10,
  totalElements: 0,
  totalPages: 1,
  selectedBusiness: undefined,
  deleteBusinessModal: false,
  nameAvailabilitiesList: [],
  nameAvailabilitiesListClone: [],
  similarBusinessNamesModal: false,
  businessDetails: undefined,
  businessAddress: undefined,
  deleteBusiessAttachmentModal: false,
  businessAttachmentsList: [],
  selectedBusinessAttachment: undefined,
  businessesIsFetching: false,
  uploadAmendmentAttachmentIsLoading: false,
  uploadAmendmentAttachmentIsSuccess: false,
  updateBusinessIsSuccess: false,
  updateBusinessIsLoading: false,
  getBusinessIsFetching: false,
  getBusinessIsSuccess: false,
  getBusinessIsError: false,
  businessEmploymentInfo: undefined,
  businessEmploymentInfoIsFetching: false,
  businessEmploymentInfoIsSuccess: false,
  approveAmendmentIsLoading: false,
  approveAmendmentIsSuccess: false,
  businessesIsSuccess: false,
  rejectBusinessIsLoading: false,
  rejectBusinessIsSuccess: false,
  approveBusinessIsLoading: false,
  approveBusinessIsSuccess: false,
  businessRecommendForApprovalModal: false,
  businessRecommendForRejectionModal: false,
  businessConfirmApproveModal: false,
  businessConfirmRejectModal: false,
  businessGeneralCommentsList: [],
  createBusinessGeneralCommentIsLoading: false,
  createBusinessGeneralCommentIsSuccess: false,
  createBusinessGeneralCommentIsError: false,
  businessGeneralCommentsIsFetching: false,
  businessGeneralCommentsIsSuccess: false,
  businessGeneralCommentsIsError: false,
  recommendBusinessForRejectionIsLoading: false,
  recommendBusinessForRejectionIsSuccess: false,
  recommendBusinessForRejectionIsError: false,
};

// FETCH BUSINESSES
export const fetchBusinessesThunk = createAsyncThunk<
  Business[],
  {
    page: number;
    size: number;
    applicationStatus?: string;
    serviceId?: string;
    userId?: UUID;
  },
  { dispatch: AppDispatch }
>(
  'business/fetchBusinesses',
  async (
    {
      page,
      size,
      serviceId,
      applicationStatus,
      userId,
    }: {
      page: number;
      size: number;
      serviceId?: string;
      applicationStatus?: string;
      userId?: UUID;
    },
    {
      dispatch,
    }: {
      dispatch: AppDispatch;
    }
  ) => {
    try {
      const response = await dispatch(
        businessRegQueryApiSlice.endpoints.fetchBusinesses.initiate({
          page,
          size,
          serviceId,
          applicationStatus,
          userId,
        })
      ).unwrap();
      return response.data;
    } catch (error) {
      toast.error('An error occurred while fetching businesses');
      throw error;
    }
  }
);

// FETCH BUSINESS THUNK
export const getBusinessThunk = createAsyncThunk<
  Business,
  UUID,
  { dispatch: AppDispatch }
>('business/getchBusiness', async (id, { dispatch }) => {
  try {
    const response = await dispatch(
      businessRegQueryApiSlice.endpoints.getBusiness.initiate({
        id,
      })
    ).unwrap();
    return response.data;
  } catch (error) {
    toast.error('An error occurred while fetching business');
    throw error;
  }
});

// UPDATE BUSINESS THUNK
export const updateBusinessThunk = createAsyncThunk<
  Business,
  { businessId: businessId; applicationStatus: string },
  { dispatch: AppDispatch }
>(
  'business/updateBusiness',
  async ({ applicationStatus, businessId }, { dispatch }) => {
    try {
      const response = await dispatch(
        businessRegApiSlice.endpoints.updateBusiness.initiate({
          businessId,
          applicationStatus,
        })
      ).unwrap();
      return response.data;
    } catch (error) {
      toast.error('An error occurred while updating business');
      throw error;
    }
  }
);

// FETCH BUSINESS DETAILS THUNK
export const fetchBusinessDetailsThunk = createAsyncThunk<
  Details,
  { businessId: businessId },
  { dispatch: AppDispatch }
>('business/fetchBusinessDetails', async ({ businessId }, { dispatch }) => {
  try {
    const response = await dispatch(
      businessRegQueryApiSlice.endpoints.fetchBusinessDetails.initiate({
        businessId,
      })
    ).unwrap();
    dispatch(setBusinessDetails(response.data));
    return response.data;
  } catch (error) {
    toast.error('An error occurred while fetching business details');
    throw error;
  }
});

// FETCH BUSINESS ADDRESS THUNK
export const fetchBusinessAddressThunk = createAsyncThunk<
  Address,
  { businessId: businessId },
  { dispatch: AppDispatch }
>('business/fetchBusinessAddress', async ({ businessId }, { dispatch }) => {
  try {
    const response = await dispatch(
      businessRegQueryApiSlice.endpoints.fetchBusinessAddress.initiate({
        businessId,
      })
    ).unwrap();
    dispatch(setBusinessAddress(response.data));
    return response.data;
  } catch (error) {
    toast.error('An error occurred while fetching business address');
    throw error;
  }
});

// FETCH BUSINESS EMPLOYMENT INFO
export const fetchBusinessEmploymentInfoThunk = createAsyncThunk<
  EmploymentInfo,
  { businessId: businessId },
  { dispatch: AppDispatch }
>(
  'business/fetchBusinessEmploymentInfo',
  async ({ businessId }, { dispatch }) => {
    const response = await dispatch(
      businessRegQueryApiSlice.endpoints.fetchBusinessEmploymentInfo.initiate({
        businessId,
      })
    ).unwrap();
    dispatch(setBusinessEmploymentInfo(response?.data));
    return response.data;
  }
);

// FETCH BUSINESS ATTACHMENTS
export const fetchBusinessAttachmentsThunk = createAsyncThunk<
  BusinessAttachment[],
  { businessId: businessId },
  { dispatch: AppDispatch }
>('business/fetchBusinessAttachments', async ({ businessId }, { dispatch }) => {
  try {
    const response = await dispatch(
      businessRegQueryApiSlice.endpoints.fetchBusinessAttachments.initiate({
        businessId,
      })
    ).unwrap();
    dispatch(setBusinessAttachmentsList(response?.data));
    return response.data;
  } catch (error) {
    toast.error('An error occurred while fetching business attachments');
    throw error;
  }
});

// REQUEST BUSINESS APPROVER THUNK
export const requestBusinessApproverThunk = createAsyncThunk<
  void,
  { businessId: businessId, comment?: string },
  { dispatch: AppDispatch }
>('business/requestBusinessApprover', async ({ businessId, comment }, { dispatch }) => {
  try {
    await dispatch(
      businessRegApiSlice.endpoints.requestBusinessApprover.initiate({
        businessId,
        comment
      })
    ).unwrap();
  } catch (error) {
    toast.error('An error occurred while requesting business approver');
    throw error;
  }
});

// REJECT BUSINESS THUNK
export const rejectBusinessThunk = createAsyncThunk<
  Business,
  { businessId: businessId, comment?: string },
  { dispatch: AppDispatch }
>('business/rejectBusiness', async ({ businessId, comment }, { dispatch }) => {
  try {
    const response = await dispatch(
      businessRegApiSlice.endpoints.rejectBusiness.initiate({
        businessId,
        comment
      })
    ).unwrap();
    return response?.data?.data;
  } catch (error) {
    toast.error('An error occurred while rejecting business');
    throw error;
  }
});

// APPROVE BUSINESS THUNK
export const approveBusinessThunk = createAsyncThunk<
  Business,
  {
    businessId: businessId;
    companyType: 'domestic' | 'foreign' | 'enterprise';
  },
  { dispatch: AppDispatch }
>(
  'business/approveBusiness',
  async ({ businessId, companyType }, { dispatch }) => {
    try {
      const response = await dispatch(
        businessRegApiSlice.endpoints.approveBusiness.initiate({
          businessId,
          companyType,
        })
      ).unwrap();

      return response?.data?.data;
    } catch (error) {
      toast.error('An error occurred while approving business');
      throw error;
    }
  }
);

// CREATE BUSINESS GENERAL COMMENT THUNK
export const createBusinessGeneralCommentThunk = createAsyncThunk<
  BusinessReviewComment,
  { businessId: businessId; comment: string },
  { dispatch: AppDispatch }
>(
  `business/createBusinessGeneralComment`,
  async ({ businessId, comment }, { dispatch }) => {
    try {
      const response = await dispatch(
        businessRegApiSlice.endpoints.createBusinessGeneralComment.initiate({
          businessId,
          comment,
        })
      ).unwrap();
      return response.data;
    } catch (error) {
      toast.error('An error occurred while creating general comment');
      throw error;
    }
  }
);

// FETCH BUSINESS GENERAL COMMENTS THUNK
export const fetchBusinessGeneralCommentsThunk = createAsyncThunk<
  BusinessReviewComment[],
  { businessId: businessId },
  { dispatch: AppDispatch }
>(
  `business/fetchBusinessGeneralComments`,
  async ({ businessId }, { dispatch }) => {
    try {
      const response = await dispatch(
        businessRegQueryApiSlice.endpoints.fetchBusinessGeneralComments.initiate(
          {
            businessId,
          }
        )
      ).unwrap();
      return response.data;
    } catch (error) {
      return error;
    }
  }
);

// RECOMMEND BUSINESS FOR REJECTION
export const recommendBusinessForRejectionThunk = createAsyncThunk<
  Business,
  { businessId: businessId; comment: string },
  { dispatch: AppDispatch }
>(`business/recommendBusinessForRejection`, async ({ businessId, comment }, { dispatch }) => {
  try {
    const response = await dispatch(
      businessRegApiSlice.endpoints.recommendBusinessForRejection.initiate({
        businessId,
        comment
      })
    ).unwrap();
    return response?.data?.data;
  } catch (error) {
    toast.error('An error occurred while rejecting business');
    throw error;
  }
});

export const businessSlice = createSlice({
  name: 'business',
  initialState,
  reducers: {
    setBusinessesList: (state, action) => {
      state.businessesList = action.payload;
    },
    setBusinessPage: (state, action) => {
      state.page = action.payload;
    },
    setBusinessSize: (state, action) => {
      state.size = action.payload;
    },
    setBusinessTotalElements: (state, action) => {
      state.totalElements = action.payload;
    },
    setBusinessTotalPages: (state, action) => {
      state.totalPages = action.payload;
    },
    setBusiness: (state, action) => {
      state.business = action.payload;
    },
    setBusinessDetails: (state, action) => {
      state.businessDetails = action.payload;
    },
    setBusinessAddress: (state, action) => {
      state.businessAddress = action.payload;
    },
    setBusinessEmploymentInfo: (state, action) => {
      state.businessEmploymentInfo = action.payload;
    },
    setSelectedBusiness: (state, action) => {
      state.selectedBusiness = action.payload;
    },
    setDeleteBusinessModal: (state, action) => {
      state.deleteBusinessModal = action.payload;
    },
    setNameAvailabilitiesList: (state, action) => {
      state.nameAvailabilitiesList = action.payload;
    },
    setNameAvailabilitiesListClone: (state, action) => {
      state.nameAvailabilitiesListClone= action.payload;
    },
    setSimilarBusinessNamesModal: (state, action) => {
      state.similarBusinessNamesModal = action.payload;
    },
    setDeleteBusinessAttachmentModal: (state, action) => {
      state.deleteBusiessAttachmentModal = action.payload;
    },
    setBusinessAttachmentsList: (state, action) => {
      state.businessAttachmentsList = action.payload;
    },
    addBusinessAttachment: (state, action) => {
      state.businessAttachmentsList = [
        action.payload,
        ...state.businessAttachmentsList,
      ];
    },
    removeBusinessAttachment: (state, action) => {
      state.businessAttachmentsList = state.businessAttachmentsList.filter(
        (attachment: BusinessAttachment) => attachment.id !== action.payload.id
      );
    },
    setSelectedBusinessAttachment: (state, action) => {
      state.selectedBusinessAttachment = action.payload;
    },
    addToBusinessesList: (state, action) => {
      state.businessesList = [...action.payload, ...state.businessesList];
    },
    removeFromBusinessesList: (state, action) => {
      state.businessesList = state.businessesList.filter(
        (business) => business.id !== action.payload
      );
    },
    setUploadAmendmentAttachmentIsLoading: (state, action) => {
      state.uploadAmendmentAttachmentIsLoading = action.payload;
    },
    setUploadAmendmentAttachmentIsSuccess: (state, action) => {
      state.uploadAmendmentAttachmentIsSuccess = action.payload;
    },
    setUpdateBusinessIsSuccess: (state, action) => {
      state.updateBusinessIsSuccess = action.payload;
    },
    setRejectBusinessIsSuccess: (state, action) => {
      state.rejectBusinessIsSuccess = action.payload;
    },
    setApproveBusinessIsSuccess: (state, action) => {
      state.approveBusinessIsSuccess = action.payload;
    },
    setBusinessRecommendForApprovalModal: (state, action) => {
      state.businessRecommendForApprovalModal = action.payload;
    },
    setBusinessRecommendForRejectionModal: (state, action) => {
      state.businessRecommendForRejectionModal = action.payload;
    },
    setBusinessConfirmRejectModal: (state, action) => {
      state.businessConfirmRejectModal = action.payload;
    },
    setBusinessConfirmApproveModal: (state, action) => {
      state.businessConfirmApproveModal = action.payload;
    },
    setBusinessGeneralCommentsList: (state, action) => {
      state.businessGeneralCommentsList = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchBusinessesThunk.pending, (state) => {
      state.businessesIsFetching = true;
      state.businessesIsSuccess = false;
    });
    builder.addCase(fetchBusinessesThunk.fulfilled, (state, action) => {
      state.businessesIsFetching = false;
      state.businessesIsSuccess = true;
      state.businessesList = (
        action.payload as unknown as {
          data: Business[];
        }
      )?.data;
      state.totalElements = (
        action.payload as unknown as {
          totalElements: number;
        }
      )?.totalElements;
      state.totalPages = (
        action.payload as unknown as {
          totalPages: number;
        }
      )?.totalPages;
    });
    builder.addCase(fetchBusinessesThunk.rejected, (state) => {
      state.businessesIsFetching = false;
      state.businessesIsSuccess = false;
    });
    builder.addCase(updateBusinessThunk.fulfilled, (state, action) => {
      state.updateBusinessIsSuccess = true;
      state.updateBusinessIsLoading = false;
      state.businessesList = state.businessesList.map((business) => {
        if (business.id === action.payload.id) {
          return action.payload;
        }
        return business;
      });
    });
    builder.addCase(updateBusinessThunk.rejected, (state) => {
      state.updateBusinessIsSuccess = false;
      state.updateBusinessIsLoading = false;
    });
    builder.addCase(updateBusinessThunk.pending, (state) => {
      state.updateBusinessIsSuccess = false;
      state.updateBusinessIsLoading = true;
    });
    builder.addCase(getBusinessThunk.fulfilled, (state, action) => {
      state.business = action.payload;
      state.businessesList = state.businessesList.map((business) => {
        if (business.id === action.payload.id) {
          return action.payload;
        }
        return business;
      });
      state.getBusinessIsFetching = false;
      state.getBusinessIsSuccess = true;
      state.getBusinessIsError = false;
    });
    builder.addCase(getBusinessThunk.rejected, (state) => {
      state.getBusinessIsFetching = false;
      state.getBusinessIsSuccess = false;
      state.getBusinessIsError = true;
    });
    builder.addCase(getBusinessThunk.pending, (state) => {
      state.getBusinessIsFetching = true;
      state.getBusinessIsSuccess = false;
      state.getBusinessIsError = false;
    });
    builder.addCase(fetchBusinessEmploymentInfoThunk.pending, (state) => {
      state.businessEmploymentInfoIsFetching = true;
      state.businessEmploymentInfoIsSuccess = false;
    });
    builder.addCase(
      fetchBusinessEmploymentInfoThunk.fulfilled,
      (state, action) => {
        state.businessEmploymentInfo = action.payload;
        state.businessEmploymentInfoIsFetching = false;
        state.businessEmploymentInfoIsSuccess = true;
      }
    );
    builder.addCase(fetchBusinessEmploymentInfoThunk.rejected, (state) => {
      state.businessEmploymentInfoIsFetching = false;
      state.businessEmploymentInfoIsSuccess = false;
    });
    builder.addCase(requestBusinessApproverThunk.pending, (state) => {
      state.updateBusinessIsLoading = true;
      state.updateBusinessIsSuccess = false;
    });
    builder.addCase(requestBusinessApproverThunk.fulfilled, (state) => {
      state.updateBusinessIsLoading = false;
      state.updateBusinessIsSuccess = true;
      state.businessesList = state.businessesList.map((business) => {
        if (business.id === state.business.id) {
          return state.business;
        }
        return business;
      });
    });
    builder.addCase(requestBusinessApproverThunk.rejected, (state) => {
      state.updateBusinessIsLoading = false;
      state.updateBusinessIsSuccess = false;
    });
    builder.addCase(rejectBusinessThunk.pending, (state) => {
      state.rejectBusinessIsLoading = true;
      state.rejectBusinessIsSuccess = false;
    });
    builder.addCase(rejectBusinessThunk.fulfilled, (state) => {
      state.rejectBusinessIsLoading = false;
      state.rejectBusinessIsSuccess = true;
      state.businessesList = state.businessesList.map((business) => {
        if (business.id === state.business.id) {
          return state.business;
        }
        return business;
      });
    });
    builder.addCase(rejectBusinessThunk.rejected, (state) => {
      state.rejectBusinessIsLoading = false;
      state.rejectBusinessIsSuccess = false;
    });
    builder.addCase(approveBusinessThunk.pending, (state) => {
      state.approveBusinessIsLoading = true;
      state.approveBusinessIsSuccess = false;
    });
    builder.addCase(approveBusinessThunk.fulfilled, (state) => {
      state.approveBusinessIsLoading = false;
      state.approveBusinessIsSuccess = true;
      state.businessesList = state.businessesList.map((business) => {
        if (business.id === state.business.id) {
          return state.business;
        }
        return business;
      });
    });
    builder.addCase(approveBusinessThunk.rejected, (state) => {
      state.approveBusinessIsLoading = false;
      state.approveBusinessIsSuccess = false;
    });
    builder.addCase(createBusinessGeneralCommentThunk.pending, (state) => {
      state.createBusinessGeneralCommentIsLoading = true;
      state.createBusinessGeneralCommentIsSuccess = false;
      state.createBusinessGeneralCommentIsError = false;
    });
    builder.addCase(
      createBusinessGeneralCommentThunk.fulfilled,
      (state, action) => {
        state.createBusinessGeneralCommentIsLoading = false;
        state.createBusinessGeneralCommentIsSuccess = true;
        state.businessGeneralCommentsList.unshift(action.payload);
      }
    );
    builder.addCase(createBusinessGeneralCommentThunk.rejected, (state) => {
      state.createBusinessGeneralCommentIsLoading = false;
      state.createBusinessGeneralCommentIsSuccess = false;
      state.createBusinessGeneralCommentIsError = true;
    });
    builder.addCase(fetchBusinessGeneralCommentsThunk.pending, (state) => {
      state.businessGeneralCommentsIsFetching = true;
      state.businessGeneralCommentsIsSuccess = false;
      state.businessGeneralCommentsIsError = false;
    });
    builder.addCase(
      fetchBusinessGeneralCommentsThunk.fulfilled,
      (state, action) => {
        state.businessGeneralCommentsList = action.payload;
        state.businessGeneralCommentsIsFetching = false;
        state.businessGeneralCommentsIsSuccess = true;
        state.businessGeneralCommentsIsError = false;
      }
    );
    builder.addCase(fetchBusinessGeneralCommentsThunk.rejected, (state) => {
      state.businessGeneralCommentsIsFetching = false;
      state.businessGeneralCommentsIsSuccess = false;
      state.businessGeneralCommentsIsError = true;
    });
    builder.addCase(recommendBusinessForRejectionThunk.pending, (state) => {
      state.recommendBusinessForRejectionIsLoading = true;
      state.recommendBusinessForRejectionIsSuccess = false;
      state.recommendBusinessForRejectionIsError = false;
    });
    builder.addCase(recommendBusinessForRejectionThunk.fulfilled, (state) => {
      state.recommendBusinessForRejectionIsLoading = false;
      state.recommendBusinessForRejectionIsSuccess = true;
      state.businessesList = state.businessesList.map((business) => {
        if (business.id === state.business.id) {
          return state.business;
        }
        return business;
      });
    });
    builder.addCase(recommendBusinessForRejectionThunk.rejected, (state) => {
      state.recommendBusinessForRejectionIsLoading = false;
      state.recommendBusinessForRejectionIsSuccess = false;
      state.recommendBusinessForRejectionIsError = true;
    });
  },
});

export default businessSlice.reducer;

export const {
  setBusinessesList,
  setBusinessPage,
  setBusinessSize,
  setBusinessTotalElements,
  setBusinessTotalPages,
  setBusiness,
  setBusinessEmploymentInfo,
  setDeleteBusinessModal,
  setSelectedBusiness,
  setNameAvailabilitiesList,
  setNameAvailabilitiesListClone,
  setSimilarBusinessNamesModal,
  setBusinessDetails,
  setBusinessAddress,
  setDeleteBusinessAttachmentModal,
  setBusinessAttachmentsList,
  addBusinessAttachment,
  removeBusinessAttachment,
  setSelectedBusinessAttachment,
  addToBusinessesList,
  removeFromBusinessesList,
  setUploadAmendmentAttachmentIsLoading,
  setUploadAmendmentAttachmentIsSuccess,
  setUpdateBusinessIsSuccess,
  setRejectBusinessIsSuccess,
  setApproveBusinessIsSuccess,
  setBusinessRecommendForApprovalModal,
  setBusinessRecommendForRejectionModal,
  setBusinessConfirmRejectModal,
  setBusinessConfirmApproveModal,
  setBusinessGeneralCommentsList,
} = businessSlice.actions;
