import Modal from '@/components/cards/Modal';
import { InputErrorMessage } from '@/components/feedback/ErrorLabels';
import Button from '@/components/inputs/Button';
import Loader from '@/components/inputs/Loader';
import TextArea from '@/components/inputs/TextArea';
import { useUpdateBusinessGeneralCommentMutation } from '@/states/api/businessRegApiSlice';
import {
  setSelectedBusinessGeneralComment,
  setUpdateBusinessGeneralComment,
  setUpdateBusinessGeneralCommentModal,
} from '@/states/features/businessSlice';
import { AppDispatch, RootState } from '@/states/store';
import { useEffect } from 'react';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorResponse } from 'react-router-dom';
import { toast } from 'react-toastify';

const UpdateBusinessGeneralComment = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { updateBusinessGeneralCommentModal, selectedBusinessGeneralComment } =
    useSelector((state: RootState) => state.business);

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
    if (selectedBusinessGeneralComment) {
      setValue('comment', selectedBusinessGeneralComment?.comment);
    }
  }, [selectedBusinessGeneralComment, setValue]);

  // INITIALIZE UPDATE BUSINESS GENERAL COMMENT MUTATION
  const [
    updateBusinessGeneralComment,
    {
      data: updateBusinessGeneralCommentData,
      isLoading: updateBusinessGeneralCommentIsLoading,
      isSuccess: updateBusinessGeneralCommentIsSuccess,
      isError: updateBusinessGeneralCommentIsError,
      error: updateBusinessGeneralCommentErrorData,
      reset: resetUpdateBusinessGeneralComment,
    },
  ] = useUpdateBusinessGeneralCommentMutation();

  // HANDLE FORM SUBMISSION
  const onSubmit = (data: FieldValues) => {
    updateBusinessGeneralComment({
      id: selectedBusinessGeneralComment?.id,
      comment: data?.comment,
    });
  };

  // HANDLE UPDATE BUSINESS GENERAL COMMENT RESPONSE
  useEffect(() => {
    if (updateBusinessGeneralCommentIsError) {
      const errorResponse =
        (updateBusinessGeneralCommentErrorData as ErrorResponse)?.data
          ?.message ||
        'An error occurred while updating business general comment';
      toast.error(errorResponse);
    } else if (updateBusinessGeneralCommentIsSuccess) {
      dispatch(setSelectedBusinessGeneralComment(undefined));
      if (selectedBusinessGeneralComment?.id) {
        toast.success('Business general comment updated successfully');
      }
      dispatch(
        setUpdateBusinessGeneralComment(updateBusinessGeneralCommentData?.data)
      );
      resetUpdateBusinessGeneralComment();
      dispatch(setUpdateBusinessGeneralCommentModal(false));
    }
  }, [
    dispatch,
    resetUpdateBusinessGeneralComment,
    selectedBusinessGeneralComment?.id,
    updateBusinessGeneralCommentData?.data,
    updateBusinessGeneralCommentErrorData,
    updateBusinessGeneralCommentIsError,
    updateBusinessGeneralCommentIsSuccess,
  ]);

  return (
    <Modal
      isOpen={updateBusinessGeneralCommentModal}
      onClose={() => {
        dispatch(setSelectedBusinessGeneralComment(undefined));
        dispatch(setUpdateBusinessGeneralCommentModal(false));
      }}
      heading={`Update Comment`}
      className="min-w-[55vw] z-[15000]"
    >
      <form
        className="w-full flex flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <fieldset className="w-full flex flex-col gap-4">
          <Controller
            name="comment"
            control={control}
            rules={{ required: 'Comment is required' }}
            render={({ field }) => {
              return (
                <label className="w-full flex flex-col gap-1">
                  <TextArea
                    {...field}
                    label={'Comment'}
                    required
                    placeholder="Enter comment"
                  />
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
              dispatch(setSelectedBusinessGeneralComment(undefined));
              dispatch(setUpdateBusinessGeneralCommentModal(false));
            }}
          >
            Cancel
          </Button>
          <Button disabled={!comment} primary submit>
            {updateBusinessGeneralCommentIsLoading ? <Loader /> : 'Update'}
          </Button>
        </menu>
      </form>
    </Modal>
  );
};

export default UpdateBusinessGeneralComment;
