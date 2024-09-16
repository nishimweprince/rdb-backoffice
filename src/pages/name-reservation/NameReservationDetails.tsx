import Button from '@/components/inputs/Button';
import {
  capitalizeString,
  formatDateTime,
  formatNumbers,
} from '@/helpers/strings.helper';
import {
  setApproveNameReservationModal,
  setNameReservationDetailsModal,
  setRejectNameReservationModal,
  setSelectedNameReservation,
} from '@/states/features/nameReservationSlice';
import { AppDispatch, RootState } from '@/states/store';
import { useDispatch, useSelector } from 'react-redux';
import { useLazySearchBusinessNameAvailabilityQuery } from '@/states/api/businessRegQueryApiSlice';
import { setNameAvailabilitiesList } from '@/states/features/businessSlice';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { ErrorResponse } from 'react-router-dom';
import Table from '@/components/table/Table';
import { similarBusinessNamesColumns } from '@/constants/business.constants';
import Loader from '@/components/inputs/Loader';
import Modal from '@/components/cards/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

const NameReservationDetails = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { nameReservationDetailsModal, selectedNameReservation } = useSelector(
    (state: RootState) => state.nameReservation
  );
  const { nameAvailabilitiesList } = useSelector(
    (state: RootState) => state.business
  );

  // INITIALIZE FETCH SIMILAR BUSINESS NAMES QUERY
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

  // FETCH SIMILAR BUSINESS NAMES
  useEffect(() => {
    if (selectedNameReservation) {
      searchBusinessNameAvailability({
        companyName: selectedNameReservation?.name,
      });
    }
  }, [selectedNameReservation, searchBusinessNameAvailability]);

  // HANDLE BUSINESS NAME AVAILABILITY RESPONSE
  useEffect(() => {
    if (businessNameAvailabilityIsSuccess) {
      if (businessNameAvailabilityData?.data?.length > 0) {
        dispatch(setNameAvailabilitiesList(businessNameAvailabilityData?.data));
      }
    } else if (businessNameAvailabilityIsError) {
      const errorResponse =
        (businessNameAvailabilityError as ErrorResponse)?.data?.message ||
        'An error occurred while searching for business name availability';
      toast.error(errorResponse);
    }
  }, [
    businessNameAvailabilityData,
    businessNameAvailabilityError,
    businessNameAvailabilityIsError,
    businessNameAvailabilityIsSuccess,
    dispatch,
  ]);

  return (
    <Modal
      isOpen={nameReservationDetailsModal}
      onClose={() => {
        dispatch(setSelectedNameReservation(undefined));
        dispatch(setNameAvailabilitiesList([]));
        dispatch(setNameReservationDetailsModal(false));
      }}
      className="min-w-[50vw]"
      heading={`${selectedNameReservation?.name} | ${selectedNameReservation?.code}`}
    >
      <menu className="grid grid-cols-2 gap-5 w-full">
        <ul className="flex items-center gap-1">
          <p>Name:</p>
          <p className="font-semibold text-black">
            {selectedNameReservation?.name}
          </p>
        </ul>
        <ul className="flex items-center gap-1">
          <p>Code:</p>
          <p className="font-semibold text-black">
            {selectedNameReservation?.code}
          </p>
        </ul>
        <ul className="flex items-center gap-1">
          <p>Date of submission:</p>
          <p className="font-semibold text-black">
            {formatDateTime(selectedNameReservation?.createdAt)}
          </p>
        </ul>
        <ul className="flex items-center gap-1">
          <p>Status:</p>
          <p className="font-semibold text-black">
            {capitalizeString(selectedNameReservation?.reservationStatus)}
          </p>
        </ul>
        <ul className="flex items-center gap-1">
          <p>Number of times renewed:</p>
          <p className="font-semibold text-black">
            {selectedNameReservation?.renewalCount}
          </p>
        </ul>
        <ul className="flex items-center gap-1">
          <p>Expiry date:</p>
          <p className="text-black font-semibold">
            {selectedNameReservation?.expiryDate
              ? formatDateTime(selectedNameReservation?.expiryDate)
              : 'N/A'}
          </p>
        </ul>
      </menu>
      {selectedNameReservation?.comment && (
        <article className="w-full flex flex-col gap-2 my-4">
          <h3 className="uppercase text-primary text-md font-medium">
            Comment
          </h3>
          <p>{selectedNameReservation?.comment}</p>
        </article>
      )}
      {businessNameAvailabilityIsFetching ? (
        <figure className="w-full flex items-center justify-center min-h-[30vh]">
          <Loader className="text-primary" />
        </figure>
      ) : (
        <menu className="w-full flex flex-col gap-2 mt-5">
          <menu className="w-full flex items-center gap-3 justify-between">
            <h2 className="uppercase text-primary font-semibold text-lg">
              Similar business names
            </h2>
            <Button className="flex items-center gap-2 hover:text-white hover:!gap-3 transition-all ease-in-out duration-300">
              Advanced search{' '}
              <FontAwesomeIcon
                className="text-[13px] underline"
                icon={faArrowRight}
              />
            </Button>
          </menu>
          {nameAvailabilitiesList?.length > 0 ? (
            <Table
              showFilter={false}
              showPagination={false}
              data={nameAvailabilitiesList?.map(
                (nameAvailability, index: number) => {
                  return {
                    no: index + 1,
                    name: nameAvailability.name,
                    similarity: `${formatNumbers(
                      Number(nameAvailability.similarity) * 100
                    )}%`,
                    status:
                      nameAvailability?.status === 'Business'
                        ? 'Active'
                        : 'Reserved',
                  };
                }
              )}
              columns={similarBusinessNamesColumns}
            />
          ) : (
            <p className="text-green-700">No similar business names found</p>
          )}
        </menu>
      )}
      <menu className="flex items-center justify-between my-5 w-full">
        <Button
          onClick={(e) => {
            e.preventDefault();
            dispatch(setSelectedNameReservation(undefined));
            dispatch(setNameAvailabilitiesList([]));
            dispatch(setNameReservationDetailsModal(false));
          }}
        >
          Close
        </Button>
        {selectedNameReservation?.reservationStatus === 'SUBMITTED' && (
          <>
            <Button
              danger
              onClick={(e) => {
                e.preventDefault();
                dispatch(setNameReservationDetailsModal(false));
                dispatch(setRejectNameReservationModal(true));
              }}
            >
              Reject
            </Button>
            <Button
              primary
              onClick={(e) => {
                e.preventDefault();
                dispatch(setNameReservationDetailsModal(false));
                dispatch(setApproveNameReservationModal(true));
              }}
            >
              Approve
            </Button>
          </>
        )}
      </menu>
    </Modal>
  );
};

export default NameReservationDetails;
