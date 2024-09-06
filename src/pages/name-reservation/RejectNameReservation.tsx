import Modal from '@/components/cards/Modal';
import { InputErrorMessage } from '@/components/feedback/ErrorLabels';
import Button from '@/components/inputs/Button';
import Loader from '@/components/inputs/Loader';
import TextArea from '@/components/inputs/TextArea';
import { useRejectNameReservationMutation } from '@/states/api/businessRegApiSlice';
import {
  setNameReservationDetailsModal,
  setRejectNameReservationModal,
  setSelectedNameReservation,
  updateNameReservation,
} from '@/states/features/nameReservationSlice';
import { AppDispatch, RootState } from '@/states/store';
import { useEffect } from 'react';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

const RejectNameReservation = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { rejectNameReservationModal, selectedNameReservation } = useSelector(
    (state: RootState) => state.nameReservation
  );

  // INITIALIZE REJECT NAME RESERVATION
  const [
    rejectNameReservation,
    {
      data: rejectNameReservationData,
      error: rejectNameReservationError,
      isLoading: rejectNameReservationIsLoading,
      isSuccess: rejectNameReservationIsSuccess,
      isError: rejectNameReservationIsError,
      reset: resetRejectNameReservation,
    },
  ] = useRejectNameReservationMutation();

  // REACT HOOK FORM
  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm();

  const { comment } = watch();

  // HANDLE FORM SUBMISSION
  const onSubmit = (data: FieldValues) => {
    rejectNameReservation({
      id: selectedNameReservation?.id,
      comment: data.comment,
    });
  };

  // HANDLE REJECT NAME RESERVATION RESPONSE
  useEffect(() => {
    if (rejectNameReservationIsSuccess) {
      dispatch(updateNameReservation(rejectNameReservationData?.data));
      dispatch(setRejectNameReservationModal(false));
      dispatch(setSelectedNameReservation(undefined));
      dispatch(setNameReservationDetailsModal(false));
      resetRejectNameReservation();
    }
    if (rejectNameReservationIsError) {
      console.error(rejectNameReservationError);
    }
  }, [
    rejectNameReservationIsSuccess,
    rejectNameReservationIsError,
    rejectNameReservationError,
    dispatch,
    resetRejectNameReservation,
    rejectNameReservationData?.data,
  ]);

  return (
    <Modal
      isOpen={rejectNameReservationModal}
      onClose={() => {
        dispatch(setRejectNameReservationModal(false));
        dispatch(setNameReservationDetailsModal(true));
      }}
      heading={`Reject ${selectedNameReservation?.name}`}
      headingClassName="text-red-600"
      className="min-w-[40vw]"
    >
      <form
        className="w-full flex flex-col gap-3"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h3>
          Are you sure you want to reject the name reservation for{' '}
          <span className="font-bold">{selectedNameReservation?.name}</span>?
          Provide a reason for rejection.
        </h3>
        <Controller
          name="comment"
          control={control}
          rules={{ required: 'Comment is required' }}
          render={({ field }) => {
            return (
              <label className="w-full flex flex-col gap-2">
                <TextArea
                  label={'Comment'}
                  {...field}
                  required
                  placeholder="Comment"
                  className="w-full p-2 border border-gray-300 rounded"
                />
                {errors.comment && (
                  <InputErrorMessage message={errors?.comment?.message} />
                )}
              </label>
            );
          }}
        />
        <menu className="flex items-center gap-3 justify-between w-full">
          <Button
            onClick={(e) => {
              e.preventDefault();
              dispatch(setRejectNameReservationModal(false));
              dispatch(setNameReservationDetailsModal(true));
            }}
          >
            Cancel
          </Button>
          <Button
            danger
            submit
            disabled={!comment || Object.keys(errors)?.length > 0}
          >
            {rejectNameReservationIsLoading ? <Loader /> : 'Submit'}
          </Button>
        </menu>
      </form>
    </Modal>
  );
};

export default RejectNameReservation;
