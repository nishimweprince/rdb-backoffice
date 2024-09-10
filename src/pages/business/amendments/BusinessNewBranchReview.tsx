import { RootState } from '@/states/store';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import BusinessAmendmentNavigation from './BusinessAmendmentNavigation';
import { BusinessAmendmentRequestSummary } from './BusinessAmendmentsReview';
import { formatDateTime } from '@/helpers/strings.helper';

const BusinessNewBranchReview = () => {
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
        <section className="w-full flex flex-col gap-3">
          <h1 className="uppercase text-primary font-semibold text-lg">
            Provided information
          </h1>
          <menu className="grid grid-cols-2 gap-5 w-full">
            <ul className="w-full flex items-center gap-1">
              <p>Branch name:</p>
              <p className="font-medium text-black">
                {selectedBusinessAmendment?.newValue?.branchName}
              </p>
            </ul>
            <ul className="w-full flex items-center gap-1">
              <p>Date of submission:</p>
              <p className="font-medium">
                {formatDateTime(selectedBusinessAmendment?.newValue?.updatedAt)}
              </p>
            </ul>
            <ul className="w-full flex items-center gap-1">
              <p>Start of working hours:</p>
              <p className="font-medium">
                {(selectedBusinessAmendment as unknown as {
                    newValue: {
                        workingHrsFrom: string;
                    };
                })?.newValue?.workingHrsFrom}
              </p>
            </ul>
            <ul className="w-full flex items-center gap-1">
              <p>End of working hours:</p>
              <p className="font-medium">
                {(selectedBusinessAmendment as unknown as {
                    newValue: {
                        workingHrsTo: string;
                    };
                })?.newValue?.workingHrsTo}
              </p>
            </ul>
          </menu>
        </section>
      )}
    </main>
  );
};

export default BusinessNewBranchReview;
