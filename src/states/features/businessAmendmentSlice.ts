import { BusinessAmendment, businessId } from '@/types/models/business';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import businessRegQueryApiSlice from '../api/businessRegQueryApiSlice';
import { UUID } from 'crypto';
import { AppDispatch } from '../store';
import { toast } from 'react-toastify';

const initialState: {
  businessAmendmentsList: BusinessAmendment[];
  selectedBusinessAmendment?: BusinessAmendment;
  fetchBusinessAmendmentsIsFetching: boolean;
  fetchBusinessAmendmentsIsSuccess: boolean;
  fetchBusinessAmendmentsIsError: boolean;
  businessAmendmentTotalPages: number;
  businessAmendmentPage: number;
  businessAmendmentSize: number;
  businessAmendmentTotalElements: number;
} = {
  businessAmendmentsList: [],
  selectedBusinessAmendment: undefined,
  fetchBusinessAmendmentsIsFetching: false,
  fetchBusinessAmendmentsIsSuccess: false,
  fetchBusinessAmendmentsIsError: false,
  businessAmendmentTotalPages: 0,
  businessAmendmentPage: 0,
  businessAmendmentSize: 0,
  businessAmendmentTotalElements: 0,
};

// FETCH BUSINESS AMENDMENTS THUNK
export const fetchBusinessAmendmentsThunk = createAsyncThunk<
  BusinessAmendment[],
  {
    businessId?: businessId;
    userId?: UUID;
    searchKey?: string | number | (string | number | null)[] | null;
  },
  { dispatch: AppDispatch }
>(
  'businessAmendment/fetchBusinessAmendments',
  async ({ businessId, userId, searchKey }, { dispatch }) => {
    try {
      const response = await dispatch(
        businessRegQueryApiSlice.endpoints.fetchBusinessAmendments.initiate({
          businessId,
          userId,
          searchKey,
        })
      );
      dispatch(
        setBusinessAmendmentTotalElements(response?.data?.data?.totalElements)
      );
      dispatch(
        setBusinessAmendmentTotalPages(response?.data?.data?.totalPages)
      );
      return response?.data?.data?.data;
    } catch (error) {
      toast.error('Failed to fetch business amendments');
    }
  }
);

const businessAmendmentSlice = createSlice({
  name: 'businessAmendment',
  initialState,
  reducers: {
    setBusinessAmendmentsList(state, action) {
      state.businessAmendmentsList = action.payload;
    },
    setSelectedBusinessAmendment(state, action) {
      state.selectedBusinessAmendment = action.payload;
    },
    addToBusinessAmendmentsList(state, action) {
      state.businessAmendmentsList.push(action.payload);
    },
    removeFromBusinessAmendmentsList(state, action) {
      state.businessAmendmentsList = state.businessAmendmentsList.filter(
        (item) => item.id !== action.payload
      );
    },
    setBusinessAmendmentTotalPages(state, action) {
      state.businessAmendmentTotalPages = action.payload;
    },
    setBusinessAmendmentPage(state, action) {
      state.businessAmendmentPage = action.payload;
    },
    setBusinessAmendmentSize(state, action) {
      state.businessAmendmentSize = action.payload;
    },
    setBusinessAmendmentTotalElements(state, action) {
      state.businessAmendmentTotalElements = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchBusinessAmendmentsThunk.fulfilled, (state, action) => {
      state.businessAmendmentsList = action.payload;
      state.fetchBusinessAmendmentsIsSuccess = true;
      state.fetchBusinessAmendmentsIsFetching = false;
    });
    builder.addCase(fetchBusinessAmendmentsThunk.pending, (state) => {
      state.fetchBusinessAmendmentsIsFetching = true;
      state.fetchBusinessAmendmentsIsSuccess = false;
    });
    builder.addCase(fetchBusinessAmendmentsThunk.rejected, (state) => {
      state.fetchBusinessAmendmentsIsFetching = false;
      state.fetchBusinessAmendmentsIsSuccess = false;
    });
  },
});

export const {
  setBusinessAmendmentsList,
  setSelectedBusinessAmendment,
  addToBusinessAmendmentsList,
  removeFromBusinessAmendmentsList,
  setBusinessAmendmentTotalPages,
  setBusinessAmendmentPage,
  setBusinessAmendmentSize,
  setBusinessAmendmentTotalElements,
} = businessAmendmentSlice.actions;

export default businessAmendmentSlice.reducer;
