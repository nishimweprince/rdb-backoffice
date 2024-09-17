import Modal from '@/components/cards/Modal';
import { InputErrorMessage } from '@/components/feedback/ErrorLabels';
import Button from '@/components/inputs/Button';
import Loader from '@/components/inputs/Loader';
import TextArea from '@/components/inputs/TextArea';
import { getBusinessName } from '@/helpers/business.helper';
import {
  rejectBusinessThunk,
  setBusinessConfirmRejectModal,
  setSelectedBusiness,
} from '@/states/features/businessSlice';
import { AppDispatch, RootState } from '@/states/store';
import { businessId } from '@/types/models/business';
import { useEffect, useState } from 'react';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const BusinessConfirmReject = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const {
    businessConfirmRejectModal,
    selectedBusiness,
    businessGeneralCommentsList,
    rejectBusinessIsLoading,
    rejectBusinessIsSuccess,
  } = useSelector((state: RootState) => state.business);
  const [addNewComment, setAddNewComment] = useState(false);

  // NAVIGATION
  const navigate = useNavigate();

  // REACT HOOK FORM
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // HANDLE REJECT BUSINESS RESPONE
  useEffect(() => {
    if (rejectBusinessIsSuccess) {
      dispatch(setSelectedBusiness(undefined));
      dispatch(setBusinessConfirmRejectModal(false));
      navigate(`/applications/business`);
    }
  }, [dispatch, navigate, rejectBusinessIsSuccess]);

  // HANDLE FORM SUBMISSION
  const onSubmit = (data: FieldValues) => {
    dispatch(
      rejectBusinessThunk({
        businessId: selectedBusiness?.id as businessId,
        comment: data?.comment,
      })
    );
  };

  return (
    <Modal
      isOpen={businessConfirmRejectModal}
      onClose={() => {
        dispatch(setSelectedBusiness(undefined));
        dispatch(setBusinessConfirmRejectModal(false));
      }}
      heading={`Reject ${getBusinessName(selectedBusiness)}?`}
      headingClassName="text-red-600"
      className="min-w-[60vw]"
    >
      <form
        className="w-full flex flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h3>
          Are you sure you want to reject{' '}
          <span className="font-bold">{getBusinessName(selectedBusiness)}</span>
          ? The user will be notified of the rejection and receive a reason for
          it.
        </h3>
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
            Add new comment
          </Button>
        )}
        {(addNewComment || businessGeneralCommentsList?.length <= 0) && (
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
              dispatch(setBusinessConfirmRejectModal(false));
            }}
          >
            Cancel
          </Button>
          <Button submit danger>
            {rejectBusinessIsLoading ? <Loader /> : 'Reject'}
          </Button>
        </menu>
      </form>
    </Modal>
  );
};

export default BusinessConfirmReject;
