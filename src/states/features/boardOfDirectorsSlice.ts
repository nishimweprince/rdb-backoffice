import { businessId } from '@/types/models/business';
import { PersonDetail } from '@/types/models/personDetail';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AppDispatch } from '../store';
import businessRegQueryApiSlice from '../api/businessRegQueryApiSlice';
import { toast } from 'react-toastify';

const initialState: {
  boardOfDirectorsList: PersonDetail[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  boardOfDirectorsIsFetching: boolean;
  boardOfDirectorsIsSuccess: boolean;
} = {
  boardOfDirectorsList: [],
  page: 1,
  size: 10,
  totalElements: 0,
  totalPages: 1,
  boardOfDirectorsIsFetching: false,
  boardOfDirectorsIsSuccess: false,
};

// FETCH BOARD OF DIRECTORS LIST
export const fetchBoardOfDirectorsThunk = createAsyncThunk<
  PersonDetail[],
  { businessId: businessId; route: 'management' | 'board-member' },
  { dispatch: AppDispatch }
>(
  'business/fetchBoardOfDirectors',
  async ({ businessId, route = 'board-member' }, { dispatch }) => {
    try {
      const response = await dispatch(
        businessRegQueryApiSlice.endpoints.fetchBusinessPeople.initiate({
          businessId,
          route,
        })
      ).unwrap();
      return response?.data;
    } catch (error) {
      toast.error('An error occurred while fetching business activities');
      throw error;
    }
  }
);

const boardOfDirectorsSlice = createSlice({
  name: 'boardOfDirectors',
  initialState,
  reducers: {
    setBoardOfDirectorsList: (state, action) => {
      state.boardOfDirectorsList = action.payload;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setSize: (state, action) => {
      state.size = action.payload;
    },
    setTotalElements: (state, action) => {
      state.totalElements = action.payload;
    },
    setTotalPages: (state, action) => {
      state.totalPages = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchBoardOfDirectorsThunk.pending, (state) => {
      state.boardOfDirectorsIsFetching = true;
      state.boardOfDirectorsIsSuccess = false;
    });
    builder.addCase(fetchBoardOfDirectorsThunk.fulfilled, (state, action) => {
      state.boardOfDirectorsIsFetching = false;
      state.boardOfDirectorsIsSuccess = true;
      state.boardOfDirectorsList = action.payload;
    });
    builder.addCase(fetchBoardOfDirectorsThunk.rejected, (state) => {
      state.boardOfDirectorsIsFetching = false;
      state.boardOfDirectorsIsSuccess = false;
    });
  },
});

export const {
  setBoardOfDirectorsList,
  setPage,
  setSize,
  setTotalElements,
  setTotalPages,
} = boardOfDirectorsSlice.actions;

export default boardOfDirectorsSlice.reducer;
