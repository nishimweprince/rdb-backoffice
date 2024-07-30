import { BusinessAttachment } from '@/types/models/attachment';
import {
  Address,
  Business,
  BusinessActivity,
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

const initialState: {
  businessesList: Business[];
  business: Business;
  employmentInfo: EmploymentInfo;
  businessAttachments: BusinessAttachment[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  selectedBusiness?: Business;
  deleteBusinessModal: boolean;
  nameAvailabilitiesList: {
    companyName: string;
    similarity: string | number;
  }[];
  similarBusinessNamesModal: boolean;
  businessDetails?: Details;
  businessAddress?: Address;
  deleteBusiessAttachmentModal: boolean;
  selectedBusinessAttachment?: BusinessAttachment;
  businessesIsFetching: boolean;
  uploadAmendmentAttachmentIsLoading: boolean;
  uploadAmendmentAttachmentIsSuccess: boolean;
  updateBusinessIsSuccess: boolean;
  updateBusinessIsLoading: boolean;
  getBusinessIsFetching: boolean;
  getBusinessIsSuccess: boolean;
  getBusinessIsError: boolean;
  businessActivitiesList?: {
    mainBusinessActivity: BusinessActivity;
    businessLine: BusinessActivity[];
  };
} = {
  businessesList: [],
  business: {} as Business,
  employmentInfo: {} as EmploymentInfo,
  page: 1,
  size: 10,
  totalElements: 0,
  totalPages: 1,
  selectedBusiness: undefined,
  deleteBusinessModal: false,
  nameAvailabilitiesList: [],
  similarBusinessNamesModal: false,
  businessDetails: undefined,
  businessAddress: undefined,
  deleteBusiessAttachmentModal: false,
  businessAttachments: [],
  selectedBusinessAttachment: undefined,
  businessesIsFetching: false,
  uploadAmendmentAttachmentIsLoading: false,
  uploadAmendmentAttachmentIsSuccess: false,
  updateBusinessIsSuccess: false,
  updateBusinessIsLoading: false,
  getBusinessIsFetching: false,
  getBusinessIsSuccess: false,
  getBusinessIsError: false,
  businessActivitiesList: undefined,
};

// FETCH BUSINESSES
export const fetchBusinessesThunk = createAsyncThunk<
  Business[],
  {
    page: number;
    size: number;
    applicationStatus?: string;
    serviceId?: string;
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
    }: {
      page: number;
      size: number;
      serviceId?: string;
      applicationStatus?: string;
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
export const getchBusinessThunk = createAsyncThunk<
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
>('business/fetchBusinessDetails', async ({businessId}, { dispatch }) => {
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

// FETCH BUSINESS ACTIVITIES
export const fetchBusinessActivitiesThunk = createAsyncThunk<
  BusinessAttachment[],
  { businessId: businessId },
  { dispatch: AppDispatch }
>('business/fetchBusinessActivities', async ({ businessId }, { dispatch }) => {
  try {
    const response = await dispatch(
      businessRegQueryApiSlice.endpoints.fetchBusinessActivities.initiate({
        businessId,
      })
    ).unwrap();
    dispatch(setBusinessActivitiesList(response?.data));
    return response?.data;
  } catch (error) {
    toast.error('An error occurred while fetching business activities');
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
    setEmploymentInfo: (state, action) => {
      state.employmentInfo = action.payload;
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
    setSimilarBusinessNamesModal: (state, action) => {
      state.similarBusinessNamesModal = action.payload;
    },
    setDeleteBusinessAttachmentModal: (state, action) => {
      state.deleteBusiessAttachmentModal = action.payload;
    },
    setBusinessAttachments: (state, action) => {
      state.businessAttachments = action.payload;
    },
    addBusinessAttachment: (state, action) => {
      state.businessAttachments = [
        action.payload,
        ...state.businessAttachments,
      ];
    },
    removeBusinessAttachment: (state, action) => {
      state.businessAttachments = state.businessAttachments.filter(
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
    setBusinessActivitiesList: (state, action) => {
      state.businessActivitiesList = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchBusinessesThunk.pending, (state) => {
      state.businessesIsFetching = true;
    });
    builder.addCase(fetchBusinessesThunk.fulfilled, (state, action) => {
      state.businessesIsFetching = false;
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
    builder.addCase(getchBusinessThunk.fulfilled, (state, action) => {
      state.business = action.payload;
      state.getBusinessIsFetching = false;
      state.getBusinessIsSuccess = true;
      state.getBusinessIsError = false;
    });
    builder.addCase(getchBusinessThunk.rejected, (state) => {
      state.getBusinessIsFetching = false;
      state.getBusinessIsSuccess = false;
      state.getBusinessIsError = true;
    });
    builder.addCase(getchBusinessThunk.pending, (state) => {
      state.getBusinessIsFetching = true;
      state.getBusinessIsSuccess = false;
      state.getBusinessIsError = false;
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
  setEmploymentInfo,
  setDeleteBusinessModal,
  setSelectedBusiness,
  setNameAvailabilitiesList,
  setSimilarBusinessNamesModal,
  setBusinessDetails,
  setBusinessAddress,
  setDeleteBusinessAttachmentModal,
  setBusinessAttachments,
  addBusinessAttachment,
  removeBusinessAttachment,
  setSelectedBusinessAttachment,
  addToBusinessesList,
  removeFromBusinessesList,
  setUploadAmendmentAttachmentIsLoading,
  setUploadAmendmentAttachmentIsSuccess,
  setUpdateBusinessIsSuccess,
  setBusinessActivitiesList,
} = businessSlice.actions;
