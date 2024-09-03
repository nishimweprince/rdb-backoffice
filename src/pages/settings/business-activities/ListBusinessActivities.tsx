import Combobox from '@/components/inputs/Combobox';
import CustomPopover from '@/components/inputs/CustomPopover';
import Loader from '@/components/inputs/Loader';
import Table from '@/components/table/Table';
import { businessLineColumns } from '@/constants/business.constants';
import StaffLayout from '@/containers/navigation/StaffLayout';
import {
  useLazyFetchBusinessActivitiesSectorsQuery,
  useLazyFetchBusinessLinesQuery,
} from '@/states/api/businessRegQueryApiSlice';
import {
  setBusinessActivitiesSectorsList,
  setBusinessLinesList,
  setSelectedBusinessLine,
  setUpdateBusinessLineModal,
} from '@/states/features/businessActivitiesSlice';
import { AppDispatch, RootState } from '@/states/store';
import { BusinessActivity } from '@/types/models/business';
import { faEllipsisH, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Row } from '@tanstack/react-table';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorResponse, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import UpdateBusinessLine from './UpdateBusinessLine';
import { getBusinessActivityStatusColor } from '@/helpers/business.helper';
import { capitalizeString } from '@/helpers/strings.helper';

const ListBusinessActivities = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { businessActivitiesSectorsList, businessLinesList } = useSelector(
    (state: RootState) => state.businessActivities
  );

  // REACT HOOK FORM
  const { control, watch } = useForm();

  const { sectorCode } = watch();

  // INITIALIZE FETCH BUSINESS ACTIVITY SECTOR QUERY
  const [
    fetchBusinessActivitiesSectors,
    {
      data: businessActivitiesSectorsData,
      isFetching: businessActivitiesSectorsIsFetching,
      isSuccess: businessActivitiesSectorsIsSuccess,
      isError: businessActivitiesSectorsIsError,
      error: businessActivitiesSectorsError,
    },
  ] = useLazyFetchBusinessActivitiesSectorsQuery();

  // FETCH BUSINESS ACTIVITY SECTORS
  useEffect(() => {
    fetchBusinessActivitiesSectors({});
  }, [fetchBusinessActivitiesSectors]);

  // HANDLE BUSINESS ACTIVITY SECTORS RESPONSE
  useEffect(() => {
    if (businessActivitiesSectorsIsSuccess && businessActivitiesSectorsData) {
      dispatch(
        setBusinessActivitiesSectorsList(businessActivitiesSectorsData?.data)
      );
    } else if (
      businessActivitiesSectorsIsError &&
      businessActivitiesSectorsError
    ) {
      const errorResponse =
        (businessActivitiesSectorsError as ErrorResponse)?.data?.message ||
        'An error occurred while fetching business activity sectors';
      toast.error(errorResponse);
    }
  }, [
    businessActivitiesSectorsIsSuccess,
    businessActivitiesSectorsData,
    businessActivitiesSectorsIsError,
    businessActivitiesSectorsError,
    dispatch,
  ]);

  // INITIALIZE FETCH BUSINESS LINES QUERY
  const [
    fetchBusinessLines,
    {
      data: businessLinesData,
      isFetching: businessLinesIsFetching,
      isSuccess: businessLinesIsSuccess,
      isError: businessLinesIsError,
      error: businessLinesError,
    },
  ] = useLazyFetchBusinessLinesQuery();

  // FETCH BUSINESS LINES
  useEffect(() => {
    if (sectorCode) {
      fetchBusinessLines({ sectorCode });
    }
  }, [fetchBusinessLines, sectorCode]);

  // HANDLE BUSINESS LINES RESPONSE
  useEffect(() => {
    if (businessLinesIsSuccess && businessLinesData) {
      dispatch(setBusinessLinesList(businessLinesData?.data));
    } else if (businessLinesIsError && businessLinesError) {
      const errorResponse =
        (businessLinesError as ErrorResponse)?.data?.message ||
        'An error occurred while fetching business lines';
      toast.error(errorResponse);
    }
  }, [
    businessLinesIsSuccess,
    businessLinesData,
    businessLinesIsError,
    businessLinesError,
    dispatch,
  ]);

  // BUSINESS LINES EXTENDED COLUMNS
  const businessLinesExtendedColumns = [
    ...businessLineColumns,
    {
      header: 'Disclaimer',
      accessorKey: 'disclaimer',
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }: { row: Row<BusinessActivity> }) => (
        <p
          className={`${getBusinessActivityStatusColor(
            row?.original?.status
          )} rounded-md text-center p-1 px-2 text-white`}
        >
          {capitalizeString(row?.original?.status)}
        </p>
      ),
    },
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: ({ row }: { row: Row<BusinessActivity> }) => {
        return (
          <CustomPopover
            trigger={
              <FontAwesomeIcon
                className="p-1 px-3 rounded-md bg-slate-200 hover:bg-slate-300 cursor-pointer text-primary"
                icon={faEllipsisH}
              />
            }
          >
            <menu className="w-full flex flex-col gap-2">
              <Link
                to={'#'}
                className="flex items-center gap-2 hover:bg-background p-1 px-2 rounded-md text-[13px]"
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(setUpdateBusinessLineModal(true));
                  dispatch(setSelectedBusinessLine(row?.original));
                }}
              >
                <FontAwesomeIcon
                  className="h-3 p-[6px] rounded-full bg-primary text-white"
                  icon={faPenToSquare}
                />{' '}
                Update activity
              </Link>
            </menu>
          </CustomPopover>
        );
      },
    },
  ];

  return (
    <StaffLayout>
      <main className="p-6 rounded-md flex flex-col gap-4 bg-white">
        <section className="w-full flex flex-col gap-4">
          <h1 className="uppercase text-primary font-semibold text-xl w-full text-center">
            Manage business activities
          </h1>
        </section>
        <form className="w-[70%] mx-auto flex flex-col gap-4 bg-white">
          {businessActivitiesSectorsIsFetching ? (
            <figure className="w-full flex flex-col gap-4">
              <Loader className="text-primary" />
            </figure>
          ) : (
            <Controller
              name="sectorCode"
              control={control}
              render={({ field }) => {
                return (
                  <label className="w-full flex flex-col gap-2">
                    <Combobox
                      placeholder="Select business sector"
                      options={(businessActivitiesSectorsList ?? [])?.map(
                        (businessSector) => {
                          return {
                            label: businessSector.description,
                            value: String(businessSector.code),
                          };
                        }
                      )}
                      {...field}
                    />
                  </label>
                );
              }}
            />
          )}
        </form>
        <section className="w-full mx-autp flex flex-col gap-4">
          {businessLinesIsFetching ? (
            <figure className="w-full flex flex-col gap-4">
              <Loader className="text-primary" />
            </figure>
          ) : businessLinesIsError ? (
            <figure className="w-full flex flex-col gap-4">
              <p className="text-red-600 text-center">
                An error occurred while fetching business lines
              </p>
            </figure>
          ) : businessLinesList?.length > 0 ? (
            <Table
              data={businessLinesList}
              columns={businessLinesExtendedColumns}
            />
          ) : (
            <article className="w-full flex flex-col gap-5 my-5">
              <h3 className="w-full text-center uppercase text-primary font-medium">
                Select a business sector to list its associated business
                activities
              </h3>
            </article>
          )}
        </section>
      </main>
      <UpdateBusinessLine />
    </StaffLayout>
  );
};

export default ListBusinessActivities;
