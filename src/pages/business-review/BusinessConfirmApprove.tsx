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
import { Business, businessId } from '@/types/models/business';
import { useEffect, useState } from 'react';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import BusinessGeneralComments from './BusinessGeneralComments';
import { InputErrorMessage } from '@/components/feedback/ErrorLabels';
import TextArea from '@/components/inputs/TextArea';

const BusinessConfirmApprove = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const {
    businessConfirmApproveModal,
    selectedBusiness,
    businessGeneralCommentsList,
    approveBusinessIsLoading,
    approveBusinessIsSuccess,
    selectedBusinessGeneralComment
  } = useSelector((state: RootState) => state.business);
  const [addNewComment, setAddNewComment] = useState(false);

  // NAVIGATION
  const navigate = useNavigate();

  // REACT HOOK FORM
  const {
    control,
    watch,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const { comment } = watch();

  // SET DEFAULT VALUE FOR COMMENT
  useEffect(() => {
    setValue('comment', selectedBusinessGeneralComment?.comment);
  }, [selectedBusinessGeneralComment?.comment, setValue]);

  // HANDLE FORM SUBMISSION
  const onSubmit = (data: FieldValues) => {
    dispatch(
      approveBusinessThunk({
        businessId: selectedBusiness?.id as businessId,
        companyType: selectedBusiness?.isForeign
          ? 'foreign'
          : selectedBusiness?.enterpriseName
          ? 'enterprise'
          : 'domestic',
        comment: data?.comment,
      })
    );
  };

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
      <form
        className="w-full flex flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h3>
          Are you sure you want to approve{' '}
          <span className="font-bold">{getBusinessName(selectedBusiness)}</span>
          ? The user will be notified of the approval.
        </h3>
        <BusinessGeneralComments
          business={selectedBusiness as Business}
        />
        {addNewComment ? (
          <Button
            primary
            className="w-fit !text-[13px] !py-1"
            onClick={(e) => {
              e.preventDefault();
              setAddNewComment(false);
            }}
          >
            Close comment box
          </Button>
        ) : (
          <Button
            className="w-fit !text-[13px] !py-1"
            primary
            onClick={(e) => {
              e.preventDefault();
              setAddNewComment(true);
            }}
          >
            Add new comment (optional)
          </Button>
        )}
        {(addNewComment || businessGeneralCommentsList?.length === 0) && (
          <Controller
            name="comment"
            control={control}
            render={({ field }) => {
              return (
                <label className="w-full flex flex-col gap-2">
                  <TextArea
                    resize
                    {...field}
                    label={'Comment message'}
                    required
                  />
                  {errors.comment && (
                    <InputErrorMessage message={errors?.comment?.message} />
                  )}
                </label>
              );
            }}
          />
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
          <Button submit primary disabled={!comment}>
            {approveBusinessIsLoading ? <Loader /> : 'Approve'}
          </Button>
        </menu>
      </form>
    </Modal>
  );
};

export default BusinessConfirmApprove;
