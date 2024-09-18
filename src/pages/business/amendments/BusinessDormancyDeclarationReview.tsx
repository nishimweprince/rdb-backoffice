import { useState } from 'react';
import { BusinessAmendmentRequestSummary } from './BusinessAmendmentReview';
import { RootState } from '@/states/store';
import { useSelector } from 'react-redux';
import BusinessAmendmentNavigation from './BusinessAmendmentNavigation';
import { capitalizeString, formatDate } from '@/helpers/strings.helper';

const BusinessDormancyDeclarationReview = () => {
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
          <menu className="w-full grid grid-cols-2 gap-5">
            <ul className="w-full flex items-center gap-1">
              <p>Dormancy reason: </p>
              <p className="font-medium">
                {capitalizeString(
                  (
                    selectedBusinessAmendment as unknown as {
                      newValue: {
                        dormantReason: string;
                      };
                    }
                  )?.newValue?.dormantReason
                )}
              </p>
            </ul>
            <ul className="w-full flex items-center gap-1">
              <p>Dormancy declaration date: </p>
              <p className="font-medium">
                {formatDate(
                  (
                    selectedBusinessAmendment as unknown as {
                      newValue: {
                        dormantDeclarationDate: string;
                      };
                    }
                  )?.newValue?.dormantDeclarationDate
                )}
              </p>
            </ul>
            <ul className="w-full flex items-center gap-1">
              <p>Dormancy start date: </p>
              <p className="font-medium">
                {formatDate(
                  (
                    selectedBusinessAmendment as unknown as {
                      newValue: {
                        dormantStartDate: string;
                      };
                    }
                  )?.newValue?.dormantStartDate
                )}
              </p>
            </ul>
          </menu>
        </section>
      )}
    </main>
  );
};

export default BusinessDormancyDeclarationReview;
