import Modal from '@/components/cards/Modal';
import {
  removeFromBusinessAmendmentReviewComments,
  setDeleteAmendmentReviewCommentModal,
  setSelectedAmendmentReviewComment,
} from '@/states/features/businessAmendmentSlice';
import { AppDispatch, RootState } from '@/states/store';
import Button from '@/components/inputs/Button';
import { useDispatch, useSelector } from 'react-redux';
import { useDeleteAmendmentReviewCommentMutation } from '@/states/api/businessRegApiSlice';
import { useEffect } from 'react';
import Loader from '@/components/inputs/Loader';
import { ErrorResponse } from 'react-router-dom';
import { toast } from 'react-toastify';

const DeleteAmendmentReviewComment = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { deleteAmendmentReviewCommentModal, selectedAmendmentReviewComment } =
    useSelector((state: RootState) => state.businessAmendment);

  // INITIALIZE DELETE AMENDMENT REVIEW MUTATION
  const [
    deleteAmendmentReview,
    {
      isLoading: deleteAmendmentReviewIsLoading,
      isError: deleteAmendmentReviewIsError,
      isSuccess: deleteAmendmentReviewIsSuccess,
      error: deleteAmendmentReviewError,
      reset: deleteAmendmentReviewReset,
    },
  ] = useDeleteAmendmentReviewCommentMutation();

  // HANDLE DELETE AMENDMENT REVIEW COMMENT
  useEffect(() => {
    if (deleteAmendmentReviewIsSuccess) {
      deleteAmendmentReviewReset();
      if (selectedAmendmentReviewComment) {
        toast.success('Amendment review comment deleted successfully');
      }
      dispatch(
        removeFromBusinessAmendmentReviewComments(
          selectedAmendmentReviewComment?.id
        )
      );
      dispatch(setSelectedAmendmentReviewComment(undefined));
      dispatch(setDeleteAmendmentReviewCommentModal(false));
    } else if (deleteAmendmentReviewIsError) {
      const errorResponse =
        (deleteAmendmentReviewError as ErrorResponse)?.data?.message ||
        'An error occurred while deleting amendment review comment';
      toast.error(errorResponse);
    }
  }, [
    deleteAmendmentReviewError,
    deleteAmendmentReviewIsError,
    deleteAmendmentReviewIsSuccess,
    deleteAmendmentReviewReset,
    dispatch,
    selectedAmendmentReviewComment,
    selectedAmendmentReviewComment?.id,
  ]);

  return (
    <Modal
      isOpen={deleteAmendmentReviewCommentModal}
      onClose={() => {
        dispatch(setSelectedAmendmentReviewComment(undefined));
        dispatch(setDeleteAmendmentReviewCommentModal(false));
      }}
      heading={`Delete Amendment Review Comment`}
      headingClassName="text-red-600"
    >
      <p>
        Are you sure you want to delete this comment. This action cannot be
        undone!
      </p>
      <menu className="flex items-center gap-3 justify-between mt-4">
        <Button
          onClick={(e) => {
            e.preventDefault();
            dispatch(setSelectedAmendmentReviewComment(undefined));
            dispatch(setDeleteAmendmentReviewCommentModal(false));
          }}
        >
          Cancel
        </Button>
        <Button
          danger
          onClick={(e) => {
            e.preventDefault();
            deleteAmendmentReview({ id: selectedAmendmentReviewComment?.id });
          }}
        >
          {deleteAmendmentReviewIsLoading ? <Loader /> : 'Delete'}
        </Button>
      </menu>
    </Modal>
  );
};

export default DeleteAmendmentReviewComment;
