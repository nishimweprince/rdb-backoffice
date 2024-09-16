import Modal from '@/components/cards/Modal';
import Button from '@/components/inputs/Button';
import Loader from '@/components/inputs/Loader';
import { useApproveNameReservationMutation } from '@/states/api/businessRegApiSlice';
import {
  setApproveNameReservationModal,
  setNameReservationDetailsModal,
  setSelectedNameReservation,
  updateNameReservation,
} from '@/states/features/nameReservationSlice';
import { AppDispatch, RootState } from '@/states/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const ApproveNameReservation = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { approveNameReservationModal, selectedNameReservation } = useSelector(
    (state: RootState) => state.nameReservation
  );

  // INITIALIZE APPROVE NAME RESERVATION
  const [
    approveNameReservation,
    {
      data: approveNameReservationData,
      error: approveNameReservationError,
      isLoading: approveNameReservationIsLoading,
      isSuccess: approveNameReservationIsSuccess,
      isError: approveNameReservationIsError,
      reset: resetApproveNameReservation,
    },
  ] = useApproveNameReservationMutation();

  // HANDLE APPROVE NAME RESERVATION RESPONSE
  useEffect(() => {
    if (approveNameReservationIsSuccess) {
      dispatch(updateNameReservation(approveNameReservationData?.data));
      dispatch(setApproveNameReservationModal(false));
      dispatch(setNameReservationDetailsModal(false));
      dispatch(setSelectedNameReservation(undefined));
      resetApproveNameReservation();
    }
    if (approveNameReservationIsError) {
      console.error(approveNameReservationError);
    }
  }, [
    approveNameReservationIsSuccess,
    approveNameReservationIsError,
    approveNameReservationError,
    dispatch,
    resetApproveNameReservation,
    approveNameReservationData?.data,
  ]);

  return (
    <Modal
      isOpen={approveNameReservationModal}
      onClose={() => {
        dispatch(setApproveNameReservationModal(false));
        dispatch(setNameReservationDetailsModal(true));
      }}
      heading={`Approve ${selectedNameReservation?.name}`}
      className="min-w-[35vw] z-[10000]"
    >
      <p>Are you sure you want to approve {selectedNameReservation?.name}?</p>
      <menu className="w-full flex items-center gap-3 justify-between mt-4">
        <Button
          onClick={(e) => {
            e.preventDefault();
            dispatch(setApproveNameReservationModal(false));
            dispatch(setNameReservationDetailsModal(true));
          }}
        >
          Cancel
        </Button>
        <Button
          primary
          onClick={(e) => {
            e.preventDefault();
            approveNameReservation({ id: selectedNameReservation?.id });
          }}
        >
          {approveNameReservationIsLoading ? <Loader /> : 'Approve'}
        </Button>
      </menu>
    </Modal>
  );
};

export default ApproveNameReservation;
