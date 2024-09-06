import Modal from '@/components/cards/Modal';
import Table from '@/components/table/Table';
import { formatNumbers } from '@/helpers/strings.helper';
import { setSimilarBusinessNamesModal } from '@/states/features/businessSlice';
import { setSelectedNameReservation } from '@/states/features/nameReservationSlice';
import { AppDispatch, RootState } from '@/states/store';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

const SimilarBusinessNames = ({ businessName }: { businessName: string }) => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { similarBusinessNamesModal, nameAvailabilitiesList } = useSelector(
    (state: RootState) => state.business
  );

  // BUSINESS NAMES COLUMNS
  const businessNamesColumns = [
    {
      header: 'No',
      accessorKey: 'no',
    },
    {
      header: 'Business Name',
      accessorKey: 'name',
    },
    {
      header: 'Similarity',
      accessorKey: 'similarity',
    },
    {
      header: 'Status',
      accessorKey: 'status',
    },
  ];

  return (
    <Modal
      isOpen={similarBusinessNamesModal}
      onClose={() => {
        dispatch(setSimilarBusinessNamesModal(false));
        dispatch(setSelectedNameReservation(undefined));
      }}
      heading={`List of businesses with similar names to ${businessName?.toUpperCase()}`}
      className="min-w-[50vw]"
    >
      <section className="flex flex-col gap-2">
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
          columns={businessNamesColumns}
        />
      </section>
    </Modal>
  );
};

export default SimilarBusinessNames;
