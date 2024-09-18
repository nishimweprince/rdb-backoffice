import { useState } from 'react';
import BusinessAmendmentNavigation from './BusinessAmendmentNavigation';
import { BusinessAmendmentRequestSummary } from './BusinessAmendmentReview';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/states/store';
import FounderDetailsTable from '@/pages/business-review/FounderDetailsTable';
import { FounderDetail, PersonDetail } from '@/types/models/personDetail';
import Table from '@/components/table/Table';
import { founderDetailColumns } from '@/constants/business.constants';
import { capitalizeString } from '@/helpers/strings.helper';
import { ColumnDef, Row } from '@tanstack/react-table';
import CustomPopover from '@/components/inputs/CustomPopover';
import CustomTooltip from '@/components/inputs/CustomTooltip';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import {
  setFounderDetailsModal,
  setSelectedFounderDetail,
} from '@/states/features/founderDetailSlice';
import FounderDetails from '@/pages/business-review/BusinessFounderDetails';
import { Organization } from '@/types/models/organization';

const BusinessFounderAmendmentReview = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const [selectedTab, setSelectedTab] = useState('request-summary');
  const { selectedBusinessAmendment } = useSelector(
    (state: RootState) => state.businessAmendment
  );

  // FOUNDERS EXTENDED COLUMNS
  const founderDetailExtendedColumns = [
    ...founderDetailColumns,
    {
      id: 'actions',
      header: 'Actions',
      accessorKey: 'actions',
      cell: ({ row }: { row: Row<FounderDetail> }) => {
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
                  dispatch(
                    setSelectedFounderDetail({ personDetail: row?.original })
                  );
                  dispatch(setFounderDetailsModal(true));
                }}
                to={'#'}
              >
                View Details
              </Link>
            </menu>
          </CustomPopover>
        );
      },
    },
  ];

  return (
    <main className="w-full flex flex-col gap-4">
      <BusinessAmendmentNavigation
        onSelectTab={(slug) => {
          setSelectedTab(slug);
        }}
      />
      {selectedTab === 'request-summary' && (
        <BusinessAmendmentRequestSummary
          businessAmendment={selectedBusinessAmendment}
        />
      )}
      {selectedTab === 'changes-requested' && (
        <menu className="w-full flex flex-col gap-4">
          <menu className="w-full flex flex-col gap-4">
            <h3 className="uppercase text-primary font-semibold text-lg">
              Existing founders
            </h3>
            <FounderDetailsTable
              founderDetailsList={
                selectedBusinessAmendment?.oldValue as unknown as FounderDetail[]
              }
            />
          </menu>
          <menu className="w-full flex flex-col gap-3">
            <h3 className="uppercase text-primary font-semibold text-lg">
              New founders
            </h3>
            <Table
              columns={
                founderDetailExtendedColumns as ColumnDef<FounderDetail & {
                  name?: string;
                  personDocNo?: string;
                  shareHolderType?: string;
                }>[]
              }
              data={[
                selectedBusinessAmendment?.newValue as unknown as {
                  founderDetail: PersonDetail & {
                    id: string;
                    firstName: string;
                    lastName: string;
                    personDocNo: string;
                    personRole: { roleName: string };
                  };
                  organization: Organization;
                },
              ]?.map((founder) => {
                return {
                  id: founder?.founderDetail?.id || '',
                  ...founder,
                  name: `${
                    founder?.founderDetail?.firstName ||
                    founder?.organization?.organizationName ||
                    ''
                  } ${founder?.founderDetail?.lastName || ''}`,
                  personDocNo: founder?.founderDetail?.personDocNo || founder?.organization?.tin,
                  shareHolderType: capitalizeString(
                    founder?.founderDetail?.personRole?.roleName
                  ),
                };
              })}
              showPagination={false}
            />
          </menu>
        </menu>
      )}

      <FounderDetails />
    </main>
  );
};

export default BusinessFounderAmendmentReview;
