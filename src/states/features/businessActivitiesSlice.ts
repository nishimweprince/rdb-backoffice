import { BusinessActivity, businessId } from '@/types/models/business';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AppDispatch } from '../store';
import businessRegQueryApiSlice from '../api/businessRegQueryApiSlice';

const initialState: {
  businessActivitiesList?: {
    mainBusinessActivity: BusinessActivity;
    businessLine: BusinessActivity[];
  };
  businessActivitiesSectorsList?: BusinessActivity[];
  businessActivitiesIsFetching: boolean;
  businessActivitiesIsSuccess: boolean;
  businessLinesList: BusinessActivity[];
  updateBusinessLineModal: boolean;
  selectedBusinessLine?: BusinessActivity;
} = {
  businessActivitiesList: undefined,
  businessActivitiesIsFetching: false,
  businessActivitiesIsSuccess: false,
  businessLinesList: [],
  businessActivitiesSectorsList: [],
  updateBusinessLineModal: false,
  selectedBusinessLine: undefined
};

// FETCH BUSINESS ACTIVITIES
export const fetchBusinessActivitiesThunk = createAsyncThunk<
  BusinessActivity[],
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
    return error;
  }
});

const businessActivitiesSlice = createSlice({
  name: 'businessActivities',
  initialState,
  reducers: {
    setBusinessActivitiesList: (state, action) => {
      state.businessActivitiesList = action.payload;
    },
    setBusinessLinesList: (state, action) => {
      state.businessLinesList = action.payload;
    },
    setBusinessActivitiesSectorsList: (state, action) => {
      state.businessActivitiesSectorsList = action.payload;
    },
    setUpdateBusinessLineModal: (state, action) => {
      state.updateBusinessLineModal = action.payload;
    },
    setSelectedBusinessLine: (state, action) => {
      state.selectedBusinessLine = action.payload;
    },
    setUpdateBusinessLine: (state, action) => {
      state.businessLinesList = state.businessLinesList.map((businessLine) => {
        if (businessLine.id === action.payload.id) {
          return action.payload;
        }
        return businessLine;
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchBusinessActivitiesThunk.pending, (state) => {
      state.businessActivitiesIsFetching = true;
      state.businessActivitiesIsSuccess = false;
    });
    builder.addCase(fetchBusinessActivitiesThunk.fulfilled, (state) => {
      state.businessActivitiesIsFetching = false;
      state.businessActivitiesIsSuccess = true;
    });
    builder.addCase(fetchBusinessActivitiesThunk.rejected, (state) => {
      state.businessActivitiesIsFetching = false;
      state.businessActivitiesIsSuccess = false;
    });
  },
});

export const {
  setBusinessActivitiesList,
  setBusinessLinesList,
  setBusinessActivitiesSectorsList,
  setUpdateBusinessLineModal,
  setSelectedBusinessLine,
  setUpdateBusinessLine,
} = businessActivitiesSlice.actions;

export default businessActivitiesSlice.reducer;
