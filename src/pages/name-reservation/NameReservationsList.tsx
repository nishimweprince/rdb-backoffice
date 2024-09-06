import CustomTooltip from '@/components/inputs/CustomTooltip';
import Loader from '@/components/inputs/Loader';
import CustomBreadcrumb from '@/components/navigation/CustomBreadcrumb';
import Table from '@/components/table/Table';
import { nameReservationColumns } from '@/constants/nameReservation.constants';
import StaffLayout from '@/containers/navigation/StaffLayout';
import { formatDateTime } from '@/helpers/strings.helper';
import { useLazyFetchNameReservationsQuery } from '@/states/api/businessRegQueryApiSlice';
import {
  setNameReservationDetailsModal,
  setNameReservationPage,
  setNameReservationSize,
  setNameReservationsList,
  setSelectedNameReservation,
} from '@/states/features/nameReservationSlice';
import { AppDispatch, RootState } from '@/states/store';
import { NameReservation } from '@/types/models/nameReservation';
import { Row } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorResponse, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import SimilarBusinessNames from '../business/SimilarBusinessNames';
import NameReservationDetails from './NameReservationDetails';
import ApproveNameReservation from './ApproveNameReservation';
import RejectNameReservation from './RejectNameReservation';
import { getBusinessStatusColor } from '@/helpers/business.helper';
import { Button } from '@/components/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronCircleDown } from '@fortawesome/free-solid-svg-icons';
import NameReservationFilter from './NameReservationFilter';
import { UUID } from 'crypto';

