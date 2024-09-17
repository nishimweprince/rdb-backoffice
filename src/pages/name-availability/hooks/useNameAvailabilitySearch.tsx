import { useLazySearchBusinessNameAvailabilityQuery } from "@/states/api/businessRegQueryApiSlice";
import { setNameAvailabilitiesList, setNameAvailabilitiesListClone } from "@/states/features/businessSlice";
import { AppDispatch, RootState } from "@/states/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ErrorResponse } from "react-router-dom";
import { toast } from "react-toastify";

interface Similarity {
    name: string,
    similarity: string,
    status: string
}
export default function useNameAvailabilitySearch() {
  const dispatch: AppDispatch = useDispatch();
  const [filteredBusinessList, setFilteredBusinessList] = useState<Similarity[]>([]);

  const { nameAvailabilitiesList  } = useSelector(
    (state: RootState) => state.business
  );

    const [
        searchBusinessNameAvailability,
        {
          data: businessNameAvailabilityData,
          error: businessNameAvailabilityError,
          isFetching: businessNameAvailabilityIsFetching,
          isSuccess: businessNameAvailabilityIsSuccess,
          isError: businessNameAvailabilityIsError,
        },
      ] = useLazySearchBusinessNameAvailabilityQuery();

        // HANDLE SEARCH BUSINESS AVAILABILITY RESPONSE
        useEffect(() => {
            if (businessNameAvailabilityIsError) {
            const errorResponse =
                (businessNameAvailabilityError as ErrorResponse)?.data?.message ||
                'An error occurred while search business name availability. Refresh and try again';
            toast.error(errorResponse);
            }
        }, [
            businessNameAvailabilityError,
            businessNameAvailabilityIsError,
            businessNameAvailabilityIsSuccess,
        ]);

        useEffect(() => {
            if (businessNameAvailabilityIsSuccess) {
              dispatch(setNameAvailabilitiesList(businessNameAvailabilityData?.data));
            } else if (businessNameAvailabilityIsError) {
              const errorResponse =
                (businessNameAvailabilityError as ErrorResponse)?.data?.message ||
                'An error occurred while fetching name reservations';
              toast.error(errorResponse);
            }
          }, [
            dispatch,
            businessNameAvailabilityData,
            businessNameAvailabilityError,
            businessNameAvailabilityIsError,
            businessNameAvailabilityIsSuccess,
        ]);
        
        const handleFilterBusinessListsByStatus = (status: string) => {
            if (status === 'All') {
                setFilteredBusinessList(businessNameAvailabilityData?.data || []);
            }
            else if(status === 'reset'){
                dispatch(setNameAvailabilitiesList(businessNameAvailabilityData?.data));
            }
            else {
              const filteredList = businessNameAvailabilityData?.data?.filter(
                (business: Similarity) => business.status === status
              );
              setFilteredBusinessList(filteredList || []);
            }
          }
        
        useEffect(() => {
            console.log("filteredBusinessList", filteredBusinessList);
            if (filteredBusinessList?.length > 0) {
              // set copy 
              dispatch(setNameAvailabilitiesListClone(nameAvailabilitiesList));
              dispatch(setNameAvailabilitiesList(filteredBusinessList));
            } else {
              dispatch(setNameAvailabilitiesList([]));
              dispatch(setNameAvailabilitiesListClone([]));
            }
          }, [filteredBusinessList]);

    return {
        searchBusinessNameAvailability,
        businessNameAvailabilityData,
        businessNameAvailabilityError,
        businessNameAvailabilityIsFetching,
        businessNameAvailabilityIsSuccess,
        businessNameAvailabilityIsError,
        handleFilterBusinessListsByStatus,
        filteredBusinessList
    }
}