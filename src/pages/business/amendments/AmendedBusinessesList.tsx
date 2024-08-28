import CustomPopover from '@/components/inputs/CustomPopover';
import Loader from '@/components/inputs/Loader';
import CustomBreadcrumb from '@/components/navigation/CustomBreadcrumb';
import Table from '@/components/table/Table';
import { businessColumns } from '@/constants/business.constants';
import { navigationPaths } from '@/constants/dashboard.constants';
import StaffLayout from '@/containers/navigation/StaffLayout';
import { getBusinessStatusColor } from '@/helpers/business.helper';
import { capitalizeString } from '@/helpers/strings.helper';
import { fetchBusinessesThunk } from '@/states/features/businessSlice';
import { AppDispatch, RootState } from '@/states/store';
import { Business } from '@/types/models/business';
import { faEllipsisH, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ColumnDef, Row } from '@tanstack/react-table';
import { UUID } from 'crypto';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

const AmendedBusinessesList = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { businessesList, businessesIsFetching, businessesIsSuccess } =
    useSelector((state: RootState) => state.business);
  const { user } = useSelector((state: RootState) => state.user);
  const [userId, setUserId] = useState<UUID | undefined>(user?.id);
  const [businessesData, setBusinessesData] =
    useState<Business[]>(businessesList);

  // NAVIGATION
  const navigate = useNavigate();

  // FETCH BUSINESS AMENDMENT SUBMISSIONS
  useEffect(() => {
    dispatch(
      fetchBusinessesThunk({
        applicationStatus: 'AMENDMENT_SUBMITTED',
        page: 1,
        size: 100,
      })
    );
  }, [dispatch]);

  // NAVIGATION LINKS
  const navigationExtendedPaths = [
    ...navigationPaths,
    {
      label: 'Business Amendments',
      route: '/applications/amendments',
    },
  ];

  const businessExtendedColumns = [
    ...businessColumns,
    {
      id: 'applicationStatus',
      header: 'Status',
      cell: ({ row }: { row: Row<Business> }) => (
        <p
          className={`${getBusinessStatusColor(
            row?.original?.applicationStatus
          )} text-white text-[13px] font-medium p-1 rounded-md text-center`}
        >
          {capitalizeString(row?.original?.applicationStatus)}
        </p>
      ),
    },
    {
      header: 'Action',
      accessorKey: 'id',
      cell: ({ row }: { row: Row<Business> }) => (
        <CustomPopover
          trigger={
            <FontAwesomeIcon
              className="text-[13px] bg-slate-200 hover:bg-slate-300 p-1 px-4 rounded-md text-primary cursor-pointer"
              icon={faEllipsisH}
            />
          }
        >
          <menu className="flex flex-col gap-2">
            <Link
              className="w-full flex items-center gap-2 text-[13px] text-center p-1 px-2 rounded-sm hover:bg-gray-100"
              onClick={(e) => {
                e.preventDefault();
                navigate(
                  `/applications/amendments?businessId=${row.original?.id}`
                );
              }}
              to={'#'}
            >
              <FontAwesomeIcon className="text-primary" icon={faPenToSquare} />
              View amendments
            </Link>
          </menu>
        </CustomPopover>
      ),
    },
  ];

  useEffect(() => {
    if (userId) {
      setBusinessesData(
        businessesList?.filter((business) => {
          return (
            business?.assignedVerifier?.id === userId ||
            business?.assignedApprover?.id === userId
          );
        })
      );
    } else {
      setBusinessesData(businessesList);
    }
  }, [businessesList, userId]);

  return (
    <StaffLayout>
      <main className="w-full flex flex-col gap-5">
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
        {businessesIsFetching ? (
          <figure className="w-full flex items-center justify-center gap-3">
            <Loader className="text-primary" />
          </figure>
        ) : businessesIsSuccess && businessesList?.length > 0 ? (
          <section className="w-full flex flex-col gap-4">
            <Table
              data={businessesData}
              columns={businessExtendedColumns as ColumnDef<Business>[]}
            />
          </section>
        ) : (
          <figure className="w-full flex items-center justify-center gap-3">
            <p className="text-primary">No business amendments found</p>
          </figure>
        )}
      </main>
    </StaffLayout>
  );
};

export default AmendedBusinessesList;
