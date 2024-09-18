import Modal from '@/components/cards/Modal';
import { InputErrorMessage } from '@/components/feedback/ErrorLabels';
import Button from '@/components/inputs/Button';
import Loader from '@/components/inputs/Loader';
import TextArea from '@/components/inputs/TextArea';
import { useUpdateAmendmentReviewCommentMutation } from '@/states/api/businessRegApiSlice';
import {
  setSelectedAmendmentReviewComment,
  setUpdateAmendmentReviewCommentModal,
  setUpdateBusinessAmendmentReviewComment,
} from '@/states/features/businessAmendmentSlice';
import { AppDispatch, RootState } from '@/states/store';
import { useEffect } from 'react';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorResponse } from 'react-router-dom';
import { toast } from 'react-toastify';

const UpdateAmendmentReviewComment = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { updateAmendmentReviewCommentModal, selectedAmendmentReviewComment } =
    useSelector((state: RootState) => state.businessAmendment);

  // REACT HOOK FORM
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm();
  const { comment } = watch();

  // SET DEFAULT VALUES
  useEffect(() => {
    if (selectedAmendmentReviewComment) {
      setValue('comment', selectedAmendmentReviewComment.comment);
    }
  }, [selectedAmendmentReviewComment, setValue]);

  // INITIALIZE UPDATE AMENDMENT REVIEW COMMENT
  const [
    updateAmendmentReviewComment,
    {
      isLoading: updateAmendmentReviewCommentIsLoading,
      isError: updateAmendmentReviewCommentIsError,
      isSuccess: updateAmendmentReviewCommentIsSuccess,
      error: updateAmendmentReviewCommentError,
      reset: updateAmendmentReviewCommentReset,
      data: updateAmendmentReviewCommentData,
    },
  ] = useUpdateAmendmentReviewCommentMutation();

  // HANDLE FORM SUBMISSION
  const onSubmit = (data: FieldValues) => {
    updateAmendmentReviewComment({
      id: selectedAmendmentReviewComment?.id,
      comment: data?.comment,
    });
  };

  // HANDLE UPDATE AMENDMENT REVIEW COMMENT
  useEffect(() => {
    if (updateAmendmentReviewCommentIsSuccess) {
      if (selectedAmendmentReviewComment) {
        toast.success('Amendment review comment updated successfully');
      }
      dispatch(setSelectedAmendmentReviewComment(undefined));
      dispatch(
        setUpdateBusinessAmendmentReviewComment(
          updateAmendmentReviewCommentData?.data
        )
      );
      updateAmendmentReviewCommentReset();
      dispatch(setUpdateAmendmentReviewCommentModal(false));
    } else if (updateAmendmentReviewCommentIsError) {
      const errorResponse =
        (updateAmendmentReviewCommentError as ErrorResponse)?.data?.message ||
        'An error occurred while updating amendment review comment';
      toast.error(errorResponse);
    }
  }, [
    dispatch,
    selectedAmendmentReviewComment,
    updateAmendmentReviewCommentData?.data,
    updateAmendmentReviewCommentError,
    updateAmendmentReviewCommentIsError,
    updateAmendmentReviewCommentIsSuccess,
    updateAmendmentReviewCommentReset,
  ]);

  return (
    <Modal
      isOpen={updateAmendmentReviewCommentModal}
      onClose={() => {
        dispatch(setUpdateAmendmentReviewCommentModal(false));
        dispatch(setSelectedAmendmentReviewComment(undefined));
      }}
      heading={`Update Amendment Review Comment`}
      className="min-w-[55vw]"
    >
      <form
        className="w-full flex flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <fieldset className="w-full flex flex-col gap-2">
          <Controller
            name="comment"
            rules={{ required: 'Comment is required' }}
            control={control}
            render={({ field }) => {
              return (
                <label className="w-full flex flex-col gap-1">
                  <TextArea
                    {...field}
                    placeholder="Enter review comment"
                    required
                    label={`Comment`}
                  />
                  {errors.comment && (
                    <InputErrorMessage message={errors?.comment?.message} />
                  )}
                </label>
              );
            }}
          />
        </fieldset>
        <menu className="w-full flex items-center gap-3 justify-between">
          <Button
            onClick={(e) => {
              e.preventDefault();
              dispatch(setUpdateAmendmentReviewCommentModal(false));
              dispatch(setSelectedAmendmentReviewComment(undefined));
            }}
          >
            Cancel
          </Button>
          <Button submit primary disabled={!comment}>
            {updateAmendmentReviewCommentIsLoading ? <Loader /> : 'Update'}
          </Button>
        </menu>
      </form>
    </Modal>
  );
};

export default UpdateAmendmentReviewComment;
