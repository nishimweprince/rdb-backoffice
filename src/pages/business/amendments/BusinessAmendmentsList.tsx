import CustomPopover from '@/components/inputs/CustomPopover';
import CustomTooltip from '@/components/inputs/CustomTooltip';
import Loader from '@/components/inputs/Loader';
import CustomBreadcrumb from '@/components/navigation/CustomBreadcrumb';
import Table from '@/components/table/Table';
import { businessAmendmentColumns } from '@/constants/businessAmendment.constants';
import { navigationPaths } from '@/constants/dashboard.constants';
import StaffLayout from '@/containers/navigation/StaffLayout';
import {
  fetchBusinessAmendmentsThunk,
  setSelectedBusinessAmendment,
} from '@/states/features/businessAmendmentSlice';
import { AppDispatch, RootState } from '@/states/store';
import { BusinessAmendment } from '@/types/models/business';
import {
  faCircleInfo,
  faEllipsisVertical,
  faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ColumnDef, Row } from '@tanstack/react-table';
import { UUID } from 'crypto';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

const BusinessAmendmentsList = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const {
    businessAmendmentsList,
    fetchBusinessAmendmentsIsFetching,
    fetchBusinessAmendmentsIsSuccess,
  } = useSelector((state: RootState) => state.businessAmendment);
  const { user } = useSelector((state: RootState) => state.user);
  const [userId, setUserId] = useState<UUID | undefined>(user?.id);

  // NAVIGATION
  const navigate = useNavigate();

  // FETCH BUSINESS AMENDMENTS
  useEffect(() => {
    dispatch(fetchBusinessAmendmentsThunk({ userId: userId }));
  }, [userId, dispatch]);

  // NAVIGATION LINKS
  const navigationExtendedPaths = [
    ...navigationPaths,
    {
      label: 'Business Amendments',
      route: '/applications/amendments',
    },
  ];

  const businessAmendmentExtendedColumns = [
    ...businessAmendmentColumns,
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
                    className="text-primary text-md p-0 transition-all duration-300 hover:scale-[.98]"
                    icon={faEllipsisVertical}
                  />
                </CustomTooltip>
              </menu>
            }
          >
            <menu className="flex flex-col gap-1 p-0 bg-white rounded-md">
              {['AMENDMENT_SUBMITTED', 'PENDING_APPROVAL', 'RESUBMITTED', 'PENDING_REJECTION'].includes(
                row?.original?.status
              ) &&
                ([
                  row?.original?.assignedApprover?.id,
                  row?.original?.assignedVerifier?.id,
                ].includes(user?.id) ||
                  true) && (
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
                <FontAwesomeIcon className="text-primary" icon={faCircleInfo} />
                View details
              </Link>
            </menu>
          </CustomPopover>
        );
      },
    },
  ];

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
