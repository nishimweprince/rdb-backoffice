import Modal from '@/components/cards/Modal';
import { InputErrorMessage } from '@/components/feedback/ErrorLabels';
import Button from '@/components/inputs/Button';
import Loader from '@/components/inputs/Loader';
import TextArea from '@/components/inputs/TextArea';
import { useUpdateBusinessReviewCommentMutation } from '@/states/api/businessRegApiSlice';
import {
  setListBusinessReviewCommentsModal,
  setSelectedBusinessReviewComment,
  setUpdateBusinessReviewComment,
  setUpdateBusinessReviewCommentModal,
} from '@/states/features/businessReviewCommentSlice';
import { AppDispatch, RootState } from '@/states/store';
import { useEffect } from 'react';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorResponse } from 'react-router-dom';
import { toast } from 'react-toastify';

const UpdateBusinessReviewComment = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { updateBusinessReviewCommentModal, selectedBusinessReviewComment } =
    useSelector((state: RootState) => state.businessReviewComment);

  // REACT HOOK FORM
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  // INITIALIZE UPDATE BUSINESS REVIEW COMMENT
  const [
    updateBusinessReviewComment,
    {
      isLoading: updateBusinessReviewCommentIsLoading,
      isSuccess: updateBusinessReviewCommentIsSuccess,
      isError: updateBusinessReviewCommentIsError,
      error: updateBusinessReviewCommentError,
      reset: resetUpdateBusinessReviewComment,
      data: updateBusinessReviewCommentData,
    },
  ] = useUpdateBusinessReviewCommentMutation();

  // HANDLE FORM SUBMISSION
  const onSubmit = (data: FieldValues) => {
    updateBusinessReviewComment({
      comment: data?.comment,
      id: selectedBusinessReviewComment?.id,
    });
  };

  // SET DEFAULT FORM VALUES
  useEffect(() => {
    if (selectedBusinessReviewComment) {
      setValue('comment', selectedBusinessReviewComment.comment);
    }
  }, [selectedBusinessReviewComment, setValue]);

  // HANDLE UPDATE BUSINESS REVIEW COMMENT RESPONSE
  useEffect(() => {
    if (updateBusinessReviewCommentIsSuccess) {
      dispatch(
        setUpdateBusinessReviewComment(updateBusinessReviewCommentData?.data)
      );
      dispatch(setUpdateBusinessReviewCommentModal(false));
      dispatch(setListBusinessReviewCommentsModal(true));
      dispatch(setSelectedBusinessReviewComment(undefined));

      reset({
        comment: '',
      });
      if (selectedBusinessReviewComment) {
        toast.success('Comment updated successfully');
      }
      dispatch(setSelectedBusinessReviewComment(undefined));
      resetUpdateBusinessReviewComment();
    } else if (updateBusinessReviewCommentIsError) {
      const errorResponse = (updateBusinessReviewCommentError as ErrorResponse)
        ?.data?.message;
      toast.error(errorResponse);
    }
  }, [
    dispatch,
    reset,
    resetUpdateBusinessReviewComment,
    selectedBusinessReviewComment,
    updateBusinessReviewCommentData?.data,
    updateBusinessReviewCommentError,
    updateBusinessReviewCommentIsError,
    updateBusinessReviewCommentIsSuccess,
  ]);

  return (
    <Modal
      isOpen={updateBusinessReviewCommentModal}
      onClose={() => {
        dispatch(setUpdateBusinessReviewCommentModal(false));
        dispatch(setSelectedBusinessReviewComment(undefined));
        reset({
          comment: '',
        });
      }}
      heading={`Update Business Review Comment for ${selectedBusinessReviewComment?.navigationFlow?.navigationFlowMass?.stepName}`}
      className={`min-w-[40vw]`}
    >
      <form
        className="flex flex-col gap-4 w-full"
        onSubmit={handleSubmit(onSubmit)}
      >
        <fieldset className="flex flex-col gap-2">
          <Controller
            name="comment"
            control={control}
            render={({ field }) => {
              return (
                <label className="w-full flex flex-col gap-1">
                  <TextArea {...field} />
                  {errors?.comment && (
                    <InputErrorMessage message={errors?.comment?.message} />
                  )}
                </label>
              );
            }}
          />
        </fieldset>
        <menu className="flex items-center gap-3 justify-between">
          <Button
            onClick={(e) => {
              e.preventDefault();
              dispatch(setSelectedBusinessReviewComment(undefined));
            }}
          >
            Cancel
          </Button>
          <Button primary submit>
            {updateBusinessReviewCommentIsLoading ? <Loader /> : 'Update'}
          </Button>
        </menu>
      </form>
    </Modal>
  );
};

export default UpdateBusinessReviewComment;
