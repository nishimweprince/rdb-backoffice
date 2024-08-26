import Loader from '@/components/inputs/Loader';
import CustomBreadcrumb from '@/components/navigation/CustomBreadcrumb';
import Table from '@/components/table/Table';
import { businessColumns } from '@/constants/business.constants';
import { navigationPaths } from '@/constants/dashboard.constants';
import StaffLayout from '@/containers/navigation/StaffLayout';
import { fetchBusinessesThunk } from '@/states/features/businessSlice';
import { AppDispatch, RootState } from '@/states/store';
import { Business } from '@/types/models/business';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ColumnDef, Row } from '@tanstack/react-table';
import { UUID } from 'crypto';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const AmendedBusinessesList = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { businessesList, businessesIsFetching, businessesIsSuccess } =
    useSelector((state: RootState) => state.business);
  const { user } = useSelector((state: RootState) => state.user);
  const [userId, setUserId] = useState<UUID | undefined>(user?.id);
  const [businessesData, setBusinessesData] = useState<Business[]>(businessesList);

  // FETCH BUSINESS AMENDMENT SUBMISSIONS
  useEffect(() => {
    dispatch(
      fetchBusinessesThunk({
        applicationStatus: 'AMENDMENT_SUBMITTED',
        page: 1,
        size: 100,
      })
    );
  }, [userId, dispatch]);

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
      header: 'Action',
      accessorKey: 'id',
      cell: ({ row }: { row: Row<Business> }) => (
        <Link to={`/applications/amendments?businessId=${row.original?.id}`}>
          <menu className="w-full flex items-center gap-2 font-semibold text-[13px] text-primary hover:gap-3 transition-all ease-in-out duration-300">
            Select
            <FontAwesomeIcon className="text-[13px]" icon={faArrowRight} />
          </menu>
        </Link>
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
