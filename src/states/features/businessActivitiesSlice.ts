import { BusinessActivity, businessId } from '@/types/models/business';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AppDispatch } from '../store';
import businessRegQueryApiSlice from '../api/businessRegQueryApiSlice';

const initialState: {
  businessActivitiesList?: {
    mainBusinessActivity: BusinessActivity;
    businessLine: BusinessActivity[];
  };
  businessActivitiesIsFetching: boolean;
  businessActivitiesIsSuccess: boolean;
} = {
  businessActivitiesList: undefined,
  businessActivitiesIsFetching: false,
  businessActivitiesIsSuccess: false,
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

export const { setBusinessActivitiesList } = businessActivitiesSlice.actions;

export default businessActivitiesSlice.reducer;
