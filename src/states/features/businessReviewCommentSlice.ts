import { BusinessReviewComment } from '@/types/models/businessReviewComment';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AppDispatch } from '../store';
import { UUID } from 'crypto';
import businessRegQueryApiSlice from '../api/businessRegQueryApiSlice';
import { businessId } from '@/types/models/business';
import { removeArrayDuplicates } from '@/helpers/strings.helper';

const initialState: {
  selectedBusinessReviewComment?: BusinessReviewComment;
  businessReviewCommentsList: BusinessReviewComment[];
  createBusinessReviewCommentModal: boolean;
  businessReviewCommentsIsFetching: boolean;
  businessReviewCommentsIsSuccess: boolean;
  listBusinessReviewCommentsModal: boolean;
  deleteBusinessReviewCommentModal: boolean;
  updateBusinessReviewCommentModal: boolean;
} = {
  selectedBusinessReviewComment: undefined,
  businessReviewCommentsList: [],
  createBusinessReviewCommentModal: false,
  businessReviewCommentsIsFetching: false,
  businessReviewCommentsIsSuccess: false,
  listBusinessReviewCommentsModal: false,
  deleteBusinessReviewCommentModal: false,
  updateBusinessReviewCommentModal: false,
};

// FETCH BUSINESS REVIEW COMMENTS THUNK
export const fetchBusinessReviewCommentsThunk = createAsyncThunk<
  BusinessReviewComment[],
  { navigationFlowId: UUID; businessId?: businessId },
  { dispatch: AppDispatch }
>(
  'businessReviewComment/fetchBusinessReviewComments',
  async ({ navigationFlowId, businessId }, { dispatch }) => {
    const response = await dispatch(
      businessRegQueryApiSlice.endpoints.fetchBusinessReviewComments.initiate({
        navigationFlowId,
        businessId,
      })
    ).unwrap();
    return response.data;
  }
);

const businessReviewCommentSlice = createSlice({
  name: 'businessReviewComment',
  initialState,
  reducers: {
    setSelectedBusinessReviewComment: (state, action) => {
      state.selectedBusinessReviewComment = action.payload;
    },
    setBusinessReviewCommentsList: (state, action) => {
      state.businessReviewCommentsList = action.payload;
    },
    addBusinessReviewComment: (state, action) => {
      state.businessReviewCommentsList.unshift(action.payload);
    },
    removeBusinessReviewComment: (state, action) => {
      state.businessReviewCommentsList =
        state.businessReviewCommentsList.filter(
          (businessReviewComment) => businessReviewComment.id !== action.payload
        );
    },
    setUpdateBusinessReviewComment: (state, action) => {
      state.businessReviewCommentsList = state.businessReviewCommentsList.map(
        (businessReviewComment) =>
          businessReviewComment.id === action.payload.id
            ? action.payload
            : businessReviewComment
      );
    },
    setCreateBusinessReviewCommentModal: (state, action) => {
      state.createBusinessReviewCommentModal = action.payload;
    },
    setListBusinessReviewCommentsModal: (state, action) => {
      state.listBusinessReviewCommentsModal = action.payload;
    },
    setDeleteBusinessReviewCommentModal: (state, action) => {
      state.deleteBusinessReviewCommentModal = action.payload;
    },
    setUpdateBusinessReviewCommentModal: (state, action) => {
      state.updateBusinessReviewCommentModal = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      fetchBusinessReviewCommentsThunk.fulfilled,
      (state, action) => {
        state.businessReviewCommentsList = removeArrayDuplicates([
          ...action.payload,
          ...state.businessReviewCommentsList,
        ]) as BusinessReviewComment[];
        state.businessReviewCommentsIsFetching = false;
        state.businessReviewCommentsIsSuccess = true;
      }
    );
    builder.addCase(fetchBusinessReviewCommentsThunk.pending, (state) => {
      state.businessReviewCommentsIsFetching = true;
      state.businessReviewCommentsIsSuccess = false;
    });
    builder.addCase(fetchBusinessReviewCommentsThunk.rejected, (state) => {
      state.businessReviewCommentsIsFetching = false;
      state.businessReviewCommentsIsSuccess = false;
    });
  },
});

export const {
  setSelectedBusinessReviewComment,
  setBusinessReviewCommentsList,
  addBusinessReviewComment,
  removeBusinessReviewComment,
  setUpdateBusinessReviewComment,
  setCreateBusinessReviewCommentModal,
  setListBusinessReviewCommentsModal,
  setDeleteBusinessReviewCommentModal,
  setUpdateBusinessReviewCommentModal
} = businessReviewCommentSlice.actions;

export default businessReviewCommentSlice.reducer;
