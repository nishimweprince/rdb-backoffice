import Modal from '@/components/cards/Modal';
import Button from '@/components/inputs/Button';
import Loader from '@/components/inputs/Loader';
import { useDeleteBusinessReviewCommentMutation } from '@/states/api/businessRegApiSlice';
import {
  removeBusinessReviewComment,
  setDeleteBusinessReviewCommentModal,
  setListBusinessReviewCommentsModal,
  setSelectedBusinessReviewComment,
} from '@/states/features/businessReviewCommentSlice';
import { AppDispatch, RootState } from '@/states/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorResponse } from 'react-router-dom';
import { toast } from 'react-toastify';

const DeleteBusinessReviewComment = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { deleteBusinessReviewCommentModal, selectedBusinessReviewComment } =
    useSelector((state: RootState) => state.businessReviewComment);

  // INITIALIZE DELETE BUSINESS REVIEW MUTATION
  const [
    deleteBusinessReviewComment,
    {
      isLoading: deleteBusinessReviewCommentIsLoading,
      isSuccess: deleteBusinessReviewCommentIsSuccess,
      isError: deleteBusinessReviewCommentIsError,
      error: deleteBusinessReviewCommentError,
      reset: resetDeleteBusinessReviewComment,
    },
  ] = useDeleteBusinessReviewCommentMutation();

  // HANDLE DELETE BUSINESS REVIEW COMMENT
  useEffect(() => {
    if (deleteBusinessReviewCommentIsSuccess) {
      dispatch(setDeleteBusinessReviewCommentModal(false));
      dispatch(setListBusinessReviewCommentsModal(true));
      dispatch(removeBusinessReviewComment(selectedBusinessReviewComment?.id));
      resetDeleteBusinessReviewComment();
      if (selectedBusinessReviewComment) {
        toast.success('Comment deleted successfully');
      }
      dispatch(setSelectedBusinessReviewComment(undefined));
    } else if (deleteBusinessReviewCommentIsError) {
      const errorResponse = (deleteBusinessReviewCommentError as ErrorResponse)
        ?.data?.message;
      toast.error(errorResponse);
    }
  }, [
    deleteBusinessReviewCommentError,
    deleteBusinessReviewCommentIsError,
    deleteBusinessReviewCommentIsSuccess,
    dispatch,
    resetDeleteBusinessReviewComment,
    selectedBusinessReviewComment,
    selectedBusinessReviewComment?.id,
  ]);

  return (
    <Modal
      isOpen={deleteBusinessReviewCommentModal}
      onClose={() => {
        dispatch(setDeleteBusinessReviewCommentModal(false));
        dispatch(setSelectedBusinessReviewComment(undefined));
        dispatch(setListBusinessReviewCommentsModal(true));
      }}
      heading={`Delete Comment for ${selectedBusinessReviewComment?.navigationFlow?.navigationFlowMass?.stepName}`}
      className={`z-[50000]`}
      headingClassName={`text-red-600`}
    >
      Are you sure you want to delete this comment? This action cannot be
      undone.
      <menu className="flex items-center gap-3 justify-between mt-4">
        <Button
          onClick={(e) => {
            e.preventDefault();
            dispatch(setDeleteBusinessReviewCommentModal(false));
            dispatch(setSelectedBusinessReviewComment(undefined));
            dispatch(setListBusinessReviewCommentsModal(true));
          }}
        >
          Cancel
        </Button>
        <Button
          danger
          onClick={(e) => {
            e.preventDefault();
            deleteBusinessReviewComment({
              id: selectedBusinessReviewComment?.id,
            });
          }}
        >
          {deleteBusinessReviewCommentIsLoading ? <Loader /> : 'Delete'}
        </Button>
      </menu>
    </Modal>
  );
};

export default DeleteBusinessReviewComment;
