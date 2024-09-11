import Modal from '@/components/cards/Modal';
import Button from '@/components/inputs/Button';
import Loader from '@/components/inputs/Loader';
import { getBusinessName } from '@/helpers/business.helper';
import {
  fetchBusinessGeneralCommentsThunk,
  rejectBusinessThunk,
  setBusinessConfirmRejectModal,
  setSelectedBusiness,
} from '@/states/features/businessSlice';
import { AppDispatch, RootState } from '@/states/store';
import { businessId } from '@/types/models/business';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const BusinessConfirmReject = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const {
    businessConfirmRejectModal,
    selectedBusiness,
    businessGeneralCommentsList,
    businessGeneralCommentsIsFetching,
    rejectBusinessIsLoading,
    rejectBusinessIsSuccess,
  } = useSelector((state: RootState) => state.business);

  // NAVIGATION
  const navigate = useNavigate();

  // FETCH BUSINESS GENERAL COMMENTS
  useEffect(() => {
    dispatch(
      fetchBusinessGeneralCommentsThunk({
        businessId: selectedBusiness?.id as businessId,
      })
    );
  }, [dispatch, selectedBusiness?.id]);

  // HANDLE REJECT BUSINESS RESPONE
  useEffect(() => {
    if (rejectBusinessIsSuccess) {
      dispatch(setSelectedBusiness(undefined));
      dispatch(setBusinessConfirmRejectModal(false));
      navigate(`/applications/business`);
    }
  }, [dispatch, navigate, rejectBusinessIsSuccess]);

  return (
    <Modal
      isOpen={businessConfirmRejectModal}
      onClose={() => {
        dispatch(setSelectedBusiness(undefined));
        dispatch(setBusinessConfirmRejectModal(false));
      }}
      heading={`Reject ${getBusinessName(selectedBusiness)}?`}
      headingClassName="text-red-600"
      className="min-w-[40vw]"
    >
      <form className="w-full flex flex-col gap-4">
        <h3>
          Are you sure you want to reject{' '}
          <span className="font-bold">{getBusinessName(selectedBusiness)}</span>
          ? The user will be notified of the rejection and receive a reason for
          it.
        </h3>
        {businessGeneralCommentsIsFetching ? (
          <figure className="w-full flex items-center justify-center min-h-[20vh]">
            <Loader className="text-primary" />
          </figure>
        ) : (
          businessGeneralCommentsList?.length > 0 && (
            <menu className="w-full flex flex-col gap-2">
              {businessGeneralCommentsList.map((generalComment, index) => {
                return (
                  <p className="text-[13px]">
                    {index + 1}. {generalComment?.comment}
                  </p>
                );
              })}
            </menu>
          )
        )}
        <menu className="w-full flex items-center gap-3 justify-between">
          <Button
            onClick={(e) => {
              e.preventDefault();
              dispatch(setSelectedBusiness(undefined));
              dispatch(setBusinessConfirmRejectModal(false));
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={(e) => {
              e.preventDefault();
              dispatch(
                rejectBusinessThunk({
                  businessId: selectedBusiness?.id as businessId,
                })
              );
            }}
            danger
          >
            {rejectBusinessIsLoading ? <Loader /> : 'Reject'}
          </Button>
        </menu>
      </form>
    </Modal>
  );
};

export default BusinessConfirmReject;
