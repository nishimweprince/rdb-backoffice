import Table from '@/components/table/Table';
import { countriesList } from '@/constants/location.constants';
import { genderOptions } from '@/constants/inputs.constants';
import { capitalizeString } from '@/helpers/strings.helper';
import { businessId } from '@/types/models/business';
import { PersonDetail } from '@/types/models/personDetail';
import { businessPeopleColumns } from '@/constants/business.constants';
import { ColumnDef, Row } from '@tanstack/react-table';
import CustomTooltip from '@/components/inputs/CustomTooltip';
import {
  faCircleInfo,
  faEllipsisVertical,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CustomPopover from '@/components/inputs/CustomPopover';
import { Link } from 'react-router-dom';
import BusinessPersonDetails from './BusinessPersonDetails';
import { AppDispatch } from '@/states/store';
import { useDispatch } from 'react-redux';
import { setBusinessPersonDetailsModal, setSelectedBusinessPerson } from '@/states/features/businessPeopleSlice';

type BusinessPeopleTableProps = {
  businessId?: businessId;
  businessPeopleList: PersonDetail[];
};

const BusinessPeopleTable = ({
  businessPeopleList,
}: BusinessPeopleTableProps) => {

  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();

  if (businessPeopleList?.length <= 0) return null;

  // BUSINESS PEOPLE EXTENDED COLUMNS
  const businessPeopleExtendedColumns = [
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
                    className="text-primary cursor-pointer"
                    icon={faEllipsisVertical}
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
    ...businessPeopleColumns,
  ];

  return (
    <section className="flex flex-col items-center w-full gap-2">
      {businessPeopleList?.length <= 0 && (
        <p className="text-sm text-center text-gray-500">No people found</p>
      )}
      {businessPeopleList?.length > 0 && (
        <Table
          data={businessPeopleList?.map((person: PersonDetail) => {
            return {
              ...person,
              position: capitalizeString(person?.roleDescription),
              name: `${person.firstName} ${person.middleName || ''} ${
                person.lastName || ''
              }`,
              nationality: countriesList?.find(
                (country) => country?.code === person?.nationality
              )?.name,
              gender: genderOptions?.find(
                (gender) => gender?.value === person?.gender
              )?.label,
            };
          })}
          columns={businessPeopleExtendedColumns as ColumnDef<PersonDetail>[]}
          showFilter={false}
        />
      )}
      <BusinessPersonDetails />
    </section>
  );
};

export default BusinessPeopleTable;
