import Modal from '@/components/cards/Modal';
import Button from '@/components/inputs/Button';
import Loader from '@/components/inputs/Loader';
import { getBusinessName } from '@/helpers/business.helper';
import {
  fetchBusinessGeneralCommentsThunk,
  approveBusinessThunk,
  setBusinessConfirmApproveModal,
  setSelectedBusiness,
} from '@/states/features/businessSlice';
import { AppDispatch, RootState } from '@/states/store';
import { businessId } from '@/types/models/business';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const BusinessConfirmApprove = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const {
    businessConfirmApproveModal,
    selectedBusiness,
    businessGeneralCommentsList,
    businessGeneralCommentsIsFetching,
    approveBusinessIsLoading,
    approveBusinessIsSuccess,
  } = useSelector((state: RootState) => state.business);

  // NAVIGATION
  const navigate = useNavigate();

  // FETCH BUSINESS GENERAL COMMENTS
  useEffect(() => {
    if (businessConfirmApproveModal) {
      dispatch(
        fetchBusinessGeneralCommentsThunk({
          businessId: selectedBusiness?.id as businessId,
        })
      );
    }
  }, [dispatch, selectedBusiness?.id, businessConfirmApproveModal]);

  // HANDLE APPROVE BUSINESS RESPONSE
  useEffect(() => {
    if (approveBusinessIsSuccess) {
      dispatch(setSelectedBusiness(undefined));
      dispatch(setBusinessConfirmApproveModal(false));
      navigate(`/applications/business`);
    }
  }, [dispatch, navigate, approveBusinessIsSuccess]);

  return (
    <Modal
      isOpen={businessConfirmApproveModal}
      onClose={() => {
        dispatch(setSelectedBusiness(undefined));
        dispatch(setBusinessConfirmApproveModal(false));
      }}
      heading={`Approve ${getBusinessName(selectedBusiness)}?`}
      headingClassName="text-green-600"
      className="min-w-[40vw]"
    >
      <form className="w-full flex flex-col gap-4">
        <h3>
          Are you sure you want to approve{' '}
          <span className="font-bold">{getBusinessName(selectedBusiness)}</span>
          ? The user will be notified of the approval.
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
                  <p key={index} className="text-[13px]">
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
              dispatch(setBusinessConfirmApproveModal(false));
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={(e) => {
              e.preventDefault();
              dispatch(
                approveBusinessThunk({
                  businessId: selectedBusiness?.id as businessId,
                  companyType: selectedBusiness?.isForeign
                    ? 'foreign'
                    : selectedBusiness?.enterpriseName
                    ? 'enterprise'
                    : 'domestic',
                })
              );
            }}
            primary
          >
            {approveBusinessIsLoading ? <Loader /> : 'Approve'}
          </Button>
        </menu>
      </form>
    </Modal>
  );
};

export default BusinessConfirmApprove;
