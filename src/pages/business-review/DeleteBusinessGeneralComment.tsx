import Modal from '@/components/cards/Modal';
import Button from '@/components/inputs/Button';
import Loader from '@/components/inputs/Loader';
import { useDeleteBusinessGeneralCommentMutation } from '@/states/api/businessRegApiSlice';
import {
  removeFromBusinessGeneralCommentsList,
  setDeleteBusinessGeneralCommentModal,
  setSelectedBusinessGeneralComment,
} from '@/states/features/businessSlice';
import { AppDispatch, RootState } from '@/states/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorResponse } from 'react-router-dom';
import { toast } from 'react-toastify';

const DeleteBusinessGeneralComment = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { deleteBusinessGeneralCommentModal, selectedBusinessGeneralComment } =
    useSelector((state: RootState) => state.business);

  // INITIALIZE DELETE BUSINESS GENERAL COMMENT MUTATION
  const [
    deleteBusinessGeneralComment,
    {
      isLoading: deleteBusinessGeneralCommentIsLoading,
      isSuccess: deleteBusinessGeneralCommentIsSuccess,
      isError: deleteBusinessGeneralCommentIsError,
      error: deleteBusinessGeneralCommentError,
      reset: resetDeleteBusinessGeneralComment,
    },
  ] = useDeleteBusinessGeneralCommentMutation();

  // HANDLE BUSINESS GENERAL COMMENT RESPONSE
  useEffect(() => {
    if (deleteBusinessGeneralCommentIsError) {
      const errorResponse =
        (deleteBusinessGeneralCommentError as ErrorResponse)?.data?.message ||
        'An error occurred while deleting business general comment';
      toast.error(errorResponse);
    } else if (deleteBusinessGeneralCommentIsSuccess) {
      dispatch(
        removeFromBusinessGeneralCommentsList(
          selectedBusinessGeneralComment?.id
        )
      );
      resetDeleteBusinessGeneralComment();
      dispatch(setSelectedBusinessGeneralComment(undefined));
      if (selectedBusinessGeneralComment?.id) {
        toast.success('Business general comment deleted successfully');
      }
      dispatch(setDeleteBusinessGeneralCommentModal(false));
    }
  }, [
    deleteBusinessGeneralCommentError,
    deleteBusinessGeneralCommentIsError,
    deleteBusinessGeneralCommentIsSuccess,
    dispatch,
    resetDeleteBusinessGeneralComment,
    selectedBusinessGeneralComment?.id,
  ]);

  return (
    <Modal
      isOpen={deleteBusinessGeneralCommentModal}
      onClose={() => {
        dispatch(setSelectedBusinessGeneralComment(undefined));
        dispatch(setDeleteBusinessGeneralCommentModal(false));
      }}
      heading={`Delete Comment`}
      headingClassName="text-[15px] text-red-600"
      className="z-[15000]"
    >
      <article className="w-full flex flex-col gap-4">
        <h3 className="text-[15px]">
          Are you sure you want to remove this comment? The action cannot be
          undone.
        </h3>
        <menu className="w-full flex items-center gap-3 justify-between">
          <Button
            onClick={(e) => {
              e.preventDefault();
              dispatch(setSelectedBusinessGeneralComment(undefined));
              dispatch(setDeleteBusinessGeneralCommentModal(false));
            }}
          >
            Cancel
          </Button>
          <Button
            danger
            onClick={(e) => {
              e.preventDefault();
              deleteBusinessGeneralComment({
                id: selectedBusinessGeneralComment?.id,
              });
            }}
          >
            {deleteBusinessGeneralCommentIsLoading ? <Loader /> : 'Delete'}
          </Button>
        </menu>
      </article>
    </Modal>
  );
};

export default DeleteBusinessGeneralComment;
