import { RootState } from '@/states/store';
import BusinessAmendmentNavigation from './BusinessAmendmentNavigation';
import { BusinessAmendmentRequestSummary } from './BusinessAmendmentsReview';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import BusinessPeopleTable from '@/pages/business-review/BusinessPeopleTable';
import { PersonDetail } from '@/types/models/personDetail';

const ExecutiveMemberAmendmentReview = () => {
  // STATE VARIABLES
  const [selectedTab, setSelectedTab] = useState('request-summary');
  const { selectedBusinessAmendment } = useSelector(
    (state: RootState) => state.businessAmendment
  );

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
          <ul>
            <h3 className="text-primary uppercase font-medium text-ld">
              Existing executive members
            </h3>
            <BusinessPeopleTable
              businessPeopleList={
                selectedBusinessAmendment?.oldValue as unknown as PersonDetail[]
              }
            />
          </ul>
          <ul>
            <h3 className="text-primary uppercase font-medium text-ld">
              New executive members
            </h3>
            <BusinessPeopleTable
              businessPeopleList={
                [
                  selectedBusinessAmendment?.newValue,
                ] as unknown as PersonDetail[]
              }
            />
          </ul>
        </menu>
      )}
    </main>
  );
};

export default ExecutiveMemberAmendmentReview;
