import { FounderDetail } from '@/types/models/personDetail';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import businessRegQueryApiSlice from '../api/businessRegQueryApiSlice';
import { AppDispatch } from '../store';
import { businessId } from '@/types/models/business';

const initialState: {
  founderDetailsList: FounderDetail[];
  selectedFounderDetail: FounderDetail;
  assignSharesModal: boolean;
  deleteFounderModal: boolean;
  founderDetailsIsFetching: boolean;
  founderDetailsIsSuccess: boolean;
  founderDetailsModal: boolean;
} = {
  founderDetailsList: [],
  selectedFounderDetail: {} as FounderDetail,
  assignSharesModal: false,
  deleteFounderModal: false,
  founderDetailsIsFetching: false,
  founderDetailsIsSuccess: false,
  founderDetailsModal: false
};

// FETCH FOUNDER DETAILS LIST THUNK
export const fetchFounderDetailsListThunk = createAsyncThunk<
  FounderDetail[],
  { businessId: businessId },
  { dispatch: AppDispatch }
>(
  'founderDetail/fetchFounderDetailsList',
  async ({ businessId }, { dispatch }) => {
    const response = await dispatch(
      businessRegQueryApiSlice.endpoints.fetchShareholders.initiate({
        businessId,
        route: 'founder',
      })
    ).unwrap();
    return response?.data;
  }
);

const founderDetailSlice = createSlice({
  name: 'founderDetail',
  initialState,
  reducers: {
    setFounderDetailsList: (state, action) => {
      state.founderDetailsList = action.payload;
    },
    setSelectedFounderDetail: (state, action) => {
      state.selectedFounderDetail = action.payload;
    },
    addFounderDetail: (state, action) => {
      state.founderDetailsList = [action.payload, ...state.founderDetailsList];
    },
    removeFounderDetail: (state, action) => {
      state.founderDetailsList = state.founderDetailsList.filter(
        (person: FounderDetail) => person.id !== action.payload
      );
    },
    setAssignSharesModal: (state, action) => {
      state.assignSharesModal = action.payload;
    },
    setDeleteFounderModal: (state, action) => {
      state.deleteFounderModal = action.payload;
    },
    setFounderDetailsModal: (state, action) => {
      state.founderDetailsModal = action.payload
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchFounderDetailsListThunk.fulfilled, (state, action) => {
      state.founderDetailsList = action.payload;
      state.founderDetailsIsSuccess = true;
      state.founderDetailsIsFetching = false;
    });
    builder.addCase(fetchFounderDetailsListThunk.pending, (state) => {
      state.founderDetailsIsFetching = true;
      state.founderDetailsIsSuccess = false;
      state.founderDetailsList = [];
    });
    builder.addCase(fetchFounderDetailsListThunk.rejected, (state) => {
      state.founderDetailsIsFetching = false;
      state.founderDetailsIsSuccess = false;
      state.founderDetailsList = [];
    });
  },
});

export const {
  setFounderDetailsList,
  setSelectedFounderDetail,
  addFounderDetail,
  removeFounderDetail,
  setAssignSharesModal,
  setDeleteFounderModal,
  setFounderDetailsModal
} = founderDetailSlice.actions;

export default founderDetailSlice.reducer;
