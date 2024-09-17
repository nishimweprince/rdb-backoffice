import Table from '@/components/table/Table';
import { convertDecimalToPercentage } from '@/helpers/strings.helper';

import { RootState } from '@/states/store';
import { useSelector } from 'react-redux';

const SimilarBusinessNames = () => {
  // STATE VARIABLES
  const { nameAvailabilitiesList } = useSelector(
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
   
      <section className="flex flex-col gap-2">
        <Table
          showFilter={false}
          showPagination={false}
          data={nameAvailabilitiesList?.map(
            (nameAvailability, index: number) => {
              return {
                no: index + 1,
                name: nameAvailability.name,
                similarity: `${convertDecimalToPercentage(
                  nameAvailability.similarity
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
  );
};

export default SimilarBusinessNames;
