import { Service } from '@/types/models/service';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import businessRegQueryApiSlice from '../api/businessRegQueryApiSlice';
import { AppDispatch } from '../store';

const initialState: {
  servicesList: Service[];
  service: Service;
  fetchServicesIsFetching: boolean;
  fetchServicesIsSuccess: boolean;
} = {
  servicesList: [],
  service: {} as Service,
  fetchServicesIsFetching: false,
  fetchServicesIsSuccess: false,
};

// FETCH SERVICES THUNK
export const fetchServicesThunk = createAsyncThunk<
  Service[],
  { category?: string },
  { dispatch: AppDispatch }
>('service/fetchServices', async ({ category }, { dispatch }) => {
  const response = await dispatch(
    businessRegQueryApiSlice.endpoints.fetchServices.initiate({ category })
  ).unwrap();
  dispatch(setServicesList(response.data?.data));
  return response.data;
});

export const serviceSlice = createSlice({
  name: 'service',
  initialState,
  reducers: {
    setServicesList: (state, action) => {
      state.servicesList = action.payload;
    },
    setService: (state, action) => {
      state.service = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchServicesThunk.fulfilled, (state) => {
      state.fetchServicesIsSuccess = true;
      state.fetchServicesIsFetching = false;
    });
    builder.addCase(fetchServicesThunk.pending, (state) => {
      state.fetchServicesIsFetching = true;
      state.fetchServicesIsSuccess = false;
    });
    builder.addCase(fetchServicesThunk.rejected, (state) => {
      state.fetchServicesIsFetching = false;
      state.fetchServicesIsSuccess = false;
    });
  },
});

export const { setServicesList, setService } = serviceSlice.actions;

export default serviceSlice.reducer;
