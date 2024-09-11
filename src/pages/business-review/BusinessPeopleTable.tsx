import Table from '@/components/table/Table';
import { getCountryName } from '@/constants/location.constants';
import { getGenderLabel } from '@/constants/inputs.constants';
import { capitalizeString } from '@/helpers/strings.helper';
import { PersonDetail } from '@/types/models/personDetail';
import { businessPeopleColumns } from '@/constants/business.constants';
import { ColumnDef, Row } from '@tanstack/react-table';
import CustomTooltip from '@/components/inputs/CustomTooltip';
import { faCircleInfo, faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CustomPopover from '@/components/inputs/CustomPopover';
import { Link } from 'react-router-dom';
import BusinessPersonDetails from './BusinessPersonDetails';
import { AppDispatch } from '@/states/store';
import { useDispatch } from 'react-redux';
import {
  setBusinessPersonDetailsModal,
  setSelectedBusinessPerson,
} from '@/states/features/businessPeopleSlice';

type BusinessPeopleTableProps = {
  businessPeopleList: PersonDetail[];
};

const BusinessPeopleTable = ({
  businessPeopleList,
}: BusinessPeopleTableProps) => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();

  // BUSINESS PEOPLE EXTENDED COLUMNS
  const businessPeopleExtendedColumns = [
    ...businessPeopleColumns,
    {
      id: 'actions',
      header: 'Actions',
      accessorKey: 'actions',
      cell: ({ row }: { row: Row<PersonDetail> }) => {
        return (
          <CustomPopover
            trigger={
              <menu className="w-full flex items-center justify-center cursor-pointer">
                <CustomTooltip label="Click to view actions">
                  <FontAwesomeIcon
                    className="text-primary cursor-pointer p-1 px-4 bg-slate-200 hover:bg-slate-300 rounded-md"
                    icon={faEllipsisH}
                  />
                </CustomTooltip>
              </menu>
            }
          >
            <menu className="bg-white flex flex-col gap-1 p-0 rounded-md">
              <Link
                className="w-full flex items-center gap-2 text-[13px] text-center p-1 px-2 rounded-sm hover:bg-gray-100"
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(setBusinessPersonDetailsModal(true));
                  dispatch(setSelectedBusinessPerson(row.original));
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
    <section className="flex flex-col items-center w-full gap-2">
      <Table
        data={businessPeopleList?.map((person: PersonDetail) => {
          return {
            ...person,
            position: capitalizeString(person?.personRole?.roleDescription),
            name: `${person?.firstName} ${person?.middleName || ''} ${
              person?.lastName || ''
            }`,
            nationality: getCountryName(person?.nationality),
            gender: getGenderLabel(person?.gender),
          };
        })}
        columns={businessPeopleExtendedColumns as ColumnDef<PersonDetail>[]}
        showFilter={false}
        showPagination={false}
      />
      <BusinessPersonDetails />
    </section>
  );
};

export default BusinessPeopleTable;