const NameReservationsList = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const {
    nameReservationsList,
    selectedNameReservation,
    nameReservationPage,
    nameReservationSize,
    nameReservationTotalPages,
    nameReservationTotalElements,
  } = useSelector((state: RootState) => state.nameReservation);
  const { user } = useSelector((state: RootState) => state.user);
  const [showFilter, setShowFilter] = useState(true);
  const [status, setStatus] = useState('');
  const [assignedTo, setAssignedTo] = useState<UUID | undefined>(user?.id);
  const [searchKey, setSearchKey] = useState('');
  const [code, setCode] = useState('');

  // INITIALIZE FETCH NAME RESERVATIONS QUERY
  const [
    fetchNameReservations,
    {
      data: nameReservationsData,
      error: nameReservationsError,
      isFetching: nameReservationsIsFetching,
      isSuccess: nameReservationsIsSuccess,
      isError: nameReservationsIsError,
    },
  ] = useLazyFetchNameReservationsQuery();

  // FETCH NAME RESERVATIONS
  useEffect(() => {
    fetchNameReservations({
      page: nameReservationPage,
      size: nameReservationSize,
      status,
      assignedTo,
      searchKey,
      code,
    });
  }, [
    assignedTo,
    fetchNameReservations,
    nameReservationPage,
    nameReservationSize,
    status,
    searchKey,
    code,
  ]);

  // HANDLE NAME RESERVATIONS RESPONSE
  useEffect(() => {
    if (nameReservationsIsSuccess) {
      dispatch(setNameReservationsList(nameReservationsData?.data?.data));
    } else if (nameReservationsIsError) {
      const errorResponse =
        (nameReservationsError as ErrorResponse)?.data?.message ||
        'An error occurred while fetching name reservations';
      toast.error(errorResponse);
    }
  }, [
    dispatch,
    nameReservationsData,
    nameReservationsError,
    nameReservationsIsError,
    nameReservationsIsSuccess,
  ]);

  // NAVIGATION LINKS
  const nameReservationsLinks = [
    {
      label: 'Dashboard',
      route: '/dashboard',
    },
    {
      label: 'Name Reservations',
      route: '/applications/name-reservations',
    },
  ];

  // NAME RESERVATION EXTENDED COLUMNS
  const nameReservationColumnsExtended = [
    ...nameReservationColumns,
    {
      header: 'Status',
      accessorKey: 'reservationStatus',
      cell: ({ row }: { row: Row<NameReservation> }) => {
        return (
          <p
            className={`text-[13px] cursor-pointer ${getBusinessStatusColor(
              row?.original?.reservationStatus
            )} p-1 px-2 rounded-md text-white text-center`}
          >
            {row.original.reservationStatus}
          </p>
        );
      },
    },
    {
      header: 'Expiry Date',
      accessorKey: 'expiryDate',
      cell: ({ row }: { row: Row<NameReservation> }) =>
        row?.original?.expiryDate ? (
          formatDateTime(row.original.expiryDate)
        ) : (
          <CustomTooltip label="Available after approval">
            <p className="text-[13px] cursor-pointer">N/A</p>
          </CustomTooltip>
        ),
    },
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: ({ row }: { row: Row<NameReservation> }) => {
        return (
          <Link
            to={`#`}
            onClick={(e) => {
              e.preventDefault();
              dispatch(setSelectedNameReservation(row.original));
              dispatch(setNameReservationDetailsModal(true));
            }}
            className="flex items-center gap-1 text-[13px] text-primary underline"
          >
            View details
          </Link>
        );
      },
    },
  ];

  return (
    <StaffLayout>
      <main className="w-full flex flex-col gap-4 p-6">
        <CustomBreadcrumb navigationLinks={nameReservationsLinks} />
        <menu className="w-full flex items-center gap-3 justify-between">
          <h1 className="uppercase text-primary text-lg font-semibold px-2">
            Name reservation applications
          </h1>
          <Button
            variant={'outline'}
            className="hover:bg-background text-primary text-[14px] font-normal flex items-center gap-1"
            onClick={(e) => {
              e.preventDefault();
              setShowFilter(!showFilter);
            }}
          >
            <FontAwesomeIcon
              icon={faChevronCircleDown}
              className="text-primary"
            />
            Filter
          </Button>
        </menu>
        <menu className="w-full grid grid-cols-2 gap-5">
          <Link
            to={'#'}
            className={`p-2 border-primary border w-full px-4 text-center ${
              assignedTo === user?.id
                ? 'bg-primary text-white'
                : 'bg-white text-primary'
            } rounded-md hover:scale-[1.01] transition-all ease-in-out duration-300`}
            onClick={(e) => {
              e.preventDefault();
              setAssignedTo(user?.id);
              setNameReservationPage(1);
            }}
          >
            Assigned to me
          </Link>
          <Link
            to={'#'}
            className={`p-2 border-primary border w-full px-4 text-center ${
              !assignedTo || assignedTo !== user?.id
                ? 'bg-primary text-white'
                : 'bg-white text-primary'
            } rounded-md hover:scale-[1.01] transition-all ease-in-out duration-300`}
            onClick={(e) => {
              e.preventDefault();
              setAssignedTo(undefined);
              setNameReservationPage(1);
            }}
          >
            All
          </Link>
        </menu>
        {showFilter && (
          <NameReservationFilter
            onSelectStatus={(status) => {
              setStatus(status);
              setNameReservationPage(1);
            }}
            onSelectAssignedTo={(assignedTo) => {
              setAssignedTo(assignedTo);
              setNameReservationPage(1);
            }}
            onHandleCode={(code) => {
              setCode(code);
              setNameReservationPage(1);
            }}
            onHandleSearch={(searchKey) => {
              setSearchKey(searchKey);
              setNameReservationPage(1);
            }}
            showFilter={showFilter}
          />
        )}
        {nameReservationsIsFetching ? (
          <figure className="w-full flex items-center gap-3 justify-center">
            <Loader className="text-primary" />
          </figure>
        ) : (
          <section className="w-full flex flex-col gap-4 px-2">
            <Table
              page={nameReservationPage}
              size={nameReservationSize}
              totalElements={nameReservationTotalElements}
              totalPages={nameReservationTotalPages}
              setPage={setNameReservationPage}
              setSize={setNameReservationSize}
              data={nameReservationsList}
              columns={nameReservationColumnsExtended}
            />
          </section>
        )}
      </main>
      <SimilarBusinessNames
        businessName={selectedNameReservation?.name as string}
      />
      <NameReservationDetails />
      <ApproveNameReservation />
      <RejectNameReservation />
    </StaffLayout>
  );
};

export default NameReservationsList;
