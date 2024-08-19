import { useState } from 'react';
import BusinessAmendmentNavigation from './BusinessAmendmentNavigation';
import { RootState } from '@/states/store';
import { useSelector } from 'react-redux';
import { capitalizeString } from '@/helpers/strings.helper';
import { BusinessAmendmentRequestSummary } from './BusinessAmendmentsReview';

const CompanyDetailsAmendmentReview = () => {
  // STATE VARIABLES
  const { selectedBusinessAmendment } = useSelector(
    (state: RootState) => state.businessAmendment
  );
  const [selectedTab, setSelectedTab] = useState('request-summary');

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

      {selectedTab === 'current-details' && (
        <section className="w-full flex flex-col gap-4">
          <h2 className="uppercase text-primary font-semibold text-lg">
            Current company details
          </h2>
          <menu className="grid grid-cols-2 gap-5 w-full">
            <ul className="flex items-center gap-5">
              <p>Company name:</p>
              <p className="font-medium">
                {selectedBusinessAmendment?.business?.companyName ||
                  selectedBusinessAmendment?.business?.branchName ||
                  selectedBusinessAmendment?.business?.enterpriseName ||
                  selectedBusinessAmendment?.business?.enterpriseBusinessName}
              </p>
            </ul>
            <ul className="flex items-center gap-5">
              <p>Company code:</p>
              <p className="font-medium">
                {selectedBusinessAmendment?.business?.tin || 'N/A'}
              </p>
            </ul>
            <ul className="flex items-center gap-5">
              <p>Company type:</p>
              <p className="font-medium">
                {capitalizeString(
                  selectedBusinessAmendment?.oldValue?.companyType
                )}
              </p>
            </ul>
            <ul className="flex items-center gap-5">
              <p>Company status:</p>
              <p className="font-medium">
                {capitalizeString(
                  selectedBusinessAmendment?.oldValue?.applicationStatus
                )}
              </p>
            </ul>
            <ul className="flex items-center gap-5">
              <p>Has articles of association:</p>
              <p className="font-medium">
                {selectedBusinessAmendment?.oldValue?.hasArticlesOfAssociation
                  ? 'Yes'
                  : 'No'}
              </p>
            </ul>
            <ul className="flex items-center gap-5">
              <p>Company category:</p>
              <p className="font-medium">
                {capitalizeString(
                  selectedBusinessAmendment?.oldValue?.companyCategory
                )}
              </p>
            </ul>
          </menu>
        </section>
      )}

      {selectedTab === 'proposed-changes' && (
        <section className="w-full flex flex-col gap-4">
          <h2 className="uppercase text-primary font-semibold text-lg">
            Proposed changes
          </h2>
          <menu className="grid grid-cols-2 gap-5 w-full">
            <ul className="flex items-center gap-5">
              <p>Company name:</p>
              <p className="font-medium">
                {selectedBusinessAmendment?.newValue?.companyName ||
                  selectedBusinessAmendment?.newValue?.branchName ||
                  selectedBusinessAmendment?.newValue?.enterpriseName ||
                  selectedBusinessAmendment?.newValue?.enterpriseBusinessName}
              </p>
            </ul>
            <ul className="flex items-center gap-5">
              <p>Company code:</p>
              <p className="font-medium">
                {selectedBusinessAmendment?.newValue?.tin || 'N/A'}
              </p>
            </ul>
            <ul className="flex items-center gap-5">
              <p>Company type:</p>
              <p className="font-medium">
                {capitalizeString(
                  selectedBusinessAmendment?.newValue?.companyType
                )}
              </p>
            </ul>
            <ul className="flex items-center gap-5">
              <p>Company status:</p>
              <p className="font-medium">
                {capitalizeString(
                  selectedBusinessAmendment?.newValue?.applicationStatus ||
                    selectedBusinessAmendment?.oldValue?.applicationStatus
                )}
              </p>
            </ul>
            <ul className="flex items-center gap-5">
              <p>Has articles of association:</p>
              <p className="font-medium">
                {selectedBusinessAmendment?.newValue?.hasArticlesOfAssociation
                  ? 'Yes'
                  : 'No'}
              </p>
            </ul>
            <ul className="flex items-center gap-5">
              <p>Company category:</p>
              <p className="font-medium">
                {capitalizeString(
                  selectedBusinessAmendment?.newValue?.companyCategory
                )}
              </p>
            </ul>
          </menu>
        </section>
      )}
    </main>
  );
};

export default CompanyDetailsAmendmentReview;
