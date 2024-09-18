import Loader from '@/components/inputs/Loader';
import CustomBreadcrumb from '@/components/navigation/CustomBreadcrumb';
import StaffLayout from '@/containers/navigation/StaffLayout';
import {
  setNameReservationPage,
} from '@/states/features/nameReservationSlice';
import SimilarBusinessNames from './SimilarBusinessNames';
import NameAvailabilityFilters from './NameAvailabilityFilters';
import useNameAvailabilitySearch from './hooks/useNameAvailabilitySearch';

const NameAvailabilitySearch = () => {
  // FETCH NAME RESERVATIONS
  const { searchBusinessNameAvailability, businessNameAvailabilityIsFetching,handleFilterBusinessListsByStatus } = useNameAvailabilitySearch();

  // NAVIGATION LINKS
  const nameReservationsLinks = [
    {
      label: 'Dashboard',
      route: '/dashboard',
    },
    {
      label: 'Name Availability',
      route: '/applications/name-availability',
    },
  ];

  return (
    <StaffLayout>
      <main className="w-full flex flex-col gap-4 p-6">
        <CustomBreadcrumb navigationLinks={nameReservationsLinks} />
        <menu className="w-full flex items-center gap-3 justify-between">
          <h1 className="uppercase text-primary text-lg font-semibold px-2">
            Name availability search
          </h1>
        </menu>
          <NameAvailabilityFilters
            onSelectStatus={(status) => {
              handleFilterBusinessListsByStatus(status);
              setNameReservationPage(1);
            }}
            onHandleSearch={(searchKey) => {
              searchBusinessNameAvailability({companyName:searchKey});
              setNameReservationPage(1);
            }}
            showFilter={true}
          />
        {businessNameAvailabilityIsFetching ? (
          <figure className="w-full flex items-center gap-3 justify-center">
            <Loader className="text-primary" />
          </figure>
        ) : (
          <section className="w-full flex flex-col gap-4 px-2">
             <SimilarBusinessNames/>
          </section>
        )}
      </main>
     
    </StaffLayout>
  );
};

export default NameAvailabilitySearch;
