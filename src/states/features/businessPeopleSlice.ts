import { PersonDetail } from '@/types/models/personDetail';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import businessRegQueryApiSlice from '../api/businessRegQueryApiSlice';
import { AppDispatch } from '../store';
import { toast } from 'react-toastify';
import { UUID } from 'crypto';
import { PersonAttachment } from '@/types/models/attachment';

const initialState: {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  selectedBusinessPerson?: PersonDetail;
  businessPersonDetailsModal: boolean;
  businessPersonIsFetching: boolean;
  businessPersonIsSuccess: boolean;
  businessPerson?: PersonDetail;
  personAttachmentsIsFetching: boolean;
  personAttachmentsIsError: boolean;
  personAttachmentsIsSuccess: boolean;
  personAttachmentsList: PersonAttachment[];
} = {
  page: 1,
  size: 10,
  totalElements: 0,
  totalPages: 1,
  selectedBusinessPerson: undefined,
  businessPersonDetailsModal: false,
  businessPersonIsFetching: false,
  businessPersonIsSuccess: false,
  businessPerson: undefined,
  personAttachmentsIsFetching: false,
  personAttachmentsIsError: false,
  personAttachmentsIsSuccess: false,
  personAttachmentsList: [],
};

// GET BUSINESS PERSON THUNK
export const getBusinessPersonThunk = createAsyncThunk<
  PersonDetail,
  { id: UUID },
  { dispatch: AppDispatch }
>('business/getBusinessPerson', async ({ id }, { dispatch }) => {
  try {
    const response = await dispatch(
      businessRegQueryApiSlice.endpoints.getBusinessPersonDetails.initiate({
        id,
      })
    ).unwrap();
    return response?.data;
  } catch (error) {
    toast.error('An error occurred while fetching business person');
    throw error;
  }
});

// FETCH PERSON ATTACHMENTS THUNK
export const fetchPersonAttachmentsThunk = createAsyncThunk<
  PersonDetail,
  { personId: UUID },
  { dispatch: AppDispatch }
>('business/fetchPersonAttachments', async ({ personId }, { dispatch }) => {
  try {
    const response = await dispatch(
      businessRegQueryApiSlice.endpoints.fetchPersonAttachments.initiate({
        personId,
      })
    ).unwrap();
    dispatch(setPersonAttachmentsList(response?.data));
    return response?.data;
  } catch (error) {
    toast.error('An error occurred while fetching person attachments');
    throw error;
  }
});

const businessPeopleSlice = createSlice({
  name: 'businessPeople',
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setSize: (state, action) => {
      state.size = action.payload;
    },
    setTotalElements: (state, action) => {
      state.totalElements = action.payload;
    },
    setSelectedBusinessPerson: (state, action) => {
      state.selectedBusinessPerson = action.payload;
    },
    setTotalPages: (state, action) => {
      state.totalPages = action.payload;
    },
    setBusinessPersonDetailsModal: (state, action) => {
      state.businessPersonDetailsModal = action.payload;
    },
    setBusinessPerson: (state, action) => {
      state.businessPerson = action.payload;
    },
    setPersonAttachmentsList: (state, action) => {
      state.personAttachmentsList = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getBusinessPersonThunk.pending, (state) => {
      state.businessPersonIsFetching = true;
      state.businessPersonIsSuccess = false;
    });
    builder.addCase(getBusinessPersonThunk.fulfilled, (state, action) => {
      state.selectedBusinessPerson = action.payload;
      state.businessPersonIsFetching = false;
      state.businessPersonIsSuccess = true;
    });
    builder.addCase(getBusinessPersonThunk.rejected, (state) => {
      state.businessPersonIsFetching = false;
      state.businessPersonIsSuccess = false;
    });
    builder.addCase(fetchPersonAttachmentsThunk.pending, (state) => {
      state.personAttachmentsIsFetching = true;
      state.personAttachmentsIsSuccess = false;
    })
    builder.addCase(fetchPersonAttachmentsThunk.fulfilled, (state) => {
      state.personAttachmentsIsFetching = false;
      state.personAttachmentsIsSuccess = true;
    })
    builder.addCase(fetchPersonAttachmentsThunk.rejected, (state) => {
      state.personAttachmentsIsFetching = false;
      state.personAttachmentsIsSuccess = false;
    })
  },
});

export const {
  setPage,
  setSize,
  setTotalElements,
  setSelectedBusinessPerson,
  setTotalPages,
  setBusinessPersonDetailsModal,
  setBusinessPerson,
  setPersonAttachmentsList
} = businessPeopleSlice.actions;

export default businessPeopleSlice.reducer;
