import Button from '@/components/inputs/Button';
import Table from '@/components/table/Table';
import { formatDate } from '@/helpers/strings.helper';

import { RootState } from '@/states/store';
import { Business } from '@/types/models/business';
import { Row } from '@tanstack/react-table';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import ConfirmationModal from './ConfirmationModal';
import useApplicationCurrencySettings from './hooks/useApplicationCurrencySetting';

const BusApplications = () => {
  // STATE VARIABLES
  const { currencySettings: {business} } = useSelector(
    (state: RootState) => state.business
  );

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [action, setAction] = useState<'enable' | 'disable'>('enable');
  const {handleConfirmation, updateBusinessCurrencySettingsIsLoading} = useApplicationCurrencySettings();

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
      header: 'Status',
      accessorKey: 'status',
    },
    {
      header: 'Created At',
      accessorKey: 'createdAt',
    },
    {
      header: 'Foreign Currency',
      accessorKey: 'foreignCurrency',
      cell: ({ row }: { row: Row<Business> }) => {
        return (
          <>
          {row?.original?.isOtherCurrencyAllowed ?
            <label className="text-blue-500 text-md">Enabled</label>
            :
            <label className="text-gray-500 text-md border-gray-400 !text-gray-500 hover:!text-white hover:border-primary" >Disabled</label>
          }
          </>
        )
    },
    },
    {
      header: 'Action',
      accessorKey: 'foreignCurrencyAction',
      cell: ({ row }: { row: Row<Business> }) => {
        return (
          <>
          {!row?.original?.isOtherCurrencyAllowed ?
            <Button className="text-blue-500 text-xs" primary onClick={() => {
              setAction('enable')  
              setShowConfirmation(true)
            }}>Enable</Button>
            :
            <Button className="text-gray-500 text-xs !border-gray-400 !text-gray-500 hover:!text-white hover:border-primary" 
            onClick={() => {
              setAction('disable')
              setShowConfirmation(true)
            }}
            >Disable</Button>
          }
          </>
        )
    }
    },
  ];

  return (
   
      <section className="flex flex-col gap-2">
        <Table
          showFilter={false}
          showPagination={false}
          data={business?.map(
            (bus, index: number) => {
              return {
                ...bus,
                no: index + 1,
                name: bus?.companyName,
                status: bus?.applicationStatus,
                createdAt: formatDate(bus?.createdAt),
                foreignCurrency: bus?.isOtherCurrencyAllowed ? 'Enabled' : 'Disabled'
              } as unknown as Business;
            }
          )}
          columns={businessNamesColumns}
        />
        <ConfirmationModal 
          isOpen={showConfirmation}
          onClose={() => setShowConfirmation(false)}
          action={action}
          isLoading={updateBusinessCurrencySettingsIsLoading}
          handleConfirmation={handleConfirmation}
        />
      </section>
  );
};

export default BusApplications;
