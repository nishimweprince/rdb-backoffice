import { useLazyFetchBusinessByReferenceIdQuery, useUpdateBusinessCurrencySettingsMutation } from "@/states/api/businessRegQueryApiSlice";
import { setCurrencySettings } from "@/states/features/businessSlice";
import { AppDispatch, RootState } from "@/states/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ErrorResponse } from "react-router-dom";
import { toast } from "react-toastify";


export default function useApplicationCurrencySettings() {
  const dispatch: AppDispatch = useDispatch();

  const { currencySettings  } = useSelector(
    (state: RootState) => state.business
  );

    const [
        searchBusinessApplicationByReference,
        {
          data: businessApplication,
          error: businessApplicationError,
          isFetching: businessApplicationIsFetching,
          isSuccess: businessApplicationIsSuccess,
          isError: businessApplicationIsError,
        },
      ] = useLazyFetchBusinessByReferenceIdQuery();

      const [
        updateBusinessCurrencySettings,
        {
          error: updateBusinessCurrencySettingsError,
          isLoading: updateBusinessCurrencySettingsIsLoading,
        },
      ] = useUpdateBusinessCurrencySettingsMutation()

        useEffect(() => {
            if (businessApplicationIsSuccess) {
              dispatch(setCurrencySettings({business: [businessApplication?.data]}));
            } else if (businessApplicationIsError) {
              dispatch(setCurrencySettings({business: []}));
              const errorResponse =
                (businessApplicationError as ErrorResponse)?.data?.message ||
                'An error occurred while fetching business by reference number';
              toast.error(errorResponse);
            }
          }, [
            dispatch,
            businessApplication,
            businessApplicationError,
            businessApplicationIsError,
            businessApplicationIsSuccess
        ]);
        
    const handleConfirmation = async () => {
      // get application referenceId from currencySettings?.business[0].application_reference_id
      const applicationReferenceId = currencySettings?.business[0].applicationReferenceId;
      const isEnabled = currencySettings?.business[0].isOtherCurrencyAllowed;
      const response = await updateBusinessCurrencySettings({applicationReferenceId, endpoint: isEnabled ? 'block-other-currency' : 'allow-other-currency'});

      if(response.data){
        toast.success('Currency settings updated successfully');
        searchBusinessApplicationByReference({referenceId: applicationReferenceId});
      } else {
        const errorResponse =
        (updateBusinessCurrencySettingsError as ErrorResponse)?.data?.message ||
        'An error occurred while updating currency settings';
        toast.error(errorResponse);
      }

    }

    const reset = () => {
      dispatch(setCurrencySettings({business: []}));
    }

    return {
        businessApplication: currencySettings.business,
        businessApplicationIsFetching,
        searchBusinessApplicationByReference,
        handleConfirmation,
        updateBusinessCurrencySettingsIsLoading,
        reset
    }
}