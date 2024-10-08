import { BusinessAmendment, businessId } from '@/types/models/business';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import businessRegQueryApiSlice from '../api/businessRegQueryApiSlice';
import { UUID } from 'crypto';
import { AppDispatch } from '../store';
import { toast } from 'react-toastify';
import { BusinessAmendmentReviewComment } from '@/types/models/businessAmendmentReviewComment';
import businessRegApiSlice from '../api/businessRegApiSlice';

const initialState: {
  businessAmendmentDetails?: BusinessAmendment;
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
  rejectAmendmentIsLoading: boolean;
  rejectAmendmentIsSuccess: boolean;
  approveAmendmentIsLoading: boolean;
  approveAmendmentIsSuccess: boolean;
  recommendAmendmentRejectionIsLoading: boolean;
  recommendAmendmentRejectionIsSuccess: boolean;
  updateAmendmentReviewCommentModal: boolean;
} = {
  businessAmendmentsList: [],
  businessAmendmentDetails: undefined,
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
  rejectAmendmentIsLoading: false,
  rejectAmendmentIsSuccess: false,
  approveAmendmentIsLoading: false,
  approveAmendmentIsSuccess: false,
  recommendAmendmentRejectionIsLoading: false,
  recommendAmendmentRejectionIsSuccess: false,
  updateAmendmentReviewCommentModal: false,
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
>(
  `businessAmendment/updateBusinessAmendmentStatus`,
  async ({ id, amendmentStatus }, { dispatch }) => {
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
  }
);

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

// APPROVE AMENDMENT THUNK
export const approveAmendmentThunk = createAsyncThunk<
  void,
  { amendmentId: UUID },
  { dispatch: AppDispatch }
>('business/approveAmendment', async ({ amendmentId }, { dispatch }) => {
  try {
    await dispatch(
      businessRegApiSlice.endpoints.approveAmendment.initiate({
        amendmentId,
      })
    ).unwrap();
  } catch (error) {
    toast.error('An error occurred while approving amendment');
    throw error;
  }
});

// REJECT AMENDMENT THUNK
export const rejectAmendmentThunk = createAsyncThunk<
  void,
  { amendmentId: UUID; entityId: UUID },
  { dispatch: AppDispatch }
>(
  'business/rejectAmendment',
  async ({ amendmentId, entityId }, { dispatch }) => {
    try {
      await dispatch(
        businessRegApiSlice.endpoints.rejectAmendment.initiate({
          amendmentId,
          entityId,
        })
      ).unwrap();
    } catch (error) {
      toast.error('An error occurred while rejecting amendment');
      throw error;
    }
  }
);

// RECOMMEND AMENDMENT REJECTION THUNK
export const recommendAmendmentRejectionThunk = createAsyncThunk<
  void,
  { amendmentId: UUID },
  { dispatch: AppDispatch }
>(
  `business/recommendAmendmentRejection`,
  async ({ amendmentId }, { dispatch }) => {
    try {
      const response = await dispatch(
        businessRegApiSlice.endpoints.recommendAmendmentRejection.initiate({
          amendmentId,
        })
      );
      return response.data.data;
    } catch (error) {
      toast.error('An error occurred while recommending amendment rejection');
      throw error;
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
    setUpdateAmendmentReviewCommentModal: (state, action) => {
      state.updateAmendmentReviewCommentModal = action.payload;
    },
    setBusinessAmendmentDetails: (state, action) => {
      state.businessAmendmentDetails = action.payload;
    },
    setUpdateBusinessAmendmentReviewComment: (state, action) => {
      state.businessAmendmentReviewComments =
        state.businessAmendmentReviewComments.map((item) => {
          if (item.id === action.payload.id) {
            return action.payload;
          }
          return item;
        });
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
    builder.addCase(recommendAmendmentForApprovalThunk.fulfilled, (state) => {
      state.recommendAmendmentForApprovalIsLoading = false;
      state.recommendAmendmentForApprovalIsSuccess = true;
    });
    builder.addCase(recommendAmendmentForApprovalThunk.rejected, (state) => {
      state.recommendAmendmentForApprovalIsLoading = false;
      state.recommendAmendmentForApprovalIsSuccess = false;
    });
    builder.addCase(approveAmendmentThunk.pending, (state) => {
      state.approveAmendmentIsLoading = true;
      state.approveAmendmentIsSuccess = false;
    });
    builder.addCase(approveAmendmentThunk.fulfilled, (state) => {
      state.approveAmendmentIsLoading = false;
      state.approveAmendmentIsSuccess = true;
    });
    builder.addCase(approveAmendmentThunk.rejected, (state) => {
      state.approveAmendmentIsLoading = false;
      state.approveAmendmentIsSuccess = false;
    });
    builder.addCase(rejectAmendmentThunk.pending, (state) => {
      state.rejectAmendmentIsLoading = true;
      state.rejectAmendmentIsSuccess = false;
    });
    builder.addCase(rejectAmendmentThunk.fulfilled, (state) => {
      state.rejectAmendmentIsLoading = false;
      state.rejectAmendmentIsSuccess = true;
    });
    builder.addCase(rejectAmendmentThunk.rejected, (state) => {
      state.rejectAmendmentIsLoading = false;
      state.rejectAmendmentIsSuccess = false;
    });
    builder.addCase(recommendAmendmentRejectionThunk.pending, (state) => {
      state.recommendAmendmentRejectionIsLoading = true;
      state.recommendAmendmentRejectionIsSuccess = false;
    });
    builder.addCase(recommendAmendmentRejectionThunk.fulfilled, (state) => {
      state.recommendAmendmentRejectionIsLoading = false;
      state.recommendAmendmentRejectionIsSuccess = true;
    });
    builder.addCase(recommendAmendmentRejectionThunk.rejected, (state) => {
      state.recommendAmendmentRejectionIsLoading = false;
      state.recommendAmendmentRejectionIsSuccess = false;
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
  setUpdateAmendmentReviewCommentModal,
  setBusinessAmendmentDetails,
  setUpdateBusinessAmendmentReviewComment,
} = businessAmendmentSlice.actions;

export default businessAmendmentSlice.reducer;
