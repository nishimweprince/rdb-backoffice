import { useState } from 'react'
import BusinessAmendmentNavigation from './BusinessAmendmentNavigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/states/store';
import { BusinessAmendmentRequestSummary } from './BusinessAmendmentsReview';

const RestoreBusinessAmendmentReview = () => {
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
      </main>
  )
}

export default RestoreBusinessAmendmentReview;
