import CustomPopover from '@/components/inputs/CustomPopover';
import CustomTooltip from '@/components/inputs/CustomTooltip';
import Loader from '@/components/inputs/Loader';
import CustomBreadcrumb from '@/components/navigation/CustomBreadcrumb';
import Table from '@/components/table/Table';
import { businessAmendmentColumns } from '@/constants/businessAmendment.constants';
import { navigationPaths } from '@/constants/dashboard.constants';
import StaffLayout from '@/containers/navigation/StaffLayout';
import { getBusinessAmendmentStatusColor } from '@/helpers/business.helper';
import { capitalizeString } from '@/helpers/strings.helper';
import {
  fetchBusinessAmendmentsThunk,
  setSelectedBusinessAmendment,
} from '@/states/features/businessAmendmentSlice';
import { getBusinessThunk } from '@/states/features/businessSlice';
import { AppDispatch, RootState } from '@/states/store';
import { BusinessAmendment } from '@/types/models/business';
import {
  faCircleInfo,
  faEllipsisH,
  faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ColumnDef, Row } from '@tanstack/react-table';
import { UUID } from 'crypto';
import queryString, { ParsedQuery } from 'query-string';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const BusinessAmendmentsList = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const {
    businessAmendmentsList,
    fetchBusinessAmendmentsIsFetching,
    fetchBusinessAmendmentsIsSuccess,
  } = useSelector((state: RootState) => state.businessAmendment);
  const {
    business,
    getBusinessIsError,
    getBusinessIsFetching,
    getBusinessIsSuccess,
  } = useSelector((state: RootState) => state.business);
  const { user } = useSelector((state: RootState) => state.user);
  const [userId, setUserId] = useState<UUID | undefined>(user?.id);
  const [queryParams, setQueryParams] = useState<ParsedQuery<string | number>>(
    {}
  );

  // NAVIGATION
  const { search } = useLocation();
  const navigate = useNavigate();

  // GET PARAM FROM PATH
  useEffect(() => {
    setQueryParams(queryString.parse(search));
  }, [search]);

  // GET BUSINESS THUNK
  useEffect(() => {
    if (queryParams?.businessId) {
      dispatch(getBusinessThunk(queryParams?.businessId as UUID));
    }
  }, [userId, dispatch, queryParams?.businessId]);

  // FETCH BUSINESS AMENDMENTS
  useEffect(() => {
    dispatch(
      fetchBusinessAmendmentsThunk({
        userId,
        businessId: queryParams?.businessId,
      })
    );
  }, [userId, dispatch, queryParams?.businessId]);

  // NAVIGATION LINKS
  const navigationExtendedPaths = [
    ...navigationPaths,
    {
      label: 'Business Amendments',
      route: '/applications/business/amendments',
    },
    {
      label: `${
        getBusinessIsFetching ? '...' : business?.applicationReferenceId
      }`,
      route: `/applications/amendments?businessId=${business?.id}`,
    },
  ];

  const businessAmendmentExtendedColumns = [
    ...businessAmendmentColumns,
    {
      header: 'Amendment Status',
      accessorKey: 'amendmentStatus',
      cell: ({ row }: { row: Row<BusinessAmendment> }) => (
        <p
          className={`${getBusinessAmendmentStatusColor(
            row?.original?.status
          )} text-white rounded-md text-center p-1 text-[13px]`}
        >
          {capitalizeString(row?.original?.status)}
        </p>
      ),
    },
    {
      id: 'action',
      header: 'Action',
      accessorKey: 'action',
      cell: ({ row }: { row: Row<BusinessAmendment> }) => {
        return (
          <CustomPopover
            trigger={
              <menu className="flex items-center justify-center w-full gap-2 text-[12px] cursor-pointer">
                <CustomTooltip label="Click to view options">
                  <FontAwesomeIcon
                    className="text-primary text-md p-1 transition-all duration-300 hover:scale-[.98] px-4 bg-slate-200 hover:bg-slate-300 rounded-md"
                    icon={faEllipsisH}
                  />
                </CustomTooltip>
              </menu>
            }
          >
            {getBusinessIsFetching || fetchBusinessAmendmentsIsFetching ? (
              <figure className="w-full flex items-center gap-4 min-h-[40vh]">
                <Loader className="text-primary" />
              </figure>
            ) : (
              fetchBusinessAmendmentsIsSuccess &&
              getBusinessIsSuccess && (
                <menu className="flex flex-col gap-1 p-0 bg-white rounded-md">
                  {((['AMENDMENT_SUBMITTED', 'RESUBMITTED'].includes(
                    row?.original?.status
                  ) &&
                    [row?.original?.assignedVerifier?.id].includes(user?.id)) ||
                    (['PENDING_APPROVAL', 'PENDING_REJECTION'].includes(
                      row?.original?.status
                    ) &&
                      [row?.original?.assignedApprover?.id].includes(
                        user?.id
                      ))) && (
                    <Link
                      className="w-full flex items-center gap-2 text-[13px] text-center p-1 px-2 rounded-sm hover:bg-gray-100"
                      onClick={async (e) => {
                        e.preventDefault();
                        dispatch(setSelectedBusinessAmendment(row?.original));
                        navigate(
                          `/applications/amendments/review?businessId=${row?.original?.businessId}&amendmentType=${row?.original?.amendmentType}`
                        );
                      }}
                      to={'#'}
                    >
                      <FontAwesomeIcon
                        className="text-primary"
                        icon={faMagnifyingGlass}
                      />{' '}
                      Review
                    </Link>
                  )}
                  <Link
                    className="w-full flex items-center gap-2 text-[13px] text-center p-1 px-2 rounded-sm hover:bg-gray-100"
                    onClick={(e) => {
                      e.preventDefault();
                    }}
                    to={'#'}
                  >
                    <FontAwesomeIcon
                      className="text-primary"
                      icon={faCircleInfo}
                    />
                    View details
                  </Link>
                </menu>
              )
            )}
          </CustomPopover>
        );
      },
    },
  ];

  useEffect(() => {
    if (getBusinessIsError) {
      navigate('/applications/business/amendments');
    }
  }, [getBusinessIsError, navigate]);

  return (
    <StaffLayout>
      <main className="w-full flex flex-col gap-4 p-6">
        <section className="flex items-center gap-4 justify-between my-2">
          <Link
            to={'#'}
            onClick={(e) => {
              e.preventDefault();
              setUserId(user?.id);
            }}
            className={`w-full p-3 rounded-md ${
              userId && userId === user?.id
                ? 'bg-primary text-white'
                : 'bg-white text-primary border-primary border'
            } text-center uppercase`}
          >
            Assigned to me
          </Link>
          <Link
            to={'#'}
            onClick={(e) => {
              e.preventDefault();
              setUserId(undefined);
            }}
            className={`w-full p-3 rounded-md ${
              !userId || userId !== user?.id
                ? 'bg-primary text-white'
                : 'bg-white text-primary border-primary border'
            } text-center uppercase`}
          >
            All applications
          </Link>
        </section>
        <CustomBreadcrumb navigationLinks={navigationExtendedPaths} />
        {fetchBusinessAmendmentsIsFetching ? (
          <Loader />
        ) : (
          fetchBusinessAmendmentsIsSuccess && (
            <Table
              data={businessAmendmentsList
                ?.slice()
                ?.sort((a, b) => Number(b?.updatedAt) - Number(a?.updatedAt))}
              columns={
                businessAmendmentExtendedColumns as ColumnDef<BusinessAmendment>[]
              }
            />
          )
        )}
      </main>
    </StaffLayout>
  );
};

export default BusinessAmendmentsList;
