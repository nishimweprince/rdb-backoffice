import React, { useEffect } from 'react';
import Modal from '@/components/cards/Modal';
import { InputErrorMessage } from '@/components/feedback/ErrorLabels';
import Button from '@/components/inputs/Button';
import TextArea from '@/components/inputs/TextArea';
import Loader from '@/components/inputs/Loader';
import { getBusinessName } from '@/helpers/business.helper';
import {
  requestBusinessApproverThunk,
  setBusinessRecommendForApprovalModal,
  setSelectedBusiness,
} from '@/states/features/businessSlice';
import { AppDispatch, RootState } from '@/states/store';
import { businessId } from '@/types/models/business';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const BusinessRecommendForApproval: React.FC = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const {
    businessRecommendForApprovalModal,
    selectedBusiness,
    updateBusinessIsLoading,
    updateBusinessIsSuccess,
  } = useSelector((state: RootState) => state.business);

  // REACT HOOK FORM
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  // NAVIGATION
  const navigate = useNavigate();

  // HANDLE FORM SUBMISSION
  const onSubmit = (data: FieldValues) => {
    dispatch(
      requestBusinessApproverThunk({
        businessId: selectedBusiness?.id as businessId,
        comment: data?.comment,
      })
    );
  };

  // HANDLE SUCCESS AND ERROR STATES
  useEffect(() => {
    if (updateBusinessIsSuccess) {
      toast.success('Business recommended for approval successfully');
      dispatch(setSelectedBusiness(undefined));
      dispatch(setBusinessRecommendForApprovalModal(false));
      reset();
      navigate(`/applications/business`);
    }
  }, [updateBusinessIsSuccess, dispatch, reset, navigate]);

  return (
    <Modal
      isOpen={businessRecommendForApprovalModal}
      onClose={() => {
        dispatch(setSelectedBusiness(undefined));
        dispatch(setBusinessRecommendForApprovalModal(false));
      }}
      heading={`Recommend ${getBusinessName(selectedBusiness)} for approval`}
      className="min-w-[40vw]"
      headingClassName="text-green-600"
    >
      <form
        className="w-full flex flex-col gap-2"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h3 className="text-lg font-semibold mb-2">
          Are you sure you want to recommend {getBusinessName(selectedBusiness)}{' '}
          for approval? You can add an optional comment below.
        </h3>
        <Controller
          name="comment"
          control={control}
          render={({ field }) => (
            <label className="w-full">
              <TextArea
                {...field}
                label="Comment (optional)"
                placeholder="Enter any additional comments..."
                className="w-full min-h-[100px]"
              />
              {errors.comment && (
                <InputErrorMessage
                  message={errors?.comment?.message as string}
                />
              )}
            </label>
          )}
        />
        <menu className="w-full flex items-center gap-3 justify-between my-4">
          <Button
            onClick={(e) => {
              e.preventDefault();
              dispatch(setSelectedBusiness(undefined));
              dispatch(setBusinessRecommendForApprovalModal(false));
            }}
            className="px-4 py-2"
          >
            Cancel
          </Button>
          <Button
            primary
            submit
            className="px-4 py-2"
            disabled={updateBusinessIsLoading}
          >
            {updateBusinessIsLoading ? <Loader /> : 'Confirm'}
          </Button>
        </menu>
      </form>
    </Modal>
  );
};

export default BusinessRecommendForApproval;
