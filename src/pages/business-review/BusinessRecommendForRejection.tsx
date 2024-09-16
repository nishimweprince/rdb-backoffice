import React, { useEffect } from 'react';
import Modal from '@/components/cards/Modal';
import { InputErrorMessage } from '@/components/feedback/ErrorLabels';
import Button from '@/components/inputs/Button';
import TextArea from '@/components/inputs/TextArea';
import Loader from '@/components/inputs/Loader';
import { getBusinessName } from '@/helpers/business.helper';
import {
  setBusinessRecommendForRejectionModal,
  setSelectedBusiness,
  setUpdateBusinessesList,
} from '@/states/features/businessSlice';
import { AppDispatch, RootState } from '@/states/store';
import { businessId } from '@/types/models/business';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { ErrorResponse, useNavigate } from 'react-router-dom';
import { useRecommendBusinessForRejectionMutation } from '@/states/api/businessRegApiSlice';

const BusinessRecommendForRejection: React.FC = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const {
    businessRecommendForRejectionModal,
    selectedBusiness,
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

  // INITIALIZE RECOMMEND BUSINESS FOR REJECTION MUTATION
  const [recommendBusinessForRejection, {
    isLoading: recommendBusinessForRejectionIsLoading,
    isSuccess: recommendBusinessForRejectionIsSuccess,
    isError: recommendBusinessForRejectionIsError,
    reset: resetRecommendBusinessForRejection,
    error: recommendBusinessForRejectionError,
    data: recommendBusinessForRejectionData,
  }] = useRecommendBusinessForRejectionMutation();

  // HANDLE FORM SUBMISSION
  const onSubmit = (data: FieldValues) => {
    recommendBusinessForRejection({
        businessId: selectedBusiness?.id as businessId,
        comment: data?.comment,
      })
  };

  // HANDLE SUCCESS AND ERROR STATES
  useEffect(() => {
    if (recommendBusinessForRejectionIsSuccess) {
      toast.success('Business recommended for rejection successfully');
      dispatch(
        setUpdateBusinessesList(recommendBusinessForRejectionData?.data)
      );
      dispatch(setSelectedBusiness(undefined));
      dispatch(setBusinessRecommendForRejectionModal(false));
      resetRecommendBusinessForRejection();
      reset();
      navigate(`/applications/business`);
    }
    if (recommendBusinessForRejectionIsError) {
      const errorResponse =
        (recommendBusinessForRejectionError as ErrorResponse)?.data?.message ||
        'An error occurred while recommending business for rejection';
      toast.error(errorResponse);
    }
  }, [
    recommendBusinessForRejectionIsSuccess,
    recommendBusinessForRejectionIsError,
    dispatch,
    reset,
    navigate,
    recommendBusinessForRejectionData?.data,
    resetRecommendBusinessForRejection,
    recommendBusinessForRejectionError,
  ]);

  return (
    <Modal
      isOpen={businessRecommendForRejectionModal}
      onClose={() => {
        dispatch(setSelectedBusiness(undefined));
        dispatch(setBusinessRecommendForRejectionModal(false));
      }}
      heading={`Recommend ${getBusinessName(selectedBusiness)} for rejection`}
      className="min-w-[40vw]"
      headingClassName="text-red-600"
    >
      <form
        className="w-full flex flex-col gap-2"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h3 className="text-lg font-semibold mb-2">
          Are you sure you want to recommend {getBusinessName(selectedBusiness)}{' '}
          for rejection? Enter the reason for rejection below.
        </h3>
        <Controller
          name="comment"
          control={control}
          rules={{
            required: 'Comment is required',
            minLength: {
              value: 10,
              message: 'Comment must be at least 10 characters long',
            },
          }}
          render={({ field }) => (
            <label className="w-full">
              <TextArea
                {...field}
                label="Reason for Rejection"
                required
                placeholder="Enter detailed reason for recommending rejection..."
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
              dispatch(setBusinessRecommendForRejectionModal(false));
            }}
            className="px-4 py-2"
          >
            Cancel
          </Button>
          <Button
            danger
            submit
            className="px-4 py-2"
            disabled={recommendBusinessForRejectionIsLoading}
          >
            {recommendBusinessForRejectionIsLoading ? <Loader /> : 'Submit'}
          </Button>
        </menu>
      </form>
    </Modal>
  );
};

export default BusinessRecommendForRejection;
