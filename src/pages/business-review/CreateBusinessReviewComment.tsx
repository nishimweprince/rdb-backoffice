import Modal from '@/components/cards/Modal';
import { InputErrorMessage } from '@/components/feedback/ErrorLabels';
import Button from '@/components/inputs/Button';
import Loader from '@/components/inputs/Loader';
import TextArea from '@/components/inputs/TextArea';
import { useCreateBusinessReviewCommentMutation } from '@/states/api/businessRegApiSlice';
import {
  addBusinessReviewComment,
  setCreateBusinessReviewCommentModal,
} from '@/states/features/businessReviewCommentSlice';
import { AppDispatch, RootState } from '@/states/store';
import { useEffect } from 'react';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorResponse } from 'react-router-dom';
import { toast } from 'react-toastify';

const CreateBusinessReviewComment = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { createBusinessReviewCommentModal } = useSelector(
    (state: RootState) => state.businessReviewComment
  );
  const { selectedBusinessNavigationFlow } = useSelector(
    (state: RootState) => state.navigationFlow
  );

  // REACT HOOK FORM
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm();

  // INITIALIZE CREATE BUSINESS REVIEW COMMENT
  const [
    createBusinessReviewComment,
    {
      isLoading: isCreatingBusinessReviewComment,
      isSuccess: createBusinessReviewCommentSuccess,
      isError: createBusinessReviewCommentIsError,
      error: createBusinessReviewCommentErrror,
      data: createBusinessReviewCommentData,
    },
  ] = useCreateBusinessReviewCommentMutation();

  // HANDLE FORM SUBMISSION
  const onSubmit = (data: FieldValues) => {
    createBusinessReviewComment({
      comment: data?.comment,
      navigationFlowId: selectedBusinessNavigationFlow?.id,
    });
  };

  // HANDLE CREATE BUSINESS REVIEW COMMENT RESPONSE
  useEffect(() => {
    if (createBusinessReviewCommentSuccess) {
      toast.success('Comment added successfully');
      dispatch(addBusinessReviewComment(createBusinessReviewCommentData?.data));
      dispatch(setCreateBusinessReviewCommentModal(false));
      reset({
        comment: '',
      });
    } else if (createBusinessReviewCommentIsError) {
      const errorResponse =
        (createBusinessReviewCommentErrror as ErrorResponse)?.data?.message ||
        'An error occurred while adding comment. Refresh and try again';
      toast.error(errorResponse);
    }
  }, [
    createBusinessReviewCommentData?.data,
    createBusinessReviewCommentErrror,
    createBusinessReviewCommentIsError,
    createBusinessReviewCommentSuccess,
    dispatch,
    reset,
  ]);

  return (
    <Modal
      isOpen={createBusinessReviewCommentModal}
      onClose={() => {
        dispatch(setCreateBusinessReviewCommentModal(false));
        reset({
          comment: '',
        });
      }}
      heading={`Add comment to ${selectedBusinessNavigationFlow?.navigationFlowMass?.stepName}`}
      className="!min-w-[40vw]"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-4"
      >
        <fieldset className="grid grid-cols-1 w-full">
          <Controller
            name="comment"
            control={control}
            rules={{ required: 'Comment is required' }}
            render={({ field }) => {
              return (
                <label className="w-full flex flex-col gap-1">
                  <TextArea label={'Comment'} required {...field} />
                  {errors?.comment && (
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
              dispatch(setCreateBusinessReviewCommentModal(false));
              reset({
                comment: '',
              });
            }}
          >
            Cancel
          </Button>
          <Button primary submit>
            {isCreatingBusinessReviewComment ? <Loader /> : 'Submit'}
          </Button>
        </menu>
      </form>
    </Modal>
  );
};

export default CreateBusinessReviewComment;
