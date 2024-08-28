import { PersonDetail } from '@/types/models/personDetail';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import businessRegQueryApiSlice from '../api/businessRegQueryApiSlice';
import { toast } from 'react-toastify';
import { businessId } from '@/types/models/business';
import { AppDispatch } from '../store';
import { RegistrarGeneral } from '@/types/models/registrarGeneral';

const initialState: {
  executiveManagementList: PersonDetail[];
  executiveManagementIsFetching: boolean;
  executiveManagementIsSuccess: boolean;
  registrarGeneralList: RegistrarGeneral[];
  totalElements?: number;
  totalPages?: number;
  currentPage?: number;
} = {
  executiveManagementList: [],
  executiveManagementIsFetching: false,
  executiveManagementIsSuccess: false,
  registrarGeneralList: [],
  totalElements: 0,
  totalPages: 1,
  currentPage: 1,

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
    setRegistrarGeneralList: (state, action) => {
      state.totalElements = action.payload?.totalElements;
      state.totalPages = action.payload?.totalPages;
      state.currentPage = action.payload?.currentPage;
      state.registrarGeneralList = action.payload?.data;
    }
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

export const { 
  setExecutiveManagementList,
  setRegistrarGeneralList
} = executiveManagementSlice.actions;

export default executiveManagementSlice.reducer;
