import Modal from '@/components/cards/Modal';
import { InputErrorMessage } from '@/components/feedback/ErrorLabels';
import Button from '@/components/inputs/Button';
import Loader from '@/components/inputs/Loader';
import Select from '@/components/inputs/Select';
import TextArea from '@/components/inputs/TextArea';
import { businessActivityStatus } from '@/constants/business.constants';
import { capitalizeString } from '@/helpers/strings.helper';
import { useUpdateBusinessLineMutation } from '@/states/api/businessRegApiSlice';
import {
  setSelectedBusinessLine,
  setUpdateBusinessLine,
  setUpdateBusinessLineModal,
} from '@/states/features/businessActivitiesSlice';
import { AppDispatch, RootState } from '@/states/store';
import { useEffect } from 'react';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorResponse } from 'react-router-dom';
import { toast } from 'react-toastify';

const UpdateBusinessLine = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { updateBusinessLineModal, selectedBusinessLine } = useSelector(
    (state: RootState) => state.businessActivities
  );

  // REACT HOOK FORM
  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
    trigger,
  } = useForm();

  const { status } = watch();

  // INITIALIZE UPDATE BUSINESS LINE MUTATION
  const [
    updateBusinessLine,
    {
      data: updateBusinessLineData,
      isLoading: updateBusinessLineIsLoading,
      isSuccess: updateBusinessLineIsSuccess,
      isError: updateBusinessLineIsError,
      error: updateBusinessLineErrorData,
      reset: resetUpdateBusinessLine,
    },
  ] = useUpdateBusinessLineMutation();

  // HANDLE FORM SUBMISSION
  const onSubmit = (data: FieldValues) => {
    updateBusinessLine({
      businessLineId: selectedBusinessLine?.id,
      disclaimer: data?.disclaimer,
      status: data?.status,
    });
  };

  // SET DEFAULT VALUES
  useEffect(() => {
    if (selectedBusinessLine) {
      setValue('status', selectedBusinessLine?.status);
      setValue('disclaimer', selectedBusinessLine?.disclaimer);
    }
  }, [selectedBusinessLine, setValue]);

  // HANDLE UPDATE BUSINESS LINE RESPONSE
  useEffect(() => {
    if (updateBusinessLineIsSuccess) {
      dispatch(setUpdateBusinessLine(updateBusinessLineData?.data));
      dispatch(setSelectedBusinessLine(undefined));
      dispatch(setUpdateBusinessLineModal(false));
      resetUpdateBusinessLine();
    } else if (updateBusinessLineIsError) {
      const errorResponse =
        (updateBusinessLineErrorData as ErrorResponse)?.data?.message ||
        'An error occurred while updating business activity';
      toast.error(errorResponse);
    }
  }, [
    updateBusinessLineIsSuccess,
    dispatch,
    updateBusinessLineIsError,
    updateBusinessLineErrorData,
    updateBusinessLineData,
    resetUpdateBusinessLine,
  ]);

  return (
    <Modal
      isOpen={updateBusinessLineModal}
      onClose={() => {
        dispatch(setSelectedBusinessLine(undefined));
        dispatch(setUpdateBusinessLineModal(false));
      }}
      className="min-w-[40vw]"
      heading={`Update business activity - ${selectedBusinessLine?.code}`}
    >
      <form
        className="w-full flex flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <fieldset className="flex flex-col gap-4">
          <Controller
            name="status"
            control={control}
            rules={{ required: 'Select business activity status' }}
            render={({ field }) => {
              return (
                <label className="w-full flex flex-col gap-1">
                  <Select
                    label={'Status'}
                    required
                    placeholder="Select status"
                    {...field}
                    options={businessActivityStatus?.map((status) => {
                      return {
                        label: capitalizeString(status),
                        value: status,
                      };
                    })}
                    onChange={async (e) => {
                      field.onChange(e);
                      if (e === 'LICENSE_REQUIRED') {
                        await trigger('disclaimer');
                      }
                    }}
                  />
                  {errors?.status && (
                    <InputErrorMessage message={errors?.status?.message} />
                  )}
                  {field?.value === 'INACTIVE' && (
                    <p className="text-red-600 mt-2 text-[14px]">
                      Business applicants will not be able to select this
                      business activity
                    </p>
                  )}
                </label>
              );
            }}
          />
          <Controller
            name="disclaimer"
            control={control}
            rules={{
              required:
                status === 'LICENSE_REQUIRED'
                  ? 'Disclaimer is required'
                  : false,
            }}
            render={({ field }) => {
              return (
                <label className="w-full flex flex-col gap-1">
                  <TextArea
                    required={status === 'LICENSE_REQUIRED'}
                    label={`Disclaimer ${
                      status === 'LICENSE_REQUIRED' ? '' : '(optional)'
                    }`}
                    {...field}
                  />
                  {errors?.disclaimer && (
                    <InputErrorMessage message={errors?.disclaimer?.message} />
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
              dispatch(setSelectedBusinessLine(undefined));
              dispatch(setUpdateBusinessLineModal(false));
            }}
          >
            Cancel
          </Button>
          <Button primary submit className={status === 'INACTIVE' ? '!bg-red-600 border-none hover:!bg-red-600' : undefined}>
            {updateBusinessLineIsLoading ? <Loader /> : 'Update'}
          </Button>
        </menu>
      </form>
    </Modal>
  );
};

export default UpdateBusinessLine;
