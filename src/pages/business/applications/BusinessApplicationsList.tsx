import { useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/states/store';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import {
  fetchBusinessesThunk,
  setBusinessPage,
  setBusinessSize,
  setSelectedBusiness,
  setUpdateBusinessIsSuccess,
  updateBusinessThunk,
} from '@/states/features/businessSlice';
import { ColumnDef, Row } from '@tanstack/react-table';
import { Business } from '@/types/models/business';
import Table from '@/components/table/Table';
import Loader from '@/components/inputs/Loader';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { capitalizeString, formatDate } from '@/helpers/strings.helper';
import { businessColumns } from '@/constants/business.constants';
import CustomPopover from '@/components/inputs/CustomPopover';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleInfo,
  faEllipsisVertical,
  faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons';
import CustomTooltip from '@/components/inputs/CustomTooltip';
import TableToolbar from '@/components/table/TableToolbar';
import StaffLayout from '@/containers/navigation/StaffLayout';
import { navigationPaths } from '@/constants/dashboard.constants';
import CustomBreadcrumb from '@/components/navigation/CustomBreadcrumb';
import { UUID } from 'crypto';
import BusinessApplicationsFilter from './BusinessApplicationsFilter';
import { getBusinessStatusColor } from '@/helpers/business.helper';

const ReviewBusinessApplications = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const {
    businessesList,
    page,
    size,
    totalElements,
    totalPages,
    updateBusinessIsLoading,
    updateBusinessIsSuccess,
    businessesIsFetching,
    selectedBusiness,
  } = useSelector((state: RootState) => state.business);
  const [applicationStatuses, setSelectedApplicationStatuses] = useState<string[]>([]);
  const { user } = useSelector((state: RootState) => state.user);
  const [userId, setUserId] = useState<UUID | undefined>(user?.id);
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [serviceId, setServiceId] = useState<UUID | undefined>(undefined);

  // NAVIGATION
  const navigate = useNavigate();

  // SET DOCUMENT TITLE
  document.title = 'Review Business Applications';

  // FETCH BUSINESSES
  useEffect(() => {
    dispatch(
      fetchBusinessesThunk({
        applicationStatus: applicationStatuses?.join(','),
        page,
        size,
        userId,
        serviceId
      })
    );
  }, [applicationStatuses, dispatch, page, serviceId, size, userId]);

  // HANDLE UPDATE BUSINESS IS SUCCESS
  useEffect(() => {
    if (updateBusinessIsSuccess && selectedBusiness) {
      dispatch(setUpdateBusinessIsSuccess(false));
      navigate(`/applications/business/${selectedBusiness?.id}/review`);
      dispatch(setSelectedBusiness(undefined));
    }
  }, [updateBusinessIsSuccess, selectedBusiness, navigate, dispatch]);

  // TABLE COLUMNS
  const businessExtendedColumns = [
    ...businessColumns,
    {
      id: 'applicationStatus',
      header: 'Application status',
      accessorKey: 'service.name',
      cell: ({ row }: { row: Row<Business> }) => (
        <p
          className={`${getBusinessStatusColor(
            row?.original?.applicationStatus
          )} text-white p-1 px-2 rounded-md text-center text-[14px]`}
        >
          {capitalizeString(row?.original?.applicationStatus)}
        </p>
      ),
      filterFn: (row: Row<unknown>, id: string, value: string) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      id: 'action',
      header: 'Action',
      accessorKey: 'action',
      cell: ({ row }: { row: Row<Business> }) => {
        return (
          <CustomPopover
            trigger={
              <menu className="flex items-center justify-center w-full gap-2 text-[12px] cursor-pointer">
                <CustomTooltip label="Click to view options">
                  <FontAwesomeIcon
                    className="text-primary text-md p-0 transition-all duration-300 hover:scale-[.98]"
                    icon={faEllipsisVertical}
                  />
                </CustomTooltip>
              </menu>
            }
          >
            <menu className="flex flex-col gap-1 p-0 bg-white rounded-md">
              {[
                'SUBMITTED',
                'RESUBMITTED',
                'ACTION_REQUIRED',
                'PENDING_DECISION',
                'IN_REVIEW',
              ].includes(row?.original?.applicationStatus) &&
                [
                  row?.original?.assignedApprover?.id,
                  row?.original?.assignedVerifier?.id,
                ].includes(user?.id) && (
                  <Link
                    className="w-full flex items-center gap-2 text-[13px] text-center p-1 px-2 rounded-sm hover:bg-gray-100"
                    onClick={async (e) => {
                      e.preventDefault();
                      dispatch(setSelectedBusiness(row?.original));
                      await dispatch(
                        updateBusinessThunk({
                          businessId: row?.original?.id,
                          applicationStatus:
                            row?.original?.applicationStatus ===
                            'PENDING_DECISION'
                              ? 'PENDING_DECISION'
                              : 'IN_REVIEW',
                        })
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
                <FontAwesomeIcon className="text-primary" icon={faCircleInfo} />
                View details
              </Link>
            </menu>
          </CustomPopover>
        );
      },
    },
  ];

  // NAVIGATION PATHS
  const navigationExtendedPaths = [
    ...navigationPaths,
    {
      label: 'Applications',
      route: '/applications/business',
    },
  ];

  // HANDLE UPDATE BUSINESS RESPONSE
  useEffect(() => {
    if (updateBusinessIsSuccess) {
      toast.success('Business review started');
    }
  }, [updateBusinessIsLoading, updateBusinessIsSuccess]);

  return (
    <StaffLayout>
      <section className="flex flex-col w-full gap-3 p-6 bg-white rounded-md">
        <section className="flex items-center gap-4 justify-between my-2">
          <Link
            to={'#'}
            onClick={(e) => {
              e.preventDefault();
              setUserId(user?.id);
            }}
            className={`w-full p-3 rounded-md ${
              (userId && userId === user?.id)
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
              (!userId || userId !== user?.id)
                ? 'bg-primary text-white'
                : 'bg-white text-primary border-primary border'
            } text-center uppercase`}
          >
            All applications
          </Link>
        </section>
        <CustomBreadcrumb navigationLinks={navigationExtendedPaths} />
        {businessesIsFetching ? (
          <figure className="flex justify-center w-full">
            <Loader />
          </figure>
        ) : (
          <menu className="w-full flex flex-col gap-4">
            <TableToolbar
              showSearch={true}
              filterHandler={(e) => {
                e.preventDefault();
                setShowFilter(!showFilter);
              }}
            />
            {showFilter && (
              <BusinessApplicationsFilter
                onSelectService={(service) => {
                  setServiceId(service);
                }}
                onSelectApplicationStatus={(statuses) => {
                  setSelectedApplicationStatuses(statuses);
                }}
                onSelectUser={(userId) => {
                  setUserId(userId);
                }}
              />
            )}
            <Table
              page={page}
              size={size}
              totalElements={totalElements}
              totalPages={totalPages}
              setPage={setBusinessPage}
              setSize={setBusinessSize}
              columns={businessExtendedColumns as ColumnDef<Business>[]}
              data={businessesList?.map((business, index) => {
                return {
                  ...business,
                  no: index + 1,
                  dateOfIncorporation: formatDate(
                    business?.createdAt
                  ) as unknown as Date,
                  companyType: capitalizeString(business?.companyType) || 'N/A',
                  assignee: 'RDB Verifier',
                  companyName: (
                    business?.companyName ||
                    business?.enterpriseName ||
                    business?.enterpriseBusinessName
                  )?.toUpperCase(),
                };
              })}
            />
          </menu>
        )}
      </section>
    </StaffLayout>
  );
};

export default ReviewBusinessApplications;
