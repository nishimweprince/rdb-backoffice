import { BusinessAmendment, businessId } from '@/types/models/business';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import businessRegQueryApiSlice from '../api/businessRegQueryApiSlice';
import { UUID } from 'crypto';
import { AppDispatch } from '../store';
import { toast } from 'react-toastify';
import { BusinessAmendmentReviewComment } from '@/types/models/businessAmendmentReviewComment';
import businessRegApiSlice from '../api/businessRegApiSlice';

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
  businessAmendmentReviewComments: BusinessAmendmentReviewComment[];
  businessAmendmentReviewCommentsIsFetching: boolean;
  businessAmendmentReviewCommentsIsSuccess: boolean;
  businessAmendmentReviewCommentsIsError: boolean;
  deleteAmendmentReviewCommentModal: boolean;
  selectedAmendmentReviewComment?: BusinessAmendmentReviewComment;
  updateBusinessAmendmentStatusIsLoading: boolean;
  updateBusinessAmendmentStatusIsSuccess: boolean;
  recommendAmendmentForApprovalIsLoading: boolean;
  recommendAmendmentForApprovalIsSuccess: boolean;
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
  businessAmendmentReviewComments: [],
  businessAmendmentReviewCommentsIsFetching: false,
  businessAmendmentReviewCommentsIsSuccess: false,
  businessAmendmentReviewCommentsIsError: false,
  deleteAmendmentReviewCommentModal: false,
  selectedAmendmentReviewComment: undefined,
  updateBusinessAmendmentStatusIsLoading: false,
  updateBusinessAmendmentStatusIsSuccess: false,
  recommendAmendmentForApprovalIsLoading: false,
  recommendAmendmentForApprovalIsSuccess: false,
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

// FETCH AMENDMENT REVIEW COMMENTS THUNK
export const fetchAmendmentReviewCommentsThunk = createAsyncThunk<
  BusinessAmendmentReviewComment[],
  { amendmentDetailId: UUID },
  { dispatch: AppDispatch }
>(
  `businessAmendment/fetchAmendmentReviewComments`,
  async ({ amendmentDetailId }, { dispatch }) => {
    try {
      const response = await dispatch(
        businessRegQueryApiSlice.endpoints.fetchAmendmentReviewComments.initiate(
          {
            amendmentDetailId,
          }
        )
      );
      return response?.data?.data;
    } catch (error) {
      toast.error('Failed to fetch amendment review comments');
    }
  }
);

// UPDATE BUSINESS AMENDMENT STATUS
export const updateBusinessAmendmentStatusThunk = createAsyncThunk<
  BusinessAmendment,
  { id: UUID; amendmentStatus: string },
  { dispatch: AppDispatch }
>(`businessAmendment/updateBusinessAmendmentStatus`, async ({ id, amendmentStatus }, { dispatch }) => {
  try {
    const response = await dispatch(
      businessRegApiSlice.endpoints.updateBusinessAmendmentStatus.initiate({
        id,
        amendmentStatus,
      })
    );
    return response?.data?.data;
  } catch (error) {
    toast.error('Failed to update business amendment status');
  }
});

// RECOMMEND AMENDMENT FOR APPROVAL
export const recommendAmendmentForApprovalThunk = createAsyncThunk<
  BusinessAmendment,
  { amendmentId: UUID },
  { dispatch: AppDispatch }
>(
  `businessAmendment/recommendAmendmentForApproval`,
  async ({ amendmentId }, { dispatch }) => {
    try {
      const response = await dispatch(
        businessRegApiSlice.endpoints.recommendAmendmentForApproval.initiate({
          amendmentId,
        })
      );
      return response?.data;
    } catch (error) {
      toast.error('Failed to recommend amendment for approval');
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
    setBusinessAmendmentReviewComments(state, action) {
      state.businessAmendmentReviewComments = action.payload;
    },
    addToBusinessAmendmentReviewComments(state, action) {
      state.businessAmendmentReviewComments.unshift(action.payload);
    },
    removeFromBusinessAmendmentReviewComments(state, action) {
      state.businessAmendmentReviewComments =
        state.businessAmendmentReviewComments.filter(
          (item) => item.id !== action.payload
        );
    },
    setDeleteAmendmentReviewCommentModal: (state, action) => {
      state.deleteAmendmentReviewCommentModal = action.payload;
    },
    setSelectedAmendmentReviewComment: (state, action) => {
      state.selectedAmendmentReviewComment = action.payload;
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
    builder.addCase(
      fetchAmendmentReviewCommentsThunk.fulfilled,
      (state, action) => {
        state.businessAmendmentReviewComments = action.payload;
        state.businessAmendmentReviewCommentsIsSuccess = true;
        state.businessAmendmentReviewCommentsIsFetching = false;
      }
    );
    builder.addCase(fetchAmendmentReviewCommentsThunk.pending, (state) => {
      state.businessAmendmentReviewCommentsIsFetching = true;
      state.businessAmendmentReviewCommentsIsSuccess = false;
    });
    builder.addCase(fetchAmendmentReviewCommentsThunk.rejected, (state) => {
      state.businessAmendmentReviewCommentsIsFetching = false;
      state.businessAmendmentReviewCommentsIsSuccess = false;
    });
    builder.addCase(updateBusinessAmendmentStatusThunk.pending, (state) => {
      state.updateBusinessAmendmentStatusIsLoading = true;
      state.updateBusinessAmendmentStatusIsSuccess = false;
    });
    builder.addCase(
      updateBusinessAmendmentStatusThunk.fulfilled,
      (state, action) => {
        state.updateBusinessAmendmentStatusIsLoading = false;
        state.updateBusinessAmendmentStatusIsSuccess = true;
        state.businessAmendmentsList = state.businessAmendmentsList.map(
          (item) => {
            if (item.id === action.payload.id) {
              return action.payload;
            }
            return item;
          }
        );
      }
    );
    builder.addCase(updateBusinessAmendmentStatusThunk.rejected, (state) => {
      state.updateBusinessAmendmentStatusIsLoading = false;
      state.updateBusinessAmendmentStatusIsSuccess = false;
    });
    builder.addCase(recommendAmendmentForApprovalThunk.pending, (state) => {
      state.recommendAmendmentForApprovalIsLoading = true;
      state.recommendAmendmentForApprovalIsSuccess = false;
    });
    builder.addCase(
      recommendAmendmentForApprovalThunk.fulfilled,
      (state) => {
        state.recommendAmendmentForApprovalIsLoading = false;
        state.recommendAmendmentForApprovalIsSuccess = true;
      }
    );
    builder.addCase(recommendAmendmentForApprovalThunk.rejected, (state) => {
      state.recommendAmendmentForApprovalIsLoading = false;
      state.recommendAmendmentForApprovalIsSuccess = false;
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
  setBusinessAmendmentReviewComments,
  addToBusinessAmendmentReviewComments,
  setDeleteAmendmentReviewCommentModal,
  setSelectedAmendmentReviewComment,
  removeFromBusinessAmendmentReviewComments,
} = businessAmendmentSlice.actions;

export default businessAmendmentSlice.reducer;
