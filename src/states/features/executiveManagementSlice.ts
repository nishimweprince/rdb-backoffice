import { PersonDetail } from '@/types/models/personDetail';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import businessRegQueryApiSlice from '../api/businessRegQueryApiSlice';
import { toast } from 'react-toastify';
import { businessId } from '@/types/models/business';
import { AppDispatch } from '../store';

const initialState: {
  executiveManagementList: PersonDetail[];
  executiveManagementIsFetching: boolean;
  executiveManagementIsSuccess: boolean;
} = {
  executiveManagementList: [],
  executiveManagementIsFetching: false,
  executiveManagementIsSuccess: false,
};

// FETCH EXECUTIVE MANAGEMENT LIST THUNK
export const fetchExecutiveManagementListThunk = createAsyncThunk<
  PersonDetail[],
  { businessId: businessId; route: 'management' | 'board-member' },
  { dispatch: AppDispatch }
>(
  'business/fetchExecutiveManagementList',
  async ({ businessId, route = 'management' }, { dispatch }) => {
    try {
      const response = await dispatch(
        businessRegQueryApiSlice.endpoints.fetchBusinessPeople.initiate({
          businessId,
          route,
        })
      ).unwrap();
      return response?.data;
    } catch (error) {
      toast.error('An error occurred while fetching executive management');
      throw error;
    }
  }
);

const executiveManagementSlice = createSlice({
  name: 'executiveManagement',
  initialState,
  reducers: {
    setExecutiveManagementList: (state, action) => {
      state.executiveManagementList = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchExecutiveManagementListThunk.pending, (state) => {
      state.executiveManagementIsFetching = true;
      state.executiveManagementIsSuccess = false;
    });
    builder.addCase(fetchExecutiveManagementListThunk.fulfilled, (state, action) => {
      state.executiveManagementList = action.payload;
      state.executiveManagementIsFetching = false;
      state.executiveManagementIsSuccess = true;
    });
    builder.addCase(fetchExecutiveManagementListThunk.rejected, (state) => {
      state.executiveManagementIsFetching = false;
      state.executiveManagementIsSuccess = false;
    });
  },
});

export const { setExecutiveManagementList } = executiveManagementSlice.actions;

export default executiveManagementSlice.reducer;
